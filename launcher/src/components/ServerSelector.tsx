/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as React from 'react';

import { RootState } from '../redux/store';
import { connect, DispatchProp } from 'react-redux';
import { BasicBorder } from './BasicBorder';
import { CSETransition } from './CSETransition';
import { playSound, Sound } from '../lib/Sound';
import { Launchable } from '../redux/launchablesSlice';
import { Product, updateSelection } from '../redux/navigationSlice';
import { ChannelStatus } from '../api/patcher/channelStatus';

const Root = 'ServerSelector-Root';
const ButtonRow = 'ServerSelector-ButtonRow';
const ButtonLabel = 'ServerSelector-ButtonLabel';
const ServerListRoot = 'ServerSelector-ServerList-Root';
const ServerRow = 'ServerSelector-ServerList-ServerRow';
const StatusColumn = 'ServerSelector-ServerList-StatusColumn';
const NameInfoColumn = 'ServerSelector-ServerList-NameInfoColumn';
const PopulationColumn = 'ServerSelector-ServerList-PopulationColumn';
// const RealmColumn = 'ServerSelector-ServerList-RealmColumn';
// const CharactersColumn = 'ServerSelector-ServerList-CharactersColumn';
const LegendRow = 'ServerSelector-ServerList-LegendRow';
const LegendSeparator = 'ServerSelector-ServerList-LegendSeparator';
const LegendLabel = 'ServerSelector-ServerList-LegendLabel';
const ListScroller = 'ServerSelector-ServerList-ListScroller';
const StatusIcon = 'ServerSelector-ServerList-StatusIcon';
const NameLabel = 'ServerSelector-ServerList-NameLabel';
const InfoLabel = 'ServerSelector-ServerList-InfoLabel';
const DataLabel = 'ServerSelector-ServerList-DataLabel';
const GearColumn = 'ServerSelector-ServerList-GearColumn';
const GearIcon = 'ServerSelector-ServerList-GearIcon';
const GearTooltip = 'ServerSelector-ServerList-GearTooltip';
const GearTooltipOption = 'ServerSelector-ServerList-GearTooltipOption';

interface ReactProps {}

interface InjectedProps {
  currentProduct: Product;
  launchables: Record<string, Launchable>;
  selections: Record<Product, string | null>;
  lastPlayed: Record<Product, string | null>;
}

type Props = ReactProps & InjectedProps;

interface State {
  isOpen: boolean;
  gearOpenIndex: number | null;
}

class AServerSelector extends React.Component<Props & DispatchProp, State> {
  private rootRef = React.createRef<HTMLDivElement>();

  constructor(props: Props & DispatchProp) {
    super(props);
    this.state = {
      isOpen: false,
      gearOpenIndex: null
    };
    this.handleClickOutside = this.handleClickOutside.bind(this);
  }

  public componentDidMount() {
    document.addEventListener('mousedown', this.handleClickOutside);
  }

  public componentWillUnmount() {
    document.removeEventListener('mousedown', this.handleClickOutside);
  }

  private handleClickOutside(event: MouseEvent): void {
    if (this.state.isOpen && this.rootRef.current && !this.rootRef.current.contains(event.target as Node)) {
      this.setState({ isOpen: false });
    }
  }

  public render() {
    const { launchables, currentProduct, selections } = this.props;
    const selected = launchables[selections[currentProduct] ?? ''];
    const listing = this.getServersToDisplay();

    const fallbackText = listing ? 'Select Server' : 'No Servers Available';

    return (
      <div className={Root} ref={this.rootRef}>
        <div className={ButtonRow} onClick={this.toggleServerList.bind(this)}>
          <div className={ButtonLabel}>{selected?.name ?? fallbackText}</div>
          <div className={`ServerSelector-ExpandIcon${this.state.isOpen ? ' open' : ''}`}>+</div>
        </div>
        <CSETransition show={this.state.isOpen} removeWhenHidden>
          {this.renderServerList(listing)}
        </CSETransition>
      </div>
    );
  }

  private renderServerList(listing: Launchable[]): React.ReactNode {
    return (
      <BasicBorder className={ServerListRoot}>
        <div className={LegendRow}>
          <div className={StatusColumn} />
          <div className={NameInfoColumn}>
            <div className={`${LegendLabel} left`}>{'Server'}</div>
          </div>
          <div className={PopulationColumn}>
            <div className={LegendLabel}>{'Population'}</div>
          </div>
          {/* <div className={RealmColumn}>
            <div className={LegendLabel}>{'Realm'}</div>
          </div>
          <div className={CharactersColumn}>
            <div className={LegendLabel}>{'Characters'}</div>
          </div> */}
          <div className={GearColumn} />
        </div>
        <div className={LegendSeparator} />
        <div className={ListScroller}>{listing.map((l, index) => this.renderServerRow(l, index))}</div>
      </BasicBorder>
    );
  }

  private renderServerRow(launchable: Launchable, index: number): React.ReactNode {
    const isAvailable = launchable.isAvailable;
    const selectionClass = launchable.selectionKey === this.props.selections[launchable.product] ? ' selected' : '';
    const isInstalled = launchable.channelStatus !== ChannelStatus.None;

    return (
      <div key={index} className={ServerRow} onClick={this.onServerSelected.bind(this, launchable)}>
        <div className={StatusColumn}>
          <div className={`${StatusIcon}${isAvailable ? ' available' : ''}`} />
        </div>
        <div className={NameInfoColumn}>
          <div className={`${NameLabel}${selectionClass}`}>{launchable.name}</div>
          <div className={`${InfoLabel}${selectionClass}`}>{`Accessible to ${launchable.accessRequirement}`}</div>
        </div>
        <div className={PopulationColumn}>
          <div className={`${DataLabel}${selectionClass}`}>{'Low'}</div>
        </div>
        <div className={GearColumn}>
          <div
            className={GearIcon}
            onClick={(e) => {
              e.stopPropagation();
              this.setState({ gearOpenIndex: this.state.gearOpenIndex === index ? null : index });
            }}
          />
          {this.state.gearOpenIndex === index && (
            <div className={GearTooltip} onMouseLeave={() => this.setState({ gearOpenIndex: null })}>
              {isInstalled ? (
                <div
                  className={GearTooltipOption}
                  onClick={(e) => {
                    e.stopPropagation();
                    window.patcher.uninstallChannel(launchable.channelID);
                    this.setState({ gearOpenIndex: null });
                  }}
                >
                  Uninstall
                </div>
              ) : (
                <div
                  className={GearTooltipOption}
                  onClick={(e) => {
                    e.stopPropagation();
                    window.patcher.installChannel(launchable.channelID);
                    this.setState({ gearOpenIndex: null });
                  }}
                >
                  Install
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    );
  }

  private onServerSelected(launchable: Launchable): void {
    this.props.dispatch(updateSelection({ product: launchable.product, key: launchable.selectionKey }));
    this.setState({ isOpen: false });
    playSound(Sound.Select);
  }

  private getServersToDisplay(): Launchable[] {
    const { currentProduct, selections, lastPlayed, launchables } = this.props;
    const selected = selections[currentProduct];
    const played = lastPlayed[currentProduct];
    return Object.values(launchables)
      .filter((l) => l.product === currentProduct)
      .sort((a, b) => {
        const delta = this.getScore(a, selected, played) - this.getScore(b, selected, played);
        return delta ? delta : a.name.localeCompare(b.name);
      });
  }

  // Favor current selection, then last played, then available, then online, then # of characters.
  private getScore(launchable: Launchable, selectedKey: string | null, lastPlayedKey: string | null) {
    let score = 0;
    if (launchable.selectionKey === selectedKey) score += 16;
    if (launchable.selectionKey == lastPlayedKey) score += 8;
    if (launchable.isAvailable) score += 4;
    if (launchable.isOnline) score += 2;
    if (launchable.channelStatus != ChannelStatus.None) score += 1;
    return -score; // return as negative because low sorts first
  }

  private toggleServerList(): void {
    this.setState({ isOpen: !this.state.isOpen });
    playSound(Sound.SelectChange);
  }
}

const mapStateToProps = (state: RootState, ownProps: ReactProps): Props => {
  const { product: currentProduct, selections, lastPlayed } = state.navigation;
  return {
    ...ownProps,
    currentProduct,
    lastPlayed,
    selections,
    launchables: state.launchables
  };
};

export const ServerSelector = connect(mapStateToProps)(AServerSelector);
