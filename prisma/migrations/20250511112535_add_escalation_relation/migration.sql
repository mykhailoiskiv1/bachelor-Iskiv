-- AddForeignKey
ALTER TABLE "AiChatEscalation" ADD CONSTRAINT "AiChatEscalation_sessionKey_fkey" FOREIGN KEY ("sessionKey") REFERENCES "AiChatThread"("sessionKey") ON DELETE RESTRICT ON UPDATE CASCADE;
