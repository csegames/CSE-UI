/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as React from 'react';
import { NavMenu, SettingsRoute } from './NavMenu';
import { Dispatch } from 'redux';
import { Button } from '../../shared/Button';
import { KeybindMenu } from './KeybindMenu';
import { CategoryMenu } from './CategoryMenu';
import { ResetDialog } from './ResetDialog';
import { GameOption, OptionCategory } from '@csegames/library/dist/_baseGame/types/Options';
import { game } from '@csegames/library/dist/_baseGame';
import { SoundEvents } from '@csegames/library/dist/hordetest/game/types/SoundEvents';
import { cloneDeep } from '@csegames/library/dist/_baseGame/utils/objectUtils';
import { TeamJoinAPI } from '@csegames/library/dist/hordetest/webAPI/definitions';
import { connect } from 'react-redux';
import { RootState } from '../../../redux/store';
import { updateDoNotDisturb } from '../../../redux/teamJoinSlice';
import { Dictionary } from '@csegames/library/dist/_baseGame/types/ObjectMap';
import { clearPendingOptionChanges, dequeueGameOptionChange } from '../../../redux/gameSettingsSlice';
import { hideOverlay, Overlay } from '../../../redux/navigationSlice';
import { webConf } from '../../../dataSources/networkConfiguration';
import { StringIDGeneralApply, StringIDGeneralBack, getStringTableValue } from '../../../helpers/stringTableHelpers';
import { StringTableEntryDef } from '@csegames/library/dist/hordetest/graphql/schema';

const Container = 'Settings-Container';
const MenuBG = 'Settings-MenuBG';
const MenuWrapper = 'Settings-MenuWrapper';
const DefaultButtonPosition = 'Settings-DefaultButtonPosition';
const ButtonPosition = 'Settings-ButtonPosition';
const ApplySpacing = 'Settings-ApplySpacing';

const StringIDSettingsResetToDefault = 'SettingsResetToDefault';

interface ReactProps {
  dispatch?: Dispatch;
}

interface InjectedProps {
  pendingSettingsChanges: Dictionary<GameOption>;
  stringTable: Dictionary<StringTableEntryDef>;
}

type Props = ReactProps & InjectedProps;

interface State {
  currentRoute: SettingsRoute;
  showReset: boolean;
}

class ASettings extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      showReset: false,
      currentRoute: SettingsRoute.Keybinds
    };
  }

  public render() {
    return (
      <div id={'SettingsContainer_FullScreen'} className={Container}>
        <NavMenu selectedRoute={this.state.currentRoute} onSelectRoute={this.setCurrentRoute.bind(this)} />
        <div className={MenuBG} />
        <div className={MenuWrapper}>{this.renderCurrentRoute()}</div>
        <div className={DefaultButtonPosition}>
          <Button
            type={'blue-outline'}
            text={getStringTableValue(StringIDGeneralBack, this.props.stringTable)}
            onClick={this.onBackClick.bind(this)}
          />
          {Object.keys(this.props.pendingSettingsChanges).length > 0 && (
            <Button
              type={'blue'}
              text={getStringTableValue(StringIDGeneralApply, this.props.stringTable)}
              styles={ApplySpacing}
              onClick={this.onApplyClick.bind(this)}
            />
          )}
        </div>
        <div className={ButtonPosition}>
          <Button
            type={'double-border'}
            text={getStringTableValue(StringIDSettingsResetToDefault, this.props.stringTable)}
            onClick={this.showResetDialog.bind(this)}
          />
        </div>
        {this.state.showReset && (
          <ResetDialog onYesClick={this.resetOptions} onNoClick={this.hideResetDialog.bind(this)} />
        )}
      </div>
    );
  }

  public componentDidMount() {}

  public componentWillUnmount() {
    this.props.dispatch(clearPendingOptionChanges());
  }

  private setCurrentRoute(route: SettingsRoute): void {
    this.setState({ currentRoute: route });
  }

  private renderCurrentRoute = () => {
    switch (this.state.currentRoute) {
      case SettingsRoute.Keybinds: {
        return <KeybindMenu />;
      }

      case SettingsRoute.Input: {
        return <CategoryMenu optionCategory={OptionCategory.Input} />;
      }

      case SettingsRoute.Audio: {
        return <CategoryMenu optionCategory={OptionCategory.Audio} />;
      }

      case SettingsRoute.Graphics: {
        return <CategoryMenu optionCategory={OptionCategory.Rendering} />;
      }

      case SettingsRoute.Miscellaneous: {
        return <CategoryMenu optionCategory={OptionCategory.UI} />;
      }

      default: {
        return null;
      }
    }
  };

  private resetOptions = () => {
    switch (this.state.currentRoute) {
      case SettingsRoute.Keybinds: {
        game.resetKeybinds();
        break;
      }

      case SettingsRoute.Input: {
        this.resetCategoryOptions(OptionCategory.Input);
        break;
      }

      case SettingsRoute.Audio: {
        this.resetCategoryOptions(OptionCategory.Audio);
        break;
      }

      case SettingsRoute.Graphics: {
        this.resetCategoryOptions(OptionCategory.Rendering);
        break;
      }

      case SettingsRoute.Miscellaneous: {
        this.resetCategoryOptions(OptionCategory.UI);
        break;
      }
    }

    game.trigger('settings-reset-to-default');
    this.setState({ showReset: false });
  };

  // reset each setting based on its default
  // don't use game.resetOptions because that sets the values but doesn't save them
  // since we've already asked the player to confirm this action, we should actually apply
  // the settings, not set the changes as pending.
  private resetCategoryOptions = (category: OptionCategory) => {
    var updates: GameOption[] = [];
    Object.values(game.options).forEach((option) => {
      if (option.category != category) {
        return;
      }

      let newOption = cloneDeep(option) as GameOption;
      newOption.value = newOption.defaultValue;
      updates.push(newOption);
      // If this option had a change pending, cancel it.
      this.props.dispatch(dequeueGameOptionChange(option));
    });

    if (updates.length) {
      game.setOptionsAsync(updates);
    }
  };

  private showResetDialog(): void {
    game.playGameSound(SoundEvents.PLAY_UI_MAIN_MENU_CONFIRM_WINDOW_POPUP);
    this.setState({ showReset: true });
  }

  private hideResetDialog(): void {
    this.setState({ showReset: false });
  }

  private async onApplyClick(): Promise<void> {
    game.playGameSound(SoundEvents.PLAY_UI_MAIN_MENU_CONFIRM_WINDOW_POPUP_YES);
    const dndOpt = this.props.pendingSettingsChanges['optDoNotDisturb'];
    if (dndOpt) {
      // We want the TeamJoin server to be authoritative on this flag, so we set it there as well.
      if (dndOpt.value) {
        await TeamJoinAPI.BlockOffersV1(webConf);
      } else {
        await TeamJoinAPI.AllowOffersV1(webConf);
      }
      this.props.dispatch(updateDoNotDisturb(dndOpt.value as boolean));
    }
    const result = await game.setOptionsAsync(Object.values(this.props.pendingSettingsChanges));
    if (!result.success) {
      console.warn('SetOptionsAsync failed to apply all requested changes.', result);
    }

    this.props.dispatch(clearPendingOptionChanges());
  }

  private onBackClick(): void {
    game.playGameSound(SoundEvents.PLAY_UI_MAIN_MENU_CONFIRM_WINDOW_POPUP_NO);
    this.props.dispatch(hideOverlay(Overlay.Settings));
  }
}

function mapStateToProps(state: RootState, ownProps: ReactProps): Props {
  const { pendingSettingsChanges } = state.gameSettings;
  const { stringTable } = state.stringTable;
  return {
    ...ownProps,
    pendingSettingsChanges,
    stringTable
  };
}

export const Settings = connect(mapStateToProps)(ASettings);
