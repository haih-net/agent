-- CreateEnum
CREATE TYPE "EXReflexType" AS ENUM ('unconditional', 'conditional');

-- CreateEnum
CREATE TYPE "EXReflexStatus" AS ENUM ('active', 'disabled', 'draft');

-- CreateTable
CREATE TABLE "EXReflex" (
    "id" VARCHAR(36) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "type" "EXReflexType" NOT NULL DEFAULT 'conditional',
    "status" "EXReflexStatus" NOT NULL DEFAULT 'active',
    "stimulus" TEXT NOT NULL,
    "response" TEXT NOT NULL,
    "effectiveness" DOUBLE PRECISION,
    "executionRate" DOUBLE PRECISION,
    "createdById" VARCHAR(36) NOT NULL,

    CONSTRAINT "EXReflex_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EXReaction" (
    "id" VARCHAR(36) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "reflexId" VARCHAR(36) NOT NULL,
    "stimulus" TEXT NOT NULL,
    "result" TEXT NOT NULL,
    "tokensUsed" INTEGER,
    "durationMs" INTEGER,
    "scoreAgent" DOUBLE PRECISION,
    "scoreTarget" DOUBLE PRECISION,
    "scoreMentor" DOUBLE PRECISION,
    "feedback" TEXT,
    "createdById" VARCHAR(36) NOT NULL,
    "relatedToUserId" VARCHAR(36),

    CONSTRAINT "EXReaction_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "EXReflex_type_idx" ON "EXReflex"("type");

-- CreateIndex
CREATE INDEX "EXReflex_status_idx" ON "EXReflex"("status");

-- CreateIndex
CREATE INDEX "EXReaction_reflexId_idx" ON "EXReaction"("reflexId");

-- CreateIndex
CREATE INDEX "EXReaction_createdById_idx" ON "EXReaction"("createdById");

-- CreateIndex
CREATE INDEX "EXReaction_relatedToUserId_idx" ON "EXReaction"("relatedToUserId");

-- AddForeignKey
ALTER TABLE "EXReflex" ADD CONSTRAINT "EXReflex_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EXReaction" ADD CONSTRAINT "EXReaction_reflexId_fkey" FOREIGN KEY ("reflexId") REFERENCES "EXReflex"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EXReaction" ADD CONSTRAINT "EXReaction_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
