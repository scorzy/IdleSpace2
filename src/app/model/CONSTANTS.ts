/**
 * Game version used for save
 */
export const GAME_VERSION = 1;

//  Utility
export const ZERO = new Decimal(0);
export const ONE = new Decimal(1);
export const TEN = new Decimal(10);
export const INFINITY = new Decimal(Number.POSITIVE_INFINITY);

//  Units
export const IDS = {
  Miner: "m",
  Technician: "e",
  Scientist: "s",
  Metallurgist: "a",
  Worker: "w",
  Searcher: "r",
  Replicator: "X",
  NukeSpecialist: "B"
};
export const MAT_IDS = {
  Metal: "M",
  Energy: "E",
  Alloy: "A",
  Science: "S",
  Production: "W",
  Search: "R",
  Components: "x",
  Nuke: "b"
};
export const MEGA_IDS = {
  DysonSphere: "m0",
  MegaLaboratory: "m1",
  MegaFoundry: "m2",
  MegaShipyard: "m3",
  MegaTelescope: "m4",
  MegaNaval: "m5",
  Gateway: "m6",
  MegaComputing: "m7"
};
export const STRU_IDS = {
  SpacePort: "s0",
  Skyhook: "s1",
  RotatingSkyhook: "s2",
  SuperTether: "s3"
};
export const UNIT_PRICE_GROW_RATE = 1.04;
export const BUILDING_PRICE_GROW_RATE = 1.08;
export const SPACE_STATION_PRICE = 1e6;
export const SPACE_INFRASTRUCTURE_PRICE = 1e10;
export const SPACE_STATION_HAB_SPACE = 500;
export const INFRASTRUCTURE_BONUS = 0.01;
export const SPACE_STATION_GROW = 10;
export const MOD_PER_ROBOTICS = 0.1;
export const MOD_PER_OTHERS = 0.2;
export const MOD_EFFICIENCY_MULTI = 0.03;
export const MOD_ENERGY_MULTI = -0.05;
export const MOD_PROD_MULTI = 0.04;
export const MOD_COMPONENTS = 1;
export const MOD_RECYCLING = 0.3;
export const COMPONENT_PRICE = TEN;
export const MAX_RECYCLING = 0.9;
export const BUILDING_LIMIT = 20;
export const DEPARTMENT_TECH_MULTI = new Decimal(0.01);
export const EXP_STORAGE = 1.1;
export const MAX_MOD_PRESET = 5;

//  FLEETS
export const BASE_NAVAL_CAPACITY = 25;
export const FLEET_NUMBER = 5;
export const FLEET_CAPACITY = 5e3;
export const FLEET_CAPACITY_CARD = 2e3;
export const FLEET_CAPACITY_MULTI = 10;

//  Ships
export const BASE_ARMOUR = 100;
export const BASE_SHIP_PRICE = 40;
export const BASE_EXPLOSION = BASE_ARMOUR;
export const OPTIMIZE_RES_BONUS = 0.4;
export const STANDARDIZED_RES_BONUS = 1;
export const SPACE_STATIONS_EXPANSION = 2;
export const SPACE_STATIONS_EXPANSION_PREFIX = "U";

//  Search and enemies
export const RESEARCH_GROW_RATE = 1.07;
export const SEARCH_JOB_PRICE = 600;
export const EXTRA_OPT_EXP = 1.06;
export const ENEMY_NAVAL_CAP_LEVEL = 20;
export const ENEMY_BASE_DISTANCE = new Decimal(25);
export const MOD_LEVEL_EXP = 1.05;
export const MOD_DISTANCE_EXP = 1.04;
export const DEFENCE_START_LEVEL = 9;
export const DEFENCE_FINAL_LEVEL = 65;
export const DEFENCE_MAX_PERCENT = 0.4;
export const DISTRICT_MAX_OPT_END = 80;
export const DISTRICT_MIN_OPT_END = 40;
export const SCIENCE_DISTRICT_MULTI = 0.6;
export const COMPONENTS_DISTRICT_MULTI = 0.3;
export const MAX_SEARCH_JOB = 10;
export const ENEMY_EXP_START_LEVEL = 2;
export const ENEMY_BASE_EXP = 4;
export const ENEMY_EXP_GROW_RATE = 0.15;
export const DM_PER_LEVEL = 10;
export const ANTI_MISSILES_START_LV = 50;
export const ANTI_MISSILES_END_LV = 1000;
export const ANTI_MISSILES_START_PERCENTAGE = 0.1;
export const ANTI_MISSILES_END_PERCENTAGE = 100;

// Modules
export const PRICE_GROW_RATE = 1.06;
export const PRICE_GROW_RATE_2 = 1.03;
export const SIZE_MULTI = 0.2;
export const MODULE_ARMOUR = 200;
export const MODULE_SHIELD = 200;
export const MODULE_DAMAGE = 65;
export const DEFAULT_MODULE_PRICE = 5;
export const BASE_VELOCITY = 100;
export const BASE_ACCELERATION = 60;
export const BASE_THREAT = 150;
export const MIN_THREAT = 100;
export const UTILITY_MOD_DECREASE = 0.96;
export const BASE_CARGO = 2;
export const BASE_ADAPTIVE_PRECISION = 200;
export const BASE_PRECISION = 300;
export const DOUBLE_ENERGY_WEAPON_MULTI = 1.75;

export const NUKE_DAMAGE = MODULE_ARMOUR;

//  Researches
export const RESEARCH_BASE_PRICE = 0.1;
export const RESEARCH_LEVEL_MULTI = 1000;
export const RESEARCH_TECH_EFF = 0.1;
export const RESEARCH_ROBOTICS_MULTI = 0.1;
export const RESEARCH_TECH_MOD_MULTI = 0.3;
export const PROPULSION_SPEED_MULTI = 0.2;
export const TIER_ONE_RES_PRICE_MULTI = 10;
export const INSPIRATION_PERCENT = 0.35;
export const OPTIMIZED_SHIP_PREFIX = "op";
export const STANDARDIZED_SHIP_PREFIX = "st";
export const SPACE_STATION_UP_PREFIX = "u";
export const ORIGIN_1_TECH_MULTI = 2;
export const ORIGIN_1_TECH_2_MULTI = 1;
export const REPEATABLE_RES_PRICE_MULTI = 0.1;
export const MORE_DRONES_RESEARCH = 0.1;
export const MORE_DRONES_RESEARCH_2 = 0.15;

//  Buildings
export const ENERGY_STORAGE = 1e4;
export const STORAGE_DEPARTMENT_MULTI = 0.1;
export const COMPONENT_STORAGE = 1e3;
export const NUKE_STORAGE = 50;
export const METAL_BUILDING_PRICE = 1000;
export const ALLOY_BUILDING_PRICE = 1e4;

//  Megastructures
export const MEGA_PRICE_MULTI = 1e3;
export const MEGA_WORKER_MULTI = 0.4;
export const MEGA_EFF_MULTI = 0.1;
export const MEGA_NAVAL_MULTI = 0.2;
export const MEGA_SPEED_MULTI = 0.3;
export const MEGA_COMPUTING_MULTI = 0.2;

//  Computing
export const BASE_COMPUTING = 1e4;
export const COMPUTING_TECH_BONUS = 0.01;

//  Prestige
export const PRESTIGE_MULTI_PER_LEVEL = 0.1;
export const PRESTIGE_MULTI_EXP = 1.2;
export const PRESTIGE_PRICE = 10;
export const DRONE_PRESTIGE_START_OFFER = 0.15;
export const DRONE_PRESTIGE_PRODUCTION = 0.1;
export const DRONE_PRESTIGE_EFFICIENCY = 0.02;
export const TECH_PRESTIGE_MULTI = 0.5;
export const DISTRICT_PRESTIGE_MULTI = 0.5;
export const MATERIAL_PRESTIGE_MULTI = 5;
export const COMPONENT_PRESTIGE_MULTI = 0.3;
export const VELOCITY_PRESTIGE_MULTI = 0.12;
export const MORE_UP_PRESTIGE = 1;
export const SIX_HOURS = 3600 * 6;
export const BETTER_SPACE_STATION_PRESTIGE = 0.2;
export const AUTOMATION_UNLOCKED_LEVEL = 2;
export const MOD_LEVEL_PRESTIGE = 0.01;
export const SHIP_JOB_PRESTIGE = 0.01;
export const CIV_JOB_BUILD_SPEED = 0.01;
export const MEGA_JOB_BUILD_SPEED = 0.02;
export const MORE_PRODUCTION = 0.1;
export const SPEED_PRESTIGE = 0.01;
export const ACCELERATION_PRESTIGE = 0.01;
export const COMPUTING_BONUS = 1;
export const COMPUTING_SEC_BONUS = 0.02;
export const MAX_MOD_PRESTIGE = 0.01;
export const MAX_DRONES_PRESTIGE = 0.01;
export const FAST_SEARCH = 0.01;
export const ENERGY_PRODUCTION_PRESTIGE = 0.005;
export const ENERGY_STORAGE_PRESTIGE = 0.1;
export const MINING_PRESTIGE = 0.01;

//  Prestige Card
export const LEVEL_PER_CARD = 12;
export const PRODUCTION_CARD = 1;
export const PRODUCTION_PEACE_CARD = 1;
export const EFFICIENCY_CARD = 0.3;
export const MORE_DRONES_CARD = 2;
export const RECYCLING_CARD = 1;
export const TECHNOLOGY_CARD = 1;
export const DISTRICTS_CARD = 1;
export const MATERIALS_CARD = 2;
export const COMPONENTS_CARD = 1;
export const VICTORY_WARP_CARD = 0.5;
export const ENEMY_DEFEAT_WARP_CARD = VICTORY_WARP_CARD * 100 * 5;
export const NAVAL_CAP_CARD_MULTI = 0.2;
export const UPDATE_WARP_CARD = 1;
export const INSPIRATION_CARD = 0.7;
export const EXP_GAIN_CARD = 0.5;
export const DM_GAIN_CARD = 1;
export const SPELL_DURATION_CARD = 1;
export const COMPUTING_REGENERATION_CARD = 1;
export const COMPUTING_MAX_CARD = 1;
export const MORE_HAB_FROM_STATIONS = 10;
export const EXTRA_DISTRICTS_FROM_STATIONS = 0.1;
export const KILL_STREAK_SPEED_CARD = 0.02;
export const KILL_STREAK_GAIN_CARD = 0.02;
export const MEGA_BUILD_SPEED_CARD = 100;
export const CHALLENGE_XP_MULTI = 0.02;
export const EXTREME_MOD_TOTAL_MULTI = 0.1;
export const EXTREME_MOD_TOTAL_EXP = 2;

//  Challenges
export const CHALLENGE_REPEAT_LEVEL = 100;
export const CHALLENGE_REWARD_EXP = 1e4;
export const DRONE_CHALLENGE_REWARD = 0.1;
export const XS_CHALLENGE_REWARD = 0.2;
export const SCIENCE_CHALLENGE_LIMIT = 100;
export const SCIENCE_CHALLENGE_SCIENTIST_MULTI = 0.1;
export const SCIENCE_CHALLENGE_WAR_MULTI = 2;
export const NUKE_CHALLENGE_STORAGE_MULTI = 2;
export const NUKE_CHALLENGE_EFF_MULTI = 1;
export const ONE_SHOT_CHALLENGE_REWARD = 0.2;
export const NO_HAB_CHALLENGE_MULTI = 5;
export const ANTI_ARMOUR_SHELL_LEVEL = 2;
export const ANTI_SHIELD_SHELL_LEVEL = 6;
export const EXPANDING_CHALLENGE_DOUBLING_TIME = 15 * 60;
export const EXPANDING_CHALLENGE_REWARD = 0.3;
export const SPACE_PORT_LEVEL = 3;
export const SKYHOOK_LEVEL = 4;
export const ROTATING_SKYHOOK_LEVEL = 6;
export const SUPER_TETHER_LEVEL = 8;
export const INFRASTRUCTURE_AUTO_LEVEL = 3;
export const NO_MULTIPLIER_MULTI = 0.15;

export const PRESTIGE_POINT_QUANTITY = new Decimal(1e3);
export const PRESTIGE_TECH_UNLOCK = 1e4;
export const MORE_STORAGE_PRESTIGE = 0.2;
export const MORE_STORAGE_CARD = 1e3;
