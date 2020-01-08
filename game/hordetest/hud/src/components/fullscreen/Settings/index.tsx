/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import React from 'react';
import { css } from '@csegames/linaria';
import { styled } from '@csegames/linaria/react';
import { NavMenu, SettingsRoute } from './NavMenu';
import { ActionButton } from '../ActionButton';
import { KeybindMenu } from './KeybindMenu';
import { CategoryMenu } from './CategoryMenu';
import { ResetDialog } from './ResetDialog';

const Container = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
  background-image: url(../images/fullscreen/settings/settings-bg.jpg);
  background-size: cover;
  display: flex;
  flex-direction: column;
  align-items: center;
  pointer-events: all;
  z-index: -1;

  &:before {
    content: '';
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    background-color: rgba(0, 0, 0, 0.6);
    pointer-events: none;
    z-index: -1;
  }
`;

const MenuBG = styled.div`
  position: absolute;
  width: 45%;
  height: 80%;
  padding: 0 5px;
  left: 50%;
  top: 100px;
  transform: translateX(-50%);
  background: linear-gradient(to bottom, rgba(0, 0, 0, 1), rgba(39, 39, 39, 0.35));
`;

const MenuWrapper = styled.div`
  position: relative;
  width: 45%;
  height: 80%;
  overflow-y: auto;

  &::-webkit-scrollbar {
    width: 6px;
    height: 6px;
  }

  &::-webkit-scrollbar-track {
    box-shadow: none;
    background: none;
  }

  &::-webkit-scrollbar-thumb {
    background-color: #4f4f4f;
  }
`;

const Menu = styled.div`
  width: 100%;
  height: 100%;
`;

const DefaultButtonPosition = styled.div`
  position: absolute;
  left: 40px;
  bottom: 40px;
`;

const ButtonPosition = styled.div`
  display: flex;
  position: absolute;
  right: 40px;
  bottom: 40px;
`;

const ApplySpacing = css`
  margin-right: 50px;
`;

const DialogContainer = styled.div`
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  display: flex;
  justify-content: center;
  cursor: default;
  background-color: rgba(0, 0, 0, 0.4);
  z-index: 1;
`;

export interface Props {
}

export interface State {
  isVisible: boolean;
  currentRoute: SettingsRoute;
  changes: { [name: string]: GameOption };
  isResetDialogVisible: boolean;
}

export class Settings extends React.Component<Props, State> {
  private evh: EventHandle;
  constructor(props: Props) {
    super(props);
    this.state = {
      isVisible: false,
      currentRoute: SettingsRoute.Keybinds,
      changes: {},
      isResetDialogVisible: false,
    };
  }

  public render() {
    return this.state.isVisible ? (
      <Container>
        <NavMenu selectedRoute={this.state.currentRoute} onSelectRoute={this.setCurrentRoute} />
        <MenuBG />
        <MenuWrapper>
          <Menu>
            {this.renderCurrentRoute()}
          </Menu>
        </MenuWrapper>
        <DefaultButtonPosition>
          <ActionButton onClick={this.showResetDialog}>Reset to Default</ActionButton>
        </DefaultButtonPosition>
        <ButtonPosition>
          {Object.keys(this.state.changes).length > 0 &&
            <ActionButton onClick={this.onApplyClick} className={ApplySpacing}>Apply</ActionButton>
          }
          <ActionButton onClick={this.hide}>Back</ActionButton>
        </ButtonPosition>

        {this.state.isResetDialogVisible &&
          <DialogContainer>
            <ResetDialog onYesClick={this.resetOptions} onNoClick={this.hideResetDialog} />
          </DialogContainer>
        }
      </Container>
    ) : null;
  }

  public componentDidMount() {
    this.evh = game.on('navigate', this.handleNavigate);
  }

  public componentWillUnmount() {
    this.evh.clear();
  }

  private show = () => {
    this.setState({ isVisible: true });
  }

  private hide = () => {
    this.setState({ isVisible: false });
  }

  private setCurrentRoute = (route: SettingsRoute) => {
    this.setState({ currentRoute: route });
  }

  private handleNavigate = (name: string) => {
    if (name === 'settings') {
      if (this.state.isVisible) {
        this.hide();
      } else {
        this.show();
      }
    }

    if (name === 'gamemenu' && this.state.isVisible) {
      this.hide();
    }
  }

  private renderCurrentRoute = () => {
    switch (this.state.currentRoute) {
      case SettingsRoute.Keybinds: {
        return <KeybindMenu />
      };

      case SettingsRoute.Input: {
        return <CategoryMenu optionCategory={OptionCategory.Input} onOptionChange={this.onOptionChange} />;
      }

      case SettingsRoute.Audio: {
        return <CategoryMenu optionCategory={OptionCategory.Audio} onOptionChange={this.onOptionChange} />;
      }

      case SettingsRoute.Graphics: {
        return <CategoryMenu optionCategory={OptionCategory.Rendering} onOptionChange={this.onOptionChange} />;
      }

      case SettingsRoute.Miscellaneous: {
        return <CategoryMenu optionCategory={OptionCategory.UI} onOptionChange={this.onOptionChange} />;
      }

      default: {
        return null;
      }
    }
  }

  private resetOptions = () => {
    switch (this.state.currentRoute) {
      case SettingsRoute.Keybinds: {
        game.resetKeybinds();
        break;
      };

      case SettingsRoute.Input: {
        game.resetOptions(OptionCategory.Input);
        break;
      }

      case SettingsRoute.Audio: {
        game.resetOptions(OptionCategory.Audio);
        break;
      }

      case SettingsRoute.Graphics: {
        game.resetOptions(OptionCategory.Rendering);
        break;
      };
    }

    game.trigger('settings-reset-to-default');
    this.setState({ changes: {}, isResetDialogVisible: false });
  }

  private showResetDialog = () => {
    this.setState({ isResetDialogVisible: true });
  }

  private hideResetDialog = () => {
    this.setState({ isResetDialogVisible: false });
  }

  private onOptionChange = (option: GameOption) => {
    this.setState({ changes: { ...this.state.changes, [option.name]: option } });
  }

  private onApplyClick = () => {
    const values = Object.values(this.state.changes);
    if (values.length > 0) {
      game.setOptionsAsync(Object.values(this.state.changes));
      this.setState({ changes: {} });
    }
  }
}
