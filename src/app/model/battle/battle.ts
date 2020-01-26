import { BattleRequest } from "./battleRequest";
import { Ship } from "./ship";
import { WeaponData, ShipData } from "./shipData";
import { BattleResult, Stats, DesignReport } from "./battleResult";

export function battle(battleRequest: BattleRequest): any {
  const fleets = [battleRequest.enemyFleet, battleRequest.playerFleet];
  console.log(fleets);
  const battleResult = new BattleResult();

  //  Data initialization
  for (let i = 0, n = fleets.length; i < n; i++) {
    const fleet = fleets[i];
    fleet.forEach(shipData => {
      shipData.ships = [];
      shipData.alive = [];
      shipData.withArmour = [];
      shipData.withShield = [];
      shipData.targets = i === 0 ? fleets[1] : fleets[0];
      if (shipData.explosionDamage > 0) {
        shipData.explosionWeapon = new WeaponData();
        shipData.explosionWeapon.shieldPercent = 1;
        shipData.explosionWeapon.armourPercent = 1;
        shipData.explosionWeapon.damage = shipData.explosionDamage;
      }
      shipData.stats = new Stats();
      shipData.stats.name = shipData.name;
      shipData.stats.designId = shipData.designId;
      shipData.stats.player = i === 1;
      shipData.stats.total = new DesignReport();
      shipData.stats.total.quantity = shipData.quantity;
      shipData.stats.rounds = new Array<DesignReport>(5);
      for (let k = 0, n2 = shipData.weapons.length; k < n2; k++) {
        shipData.weapons[k].armourPercent /= 100;
        shipData.weapons[k].shieldPercent /= 100;
      }
      for (let k = 0; k < 5; k++) {
        shipData.stats.rounds[k] = new DesignReport();
      }
      for (let k = 0; k < shipData.quantity; k++) {
        const ship = new Ship(shipData);
        shipData.ships.push(ship);
        shipData.alive.push(ship);
        shipData.withArmour.push(ship);
        if (ship.shield > 0) shipData.withShield.push(ship);
      }
    });
  }

  //  Firing; 5 rounds
  for (let round = 0; round < 5; round++) {
    //  Player and enemy
    for (let i = 0; i < 2; i++) {
      const fleet = fleets[i];
      // Ship designs
      for (let m = 0, n = fleet.length; m < n; m++) {
        const firing = fleet[m];
        firing.stats.rounds[round].quantity = firing.ships.length;
        //  Ships
        for (let k = 0, n2 = firing.ships.length; k < n2; k++) {
          const currentShip = firing.ships[k];
          //  Weapons
          for (let h = 0, n3 = firing.weapons.length; h < n3; h++) {
            const target = getTarget(
              currentShip.shipData.targets,
              firing.weapons[h]
            );
            if (target) {
              target.shipData.stats.rounds[round].shotTaken++;
              if (target.armour > 0) {
                currentShip.shipData.stats.rounds[round].aliveTargets++;
                dealDamage(firing.weapons[h], target, currentShip, round);
              } else {
                currentShip.shipData.stats.rounds[round].deathTargets++;
                target.shipData.stats.rounds[round].shotTakenDeath++;
              }
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
        design.stats.rounds[round].quantityEnd = design.alive.length;
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
        shipData.stats.total.quantityEnd = shipData.alive.length;
        shipData.stats.total.oneShotted += shipData.stats.rounds[z].oneShotted;
        shipData.stats.total.shotTaken += shipData.stats.rounds[z].shotTaken;
        shipData.stats.total.shotTakenDeath +=
          shipData.stats.rounds[z].shotTakenDeath;

        shipData.stats.total.aliveTargetsShield +=
          shipData.stats.rounds[z].aliveTargetsShield;
        shipData.stats.total.aliveTargetsNoShield +=
          shipData.stats.rounds[z].aliveTargetsNoShield;

        shipData.stats.total.explosionTriggered +=
          shipData.stats.rounds[z].explosionTriggered;
        shipData.stats.total.oneShotDone +=
          shipData.stats.rounds[z].oneShotDone;
        shipData.stats.total.deathTargets +=
          shipData.stats.rounds[z].deathTargets;
        shipData.stats.total.aliveTargets +=
          shipData.stats.rounds[z].aliveTargets;

        shipData.stats.total.damageDone += shipData.stats.rounds[z].damageDone;
        shipData.stats.total.armourDamageDone +=
          shipData.stats.rounds[z].armourDamageDone;
        shipData.stats.total.shieldDamageDone +=
          shipData.stats.rounds[z].shieldDamageDone;
        shipData.stats.total.damageTaken +=
          shipData.stats.rounds[z].damageTaken;
        shipData.stats.total.armourDamageTaken +=
          shipData.stats.rounds[z].armourDamageTaken;
        shipData.stats.total.shieldDamageTaken +=
          shipData.stats.rounds[z].shieldDamageTaken;
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

function getTarget(targets: ShipData[], weapon: WeaponData): Ship {
  let sum = 0;
  for (let i = 0, n = targets.length; i < n; i++) {
    sum += targets[i].threat * targets[i].quantity;
    sum +=
      (weapon.aliveThreatGain + weapon.armourThreatGain) *
      targets[i].withArmour.length;
    sum +=
      (weapon.aliveThreatGain + weapon.shieldThreatGain) *
      targets[i].withShield.length;
  }
  const rand = Math.random() * sum;
  let acc = 0;
  let target: Ship;
  for (let i = 0, n = targets.length; i < n; i++) {
    acc += targets[i].threat * (targets[i].quantity - targets[i].alive.length);
    if (rand < acc) {
      target = targets[i].ships.find(s => s.armour <= 0);
      break;
    }

    if (targets[i].withArmour.length > 0) {
      acc +=
        (targets[i].threat + weapon.aliveThreatGain + weapon.armourThreatGain) *
        targets[i].withArmour.length;
      if (rand < acc) {
        target =
          targets[i].withArmour[
            Math.floor(Math.random() * targets[i].withArmour.length)
          ];
        break;
      }
    }
    if (targets[i].withShield.length > 0) {
      acc +=
        (targets[i].threat + weapon.aliveThreatGain + weapon.shieldThreatGain) *
        targets[i].withShield.length;
      if (rand < acc) {
        target =
          targets[i].withShield[
            Math.floor(Math.random() * targets[i].withShield.length)
          ];
        break;
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
  const fullHealth =
    target.armour >= target.shipData.totalArmour &&
    target.shield >= target.shipData.totalShield;

  //  Damage to shield
  if (target.shield > 0) {
    let shieldDamageDone = 0;
    damageToDo *= weapon.shieldPercent;
    damageToDo -= target.shipData.shieldReduction;
    if (damageToDo > 0) {
      const shield = target.shield;
      target.shield -= damageToDo;

      if (target.shield > 0) {
        damageToDo = 0;
        shieldDamageDone = shield;
      } else {
        damageToDo = (target.shield * -1) / weapon.shieldPercent;
        shieldDamageDone = shield - target.shield;
        const index = target.shipData.withShield.indexOf(target);
        if (index >= 0) {
          target.shipData.withShield.splice(index, 1);
        }
        target.shipData.withArmour.push(target);
      }
      target.shipData.stats.rounds[round].damageTaken += shieldDamageDone;
      target.shipData.stats.rounds[round].shieldDamageTaken += shieldDamageDone;
      attacker.shipData.stats.rounds[round].damageDone += shieldDamageDone;
      attacker.shipData.stats.rounds[
        round
      ].shieldDamageDone += shieldDamageDone;
      attacker.shipData.stats.rounds[round].aliveTargetsShield++;
    }
  } else {
    attacker.shipData.stats.rounds[round].aliveTargetsNoShield++;
  }

  //  Damage to armour
  if (damageToDo > 0) {
    damageToDo *= weapon.armourPercent;
    damageToDo -= target.shipData.armourReduction;
    if (damageToDo > 0) {
      const armour = target.armour;
      target.armour -= damageToDo;
      const armourDamageDone = Math.max(armour - target.armour, armour);
      target.shipData.stats.rounds[round].damageTaken += armourDamageDone;
      target.shipData.stats.rounds[round].armourDamageTaken += armourDamageDone;
      attacker.shipData.stats.rounds[round].damageDone += armourDamageDone;
      attacker.shipData.stats.rounds[
        round
      ].armourDamageDone += armourDamageDone;
    }
  }

  //  Explosion
  if (target.armour > 0 && target.armour < target.shipData.explosionThreshold) {
    const explosion = 1 - target.armour / target.shipData.explosionThreshold;

    if (Math.random() < explosion) {
      //  Explode
      target.armour = 0;
      target.shipData.stats.rounds[round].exploded++;
      attacker.shipData.stats.rounds[round].explosionTriggered++;
      if (target.shipData.explosionDamage > 0 && attacker.armour > 0) {
        dealDamage(target.shipData.explosionWeapon, attacker, target, round);
      }
    }
  }

  //  Remove
  if (target.armour <= 0) {
    const index = target.shipData.alive.indexOf(target);
    if (index >= 0) target.shipData.alive.splice(index, 1);
    const index2 = target.shipData.withArmour.indexOf(target);
    if (index2 >= 0) target.shipData.withArmour.splice(index, 1);

    target.shipData.stats.rounds[round].lost++;
    attacker.shipData.stats.rounds[round].kills++;
    if (fullHealth) {
      target.shipData.stats.rounds[round].oneShotted++;
      attacker.shipData.stats.rounds[round].oneShotDone++;
    }
  }
}
