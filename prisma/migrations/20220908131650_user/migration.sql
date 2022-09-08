/*
  Warnings:

  - You are about to drop the column `author` on the `Todo` table. All the data in the column will be lost.
  - Added the required column `authorId` to the `Todo` table without a default value. This is not possible if the table is not empty.
  - Added the required column `message_id` to the `Todo` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Todo` DROP COLUMN `author`,
    ADD COLUMN `authorId` INTEGER NOT NULL,
    ADD COLUMN `message_id` INTEGER NOT NULL;

-- CreateTable
CREATE TABLE `User` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `is_bot` BOOLEAN NOT NULL DEFAULT false,
    `first_name` VARCHAR(191) NULL,
    `last_name` VARCHAR(191) NULL,
    `username` VARCHAR(191) NOT NULL,
    `language_code` VARCHAR(191) NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Todo` ADD CONSTRAINT `Todo_authorId_fkey` FOREIGN KEY (`authorId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
