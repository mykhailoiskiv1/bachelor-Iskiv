-- CreateEnum
CREATE TYPE "CalcUnitType" AS ENUM ('M2', 'ITEM', 'HOUR', 'FIXED');

-- CreateTable
CREATE TABLE "CalcCategory" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT,
    "isPopular" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CalcCategory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CalcItem" (
    "id" SERIAL NOT NULL,
    "categoryId" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "unitType" "CalcUnitType" NOT NULL,
    "minPrice" DOUBLE PRECISION NOT NULL,
    "maxPrice" DOUBLE PRECISION NOT NULL,
    "baseMin" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "baseMax" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "vatIncluded" BOOLEAN NOT NULL DEFAULT true,
    "visible" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CalcItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CalcSettings" (
    "id" INTEGER NOT NULL DEFAULT 1,
    "callOutThreshold" DOUBLE PRECISION NOT NULL DEFAULT 250,
    "callOutFeeMin" DOUBLE PRECISION NOT NULL DEFAULT 75,
    "callOutFeeMax" DOUBLE PRECISION NOT NULL DEFAULT 120,
    "urgencyMultiplier" DOUBLE PRECISION NOT NULL DEFAULT 1.15,
    "emergencyMultiplier" DOUBLE PRECISION NOT NULL DEFAULT 1.4,
    "projectTrigger" DOUBLE PRECISION NOT NULL DEFAULT 10000,
    "projectFeePercent" DOUBLE PRECISION NOT NULL DEFAULT 5,

    CONSTRAINT "CalcSettings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CalcRequest" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "postcode" TEXT NOT NULL,
    "categorySlug" TEXT NOT NULL,
    "data" JSONB NOT NULL,
    "urgency" TEXT NOT NULL,
    "estimateMin" DOUBLE PRECISION NOT NULL,
    "estimateMax" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CalcRequest_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "CalcCategory_slug_key" ON "CalcCategory"("slug");

-- AddForeignKey
ALTER TABLE "CalcItem" ADD CONSTRAINT "CalcItem_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "CalcCategory"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
