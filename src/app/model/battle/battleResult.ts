export class DesignReport {
  quantity = 0;
  quantityEnd = 0;
  lost = 0;
  exploded = 0;
  kills = 0;
  oneShotted = 0;
  oneShotDone = 0;
  damageDone = 0;
  armourDamageDone = 0;
  shieldDamageDone = 0;
  damageTaken = 0;
  armourDamageTaken = 0;
  shieldDamageTaken = 0;

  deathTargets = 0;
  aliveTargets = 0;
  aliveTargetsShield = 0;
  aliveTargetsNoShield = 0;

  explosionTriggered = 0;

  shotTaken = 0;
  shotTakenDeath = 0;

  shieldRegenerationReceived = 0;
  threatAvg = 0;
  threatQta = 0;

  shipHit = 0;
  defenceHit = 0;
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
  endTime: DOMHighResTimeStamp;
  won = false;
}
