/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 * @Author: JB (jb@codecorsair.com)
 * @Date: 2017-02-23 14:57:24
 * @Last Modified by: JB (jb@codecorsair.com)
 * @Last Modified time: 2017-02-23 18:08:31
 */

import * as React from 'react';
import { StyleSheet, css, StyleDeclaration } from 'aphrodite';
import { FloatSpinner,
         Tooltip,
         events,
         utils,
       } from '..';
import { generateID } from 'redux-typed-modules';
import MultiSelect, { MultiSelectStyle } from './MultiSelect';

const { KeyCodes } = utils;

export interface InlineMultiSelectEditStyle extends StyleDeclaration {
  defaultView: React.CSSProperties;
  editModeContainer: React.CSSProperties;
  editModeButtons: React.CSSProperties;
  editButton: React.CSSProperties;
  saveButton: React.CSSProperties;
  error: React.CSSProperties;
}

export const defaultInlineMultiSelectEditStyle: InlineMultiSelectEditStyle = {
  defaultView: {
    position: 'relative',
    flex: '1 1 auto',
    cursor: 'pointer',
    padding: '4px',
  },

  editModeContainer: {
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

export interface InlineMultiSelectEditProps {
  items: any[];
  value: any[];
  filter: (text: string, item: any) => boolean;
  renderListItem: (item: any, renderData: any) => JSX.Element;
  renderSelectedItem: (item: any, renderData: any) => JSX.Element;
  itemComparison: <T>(a: T, b: T) => boolean;
  renderData?: any;
  onSave: (prev: any, selected: any) => Promise<{ok: boolean, error?: string}>;
  styles?: Partial<InlineMultiSelectEditStyle>;
  selectStyles?: Partial<MultiSelectStyle>;
}

export interface InlineMultiSelectEditState {
  editMode: boolean;
  showEditButton: boolean;
  saving: boolean;
  errors: string;
}

export class InlineMultiSelectEdit extends React.Component<InlineMultiSelectEditProps, InlineMultiSelectEditState> {
  constructor(props: InlineMultiSelectEditProps) {
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
    this.editModeListenerID = events.on(InlineMultiSelectEdit.editModeActiveEvent, this.onEditModeActiveEvent);
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

  onKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.keyCode == KeyCodes.KEY_Escape) {
      if (this.state.editMode) {
        this.deactivateEditMode();
        e.stopPropagation();
      }
    }

    if (e.keyCode == KeyCodes.KEY_Enter) {
      this.doSave();
    }
  }

  showEditButton = () => {
    if (this.state.showEditButton) return;
    this.setState({showEditButton: true});
  }

  doSave = () => {
    if (this.props.value == this.selectRef.selectedItems()) {
      this.deactivateEditMode();
      return;
    }
    this.props.onSave(this.props.value, this.selectRef.selectedItems())
      .then(result => {
        if (result.ok) {
          this.selectRef = null;
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
    events.fire(InlineMultiSelectEdit.editModeActiveEvent, this.id);
  }

  deactivateEditMode = () => {
    this.selectRef = null;
    this.setState({editMode: false});
  }

  selectRef: MultiSelect = null;

  render() {
    const ss = StyleSheet.create(defaultInlineMultiSelectEditStyle);
    const custom = StyleSheet.create(this.props.styles || {});

    if (this.state.editMode) {
      return (
        <div className={css(ss.editModeContainer, custom.editModeContainer)}
             onKeyDown={this.onKeyDown}>
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
          
          <MultiSelect items={this.props.items}
                       ref={r => this.selectRef = r}
                       filter={this.props.filter}
                       itemComparison={this.props.itemComparison}
                       selectedItems={this.props.value}
                       renderSelectedItem={this.props.renderSelectedItem}
                       renderListItem={this.props.renderListItem}
                       renderData={this.props.renderData}
                       styles={this.props.selectStyles}
                       inputProps={{
                         styles: {
                           inputWrapper: {
                             flex: '1 1 auto',
                           },
                           input: {
                             padding: '1px 10px',
                           }
                         }
                       }} />
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
        {this.props.value.map(i => this.props.renderSelectedItem(i, this.props.renderData))}
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

export default InlineMultiSelectEdit;
