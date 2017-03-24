
export interface Slots {
  invalid: string;
  skull: string;
  face: string;
  neck: string;
  chest: string;
  back: string;
  waist: string;
  forearmLeft: string;
  forearmRight: string;
  shoulderLeft: string;
  shoulderRight: string;
  handLeft: string;
  handRight: string;
  shins: string;
  thighs: string;
  feet: string;
  skullUnder: string;
  faceUnder: string;
  neckUnder: string;
  chestUnder: string;
  backUnder: string;
  waistUnder: string;
  forearmLeftUnder: string;
  forearmRightUnder: string;
  shoulderLeftUnder: string;
  shoulderRightUnder: string;
  handLeftUnder: string;
  handRightUnder: string;
  shinsUnder: string;
  thighsUnder: string;
  feetUnder: string;
  primaryHandWeapon: string;
  secondaryHandWeapon: string;
}

const slots: Slots = {
  invalid: 'invalid',
  skull: 'skull',
  face: 'face',
  neck: 'neck',
  chest: 'chest',
  back: 'back',
  waist: 'waist',
  forearmLeft: 'forearmLeft',
  forearmRight: 'forearmRight',
  shoulderLeft: 'shoulderLeft',
  shoulderRight: 'shoulderRight',
  handLeft: 'handLeft',
  handRight: 'handRight',
  shins: 'shins',
  thighs: 'thighs',
  feet: 'feet',
  skullUnder: 'skullUnder',
  faceUnder: 'faceUnder',
  neckUnder: 'neckUnder',
  chestUnder: 'chestUnder',
  backUnder: 'backUnder',
  waistUnder: 'waistUnder',
  forearmLeftUnder: 'forearmLeftUnder',
  forearmRightUnder: 'foreArmRightUnder',
  shoulderLeftUnder: 'shoulderLeftUnder',
  shoulderRightUnder: 'shoulderRightUnder',
  handLeftUnder: 'handLeftUnder',
  handRightUnder: 'handRightUnder',
  shinsUnder: 'shinsUnder',
  thighsUnder: 'thighsUnder',
  feetUnder: 'feetUnder',
  primaryHandWeapon: 'primaryHandWeapon',
  secondaryHandWeapon: 'secondaryHandWeapon',
};

export default slots;

// const itemsWrapper = {
//   items: {
//     helmet: {
//       id: 'helmet',
//       icon: 'http://camelot-unchained.s3.amazonaws.com/icons/components/Empath/Empath_Selfdirect.png',
//       slot: {  },
//     },
//     'helmet2': {
//       id: 'helmet2',
//       icon: 'http://camelot-unchained.s3.amazonaws.com/icons/components/Empath/Empath_Balanced-Crystal.png',
//       slot: {
//         skull: slots.skull,
//         face: slots.face,
//       },
//     },
//     shirt: {
//       id: 'shirt',
//       icon: 'http://camelot-unchained.s3.amazonaws.com/icons/components/Empath/Empath_Intense-Burst.png',
//       slot: {
//         chest: slots.chest,
//       },
//     },
//     'shirt2': {
//       id: 'shirt2',
//       icon: 'http://camelot-unchained.s3.amazonaws.com/icons/components/Empath/Empath_Introspective-Meditation.png',
//       slot: {
//         chest: slots.chest,
//       },
//     },
//     leftglove: {
//       id: 'leftglove',
//       icon: 'http://camelot-unchained.s3.amazonaws.com/icons/components/Empath/Empath_Open-Hand.png',
//       slot: slots.HandLeft | slots.ForearmLeft,
//     },
//     'leftglove2': {
//       id: 'leftglove2',
//       icon: 'http://camelot-unchained.s3.amazonaws.com/icons/components/Empath/Empath_Orbiting-Spheres.png',
//       slot: slots.HandLeft | slots.ForearmLeft,
//     },
//     rightglove: {
//       id: 'rightglove',
//       icon: 'http://camelot-unchained.s3.amazonaws.com/icons/components/Empath/Empath_Simulacrum-Transposition.png',
//       slot: slots.HandRight | slots.ForearmRight,
//     },
//     'rightglove2': {
//       id: 'rightglove2',
//       icon: 'http://camelot-unchained.s3.amazonaws.com/icons/components/Empath/Empath_Sigil-of-Lore.png',
//       slot: slots.HandRight | slots.ForearmRight,
//     },
//     pants: {
//       id: 'pants',
//       icon: 'http://camelot-unchained.s3.amazonaws.com/icons/components/Empath/Empath_Urgent-Vigor.png',
//       slot: slots.Shins | slots.Thighs | slots.Waist,
//     },
//     'pants2': {
//       id: 'pants2',
//       icon: 'http://camelot-unchained.s3.amazonaws.com/icons/components/Empath/Empath_Intense-Cone.png',
//       slot: slots.Shins | slots.Thighs | slots.Waist,
//     },
//     boots: {
//       id: 'boots',
//       icon: 'http://camelot-unchained.s3.amazonaws.com/icons/components/Empath/Empath_Introspective-Affliction.png',
//       slot: slots.Feet,
//     },
//     'boots2': {
//       id: 'boots2',
//       icon: 'http://camelot-unchained.s3.amazonaws.com/icons/components/Empath/Empath_Shining-Scale.png',
//       slot: slots.Feet,
//     },
//   },

//   inventory: [
//     'helmet',
//     'helmet2',
//   ],

//   equipped: [
//     'helmet',
//   ],
// };

// export default itemsWrapper;
