/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as React from 'react';
import { clientAPI } from '../camelotunchained/ProtectedScreenClientAPI';
import { ListenerHandle } from '../_baseGame/listenerHandle';

interface PerfPage {
  id: number;
  shouldRemove?: boolean;
  name?: string;
  html?: string;
}

interface Props {}
interface State {
  pages: PerfPage[];
  minimized: boolean;
  currentPage: PerfPage;
  visible: boolean;
}

export class PerfHud extends React.Component<Props, State> {
  public name: string = 'perfhud';
  private handle?: ListenerHandle;

  constructor(props: Props) {
    super(props);
    this.state = {
      pages: [],
      minimized: true,
      currentPage: null,
      visible: false
    };
  }

  public componentDidMount() {
    this.handle = clientAPI.bindPerfHUDListener(this.updatePages.bind(this));
  }

  public componentWillUnmount(): void {
    this.handle?.close();
    this.handle = undefined;
  }

  private updatePages(json: string, visible: boolean) {
    const updates: PerfPage[] = json ? (JSON.parse(json) as PerfPage[]) : [];
    const pages = this.state.pages.filter((t: PerfPage) => !updates.find((p) => p.id == t.id)).concat(updates);

    this.setState({
      pages,
      currentPage: pages.find((p) => p.id === this.state.currentPage?.id) ?? pages[0],
      visible
    });
  }

  public render(): JSX.Element {
    if (!this.state.visible) {
      return null;
    }

    if (this.state.pages.length === 0) {
      return (
        <div id={this.name} className={`cu-window`}>
          <p>No pages provided to PerfHud</p>
        </div>
      );
    }

    return (
      <div className='cu-window' style={{ width: '65vmin', right: '0', position: 'fixed' }} data-input-group='block'>
        <div className='perfhud-select'>
          <span className='perfhud-minimize' onClick={this.toggleMinimized.bind(this)}>
            {this.state.minimized ? '<<' : '>>'}
          </span>
          {this.state.pages.map((page, index) => (
            <span
              key={index}
              className={`${page.id === this.state.currentPage.id ? 'selected' : ''} perfhud-select-item`}
              onClick={this.changePerfPage.bind(this, page)}
            >
              {page.name}
            </span>
          ))}
          <a className='cu-window-close' onMouseDown={clientAPI.setPerfHUDVisible.bind(clientAPI, false)} />
        </div>
        {!this.state.minimized && (
          <div className='perfhud-content' dangerouslySetInnerHTML={{ __html: this.state.currentPage.html }} />
        )}
      </div>
    );
  }

  private changePerfPage(currentPage: PerfPage) {
    this.setState({ minimized: false, currentPage });
  }

  private toggleMinimized() {
    this.setState({ minimized: !this.state.minimized });
  }
}
