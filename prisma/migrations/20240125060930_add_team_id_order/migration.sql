-- AlterTable
ALTER TABLE "Order" ADD COLUMN     "teamId" INTEGER;

-- AlterTable
ALTER TABLE "Team" ALTER COLUMN "expireAt" SET DEFAULT (now() + '30 minutes'::interval minute);

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "Team"("id") ON DELETE SET NULL ON UPDATE CASCADE;
