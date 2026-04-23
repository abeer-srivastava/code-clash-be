/*
  Warnings:

  - You are about to drop the column `input` on the `Question` table. All the data in the column will be lost.
  - You are about to drop the column `output` on the `Question` table. All the data in the column will be lost.
  - Added the required column `examples` to the `Question` table without a default value. This is not possible if the table is not empty.
  - Added the required column `testCases` to the `Question` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Question" DROP COLUMN "input",
DROP COLUMN "output",
ADD COLUMN     "examples" JSONB NOT NULL,
ADD COLUMN     "starterCode" JSONB,
ADD COLUMN     "testCases" JSONB NOT NULL;
