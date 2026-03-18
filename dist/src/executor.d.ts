/**
 * Robust execution result for a single test case
 */
export interface ExecutionResult {
    success: boolean;
    output: string;
    error?: string;
    time?: number;
    memory?: number;
    status: "SUCCESS" | "ERROR" | "TIMEOUT" | "RUNTIME_ERROR" | "COMPILE_ERROR";
    statusDescription?: string;
}
export interface TestCaseResult {
    testCaseId: string;
    passed: boolean;
    expected: string;
    actual: string;
    error?: string;
    time?: number;
    memory?: number;
    statusDescription?: string;
}
export declare class CodeExecutor {
    private static instance;
    private readonly JUDGE0_URL;
    private readonly JUDGE0_KEY;
    private readonly JUDGE0_HOST;
    private constructor();
    static getInstance(): CodeExecutor;
    private getLanguageId;
    private wrapCode;
    private toBase64;
    private fromBase64;
    /**
     * Executes multiple test cases in batch for maximum performance
     */
    executeTestCases(code: string, language: string, testCases: Array<{
        input: string;
        expectedOutput: string;
        id?: string;
    }>): Promise<TestCaseResult[]>;
    private executeLocallyBatch;
}
//# sourceMappingURL=executor.d.ts.map