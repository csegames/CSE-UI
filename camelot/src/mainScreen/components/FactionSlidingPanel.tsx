/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as React from 'react';
import { connect } from 'react-redux';
import { AppDispatch, RootState } from '../redux/store';
import { FactionBorder, BorderType, BorderBackground } from './FactionBorder';
import { getFactionData } from '../gameData/factionData';

const Root = 'HUD-FactionSlidingPanel-Root';
const Slider = 'HUD-FactionSlidingPanel-Slider';
const Content = 'HUD-FactionSlidingPanel-Content';
const ToggleContainer = 'HUD-FactionSlidingPanel-ToggleContainer';
const ToggleCard = 'HUD-FactionSlidingPanel-ToggleCard';
const ToggleText = 'HUD-FactionSlidingPanel-ToggleText';
const ToggleArrow = 'HUD-FactionSlidingPanel-ToggleArrow';

interface ReactProps extends React.HTMLAttributes<HTMLDivElement> {
  titleText: string;
  isOpen: boolean;
  isBadged: boolean;
  onToggleClicked: () => void;
  factionIDOverride?: string;
  panelBackground?: BorderBackground;
}

interface InjectedProps {
  uiFactionID: string;
  dispatch?: AppDispatch;
}

type Props = ReactProps & InjectedProps;

class AFactionSlidingPanel extends React.Component<Props> {
  render(): JSX.Element {
    const {
      uiFactionID,
      factionIDOverride,
      titleText,
      className,
      isOpen,
      isBadged,
      onToggleClicked,
      children,
      panelBackground,
      ...otherProps
    } = this.props;

    const factionData = getFactionData(uiFactionID);

    return (
      <div {...otherProps} className={`${Root} ${className}`}>
        <div className={`${Slider}${isOpen ? ' open' : ''}`}>
          <FactionBorder
            className={Content}
            type={BorderType.Primary}
            background={panelBackground ?? BorderBackground.PatternLarge}
            includeLeft={false}
          >
            {children}
          </FactionBorder>
          <div className={ToggleContainer} onClick={onToggleClicked}>
            <FactionBorder
              className={ToggleCard}
              type={isBadged ? BorderType.Selected : BorderType.Primary}
              background={BorderBackground.PatternSmall}
              includeLeft={false}
            >
              <div className={ToggleText}>{titleText}</div>
            </FactionBorder>
            <img className={ToggleArrow} src={factionData.hudnavEndImage} />
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state: RootState, ownProps: ReactProps): Props => {
  return {
    ...ownProps,
    uiFactionID: ownProps.factionIDOverride ?? state.hud.uiFactionID
  };
};

export const FactionSlidingPanel = connect(mapStateToProps)(AFactionSlidingPanel);
