/*
  Warnings:

  - You are about to drop the column `clientViewOptions` on the `ClientProject` table. All the data in the column will be lost.
  - You are about to drop the column `completedSteps` on the `ClientProject` table. All the data in the column will be lost.
  - You are about to drop the column `completionDate` on the `ClientProject` table. All the data in the column will be lost.
  - You are about to drop the column `location` on the `ClientProject` table. All the data in the column will be lost.
  - You are about to drop the column `previewImage` on the `ClientProject` table. All the data in the column will be lost.
  - You are about to drop the column `steps` on the `ClientProject` table. All the data in the column will be lost.
  - You are about to drop the column `title` on the `ClientProject` table. All the data in the column will be lost.
  - You are about to drop the `ProjectUpdate` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `name` to the `ClientProject` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `ClientProject` table without a default value. This is not possible if the table is not empty.
  - Made the column `startDate` on table `ClientProject` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "ProjectUpdate" DROP CONSTRAINT "ProjectUpdate_projectId_fkey";

-- AlterTable
ALTER TABLE "ClientProject" DROP COLUMN "clientViewOptions",
DROP COLUMN "completedSteps",
DROP COLUMN "completionDate",
DROP COLUMN "location",
DROP COLUMN "previewImage",
DROP COLUMN "steps",
DROP COLUMN "title",
ADD COLUMN     "deletedAt" TIMESTAMP(3),
ADD COLUMN     "endDate" TIMESTAMP(3),
ADD COLUMN     "name" TEXT NOT NULL,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL,
ALTER COLUMN "startDate" SET NOT NULL;

-- DropTable
DROP TABLE "ProjectUpdate";

-- CreateTable
CREATE TABLE "ClientProjectHistory" (
    "id" SERIAL NOT NULL,
    "clientProjectId" INTEGER NOT NULL,
    "status" TEXT NOT NULL,
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3),
    "deletedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ClientProjectHistory_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "ClientProjectHistory_clientProjectId_idx" ON "ClientProjectHistory"("clientProjectId");

-- CreateIndex
CREATE INDEX "ClientProjectHistory_deletedAt_idx" ON "ClientProjectHistory"("deletedAt");

-- CreateIndex
CREATE INDEX "ClientProject_clientId_idx" ON "ClientProject"("clientId");

-- CreateIndex
CREATE INDEX "ClientProject_deletedAt_idx" ON "ClientProject"("deletedAt");

-- AddForeignKey
ALTER TABLE "ClientProjectHistory" ADD CONSTRAINT "ClientProjectHistory_clientProjectId_fkey" FOREIGN KEY ("clientProjectId") REFERENCES "ClientProject"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
