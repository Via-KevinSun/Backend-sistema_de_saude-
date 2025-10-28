-- DropForeignKey
ALTER TABLE "public"."Consulta" DROP CONSTRAINT "Consulta_utenteId_fkey";

-- DropForeignKey
ALTER TABLE "public"."LeituraClinica" DROP CONSTRAINT "LeituraClinica_utenteId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Notificacao" DROP CONSTRAINT "Notificacao_utenteId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Triagem" DROP CONSTRAINT "Triagem_utenteId_fkey";

-- AddForeignKey
ALTER TABLE "Consulta" ADD CONSTRAINT "Consulta_utenteId_fkey" FOREIGN KEY ("utenteId") REFERENCES "Utente"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LeituraClinica" ADD CONSTRAINT "LeituraClinica_utenteId_fkey" FOREIGN KEY ("utenteId") REFERENCES "Utente"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Triagem" ADD CONSTRAINT "Triagem_utenteId_fkey" FOREIGN KEY ("utenteId") REFERENCES "Utente"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Notificacao" ADD CONSTRAINT "Notificacao_utenteId_fkey" FOREIGN KEY ("utenteId") REFERENCES "Utente"("id") ON DELETE CASCADE ON UPDATE CASCADE;
