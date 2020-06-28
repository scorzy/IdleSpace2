//  Utility
export const ZERO = new Decimal(0);
export const ONE = new Decimal(1);
export const TEN = new Decimal(10);
export const INFINITY = new Decimal(Number.POSITIVE_INFINITY);

//  Units
export const UNIT_PRICE_GROW_RATE = 1.1;
export const RESEARCH_GROW_RATE = 1.1;
export const SPACE_STATION_PRICE = 1e6;
export const SPACE_STATION_HAB_SPACE = 1e3;
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

//  FLEETS
export const BASE_NAVAL_CAPACITY = 50;
export const FLEET_NUMBER = 5;
export const FLEET_CAPACITY = 5e3;
export const FLEET_CAPACITY_MULTI = 10;

//  Ships
export const BASE_ARMOUR = 100;
export const BASE_SHIP_PRICE = 40;
export const BASE_EXPLOSION = BASE_ARMOUR;
export const OPTIMIZE_RES_BONUS = 0.5;

//  Search and enemies
export const SEARCH_JOB_PRICE = 100;
export const EXTRA_OPT_EXP = 1.07;
export const ENEMY_NAVAL_CAP_LEVEL = 50;
export const ENEMY_BASE_DISTANCE = new Decimal(50);
export const MOD_LEVEL_EXP = 1.045;
export const DEFENCE_START_LEVEL = 14;
export const DEFENCE_FINAL_LEVEL = 65;
export const DEFENCE_MAX_PERCENT = 0.3;
export const DISTRICT_MAX_OPT_END = 80;
export const DISTRICT_MIN_OPT_END = 40;
export const SCIENCE_DISTRICT_MULTI = 0.6;
export const COMPONENTS_DISTRICT_MULTI = 0.4;
export const MAX_SEARCH_JOB = 10;

// Modules
export const PRICE_GROW_RATE = 1.05;
export const SIZE_MULTI = 0.2;
export const MODULE_ARMOUR = 200;
export const MODULE_SHIELD = 200;
export const MODULE_DAMAGE = 65;
export const DEFAULT_MODULE_PRICE = 5;
export const BASE_VELOCITY = 100;
export const BASE_ACCELERATION = 1;
export const BASE_THREAT = 150;
export const MIN_THREAT = 100;
export const UTILITY_MOD_DECREASE = 0.96;
export const BASE_CARGO = 1;
export const BASE_ADAPTIVE_PRECISION = 700;

export const NUKE_DAMAGE = MODULE_ARMOUR * 100;

//  Researches
export const RESEARCH_BASE_PRICE = 1;
export const RESEARCH_LEVEL_MULTI = 1000;
export const RESEARCH_TECH_EFF = 0.1;
export const RESEARCH_ROBOTICS_MULTI = 0.1;
export const RESEARCH_TECH_MOD_MULTI = 0.3;
export const PROPULSION_SPEED_MULTI = 0.2;
export const TIER_ONE_RES_PRICE_MULTI = 10;
export const INSPIRATION_PERCENT = 0.35;
export const OPTIMIZED_SHIP_PREFIX = "op";
export const SPACE_STATION_UP_PREFIX = "u";
export const ORIGIN_1_TECH_MULTI = 1;
export const ORIGIN_1_TECH_2_MULTI = 0.5;

//  Buildings
export const ENERGY_STORAGE = 1e4;
export const STORAGE_DEPARTMENT_MULTI = 0.4;
export const COMPONENT_STORAGE = 1e3;
export const NUKE_STORAGE = 100;
export const METAL_BUILDING_PRICE = 1000;
export const ALLOY_BUILDING_PRICE = 1e3;

//  Megastructures
export const MEGA_PRICE_MULTI = 1e3;

//  Computing
export const BASE_COMPUTING = 1e4;
export const COMPUTING_TECH_BONUS = 0.01;
