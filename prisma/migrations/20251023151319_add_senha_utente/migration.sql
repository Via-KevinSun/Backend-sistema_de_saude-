/*
  Warnings:

  - A unique constraint covering the columns `[contacto]` on the table `Utente` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Utente_contacto_key" ON "Utente"("contacto");
