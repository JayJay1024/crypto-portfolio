-- CreateEnum
CREATE TYPE "TransactionType" AS ENUM ('BUY', 'SELL');

-- CreateEnum
CREATE TYPE "FeeUnit" AS ENUM ('USDT', 'CRYPTO');

-- CreateEnum
CREATE TYPE "Exchange" AS ENUM ('BINANCE', 'OKX', 'GATE', 'BITGET', 'CUSTOM');

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "wallet_address" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "transactions" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "coin_id" TEXT NOT NULL,
    "coin_symbol" TEXT NOT NULL,
    "coin_name" TEXT NOT NULL,
    "type" "TransactionType" NOT NULL,
    "exchange" "Exchange" NOT NULL DEFAULT 'BINANCE',
    "exchange_custom" TEXT,
    "quantity" DECIMAL(30,18) NOT NULL,
    "price" DECIMAL(30,18) NOT NULL,
    "date" DATE NOT NULL,
    "fee" DECIMAL(30,18) NOT NULL DEFAULT 0,
    "fee_unit" "FeeUnit" NOT NULL DEFAULT 'USDT',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "transactions_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_wallet_address_key" ON "users"("wallet_address");

-- CreateIndex
CREATE INDEX "transactions_user_id_idx" ON "transactions"("user_id");

-- CreateIndex
CREATE INDEX "transactions_user_id_coin_id_idx" ON "transactions"("user_id", "coin_id");

-- CreateIndex
CREATE INDEX "transactions_user_id_coin_id_type_idx" ON "transactions"("user_id", "coin_id", "type");

-- AddForeignKey
ALTER TABLE "transactions" ADD CONSTRAINT "transactions_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
