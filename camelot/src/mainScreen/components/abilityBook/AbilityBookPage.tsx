/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { Dispatch } from '@reduxjs/toolkit';
import * as React from 'react';
import Fuse from 'fuse.js/dist/fuse';
import { connect } from 'react-redux';
import { RootState } from '../../redux/store';
import { Dictionary } from '@csegames/library/dist/_baseGame/types/ObjectMap';
import {
  AbilityComponentDefRefData,
  AbilityDisplayData,
  AbilityNetworkDefData,
  deleteAbilityDisplayData
} from '../../redux/gameDefsSlice';
import { AbilityFilterHeader, AbilityFilterHeaderState } from './AbilityFilterHeader';
import { AbilityEditStatus, AbilityGroup } from '@csegames/library/dist/_baseGame/types/AbilityTypes';
import TooltipSource from '../TooltipSource';
import Draggable from '../Draggable';
import DraggableHandle, { DropHandlerDraggableData } from '../DraggableHandle';
import { DropTypeAbilityButton } from '../abilityBars/AbilityButton';
import { clientAPI } from '@csegames/library/dist/camelotunchained/MainScreenClientAPI';
import { hideModal, showModal } from '../../redux/modalsSlice';
import { AbilitiesAPI } from '@csegames/library/dist/camelotunchained/webAPI/definitions';
import { webConf } from '../../dataSources/networkConfiguration';
import { deleteAbility, setNowEditingAbilityId } from '../../redux/abilitiesSlice';
import { toggleMenuWidget } from '../../redux/hudSlice';
import { WIDGET_NAME_ABILITY_BUILDER } from '../abilityBuilder/AbilityBuilder';
import { AbilityBarKind } from '@csegames/library/dist/camelotunchained/graphql/schema';
import { AbilityBarSlotDropTargetData } from '../abilityBars/AbilityBarSlot';

const Root = 'HUD-AbilityBookPage-Root';
const ListRoot = 'HUD-AbilityBookPage-ListRoot';
const AbilityCell = 'HUD-AbilityBookPage-AbilityCell';
const AbilityCellIcon = 'HUD-AbilityBookPage-AbilityCellIcon';
const TooltipRoot = 'HUD-AbilityBookPage-TooltipRoot';
const TooltipHeader = 'HUD-AbilityBookPage-TooltipHeader';
const TooltipDescription = 'HUD-AbilityBookPage-TooltipDescription';
const AbilityCellInfo = 'HUD-AbilityBookPage-AbilityCellInfo';
const AbilityCellName = 'HUD-AbilityBookPage-AbilityCellName';
const AbilityComponentsRow = 'HUD-AbilityBookPage-AbilityComponentsRow';
const AbilityComponentIcon = 'HUD-AbilityBookPage-AbilityComponentIcon';
const AbilityEditButton = 'HUD-AbilityBookPage-AbilityEditButton';

interface State {
  filters: AbilityFilterHeaderState;
}

interface ReactProps {
  bookTab: string;
}

interface InjectedProps {
  abilityComponents: Dictionary<AbilityComponentDefRefData>;
  abilityNetworks: Dictionary<AbilityNetworkDefData>;
  abilityDisplayData: Dictionary<AbilityDisplayData>;
  editStatus: AbilityEditStatus;
  groups: Dictionary<AbilityGroup>;

  dispatch?: Dispatch;
}

type Props = ReactProps & InjectedProps;

class AAbilityBookPage extends React.Component<Props, State> {
  private wasInEditMode: boolean = false;

  constructor(props: Props) {
    super(props);
    this.state = {
      filters: {
        filterUnassigned: false,
        searchText: '',
        selectedComponentNames: []
      }
    };
  }

  render(): JSX.Element {
    // Root uses `column-reverse` so that AbilityFilterHeader can have the top z-index without using
    // explicit z-indices in the styles.
    return (
      <div className={Root}>
        <div className={ListRoot}>
          {this.getFilteredAbilities().map((ability) => {
            return this.renderAbilityCell(ability);
          })}
        </div>
        <AbilityFilterHeader
          bookTab={this.props.bookTab}
          onFilterChanged={(filters) => {
            this.setState({ filters });
          }}
        />
      </div>
    );
  }

  private renderAbilityCell(ability: AbilityDisplayData): React.ReactNode {
    return (
      <div className={AbilityCell} key={ability.id}>
        <TooltipSource
          tooltipParams={{ id: `abilityCell${ability.id}`, content: this.renderAbilityTooltip.bind(this, ability) }}
        >
          {this.renderAbilityDraggable(ability)}
        </TooltipSource>
        <div className={AbilityCellInfo}>
          <TooltipSource
            tooltipParams={{
              id: `abilityCellName${ability.id}`,
              content: this.renderAbilityTooltip.bind(this, ability)
            }}
          >
            <div className={AbilityCellName}>{ability.name}</div>
          </TooltipSource>
          <div className={AbilityComponentsRow}>
            {ability.abilityComponentIds.map(this.renderAbilityComponent.bind(this))}
          </div>
        </div>
        {!ability.readOnly && (
          <div className={`${AbilityEditButton} icon-edit`} onClick={this.onEditAbilityClicked.bind(this, ability)} />
        )}
      </div>
    );
  }

  private isNormalAbility(ability: AbilityDisplayData): boolean {
    for (const idx in ability.abilityComponentIds) {
      const component = this.props.abilityComponents[ability.abilityComponentIds[idx]];
      if (component && component.abilityBarKind != AbilityBarKind.Normal) {
        return false;
      }
    }

    return true;
  }

  private renderAbilityDraggable(ability: AbilityDisplayData): React.ReactNode {
    let isDraggable = this.isNormalAbility(ability);
    if (!isDraggable) {
      return <img className={`${AbilityCellIcon} non-draggable`} src={ability.icon} />;
    }

    const draggableId = `AbilityBook${ability.id}`;
    return (
      <Draggable draggableID={draggableId}>
        <DraggableHandle
          draggableID={draggableId}
          draggingRender={this.renderAbilityIcon.bind(this, ability)}
          dragStartHandler={this.onAbilityDragStart.bind(this)}
          dropHandler={this.onAbilityDropped.bind(this)}
          dropType={DropTypeAbilityButton}
        >
          {this.renderAbilityIcon(ability)}
        </DraggableHandle>
      </Draggable>
    );
  }

  private onEditAbilityClicked(ability: AbilityDisplayData): void {
    this.props.dispatch?.(
      showModal({
        id: 'ModifyOrDeleteAbility',
        content: {
          title: 'Edit',
          message: `What do you want to do with "${ability.name}"?`,
          buttons: [
            {
              text: 'Delete',
              onClick: () => {
                this.props.dispatch?.(hideModal());
                this.showConfirmDeleteAbilityModal(ability);
              }
            },
            {
              text: 'Modify',
              onClick: () => {
                this.props.dispatch?.(hideModal());
                this.beginAbilityModification(ability);
              }
            }
          ]
        }
      })
    );
  }

  private showConfirmDeleteAbilityModal(ability: AbilityDisplayData): void {
    this.props.dispatch?.(
      showModal({
        id: 'ConfirmDeleteAbility',
        content: {
          title: 'Confirm',
          message: `Are you sure you wish to delete "${ability.name}"?  This action cannot be undone.`,
          buttons: [
            {
              text: 'Delete',
              onClick: () => {
                this.props.dispatch?.(hideModal());
                this.deleteAbility(ability);
              }
            },
            {
              text: 'Cancel',
              onClick: () => {
                this.props.dispatch?.(hideModal());
              }
            }
          ]
        }
      })
    );
  }

  private async deleteAbility(ability: AbilityDisplayData): Promise<void> {
    const res = await AbilitiesAPI.DeleteAbility(webConf, +ability.id);
    if (res.ok) {
      this.props.dispatch?.(deleteAbility(+ability.id));
      this.props.dispatch?.(deleteAbilityDisplayData(ability.id));
    } else {
      showModal({
        id: 'DeleteAbilityFailed',
        content: {
          title: 'Error',
          message: `An error occurred.  The ability may not have been deleted.`,
          buttons: [
            {
              text: 'Okay',
              onClick: () => {
                this.props.dispatch(hideModal());
              }
            }
          ]
        }
      });
    }
  }

  private beginAbilityModification(ability: AbilityDisplayData): void {
    // Flag this ability for editing.
    this.props.dispatch?.(setNowEditingAbilityId(ability.id));
    // And go to the AbilityBuilder to edit it.
    this.props.dispatch(
      toggleMenuWidget({ widgetId: WIDGET_NAME_ABILITY_BUILDER, escapableId: WIDGET_NAME_ABILITY_BUILDER })
    );
  }

  private onAbilityDragStart(): void {
    // Track previous edit status so we don't stomp it if the user was already editing the UI.
    this.wasInEditMode = this.props.editStatus.canEdit || this.props.editStatus.requestedCanEdit;

    if (!this.wasInEditMode) {
      // When the user starts dragging an ability, turn on edit mode so the client doesn't reject updates.
      clientAPI.requestEditMode(true);
    }
  }

  private onAbilityDropped(data: AbilityBarSlotDropTargetData, { currentDraggableID }: DropHandlerDraggableData): void {
    if (!this.wasInEditMode) {
      // When the user drops an ability, revert to the previous edit status.
      clientAPI.requestEditMode(false);
    }

    // Do nothing if we didn't drop onto an ability slot.
    if (!data) {
      return;
    }

    const group = this.props.groups[data.groupID];

    // Not allowed to muck up system bars, and possibly some others.
    if (group.isSystem || !group.canReplace) {
      return;
    }

    // Nothing else is in the way, so let's set the ability!
    const abilityId = +currentDraggableID.slice(11);
    clientAPI.setAbility(data.groupID, data.slotIndex, abilityId);
  }

  private renderAbilityIcon(ability: AbilityDisplayData): React.ReactNode {
    return <img className={AbilityCellIcon} src={ability.icon} />;
  }

  private renderAbilityComponent(acId: string): React.ReactNode {
    const component = this.props.abilityComponents[acId];
    if (!component) {
      console.warn(`Found unknown abilityComponent with id ${acId}`);
      return null;
    }

    return (
      <TooltipSource
        tooltipParams={{
          id: `abilityComponent${acId}`,
          content: this.renderAbilityComponentTooltip.bind(this, component)
        }}
      >
        <img className={AbilityComponentIcon} src={component.display.iconURL} />
      </TooltipSource>
    );
  }

  private renderAbilityTooltip(ability: AbilityDisplayData): React.ReactNode {
    return (
      <div className={TooltipRoot}>
        <div className={TooltipHeader}>{ability.name}</div>
        <div className={TooltipDescription}>{ability.description}</div>
      </div>
    );
  }

  private renderAbilityComponentTooltip(component: AbilityComponentDefRefData): React.ReactNode {
    return (
      <div className={TooltipRoot}>
        <div className={TooltipHeader}>{component.display.name}</div>
        <div className={TooltipDescription}>{component.abilityComponentCategory.displayInfo.description}</div>
        <div className={TooltipDescription}>{component.display.description}</div>
      </div>
    );
  }

  private getFilteredAbilities(): AbilityDisplayData[] {
    // Start with the list of all abilities known by this player.
    let abilities: AbilityDisplayData[] = [...Object.values(this.props.abilityDisplayData)];

    // Standard filters.
    abilities = abilities.filter((ability) => {
      const nw = this.props.abilityNetworks[ability?.abilityNetworkId];
      // Exclude system abilities.
      if (!nw) return false;
      // Only include abilities for the current BookTab.
      if (nw.AbilityBookTab !== this.props.bookTab) return false;
      // If selected, only show abilities that aren't in any ability bar.
      if (this.state.filters.filterUnassigned && this.isAbilityAssigned(ability.id)) return false;
      // If filtered by component...
      if (this.state.filters.selectedComponentNames.length > 0) {
        // Does this ability match at least one of the selected components?
        let matchingComponentId = ability.abilityComponentIds.find((acId) => {
          if (!this.props.abilityComponents[acId]) {
            console.warn('Found ability component that doesn`t exist?', acId, this.props.abilityComponents);
          }
          return this.state.filters.selectedComponentNames.includes(this.props.abilityComponents[acId]?.display.name);
        });
        return matchingComponentId !== undefined;
      }

      return true;
    });

    // Handle search filtering
    if (this.state.filters.searchText !== '') {
      const fuseSearch = new Fuse(abilities, {
        shouldSort: true,
        threshold: 0.3,
        distance: 50,
        minMatchCharLength: 1,
        includeScore: true,
        keys: ['name']
      }).search(this.state.filters.searchText);

      abilities = fuseSearch.sort((a, b) => a.score - b.score).map((searchItem) => searchItem.item);
    }

    abilities.sort((a, b) => {
      return a.name.localeCompare(b.name);
    });

    return abilities;
  }

  private isAbilityAssigned(abilityId: number): boolean {
    const groupWithAbility = Object.values(this.props.groups).find((group) => {
      return group.abilities.includes(abilityId);
    });

    return groupWithAbility !== undefined;
  }
}

const mapStateToProps = (state: RootState, ownProps: ReactProps): Props => {
  const { abilityComponents, abilityNetworks, abilityDisplayData } = state.gameDefs;
  const { groups, editStatus } = state.abilities;

  return {
    ...ownProps,
    abilityComponents,
    abilityNetworks,
    abilityDisplayData,
    editStatus,
    groups
  };
};

export const AbilityBookPage = connect(mapStateToProps)(AAbilityBookPage);
