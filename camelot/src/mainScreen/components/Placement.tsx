/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { game } from '@csegames/library/dist/_baseGame';
import { Dispatch } from '@reduxjs/toolkit';
import * as React from 'react';
import { connect } from 'react-redux';
import { HUDHorizontalAnchor, HUDLayer, HUDVerticalAnchor, HUDWidgetRegistration } from '../redux/hudSlice';
import { RootState } from '../redux/store';
import { Menu } from './menu/Menu';
import { FooterButtonData } from './menu/menuData';
import { ItemPlacementTransformMode } from '@csegames/library/dist/_baseGame/types/ItemPlacementTransformMode';

const Root = 'HUD-Placement-Root';
const Container = 'HUD-Placement-Container';
const Icon = 'HUD-Placement-Icon';
const IconActive = 'HUD-Placement-IconActive';
const IconVector = 'HUD-Placement-IconVector';

interface ReactProps {}

interface InjectedProps {
  dispatch?: Dispatch;
}

type Props = ReactProps & InjectedProps;

interface State {
  activeIconIndex: number;
}

class APlacement extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      activeIconIndex: 0
    };
  }

  render(): JSX.Element {
    const icons = [
      {
        path: (
          <path
            fill='#fff'
            d='M352.634 428.621l-74.007 74.007c-12.497 12.497-32.758 12.497-45.255 0l-74.007-74.007c-9.373-9.373-9.373-24.569 0-33.941l10.84-10.84c9.556-9.556 25.113-9.341 34.402.474L228 410.365V284H101.635l26.051 23.392c9.815 9.289 10.03 24.846.474 34.402l-10.84 10.84c-9.373 9.373-24.569 9.373-33.941 0L9.373 278.627c-12.497-12.497-12.497-32.758 0-45.255l74.007-74.007c9.373-9.373 24.569-9.373 33.941 0l10.84 10.84c9.556 9.556 9.341 25.114-.474 34.402L101.635 228H228V101.635l-23.392 26.051c-9.289 9.815-24.846 10.03-34.402.474l-10.84-10.84c-9.373-9.373-9.373-24.569 0-33.941l74.007-74.007c12.497-12.497 32.758-12.497 45.255 0l74.007 74.007c9.373 9.373 9.373 24.569 0 33.941l-10.84 10.84c-9.556 9.556-25.113 9.341-34.402-.474L284 101.635V228h126.365l-26.051-23.392c-9.815-9.289-10.03-24.846-.474-34.402l10.84-10.84c9.373-9.373 24.569-9.373 33.941 0l74.007 74.007c12.497 12.497 12.497 32.758 0 45.255l-74.007 74.007c-9.373 9.373-24.569 9.373-33.941 0l-10.84-10.84c-9.556-9.556-9.341-25.113.474-34.402L410.365 284H284v126.365l23.392-26.051c9.289-9.815 24.846-10.03 34.402-.474l10.84 10.84c9.373 9.372 9.373 24.568 0 33.941z'
          />
        ),
        text: 'Translate',
        onClick: this.enableTranslate.bind(this)
      },
      {
        path: (
          <path
            fill='#fff'
            d='M440.935 12.574l3.966 82.766C399.416 41.904 331.674 8 256 8 134.813 8 33.933 94.924 12.296 209.824 10.908 217.193 16.604 224 24.103 224h49.084c5.57 0 10.377-3.842 11.676-9.259C103.407 137.408 172.931 80 256 80c60.893 0 114.512 30.856 146.104 77.801l-101.53-4.865c-6.845-.328-12.574 5.133-12.574 11.986v47.411c0 6.627 5.373 12 12 12h200.333c6.627 0 12-5.373 12-12V12c0-6.627-5.373-12-12-12h-47.411c-6.853 0-12.315 5.729-11.987 12.574zM256 432c-60.895 0-114.517-30.858-146.109-77.805l101.868 4.871c6.845.327 12.573-5.134 12.573-11.986v-47.412c0-6.627-5.373-12-12-12H12c-6.627 0-12 5.373-12 12V500c0 6.627 5.373 12 12 12h47.385c6.863 0 12.328-5.745 11.985-12.599l-4.129-82.575C112.725 470.166 180.405 504 256 504c121.187 0 222.067-86.924 243.704-201.824 1.388-7.369-4.308-14.176-11.807-14.176h-49.084c-5.57 0-10.377 3.842-11.676 9.259C408.593 374.592 339.069 432 256 432z'
          />
        ),
        text: 'Rotate',
        onClick: this.enableRotate.bind(this)
      },
      {
        path: (
          <path
            fill='#fff'
            d='M212.333 224.333H12c-6.627 0-12-5.373-12-12V12C0 5.373 5.373 0 12 0h48c6.627 0 12 5.373 12 12v78.112C117.773 39.279 184.26 7.47 258.175 8.007c136.906.994 246.448 111.623 246.157 248.532C504.041 393.258 393.12 504 256.333 504c-64.089 0-122.496-24.313-166.51-64.215-5.099-4.622-5.334-12.554-.467-17.42l33.967-33.967c4.474-4.474 11.662-4.717 16.401-.525C170.76 415.336 211.58 432 256.333 432c97.268 0 176-78.716 176-176 0-97.267-78.716-176-176-176-58.496 0-110.28 28.476-142.274 72.333h98.274c6.627 0 12 5.373 12 12v48c0 6.627-5.373 12-12 12z'
          />
        ),
        text: 'Reset',
        onClick: this.reset.bind(this)
      }
    ];
    return (
      <div className={Root}>
        <Menu
          title='Placement'
          menuID={WIDGET_NAME_PLACEMENT}
          closeSelf={this.cancel.bind(this)}
          getFooterButtons={this.getFooterButtons.bind(this)}
          escapable
        >
          <div className={Container}>
            {icons.map((icon, iconIndex) => (
              <div
                className={iconIndex === this.state.activeIconIndex ? `${Icon} ${IconActive}` : Icon}
                onClick={icon.onClick.bind(this)}
                key={iconIndex}
              >
                <svg className={IconVector} xmlns='http://www.w3.org/2000/svg' viewBox='0 0 512 512'>
                  {icon.path}
                </svg>
                <span>{icon.text}</span>
              </div>
            ))}
          </div>
        </Menu>
      </div>
    );
  }

  cancel(): void {
    game.itemPlacementMode.requestCancel();
  }

  commit(): void {
    game.itemPlacementMode.requestCommit();
  }

  getFooterButtons(): FooterButtonData[] {
    return [
      {
        text: 'Commit',
        onClick: this.commit.bind(this)
      },
      {
        text: 'Cancel',
        onClick: this.cancel.bind(this)
      }
    ];
  }

  enableTranslate(): void {
    if (game.itemPlacementMode.activeTransformMode !== ItemPlacementTransformMode.Translate) {
      game.itemPlacementMode.requestChangeTransformMode(ItemPlacementTransformMode.Translate);
      this.setState({ activeIconIndex: 0 });
    }
  }

  enableRotate(): void {
    if (game.itemPlacementMode.activeTransformMode !== ItemPlacementTransformMode.Rotate) {
      game.itemPlacementMode.requestChangeTransformMode(ItemPlacementTransformMode.Rotate);
      this.setState({ activeIconIndex: 1 });
    }
  }

  reset(): void {
    game.itemPlacementMode.requestReset();
  }
}

const mapStateToProps = (state: RootState, ownProps: ReactProps): Props => {
  return {
    ...ownProps
  };
};

const Placement = connect(mapStateToProps)(APlacement);

export const WIDGET_NAME_PLACEMENT = 'Placement';
export const placementRegistry: HUDWidgetRegistration = {
  name: WIDGET_NAME_PLACEMENT,
  defaults: {
    xAnchor: HUDHorizontalAnchor.Center,
    yAnchor: HUDVerticalAnchor.Center,
    xOffset: 0,
    yOffset: 15
  },
  layer: HUDLayer.Menus,
  render: () => {
    return <Placement />;
  }
};
