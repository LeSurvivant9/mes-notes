/*
  Warnings:

  - You are about to drop the `account` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `assessment` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `department` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `grade` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `password_reset_token` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `professor` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `student` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `subject` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `teaching_unit` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `user` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `verification_token` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE `account`;

-- DropTable
DROP TABLE `assessment`;

-- DropTable
DROP TABLE `department`;

-- DropTable
DROP TABLE `grade`;

-- DropTable
DROP TABLE `password_reset_token`;

-- DropTable
DROP TABLE `professor`;

-- DropTable
DROP TABLE `student`;

-- DropTable
DROP TABLE `subject`;

-- DropTable
DROP TABLE `teaching_unit`;

-- DropTable
DROP TABLE `user`;

-- DropTable
DROP TABLE `verification_token`;

-- CreateTable
CREATE TABLE `Department` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `departmentName` VARCHAR(255) NOT NULL,

    UNIQUE INDEX `Department_departmentName_key`(`departmentName`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `TeachingUnit` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `teachingUnitName` VARCHAR(255) NOT NULL,
    `semester` INTEGER NOT NULL,
    `departmentId` INTEGER NOT NULL,

    INDEX `teaching_unit_index_0`(`departmentId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Subject` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `teachingUnitId` INTEGER NOT NULL,
    `subjectName` VARCHAR(255) NOT NULL,
    `subjectCoefficient` INTEGER NOT NULL,

    INDEX `subject_index_1`(`teachingUnitId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Professor` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `lastName` VARCHAR(50) NOT NULL,
    `firstName` VARCHAR(50) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Student` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `lastName` VARCHAR(50) NOT NULL,
    `firstName` VARCHAR(50) NOT NULL,
    `studentNumber` VARCHAR(8) NOT NULL,
    `departmentId` INTEGER NOT NULL,
    `entryYear` INTEGER NULL,
    `level` INTEGER NOT NULL,

    UNIQUE INDEX `Student_studentNumber_key`(`studentNumber`),
    INDEX `student_index_2`(`studentNumber`),
    INDEX `student_index_3`(`departmentId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Assessment` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `subjectId` INTEGER NOT NULL,
    `typeOfAssessment` VARCHAR(50) NOT NULL,
    `dateOfAssessment` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `coefficient` INTEGER NOT NULL,
    `fileName` VARCHAR(255) NOT NULL,
    `period` INTEGER NOT NULL,
    `semester` INTEGER NOT NULL,

    INDEX `assessment_index_4`(`subjectId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Grade` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `studentId` INTEGER NOT NULL,
    `assessmentId` INTEGER NOT NULL,
    `gradeValue` DOUBLE NOT NULL,

    INDEX `grade_index_5`(`studentId`),
    INDEX `grade_index_6`(`assessmentId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `User` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(255) NULL,
    `username` VARCHAR(30) NULL,
    `image` VARCHAR(255) NULL,
    `hashedPassword` VARCHAR(255) NULL,
    `role` ENUM('ADMIN', 'USER') NOT NULL DEFAULT 'USER',
    `email` VARCHAR(255) NOT NULL,
    `emailVerified` DATETIME(3) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `User_username_key`(`username`),
    UNIQUE INDEX `User_email_key`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Account` (
    `id` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NOT NULL,
    `studentId` INTEGER NULL,
    `professorId` INTEGER NULL,
    `type` ENUM('STUDENT', 'PROFESSOR') NOT NULL,

    INDEX `account_studentId_idx`(`studentId`),
    INDEX `account_professorId_idx`(`professorId`),
    UNIQUE INDEX `Account_userId_studentId_key`(`userId`, `studentId`),
    UNIQUE INDEX `Account_userId_professorId_key`(`userId`, `professorId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `VerificationToken` (
    `id` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `token` VARCHAR(191) NOT NULL,
    `expires` DATETIME(3) NOT NULL,

    UNIQUE INDEX `VerificationToken_token_key`(`token`),
    UNIQUE INDEX `VerificationToken_email_token_key`(`email`, `token`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `PasswordResetToken` (
    `id` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `token` VARCHAR(191) NOT NULL,
    `expires` DATETIME(3) NOT NULL,

    UNIQUE INDEX `PasswordResetToken_token_key`(`token`),
    UNIQUE INDEX `PasswordResetToken_email_token_key`(`email`, `token`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
