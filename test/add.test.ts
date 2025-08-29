import { describe, it, expect } from "vitest";
import { handleGetHuochepiaoList } from "../src/12306_tool";

describe("Test handleGetHuochepiaoList", () => {
  it("12306 api test", async () => {
    const data = await handleGetHuochepiaoList("北京", "上海", "2025-08-30");
    console.log(JSON.stringify(data));
  }, 300000);
});
