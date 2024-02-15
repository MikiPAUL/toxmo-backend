-- AlterTable
ALTER TABLE "LiveStream" ADD COLUMN     "description" TEXT,
ADD COLUMN     "thumbnail" TEXT,
ALTER COLUMN "expiresAt" SET DEFAULT (now() + '60 minutes'::interval minute);

-- AlterTable
ALTER TABLE "Team" ALTER COLUMN "expireAt" SET DEFAULT (now() + '30 minutes'::interval minute);
