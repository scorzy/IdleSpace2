
import { Game } from "../game";

describe("PrestigeManager", () => {
  it("prestige points should have unique ids", () => {
    const game = new Game();
    const ids = game.prestigeManager.prestigePoints.map((u) => u.id);
    const ok = new Set(ids).size === ids.length;

    if (!ok) {
      const count = new Array<{ id: string; quantity: number }>();
      ids.forEach((id) => {
        let item = count.find((i) => i.id === id);
        if (!item) {
          item = { id, quantity: 0 };
          count.push(item);
        }
        item.quantity++;
      });
      const nonUnique = count.filter((c) => c.quantity > 1);
      console.log(JSON.stringify(nonUnique));
    }
    expect(ok).toBeTruthy();
  });
});
