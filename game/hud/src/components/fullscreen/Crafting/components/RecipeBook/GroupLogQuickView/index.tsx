/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 */

import * as React from 'react';
import { isEqual } from 'lodash';
import { styled } from '@csegames/linaria/react';

import { GroupLogData } from '../index';
import QuickViewItem from './QuickViewItem';
import PageSelector from '../PageSelector';
import ConceptArt from '../ConceptArt';
import { CraftingContext } from '../../../CraftingContext';
import { MediaBreakpoints } from 'fullscreen/Crafting/lib/MediaBreakpoints';
import { CraftingResolutionContext } from '../../../CraftingResolutionContext';

const Container = styled.div`
  width: 100%;
  height: 100%;
`;

const ItemSpacing = styled.div`
  margin-top: 10px;
`;

const PageSelectorPosition = styled.div`
  position: absolute;
  right: 10px;
  top: 0;
  padding: 5px;

  &.showingBackButton {
    right: 80px;
  }

  @media (min-width: ${MediaBreakpoints.MidWidth}px) and (min-height: ${MediaBreakpoints.MidHeight}px) {
    top: 2px;
    &.showingBackButton {
      right: 104px;
    }
  }

  @media (min-width: ${MediaBreakpoints.UHDWidth}px) and (min-height: ${MediaBreakpoints.UHDHeight}px) {
    top: 15px;
    &.showingBackButton {
      right: 140px;
    }
  }
`;

const NoLogsText = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  font-family: TradeWinds;
  font-size: 16px;
  pointer-events: none;

  @media (min-width: ${MediaBreakpoints.MidWidth}px) and (min-height: ${MediaBreakpoints.MidHeight}px) {
    font-size: 21px;
  }

  @media (min-width: ${MediaBreakpoints.UHDWidth}px) and (min-height: ${MediaBreakpoints.UHDHeight}px) {
    font-size: 32px;
  }
`;

export interface InjectedProps {
  loading: boolean;
  isUHD: boolean;
  isMidScreen: boolean;
}

export interface ComponentProps {
  groupLogs: GroupLogData[];
  currentPage: number;
  searchValue: string;
  onChangeCurrentPage: (page: number) => void;
  onSelectGroupLog: (groupLog: GroupLogData) => void;
  showingBackButton?: boolean;
}

export type Props = InjectedProps & ComponentProps;

export interface State {
  itemsPerPage: number;
}

class QuickView extends React.Component<Props, State> {
  private ref: HTMLDivElement;
  constructor(props: Props) {
    super(props);
    this.state = {
      itemsPerPage: 6,
    };
  }
  public render() {
    const { groupLogs, numberOfPages } = this.getCurrentGroupLogsPage();
    return (
      <Container ref={(r: HTMLDivElement) => this.ref = r}>
        <PageSelectorPosition className={this.props.showingBackButton ? 'showingBackButton' : ''}>
          <PageSelector
            currentPage={this.props.currentPage}
            numberOfPages={numberOfPages}
            onChangeCurrentPage={this.props.onChangeCurrentPage}
          />
        </PageSelectorPosition>
        {/* <ConceptArt key={this.props.currentPage} disabled={!this.hasGroupLogs() || this.props.searchValue !== ''}> */}
        <ConceptArt key={this.props.currentPage} disabled={true}>
          {(conceptArt: { shouldTransform: boolean }) => (
            <>
              {this.hasGroupLogs() && groupLogs.map((groupLog, i) => {
                return (
                  <ItemSpacing>
                    <QuickViewItem
                      key={i}
                      shouldTransform={conceptArt.shouldTransform}
                      groupLog={groupLog}
                      onClick={this.onSelectGroupLog}
                    />
                  </ItemSpacing>
                );
              })}
              {!this.hasGroupLogs() &&
                <NoLogsText>
                  {this.props.loading ? 'Loading...' : 'There are no logs to show!'}
                </NoLogsText>
              }
            </>
          )}
        </ConceptArt>
      </Container>
    );
  }

  public componentDidMount() {
    this.setItemsPerPage();
    window.addEventListener('resize', this.setItemsPerPage);
  }

  public shouldComponentUpdate(nextProps: Props, nextState: State) {
    return this.props.currentPage !== nextProps.currentPage ||
      this.props.loading !== nextProps.loading ||
      this.props.searchValue !== nextProps.searchValue ||
      this.state.itemsPerPage !== nextState.itemsPerPage ||
      this.props.isUHD !== nextProps.isUHD ||
      !isEqual(this.props.groupLogs, nextProps.groupLogs);
  }

  public componentWillUnmount() {
    window.removeEventListener('resize', this.setItemsPerPage);
  }

  private setItemsPerPage = () => {
    const itemHeight = this.props.isUHD ? 200 : this.props.isMidScreen ? 130 : 100;
    const itemsPerPage = Math.floor(this.ref.clientHeight / itemHeight);
    this.setState({ itemsPerPage });
  }

  private hasGroupLogs = () => {
    return this.props.groupLogs.length > 0;
  }

  private onSelectGroupLog = (groupLog: GroupLogData) => {
    this.props.onSelectGroupLog(groupLog);
  }

  private getCurrentGroupLogsPage = () => {
    const { currentPage } = this.props;
    const groupLogs = this.props.groupLogs;
    const numberOfPages = Math.ceil(groupLogs.length / this.state.itemsPerPage);

    const firstItemIndex = (currentPage - 1) * this.state.itemsPerPage;
    return {
      numberOfPages,
      groupLogs: groupLogs.slice(firstItemIndex, firstItemIndex + this.state.itemsPerPage),
    };
  }
}

class QuickViewWithInjectedContext extends React.Component<ComponentProps> {
  public render() {
    return (
      <CraftingResolutionContext.Consumer>
        {({ isUHD, isMidScreen }) => (
          <CraftingContext.Consumer>
            {({ loading }) => (
              <QuickView {...this.props} loading={loading} isUHD={isUHD()} isMidScreen={isMidScreen()} />
            )}
          </CraftingContext.Consumer>
        )}
      </CraftingResolutionContext.Consumer>
    );
  }
}

export default QuickViewWithInjectedContext;
