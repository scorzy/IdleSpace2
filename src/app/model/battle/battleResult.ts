export class BattleResult {
  playerLost: { id: number; lost: number }[];
  enemyLost: { id: number; lost: number }[];
  gameId: string;
}
