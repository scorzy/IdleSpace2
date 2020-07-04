import { PRESTIGE_CARDS } from "./prestigeCard";

describe("PrestigeCards", () => {
  it("modules should have unique ids", () => {
    const ids = PRESTIGE_CARDS.map((u) => u.id);
    const ok = new Set(ids).size === ids.length;
    expect(ok).toBeTruthy();
  });
});
