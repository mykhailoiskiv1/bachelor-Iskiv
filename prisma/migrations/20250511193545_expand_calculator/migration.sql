/*
  Warnings:

  - You are about to drop the column `createdAt` on the `CalcCategory` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `CalcCategory` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "CalcCategory" DROP COLUMN "createdAt",
DROP COLUMN "updatedAt",
ADD COLUMN     "projectTypeId" INTEGER;

-- CreateTable
CREATE TABLE "CalcProjectType" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CalcProjectType_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CalcCondition" (
    "id" SERIAL NOT NULL,
    "itemId" INTEGER NOT NULL,
    "label" TEXT NOT NULL,
    "description" TEXT,
    "multiplier" DOUBLE PRECISION NOT NULL,
    "isDefault" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "CalcCondition_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "CalcProjectType_slug_key" ON "CalcProjectType"("slug");

-- AddForeignKey
ALTER TABLE "CalcCategory" ADD CONSTRAINT "CalcCategory_projectTypeId_fkey" FOREIGN KEY ("projectTypeId") REFERENCES "CalcProjectType"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CalcCondition" ADD CONSTRAINT "CalcCondition_itemId_fkey" FOREIGN KEY ("itemId") REFERENCES "CalcItem"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
