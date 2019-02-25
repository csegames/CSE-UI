/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as React from 'react';
import { styled } from 'linaria/react';
import { isEmpty } from 'lodash';

import * as actions from 'actions/contextMenu';
import { getViewportSize } from 'lib/viewport';

const Container = styled.div`
  background: rgba(0, 0, 0, 0.01);
  position: fixed;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  z-index: 10000;
`;

const Item = styled.li`
  padding: 2px 5px;
  margin: 0;
  color: #ececec;
  pointer-events: all;
  cursor: pointer;
  &:hover {
    color: ${(props: any) => props.color};
  }
`;

const HeaderOverlay = styled.div`
  pointer-events: none;
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: -1;
  background: linear-gradient(to right, ${(props: {color: string}) => props.color}, transparent);
  box-shadow: inset 0 0 20px 2px rgba(0,0,0,0.8);
  height: 106px;
  &:after {
    content: '';
    position: absolute;
    height: 106px;
    left: 0;
    right: 0;
    bottom: 0;
    background: url(/hud-new/images/item-tooltips/title_viel.png);
    background-size: cover;
    background-repeat: no-repeat;
  }
`;

const Overlay = styled.ol`
  list-style: none;
  position: fixed;
  margin: 0;
  padding: 0;
  z-index: 10001;
  display: flex;
  flex-direction: column;
  pointer-events: none;
  border-width: 2px;
  border-style: solid;
  border-image: linear-gradient(to bottom, ${(props: any) => props.color}, transparent);
  border-image-slice: 1;
  background: url(/hud-new/images/item-tooltips/bg.png);
  background-size: cover;
  -webkit-mask-image: url(/hud-new/images/item-tooltips/ui-mask.png);
  -webkit-mask-size: cover;
  color: #ABABAB;
  width: auto;
  overflow: hidden;
  &:before {
    content: '';
    position: absolute;
    top: 0px;
    left: 0px;
    background: url(/hud-new/images/item-tooltips/ornament_left.png);
    width: 35px;
    height: 35px;
  }
  &:after {
    content: '';
    position: absolute;
    top: 0px;
    right: 0px;
    background: url(/hud-new/images/item-tooltips/ornament_right.png);
    width: 35px;
    height: 35px;
  }
  padding: 5px;
`;

export type MenuItem = {
  title: string;
  onSelected: () => void;
};

export type StylePosition = {
  left?: string;
  top?: string;
  right?: string;
  bottom?: string;
};

export type Props = {
};

export type State = {
  show: boolean;
  styledPosition: StylePosition;
  content: JSX.Element;
  items: MenuItem[];
  clientPosition: Vec2f;
};

export class ContextMenuView extends React.Component<Props, State> {

  private eventHandles: EventHandle[] = [];

  constructor(props: Props) {
    super(props);
    this.state = {
      show: false,
      items: [],
      content: null,
      styledPosition: {
        right: '-1000px',
        bottom: '-1000px',
      },
      clientPosition: {
        x: -1000,
        y: -1000,
      },
    };
    this.eventHandles.push(actions.onShowContextMenu(this.onShowContextMenu));
    this.eventHandles.push(actions.onShowContextMenuContent(this.onShowContextMenuContent));
    this.eventHandles.push(actions.onHideContextMenu(this.hide));
  }

  public componentWillUnmount() {
    this.eventHandles.forEach(eventHandle => eventHandle.clear());
  }

  public render() {
    if (this.state.show === false) return null;

    return (
      <UIContext.Consumer>
        {
          (ui) => {
            const color = ui.currentTheme().toolTips.color[game.selfPlayerState.faction];
            return (
              <Container
                id='context-menu'
                data-input-group='block'
                onMouseDown={this.hide}
              >
                <Overlay
                  onMouseDown={(e: React.MouseEvent) => e.stopPropagation()}
                  color={color}
                  ref={this.refCallback}
                  style={{
                    position: 'fixed',
                    ...this.state.styledPosition,
                  }}>
                  <HeaderOverlay color={color} />
                  {this.state.content && this.state.content}
                  {
                    this.state.items &&
                      this.state.items.map(item => (
                        <Item
                          key={item.title}
                          color={'yellow'}
                          onMouseDown={(event: React.MouseEvent) => {
                            event.stopPropagation();
                            this.hide();
                            item.onSelected();
                          }}>
                          {item.title}
                        </Item>
                      ))
                  }
                </Overlay>
              </Container>
            );
          }
        }
      </UIContext.Consumer>
    );
  }

  private refCallback = (element: HTMLOListElement) => {
    if (!element) return;

    const bounds = element.getBoundingClientRect();
    const viewport = getViewportSize();


    let left = this.state.clientPosition.x - (bounds.width * .5);
    let top = this.state.clientPosition.y + 5;

    if (left + bounds.width > viewport.width) {
      left -= viewport.width - left + bounds.width;
    }

    if (top + bounds.height > viewport.height) {
      top -= viewport.height - top + bounds.height + 5;
    }

    this.setState({
      styledPosition: {
        left: left + 'px',
        top: top + 'px',
      },
    });
  }

  private hide = () => {
    if (this.state.show === false) return;

    this.setState({
      show: false,
      styledPosition: {
        right: '-1000px',
        bottom: '-1000px',
      },
      items: [],
    });
  }

  private onShowContextMenuContent = (content: JSX.Element, event: React.MouseEvent) => {
    if (!content) return;

    this.setState({
      show: true,
      items: [],
      content,
      clientPosition: {
        x: event.clientX,
        y: event.clientY,
      },
    });
  }

  private onShowContextMenu = (items: MenuItem[], event: React.MouseEvent) => {
    // If there are no items, dont show context menu
    if (isEmpty(items)) return;

    this.setState({
      show: true,
      items,
      content: null,
      clientPosition: {
        x: event.clientX,
        y: event.clientY,
      },
    });
  }
}



interface ContentMenuItemsProps {
  type: 'items';
  getItems: () => MenuItem[];
  children: React.ReactNode;
}

interface ContentMenuContentProps {
  type: 'content';
  getContent: () => JSX.Element;
  children: React.ReactNode;
}

type ContextMenuProps = ContentMenuItemsProps | ContentMenuContentProps;

// tslint:disable-next-line:function-name
export function ContextMenu(props: ContextMenuProps) {

  function handleMouseDown(e: React.MouseEvent) {
    if (e.button === 2) {
      if (props.type === 'items') {
        actions.showContextMenu(props.getItems(), e);
      } else {
        actions.showContextMenuContent(props.getContent(), e);
      }
    }
  }

  const { children } = props as any;

  if (!children) {
    return null;
  }

  if (typeof children === 'string') {
    return <span onMouseDown={handleMouseDown}>{children}</span>;
  }

  if (Array.isArray(children)) {
    console.warn('ContextMenu can only have one child element!');
    return null;
  }

  const newElement = React.cloneElement(children as any, {
    onMouseDown: (e) => {
      handleMouseDown(e);
      if (children.props && children.props.onMouseDown) {
        children.props.onMouseDown.call(newElement, e);
      }
    },
  });
  return newElement;
}

