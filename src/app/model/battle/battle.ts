import { BattleRequest } from "./battleRequest";
import { Ship } from "./ship";
import { WeaponData, ShipData } from "./shipData";
import { BattleResult, Stats, DesignReport } from "./battleResult";

export function battle(battleRequest: BattleRequest): any {
  const fleets = [battleRequest.enemyFleet, battleRequest.playerFleet];
  const battleResult = new BattleResult();

  //  Data initialization
  for (let i = 0, n = fleets.length; i < n; i++) {
    const fleet = fleets[i];
    fleet.forEach(shipData => {
      shipData.ships = [];
      shipData.alive = [];
      shipData.targets = i === 0 ? fleets[1] : fleets[0];
      shipData.stats = new Stats();
      shipData.stats.name = shipData.name;
      shipData.stats.designId = shipData.designId;
      shipData.stats.player = i === 1;
      shipData.stats.total = new DesignReport();
      shipData.stats.rounds = new Array<DesignReport>(5);
      for (let k = 0; k < 5; k++) {
        shipData.stats.rounds[k] = new DesignReport();
      }
      for (let k = 0; k < shipData.quantity; k++) {
        const ship = new Ship(shipData);
        shipData.ships.push(ship);
        shipData.alive.push(ship);
      }
    });
  }

  //  Firing; 5 rounds
  for (let z = 0; z < 5; z++) {
    //  Player and enemy
    for (let i = 0; i < 2; i++) {
      const fleet = fleets[i];
      // Ship designs
      for (let m = 0, n = fleet.length; m < n; m++) {
        const firing = fleet[m];
        //  Ships
        for (let k = 0, n2 = firing.ships.length; k < n2; k++) {
          const currentShip = firing.ships[k];
          //  Weapons
          for (let h = 0; h < firing.weapons.length; h++) {
            const target = getTarget(currentShip.shipData.targets);
            if (target && target.armour > 0) {
              dealDamage(firing.weapons[h], target, currentShip, z);
            }
          }
        }
      }
    }

    //  Player and enemy
    for (let i = 0; i < 2; i++) {
      const fleet = fleets[i];
      // Ship designs
      for (let m = 0, n = fleet.length; m < n; m++) {
        const design = fleet[m];
        design.ships = design.alive.slice();
      }
    }

    postRound();
    if (
      battleRequest.enemyFleet.findIndex(s => s.ships.length > 0) < 0 ||
      battleRequest.playerFleet.findIndex(s => s.ships.length > 0) < 0
    ) {
      break;
    }
  }

  battleResult.gameId = battleRequest.gameId;
  battleResult.playerLost = battleRequest.playerFleet.map(data => {
    return {
      id: data.designId,
      lost: data.quantity - data.ships.length
    };
  });
  battleResult.enemyLost = battleRequest.enemyFleet.map(data => {
    return {
      id: data.designId,
      lost: data.quantity - data.ships.length
    };
  });
  battleResult.stats = [];
  for (let i = 0, n = fleets.length; i < n; i++) {
    const fleet = fleets[i];
    fleet.forEach(shipData => {
      for (let z = 0; z < 5; z++) {
        shipData.stats.total.exploded += shipData.stats.rounds[z].exploded;
        shipData.stats.total.kills += shipData.stats.rounds[z].kills;
        shipData.stats.total.lost += shipData.stats.rounds[z].lost;
      }
      battleResult.stats.push(shipData.stats);
    });
  }

  return battleResult;
}
function postRound() {
  //  Regenerate shields
  //  Recharge Batteries
}

function getTarget(targets: ShipData[]): Ship {
  let sum = 0;
  for (let i = 0, n = targets.length; i < n; i++) {
    sum += targets[i].threat * targets[i].ships.length;
  }
  const rand = Math.random() * sum;
  let acc = 0;
  let target: Ship;
  for (let i = 0, n = targets.length; i < n; i++) {
    if (targets[i].ships.length > 0) {
      acc += targets[i].threat * targets[i].ships.length;
      if (rand < acc) {
        target =
          targets[i].ships[Math.floor(Math.random() * targets[i].ships.length)];
      }
    }
  }

  return target;
}
function dealDamage(
  weapon: WeaponData,
  target: Ship,
  attacker: Ship,
  round: number
) {
  let damageToDo = weapon.damage;

  //  Damage to shield
  if (target.shield > 0) {
    damageToDo *= weapon.shieldPercent;
    target.shield -= damageToDo;
    if (target.shield > 0) {
      damageToDo = 0;
    } else {
      damageToDo = (target.shield * -1) / weapon.shieldPercent;
    }
  }

  //  Damage to armour
  if (damageToDo > 0) {
    damageToDo *= weapon.armourPercent;
    target.armour -= damageToDo;
  }

  //  Explosion
  if (
    target.armour > 0 &&
    target.armour / target.shipData.totalArmour <
      target.shipData.explosionChance
  ) {
    const explosion =
      1 -
      target.armour /
        (target.shipData.totalArmour * target.shipData.explosionChance);

    if (Math.random() < explosion) {
      //  Explode
      target.armour = 0;
      target.shipData.stats.rounds[round].exploded++;
    }
  }

  //  Remove
  if (target.armour <= 0) {
    const index = target.shipData.alive.indexOf(target);
    target.shipData.alive.splice(index, 1);
    target.shipData.stats.rounds[round].lost++;
    attacker.shipData.stats.rounds[round].kills++;
  }
}