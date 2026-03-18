import axios from "axios";
import { execSync } from "child_process";
import fs from "fs";
import path from "path";
import { v4 as uuidv4 } from "uuid";
export class CodeExecutor {
    constructor() {
        this.JUDGE0_URL = process.env.JUDGE0_API_URL || "https://ce.judge0.com";
        this.JUDGE0_KEY = process.env.JUDGE0_API_KEY;
        this.JUDGE0_HOST = process.env.JUDGE0_API_HOST || "ce.judge0.com";
    }
    static getInstance() {
        if (!CodeExecutor.instance) {
            CodeExecutor.instance = new CodeExecutor();
        }
        return CodeExecutor.instance;
    }
    getLanguageId(lang) {
        switch (lang.toLowerCase()) {
            case "python":
            case "py":
            case "python3": return 71;
            case "java": return 62;
            case "cpp":
            case "c++": return 54;
            case "javascript":
            case "js":
            case "nodejs": return 63;
            case "typescript":
            case "ts": return 74;
            default: return 63;
        }
    }
    wrapCode(code, language) {
        const lang = language.toLowerCase();
        // If the code already contains a driver-like structure (e.g., fs.readFileSync, sys.stdin, main function)
        // we might not want to wrap it, but for a strict LeetCode experience, we assume the user provides ONLY the function.
        // For now, we'll wrap it if it doesn't look like it already has the driver.
        if (lang === 'javascript' || lang === 'js' || lang === 'nodejs') {
            if (code.includes('require(\'fs\')') || code.includes('process.stdin'))
                return code;
            // Extract function name from code to call it. 
            // Default to twoSum if not found, but we should ideally know the function name from question data.
            // For this project, we'll use a generic wrapper or assume standard names for now.
            // A better way is to have the driver code in the database and replace a placeholder.
            return code; // Fallback to raw code if we can't reliably wrap yet
        }
        return code;
    }
    toBase64(str) {
        return Buffer.from(str || "").toString("base64");
    }
    fromBase64(str) {
        return Buffer.from(str || "", "base64").toString("utf8");
    }
    /**
     * Executes multiple test cases in batch for maximum performance
     */
    async executeTestCases(code, language, testCases) {
        if (!testCases.length)
            return [];
        const languageId = this.getLanguageId(language);
        const headers = {
            "content-type": "application/json",
        };
        if (this.JUDGE0_KEY && !this.JUDGE0_KEY.includes("your_")) {
            headers["x-rapidapi-key"] = this.JUDGE0_KEY;
            headers["x-rapidapi-host"] = this.JUDGE0_HOST;
        }
        try {
            console.log(`[EXECUTOR] Batch executing ${testCases.length} cases for ${language} at ${this.JUDGE0_URL}`);
            const wrappedCode = this.wrapCode(code, language);
            // Prepare the batch payload
            const submissions = testCases.map(tc => ({
                source_code: this.toBase64(wrappedCode),
                language_id: languageId,
                stdin: this.toBase64(tc.input),
                expected_output: this.toBase64(tc.expectedOutput)
            }));
            // 1. Submit the batch
            const response = await axios.post(`${this.JUDGE0_URL}/submissions/batch?base64_encoded=true`, { submissions }, { headers });
            const tokens = response.data.map((s) => s.token);
            if (!tokens || tokens.length === 0) {
                throw new Error("No tokens received from Judge0");
            }
            console.log(`[EXECUTOR] Received tokens: ${tokens.join(", ")}`);
            // 2. Poll for results
            let results = [];
            let completed = false;
            let attempts = 0;
            const maxAttempts = 20;
            while (!completed && attempts < maxAttempts) {
                attempts++;
                await new Promise(resolve => setTimeout(resolve, 1000));
                const pollResponse = await axios.get(`${this.JUDGE0_URL}/submissions/batch?tokens=${tokens.join(",")}&base64_encoded=true&fields=token,stdout,stderr,status,time,memory,compile_output,message`, { headers });
                results = pollResponse.data.submissions;
                // Status ID < 3 means In Queue or Processing
                completed = results.every((s) => s.status && s.status.id >= 3);
                if (!completed) {
                    console.log(`[EXECUTOR] Polling attempt ${attempts}/${maxAttempts}: some submissions still processing...`);
                }
            }
            // 3. Map results to our format
            return results.map((data, index) => {
                const tc = testCases[index];
                if (!tc) {
                    console.error(`[EXECUTOR] Test case at index ${index} not found in original request`);
                    return {
                        testCaseId: `test_${index + 1}`,
                        passed: false,
                        expected: "N/A",
                        actual: "N/A",
                        error: "Test case configuration error",
                        statusDescription: "Configuration Error"
                    };
                }
                const statusId = data.status?.id;
                // 3 = Accepted
                const passed = statusId === 3;
                const actual = this.fromBase64(data.stdout || "");
                const stderr = this.fromBase64(data.stderr || "");
                const compileOutput = this.fromBase64(data.compile_output || "");
                return {
                    testCaseId: tc.id || `test_${index + 1}`,
                    passed,
                    expected: tc.expectedOutput,
                    actual: actual,
                    error: stderr || compileOutput || data.message || undefined,
                    time: data.time ? parseFloat(data.time) * 1000 : 0,
                    memory: data.memory,
                    statusDescription: data.status?.description
                };
            });
        }
        catch (error) {
            console.error("[EXECUTOR] Batch execution failed:", error.response?.data || error.message);
            // Fallback for JS if batch fails
            if (language.toLowerCase() === 'javascript' || language.toLowerCase() === 'js') {
                return this.executeLocallyBatch(code, testCases);
            }
            throw error;
        }
    }
    async executeLocallyBatch(code, testCases) {
        const results = [];
        for (let i = 0; i < testCases.length; i++) {
            const tc = testCases[i];
            const id = uuidv4();
            const tempFile = path.join(process.cwd(), `temp_${id}.cjs`);
            try {
                fs.writeFileSync(tempFile, code);
                const output = execSync(`node ${tempFile}`, {
                    input: tc.input,
                    encoding: 'utf8',
                    timeout: 5000
                });
                results.push({
                    testCaseId: tc.id || `test_${i + 1}`,
                    passed: output.trim() === tc.expectedOutput.trim(),
                    expected: tc.expectedOutput,
                    actual: output,
                    statusDescription: "Accepted"
                });
            }
            catch (e) {
                results.push({
                    testCaseId: tc.id || `test_${i + 1}`,
                    passed: false,
                    expected: tc.expectedOutput,
                    actual: e.stdout || "",
                    error: e.stderr || e.message,
                    statusDescription: "Runtime Error"
                });
            }
            finally {
                if (fs.existsSync(tempFile))
                    fs.unlinkSync(tempFile);
            }
        }
        return results;
    }
}
//# sourceMappingURL=executor.js.map