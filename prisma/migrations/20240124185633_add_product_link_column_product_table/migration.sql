-- AlterTable
ALTER TABLE "Product" ADD COLUMN     "imageLink" TEXT;

-- AlterTable
ALTER TABLE "Team" ALTER COLUMN "teamStatus" SET DEFAULT 'teamCreated',
ALTER COLUMN "expireAt" SET DEFAULT (now() + '30 minutes'::interval minute);
