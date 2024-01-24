/*
  Warnings:

  - Added the required column `stock_quantity` to the `Product` table without a default value. This is not possible if the table is not empty.
  - Added the required column `team_price` to the `Product` table without a default value. This is not possible if the table is not empty.
  - Added the required column `team_size` to the `Product` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Product" ADD COLUMN     "stock_quantity" INTEGER NOT NULL,
ADD COLUMN     "team_price" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "team_size" INTEGER NOT NULL;
