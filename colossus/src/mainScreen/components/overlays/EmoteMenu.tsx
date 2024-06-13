/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { hordetest } from '@csegames/library/dist/hordetest';
import { PerkDefGQL, StringTableEntryDef } from '@csegames/library/dist/hordetest/graphql/schema';
import { getCharacterClassStringIDForNumericID } from '../../helpers/characterHelpers';
import { Dictionary } from '@csegames/library/dist/_baseGame/types/ObjectMap';
import * as React from 'react';
import { connect } from 'react-redux';
import { RootState } from '../../redux/store';
import { ControllerButton } from '@csegames/library/dist/_baseGame/types/Gamepad';
import { game } from '@csegames/library/dist/_baseGame';
import { Dispatch } from 'redux';
import { hideOverlay, Overlay } from '../../redux/navigationSlice';
import { ProfileModel } from '../../redux/profileSlice';
import { IDLookupTable } from '../../redux/gameSlice';
import { CharacterClassDef } from '@csegames/library/dist/hordetest/game/types/CharacterDef';
import { ListenerHandle } from '@csegames/library/dist/_baseGame/listenerHandle';
import { getStringTableValue } from '../../helpers/stringTableHelpers';
import { RadialMenu, RadialMenuButtonData, getRadialMenuButtonIndexForAngle } from '../shared/RadialMenu';

// Center of button one is at the top of the wheel.
const firstButtonAngle = -Math.PI / 2;

const RootContainer = 'EmoteMenu-RootContainer';
const ButtonIcon = 'EmoteMenu-ButtonIcon';
const EmotesTitle = 'EmoteMenu-EmotesTitle';
const EmoteName = 'EmoteMenu-EmoteName';
const Pointer = 'EmoteMenu-Pointer';

const StringIDEmoteMenuTitle = 'EmoteMenuTitle';

// Angles of the central vectors through each button.
const buttonAngles: number[] = [
  -Math.PI / 2,
  -Math.PI / 6,
  Math.PI / 6,
  Math.PI / 2,
  (Math.PI * 5) / 6,
  (-Math.PI * 5) / 6
];

interface ReactProps {
  isVisible: boolean;
  dispatch?: Dispatch;
}

interface InjectedProps {
  maxEmoteCount: number;
  profile: ProfileModel;
  perksByID: Dictionary<PerkDefGQL>;
  characterClassDefs: IDLookupTable<CharacterClassDef>;
  stringTable: Dictionary<StringTableEntryDef>;
}

type Props = ReactProps & InjectedProps;

interface State {
  equippedEmotes: PerkDefGQL[];
  pointerAngle: number;
  hoveredIndex: number;
  isSelecting: boolean; // Selection animation controller.
  isExiting: boolean; // Exit animation controller.
}

class AEmoteMenu extends React.Component<Props, State> {
  private controllerEVH: ListenerHandle;
  private axisEVH: ListenerHandle;

  constructor(props: Props) {
    super(props);

    this.state = {
      equippedEmotes: [],
      pointerAngle: 0,
      hoveredIndex: -1,
      isSelecting: false,
      isExiting: false
    };
  }

  public render() {
    if (this.state.equippedEmotes.length === 0) {
      return null;
    }

    // TODO : put a clear pane behind the menu so that clicking in space doesn't leave the menu up but capture the mouse
    return (
      <RadialMenu
        className={`${RootContainer} ${this.state.isExiting ? 'exit' : ''}`}
        firstButtonAngle={firstButtonAngle}
        buttons={this.getEmoteButtonData()}
        onButtonClicked={this.onEmoteButtonClicked.bind(this)}
        overrideHoveredIndex={this.state.hoveredIndex}
        onHoveredIndexChanged={(hoveredIndex) => {
          this.setState({ hoveredIndex });
        }}
      >
        <div className={EmotesTitle}>{getStringTableValue(StringIDEmoteMenuTitle, this.props.stringTable)}</div>
        <div className={EmoteName}>{this.getEmoteNameToDisplay()}</div>
        <div style={this.getPointerStyle()} className={`${Pointer} fs-icon-misc-caret-down`} />
      </RadialMenu>
    );
  }

  private async onEmoteButtonClicked(buttonIndex: number): Promise<void> {
    // No inputs during the exit animation!
    if (this.state.isExiting || this.state.isSelecting) {
      return;
    }

    if (this.state.hoveredIndex !== -1 && this.hasEquippedEmoteAtIndex(this.state.hoveredIndex)) {
      game.setSelectedEmoteIndex(this.state.hoveredIndex);
      this.beginExitSequence();
    }
  }

  private getEmoteButtonData(): RadialMenuButtonData[] {
    const data: RadialMenuButtonData[] = [];

    this.state.equippedEmotes.forEach((emotePerk, index) => {
      const d: RadialMenuButtonData = {
        renderContents: this.renderEmoteButtonContent.bind(this, emotePerk, index),
        isSelected: index === this.getSelectedEmoteIndex()
      };
      data.push(d);
    });

    return data;
  }

  private renderEmoteButtonContent(
    emotePerk: PerkDefGQL | null,
    index: number,
    isHovered: boolean,
    isSelected: boolean,
    isDisabled: boolean
  ): React.ReactNode {
    // No emote, no content.
    if (!emotePerk) {
      return null;
    } else {
      return (
        <img
          className={ButtonIcon}
          src={(emotePerk.iconURL?.length ?? 0) > 0 ? emotePerk.iconURL : 'images/MissingAsset.png'}
          key={`${emotePerk.id}_${index}`}
        />
      );
    }
  }

  private getPointerStyle(): React.CSSProperties {
    return {
      transform: `translate(-50%, -50%) rotate(${(this.state.pointerAngle * 180) / Math.PI - 90}deg)`
    };
  }

  private getEmoteNameToDisplay(): string {
    if (
      this.state.hoveredIndex > -1 &&
      this.state.hoveredIndex < this.state.equippedEmotes.length &&
      this.state.equippedEmotes[this.state.hoveredIndex]
    ) {
      return this.state.equippedEmotes[this.state.hoveredIndex].name;
    } else if (this.state.equippedEmotes && this.hasEquippedEmoteAtIndex(this.getSelectedEmoteIndex())) {
      return this.state.equippedEmotes[this.getSelectedEmoteIndex()].name;
    } else {
      return '';
    }
  }

  private getSelectedEmoteIndex(): number {
    return game.selectedEmoteIndex >= 0 && game.selectedEmoteIndex < this.props.maxEmoteCount
      ? game.selectedEmoteIndex
      : 0;
  }

  componentDidMount(): void {
    this.checkIsPlayerReady();

    // Initiate MenuInputMode.
    game.setMenuInputMode(this.props.isVisible);

    // Register for Controller events.
    this.controllerEVH = hordetest.game.onMenuControllerEvent(this.handleControllerButtonPress.bind(this));
    this.axisEVH = hordetest.game.onMenuControllerAxisEvent(this.handleControllerAxisChange.bind(this));
  }

  componentDidUpdate(prevProps: Readonly<Props>, prevState: Readonly<State>, snapshot?: any): void {
    if (this.props.isVisible !== prevProps.isVisible) {
      game.setMenuInputMode(this.props.isVisible);

      if (this.props.isVisible) {
        // This will recalculate the list of equipped emotes in case the champion has changed.
        this.checkIsPlayerReady();

        // Make sure the pointer starts aimed at the selected emote.
        this.setState({ pointerAngle: buttonAngles[this.getSelectedEmoteIndex()] });
      } else {
        // When the EmoteMenu is closed, clean up.
        this.setState({ hoveredIndex: -1, isExiting: false, isSelecting: false });
      }
    }
  }

  componentWillUnmount(): void {
    // Terminate MenuInputMode.
    game.setMenuInputMode(false);

    // Unregister for Controller events.
    if (this.controllerEVH) {
      this.controllerEVH.close();
      this.controllerEVH = null;
    }
    if (this.axisEVH) {
      this.axisEVH.close();
      this.axisEVH = null;
    }
  }

  private beginExitSequence(): void {
    if (this.state.isExiting) {
      return;
    }

    this.setState({ isExiting: true, isSelecting: false });
    // Timeout should match animation "fadeOut_vj4ep"
    window.setTimeout(() => {
      // This update will chain into turning off MenuInputMode via componentDidUpdate().
      this.props.dispatch(hideOverlay(Overlay.EmoteMenu));
    }, 250);
  }

  private handleControllerButtonPress(button: ControllerButton): void {
    // No inputs during the exit animation!
    if (this.state.isExiting || this.state.isSelecting) {
      return;
    }

    switch (button) {
      case ControllerButton.A: // Fall through.
      case ControllerButton.Back: // Fall through.
      case ControllerButton.Escape: {
        this.beginExitSequence();
        break;
      }
      case ControllerButton.B: {
        this.applyEmoteSelection();
        break;
      }
      case ControllerButton.Left: {
        let nextHoverIndex: number = this.state.hoveredIndex;
        do {
          nextHoverIndex =
            nextHoverIndex === -1 ? 0 : (nextHoverIndex + this.props.maxEmoteCount - 1) % this.props.maxEmoteCount;
        } while (!this.hasEquippedEmoteAtIndex(nextHoverIndex));
        this.setState({ hoveredIndex: nextHoverIndex, pointerAngle: buttonAngles[nextHoverIndex] });
        break;
      }
      case ControllerButton.Right: {
        let nextHoverIndex: number = this.state.hoveredIndex;
        do {
          nextHoverIndex = nextHoverIndex === -1 ? 0 : (nextHoverIndex + 1) % this.props.maxEmoteCount;
        } while (!this.hasEquippedEmoteAtIndex(nextHoverIndex));
        this.setState({ hoveredIndex: nextHoverIndex, pointerAngle: buttonAngles[nextHoverIndex] });
        break;
      }
    }
  }

  private handleControllerAxisChange(x: number, y: number): void {
    // No inputs during the exit animation!
    if (this.state.isExiting || this.state.isSelecting) {
      return;
    }

    // If the stick is centered, we just want to maintain the last hovered index and angle.
    if (Math.abs(x) < 0.01 && Math.abs(y) < 0.01) {
      return;
    }

    let angle = -Math.atan2(y, x);

    const hoveredIndex = getRadialMenuButtonIndexForAngle(angle, firstButtonAngle, this.props.maxEmoteCount);

    this.setState({
      pointerAngle: angle,
      hoveredIndex: this.hasEquippedEmoteAtIndex(hoveredIndex) ? hoveredIndex : this.state.hoveredIndex
    });
  }

  private applyEmoteSelection(): void {
    if (
      this.state.hoveredIndex !== -1 &&
      this.getSelectedEmoteIndex() !== this.state.hoveredIndex &&
      this.hasEquippedEmoteAtIndex(this.state.hoveredIndex)
    ) {
      game.setSelectedEmoteIndex(this.state.hoveredIndex);
      this.setState({ isSelecting: true });
      // This timeout should match the "pulse_em5jd" animation.
      window.setTimeout(() => {
        this.beginExitSequence();
      }, 500);
    } else {
      // If they just re-selected the same emote as before, we can skip the "select" animation.
      this.beginExitSequence();
    }
  }

  private checkIsPlayerReady(): void {
    if (hordetest.game.selfPlayerEntityState && hordetest.game.selfPlayerEntityState.name !== 'unknown') {
      this.setState({ equippedEmotes: this.getEquippedEmotes() });
    } else {
      window.setTimeout(() => {
        this.checkIsPlayerReady();
      }, 1000);
    }
  }

  private hasEquippedEmoteAtIndex(index: number): boolean {
    return this.state.equippedEmotes.length > index && this.state.equippedEmotes[index] != null;
  }

  private getEquippedEmotes(): PerkDefGQL[] {
    const champ = this.props.profile?.champions?.find((c) => {
      return (
        c.championID ===
        getCharacterClassStringIDForNumericID(
          this.props.characterClassDefs,
          hordetest.game.selfPlayerEntityState.classID
        )
      );
    });
    const equippedEmotes = champ?.emotePerkIDs?.map((epid) => this.props.perksByID[epid] ?? null) ?? [];
    while (equippedEmotes.length < this.props.maxEmoteCount) {
      equippedEmotes.push(null);
    }

    return equippedEmotes;
  }
}

function mapStateToProps(state: RootState, ownProps: ReactProps): Props {
  const { maxEmoteCount } = state.gameSettings;
  const { perksByID } = state.store;
  const { characterClassDefs } = state.game;
  const { stringTable } = state.stringTable;

  return {
    ...ownProps,
    maxEmoteCount,
    perksByID,
    profile: state.profile,
    characterClassDefs,
    stringTable
  };
}

export const EmoteMenu = connect(mapStateToProps)(AEmoteMenu);
