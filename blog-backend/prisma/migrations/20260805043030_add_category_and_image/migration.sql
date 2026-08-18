-- AlterTable
ALTER TABLE "articles" ADD COLUMN     "category" TEXT NOT NULL DEFAULT 'general',
ADD COLUMN     "imageUrl" TEXT;
