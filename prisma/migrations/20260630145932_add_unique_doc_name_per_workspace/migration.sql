/*
  Warnings:

  - A unique constraint covering the columns `[workspaceId,name]` on the table `Document` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Document_workspaceId_name_key" ON "Document"("workspaceId", "name");
