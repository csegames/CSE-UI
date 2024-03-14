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

const RootContainer = 'EmoteMenu-RootContainer';
const ButtonContainer = 'EmoteMenu-ButtonContainer';
const ButtonNumber = 'EmoteMenu-ButtonNumber';
const ButtonIcon = 'EmoteMenu-ButtonIcon';
const EmotesTitle = 'EmoteMenu-EmotesTitle';
const EmoteName = 'EmoteMenu-EmoteName';
const Pointer = 'EmoteMenu-Pointer';

// SVG Styling
const ButtonOuterRadius = 0.48;
const ButtonInnerRadius = 0.35;
const ButtonGap = 0.025; // Space between arcs.
const ButtonNumberRadius = 0.45;
const ButtonIconRadius = 0.7;

const ButtonBorderColor_Equipped = '#888888';
const ButtonBorderColor_Hovered = '#7ecffc';
const ButtonBorderColor_Selected = '#7ecffc';
const ButtonBorderColor_Default = '#4442a2';

const ButtonStrokeWidth_Selected = '2%';
const ButtonStrokeWidth_Default = '0.4%';

const ButtonBackgroundColor_Equipped = 'rgba(32,32,32,0.95)';
const ButtonBackgroundColor_Hovered = 'rgba(68,66,162,0.8)';
const ButtonBackgroundColor_Selected = 'rgba(68,66,162,0.95)';
const ButtonBackgroundColor_Default = 'rgba(14,17,36,0.95)';

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
  dispatch?: Dispatch;
}

interface InjectedProps {
  isVisible: boolean;
  maxEmoteCount: number;
  profile: ProfileModel;
  perksByID: Dictionary<PerkDefGQL>;
  characterClassDefs: IDLookupTable<CharacterClassDef>;
  stringTable: Dictionary<StringTableEntryDef>;
}

type Props = ReactProps & InjectedProps;

interface State {
  size: number; // Width/height of the menu in pixels (for SVG).
  or: number; // Outer radius.
  ir: number; // Inner radius.
  or2: number; // Outer radius squared.
  ir2: number; // Inner radius squared.
  gap: number; // Size of the gap between buttons.
  x: number; // Position of the Menu on the screen.
  y: number;
  pointerAngle: number;
  hoveredIndex: number;
  equippedEmotes: PerkDefGQL[];
  isSelecting: boolean; // Selection animation controller.
  isExiting: boolean; // Exit animation controller.
}

class AEmoteMenu extends React.Component<Props, State> {
  private controllerEVH: ListenerHandle;
  private axisEVH: ListenerHandle;

  constructor(props: Props) {
    super(props);

    this.state = {
      size: 0, // Zero means we haven't calculated it yet.
      or: 0,
      ir: 0,
      or2: 0,
      ir2: 0,
      gap: 0,
      x: 0,
      y: 0,
      pointerAngle: 0,
      hoveredIndex: -1,
      equippedEmotes: [],
      isSelecting: false,
      isExiting: false
    };
  }

  public render() {
    // TODO : put a clear pane behind the menu so that clicking in space doesn't leave the menu up but capture the mouse
    return (
      <div
        id={'EmoteMenu'}
        className={`${RootContainer} ${this.state.isExiting ? 'exit' : ''}`}
        onMouseMove={this.onMouseMove.bind(this)}
        onMouseDown={this.onMouseDown.bind(this)}
        onMouseLeave={this.onMouseLeave.bind(this)}
      >
        {this.renderButtonBackgrounds()}
        {this.renderButtonContents()}
        <div className={EmotesTitle}>{getStringTableValue(StringIDEmoteMenuTitle, this.props.stringTable)}</div>
        <div className={EmoteName}>{this.getEmoteNameToDisplay()}</div>
        <div style={this.getPointerStyle()} className={`${Pointer} fs-icon-misc-caret-down`} />
      </div>
    );
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

  private renderButtonBackgrounds(): JSX.Element {
    // SVG to render all of the arc segments.
    return (
      <svg className={ButtonContainer} ref={this.calculateSizes.bind(this)}>
        {this.state.size > 0
          ? this.getArcPaths().map((arc, index) => {
              return (
                <path
                  stroke={this.getStrokeColorForIndex(index)}
                  stroke-width={this.getStrokeWidthForIndex(index)}
                  fill={this.getBackgroundColorForIndex(index)}
                  d={arc}
                />
              );
            })
          : null}
      </svg>
    );
  }

  private renderButtonContents(): JSX.Element {
    if (this.state.size <= 0) {
      return null;
    }

    const numberRadius = this.state.or * ButtonNumberRadius;
    const iconRadius = this.state.or * ButtonIconRadius;
    const centerXY = this.state.size / 2;

    return (
      <div className={ButtonContainer}>
        {buttonAngles.map((angle, index) => {
          return (
            <>
              <div
                className={`${ButtonNumber} ${this.hasEquippedEmoteAtIndex(index) ? '' : 'disabled'}`}
                style={{
                  top: Math.sin(angle) * numberRadius + centerXY,
                  left: Math.cos(angle) * numberRadius + centerXY
                }}
              >
                {index + 1}
              </div>
              <img
                className={`${ButtonIcon} ${
                  this.state.isSelecting && this.state.hoveredIndex === index ? 'select' : ''
                }`}
                style={{
                  top: Math.sin(angle) * iconRadius + centerXY,
                  left: Math.cos(angle) * iconRadius + centerXY
                }}
                src={this.state.equippedEmotes[index] && this.state.equippedEmotes[index].iconURL}
              />
            </>
          );
        })}
      </div>
    );
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
    setTimeout(() => {
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
          nextHoverIndex = nextHoverIndex === -1 ? 0 : (nextHoverIndex + 5) % 6;
        } while (!this.hasEquippedEmoteAtIndex(nextHoverIndex));
        this.setState({ hoveredIndex: nextHoverIndex, pointerAngle: buttonAngles[nextHoverIndex] });
        break;
      }
      case ControllerButton.Right: {
        let nextHoverIndex: number = this.state.hoveredIndex;
        do {
          nextHoverIndex = nextHoverIndex === -1 ? 0 : (nextHoverIndex + 1) % 6;
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

    const angle = -Math.atan2(y, x);

    // The north button is at index zero, then clockwise.
    const hoveredIndex = (Math.floor(((angle + Math.PI) * 3) / Math.PI) + 5) % 6;

    this.setState({
      pointerAngle: angle,
      hoveredIndex: this.hasEquippedEmoteAtIndex(hoveredIndex) ? hoveredIndex : this.state.hoveredIndex
    });
  }

  private applyEmoteSelection(): void {
    if (
      this.state.hoveredIndex !== -1 &&
      game.selectedEmoteIndex !== this.state.hoveredIndex &&
      this.hasEquippedEmoteAtIndex(this.state.hoveredIndex)
    ) {
      game.setSelectedEmoteIndex(this.state.hoveredIndex);
      this.setState({ isSelecting: true });
      // This timeout should match the "pulse_em5jd" animation.
      setTimeout(() => {
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
      setTimeout(() => {
        this.checkIsPlayerReady();
      }, 1000);
    }
  }

  private calculateSizes(ref: SVGSVGElement): void {
    if (ref && ref.clientWidth !== this.state.size) {
      const { top, left } = ref.getBoundingClientRect();
      const or = ref.clientWidth * ButtonOuterRadius;
      const ir = or * ButtonInnerRadius;
      const gap = or * ButtonGap;
      this.setState({
        size: ref.clientWidth,
        or,
        ir,
        or2: or * or,
        ir2: ir * ir,
        gap,
        x: left,
        y: top
      });
    }
  }

  private getStrokeColorForIndex(index: number): string {
    if (!this.hasEquippedEmoteAtIndex(index)) {
      return ButtonBorderColor_Equipped;
    } else if (this.state.hoveredIndex === index) {
      return ButtonBorderColor_Hovered;
    } else if (this.getSelectedEmoteIndex() === index) {
      return ButtonBorderColor_Selected;
    } else {
      return ButtonBorderColor_Default;
    }
  }

  private getStrokeWidthForIndex(index: number): string {
    if (this.getSelectedEmoteIndex() === index) {
      return ButtonStrokeWidth_Selected;
    } else {
      return ButtonStrokeWidth_Default;
    }
  }

  private getBackgroundColorForIndex(index: number): string {
    if (!this.hasEquippedEmoteAtIndex(index)) {
      return ButtonBackgroundColor_Equipped;
    } else if (this.getSelectedEmoteIndex() === index) {
      return ButtonBackgroundColor_Selected;
    } else if (this.state.hoveredIndex === index) {
      return ButtonBackgroundColor_Hovered;
    } else {
      return ButtonBackgroundColor_Default;
    }
  }

  private hasEquippedEmoteAtIndex(index: number): boolean {
    return this.state.equippedEmotes.length > index && this.state.equippedEmotes[index] != null;
  }

  private getArcPaths(): string[] {
    const { or, ir, gap, size } = this.state;
    const centerXY = size / 2;
    // Producing six sets of four corners each.
    const corners: string[] = [];

    // The "angle gap" is how many radians we have to adjust forward or backward from the base angles
    // in order to maintain a gap of the specified size between buttons.
    const outerAngleGap = 2 * Math.asin(gap / 2 / or);
    const innerAngleGap = 2 * Math.asin(gap / 2 / ir);

    for (let i = 0; i < 6; ++i) {
      // The start and end angle go through the center of the gap between buttons.
      const startAngle = ((2 - i) / 3) * Math.PI;
      const endAngle = ((1 - i) / 3) * Math.PI;

      const outerStartCornerAngle = startAngle - outerAngleGap;
      const outerEndCornerAngle = endAngle + outerAngleGap;

      const innerStartCornerAngle = startAngle - innerAngleGap;
      const innerEndCornerAngle = endAngle + innerAngleGap;

      const x1 = centerXY + Math.cos(outerStartCornerAngle) * or;
      const y1 = centerXY + Math.sin(-outerStartCornerAngle) * or;

      const x2 = centerXY + Math.cos(outerEndCornerAngle) * or;
      const y2 = centerXY + Math.sin(-outerEndCornerAngle) * or;

      const x3 = centerXY + Math.cos(innerEndCornerAngle) * ir;
      const y3 = centerXY + Math.sin(-innerEndCornerAngle) * ir;

      const x4 = centerXY + Math.cos(innerStartCornerAngle) * ir;
      const y4 = centerXY + Math.sin(-innerStartCornerAngle) * ir;

      corners.push(`M${x1} ${y1} A${or},${or} 0 0,1 ${x2} ${y2} L${x3} ${y3} A${ir},${ir} 0 0,0 ${x4} ${y4} Z`);
    }

    return corners;
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

  private onMouseMove(e: React.MouseEvent<HTMLDivElement>): void {
    // No inputs during the exit animation!
    if (this.state.isExiting || this.state.isSelecting) {
      return;
    }

    // Detect if we are hovering an arc segment.
    const x = e.clientX - this.state.x - this.state.or;
    const y = e.clientY - this.state.y - this.state.or;

    const r2 = x * x + y * y;
    const inRing = r2 >= this.state.ir2 && r2 <= this.state.or2;

    if (inRing) {
      // In radians.
      const angle = Math.atan2(y, x);

      // The north button is at index zero, then clockwise.
      const hoveredIndex = (Math.floor(((angle + Math.PI) * 3) / Math.PI) + 5) % 6;

      this.setState({ hoveredIndex });
    } else {
      this.setState({ hoveredIndex: -1 });
    }
  }

  private onMouseDown(e: React.MouseEvent<HTMLDivElement>): void {
    // No inputs during the exit animation!
    if (this.state.isExiting || this.state.isSelecting) {
      return;
    }

    if (this.state.hoveredIndex !== -1 && this.hasEquippedEmoteAtIndex(this.state.hoveredIndex)) {
      game.setSelectedEmoteIndex(this.state.hoveredIndex);
      this.props.dispatch(hideOverlay(Overlay.EmoteMenu));
    }
  }

  private onMouseLeave(e: React.MouseEvent<HTMLDivElement>): void {
    // No inputs during the exit animation!
    if (this.state.isExiting || this.state.isSelecting) {
      return;
    }

    this.setState({ hoveredIndex: -1 });
  }
}

function mapStateToProps(state: RootState) {
  const { maxEmoteCount } = state.gameSettings;
  const { perksByID } = state.store;
  const { characterClassDefs } = state.game;
  const { stringTable } = state.stringTable;

  return {
    maxEmoteCount,
    perksByID,
    profile: state.profile,
    characterClassDefs,
    stringTable
  };
}

export const EmoteMenu = connect(mapStateToProps)(AEmoteMenu);
