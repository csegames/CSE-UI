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
  events,
  utils,
} from '..';
import { generateID } from 'redux-typed-modules';
import MultiSelect, { MultiSelectStyle } from './MultiSelect';

const { KeyCodes } = utils;

export interface InlineMultiSelectEditStyle {
  defaultView: React.CSSProperties;
  editModeContainer: React.CSSProperties;
  editModeButtons: React.CSSProperties;
  editButton: React.CSSProperties;
  saveButton: React.CSSProperties;
  error: React.CSSProperties;
}

const DefaultView = styled('div')`
  position: relative;
  flex: 1;
  cursor: pointer;
  padding: 4px;
`;

const EditModeContainer = styled('div')`
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

const EditButton = styled('div')`
  position: absolute;
  right: 0;
  bottom: 0;
  font-size: 0.7em;
`;

const Error = styled('div')`
  color: darkred;
  font-size: 0.9em;
`;

// tslint:disable-next-line
export interface comparisonFunction<T> {
  (a: T, b: T): boolean;
}

export interface InlineMultiSelectEditProps {
  items: any[];
  value: any[];
  filter: (text: string, item: any) => boolean;
  renderListItem: (item: any, renderData: any) => JSX.Element;
  renderSelectedItem: (item: any, renderData: any) => JSX.Element;
  itemComparison: comparisonFunction<any>;
  renderData?: any;
  onSave: (prev: any, selected: any) => Promise<{ ok: boolean, error?: string }>;
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

  private static editModeActiveEvent = 'input-edit-mode-active';
  private editModeListenerID: any = null;
  private id: string = '';
  private selectRef: MultiSelect = null;

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

  public render() {
    const customStyles = this.props.styles || {};
    if (this.state.editMode) {
      return (
        <EditModeContainer style={customStyles.editModeContainer} onKeyDown={this.onKeyDown}>
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

          <MultiSelect
            items={this.props.items}
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
                },
              },
            }}/>
          {
            this.state.saving ? <FloatSpinner styles={{ spinner: { position: 'absolute' } }}/> : null
          }
          <EditModeButtons style={customStyles.editModeButtons}>
            <a style={{ marginLeft: '4px', fontSize: '0.8em' }} onClick={this.deactivateEditMode}>cancel</a>
            <a style={{ marginLeft: '4px', fontSize: '0.8em' }} onClick={this.doSave}>save</a>
          </EditModeButtons>
        </EditModeContainer>
      );
    }
    return (
      <DefaultView
        onMouseEnter={this.showEditButton}
        onMouseOver={this.showEditButton}
        onMouseLeave={this.onMouseleave}
        onClick={this.activateEditMode}>
        {this.props.value.map(i => this.props.renderSelectedItem(i, this.props.renderData))}
        {this.state.showEditButton ?
          (
            <EditButton style={customStyles.editButton}>
              <i className='fa fa-pencil'></i>
            </EditButton>
          ) : null}
      </DefaultView>
    );
  }

  public componentDidMount() {
    this.editModeListenerID = events.on(InlineMultiSelectEdit.editModeActiveEvent, this.onEditModeActiveEvent);
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

  private onKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.keyCode === KeyCodes.KEY_Escape) {
      if (this.state.editMode) {
        this.deactivateEditMode();
        e.stopPropagation();
      }
    }

    if (e.keyCode === KeyCodes.KEY_Enter) {
      this.doSave();
    }
  }

  private showEditButton = () => {
    if (this.state.showEditButton) return;
    this.setState({ showEditButton: true });
  }

  private doSave = () => {
    if (this.props.value === this.selectRef.selectedItems()) {
      this.deactivateEditMode();
      return;
    }
    this.props.onSave(this.props.value, this.selectRef.selectedItems())
      .then((result) => {
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

    this.setState({ saving: true });
  }

  private activateEditMode = () => {
    this.setState({
      editMode: true,
      showEditButton: false,
    });
    events.fire(InlineMultiSelectEdit.editModeActiveEvent, this.id);
  }

  private deactivateEditMode = () => {
    this.selectRef = null;
    this.setState({ editMode: false });
  }
}

export default InlineMultiSelectEdit;
