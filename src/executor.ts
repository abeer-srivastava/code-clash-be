import axios from "axios";
import { execSync } from "child_process";
import fs from "fs";
import path from "path";
import { v4 as uuidv4 } from "uuid";

export interface ExecutionResult {
    success: boolean;
    output: string;
    error?: string;
    time?: number;
    status: "SUCCESS" | "ERROR" | "TIMEOUT" | "RUNTIME_ERROR";
}

export interface TestCaseResult {
    testCaseId: string;
    passed: boolean;
    expected: string;
    actual: string;
    error?: string;
    time?: number | undefined;
}

export class CodeExecutor {
    private static instance: CodeExecutor;
    
    // Default to RapidAPI Judge0 URL if not provided
    private readonly JUDGE0_URL = process.env.JUDGE0_API_URL || "https://judge0-ce.p.rapidapi.com";
    private readonly JUDGE0_KEY = process.env.JUDGE0_API_KEY;
    private readonly JUDGE0_HOST = process.env.JUDGE0_API_HOST || "judge0-ce.p.rapidapi.com";

    private constructor() {}

    public static getInstance(): CodeExecutor {
        if (!CodeExecutor.instance) {
            CodeExecutor.instance = new CodeExecutor();
        }
        return CodeExecutor.instance;
    }

    /**
     * Judge0 Language IDs
     * Common IDs (adjust based on your Judge0 version/provider)
     */
    private getLanguageId(lang: string): number {
        switch (lang.toLowerCase()) {
            case "python":
            case "py":
            case "python3":
                return 71; // Python (3.8.1)
            case "java":
                return 62; // Java (OpenJDK 13.0.1)
            case "cpp":
            case "c++":
                return 54; // C++ (GCC 9.2.0)
            case "javascript":
            case "js":
            case "nodejs":
                return 63; // Node.js (12.14.0)
            case "typescript":
            case "ts":
                return 74; // TypeScript (3.7.4)
            default:
                return 63; // Default to Node.js
        }
    }

    private executeLocally(code: string, input: string): ExecutionResult {
        const id = uuidv4();
        // Use .cjs to bypass ESM "require is not defined" error in a "type": "module" project
        const tempFile = path.join(process.cwd(), `temp_${id}.cjs`);
        try {
            fs.writeFileSync(tempFile, code);
            const output = execSync(`node ${tempFile}`, { 
                input, 
                encoding: 'utf8',
                timeout: 5000 
            });
            return {
                success: true,
                output: output,
                status: "SUCCESS"
            };
        } catch (e: any) {
            return {
                success: false,
                output: e.stdout || "",
                error: e.stderr || e.message,
                status: "RUNTIME_ERROR"
            };
        } finally {
            if (fs.existsSync(tempFile)) fs.unlinkSync(tempFile);
        }
    }

    public async execute(code: string, language: string, input: string): Promise<ExecutionResult> {
        const languageId = this.getLanguageId(language);
        
        // Use Judge0 if URL is provided (it's provided by default or via env)
        if (this.JUDGE0_URL) {
            try {
                const headers: Record<string, string> = {
                    "content-type": "application/json",
                };
                
                let isRapidAPI = false;
                // Add RapidAPI headers only if key is provided and not a placeholder
                if (this.JUDGE0_KEY && !this.JUDGE0_KEY.includes("your_")) {
                    headers["x-rapidapi-key"] = this.JUDGE0_KEY;
                    if (this.JUDGE0_HOST) {
                        headers["x-rapidapi-host"] = this.JUDGE0_HOST;
                    }
                    isRapidAPI = true;
                }

                console.log(`[EXECUTOR] Executing ${language} (ID: ${languageId}) via ${isRapidAPI ? 'RapidAPI' : 'Local Judge0'} at ${this.JUDGE0_URL}`);


                const response = await axios.post(
                    `${this.JUDGE0_URL}/submissions?base64_encoded=false&wait=true`,
                    {
                        source_code: code,
                        language_id: languageId,
                        stdin: input,
                    },
                    { headers }
                );

                const data = response.data;
                const status = data.status.id;
                
                // Judge0 Status IDs: 3 = Accepted, 4 = Wrong Answer, 5 = Time Limit Exceeded, 6 = Compilation Error, 7-12 = Runtime Error
                const success = status === 3;
                let executionStatus: ExecutionResult["status"] = "SUCCESS";
                
                if (status === 5) executionStatus = "TIMEOUT";
                else if (status === 6) executionStatus = "ERROR";
                else if (status > 6) executionStatus = "RUNTIME_ERROR";

                return {
                    success: success,
                    output: data.stdout || "",
                    error: data.stderr || data.compile_output || data.message || (success ? "" : "Execution Failed (No error message provided)"),
                    time: data.time ? parseFloat(data.time) * 1000 : 0,
                    status: executionStatus,
                };
            } catch (error: any) {
                const errorMsg = error.response?.data?.message || error.response?.data?.error || error.message;
                console.warn("[EXECUTOR] Judge0 API failed:", errorMsg);
            }
        }

        // Fallback to local execution for JS if API fails or keys missing
        if (language.toLowerCase() === 'javascript' || language.toLowerCase() === 'js') {
            console.log("[EXECUTOR] Falling back to local execution for JavaScript");
            return this.executeLocally(code, input);
        }

        return {
            success: false,
            output: "",
            error: "Execution Failed: Judge0 API connection failed and no local runner available for this language.",
            status: "ERROR",
        };
    }

    public async executeTestCases(
        code: string,
        language: string,
        testCases: Array<{ input: string; expectedOutput: string }>
    ): Promise<TestCaseResult[]> {
        const results: TestCaseResult[] = [];

        for (let i = 0; i < testCases.length; i++) {
            const tc = testCases[i];
            if (!tc) continue;

            const execResult = await this.execute(code, language, tc.input);
            
            const actual = (execResult.output || "").trim();
            const expected = (tc.expectedOutput || "").trim();
            const passed = actual === expected && execResult.success;

            results.push({
                testCaseId: `test_${i + 1}`,
                passed,
                expected,
                actual,
                time: execResult.time,
                ...(execResult.error ? { error: execResult.error } : {})
            });
        }

        return results;
    }
}
