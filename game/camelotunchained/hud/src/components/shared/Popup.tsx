/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as React from 'react';
import { styled } from '@csegames/linaria/react';
import { showPopup, ShowPopupPayload, onShowPopup, onHidePopup } from 'actions/popup';
import { getViewportSize } from 'hudlib/viewport';

const Container = styled.div`
`;

const PopupContainer = styled.div`
  position: fixed;
  z-index: 9999;
`;

const Overlay = styled.div`
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 9998;
`;

export interface PopupViewState {
  visible: boolean;
  content: JSX.Element | JSX.Element[] | string;
}

export class PopupView extends React.Component<{}, PopupViewState> {
  private eventHandles: EventHandle[] = [];
  private popupRef: HTMLDivElement;
  private mousePos: { clientX: number, clientY: number } = { clientX: 0, clientY: 0 };
  constructor(props: {}) {
    super(props);
    this.state = {
      visible: false,
      content: null,
    };
  }

  public render() {
    return this.state.visible ? (
      <Container>
        <Overlay onClick={this.handleHidePopup} />
        <PopupContainer ref={this.handleRef}>
          {this.state.content}
        </PopupContainer>
      </Container>
    ) : null;
  }

  public componentDidMount() {
    this.eventHandles.push(onShowPopup(this.handleShowPopup));
    this.eventHandles.push(onHidePopup(this.handleHidePopup));
  }

  public componentWillUnmount() {
    this.eventHandles.forEach(e => e.clear());
  }

  private handleRef = (r: HTMLDivElement) => {
    this.popupRef = r;
    this.updatePosition();
  }

  private handleShowPopup = (payload: ShowPopupPayload) => {
    const { content, event } = payload;
    this.mousePos = { clientX: event.clientX, clientY: event.clientY };
    this.setState({ visible: true, content });
  }

  private handleHidePopup = () => {
    this.setState({ visible: false, content: null });
  }

  private updatePosition = () => {
    if (!this.popupRef) return;

    const bounds = this.popupRef.getBoundingClientRect();
    const viewport = getViewportSize();

    let left = this.mousePos.clientX;
    let top = this.mousePos.clientY;

    if (left + bounds.width > viewport.width) {
      // flip tooltip to the left of the mouse
      left = Math.max(this.mousePos.clientX - bounds.width, 0);
    }

    if (top + bounds.height > viewport.height) {
      top = Math.max(this.mousePos.clientY - bounds.height, 0);
    }

    this.popupRef.style.left = left + 'px';
    this.popupRef.style.top = top + 'px';
  }
}

export interface Props {
  content: JSX.Element | JSX.Element[] | string;
}

export class Popup extends React.Component<Props> {
  public render() {
    if (!this.props.children) {
      return null;
    }

    if (Array.isArray(this.props.children)) {
      console.warn('Popup can only have one child element!');
      return null;
    }

    const children = this.props.children as any;
    const newElement = React.cloneElement(this.props.children as any, {
      onClick: (e) => {
        this.handleClick(e);
        if (children.props && children.props.onMouseOver) {
          children.props.onMouseOver.call(newElement, e);
        }
      },
    });
    return newElement;
  }

  private handleClick = (e: React.MouseEvent<HTMLElement>) => {
    const payload: ShowPopupPayload = {
      content: this.props.content,
      event: e,
    };
    showPopup(payload);
  }
}
