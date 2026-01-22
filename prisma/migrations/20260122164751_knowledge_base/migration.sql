-- CreateEnum
CREATE TYPE "KBLabelRole" AS ENUM ('primary', 'synonym', 'alias', 'abbreviation');

-- CreateEnum
CREATE TYPE "KBFactStatus" AS ENUM ('unverified', 'tentative', 'verified', 'disputed', 'deprecated');

-- CreateEnum
CREATE TYPE "KBFactType" AS ENUM ('raw', 'derived');

-- CreateEnum
CREATE TYPE "KBConflictStatus" AS ENUM ('open', 'resolved', 'dismissed');

-- CreateEnum
CREATE TYPE "KBIdentityOperationType" AS ENUM ('merge', 'split');

-- CreateEnum
CREATE TYPE "KBProposalStatus" AS ENUM ('untested', 'tested', 'confirmed', 'rejected');

-- CreateEnum
CREATE TYPE "KBDecisionStatus" AS ENUM ('superseded', 'context_invalid', 'still_valid');

-- CreateEnum
CREATE TYPE "KBKnowledgeSpaceType" AS ENUM ('private', 'shared', 'public');

-- CreateEnum
CREATE TYPE "KBFactProjectionVisibility" AS ENUM ('visible', 'hidden');

-- CreateTable
CREATE TABLE "KBConcept" (
    "id" VARCHAR(36) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "type" VARCHAR(100),
    "name" VARCHAR(500) NOT NULL,
    "description" TEXT,
    "content" TEXT,
    "createdById" VARCHAR(36) NOT NULL,

    CONSTRAINT "KBConcept_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "KBLabel" (
    "id" VARCHAR(36) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "text" VARCHAR(500) NOT NULL,
    "language" VARCHAR(10),
    "role" "KBLabelRole" NOT NULL DEFAULT 'primary',
    "conceptId" VARCHAR(36) NOT NULL,
    "createdById" VARCHAR(36) NOT NULL,

    CONSTRAINT "KBLabel_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "KBFact" (
    "id" VARCHAR(36) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdById" VARCHAR(36) NOT NULL,
    "type" VARCHAR(200) NOT NULL,
    "statement" TEXT NOT NULL,
    "validFrom" DATE,
    "validTo" DATE,
    "knownSince" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "confidence" DOUBLE PRECISION NOT NULL DEFAULT 0.5,
    "status" "KBFactStatus" NOT NULL DEFAULT 'unverified',
    "source" TEXT,
    "importance" DOUBLE PRECISION NOT NULL DEFAULT 0.5,
    "importanceBasis" JSONB,
    "factType" "KBFactType" NOT NULL DEFAULT 'raw',
    "derivedFrom" JSONB,

    CONSTRAINT "KBFact_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "KBFactParticipation" (
    "id" VARCHAR(36) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "conceptId" VARCHAR(36) NOT NULL,
    "factId" VARCHAR(36) NOT NULL,
    "role" VARCHAR(100) NOT NULL,
    "impact" VARCHAR(50),
    "value" TEXT,
    "localImportance" DOUBLE PRECISION NOT NULL DEFAULT 0.5,

    CONSTRAINT "KBFactParticipation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "KBConstraint" (
    "id" VARCHAR(36) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "constraint" TEXT NOT NULL,
    "scope" JSONB,
    "createdById" VARCHAR(36) NOT NULL,

    CONSTRAINT "KBConstraint_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "KBConflict" (
    "id" VARCHAR(36) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "type" VARCHAR(100) NOT NULL,
    "severity" VARCHAR(50) NOT NULL,
    "status" "KBConflictStatus" NOT NULL DEFAULT 'open',
    "createdById" VARCHAR(36) NOT NULL,
    "constraintId" VARCHAR(36),

    CONSTRAINT "KBConflict_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "KBConflictFact" (
    "conflictId" VARCHAR(36) NOT NULL,
    "factId" VARCHAR(36) NOT NULL,

    CONSTRAINT "KBConflictFact_pkey" PRIMARY KEY ("conflictId","factId")
);

-- CreateTable
CREATE TABLE "KBIdentityOperation" (
    "id" VARCHAR(36) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "operation" "KBIdentityOperationType" NOT NULL,
    "rationale" TEXT,
    "createdById" VARCHAR(36) NOT NULL,

    CONSTRAINT "KBIdentityOperation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "KBProposal" (
    "id" VARCHAR(36) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "statement" TEXT NOT NULL,
    "status" "KBProposalStatus" NOT NULL DEFAULT 'untested',
    "testedBy" VARCHAR(36),
    "createdById" VARCHAR(36) NOT NULL,

    CONSTRAINT "KBProposal_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "KBDecision" (
    "id" VARCHAR(36) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "subject" VARCHAR(500) NOT NULL,
    "decision" TEXT NOT NULL,
    "context" JSONB,
    "outcome" JSONB,
    "status" "KBDecisionStatus" NOT NULL DEFAULT 'still_valid',
    "revisedById" VARCHAR(36),
    "basedOnProposalId" VARCHAR(36),
    "createdById" VARCHAR(36) NOT NULL,

    CONSTRAINT "KBDecision_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "KBKnowledgeSpace" (
    "id" VARCHAR(36) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "type" "KBKnowledgeSpaceType" NOT NULL DEFAULT 'private',
    "name" VARCHAR(255) NOT NULL,
    "description" TEXT,
    "createdById" VARCHAR(36) NOT NULL,

    CONSTRAINT "KBKnowledgeSpace_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "KBFactProjection" (
    "id" VARCHAR(36) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "factId" VARCHAR(36) NOT NULL,
    "knowledgeSpaceId" VARCHAR(36) NOT NULL,
    "visibility" "KBFactProjectionVisibility" NOT NULL DEFAULT 'visible',
    "trustLevel" DOUBLE PRECISION NOT NULL DEFAULT 0.5,
    "importance" DOUBLE PRECISION NOT NULL DEFAULT 0.5,
    "notes" TEXT,
    "createdById" VARCHAR(36) NOT NULL,

    CONSTRAINT "KBFactProjection_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_IdentityInput" (
    "A" VARCHAR(36) NOT NULL,
    "B" VARCHAR(36) NOT NULL,

    CONSTRAINT "_IdentityInput_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateTable
CREATE TABLE "_IdentityOutput" (
    "A" VARCHAR(36) NOT NULL,
    "B" VARCHAR(36) NOT NULL,

    CONSTRAINT "_IdentityOutput_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "KBLabel_conceptId_idx" ON "KBLabel"("conceptId");

-- CreateIndex
CREATE INDEX "KBFact_type_idx" ON "KBFact"("type");

-- CreateIndex
CREATE INDEX "KBFactParticipation_conceptId_idx" ON "KBFactParticipation"("conceptId");

-- CreateIndex
CREATE INDEX "KBFactParticipation_factId_idx" ON "KBFactParticipation"("factId");

-- CreateIndex
CREATE INDEX "KBFactParticipation_role_idx" ON "KBFactParticipation"("role");

-- CreateIndex
CREATE UNIQUE INDEX "KBFactParticipation_conceptId_factId_role_key" ON "KBFactParticipation"("conceptId", "factId", "role");

-- CreateIndex
CREATE INDEX "KBFactProjection_factId_idx" ON "KBFactProjection"("factId");

-- CreateIndex
CREATE INDEX "KBFactProjection_knowledgeSpaceId_idx" ON "KBFactProjection"("knowledgeSpaceId");

-- CreateIndex
CREATE UNIQUE INDEX "KBFactProjection_factId_knowledgeSpaceId_key" ON "KBFactProjection"("factId", "knowledgeSpaceId");

-- CreateIndex
CREATE INDEX "_IdentityInput_B_index" ON "_IdentityInput"("B");

-- CreateIndex
CREATE INDEX "_IdentityOutput_B_index" ON "_IdentityOutput"("B");

-- AddForeignKey
ALTER TABLE "KBConcept" ADD CONSTRAINT "KBConcept_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "KBLabel" ADD CONSTRAINT "KBLabel_conceptId_fkey" FOREIGN KEY ("conceptId") REFERENCES "KBConcept"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "KBLabel" ADD CONSTRAINT "KBLabel_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "KBFact" ADD CONSTRAINT "KBFact_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "KBFactParticipation" ADD CONSTRAINT "KBFactParticipation_conceptId_fkey" FOREIGN KEY ("conceptId") REFERENCES "KBConcept"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "KBFactParticipation" ADD CONSTRAINT "KBFactParticipation_factId_fkey" FOREIGN KEY ("factId") REFERENCES "KBFact"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "KBConstraint" ADD CONSTRAINT "KBConstraint_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "KBConflict" ADD CONSTRAINT "KBConflict_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "KBConflict" ADD CONSTRAINT "KBConflict_constraintId_fkey" FOREIGN KEY ("constraintId") REFERENCES "KBConstraint"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "KBConflictFact" ADD CONSTRAINT "KBConflictFact_conflictId_fkey" FOREIGN KEY ("conflictId") REFERENCES "KBConflict"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "KBConflictFact" ADD CONSTRAINT "KBConflictFact_factId_fkey" FOREIGN KEY ("factId") REFERENCES "KBFact"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "KBIdentityOperation" ADD CONSTRAINT "KBIdentityOperation_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "KBProposal" ADD CONSTRAINT "KBProposal_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "KBDecision" ADD CONSTRAINT "KBDecision_revisedById_fkey" FOREIGN KEY ("revisedById") REFERENCES "KBDecision"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "KBDecision" ADD CONSTRAINT "KBDecision_basedOnProposalId_fkey" FOREIGN KEY ("basedOnProposalId") REFERENCES "KBProposal"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "KBDecision" ADD CONSTRAINT "KBDecision_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "KBKnowledgeSpace" ADD CONSTRAINT "KBKnowledgeSpace_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "KBFactProjection" ADD CONSTRAINT "KBFactProjection_factId_fkey" FOREIGN KEY ("factId") REFERENCES "KBFact"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "KBFactProjection" ADD CONSTRAINT "KBFactProjection_knowledgeSpaceId_fkey" FOREIGN KEY ("knowledgeSpaceId") REFERENCES "KBKnowledgeSpace"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "KBFactProjection" ADD CONSTRAINT "KBFactProjection_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_IdentityInput" ADD CONSTRAINT "_IdentityInput_A_fkey" FOREIGN KEY ("A") REFERENCES "KBConcept"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_IdentityInput" ADD CONSTRAINT "_IdentityInput_B_fkey" FOREIGN KEY ("B") REFERENCES "KBIdentityOperation"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_IdentityOutput" ADD CONSTRAINT "_IdentityOutput_A_fkey" FOREIGN KEY ("A") REFERENCES "KBConcept"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_IdentityOutput" ADD CONSTRAINT "_IdentityOutput_B_fkey" FOREIGN KEY ("B") REFERENCES "KBIdentityOperation"("id") ON DELETE CASCADE ON UPDATE CASCADE;
