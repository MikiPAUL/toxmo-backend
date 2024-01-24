/*
  Warnings:

  - You are about to drop the column `other_details` on the `Product` table. All the data in the column will be lost.
  - You are about to drop the column `stock_quantity` on the `Product` table. All the data in the column will be lost.
  - You are about to drop the column `team_price` on the `Product` table. All the data in the column will be lost.
  - You are about to drop the column `team_size` on the `Product` table. All the data in the column will be lost.
  - You are about to drop the column `otp_expire_at` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `phone_number` on the `User` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[phoneNumber]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `stockQuantity` to the `Product` table without a default value. This is not possible if the table is not empty.
  - Added the required column `teamPrice` to the `Product` table without a default value. This is not possible if the table is not empty.
  - Added the required column `teamSize` to the `Product` table without a default value. This is not possible if the table is not empty.
  - Added the required column `phoneNumber` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "User_phone_number_key";

-- AlterTable
ALTER TABLE "Product" DROP COLUMN "other_details",
DROP COLUMN "stock_quantity",
DROP COLUMN "team_price",
DROP COLUMN "team_size",
ADD COLUMN     "otherDetails" JSONB,
ADD COLUMN     "stockQuantity" INTEGER NOT NULL,
ADD COLUMN     "teamPrice" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "teamSize" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "User" DROP COLUMN "otp_expire_at",
DROP COLUMN "phone_number",
ADD COLUMN     "otpExpireAt" TIMESTAMP(3),
ADD COLUMN     "phoneNumber" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "User_phoneNumber_key" ON "User"("phoneNumber");
