/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 */

import * as React from 'react';

import { BaseGameInterface } from '@csegames/library/dist/_baseGame/BaseGameInterface';
import { CloseButton } from '../../shared/components/CloseButton';
import { DevUIPage } from './DevUIPage';
import { PageState } from '@csegames/library/dist/devUI/PageState';
import { RootPageModel } from '@csegames/library/dist/devUI/RootPageModel';
import { ListenerHandle } from '@csegames/library/dist/_baseGame/listenerHandle';
import { clientAPI } from '@csegames/library/dist/camelotunchained/ProtectedScreenClientAPI';

// Styles
const Root = 'DevUI-Root';
const Container = 'DevUI-Container';
const Scrollable = 'DevUI-Scrollable';
const CloseButtonPosition = 'DevUI-CloseButtonPosition';
const MaximizeButton = 'DevUI-MaximizeButton';

interface Props {
  game: BaseGameInterface;
}

export class DevUI extends React.PureComponent<Props, PageState> {
  private eventHandle: ListenerHandle;

  constructor(props: Props) {
    super(props);
    this.state = {};
  }

  public render() {
    if (!this.state) return null;
    const keys = Object.keys(this.state);
    return (
      <div className={Root} id='DevUI'>
        {keys.map((k) => {
          const page = this.state[k];
          return (
            <div
              className={Container}
              id={'DevUI' + k}
              style={page.maximized ? this.getMaximizedStyle(page) : this.getStyle(page)}
            >
              <div key={k} className={Scrollable}>
                <DevUIPage game={this.props.game} page={page} />
              </div>
              <div className='relative'>
                {page.showCloseButton ? (
                  <CloseButton className={CloseButtonPosition} onClick={this.setVisible.bind(this, k, false)} />
                ) : null}
                {page.showMaximizeButton ? this.renderMaximizeButton(k, page) : null}
              </div>
            </div>
          );
        })}
      </div>
    );
  }

  public componentDidMount() {
    this.eventHandle = clientAPI.bindDevUIListener(this.handleUpdateDevUI.bind(this));
  }

  public componentWillUnmount(): void {
    this.eventHandle.close();
  }

  public componentDidCatch(error: any, info: any): void {
    console.error(error, info);
  }

  private renderMaximizeButton(id: string, page: RootPageModel): JSX.Element {
    return (
      <a
        className={MaximizeButton}
        href={'#'}
        onClick={() =>
          this.setState({
            [id]: {
              ...page,
              maximized: !page.maximized
            }
          })
        }
      >
        {page.maximized ? 'Minimize' : 'Maximize'}
      </a>
    );
  }

  private getMaximizedStyle(page: RootPageModel): React.CSSProperties {
    return {
      width: '100%',
      height: '100%',
      top: 0,
      right: 0,
      left: 0,
      bottom: 0,
      visibility: page.visible ? 'visible' : 'hidden',
      background: page.background ?? '#111'
    };
  }

  private getStyle(page: RootPageModel): React.CSSProperties {
    return {
      width: `${page.width}px`,
      height: `${page.height}px`,
      top: page.y,
      left: page.x,
      visibility: page.visible ? 'visible' : 'hidden',
      background: page.background ?? '#111'
    };
  }

  private handleUpdateDevUI(id: string, rootPage: any): void {
    const page = typeof rootPage === 'string' ? JSON.parse(rootPage) : rootPage;
    this.setState({ [id]: page });
  }

  private setVisible(id: string, visible: boolean): void {
    const page = this.state[id];
    if (page) {
      this.setState({ [id]: { ...page, visible } });
    }
  }
}
