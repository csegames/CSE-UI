/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 * @Author: JB (jb@codecorsair.com)
 * @Date: 2017-02-22 12:08:53
 * @Last Modified by: JB (jb@codecorsair.com)
 * @Last Modified time: 2017-02-23 15:01:41
 */

import * as React from 'react';
import { StyleSheet, css, StyleDeclaration } from 'aphrodite';
import { 
         FloatSpinner,
         Tooltip,
         Input,
         events,
       } from '..';
import { generateID } from 'redux-typed-modules';

export interface InlineInputEditStyle extends StyleDeclaration {
  defaultView: React.CSSProperties;
  editModeInputContainer: React.CSSProperties;
  editModeButtons: React.CSSProperties;
  editButton: React.CSSProperties;
  saveButton: React.CSSProperties;
  error: React.CSSProperties;
}

export const defaultInlineInputEditStyle: InlineInputEditStyle = {
  defaultView: {
    position: 'relative',
    flex: '1 1 auto',
    cursor: 'pointer',
    padding: '5px',
  },

  editModeInputContainer: {
    position: 'relative',
    flex: '1 1 auto',
    display: 'flex',
    flexDirection: 'column',
    minWidth: '0',
  },

  editModeButtons: {
    display: 'flex',
    flexDirection: 'row-reverse',
    position: 'absolute',
    top: '-1em',
    right: '0',
  },

  editButton: {
    position: 'absolute',
    right: '0px',
    bottom: '0px',
    fontSize: '0.7em',
  },

  saveButton: {

  },

  error: {
    color: 'darkred',
    fontSize: '0.9em',
  }
};

export interface InlineInputEditProps {
  value: any;
  type: string;
  inputProps?: any;
  onSave: (prev: any, entered: string) => Promise<{ok: boolean, error?: string}>;
  styles?: Partial<InlineInputEditStyle>;
}

export interface InlineInputEditState {
  editMode: boolean;
  showEditButton: boolean;
  saving: boolean;
  errors: string;
  
}

export class InlineInputEdit extends React.Component<InlineInputEditProps, InlineInputEditState> {
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

  static editModeActiveEvent = 'input-edit-mode-active';
  editModeListenerID: any = null;
  id: string = '';
  
  componentDidMount() {
    this.editModeListenerID = events.on(InlineInputEdit.editModeActiveEvent, this.onEditModeActiveEvent);
  }

  componentWillUnmount() {
    events.off(this.editModeListenerID)
    this.editModeListenerID = null;
  }

  onEditModeActiveEvent = (id: string) => {
    if (this.id == id) return;
    if (this.state.editMode) {
      this.deactivateEditMode();
    }
  }

  onMouseleave = () => {
    if (this.state.showEditButton == false) return;
    this.setState({showEditButton: false});
  }

  onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    // escape pressed
    if (e.keyCode == 27) {
      if (this.state.editMode) {
        this.deactivateEditMode();
        e.preventDefault();
        e.stopPropagation();
      }
    }

    // enter pressed
    if (e.keyCode == 13) {
      this.doSave();
    }
  }

  showEditButton = () => {
    if (this.state.showEditButton) return;
    this.setState({showEditButton: true});
  }

  doSave = () => {
    if (this.props.value + '' === this.inputRef.value) {
      this.deactivateEditMode();
      return;
    }
    this.props.onSave(this.props.value, this.inputRef.value)
      .then(result => {
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

    this.setState({saving: true});
  }

  activateEditMode = () => {
    this.setState({
      editMode: true,
      showEditButton: false,
    });
    setTimeout(() => {
      if (this.inputRef) this.inputRef.focus();
    }, 200);
    events.fire(InlineInputEdit.editModeActiveEvent, this.id);
  }

  deactivateEditMode = () => {
    this.inputRef = null;
    this.setState({editMode: false});
  }

  inputRef: HTMLInputElement = null;

  render() {
    const ss = StyleSheet.create(defaultInlineInputEditStyle);
    const custom = StyleSheet.create(this.props.styles || {});

    if (this.state.editMode) {
      return (
        <div className={css(ss.editModeInputContainer, custom.editModeInputContainer)}>
          {
            this.state.errors ?
            (
              <div className={css(ss.error, custom.error)}>
                <Tooltip content={() => <span>{this.state.errors}</span>}>
                  <i className="fa fa-exclamation-circle"></i> Save failed.
                </Tooltip>
              </div>
            ) : null
          }
          <Input type={this.props.type}
                 defaultValue={this.props.value}
                 inputRef={r => this.inputRef = r}
                 styles={{
                   inputWrapper: {
                     flex: '1 1 auto',
                   },
                   input: {
                     padding: '1px 10px',
                   }
                 }}
                 onKeyDown={this.onKeyDown}
                 {...this.props.inputProps} />
                 {
                   this.state.saving ? <FloatSpinner styles={{spinner: { position: 'absolute' }}} /> : null
                 }
          <div className={css(ss.editModeButtons, custom.editModeButtons)}>
            <a style={{
                    marginLeft: '4px',
                    fontSize: '0.8em',
                  }
                }
                onClick={this.deactivateEditMode} >cancel</a>
            <a style={{
                    marginLeft: '4px',
                    fontSize: '0.8em',
                  }
                }
                onClick={this.doSave}>save</a>
            
          </div>
        </div>
      );
    }
    return (
      <div className={css(ss.defaultView, custom.defaultView)}
           onMouseEnter={this.showEditButton}
           onMouseOver={this.showEditButton}
           onMouseLeave={this.onMouseleave}
           onClick={this.activateEditMode}>
        {this.props.value}
        {this.state.showEditButton ?
          (
            <div className={css(ss.editButton, custom.editButton)}>
              <i className='fa fa-pencil'></i>
            </div>
          ) : null}
      </div>
    );
  }
}

export default InlineInputEdit;
