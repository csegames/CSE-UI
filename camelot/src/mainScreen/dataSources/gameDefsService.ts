/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
import {
  gameDefsQuery,
  GameDefsQueryResult,
  myCharacterAbilitiesQuery,
  MyCharacterAbilitiesQueryResult,
  statusesQuery,
  StatusesQueryResult,
  MyCharacterStatsQueryResult,
  myCharacterStatsQuery
} from './gameDefsNetworkingConstants';
import {
  updateFactions,
  updateClasses,
  updateRaces,
  FactionData,
  updateStatuses,
  ItemDefRefData,
  SubstanceDefRefData,
  updateItems,
  updateAbilityDisplayData,
  updateAbilityNetworks,
  AbilityComponentDefRefData,
  updateAbilityComponents,
  AbilityNetworkRequirementsGQLData,
  AbilityNetworkDefData,
  updateAbilityIconURLs,
  setShouldRefetchMyCharacterAbilities,
  updateItemStats,
  updateEntityResources,
  updateItemTooltipCategories,
  updateStats,
  updateMyStats,
  updateSettings,
  updateGearSlots,
  AbilityDisplayData,
  updateAbilityBookTabs,
  updateDamageTypes,
  updateClassDynamicAssets,
  updateGenders
} from '../redux/gameDefsSlice';
import { Dictionary } from '@csegames/library/dist/_baseGame/types/ObjectMap';
import { clientAPI } from '@csegames/library/dist/camelotunchained/MainScreenClientAPI';
import {
  AbilityBookTabsData,
  AbilityNetworksData,
  FactionsData,
  UserClassesData
} from '@csegames/library/dist/_baseGame/clientFunctions/AssetFunctions';
import {
  CharacterStatField,
  GearSlot,
  EntityResourceDefinitionGQL,
  ItemStatDefinitionGQL,
  ItemTooltipCategoryDef,
  StatDefinitionGQL,
  StatusDef,
  DamageTypeDefGQL,
  ClassDefGQL,
  RaceDefGQL,
  GenderDefGQL
} from '@csegames/library/dist/camelotunchained/graphql/schema';
import { InitTopic } from '../redux/initializationSlice';
import ExternalDataSource from '../redux/externalDataSource';
import { ListenerHandle } from '@csegames/library/dist/_baseGame/listenerHandle';
import { RequestConfig, RequestResult } from '@csegames/library/dist/_baseGame/types/Request';
import { RootState } from '../redux/store';
import { Dispatch } from '@reduxjs/toolkit';
import { request } from '@csegames/library/dist/_baseGame/utils/request';
import { xml2json } from 'xml-js';
import { connect } from 'react-redux';

const ICONS_URL = 'http://camelot-unchained.s3.amazonaws.com/?prefix=game/4/icons/skills';
const ICONS_URL2 = 'http://camelot-unchained.s3.amazonaws.com/?prefix=game/4/icons/components';

interface ReactProps {}

interface InjectedProps {
  shouldRefetchMyCharacterAbilities: boolean;
  dispatch?: Dispatch;
}

type Props = ReactProps & InjectedProps;

class AGameDefsService extends ExternalDataSource<Props> {
  private dynamicAbilityBookTabsData: AbilityBookTabsData[];
  private dynamicAbilityNetworksData: AbilityNetworksData[];
  private dynamicFactionsData: FactionsData[];
  private dynamicUserClassesData: UserClassesData[];

  protected async bind(): Promise<ListenerHandle[]> {
    await this.loadDynamicAbilityBookTabsData();
    await this.loadDynamicAbilityData();
    await this.loadDynamicAbilityNetworksData();
    await this.loadDynamicFactionsData();
    await this.loadDynamicUserClassesData();

    return [
      await this.query<GameDefsQueryResult>(
        { query: gameDefsQuery },
        this.handleGameDefsQueryResult.bind(this),
        InitTopic.GameDefs
      ),
      await this.query<StatusesQueryResult>(
        { query: statusesQuery },
        this.handleStatusesQueryResult.bind(this),
        InitTopic.Statuses
      ),
      await this.query<MyCharacterAbilitiesQueryResult>(
        { query: myCharacterAbilitiesQuery },
        this.handleMyCharacterAbilitiesQueryResult.bind(this),
        InitTopic.MyCharacterAbilities
      ),
      await this.query<MyCharacterStatsQueryResult>(
        { query: myCharacterStatsQuery },
        this.handleMyCharacterStatsQueryResult.bind(this),
        InitTopic.MyCharacterStats
      ),
      // TODO: This should be dynamic data.
      await this.call(this.getAbilityIconURLs(), this.handleAbilityIconURLs.bind(this))
    ];
  }

  private async loadDynamicAbilityData(): Promise<void> {
    const data = await clientAPI.getSystemAbilityData();

    data.forEach((datum) => {
      this.dispatch(
        updateAbilityDisplayData({
          // Have to convert the SystemAbilityData to AbilityDisplayData.
          id: datum.ID,
          name: datum.Name,
          description: datum.Description,
          icon: datum.IconURL,
          readOnly: true,
          abilityComponentIds: [],
          abilityNetworkId: null
        })
      );
    });
  }

  private async loadDynamicAbilityBookTabsData(): Promise<void> {
    this.dynamicAbilityBookTabsData = await clientAPI.getAbilityBookTabsData();
    // Sort into display order up front.
    this.dynamicAbilityBookTabsData.sort((a: AbilityBookTabsData, b: AbilityBookTabsData) => {
      return a.SortOrder - b.SortOrder;
    });
    this.props.dispatch?.(updateAbilityBookTabs(this.dynamicAbilityBookTabsData));
  }

  private async loadDynamicAbilityNetworksData(): Promise<void> {
    this.dynamicAbilityNetworksData = await clientAPI.getAbilityNetworksData();
  }

  private async loadDynamicFactionsData(): Promise<void> {
    this.dynamicFactionsData = await clientAPI.getFactionsData();
  }

  private async loadDynamicUserClassesData(): Promise<void> {
    this.dynamicUserClassesData = await clientAPI.getUserClassesData();
    const userClassesDictionary: Dictionary<UserClassesData> = {};
    this.dynamicUserClassesData.forEach((userClass) => {
      userClassesDictionary[userClass.ID] = userClass;
    });

    this.props.dispatch?.(updateClassDynamicAssets(userClassesDictionary));
  }

  private async refetchMyCharacterAbilities(): Promise<void> {
    await this.query<MyCharacterAbilitiesQueryResult>(
      { query: myCharacterAbilitiesQuery },
      this.handleMyCharacterAbilitiesQueryResult.bind(this),
      undefined,
      3 // Only 3 tries until we give up.  That way the user doesn't get permanently trapped in the AbilityBuilder.
    );
    this.dispatch(setShouldRefetchMyCharacterAbilities(false));
  }

  override componentDidUpdate(prevProps: Readonly<Props>, prevState: Readonly<{}>, snapshot?: any): void {
    if (this.props.shouldRefetchMyCharacterAbilities && !prevProps.shouldRefetchMyCharacterAbilities) {
      this.refetchMyCharacterAbilities();
    }
  }

  private async handleGameDefsQueryResult(result: GameDefsQueryResult): Promise<boolean> {
    // Validate the result.
    if (
      !result.game ||
      !result.game.factions ||
      !result.game.items ||
      !result.game.itemStats ||
      !result.game.settings ||
      !result.game.stats ||
      !result.game.entityResources ||
      !result.game.itemTooltipCategories ||
      !result.game.abilityNetworks ||
      !result.game.damageTypes ||
      !result.game.races ||
      !result.game.genders ||
      !result.game.classes ||
      !result.game.abilityComponents
    ) {
      console.warn('Received invalid response from GameDefs fetch.');
      return false;
    }

    // Factions
    const factions: Dictionary<FactionData> = {};
    for (const faction of result.game.factions) {
      const factionsData = this.dynamicFactionsData.find((fd) => {
        return fd.ID === faction.id;
      });
      const defaultArchetypeFrameURL = factionsData.NameplateIconFrameImage;
      const nameplateBackgroundURL = factionsData.NameplateBackgroundImage;
      const nameplateMainFrameURL = factionsData.NameplateMainFrameImage;
      const nameplateMiniFrameURL = factionsData.NameplateMiniFrameImage;
      const nameplateProfilePictureURL = factionsData.NameplateProfileImage;
      const emptyAbilitySlotURL = factionsData.AbilityBarEmptySlotImage;
      const groupIcon1URL = factionsData.AbilityBarDockImage;
      const groupIcon2URL = factionsData.AbilityBarDockImage.replace(`-1.`, `-2.`);
      const groupIcon3URL = factionsData.AbilityBarDockImage.replace(`-1.`, `-3.`);
      const groupIcon4URL = factionsData.AbilityBarDockImage.replace(`-1.`, `-4.`);
      const groupIcon5URL = factionsData.AbilityBarDockImage.replace(`-1.`, `-5.`);
      const groupIcon6URL = factionsData.AbilityBarDockImage.replace(`-1.`, `-6.`);
      const abilityBuilderBackgroundURL = factionsData.AbilityBuilderBackgroundImage;
      const scoreboardBackgroundColor = factionsData.ScoreboardBackgroundColor;
      const scoreboardTextColor = factionsData.ScoreboardTextColor;
      const paperdollBackgroundImage = factionsData.PaperdollBackgroundImage;
      const paperdollBaseImage = factionsData.PaperdollBaseImage;
      factions[faction.id] = {
        ...faction,
        defaultArchetypeFrameURL,
        nameplateBackgroundURL,
        nameplateMainFrameURL,
        nameplateMiniFrameURL,
        nameplateProfilePictureURL,
        emptyAbilitySlotURL,
        groupIconURLs: [groupIcon1URL, groupIcon2URL, groupIcon3URL, groupIcon4URL, groupIcon5URL, groupIcon6URL],
        abilityBuilderBackgroundURL,
        scoreboardBackgroundColor,
        scoreboardTextColor,
        paperdollBackgroundImage,
        paperdollBaseImage
      };
    }
    this.dispatch(updateFactions(factions));

    // Gear slots
    const gearSlots: Dictionary<GearSlot> = {};
    for (const gearSlot of result.game.gearSlots) {
      if (gearSlot) {
        gearSlots[gearSlot.id] = gearSlot;
      }
    }
    this.dispatch(updateGearSlots(gearSlots));

    // Items
    const items: Dictionary<ItemDefRefData> = {};
    for (const item of result.game.items) {
      // If there is a substanceDefinition, replace its purifyItemDef with a purifyItemDefId.
      const { substanceDefinition, ...otherItemFields } = item;
      let finalSubstanceDefinition: SubstanceDefRefData = null;
      if (substanceDefinition) {
        const { purifyItemDef, ...otherSubstanceFields } = substanceDefinition;
        finalSubstanceDefinition = {
          ...otherSubstanceFields,
          purifyItemDefId: purifyItemDef?.id ?? null
        };
      }
      const finalItem: ItemDefRefData = {
        ...otherItemFields,
        substanceDefinition: finalSubstanceDefinition
      };

      items[finalItem.id] = finalItem;
    }
    this.dispatch(updateItems(items));

    // Item stats
    const itemStats: Dictionary<ItemStatDefinitionGQL> = {};
    for (const itemStat of result.game.itemStats) {
      if (itemStat) {
        itemStats[itemStat.id] = itemStat;
      }
    }
    this.dispatch(updateItemStats(itemStats));

    // Settings
    this.dispatch(updateSettings(result.game.settings));

    // Stats
    const stats: Dictionary<StatDefinitionGQL> = {};
    for (const stat of result.game.stats) {
      if (stat) {
        stats[stat.id] = stat;
      }
    }
    this.dispatch(updateStats(stats));

    // Entity resources
    const entityResourcesByStringID: Dictionary<EntityResourceDefinitionGQL> = {};
    const entityResourcesByNumericID: Dictionary<EntityResourceDefinitionGQL> = {};
    for (const entityResource of result.game.entityResources) {
      if (entityResource) {
        entityResourcesByStringID[entityResource.id] = entityResource;
        entityResourcesByNumericID[entityResource.numericID] = entityResource;
      }
    }
    this.dispatch(updateEntityResources([entityResourcesByStringID, entityResourcesByNumericID]));

    // Item tooltip categories
    const itemTooltipCategories: Dictionary<ItemTooltipCategoryDef> = {};
    for (const itemTooltipCategory of result.game.itemTooltipCategories) {
      if (itemTooltipCategories) {
        itemTooltipCategories[itemTooltipCategory.id] = itemTooltipCategory;
      }
    }
    this.dispatch(updateItemTooltipCategories(itemTooltipCategories));

    // AbilityNetworks
    const networks: Dictionary<AbilityNetworkDefData> = {};
    result.game.abilityNetworks.forEach((nw) => {
      // Append dynamic data!
      // TODO: Some day this should ALL be dynamic data, instead of only part.
      const dynamicData = this.dynamicAbilityNetworksData.find((datum) => {
        return datum.ID === nw.id;
      });
      if (dynamicData) {
        const fullNetwork: AbilityNetworkDefData = {
          ...nw,
          ...dynamicData
        };
        networks[fullNetwork.id] = fullNetwork;
      } else {
        console.error(`Failed to find dynamic AbilityNetwork entry for "${nw.id}".`);
      }
    });
    this.dispatch(updateAbilityNetworks(networks));

    // DamageTypes
    const damageTypes: Dictionary<DamageTypeDefGQL> = {};
    result.game.damageTypes.forEach((damageType) => {
      if (damageTypes) {
        damageTypes[damageType.numericID] = damageType;
      }
    });
    this.dispatch(updateDamageTypes(damageTypes));

    // AbilityComponents
    const abilityComponents: Dictionary<AbilityComponentDefRefData> = {};
    result.game.abilityComponents.forEach((abilityComponent) => {
      const { networkRequirements, ...otherComponentFields } = abilityComponent;

      // NetworkRequirements
      const finalNetworkRequirements: AbilityNetworkRequirementsGQLData[] = [];
      abilityComponent.networkRequirements.forEach((req) => {
        const { excludeComponent, requireComponent, ...otherReqFields } = req;
        const finalReq: AbilityNetworkRequirementsGQLData = {
          ...otherReqFields,
          excludeComponentId: excludeComponent?.component.id ?? null,
          requireComponentId: requireComponent?.component.id ?? null
        };
        finalNetworkRequirements.push(finalReq);
      });

      const finalComponent: AbilityComponentDefRefData = {
        ...otherComponentFields,
        networkRequirements: finalNetworkRequirements
      };
      abilityComponents[finalComponent.id] = finalComponent;
    });
    this.dispatch(updateAbilityComponents(abilityComponents));

    // ClassDef
    const classesByStringID: Dictionary<ClassDefGQL> = {};
    const classesByNumericID: Dictionary<ClassDefGQL> = {};
    result.game.classes.forEach((classDef) => {
      if (classDef) {
        classesByStringID[classDef.id] = classDef;
        classesByNumericID[classDef.numericID] = classDef;
      }
    });
    this.dispatch(updateClasses([classesByStringID, classesByNumericID]));

    // RaceDef
    const racesByStringID: Dictionary<RaceDefGQL> = {};
    const racesByNumericID: Dictionary<RaceDefGQL> = {};
    result.game.races.forEach((raceDef) => {
      if (raceDef) {
        racesByStringID[raceDef.id] = raceDef;
        racesByNumericID[raceDef.numericID] = raceDef;
      }
    });
    this.dispatch(updateRaces([racesByStringID, racesByNumericID]));

    // GenderDef
    const gendersByStringID: Dictionary<GenderDefGQL> = {};
    const gendersByNumericID: Dictionary<GenderDefGQL> = {};
    result.game.genders.forEach((genderDef) => {
      if (genderDef) {
        gendersByStringID[genderDef.id] = genderDef;
        gendersByNumericID[genderDef.numericID] = genderDef;
      }
    });
    this.dispatch(updateGenders([gendersByStringID, gendersByNumericID]));

    return true;
  }

  private async handleStatusesQueryResult(result: StatusesQueryResult): Promise<boolean> {
    // Validate the result.
    if (!result.status || !result.status.statuses) {
      console.warn('Received invalid response from Statuses fetch.');
      return false;
    }

    const statusesByStringID: Dictionary<StatusDef> = {};
    const statusesByNumericID: Dictionary<StatusDef> = {};

    result.status.statuses.forEach((status) => {
      statusesByStringID[status.id] = status;
      statusesByNumericID[status.numericID] = status;
    });

    this.dispatch(updateStatuses([statusesByStringID, statusesByNumericID]));

    return true;
  }

  private async handleMyCharacterAbilitiesQueryResult(result: MyCharacterAbilitiesQueryResult): Promise<boolean> {
    // Validate the result.
    // These abilities are required for populating the ability bar, so without them the player can't do much.
    if (!result.myCharacter || !result.myCharacter.abilities || result.myCharacter.abilities.length === 0) {
      console.warn('Received invalid response from MyCharacter Abilities fetch.');
      return false;
    }

    result.myCharacter.abilities.forEach((abilityData) => {
      const { abilityComponents, abilityNetwork, ...otherDisplayFields } = abilityData;
      const datum: AbilityDisplayData = {
        ...otherDisplayFields,
        abilityComponentIds: abilityComponents.map((component) => {
          return component.id;
        }),
        abilityNetworkId: abilityNetwork.id
      };
      this.dispatch(updateAbilityDisplayData(datum));
    });

    return true;
  }

  private async handleMyCharacterStatsQueryResult(result: MyCharacterStatsQueryResult): Promise<boolean> {
    // Validate the result.
    if (!result.myCharacter || !result.myCharacter.stats || result.myCharacter.stats.length === 0) {
      console.warn('Received invalid response from MyCharacter Stats fetch.');
      return false;
    }

    const stats: Dictionary<CharacterStatField> = {};
    for (const stat of result.myCharacter.stats) {
      if (stat) {
        stats[stat.stat] = stat;
      }
    }
    this.dispatch(updateMyStats(stats));

    return true;
  }

  private getAbilityIconURLs(): (config: RequestConfig) => Promise<RequestResult> {
    return async (conf) => {
      // We're concatenating two lists here.  If the first fetch fails, bail!
      const partOne = await request(
        'get',
        ICONS_URL,
        {
          Accept: 'application/json, text/javascript, text/plain'
        },
        {},
        null
      );
      if (!partOne.ok) return partOne;

      const partTwo = await request(
        'get',
        ICONS_URL2,
        {
          Accept: 'application/json, text/javascript, text/plain'
        },
        {},
        null
      );

      // AWS response is in XML.  Convert it to json.
      const dataOne = xml2json(partOne.data);
      const dataTwo = xml2json(partTwo.data);

      interface AWSBucketResponse {
        declaration: any;
        elements: {
          attributes: any;
          elements: {
            type: 'element';
            name: string;
            elements: {
              type: 'element';
              name: string;
              elements: {
                type: 'text';
                text: string; // This is the actual URL for the files we want.
              }[];
            }[];
          }[];
        }[];
      }

      // Then parse it into an object structure.
      const bucketOne: AWSBucketResponse = JSON.parse(dataOne);
      const bucketTwo: AWSBucketResponse = JSON.parse(dataTwo);

      // Filter out entries that describe the folder itself.  Keep entries that describe assets in the folder.
      const combinedBucket = [...bucketOne.elements[0].elements, ...bucketTwo.elements[0].elements].filter(
        (element) => {
          return element.name === 'Contents';
        }
      );

      // Then pull out the URLs and only keep those.
      const iconURLs: string[] = combinedBucket.map((aElement) => {
        return (
          'https://camelot-unchained.s3.amazonaws.com/' +
          aElement.elements.find((bElement) => {
            return bElement.name === 'Key';
          })?.elements[0].text
        );
      });

      const result: RequestResult = {
        ...partTwo,
        // Combine the data from both.
        data: JSON.stringify(iconURLs)
      };
      return result;
    };
  }

  private async handleAbilityIconURLs(queryResult: RequestResult): Promise<boolean> {
    try {
      const iconURLs: string[] = JSON.parse(queryResult.data);
      this.dispatch(updateAbilityIconURLs(iconURLs));
      return true;
    } catch (e) {
      console.error('Unable to parse AbilityIconURLs', e);
      return false;
    }
  }
}

function mapStateToProps(state: RootState, ownProps: ReactProps): Props {
  const { shouldRefetchMyCharacterAbilities } = state.gameDefs;
  return {
    ...ownProps,
    shouldRefetchMyCharacterAbilities
  };
}

export const GameDefsService = connect(mapStateToProps)(AGameDefsService);
