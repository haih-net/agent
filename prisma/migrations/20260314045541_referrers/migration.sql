-- AlterTable
ALTER TABLE "User" ADD COLUMN     "referrerId" VARCHAR(36);

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_referrerId_fkey" FOREIGN KEY ("referrerId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
