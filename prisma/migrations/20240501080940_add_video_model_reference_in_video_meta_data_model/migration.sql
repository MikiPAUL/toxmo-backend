/*
  Warnings:

  - A unique constraint covering the columns `[videoMetaDataId]` on the table `Video` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "LiveStream" ALTER COLUMN "expiresAt" SET DEFAULT (now() + '60 minutes'::interval minute);

-- AlterTable
ALTER TABLE "Team" ALTER COLUMN "expireAt" SET DEFAULT (now() + '30 minutes'::interval minute);

-- CreateIndex
CREATE UNIQUE INDEX "Video_videoMetaDataId_key" ON "Video"("videoMetaDataId");
