import { exec } from "child_process";
import fs from "fs/promises";
import path from "path";
import { v4 as uuidv4 } from "uuid";
import { execSync } from "child_process";

export interface ExecutionResult {
    success: boolean;
    output: string;
    error?: string;
    time?: number;
    memory?: number;
    timedOut?: boolean;
    status: "SUCCESS" | "ERROR" | "TIMEOUT" | "RUNTIME_ERROR";
}

export interface TestCaseResult {
    testCaseId: string;
    passed: boolean;
    expected: string;
    actual: string;
    error?: string;
}

export class CodeExecutor {
    private static instance: CodeExecutor;
    private tempDir: string;
    private readonly TIMEOUT = 5000; // 5 seconds timeout
    private readonly MEMORY_LIMIT = "512m";
    private readonly CPU_LIMIT = "1";
    private readonly MAX_OUTPUT = 10000; // Max output chars

    private constructor() {
        this.tempDir = path.join(process.cwd(), "temp_submissions");
        this.ensureTempDir();
    }

    private async ensureTempDir() {
        try {
            await fs.mkdir(this.tempDir, { recursive: true });
        } catch (e) {
            console.error("Error creating temp dir", e);
        }
    }

    public static getInstance(): CodeExecutor {
        if (!CodeExecutor.instance) {
            CodeExecutor.instance = new CodeExecutor();
        }
        return CodeExecutor.instance;
    }

    /**
     * Execute code with timeout protection and resource limits
     * @param code The source code to execute
     * @param language Programming language (javascript, python, java)
     * @param input Standard input for the program
     * @returns ExecutionResult with output, errors, and timing info
     */
    public async execute(code: string, language: string, input: string): Promise<ExecutionResult> {
        const id = uuidv4();
        const fileExtension = this.getFileExtension(language);
        const filename = `${id}.${fileExtension}`;
        const filepath = path.join(this.tempDir, filename);

        try {
            // Write code to file
            await fs.writeFile(filepath, code);

            // Get docker command based on language
            const dockerCmd = this.getDockerCommand(language, filepath, input);

            // Execute with timeout
            const result = await this.executeWithTimeout(dockerCmd, filepath);
            return result;
        } catch (e: any) {
            return {
                success: false,
                output: "",
                error: e.message || "Unknown execution error",
                time: 0,
                status: "RUNTIME_ERROR",
            };
        } finally {
            // Cleanup temp file
            await fs.unlink(filepath).catch(() => {});
        }
    }

    /**
     * Execute code against test cases
     */
    public async executeTestCases(
        code: string,
        language: string,
        testCases: Array<{ input: string; expectedOutput: string }>,
        testCaseIds: string[]
    ): Promise<TestCaseResult[]> {
        const results: TestCaseResult[] = [];

        for (let i = 0; i < testCases.length; i++) {
            const testCase = testCases[i];
            if (!testCase) continue;
            const testCaseId = testCaseIds[i] || `test_${i}`;

            try {
                const execResult = await this.execute(code, language, testCase.input);
                const actualOutput = execResult.output.trim();
                const expectedOutput = testCase.expectedOutput.trim();
                const passed = actualOutput === expectedOutput;

                const result: TestCaseResult = {
                    testCaseId,
                    passed,
                    expected: expectedOutput,
                    actual: actualOutput,
                };

                if (execResult.error) {
                    result.error = execResult.error;
                }

                results.push(result);
            } catch (e: any) {
                const result: TestCaseResult = {
                    testCaseId,
                    passed: false,
                    expected: testCase.expectedOutput,
                    actual: "",
                };

                if (e.message) {
                    result.error = e.message;
                }

                results.push(result);
            }
        }

        return results;
    }

    private getFileExtension(language: string): string {
        switch (language.toLowerCase()) {
            case "python":
            case "py":
                return "py";
            case "java":
                return "java";
            case "cpp":
            case "c++":
                return "cpp";
            case "javascript":
            case "js":
            default:
                return "js";
        }
    }

    private getDockerCommand(language: string, filepath: string, input: string): string {
        const dockerBase = `docker run --rm -v ${filepath}:/app/code --network none --memory ${this.MEMORY_LIMIT} --cpus ${this.CPU_LIMIT}`;

        let runCommand = "";
        switch (language.toLowerCase()) {
            case "python":
            case "py":
                runCommand = `${dockerBase} python:3.11-alpine python /app/code`;
                break;
            case "java":
                // Wrap Java code in a class
                runCommand = `${dockerBase} openjdk:17-alpine java /app/code`;
                break;
            case "cpp":
            case "c++":
                runCommand = `${dockerBase} gcc:latest /app/code`;
                break;
            case "javascript":
            case "js":
            default:
                runCommand = `${dockerBase} node:18-alpine node /app/code`;
                break;
        }

        // Add input via stdin if provided
        if (input) {
            runCommand += ` << 'EOF'\n${input}\nEOF`;
        }

        return runCommand;
    }

    private executeWithTimeout(command: string, filepath: string): Promise<ExecutionResult> {
        return new Promise((resolve) => {
            const startTime = Date.now();
            let timedOut = false;

            const timeout = setTimeout(() => {
                timedOut = true;
                resolve({
                    success: false,
                    output: "",
                    error: "Execution timeout - code took longer than 5 seconds",
                    time: this.TIMEOUT,
                    timedOut: true,
                    status: "TIMEOUT",
                });
            }, this.TIMEOUT);

            try {
                exec(command, { maxBuffer: this.MAX_OUTPUT * 10 }, async (error, stdout, stderr) => {
                    clearTimeout(timeout);

                    if (timedOut) return; // Timeout already handled

                    const endTime = Date.now();
                    const executionTime = endTime - startTime;

                    if (error && error.code !== 0) {
                        resolve({
                            success: false,
                            output: stdout.slice(0, this.MAX_OUTPUT),
                            error: stderr.slice(0, this.MAX_OUTPUT) || error.message,
                            time: executionTime,
                            status: "ERROR",
                        });
                    } else {
                        resolve({
                            success: true,
                            output: stdout.slice(0, this.MAX_OUTPUT),
                            time: executionTime,
                            status: "SUCCESS",
                        });
                    }
                });
            } catch (e: any) {
                clearTimeout(timeout);
                resolve({
                    success: false,
                    output: "",
                    error: e.message,
                    time: Date.now() - startTime,
                    status: "RUNTIME_ERROR",
                });
            }
        });
    }
}
