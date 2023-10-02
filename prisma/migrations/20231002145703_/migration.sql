-- AlterEnum
ALTER TYPE "OrderStatus" ADD VALUE 'teamJoined';

-- AlterTable
ALTER TABLE "Order" ALTER COLUMN "expireAt" SET DEFAULT now() + interval '1' day;
