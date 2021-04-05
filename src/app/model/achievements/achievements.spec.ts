import { Game } from "../game";

describe("Achievements", () => {
  it("Achievements should have unique ids", () => {
    const game = new Game();
    const ids = game.achievementManager.achievements.map((u) => u.id);
    const ok = new Set(ids).size === ids.length;
    expect(ok).toBeTruthy();
  });
});
