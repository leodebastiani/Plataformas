/*
  Warnings:

  - You are about to drop the column `sector` on the `Platform` table. All the data in the column will be lost.
  - You are about to drop the column `sectors` on the `Platform` table. All the data in the column will be lost.

*/
-- CreateTable
CREATE TABLE "_PlatformToSector" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,
    CONSTRAINT "_PlatformToSector_A_fkey" FOREIGN KEY ("A") REFERENCES "Platform" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "_PlatformToSector_B_fkey" FOREIGN KEY ("B") REFERENCES "Sector" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Platform" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "licenseType" TEXT NOT NULL DEFAULT 'UNLIMITED',
    "licenseQuantity" INTEGER,
    "expirationDate" DATETIME,
    "status" TEXT NOT NULL DEFAULT 'ACTIVE',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_Platform" ("createdAt", "description", "expirationDate", "id", "licenseQuantity", "licenseType", "name", "status", "updatedAt") SELECT "createdAt", "description", "expirationDate", "id", "licenseQuantity", "licenseType", "name", "status", "updatedAt" FROM "Platform";
DROP TABLE "Platform";
ALTER TABLE "new_Platform" RENAME TO "Platform";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

-- CreateIndex
CREATE UNIQUE INDEX "_PlatformToSector_AB_unique" ON "_PlatformToSector"("A", "B");

-- CreateIndex
CREATE INDEX "_PlatformToSector_B_index" ON "_PlatformToSector"("B");
