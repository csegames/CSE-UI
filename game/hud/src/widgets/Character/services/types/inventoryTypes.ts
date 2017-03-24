export interface BasicItemStats {
  quality?: number;
  mass?: number;
  massPCF?: number;
  encumberance?: number;
  hardness?: number;
  melleability?: number;
  meltingPoints?: number;
  density?: number;
  agilityRequirement?: number;
  dexterityRequirement?: number;
  strengthRequirement?: number;
  unitCount?: number;
}

export interface SubstanceStats {
  hardness?: number;
  impactToughness?: number;
  fractureChange?: number;
  malleability?: number;
  massPCF?: number;
  density?: number;
  meltingPoint?: number;
  thermConductivity?: number;
  slashingResistance?: number;
  piercingResistance?: number;
  crushingResistance?: number;
  acidResistance?: number;
  poisonResistance?: number;
  diseaseResistance?: number;
  earthResistance?: number;
  waterResistance?: number;
  fireResistance?: number;
  airResistance?: number;
  lightningResistance?: number;
  frostResistance?: number;
  lifeResistance?: number;
  mindResistance?: number;
  spiritResistance?: number;
  radiantResistance?: number;
  deathResistance?: number;
  shadowResistance?: number;
  chaosResistance?: number;
  voidResistance?: number;
  arcaneResistance?: number;
  magicalResistance?: number;
  hardnessFactor?: number;
  strengthFactor?: number;
  fractureFactor?: number;
  massFactor?: number;
}

export interface SubstanceItemStats extends BasicItemStats {
  substance?: SubstanceStats;
}

export interface AlloyItemStats extends SubstanceItemStats {
  alloy?: SubstanceStats;
}

export interface DurabilityStats {
  maxRepairPoints?: number;
  maxDurability?: number;
  fractureThreshold?: number;
  fractureChance?: number;
  currentRepairPoints?: number;
  currentDurabilty?: number;
}

export interface WeaponStats {
  piercingDamage?: number;
  piercingBleed?: number;
  piercingArmorPenetration?: number;
  slashingDamage?: number;
  slashingBleed?: number;
  slashingArmorPenetration?: number;
  crushingDamage?: number;
  fallbackCrushingDamage?: number;
  disruption?: number;
  deflectionAmount?: number;
  physicalProjectileSpeed?: number;
  knockbackAmount?: number;
  stability?: number;
  fallOffMinDistance?: number;
  fallOffMaxDistance?: number;
  fallOffReduction?: number;
  deflectionRecovery?: number;
  staminaCost?: number;
  physicalPreparationTime?: number;
  physicalRecoveryTime?: number;
  range?: number;
}

export interface WeaponItemStats extends AlloyItemStats {
  durability?: DurabilityStats;
  weapon?: WeaponStats;
}

export interface DamageTypeValues {
  none?: number;
  slashing?: number;
  piercing?: number;
  crushing?: number;
  physical?: number;
  acid?: number;
  poison?: number;
  disease?: number;
  earth?: number;
  water?: number;
  fire?: number;
  air?: number;
  lightning?: number;
  frost?: number;
  elemental?: number;
  life?: number;
  mind?: number;
  spirit?: number;
  radiant?: number;
  light?: number;
  death?: number;
  shadow?: number;
  chaos?: number;
  void?: number;
  dark?: number;
  arcane?: number;
  other?: number;
  sYSTEM?: number;
  all?: number;
}

export interface ArmorPartStats {
  armorClass?: number;
  resistances?: DamageTypeValues;
  mitigations?: DamageTypeValues;
}

export interface ArmorStats {
  neck?: ArmorPartStats;
  face?: ArmorPartStats;
  shoulderRightUnder?: ArmorPartStats;
  waist?: ArmorPartStats;
  back?: ArmorPartStats;
  thighsUnder?: ArmorPartStats;
  forearmRightUnder?: ArmorPartStats;
  forearmLeft?: ArmorPartStats;
  feetUnder?: ArmorPartStats;
  feet?: ArmorPartStats;
  handLeft?: ArmorPartStats;
  chest?: ArmorPartStats;
  forearmRight?: ArmorPartStats;
  backUnder?: ArmorPartStats;
  skullUnder?: ArmorPartStats;
  shoulderLeft?: ArmorPartStats;
  waistUnder?: ArmorPartStats;
  shins?: ArmorPartStats;
  neckUnder?: ArmorPartStats;
  handRightUnder?: ArmorPartStats;
  forearmLeftUnder?: ArmorPartStats;
  cloak?: ArmorPartStats;
  shoulderLeftUnder?: ArmorPartStats;
  chestUnder?: ArmorPartStats;
  handRight?: ArmorPartStats;
  shoulderRight?: ArmorPartStats;
  skull?: ArmorPartStats;
  thighs?: ArmorPartStats;
  handLeftUnder?: ArmorPartStats;
  shinsUnder?: ArmorPartStats;
  faceUnder?: ArmorPartStats;
}

export interface ArmorItemStats extends AlloyItemStats {
  durability?: DurabilityStats;
  armor?: ArmorStats;
}

export type ItemStats = BasicItemStats & SubstanceItemStats & AlloyItemStats & WeaponItemStats & ArmorItemStats;

export interface ItemInfo {
  id: string;
  name: string;
  icon?: string;
  stats?: ItemStats;
  itemType: string;
  gearSlot?: string[];
  description?: string;
  container?: {
    capacity?: number;
    items?: ItemInfo[];
  };
}

export interface ItemMap {
  [id: string]: ItemInfo;
}

export interface StackMap {
  [id: string]: string[];
}

export interface InventoryItemsMap {
  [itemType: string]: ItemMap;
}
