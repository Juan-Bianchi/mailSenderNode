/*
  Warnings:

  - You are about to drop the column `roles` on the `UserEntity` table. All the data in the column will be lost.
  - Added the required column `role` to the `UserEntity` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "UserEntity" DROP COLUMN "roles",
ADD COLUMN     "role" "Role" NOT NULL;
