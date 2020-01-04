export class DesignReport {
  quantity: number = 0;
  lost: number = 0;
  exploded: number = 0;
  kills = 0;
}
export class Stats {
  player: boolean;
  designId: number;
  name = "";
  rounds: DesignReport[];
  total: DesignReport;
}
export class BattleResult {
  playerLost: { id: number; lost: number }[];
  enemyLost: { id: number; lost: number }[];
  gameId: string;
  stats: Stats[];
}
