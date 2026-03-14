-- CreateEnum
CREATE TYPE "PostStatus" AS ENUM ('draft', 'published', 'unpublished');

-- AlterEnum
ALTER TYPE "UserStatus" ADD VALUE 'newbie';

-- CreateTable
CREATE TABLE "Post" (
    "id" VARCHAR(36) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "revision" INTEGER NOT NULL DEFAULT 1,
    "createdById" VARCHAR(36) NOT NULL,
    "status" "PostStatus" NOT NULL DEFAULT 'draft',
    "title" VARCHAR(512),
    "description" VARCHAR(3072),
    "intro" TEXT,
    "content" TEXT NOT NULL,
    "signature" TEXT,
    "parentId" VARCHAR(36),
    "rootId" VARCHAR(36),

    CONSTRAINT "Post_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PostRevision" (
    "id" VARCHAR(36) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "postId" VARCHAR(36) NOT NULL,
    "status" "PostStatus" NOT NULL,
    "title" VARCHAR(512),
    "description" VARCHAR(3072),
    "intro" TEXT,
    "content" TEXT NOT NULL,
    "signature" TEXT,

    CONSTRAINT "PostRevision_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Post_createdById_idx" ON "Post"("createdById");

-- CreateIndex
CREATE INDEX "Post_createdAt_idx" ON "Post"("createdAt");

-- CreateIndex
CREATE INDEX "Post_status_idx" ON "Post"("status");

-- CreateIndex
CREATE INDEX "PostRevision_postId_idx" ON "PostRevision"("postId");

-- CreateIndex
CREATE INDEX "PostRevision_createdAt_idx" ON "PostRevision"("createdAt");

-- AddForeignKey
ALTER TABLE "Post" ADD CONSTRAINT "Post_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PostRevision" ADD CONSTRAINT "PostRevision_postId_fkey" FOREIGN KEY ("postId") REFERENCES "Post"("id") ON DELETE CASCADE ON UPDATE CASCADE;
