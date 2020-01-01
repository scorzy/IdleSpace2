import { BattleRequest } from "./battleRequest";
import { Ship } from "./ship";
import { WeaponData, ShipData } from "./shipData";
import { BattleResult } from "./battleResult";

export function battle(battleRequest: BattleRequest): any {
  // console.log(battleRequest);

  const firingOrder: { weapon: WeaponData; shipData: ShipData }[] = [];
  const fleets = [battleRequest.enemyFleet, battleRequest.playerFleet];

  for (let i = 0, n = fleets.length; i < n; i++) {
    const fleet = fleets[i];
    fleet.forEach(shipData => {
      shipData.ships = [];
      shipData.targets = i === 0 ? fleets[1] : fleets[0];

      shipData.weapons.forEach(weapon => {
        firingOrder.push({
          weapon,
          shipData
        });
      });

      for (let k = 0; k < shipData.quantity; k++) {
        shipData.ships.push(new Ship(shipData));
      }
    });
  }

  firingOrder.sort((a, b) => a.weapon.initiative - b.weapon.initiative);

  // console.log(firingOrder);

  for (let z = 0; z < 5; z++) {
    for (let i = 0, n = firingOrder.length; i < n; i++) {
      const firing = firingOrder[i];
      for (let k = 0, n2 = firing.shipData.ships.length; k < n2; k++) {
        const currentShip = firing.shipData.ships[k];
        // console.log(currentShip);
        const target = getTarget(currentShip.shipData.targets);
        if (target) {
          dealDamage(firing.weapon, target);
        }
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

  const battleResult = new BattleResult();
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
function dealDamage(weapon: WeaponData, target: Ship) {
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
    }
  }

  //  Remove
  if (target.armour <= 0) {
    const index = target.shipData.ships.indexOf(target);
    target.shipData.ships.splice(index, 1);
  }
}
