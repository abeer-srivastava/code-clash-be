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
    wrapCode(code, language, question) {
        const lang = language.toLowerCase();
        // Check if the code already has driver logic
        const hasDriver = ((lang === 'javascript' || lang === 'js' || lang === 'nodejs') && (code.includes('require(\'fs\')') || code.includes('process.stdin')) ||
            (lang === 'python' || lang === 'py') && (code.includes('import sys') || code.includes('sys.stdin')) ||
            (lang === 'cpp' || lang === 'c++') && (code.includes('int main') || code.includes('std::cin')) ||
            (lang === 'java') && (code.includes('public static void main')));
        if (hasDriver)
            return code;
        // If no driver found, try to use the starterCode from the database as a template
        if (question?.starterCode && question.starterCode[lang]) {
            const starter = question.starterCode[lang];
            // For languages like JavaScript, Python, we can search for a placeholder to inject user code
            if (lang === 'javascript' || lang === 'js' || lang === 'nodejs') {
                const placeholder = "// Write logic here";
                if (starter.includes(placeholder)) {
                    return starter.replace(placeholder, code);
                }
            }
            else if (lang === 'python' || lang === 'py') {
                const placeholder = "# Write logic here";
                if (starter.includes(placeholder)) {
                    // Python is sensitive to indentation. We assume the function is defined at top level.
                    // We'll replace the 'pass' and the placeholder.
                    return starter.replace(placeholder + "\n    pass", code);
                }
            }
            else if (lang === 'cpp' || lang === 'c++') {
                const placeholder = "// Write logic here";
                if (starter.includes(placeholder)) {
                    return starter.replace(placeholder, code);
                }
            }
            else if (lang === 'java') {
                const placeholder = "// Write logic here";
                if (starter.includes(placeholder)) {
                    return starter.replace(placeholder, code);
                }
            }
            // If we can't find a placeholder but have starter code, 
            // the user might have provided the full code or the starter is simple.
            // As a last resort, just return the code.
            return code;
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
    async executeTestCases(code, language, testCases, question) {
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
            const wrappedCode = this.wrapCode(code, language, question);
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
            // 3. Map results to our format and check for system failures
            const mappedResults = results.map((data, index) => {
                const tc = testCases[index];
                if (!tc)
                    return null;
                const statusId = data.status?.id;
                const passed = statusId === 3;
                const actual = this.fromBase64(data.stdout || "");
                const stderr = this.fromBase64(data.stderr || "");
                const compileOutput = this.fromBase64(data.compile_output || "");
                const message = data.message || "";
                // Check for the specific Judge0/Isolate "No such file" or cgroup errors
                const isSystemError = message.includes("rb_sysopen") ||
                    message.includes("/box/") ||
                    stderr.includes("No such file or directory") ||
                    (data.status?.description === "Internal Error");
                return {
                    testCaseId: tc.id || `test_${index + 1}`,
                    passed,
                    expected: tc.expectedOutput,
                    actual: actual,
                    error: stderr || compileOutput || message || undefined,
                    time: data.time ? parseFloat(data.time) * 1000 : 0,
                    memory: data.memory,
                    statusDescription: data.status?.description,
                    isSystemError
                };
            }).filter(r => r !== null);
            // If any result shows a Judge0 system failure, trigger the local fallback immediately
            const hasSystemFailure = mappedResults.some(r => r?.isSystemError);
            const lang = language.toLowerCase();
            const supportedFallbackLangs = ['javascript', 'js', 'python', 'py', 'python3', 'cpp', 'c++'];
            if (hasSystemFailure && supportedFallbackLangs.includes(lang)) {
                console.warn(`[EXECUTOR] Judge0 internal system failure detected. Falling back to local execution for ${language}.`);
                return this.executeLocallyBatch(code, testCases, question, language);
            }
            else if (hasSystemFailure) {
                console.warn(`[EXECUTOR] Judge0 failed and no local fallback available for ${language}.`);
                return [{
                        testCaseId: testCases[0]?.id || "test_1",
                        passed: false,
                        expected: "",
                        actual: "",
                        error: `System Error: Sandbox execution failed. Local fallback not supported for ${language}.`,
                        statusDescription: "Internal Error"
                    }];
            }
            return mappedResults;
        }
        catch (error) {
            console.error("[EXECUTOR] Batch execution failed:", error.response?.data || error.message);
            const lang = language.toLowerCase();
            const supportedFallbackLangs = ['javascript', 'js', 'python', 'py', 'python3', 'cpp', 'c++'];
            if (supportedFallbackLangs.includes(lang)) {
                return this.executeLocallyBatch(code, testCases, question, language);
            }
            throw error;
        }
    }
    async executeLocallyBatch(code, testCases, question, executionLanguage) {
        const results = [];
        const lang = (executionLanguage || "javascript").toLowerCase();
        const wrappedCode = this.wrapCode(code, lang, question);
        for (let i = 0; i < testCases.length; i++) {
            const tc = testCases[i];
            const id = uuidv4();
            const tempDir = fs.existsSync(path.join(process.cwd(), "temp_submissions"))
                ? path.join(process.cwd(), "temp_submissions")
                : process.cwd();
            let tempFile = path.join(tempDir, `local_${id}.cjs`);
            let command = `node ${tempFile}`;
            if (lang === "python" || lang === "py" || lang === "python3") {
                tempFile = path.join(tempDir, `local_${id}.py`);
                command = `python3 ${tempFile}`;
            }
            else if (lang === "cpp" || lang === "c++") {
                tempFile = path.join(tempDir, `local_${id}.cpp`);
                const executable = path.join(tempDir, `local_${id}.out`);
                command = executable;
                try {
                    fs.writeFileSync(tempFile, wrappedCode);
                    execSync(`g++ ${tempFile} -o ${executable}`, { timeout: 10000 });
                }
                catch (e) {
                    results.push({
                        testCaseId: tc.id || `test_${i + 1}`,
                        passed: false,
                        expected: tc.expectedOutput,
                        actual: "",
                        error: e.stderr?.toString() || e.message || "Compilation Error",
                        statusDescription: "Compile Error"
                    });
                    if (fs.existsSync(tempFile))
                        fs.unlinkSync(tempFile);
                    continue;
                }
            }
            try {
                if (lang !== "cpp" && lang !== "c++") {
                    fs.writeFileSync(tempFile, wrappedCode);
                }
                const output = execSync(command, {
                    input: tc.input,
                    encoding: 'utf8',
                    timeout: 5000
                });
                const actualOutput = output.trim();
                const expectedOutput = tc.expectedOutput.trim();
                results.push({
                    testCaseId: tc.id || `test_${i + 1}`,
                    passed: actualOutput === expectedOutput,
                    expected: tc.expectedOutput,
                    actual: actualOutput,
                    statusDescription: "Accepted"
                });
            }
            catch (e) {
                results.push({
                    testCaseId: tc.id || `test_${i + 1}`,
                    passed: false,
                    expected: tc.expectedOutput,
                    actual: e.stdout?.toString() || "",
                    error: e.stderr?.toString() || e.message,
                    statusDescription: e.message?.includes("ETIMEDOUT") ? "Time Limit Exceeded" : "Runtime Error"
                });
            }
            finally {
                if (fs.existsSync(tempFile)) {
                    try {
                        fs.unlinkSync(tempFile);
                    }
                    catch (err) { }
                }
                if ((lang === "cpp" || lang === "c++") && fs.existsSync(path.join(tempDir, `local_${id}.out`))) {
                    try {
                        fs.unlinkSync(path.join(tempDir, `local_${id}.out`));
                    }
                    catch (err) { }
                }
            }
        }
        return results;
    }
}
//# sourceMappingURL=executor.js.map