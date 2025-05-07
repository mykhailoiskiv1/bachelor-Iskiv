/*
  Warnings:

  - You are about to drop the `SupportMessage` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `SupportRequest` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "SupportMessage" DROP CONSTRAINT "SupportMessage_requestId_fkey";

-- DropForeignKey
ALTER TABLE "SupportMessage" DROP CONSTRAINT "SupportMessage_senderId_fkey";

-- DropForeignKey
ALTER TABLE "SupportRequest" DROP CONSTRAINT "SupportRequest_clientId_fkey";

-- DropTable
DROP TABLE "SupportMessage";

-- DropTable
DROP TABLE "SupportRequest";

-- DropEnum
DROP TYPE "SupportStatus";

-- CreateTable
CREATE TABLE "Warranty" (
    "id" SERIAL NOT NULL,
    "projectId" INTEGER NOT NULL,
    "clientId" TEXT NOT NULL,
    "startDate" TIMESTAMP(3) NOT NULL,
    "durationMonths" INTEGER NOT NULL,
    "projectName" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Warranty_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Certificate" (
    "id" SERIAL NOT NULL,
    "clientId" TEXT NOT NULL,
    "fileUrl" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "issuedDate" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Certificate_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Warranty" ADD CONSTRAINT "Warranty_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Certificate" ADD CONSTRAINT "Certificate_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
