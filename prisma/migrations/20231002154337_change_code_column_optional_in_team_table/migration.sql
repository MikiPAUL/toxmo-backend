-- AlterTable
ALTER TABLE "Order" ALTER COLUMN "expireAt" SET DEFAULT now() + interval '1' day;

-- AlterTable
ALTER TABLE "Team" ALTER COLUMN "code" DROP NOT NULL,
ALTER COLUMN "teamStatus" SET DEFAULT 'teamConfirmed';
