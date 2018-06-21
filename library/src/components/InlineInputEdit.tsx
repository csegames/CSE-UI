/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as React from 'react';
import styled from 'react-emotion';
import {
  FloatSpinner,
  Tooltip,
  Input,
  events,
} from '..';
import { generateID } from 'redux-typed-modules';

export interface InlineInputEditStyle {
  defaultView: React.CSSProperties;
  editModeInputContainer: React.CSSProperties;
  editModeButtons: React.CSSProperties;
  editButton: React.CSSProperties;
  saveButton: React.CSSProperties;
  error: React.CSSProperties;
}

const DefaultView = styled('div')`
  position: relative;
  flex: 1;
  cursor: pointer;
  padding: 5px;
`;

const EditModeInputContainer = styled('div')`
  position: relative;
  flex: 1;
  display: flex;
  flex-direction: column;
  min-width: 0;
`;

const EditModeButtons = styled('div')`
  display: flex;
  flex-direction: row-reverse;
  position: absolute;
  top: -1em;
  right: 0;
`;

const Error = styled('div')`
  color: darkred;
  font-size: 0.9em;
`;

export interface InlineInputEditProps {
  value: any;
  type: string;
  inputProps?: any;
  onSave: (prev: any, entered: string) => Promise<{ ok: boolean, error?: string }>;
  styles?: Partial<InlineInputEditStyle>;
}

export interface InlineInputEditState {
  editMode: boolean;
  showEditButton: boolean;
  saving: boolean;
  errors: string;

}

export class InlineInputEdit extends React.Component<InlineInputEditProps, InlineInputEditState> {

  private static editModeActiveEvent = 'input-edit-mode-active';
  private editModeListenerID: any = null;
  private id: string = '';
  private inputRef: HTMLInputElement = null;

  constructor(props: InlineInputEditProps) {
    super(props);
    this.id = generateID(7);
    this.state = {
      editMode: false,
      showEditButton: false,
      saving: false,
      errors: null,
    };
  }

  public render() {
    const customStyles = this.props.styles || {};
    if (this.state.editMode) {
      return (
        <EditModeInputContainer style={customStyles.editModeInputContainer}>
          {
            this.state.errors ?
              (
                <Error style={customStyles.error}>
                  <Tooltip content={() => <span>{this.state.errors}</span>}>
                    <i className='fa fa-exclamation-circle'></i> Save failed.
                  </Tooltip>
                </Error>
              ) : null
          }
          <Input
            type={this.props.type}
            defaultValue={this.props.value}
            inputRef={r => this.inputRef = r}
            styles={{
              inputWrapper: {
                flex: '1 1 auto',
              },
              input: {
                padding: '1px 10px',
              },
            }}
            onKeyDown={this.onKeyDown}
            {...this.props.inputProps}
          />
          {
            this.state.saving ? <FloatSpinner styles={{ spinner: { position: 'absolute' } }}/> : null
          }
          <EditModeButtons style={customStyles.editModeButtons}>
            <a
              style={{ marginLeft: '4px', fontSize: '0.8em' }}
              onClick={this.deactivateEditMode}>cancel</a>
            <a
              style={{ marginLeft: '4px', fontSize: '0.8em' }}
              onClick={this.doSave}>save</a>
          </EditModeButtons>
        </EditModeInputContainer>
      );
    }
    return (
      <DefaultView
        style={customStyles.defaultView}
        onMouseEnter={this.showEditButton}
        onMouseOver={this.showEditButton}
        onMouseLeave={this.onMouseleave}
        onClick={this.activateEditMode}>
        {this.props.value}
        {this.state.showEditButton ?
          (
            <div style={customStyles.editButton}>
              <i className='fa fa-pencil'></i>
            </div>
          ) : null}
      </DefaultView>
    );
  }

  public componentDidMount() {
    this.editModeListenerID = events.on(InlineInputEdit.editModeActiveEvent, this.onEditModeActiveEvent);
  }

  public componentWillUnmount() {
    events.off(this.editModeListenerID);
    this.editModeListenerID = null;
  }

  private onEditModeActiveEvent = (id: string) => {
    if (this.id === id) return;
    if (this.state.editMode) {
      this.deactivateEditMode();
    }
  }

  private onMouseleave = () => {
    if (this.state.showEditButton === false) return;
    this.setState({ showEditButton: false });
  }

  private onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    // escape pressed
    if (e.keyCode === 27) {
      if (this.state.editMode) {
        this.deactivateEditMode();
        e.preventDefault();
        e.stopPropagation();
      }
    }

    // enter pressed
    if (e.keyCode === 13) {
      this.doSave();
    }
  }

  private showEditButton = () => {
    if (this.state.showEditButton) return;
    this.setState({ showEditButton: true });
  }

  private doSave = () => {
    if (this.props.value + '' === this.inputRef.value) {
      this.deactivateEditMode();
      return;
    }
    this.props.onSave(this.props.value, this.inputRef.value)
      .then((result) => {
        if (result.ok) {
          this.inputRef = null;
          this.setState({
            saving: false,
            editMode: false,
            errors: null,
          });
        }
        this.setState({
          saving: false,
          errors: result.error,
        });
      });

    this.setState({ saving: true });
  }

  private activateEditMode = () => {
    this.setState({
      editMode: true,
      showEditButton: false,
    });
    setTimeout(() => {
      if (this.inputRef) this.inputRef.focus();
    }, 200);
    events.fire(InlineInputEdit.editModeActiveEvent, this.id);
  }

  private deactivateEditMode = () => {
    this.inputRef = null;
    this.setState({ editMode: false });
  }
}

export default InlineInputEdit;
