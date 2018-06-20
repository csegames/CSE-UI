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
 * <ConfirmDialog onConfirm={() => Do something }
 *   onCancel={() => Do something}
 *   content={(props: any) => <div>Are you sure?</div>}
 *   cancelOnClickOutside={true} >
 *   <button>Click Me!</button>
 * </ConfirmDialog>
 * 
 */

import * as React from 'react';
import styled from 'react-emotion';
import { merge } from 'lodash';

const Container = styled('div')`
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: default;
  background-color: rgba(0, 0, 0, 0.4);
`;

const Dialog = styled('div')`
  background-color: #444;
  min-width: 250px;
  min-height: 100px;
  display: flex;
  flex-direction: column;
`;

const Content = styled('div')`
  padding: 10px;
  flex: 1;
`;

const Buttons = styled('div')`
  display: flex;
  flex: 0;
  justify-content: space-around;
  align-items: center;
  width: 100%;
  padding: 10px 20px;
`;

const ConfirmButton = styled('div')`
  padding: 5px 10px;
  cursor: pointer;
  &:hover {
    background-color: rgba(0, 0, 0, 0.2);
  }
`;

const CancelButton = styled('div')`
  padding: 5px 10px;
  cursor: pointer;
  &:hover {
    background-color: rgba(0, 0, 0, 0.2);
  }
`;

export interface ConfirmDialogStyle {
  container: React.CSSProperties;
  dialog: React.CSSProperties;
  content: React.CSSProperties;
  buttons: React.CSSProperties;
  confirmButton: React.CSSProperties;
  cancelButton: React.CSSProperties;
}

export interface ConfirmDialogProps<ContentProps> {
  onConfirm: () => void;
  onCancel: () => void;
  content: (props: ContentProps) => JSX.Element;
  cancelOnClickOutside?: boolean;
  contentProps?: ContentProps;
  styles?: Partial<ConfirmDialogStyle>;
  confirmButtonContent?: JSX.Element | string;
  cancelButtonContent?: JSX.Element | string;
}

export interface ConfirmDialogState {
  hidden: boolean;
  cancelOnClickOutside: boolean;
}

export class ConfirmDialog<ContentProps> extends React.Component<ConfirmDialogProps<ContentProps>, ConfirmDialogState> {

  private mouseOver = false;

  constructor(props: ConfirmDialogProps<ContentProps>) {
    super(props);

    this.state = {
      hidden: true,
      cancelOnClickOutside: this.props.cancelOnClickOutside || false,
    };
  }

  public render() {
    const customStyles = this.props.styles || {};
    return (
      <div onClick={this.clicked} style={{ display: 'inline-block' }}>
        {this.props.children}
        {
          this.state.hidden ? null :
            <Container style={customStyles.container}>
              <Dialog style={customStyles.dialog} onMouseEnter={this.onMouseEnter} onMouseLeave={this.onMouseleave}>
                <Content style={customStyles.content}>
                  <this.props.content {...this.props.contentProps} />
                </Content>
                <Buttons style={customStyles.buttons}>
                  <ConfirmButton style={customStyles.confirmButton} onClick={this.confirm}>
                    {this.props.confirmButtonContent || 'Confirm'}
                  </ConfirmButton>
                  <CancelButton style={customStyles.cancelButton} onClick={this.cancel}>
                    {this.props.cancelButtonContent || 'Cancel'}
                  </CancelButton>
                </Buttons>
              </Dialog>
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

  private confirm = () => {
    this.hide();
    this.props.onConfirm();
  }

  private cancel = () => {
    this.hide();
    this.props.onCancel();
  }

  private onMouseEnter = () => {
    this.mouseOver = true;
  }

  private onMouseleave = () => {
    this.mouseOver = false;
  }

  private windowMouseDown = () => {
    if (this.state.cancelOnClickOutside && !this.state.hidden && !this.mouseOver) {
      this.cancel();
    }
  }

  private clicked = () => {
    if (!this.state.hidden) return;
    this.show();
    window.addEventListener('mousedown', this.windowMouseDown);
  }
}

export default ConfirmDialog;
