/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { Dispatch } from '@reduxjs/toolkit';
import * as React from 'react';
import { connect } from 'react-redux';
import { hideModal, ModalButtonModel, ModalParams } from '../redux/modalsSlice';
import { RootState } from '../redux/store';
import Escapable from './Escapable';
import { BorderBackground, BorderType, FactionBorder } from './FactionBorder';
import { CornerButtonType, FactionCornerButton } from './FactionCornerButton';
import { FactionButton } from './FactionButton';
import { CSETransition } from '../../shared/components/CSETransition';
import { getStringTableValue, StringIDGeneralOk } from '../helpers/stringTableHelpers';
import { StringTableEntryDef } from '../dataSources/manifest/stringTableManifest';

// Styles.
const Root = 'HUD-ModalPane-Root';
const ModalRoot = 'HUD-ModalPane-ModalRoot';
const Veil = 'HUD-ModalPane-Veil';
const Wrapper = 'HUD-ModalPane-Wrapper';
const DefaultModalContainer = 'HUD-ModalPane-DefaultModalContainer';
const ContentRoot = 'HUD-ModalPane-ContentRoot';
const MessageText = 'HUD-ModalPane-MessageText';
const ButtonsSection = 'HUD-ModalPane-ButtonsSection';
const Button = 'HUD-ModalPane-Button';

interface State {
  shownModals: ModalParams[];
  exitingModals: ModalParams[];
}

interface ReactProps {}

interface InjectedProps {
  modals: ModalParams[];
  stringTable: Record<string, StringTableEntryDef>;
  dispatch?: Dispatch;
}

type Props = ReactProps & InjectedProps;

class ModalPane extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = {
      shownModals: props.modals,
      exitingModals: []
    };
  }

  public render(): React.ReactNode {
    const shouldShow = this.props.modals.length + this.state.exitingModals.length > 0;

    // Weird quirk of React: it treats each .map() call as a separate hierarchy for DOM-replication purposes.
    // That means that if we want old modals to be reused, we have to combine these arrays and only use a
    // single .map() call, rather than mapping from each array sequentially.
    const modals = [...this.props.modals, ...this.state.exitingModals];

    return <div className={`${Root}${shouldShow ? ' show' : ''}`}>{modals.map(this.renderModal.bind(this))}</div>;
  }

  public static getDerivedStateFromProps(props: Props, state: State): State {
    if (props.modals !== state.shownModals) {
      // If the list of modals is shorter, we want to retain the exiting modals until they animate out.
      if (props.modals.length < state.shownModals.length) {
        const newExitingModals = state.shownModals.slice(props.modals.length);
        const exitingModals = [...newExitingModals, ...state.exitingModals];
        return { shownModals: props.modals, exitingModals };
      }

      return { shownModals: props.modals, exitingModals: state.exitingModals };
    }

    return state;
  }

  private buildWrapperStyle(params: ModalParams): React.CSSProperties {
    const style: React.CSSProperties = {};

    if (params?.maxWidth?.length > 0) {
      style.maxWidth = params?.maxWidth;
    }

    return style;
  }

  private renderModal(modal: ModalParams | null, index: number): React.ReactNode {
    if (!modal) {
      return null;
    }

    const closeSelf = (): void => {
      this.onEscape();
    };

    const globalIndex = index + (this.state.exitingModals.includes(modal) ? this.props.modals.length : 0);

    // Show the veil if it is the top modal that should be shown right now.
    // You are that top modal only if you are the top modal in the stack from props.
    const isTopVeil = globalIndex === this.props.modals.length - 1;
    // The modal itself should show only if props wants it.
    const isRetained = globalIndex < this.props.modals.length;

    return (
      <div className={ModalRoot} key={`ModalRoot${modal.id}`}>
        <CSETransition show={isTopVeil} key={`Veil${modal.id}`}>
          <div className={Veil}></div>
        </CSETransition>
        <div className={Wrapper} style={this.buildWrapperStyle(modal)} key={`Wrapper${modal.id}`}>
          {isRetained && modal.escapable && <Escapable escapeID={modal.id} onEscape={closeSelf.bind(this)} />}
          <CSETransition
            key={`Content${modal.id}`}
            show={isRetained}
            onExitComplete={() => {
              // Only an exiting modal will trigger this event.  Would love to fire them off individually,
              // but if multiple happen to finish exiting on the same frame, state won't update properly.
              // So instead we take the risk of some disappearing a fraction of a second early.
              this.state.exitingModals.forEach((params) => {
                params.onClose?.();
              });
              this.setState({ exitingModals: [] });
            }}
          >
            {this.renderModalContent(modal)}
          </CSETransition>
        </div>
      </div>
    );
  }

  private renderModalContent(modal: ModalParams): React.ReactNode {
    if (typeof modal.content === 'function') {
      return modal.content(modal);
    } else {
      const buttonModels = modal.content.buttons?.length > 0 ? modal.content.buttons : this.getDefaultButtonModels();
      return (
        <FactionBorder
          className={DefaultModalContainer}
          key={`modalPane-${modal.id}`}
          type={BorderType.Decorative}
          background={BorderBackground.PatternLarge}
          titleText={modal.content.title}
          cornerButtons={
            modal.hideCloseButton
              ? []
              : [
                  <FactionCornerButton
                    small
                    type={CornerButtonType.Close}
                    onClick={() => {
                      this.props.dispatch?.(hideModal());
                    }}
                  />
                ]
          }
        >
          <div className={ContentRoot}>
            {modal.content.message && <div className={MessageText}>{modal.content.message}</div>}
            {modal.content.body}
            <div className={ButtonsSection}>
              {buttonModels.map((model, index) => {
                return (
                  <FactionButton
                    className={Button}
                    key={`FooterButton${index}`}
                    disabled={model.isDisabled}
                    onClick={model.onClick}
                  >
                    {model.text}
                  </FactionButton>
                );
              })}
            </div>
          </div>
        </FactionBorder>
      );
    }
  }

  private onEscape(): void {
    this.props.dispatch(hideModal());
  }

  private getDefaultButtonModels(): ModalButtonModel[] {
    return [
      {
        text: getStringTableValue(StringIDGeneralOk, this.props.stringTable),
        onClick: () => this.props.dispatch?.(hideModal())
      }
    ];
  }
}

function mapStateToProps(state: RootState, ownProps: ReactProps): Props {
  const { modals } = state.modals;

  return {
    ...ownProps,
    modals,
    stringTable: state.stringTable.stringTable
  };
}

export default connect(mapStateToProps)(ModalPane);
