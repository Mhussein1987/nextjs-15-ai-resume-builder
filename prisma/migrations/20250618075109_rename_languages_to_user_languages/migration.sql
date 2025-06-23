/*
  Warnings:

  - You are about to drop the column `languages` on the `resumes` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "resumes" DROP COLUMN "languages",
ADD COLUMN     "userLanguages" TEXT[];
