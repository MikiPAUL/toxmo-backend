-- DropForeignKey
ALTER TABLE "LiveStream" DROP CONSTRAINT "LiveStream_sellerId_fkey";

-- DropForeignKey
ALTER TABLE "Product" DROP CONSTRAINT "Product_sellerId_fkey";

-- DropForeignKey
ALTER TABLE "Seller" DROP CONSTRAINT "Seller_userId_fkey";

-- AlterTable
ALTER TABLE "LiveStream" ALTER COLUMN "expiresAt" SET DEFAULT (now() + '60 minutes'::interval minute);

-- AlterTable
ALTER TABLE "Team" ALTER COLUMN "expireAt" SET DEFAULT (now() + '30 minutes'::interval minute);

-- AddForeignKey
ALTER TABLE "Seller" ADD CONSTRAINT "Seller_id_fkey" FOREIGN KEY ("id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
