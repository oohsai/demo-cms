-- CreateTable
CREATE TABLE "Customer" (
    "id" SERIAL NOT NULL,
    "custNum" TEXT NOT NULL,
    "age" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Customer_pkey" PRIMARY KEY ("id")
);
