/*
  Warnings:

  - You are about to drop the column `role` on the `UserEntity` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "UserEntity" DROP COLUMN "role",
ADD COLUMN     "roles" "Role"[];
