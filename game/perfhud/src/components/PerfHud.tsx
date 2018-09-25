/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { client } from '@csegames/camelot-unchained';
import * as React from 'react';

export interface PerfPage {
  id: number;
  shouldRemove?: boolean;
  name?: string;
  html?: string;
}

export interface PerfHudProps {}
export interface PerfHudState {
  pages: PerfPage[];
  minimized: boolean;
  currentPage: PerfPage;
}

declare const cuAPI: any;

class PerfHud extends React.Component<PerfHudProps, PerfHudState> {
  public name: string = 'perfhud';

  constructor(props: PerfHudProps) {
    super(props);
    this.state = {
      pages: [],
      minimized: true,
      currentPage: null,
    };
  }

  public closeWindow(): void {
    client.HideUI('perfhud');
  }

  public componentDidMount() {
    cuAPI.OnPerfUpdate(() => {
      this.updatePages();
    });
  }

  public minMaxWindow = () => {
    console.log('minmax');
    this.setState({
      pages: this.state.pages,
      minimized: !this.state.minimized,
      currentPage: null,
    });
  }

  public updatePages = () => {
    const updates = JSON.parse(client.perfHUD);
    const pages = this.state.pages
      // tslint:disable-next-line
      .filter((t: PerfPage) => updates.filter((ut: PerfPage) => ut.id === t.id) == [])
      .concat(updates) as PerfPage[];

    // is our current still here?
    let current: any = null;
    if (this.state.currentPage == null) {
      current = pages[0];
    } else {
      current = pages.filter((p: PerfPage) => p.id === this.state.currentPage.id)[0];
      if (typeof current === 'undefined') {
        current = pages[0];
      }
    }

    this.setState({
      pages,
      minimized: this.state.minimized,
      currentPage: current,
    });
  }

  public onSelectedPageChanged = (page: PerfPage) => {
    this.setState({
      pages: this.state.pages,
      minimized: this.state.minimized,
      currentPage: page,
    });
  }

  public changePage = (id: number) => {
    const current = this.state.pages[id];
    this.changePerfPage(current);
  }

  public changePerfPage = (page: PerfPage) => {
    this.setState({
      pages: this.state.pages,
      minimized: false,
      currentPage: page,
    });
  }

  public setMinimized = (mini: boolean) => {
    this.setState({
      pages: this.state.pages,
      minimized: mini,
      currentPage: this.state.currentPage,
    });
  }

  public createPerfSelect = (page: PerfPage, index: any) => {
    const currentPage: PerfPage = this.state.currentPage;
    return (
      <span key={index}
        className={`${(page.id === currentPage.id) ? 'selected' : ''} perfhud-select-item`}
        onClick={this.changePage.bind(this, page.id)} >{page.name}
      </span>
    );
  }

  public createPerfMinimize = (min: boolean) => {
    if (min) {
      return (<span className='perfhud-minimize' onClick={this.setMinimized.bind(this, false)}> &lt;&lt; </span>);
    } else {
      return (<span className='perfhud-minimize' onClick={this.setMinimized.bind(this, true)}> &gt;&gt; </span>);
    }
  }

  public createPerfContent = (min: boolean) => {
    if (min) {
      return (<span/>);
    } else {
      return (<div className='perfhud-content' dangerouslySetInnerHTML={{ __html: this.state.currentPage.html }} />);
    }
  }

  public createPerfClose = () => {
    return (<a onMouseDown={this.closeWindow.bind(this)} className='cu-window-close'></a>);
  }

  public render() {

    if (this.state.pages.length === 0) {
      return (
        <div id={this.name} className={`${this.name} cu-window`}>
          <p>No pages provided to PerfHud</p>
        </div>
      );
    }

    const mini = this.state.minimized;
    return (
      <div className={`${this.name} cu-window`}>
        <div className='perfhud-select'>
          { this.createPerfMinimize(mini) }
          { this.state.pages.map((page, index) => this.createPerfSelect(page, index)) }
          { this.createPerfClose() }
        </div>
        { this.createPerfContent(mini) }
      </div>
    );
  }
}

export default PerfHud;
