/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { Dispatch } from '@reduxjs/toolkit';
import * as React from 'react';
import { connect } from 'react-redux';
import { ContextMenuActionItem, ContextMenuState, hideContextMenu } from '../redux/contextMenuSlice';
import { AddDispatch, RootState } from '../redux/store';
import { HUDHorizontalAnchor, HUDVerticalAnchor } from '@csegames/library/dist/camelotunchained/game/types/HUDTypes';
import { BorderBackground, BorderType, FactionBorder } from './FactionBorder';
import { getFactionData } from '../gameData/factionData';

// If the mouse moves this far away from an open ContextMenu, we will close the menu.
const MENU_CLOSE_DISTANCE_PX = 10;

// Styles.
const Root = 'HUD-ContextMenuPane-Root';
const MenuWrapper = 'HUD-ContextMenuPane-MenuWrapper';
const MenuItem = 'HUD-ContextMenuPane-MenuItem';
const MenuItemDisabled = 'HUD-ContextMenuPane-MenuItemDisabled';
const Separator = 'HUD-ContextMenuPane-Separator';

interface State {
  xAnchor: HUDHorizontalAnchor;
  yAnchor: HUDVerticalAnchor;
}

interface ReactProps {}

interface InjectedProps {
  // We use ALL of the fields in this class, so just take them all directly.
  contextMenuState: ContextMenuState;
  hudWidth: number;
  hudHeight: number;
  uiFactionID: string;
  dispatch?: Dispatch;
}

type Props = ReactProps & InjectedProps & AddDispatch;

class ContextMenuPane extends React.Component<Props, State> {
  private menuRef: HTMLDivElement | null = null;
  private mouseMoveHandler: (e: MouseEvent) => void;

  constructor(props: Props) {
    super(props);

    this.state = {
      // ContextMenus show to the bottom right of the mouse by default (i.e. the mouse cursor is the TopLeft anchor of the tooltip).
      xAnchor: HUDHorizontalAnchor.Left,
      yAnchor: HUDVerticalAnchor.Top
    };

    // Stashing the function pointer used to register for window events, so we can unregister later.
    this.mouseMoveHandler = this.handleMouseMove.bind(this);
  }

  public render(): React.ReactNode {
    return <div className={Root}>{this.renderMenu()}</div>;
  }

  private renderMenu(): React.ReactNode {
    // If there is no current context menu, don't render one.
    if (this.props.contextMenuState.id === null) {
      this.menuRef = null;
      return null;
    }

    const factionData = getFactionData(this.props.uiFactionID);

    return (
      <FactionBorder
        className={MenuWrapper}
        type={BorderType.Secondary}
        background={BorderBackground.PatternSmall}
        style={this.calculateMenuStyle()}
      >
        <style>
          {
            // The 'aa' sets the hover background to a partially-transparent realm color, matching the map's FactionComboBox.
            `.${MenuItem}:hover { background-color: ${factionData.borderColor}aa; }`
          }
        </style>
        <div
          className={'absoluteFill'}
          ref={(r) => {
            this.menuRef = r;
            this.recalculateAnchors();
          }}
        />
        {typeof this.props.contextMenuState.content === 'function'
          ? this.props.contextMenuState.content()
          : this.renderContentItems()}
      </FactionBorder>
    );
  }

  private renderContentItems(): React.ReactNode {
    if (!Array.isArray(this.props.contextMenuState.content)) {
      return null;
    }

    return (
      <>
        {this.props.contextMenuState.content.map((item, index) =>
          'kind' in item ? this.renderSeparator(index) : this.renderMenuItem(item)
        )}
      </>
    );
  }

  private renderSeparator(index: number): React.ReactNode {
    const separatorColor = getFactionData(this.props.uiFactionID).borderColor;
    return <div className={Separator} key={`ContextMenuSeparator:${index}`} style={{ backgroundColor: separatorColor }} />;
  }

  private renderMenuItem(item: ContextMenuActionItem): React.ReactNode {
    return (
      <div
        className={!item.disabled ? MenuItem : `${MenuItem} ${MenuItemDisabled}`}
        key={`ContextMenuItem:${item.title}`}
        onClick={!item.disabled ? this.handleItemClicked.bind(this, item) : undefined}
      >
        {item.title}
      </div>
    );
  }

  private handleItemClicked(item: ContextMenuActionItem): void {
    item.onClick(this.props.dispatch);

    if (!item.keepOpenAfterSelection) {
      this.props.dispatch(hideContextMenu());
    }
  }

  private calculateMenuStyle(): React.CSSProperties {
    const finalStyle: React.CSSProperties = {
      position: 'absolute'
    };

    if (this.state.xAnchor === HUDHorizontalAnchor.Left) {
      finalStyle.left = `${this.props.contextMenuState.mouseX}px`;
    } else {
      finalStyle.right = `${this.props.hudWidth - this.props.contextMenuState.mouseX!}px`;
    }

    if (this.state.yAnchor === HUDVerticalAnchor.Top) {
      finalStyle.top = `${this.props.contextMenuState.mouseY}px`;
    } else {
      finalStyle.bottom = `${this.props.hudHeight - this.props.contextMenuState.mouseY!}px`;
    }

    return finalStyle;
  }

  private recalculateAnchors(): void {
    if (!this.menuRef) {
      return;
    }

    const bounds = this.menuRef.getBoundingClientRect();
    // If the menu hangs off the right edge (or has ceased to do so), change its horizontal anchor.
    if (bounds.right > this.props.hudWidth) {
      this.setState({ xAnchor: HUDHorizontalAnchor.Right });
    } else if (this.state.xAnchor === HUDHorizontalAnchor.Right && bounds.right + bounds.width < this.props.hudWidth) {
      this.setState({ xAnchor: HUDHorizontalAnchor.Left });
    }

    // If the menu hangs off the bottom edge (or has ceased to do so), change its vertical anchor.
    if (bounds.bottom > this.props.hudHeight) {
      this.setState({ yAnchor: HUDVerticalAnchor.Bottom });
    } else if (
      this.state.yAnchor === HUDVerticalAnchor.Bottom &&
      bounds.bottom + bounds.height < this.props.hudHeight
    ) {
      this.setState({ yAnchor: HUDVerticalAnchor.Top });
    }
    // However, if it is hanging off of the left or top edge, we have already flipped the anchor,
    // and there's no point in flipping it back, since we will overflow either way.
  }

  componentDidUpdate(prevProps: Readonly<Props>, prevState: Readonly<State>, snapshot?: any): void {
    // If the content changed, reset the anchors for the new contextMenu.
    if (prevProps.contextMenuState?.content !== this.props.contextMenuState?.content) {
      this.setState({ xAnchor: HUDHorizontalAnchor.Left, yAnchor: HUDVerticalAnchor.Top });

      if (this.props.contextMenuState.content) {
        // Menu was just created, so register for window mouse events.
        // Need to be able to detect when the cursor moves away from the menu.
        window.addEventListener('mousemove', this.mouseMoveHandler);
      } else {
        // Menu was just closed, so unregister from window mouse events.
        window.removeEventListener('mousemove', this.mouseMoveHandler);
      }
    }
  }

  private handleMouseMove(e: MouseEvent): void {
    if (!this.menuRef) {
      return;
    }

    // If the mouse moves away from the contextMenu, close the contextMenu.
    const bounds = this.menuRef.getBoundingClientRect();
    if (
      e.clientX < bounds.x - MENU_CLOSE_DISTANCE_PX ||
      e.clientX > bounds.right + MENU_CLOSE_DISTANCE_PX ||
      e.clientY < bounds.y - MENU_CLOSE_DISTANCE_PX ||
      e.clientY > bounds.bottom + MENU_CLOSE_DISTANCE_PX
    ) {
      this.props.dispatch(hideContextMenu());
    }
  }
}

function mapStateToProps(state: RootState, ownProps: ReactProps): ReactProps & InjectedProps {
  const contextMenuState = state.contextMenu;
  const { hudWidth, hudHeight, uiFactionID } = state.hud;

  return {
    ...ownProps,
    contextMenuState,
    hudWidth,
    hudHeight,
    uiFactionID
  };
}

export default connect(mapStateToProps)(ContextMenuPane);
