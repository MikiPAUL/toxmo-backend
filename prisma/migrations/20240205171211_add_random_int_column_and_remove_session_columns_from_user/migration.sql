/*
  Warnings:

  - You are about to drop the column `sessionToken` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `tokenExpireAt` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Team" ALTER COLUMN "expireAt" SET DEFAULT (now() + '30 minutes'::interval minute);

-- AlterTable
ALTER TABLE "User" DROP COLUMN "sessionToken",
DROP COLUMN "tokenExpireAt",
ADD COLUMN     "randomInt" INTEGER NOT NULL DEFAULT 0;
