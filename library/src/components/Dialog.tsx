/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

/*
 * Usage:
 *
 * Wrap any element with this component and you'll get a confirmation
 * dialog popup when the element inside is clicked.
 *
 * <Dialog content={(props: any) => <div>Are you sure?</div>}
 *   cancelOnClickOutside={true} >
 *   <button>Click Me!</button>
 * </Dialog>
 *
 */

import * as React from 'react';
import styled from 'react-emotion';

const Container = styled('div')`
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: default;
  background-color: rgba(0, 0, 0, 0.4);
  z-index: 99999;
`;

const DialogContainer = styled('div')`
  background-color: #444;
  min-width: 250px;
  min-height: 100px;
  display: flex;
  flex-direction: column;
`;

const ContentWrapper = styled('div')`
  flex: 1;
`;

export interface DialogStyle {
  container: React.CSSProperties;
  dialog: React.CSSProperties;
  contentWrapper: React.CSSProperties;
}

export interface DialogProps<ContentProps> {
  content: (props: ContentProps) => JSX.Element;
  closeOnClickOutside?: boolean;
  contentProps?: ContentProps;
  styles?: Partial<DialogStyle>;
}

export interface DialogState {
  hidden: boolean;
  closeOnClickOutside: boolean;
}

export class Dialog<ContentProps> extends React.Component<DialogProps<ContentProps>, DialogState> {

  private mouseOver = false;

  constructor(props: DialogProps<ContentProps>) {
    super(props);

    this.state = {
      hidden: true,
      closeOnClickOutside: this.props.closeOnClickOutside || false,
    };
  }

  public render() {
    const customStyle = this.props.styles || {};
    return (
      <div onClick={this.clicked} style={{ display: 'inline-block' }}>
        {this.props.children}
        {
          this.state.hidden ? null :
            <Container style={customStyle.container}>
              <DialogContainer
                style={customStyle.dialog}
                onMouseEnter={this.onMouseEnter}
                onMouseLeave={this.onMouseleave}>
                <ContentWrapper style={customStyle.contentWrapper}>
                  <this.props.content {...this.props.contentProps} />
                </ContentWrapper>
              </DialogContainer>
            </Container>
        }
      </div>
    );
  }

  public show = () => {
    this.setState({
      hidden: false,
    } as any);
    this.mouseOver = false;
  }

  public hide = () => {
    this.setState({
      hidden: true,
    } as any);
    window.removeEventListener('mousedown', this.windowMouseDown);
    this.mouseOver = false;
  }

  public componentWillUnmount() {
    window.removeEventListener('mousedown', this.windowMouseDown);
  }

  private onMouseEnter = () => {
    this.mouseOver = true;
  }

  private onMouseleave = () => {
    this.mouseOver = false;
  }

  private windowMouseDown = () => {
    if (this.state.closeOnClickOutside && !this.state.hidden && !this.mouseOver) {
      this.hide();
    }
  }

  private clicked = () => {
    if (!this.state.hidden) return;
    this.show();
    window.addEventListener('mousedown', this.windowMouseDown);
  }
}

export default Dialog;
