/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as React from 'react';
import { game } from '@csegames/library/dist/_baseGame';
import { SoundEvents } from '@csegames/library/dist/hordetest/game/types/SoundEvents';
import { StarBadge } from '../../../shared/components/StarBadge';
import { StringTableEntryDef } from '@csegames/library/dist/hordetest/graphql/schema';
import { Dictionary } from '@reduxjs/toolkit';
import { connect } from 'react-redux';
import { RootState } from '../../redux/store';
import { StringIDGeneralUnderMaintenace, getStringTableValue } from '../../helpers/stringTableHelpers';

const Container = 'Button-Container';

const LoadingAnim = 'Button-LoadingAnim';
const AlertStar = 'Button-AlertStar';

const UnderMaintenanceContainer = 'Button-UnderMaintenaceContainer';
const UnderMaintenance = 'Button-UnderMaintenaceMessage';
const UnderMaintenanceNails = 'Button-UnderMaintenaceNails';

export type ButtonType = 'primary' | 'secondary' | 'blue' | 'blue-outline' | 'double-border';

export interface ReactProps {
  type: ButtonType;
  text: React.ReactNode;
  onClick?: (e?: React.MouseEvent<HTMLButtonElement>) => void;
  styles?: string;
  disabled?: boolean;
  isLoading?: boolean;
  underMaintenance?: boolean;
  alertStar?: boolean;
  alertStarStyle?: string;
}

interface InjectedProps {
  stringTable: Dictionary<StringTableEntryDef>;
}

type Props = ReactProps & InjectedProps;

export class AButton extends React.Component<Props> {
  constructor(props: Props) {
    super(props);
  }

  public render() {
    const alertStarClass = this.props.alertStarStyle ? this.props.alertStarStyle : AlertStar;

    return (
      <button
        disabled={this.props.disabled || this.props.isLoading}
        onClick={this.onClick.bind(this)}
        onMouseEnter={this.onMouseEnter}
        className={`${this.props.type} ${this.props.styles || ''} ${
          this.props.disabled ? 'disabled' : ''
        } ${Container}`}
      >
        {this.props.isLoading ? (
          <img className={LoadingAnim} src='images/fullscreen/loadingscreen/loading-anim.gif' />
        ) : (
          this.props.text
        )}
        {this.props.alertStar && <StarBadge className={alertStarClass} />}
        {this.props.underMaintenance && this.getUnderMaintenace()}
        {this.props.children}
      </button>
    );
  }

  private onClick(e: React.MouseEvent<HTMLButtonElement>) {
    if (this.props.onClick) {
      e.persist();
      this.props.onClick(e);
    }
  }

  private onMouseEnter = () => {
    game.playGameSound(SoundEvents.PLAY_UI_MAIN_MENU_HOVER);
  };

  private getUnderMaintenace(): JSX.Element {
    return (
      <div className={UnderMaintenanceContainer}>
        <span className={UnderMaintenanceNails}>•</span>
        <span className={UnderMaintenance}>
          {getStringTableValue(StringIDGeneralUnderMaintenace, this.props.stringTable)}
        </span>
        <span className={UnderMaintenanceNails}>•</span>
      </div>
    );
  }
}

function mapStateToProps(state: RootState, ownProps: ReactProps): Props {
  const { stringTable } = state.stringTable;

  return {
    ...ownProps,
    stringTable
  };
}

export const Button = connect(mapStateToProps)(AButton);
