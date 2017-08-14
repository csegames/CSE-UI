import { ql } from 'camelot-unchained';

export interface TestCharacterStats {
  stats: {
    defense: TestDefenseStatsInterface;
    offense: TestOffenseStatsInterface;
  };
}

export interface TestDefenseStatsInterface {
  resistances: TestBodyPartStats;
  mitigations: TestBodyPartStats;
}

export interface TestOffenseStatsInterface {
  PrimaryHandWeapon: Partial<ql.schema.WeaponStat_Single>;
  SecondaryHandWeapon: Partial<ql.schema.WeaponStat_Single>;
}

export interface TestBodyPartStats {
  head: Partial<ql.schema.DamageType_Single>;
  torso: Partial<ql.schema.DamageType_Single>;
  leftArm: Partial<ql.schema.DamageType_Single>;
  rightArm: Partial<ql.schema.DamageType_Single>;
  leftLeg: Partial<ql.schema.DamageType_Single>;
  rightLeg: Partial<ql.schema.DamageType_Single>;
}

const testDamageTypeValues: Partial<ql.schema.DamageType_Single> = {
  slashing: 0.64,
  piercing: 0.64,
  crushing: 0.64,
  physical: 0,
  acid: 0,
  poison: 0,
  disease: 0,
  earth: 0.4052083,
  water: 0.4052083,
  fire: 0.414914,
  air: 0.4052083,
  lightning: 0.4052083,
  frost: 0.4052083,
  elemental: 0,
  life: 0.35,
  mind: 0.35,
  spirit: 0.35,
  radiant: 0.35,
  light: 0,
  death: 0.35,
  shadow: 0.35,
  chaos: 0.35,
  void: 0.35,
  dark: 0,
  arcane: 0.35,
};

const weaponStat: Partial<ql.schema.WeaponStat_Single> = {
  piercingDamage: 0,
  piercingBleed: 0,
  piercingArmorPenetration: 0,
  slashingDamage: 2400,
  slashingBleed: 960,
  slashingArmorPenetration: 4.8,
  crushingDamage: 0,
  fallbackCrushingDamage: 1520,
  disruption: 640,
  deflectionAmount: 160,
  physicalProjectileSpeed: 6.4,
  knockbackAmount: 1600,
  stability: 960,
  falloffMinDistance: 0,
  falloffMaxDistance: 0,
  falloffReduction: 0,
  deflectionRecovery: 108,
  staminaCost: 2160,
  physicalPreparationTime: 2.25,
  physicalRecoveryTime: 4.5,
  range: 3,
};

const testBodyPartData: TestBodyPartStats = {
  head: {
    ...testDamageTypeValues,
  },
  torso: {
    ...testDamageTypeValues,
  },
  leftArm: {
    ...testDamageTypeValues,
  },
  rightArm: {
    ...testDamageTypeValues,
  },
  leftLeg: {
    ...testDamageTypeValues,
  },
  rightLeg: {
    ...testDamageTypeValues,
  },
};

const testCharacterStatsData: TestCharacterStats = {
  stats: {
    defense: {
      resistances: {
        ...testBodyPartData,
      },

      mitigations: {
        ...testBodyPartData,
      },
    },
    offense: {
      PrimaryHandWeapon: {
        ...weaponStat,
      },
      SecondaryHandWeapon: {
        ...weaponStat,
      },
    },
  },
};

export default testCharacterStatsData;
