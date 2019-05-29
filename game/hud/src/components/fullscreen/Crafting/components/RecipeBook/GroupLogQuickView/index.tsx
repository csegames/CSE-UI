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
import { CONTAINER_MAX_HEIGHT } from './GeneralQuickViewItem';
import PageSelector from '../PageSelector';
import ConceptArt from '../ConceptArt';
import { CraftingContext } from '../../../CraftingContext';
import { MID_SCALE, HD_SCALE } from 'fullscreen/lib/constants';

const Container = styled.div`
  width: 100%;
  height: 100%;
`;

// #region ItemSpacing constants
const ITEM_SPACING_MARGIN_TOP = 20;
// #endregion
const ItemSpacing = styled.div`
  margin-top: ${ITEM_SPACING_MARGIN_TOP}px;

  @media (max-width: 2560px) {
    margin-top: ${ITEM_SPACING_MARGIN_TOP * MID_SCALE}px;
  }

  @media (max-width: 1920px) {
    margin-top: ${ITEM_SPACING_MARGIN_TOP * HD_SCALE}px;
  }
`;

// #region PageSelectorPosition constants
const PAGE_SELECTOR_POSITION_RIGHT = 20;
const PAGE_SELECTOR_POSITION_PADDING = 10;
const PAGE_SELECTOR_POSITION_BACK_RIGHT = 160;
// #endregion
const PageSelectorPosition = styled.div`
  position: absolute;
  right: ${PAGE_SELECTOR_POSITION_RIGHT}px;
  padding: ${PAGE_SELECTOR_POSITION_PADDING}px;
  top: 0;

  &.showingBackButton {
    right: ${PAGE_SELECTOR_POSITION_BACK_RIGHT}px;
  }

  @media (max-width: 2560px) {
    right: ${PAGE_SELECTOR_POSITION_RIGHT * MID_SCALE}px;
    padding: ${PAGE_SELECTOR_POSITION_PADDING * MID_SCALE}px;

    &.showingBackButton {
      right: ${PAGE_SELECTOR_POSITION_BACK_RIGHT * MID_SCALE}px;
    }
  }

  @media (max-width: 1920px) {
    right: ${PAGE_SELECTOR_POSITION_RIGHT * HD_SCALE}px;
    padding: ${PAGE_SELECTOR_POSITION_PADDING * HD_SCALE}px;

    &.showingBackButton {
      right: ${PAGE_SELECTOR_POSITION_BACK_RIGHT * HD_SCALE}px;
    }
  }
`;

// #region NoLogsText constants
const NO_LOGS_TEXT_FONT_SIZE = 32;
// #endregion
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
  font-size: ${NO_LOGS_TEXT_FONT_SIZE}px;
  pointer-events: none;

  @media (max-width: 2560px) {
    font-size: ${NO_LOGS_TEXT_FONT_SIZE * MID_SCALE}px;
  }

  @media (max-width: 1920px) {
    font-size: ${NO_LOGS_TEXT_FONT_SIZE * HD_SCALE}px;
  }
`;

export interface InjectedProps {
  loading: boolean;
  isUHD: boolean;
  resolution: { width: number, height: number };
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
  }

  public shouldComponentUpdate(nextProps: Props, nextState: State) {
    return this.props.currentPage !== nextProps.currentPage ||
      this.props.loading !== nextProps.loading ||
      this.props.searchValue !== nextProps.searchValue ||
      this.state.itemsPerPage !== nextState.itemsPerPage ||
      this.props.isUHD !== nextProps.isUHD ||
      !isEqual(this.props.resolution, nextProps.resolution) ||
      !isEqual(this.props.groupLogs, nextProps.groupLogs);
  }

  public componentDidUpdate(prevProps: Props) {
    if (this.props.resolution.width !== prevProps.resolution.width) {
      this.setItemsPerPage();
    }
  }

  private setItemsPerPage = () => {
    const { resolution } = this.props;
    const itemHeight = resolution.width > 2560 ? CONTAINER_MAX_HEIGHT : resolution.width > 1920 ?
      CONTAINER_MAX_HEIGHT * MID_SCALE : CONTAINER_MAX_HEIGHT * HD_SCALE;
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
      <UIContext.Consumer>
        {({ isUHD, resolution }) => (
          <CraftingContext.Consumer>
            {({ loading }) => (
              <QuickView {...this.props} loading={loading} isUHD={isUHD()} resolution={resolution} />
            )}
          </CraftingContext.Consumer>
        )}
      </UIContext.Consumer>
    );
  }
}

export default QuickViewWithInjectedContext;
