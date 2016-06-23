/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import {client, events} from 'camelot-unchained';
import * as React from 'react';

export interface PerfPage {
  id: number;
  shouldRemove?: boolean;
  name?: string;
  html?: string;
}

export interface PerfHudProps {};
export interface PerfHudState {
  pages: Array<PerfPage>;
  minimized: boolean;
  currentPage: PerfPage;
};

declare const cuAPI: any;

class PerfHud extends React.Component<PerfHudProps, PerfHudState> {
  public name: string = 'perfhud';

  constructor(props: PerfHudProps) {
    super(props);
    this.state = {
      pages: [],
      minimized: true,
      currentPage: null
    };
  }

  closeWindow(): void {
    client.HideUI('perfhud');
  }

  componentDidMount() {
    cuAPI.OnPerfUpdate(() => {
      this.updatePages();
    });
  }
  
  minMaxWindow = () => {
    console.log('minmax');
    this.setState({
      pages: this.state.pages,
      minimized: !this.state.minimized,
      currentPage: null
    });
  }

  updatePages = () => {
    let updates = JSON.parse(client.perfHUD);
    let pages = this.state.pages.filter((t: PerfPage) => updates.filter((ut: PerfPage) => ut.id == t.id) == []).concat(updates) as Array<PerfPage>;

    // is our current still here?
    let current: any = null;
    if (this.state.currentPage == null) {
      current = pages[0];
    } else {
      current = pages.filter((p: PerfPage) => p.id == this.state.currentPage.id)[0];
      if (typeof current == 'undefined') {
        current = pages[0];
    }
  }

  this.setState({
      pages: pages,
      minimized: this.state.minimized,
      currentPage: current
    });
  }
  
  onSelectedPageChanged = (page: PerfPage) => {
    this.setState({
      pages: this.state.pages,
      minimized: this.state.minimized,
      currentPage: page
    });
  }
  
  changePage = (id:number) => {
    let current = this.state.pages[id];
    this.changePerfPage(current);
  }

  changePerfPage = (page:PerfPage) => {
    this.setState({
      pages: this.state.pages,
      minimized: false,
      currentPage: page
    });
  }

  setMinimized = ( mini: boolean ) => {
    this.setState({
      pages: this.state.pages,
      minimized: mini,
      currentPage: this.state.currentPage
    });
  }

  createPerfSelect = (page:PerfPage, index:any) => {
    let currentPage:PerfPage = this.state.currentPage;
    return (
      <span key={index}
        className={`${(page.id==currentPage.id)?'selected':''} perfhud-select-item`}
        onClick={this.changePage.bind(this, page.id)} >{page.name}
      </span>
    );
  }

  createPerfMinimize = (min: boolean) => {
    if(min)
      return ( <span className='perfhud-minimize' onClick={this.setMinimized.bind(this, false)}> &lt;&lt; </span> );
    else
      return ( <span className='perfhud-minimize' onClick={this.setMinimized.bind(this, true)}> &gt;&gt; </span> );
  }

  createPerfContent = (min: boolean) => {
    if(min)
      return (<span/>);
    else
      return (<div className='perfhud-content' dangerouslySetInnerHTML={{__html: this.state.currentPage.html}} />);
  }

  createPerfClose = () => {
    return (<a onMouseDown={this.closeWindow.bind(this)} className="cu-window-close"></a>);
  }

  render() {
    
    if (this.state.pages.length == 0) {
      return (
        <div id={this.name} className={`${this.name} cu-window`}>
          <p>No pages provided to PerfHud</p>
        </div>
      );
    }

    let mini = this.state.minimized;
    return (
      <div className={`${this.name} cu-window`}>
        <div className='perfhud-select'>
          { this.createPerfMinimize(mini) }
          { this.state.pages.map( (page, index) => this.createPerfSelect(page, index)) }
          { this.createPerfClose() }
        </div>
        { this.createPerfContent(mini) }
      </div>
    );
  }
}

export default PerfHud;
