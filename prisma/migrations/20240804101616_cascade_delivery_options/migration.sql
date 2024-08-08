-- DropForeignKey
ALTER TABLE "DeliveryOption" DROP CONSTRAINT "DeliveryOption_sellerId_fkey";

-- AddForeignKey
ALTER TABLE "DeliveryOption" ADD CONSTRAINT "DeliveryOption_sellerId_fkey" FOREIGN KEY ("sellerId") REFERENCES "Seller"("id") ON DELETE CASCADE ON UPDATE CASCADE;
