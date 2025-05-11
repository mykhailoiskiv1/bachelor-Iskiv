-- CreateTable
CREATE TABLE "AiChatEscalation" (
    "id" SERIAL NOT NULL,
    "sessionKey" TEXT NOT NULL,
    "name" TEXT,
    "email" TEXT NOT NULL,
    "message" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AiChatEscalation_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "AiChatEscalation_sessionKey_key" ON "AiChatEscalation"("sessionKey");
