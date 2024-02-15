/*
  Warnings:

  - You are about to drop the column `userId` on the `Seller` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "Seller_userId_key";

-- AlterTable
ALTER TABLE "LiveStream" ALTER COLUMN "expiresAt" SET DEFAULT (now() + '60 minutes'::interval minute);

-- AlterTable
ALTER TABLE "Seller" DROP COLUMN "userId",
ALTER COLUMN "id" DROP DEFAULT;
DROP SEQUENCE "Seller_id_seq";

-- AlterTable
ALTER TABLE "Team" ALTER COLUMN "expireAt" SET DEFAULT (now() + '30 minutes'::interval minute);
