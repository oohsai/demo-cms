-- CreateTable
CREATE TABLE "Developer" (
    "id" SERIAL NOT NULL,
    "Name" TEXT NOT NULL,
    "age" INTEGER NOT NULL,
    "Applications" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Developer_pkey" PRIMARY KEY ("id")
);
