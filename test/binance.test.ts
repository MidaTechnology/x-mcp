import { describe, it, expect } from "vitest";
import * as BinanceGetApi from "../src/binance/binance_get_api";

describe("Test Binance", () => {
  it("binanceDepth", async () => {
    const data = await BinanceGetApi.binanceDepth("BTCUSDT", 100);
    console.log(JSON.stringify(data));
  }, 10000);

  it("fetchBinanceTrades", async () => {
    const data = await BinanceGetApi.fetchBinanceTrades("BTCUSDT", 100);
    console.log(JSON.stringify(data));
  }, 10000);

  it("fetchBinanceTrades", async () => {
    const data = await BinanceGetApi.ticker24hr("BTCUSDT");
    console.log(JSON.stringify(data));
  }, 10000);
});
