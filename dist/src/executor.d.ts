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
export declare class CodeExecutor {
    private static instance;
    private tempDir;
    private readonly TIMEOUT;
    private readonly MEMORY_LIMIT;
    private readonly CPU_LIMIT;
    private readonly MAX_OUTPUT;
    private constructor();
    private ensureTempDir;
    static getInstance(): CodeExecutor;
    /**
     * Execute code with timeout protection and resource limits
     * @param code The source code to execute
     * @param language Programming language (javascript, python, java)
     * @param input Standard input for the program
     * @returns ExecutionResult with output, errors, and timing info
     */
    execute(code: string, language: string, input: string): Promise<ExecutionResult>;
    /**
     * Execute code against test cases
     */
    executeTestCases(code: string, language: string, testCases: Array<{
        input: string;
        expectedOutput: string;
    }>, testCaseIds: string[]): Promise<TestCaseResult[]>;
    private getFileExtension;
    private getDockerCommand;
    private executeWithTimeout;
}
//# sourceMappingURL=executor.d.ts.map