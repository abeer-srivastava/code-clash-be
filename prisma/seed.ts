import pkg from '@prisma/client';
const { PrismaClient } = pkg;

const prisma = new PrismaClient();

async function main() {
  const questions = [
    {
      title: "Two Sum",
      prompt: "Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target. You may assume that each input would have exactly one solution.",
      difficulty: "EASY",
      examples: [
        { input: "2 7 11 15\n9", output: "[0,1]", explanation: "Because nums[0] + nums[1] == 9." },
        { input: "3 2 4\n6", output: "[1,2]", explanation: "Because nums[1] + nums[2] == 6." }
      ],
      testCases: [
        { input: "2 7 11 15\n9", expectedOutput: "[0,1]", isHidden: false },
        { input: "3 2 4\n6", expectedOutput: "[1,2]", isHidden: false },
        { input: "3 3\n6", expectedOutput: "[0,1]", isHidden: true },
        { input: "1 2 3 4 5\n9", expectedOutput: "[3,4]", isHidden: true }
      ],
      starterCode: {
        javascript: `function twoSum(nums, target) {\n  // Write logic here\n}\n\n// Driver Code\nconst fs = require('fs');\nconst input = fs.readFileSync(0, 'utf8').split('\\n');\n// Robust split by space or comma and filter empty strings\nconst nums = input[0].trim().split(/[\\s,]+/).map(Number);\nconst target = parseInt(input[1]);\nconsole.log(JSON.stringify(twoSum(nums, target)));`,
        python: `import json\nimport sys\n\ndef twoSum(nums, target):\n    # Write logic here\n    pass\n\n# Driver Code\nlines = sys.stdin.readlines()\nif not lines: sys.exit(0)\nnums = [int(x) for x in lines[0].replace(',', ' ').split()]\ntarget = int(lines[1])\nprint(json.dumps(twoSum(nums, target)))`,
        cpp: `#include <iostream>\n#include <vector>\n#include <sstream>\n#include <string>\n\nstd::vector<int> twoSum(std::vector<int>& nums, int target) {\n    // Write logic here\n    return {};\n}\n\nint main() {\n    std::string line;\n    std::getline(std::cin, line);\n    std::stringstream ss(line);\n    int val, target;\n    std::vector<int> nums;\n    while(ss >> val) nums.push_back(val);\n    std::cin >> target;\n    std::vector<int> res = twoSum(nums, target);\n    if(res.size() >= 2) std::cout << "[" << res[0] << "," << res[1] << "]" << std::endl;\n    return 0;\n}`,
        java: `import java.util.*;\n\npublic class Main {\n    public static int[] twoSum(int[] nums, int target) {\n        // Write logic here\n        return new int[]{0, 0};\n    }\n\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        if(!sc.hasNextLine()) return;\n        String[] parts = sc.nextLine().trim().split("[\\\\s,]+");\n        int[] nums = new int[parts.length];\n        for(int i=0; i<parts.length; i++) nums[i] = Integer.parseInt(parts[i]);\n        if(!sc.hasNextInt()) return;\n        int target = sc.nextInt();\n        int[] res = twoSum(nums, target);\n        System.out.println("[" + res[0] + "," + res[1] + "]");\n    }\n}`
      }
    },
    {
      title: "Palindrome Number",
      prompt: "Given an integer x, return true if x is a palindrome, and false otherwise.",
      difficulty: "EASY",
      examples: [
        { input: "121", output: "true", explanation: "121 reads as 121 from left to right and from right to left." },
        { input: "-121", output: "false", explanation: "From left to right, it reads -121. From right to left, it becomes 121-. Therefore it is not a palindrome." }
      ],
      testCases: [
        { input: "121", expectedOutput: "true", isHidden: false },
        { input: "-121", expectedOutput: "false", isHidden: false },
        { input: "10", expectedOutput: "false", isHidden: true },
        { input: "0", expectedOutput: "true", isHidden: true }
      ],
      starterCode: {
        javascript: `function isPalindrome(x) {\n  // Write logic here\n}\n\nconst fs = require('fs');\nconst input = fs.readFileSync(0, 'utf8').trim();\nif (input === '') process.exit(0);\nconst x = parseInt(input);\nconsole.log(isPalindrome(x));`,
        python: `import sys\n\ndef isPalindrome(x):\n    # Write logic here\n    pass\n\ninput_data = sys.stdin.read().strip()\nif not input_data: sys.exit(0)\nx = int(input_data)\nprint(str(isPalindrome(x)).lower())`,
        cpp: `#include <iostream>\n\nbool isPalindrome(int x) {\n    // Write logic here\n    return false;\n}\n\nint main() {\n    int x;\n    if(!(std::cin >> x)) return 0;\n    std::cout << (isPalindrome(x) ? "true" : "false") << std::endl;\n    return 0;\n}`,
        java: `import java.util.*;\n\npublic class Main {\n    public static boolean isPalindrome(int x) {\n        // Write logic here\n        return false;\n    }\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        if(sc.hasNextInt()) {\n            System.out.println(isPalindrome(sc.nextInt()));\n        }\n    }\n}`
      }
    }
  ];

  console.log('Clearing old questions...');
  await (prisma.question as any).deleteMany({});
  
  console.log('Seeding questions with starter code...');
  for (const q of questions) {
    await (prisma.question as any).create({
      data: q
    });
  }
  console.log('Seeding completed.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
