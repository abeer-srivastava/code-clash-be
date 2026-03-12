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
export declare class CodeExecutor {
    private static instance;
    private readonly JUDGE0_URL;
    private readonly JUDGE0_KEY;
    private readonly JUDGE0_HOST;
    private constructor();
    static getInstance(): CodeExecutor;
    /**
     * Judge0 Language IDs
     * Common IDs (adjust based on your Judge0 version/provider)
     */
    private getLanguageId;
    private executeLocally;
    execute(code: string, language: string, input: string): Promise<ExecutionResult>;
    executeTestCases(code: string, language: string, testCases: Array<{
        input: string;
        expectedOutput: string;
    }>): Promise<TestCaseResult[]>;
}
//# sourceMappingURL=executor.d.ts.map