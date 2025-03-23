-- CreateTable
CREATE TABLE `users` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `username` VARCHAR(100) NOT NULL,
    `name` VARCHAR(100) NOT NULL,
    `email` VARCHAR(100) NOT NULL,
    `password` VARCHAR(255) NOT NULL,
    `verifyOtp` INTEGER NULL,
    `verifyOtpExpireAt` DATETIME(3) NULL,
    `isAccountVerified` BOOLEAN NOT NULL DEFAULT false,
    `resetOtp` INTEGER NULL,
    `resetOtpExpireAt` DATETIME(3) NULL,

    UNIQUE INDEX `users_email_key`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
