import { BonusStack } from "../bonus/bonusStack";
import { ExclusiveResGroups } from "../researches/exclusiveResGroups";

export interface IJobType {
  id: string;
  name: string;
  icon: string;
  color?: string;
  darkColor: string;
  lightColor: string;
  bonus?: BonusStack;
}

export interface IResearchData {
  id: string;
  name: string;
  description: string;
  max?: number;
  priceMulti?: number;
  growRate?: number;
  unitsToUnlock?: string[];
  researchToUnlock?: string[];
  unlockFrom?: string;
  technologiesToUnlock?: string[];
  type: IJobType;
  researchBonus?: { type: IJobType; bonus: DecimalSource }[];
  navalCapacity?: number;
  stationToUp?: { stationId: string; habSpace: number }[];
  infrastructureToUp?: { infraId: string; bonus: number }[];
  battleMulti?: { materialId: string; multi: DecimalSource }[];
  prodMulti?: { unitId: string; multi: number; secondUnitId?: string }[];
  effMulti?: { unitId: string; multi: number; secondUnitId?: string }[];
  shipTypeToUnlock?: number;
  limitMulti?: { unitId: string; multi: number; secondUnitId?: string }[];
  recycling?: number;
  modulesToUnlock?: string[];
  modPoints?: { unitId: string; multi: number }[];
  buildingPoints?: { buildingId: string; quantity: number }[];
  shipProductionBonus?: { shipType: number; multi: number }[];
  shipProductionBonusAll?: number;
  speedMulti?: number;
  accelerationMulti?: number;
  inspirationDescription?: string;
  inspirationBuildingId?: string;
  inspirationSpaceStationId?: string;
  districtMulti?: number;
  habSpaceMulti?: number;
  miningDistMulti?: number;
  energyDistMulti?: number;
  materialMulti?: number;
  scienceMulti?: number;
  exclusiveGroup?: ExclusiveResGroups;
  spellToUnlock?: string;
  technologyBonus?: { techId: string; multi: number }[];
  computingPerSec?: number;
  requiredChallenge?: { challengeId: string; level: number };
  commonCivilianBonus?: number;
  spaceStationBuildBonus?: number;
  fleetCapacity?: number;
}
