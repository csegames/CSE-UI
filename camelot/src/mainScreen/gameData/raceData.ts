/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

export interface RaceData {
  id: string;
  standingImages: {
    bodyTypeID: string;
    image: string;
  }[];
  equippedBodyImages: {
    bodyTypeID: string;
    image: string;
  }[];
  portraits: {
    bodyTypeID: string;
    image: string;
  }[];
}

const raceData: RaceData[] = [
  {
    id: 'HumanMaleA',
    standingImages: [
      { bodyTypeID: 'Male', image: '/dynamic/races/assets/paperdoll/Arth_human_male_nude.png' },
      { bodyTypeID: 'Female', image: '/dynamic/races/assets/paperdoll/Arth_human_female_nude.png' }
    ],
    equippedBodyImages: [
      { bodyTypeID: 'Male', image: '/dynamic/races/assets/equipped-body-m-humana.png' },
      { bodyTypeID: 'Female', image: '/dynamic/races/assets/equipped-body-f-humana.png' }
    ],
    portraits: [
      { bodyTypeID: 'Male', image: '/dynamic/races/assets/portrait-human-1-arthurian.png' },
      { bodyTypeID: 'Female', image: '/dynamic/races/assets/portrait-human-2-arthurian.png' }
    ]
  },
  {
    id: 'Golem',
    standingImages: [
      { bodyTypeID: 'Male', image: '/dynamic/races/assets/paperdoll/Golem_male_nude.png' },
      { bodyTypeID: 'Female', image: '/dynamic/races/assets/paperdoll/Golem_female_nude.png' }
    ],
    equippedBodyImages: [
      { bodyTypeID: 'Male', image: '/dynamic/races/assets/equipped-body-m-golem.png' },
      { bodyTypeID: 'Female', image: '/dynamic/races/assets/equipped-body-f-golem.png' }
    ],
    portraits: [
      { bodyTypeID: 'Male', image: '/dynamic/races/assets/portrait-golem-1-arthurian.png' },
      { bodyTypeID: 'Female', image: '/dynamic/races/assets/portrait-golem-2-arthurian.png' }
    ]
  },
  {
    id: 'Stormrider',
    standingImages: [
      { bodyTypeID: 'Male', image: '/dynamic/races/assets/paperdoll/Stormrider_male_nude.png' },
      { bodyTypeID: 'Female', image: '/dynamic/races/assets/paperdoll/Stormrider_female_nude.png' }
    ],
    equippedBodyImages: [
      { bodyTypeID: 'Male', image: '/dynamic/races/assets/equipped-body-m-stormrider.png' },
      { bodyTypeID: 'Female', image: '/dynamic/races/assets/equipped-body-f-stormrider.png' }
    ],
    portraits: [
      { bodyTypeID: 'Male', image: '/dynamic/races/assets/portrait-stormrider-1-arthurian.png' },
      { bodyTypeID: 'Female', image: '/dynamic/races/assets/portrait-stormrider-2-arthurian.png' }
    ]
  },
  {
    id: 'Firbog',
    standingImages: [
      { bodyTypeID: 'Male', image: '/dynamic/races/assets/paperdoll/Firbog_male_nude.png' },
      { bodyTypeID: 'Female', image: '/dynamic/races/assets/paperdoll/Firbog_female_nude.png' }
    ],
    equippedBodyImages: [
      { bodyTypeID: 'Male', image: '/dynamic/races/assets/equipped-body-m-firbog.png' },
      { bodyTypeID: 'Female', image: '/dynamic/races/assets/equipped-body-f-firbog.png' }
    ],
    portraits: [
      { bodyTypeID: 'Male', image: '/dynamic/races/assets/portrait-firbog-1-tdd.png' },
      { bodyTypeID: 'Female', image: '/dynamic/races/assets/portrait-firbog-2-tdd.png' }
    ]
  },
  {
    id: 'HumanMaleT',
    standingImages: [
      { bodyTypeID: 'Male', image: '/dynamic/races/assets/paperdoll/TDD_human_male_nude.png' },
      { bodyTypeID: 'Female', image: '/dynamic/races/assets/paperdoll/TDD_human_female_nude.png' }
    ],
    equippedBodyImages: [
      { bodyTypeID: 'Male', image: '/dynamic/races/assets/equipped-body-m-humant.png' },
      { bodyTypeID: 'Female', image: '/dynamic/races/assets/equipped-body-f-humant.png' }
    ],
    portraits: [
      { bodyTypeID: 'Male', image: '/dynamic/races/assets/portrait-human-1-tdd.png' },
      { bodyTypeID: 'Female', image: '/dynamic/races/assets/portrait-human-2-tdd.png' }
    ]
  },
  {
    id: 'Luchorpan',
    standingImages: [
      { bodyTypeID: 'Male', image: '/dynamic/races/assets/paperdoll/Luchorpan_male_nude.png' },
      { bodyTypeID: 'Female', image: '/dynamic/races/assets/paperdoll/Luchorpan_female_nude.png' }
    ],
    equippedBodyImages: [
      { bodyTypeID: 'Male', image: '/dynamic/races/assets/equipped-body-m-luchorpan.png' },
      { bodyTypeID: 'Female', image: '/dynamic/races/assets/equipped-body-f-luchorpan.png' }
    ],
    portraits: [
      { bodyTypeID: 'Male', image: '/dynamic/races/assets/portrait-luchorpan-1-tdd.png' },
      { bodyTypeID: 'Female', image: '/dynamic/races/assets/portrait-luchorpan-2-tdd.png' }
    ]
  },
  {
    id: 'HumanMaleV',
    standingImages: [
      { bodyTypeID: 'Male', image: '/dynamic/races/assets/paperdoll/Viking_human_male_nude.png' },
      { bodyTypeID: 'Female', image: '/dynamic/races/assets/paperdoll/Viking_human_female_nude.png' }
    ],
    equippedBodyImages: [
      { bodyTypeID: 'Male', image: '/dynamic/races/assets/equipped-body-m-humanv.png' },
      { bodyTypeID: 'Female', image: '/dynamic/races/assets/equipped-body-f-humanv.png' }
    ],
    portraits: [
      { bodyTypeID: 'Male', image: '/dynamic/races/assets/portrait-human-1-viking.png' },
      { bodyTypeID: 'Female', image: '/dynamic/races/assets/portrait-human-2-viking.png' }
    ]
  },
  {
    id: 'Jotnar',
    standingImages: [
      { bodyTypeID: 'Male', image: '/dynamic/races/assets/paperdoll/Jotnar_male_nude.png' },
      { bodyTypeID: 'Female', image: '/dynamic/races/assets/paperdoll/Jotnar_female_nude.png' }
    ],
    equippedBodyImages: [
      { bodyTypeID: 'Male', image: '/dynamic/races/assets/equipped-body-m-jotnar.png' },
      { bodyTypeID: 'Female', image: '/dynamic/races/assets/equipped-body-f-jotnar.png' }
    ],
    portraits: [
      { bodyTypeID: 'Male', image: '/dynamic/races/assets/portrait-frostgiant-1-viking.png' },
      { bodyTypeID: 'Female', image: '/dynamic/races/assets/portrait-frostgiant-2-viking.png' }
    ]
  },
  {
    id: 'Dvergr',
    standingImages: [
      { bodyTypeID: 'Male', image: '/dynamic/races/assets/paperdoll/Dvergr_male_nude.png' },
      { bodyTypeID: 'Female', image: '/dynamic/races/assets/paperdoll/Dvergr_female_nude.png' }
    ],
    equippedBodyImages: [
      { bodyTypeID: 'Male', image: '/dynamic/races/assets/equipped-body-m-dvergr.png' },
      { bodyTypeID: 'Female', image: '/dynamic/races/assets/equipped-body-f-dvergr.png' }
    ],
    portraits: [
      { bodyTypeID: 'Male', image: '/dynamic/races/assets/portrait-dvergr-1-viking.png' },
      { bodyTypeID: 'Female', image: '/dynamic/races/assets/portrait-dvergr-2-viking.png' }
    ]
  }
];

export const getRaceData = (raceID: string | null): RaceData | undefined => raceData.find((race) => race.id === raceID);
