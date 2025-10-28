-- DropForeignKey
ALTER TABLE "public"."Prescricao" DROP CONSTRAINT "Prescricao_consultaId_fkey";

-- AddForeignKey
ALTER TABLE "Prescricao" ADD CONSTRAINT "Prescricao_consultaId_fkey" FOREIGN KEY ("consultaId") REFERENCES "Consulta"("id") ON DELETE CASCADE ON UPDATE CASCADE;
