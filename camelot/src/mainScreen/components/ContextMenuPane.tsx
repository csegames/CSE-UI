/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { Faction } from '@csegames/library/dist/camelotunchained/webAPI/definitions';
import { Dispatch } from '@reduxjs/toolkit';
import * as React from 'react';
import { connect } from 'react-redux';
import { ContextMenuItem, ContextMenuState, hideContextMenu } from '../redux/contextMenuSlice';
import { RootState } from '../redux/store';
import { HUDHorizontalAnchor, HUDVerticalAnchor } from '@csegames/library/dist/camelotunchained/game/types/HUDTypes';

// If the mouse moves this far away from an open ContextMenu, we will close the menu.
const MENU_CLOSE_DISTANCE_PX = 10;

// Styles.
const Root = 'HUD-ContextMenuPane-Root';
const MenuWrapper = 'HUD-ContextMenuPane-MenuWrapper';
const MenuItem = 'HUD-ContextMenuPane-MenuItem';
const MenuItemDisabled = 'HUD-ContextMenuPane-MenuItemDisabled';

interface State {
  menuBounds: DOMRect;
  xAnchor: HUDHorizontalAnchor;
  yAnchor: HUDVerticalAnchor;
}

interface ReactProps {}

interface InjectedProps {
  // We use ALL of the fields in this class, so just take them all directly.
  contextMenuState: ContextMenuState;
  hudWidth: number;
  hudHeight: number;
  myFaction: Faction;
  dispatch?: Dispatch;
}

type Props = ReactProps & InjectedProps;

class ContextMenuPane extends React.Component<Props, State> {
  private menuRef: HTMLDivElement;
  private mouseMoveHandler: (e: MouseEvent) => void;

  constructor(props: Props) {
    super(props);

    this.state = {
      menuBounds: null,
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

    return (
      <div
        className={MenuWrapper}
        ref={(r) => {
          this.menuRef = r;
          this.recalculateAnchors();
        }}
        style={this.calculateMenuStyle()}
      >
        {typeof this.props.contextMenuState.content === 'function'
          ? this.props.contextMenuState.content()
          : this.renderContentItems()}
      </div>
    );
  }

  private renderContentItems(): React.ReactNode {
    if (Array.isArray(this.props.contextMenuState.content)) {
      const items: ContextMenuItem[] = this.props.contextMenuState.content;

      return (
        <>
          {items.map((item) => {
            return (
              <div
                className={!item.disabled ? MenuItem : `${MenuItem} ${MenuItemDisabled}`}
                key={`ContextMenuItem:${item.title}`}
                onClick={!item.disabled ? item.onClick.bind(item, this.props.dispatch) : undefined}
              >
                {item.title}
              </div>
            );
          })}
        </>
      );
    }
    return null;
  }

  private calculateMenuStyle(): React.CSSProperties {
    const finalStyle: React.CSSProperties = {
      position: 'absolute'
    };

    if (this.state.xAnchor === HUDHorizontalAnchor.Left) {
      finalStyle.left = `${this.props.contextMenuState.mouseX}px`;
    } else {
      finalStyle.right = `${this.props.hudWidth - this.props.contextMenuState.mouseX}px`;
    }

    if (this.state.yAnchor === HUDVerticalAnchor.Top) {
      finalStyle.top = `${this.props.contextMenuState.mouseY}px`;
    } else {
      finalStyle.bottom = `${this.props.hudHeight - this.props.contextMenuState.mouseY}px`;
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

  private handleMouseMove(e: React.MouseEvent): void {
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

function mapStateToProps(state: RootState, ownProps: ReactProps): Props {
  const contextMenuState = state.contextMenu;
  const { hudWidth, hudHeight } = state.hud;
  const myFaction = state.player.faction;

  return {
    ...ownProps,
    contextMenuState,
    hudWidth,
    hudHeight,
    myFaction
  };
}

export default connect(mapStateToProps)(ContextMenuPane);
