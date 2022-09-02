-- CreateTable
CREATE TABLE "meta" (
    "key" TEXT NOT NULL PRIMARY KEY,
    "value" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "Roaster" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "address" TEXT
);

-- CreateTable
CREATE TABLE "Roast" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "roasterId" TEXT NOT NULL,
    CONSTRAINT "Roast_roasterId_fkey" FOREIGN KEY ("roasterId") REFERENCES "Roaster" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Batch" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "roastDate" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "roastId" TEXT NOT NULL,
    CONSTRAINT "Batch_roastId_fkey" FOREIGN KEY ("roastId") REFERENCES "Roast" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Container" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "batchId" TEXT,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Container_batchId_fkey" FOREIGN KEY ("batchId") REFERENCES "Batch" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "ContainerLedger" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "containerId" TEXT NOT NULL,
    "batchId" TEXT NOT NULL,
    "dateIn" DATETIME NOT NULL,
    "dateOut" DATETIME,
    CONSTRAINT "ContainerLedger_containerId_fkey" FOREIGN KEY ("containerId") REFERENCES "Container" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "ContainerLedger_batchId_fkey" FOREIGN KEY ("batchId") REFERENCES "Batch" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "email" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "Password" (
    "hash" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    CONSTRAINT "Password_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "Roaster_name_key" ON "Roaster"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Roast_roasterId_name_key" ON "Roast"("roasterId", "name");

-- CreateIndex
CREATE UNIQUE INDEX "ContainerLedger_containerId_batchId_key" ON "ContainerLedger"("containerId", "batchId");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Password_userId_key" ON "Password"("userId");
