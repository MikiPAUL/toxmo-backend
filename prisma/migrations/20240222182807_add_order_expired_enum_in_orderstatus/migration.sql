-- AlterEnum
ALTER TYPE "OrderStatus" ADD VALUE 'orderExpired';

-- AlterTable
ALTER TABLE "Category" ALTER COLUMN "createdAt" SET DEFAULT NOW();

-- AlterTable
ALTER TABLE "LiveStream" ALTER COLUMN "expiresAt" SET DEFAULT (now() + '60 minutes'::interval minute),
ALTER COLUMN "createdAt" SET DEFAULT NOW();

-- AlterTable
ALTER TABLE "Order" ALTER COLUMN "createdAt" SET DEFAULT NOW();

-- AlterTable
ALTER TABLE "Product" ALTER COLUMN "createdAt" SET DEFAULT NOW();

-- AlterTable
ALTER TABLE "Relationship" ALTER COLUMN "createdAt" SET DEFAULT NOW();

-- AlterTable
ALTER TABLE "Review" ALTER COLUMN "createdAt" SET DEFAULT NOW();

-- AlterTable
ALTER TABLE "Seller" ALTER COLUMN "createdAt" SET DEFAULT NOW();

-- AlterTable
ALTER TABLE "Team" ALTER COLUMN "createdAt" SET DEFAULT NOW(),
ALTER COLUMN "expireAt" SET DEFAULT (now() + '30 minutes'::interval minute);

-- AlterTable
ALTER TABLE "TeamMember" ALTER COLUMN "createdAt" SET DEFAULT NOW();

-- AlterTable
ALTER TABLE "User" ALTER COLUMN "createdAt" SET DEFAULT NOW();
