/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { AbilityBuilderQuery } from 'gql/interfaces';

const ADJECTIVE_LIST = [
  'Adamant',
  'Adroit',
  'Adumbrated',
  'Alluring',
  'Animalistic',
  'Antediluvian',
  'Archaic',
  'Authentic',
  'Awesome',
  'Backwards',
  'Baleful',
  'Bellicose',
  'Bilious',
  'Bitter',
  'Blasphemous',
  'Bleak',
  'Blue',
  'Brave',
  'Brutish',
  'Bulbous',
  'Bumpy',
  'Calamitous',
  'Catawampus',
  'Caustic',
  'Cold-brewed',
  'Comely',
  'Corpulent',
  'Consuming',
  'Crapulous',
  'Crazy',
  'Cringeworthy',
  'Cruel',
  'Daft',
  'Daunting',
  'Deceptive',
  'Decrepit',
  'Deep',
  'Defamatory',
  'Demoniac',
  'Dirty',
  'Disappointed',
  'Doughty',
  'Draconian',
  'Effervescent',
  'Egregious',
  'Electric',
  'Elusive',
  'Enchanting',
  'Endemic',
  'Enduring',
  'Enormous',
  'Ephemeral',
  'Excruciating',
  'Execrable',
  'Existential',
  'Fantastic',
  'Fastidious',
  'Feckless',
  'Fecund',
  'Fierce',
  'Fleeting',
  'Fortuitous',
  'Fractious',
  'Friendly',
  'Fungal',
  'Fuzzy',
  'Garrulous',
  'Gelatinous',
  'Gibbous',
  'Gleaming',
  'Greasy',
  'Groovy',
  'Grueling',
  'Grumpy',
  'Guileless',
  'Hairy',
  'Hard',
  'Hilarious',
  'Hip',
  'Hissing',
  'Histrionic',
  'Hot',
  'Hubristic',
  'Husky',
  'Ill-Conceived',
  'Illusive',
  'Improbable',
  'Inconsequential',
  'Insidious',
  'Insolent',
  'Intransigent',
  'Ironic',
  'Irksome',
  'Itchy',
  'Jocular',
  'Judicious',
  'Juicy',
  'Lachrymose',
  'Limp',
  'Loquacious',
  'Loving',
  'Lugubrious',
  'Luminous',
  'Mad',
  'Manic',
  'Meaty',
  'Mendacious',
  'Menial',
  'Mesmeric',
  'Moist',
  'Narcissistic',
  'Naughty',
  'Nefarious',
  'Nervous',
  'Non-Euclidean',
  'Noxious',
  'Nutritious',
  'Obnoxious',
  'Obtuse',
  'Obvious',
  'Octarine',
  'Odd',
  'Outlandish',
  'Parasitic',
  'Parsimonious',
  'Pedantic',
  'Pendulous',
  'Perilous',
  'Pernicious',
  'Pervasive',
  'Petulant',
  'Platitudinous',
  'Prickly',
  'Puckish',
  'Pugnacious',
  'Querulous',
  'Quilted',
  'Radical',
  'Raucous',
  'Redolent',
  'Repulsive',
  'Resounding',
  'Resplendent',
  'Ripe',
  'Ruminative',
  'Sad',
  'Sagacious',
  'Seaworthy',
  'Serendipitous',
  'Serpentine',
  'Shaggy',
  'Slippery',
  'Smarmy',
  'Spasmodic',
  'Strident',
  'Succulent',
  'Sundered',
  'Sisyphean',
  'Taciturn',
  'Tenacious',
  'Testy',
  'Throbbing',
  'Tight',
  'Titillating',
  'Tremulous',
  'Trenchant',
  'Tubular',
  'Turbulent',
  'Turgid',
  'Ubiquitous',
  'Unholy',
  'Unlikely',
  'Unrelenting',
  'Unwise',
  'Verdant',
  'Visceral',
  'Voluble',
  'Voracious',
  'Warty',
  'Well-mannered',
  'Wet',
  'Wheedling',
  'Whimsical',
  'Wicked',
  'Withering',
  'Wretched',
  'Wondrous',
  'Zealous',
];

function selectRandomAdjective() {
  const selectedIndex = Math.floor((Math.random() * ADJECTIVE_LIST.length));
  return ADJECTIVE_LIST[selectedIndex];
}

export function generateRandomAbilityName(componentOne: AbilityBuilderQuery.AbilityComponents,
                                          componentTwo?: AbilityBuilderQuery.AbilityComponents) {
  const primary = componentOne;
  const secondary = componentTwo;
  if (!primary) {
    return '';
  }
  const s1 = '';
  let s3 = primary.display.name;
  if (primary.display.name.indexOf('ness', primary.display.name.length - 4) !== -1) {
    s3 = primary.display.name.slice(0, -4);
  }
  const s4 = selectRandomAdjective();

  let whole = s1.concat(' of ').concat(s4).concat(' ').concat(s3).concat('ness');

  if (!secondary) {
    whole = selectRandomAdjective().concat(' ').concat(whole);
  } else {
    const s2 = secondary.display.name;
    whole = s2.concat(whole);
  }

  if (whole.length > 100) {
    return 'New ability';
  }

  return whole;
}

export interface NetworkRequirementResult {
  meetsRequireTagReq: boolean;
  meetsExcludeTagReq: boolean;
  meetsRequireComponentReq: boolean;
  meetsExcludeComponentReq: boolean;
  isAnExcludeTag: { result: boolean, reason: string, component: AbilityBuilderQuery.AbilityComponents };
  isAnExcludeComponent: { result: boolean, component: AbilityBuilderQuery.AbilityComponents };
}

export function checkNetworkRequirements(component: AbilityBuilderQuery.AbilityComponents,
                                          selectedComponentsList: AbilityBuilderQuery.AbilityComponents[]) {
  let meetsRequireTagReq = true;
  let meetsExcludeTagReq = true;
  let meetsRequireComponentReq = true;
  let meetsExcludeComponentReq = true;

  // check if the new component will be compatible with all the other current components (minus existing components which share the category)
  // to do this, we make a new list of what the ability would be if "component" was used in the ability.
  const newComponentList : AbilityBuilderQuery.AbilityComponents[] = selectedComponentsList.filter(
    selectedComponent => selectedComponent.abilityComponentCategory.id != component.abilityComponentCategory.id);

  newComponentList.push(component);

  newComponentList.forEach((selectedComponent) => {
    selectedComponent.networkRequirements.forEach((networkRequirement) => {
      if (networkRequirement.requireComponent) {
        if (!newComponentList.find(c => c.id === networkRequirement.requireComponent.component.id)) {
          // Component must be added in order for this component to be available.
          meetsRequireComponentReq = false;
        }
      }
  
      if (networkRequirement.excludeComponent) {
        if (newComponentList.find(c => c.id === networkRequirement.excludeComponent.component.id)) {
          // If a component is selected in the exclude list, this component can not be selected.
          meetsExcludeComponentReq = false;
        }
      }
  
      if (networkRequirement.requireTag) {
        if (!newComponentList.find(c => c.id != selectedComponent.id && c.abilityTags.includes(networkRequirement.requireTag.tag))) {
          // Component with this tag must be selected for this component to be available.
          meetsRequireTagReq = false;
        }
      }
  
      if (networkRequirement.excludeTag) {
        if (!newComponentList.find(c => c.id != selectedComponent.id && c.abilityTags.includes(networkRequirement.excludeTag.tag))) {
          // If a component is selected that contains a tag in the exclude list, this component can not be selected.
          meetsExcludeTagReq = false;
        }
      }
    });
  });

  let isAnExcludeTag: { result: boolean, reason: string, component: AbilityBuilderQuery.AbilityComponents } = {
    result: false,
    reason: '',
    component: null,
  };
  let isAnExcludeComponent: { result: boolean, component: AbilityBuilderQuery.AbilityComponents } = {
    result: false,
    component: null,
  };
  // Now check selected components to see if they disable any other components
  selectedComponentsList.forEach((selectedComponent) => {
    selectedComponent.networkRequirements.forEach((requirement) => {
      if (requirement.excludeTag && component.abilityTags.includes(requirement.excludeTag.tag)) {
        isAnExcludeTag = {
          result: true,
          reason: requirement.excludeTag.tag,
          component: selectedComponent,
        };
      }

      if (requirement.excludeComponent && component.id === requirement.excludeComponent.component.id) {
        isAnExcludeComponent = {
          result: true,
          component: selectedComponent,
        };
      }
    });
  });

  return {
    meetsRequireTagReq,
    meetsExcludeTagReq,
    meetsRequireComponentReq,
    meetsExcludeComponentReq,
    isAnExcludeTag,
    isAnExcludeComponent,
  } as NetworkRequirementResult;
}
