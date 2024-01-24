-- AlterTable
ALTER TABLE "Team" ALTER COLUMN "expireAt" SET DEFAULT (now() + '30 minutes'::interval minute);
