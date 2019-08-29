/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 */

import * as React from 'react';
import { styled } from '@csegames/linaria/react';
import { MID_SCALE, HD_SCALE } from 'fullscreen/lib/constants';

// #region Container constants
const CONTAINER_FONT_SIZE = 24;
// #endregion
const Container = styled.div`
  display: flex;
  align-items: center;
  font-family: TradeWinds;
  font-size: ${CONTAINER_FONT_SIZE}px;

  @media (max-width: 2560px) {
    font-size: ${CONTAINER_FONT_SIZE * MID_SCALE}px;
  }

  @media (max-width: 1920px) {
    font-size: ${CONTAINER_FONT_SIZE * HD_SCALE}px;
  }
`;

// #region Pages constants
const PAGES_MIN_WIDTH = 160;
// #endregion
const Pages = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  min-width: ${PAGES_MIN_WIDTH}px;

  @media (max-width: 2560px) {
    min-width: ${PAGES_MIN_WIDTH * MID_SCALE}px;
  }

  @media (max-width: 1920px) {
    min-width: ${PAGES_MIN_WIDTH * HD_SCALE}px;
  }
`;

// #region Page constants
const PAGE_WIDTH = 40;
const PAGE_HEIGHT = 28;
const PAGE_FONT_SIZE = 28;
// #endregion
const Page = styled.div`
  cursor: pointer;
  width: ${PAGE_WIDTH}px;
  height: ${PAGE_HEIGHT}px;
  line-height: ${PAGE_FONT_SIZE}px;
  font-size: ${PAGE_FONT_SIZE}px;
  &.active {
    font-weight: bold;
    text-decoration: underline;
    &:hover {
      opacity: 1;
    }
  }
  &:hover {
    opacity: 0.6;
  }

  @media (max-width: 2560px) {
    width: ${PAGE_WIDTH * MID_SCALE}px;
    height: ${PAGE_HEIGHT * MID_SCALE}px;
    line-height: ${PAGE_FONT_SIZE * MID_SCALE}px;
    font-size: ${PAGE_FONT_SIZE * MID_SCALE}px;
  }

  @media (max-width: 1920px) {
    width: ${PAGE_WIDTH * MID_SCALE}px;
    height: ${PAGE_HEIGHT * MID_SCALE}px;
    line-height: ${PAGE_FONT_SIZE * MID_SCALE}px;
    font-size: ${PAGE_FONT_SIZE * MID_SCALE}px;
  }
`;

// #region Divider constants
const DIVIDER_DIMENSIONS = 32;
const DIVIDER_FONT_SIZE = 32;
const DIVIDER_LETTER_SPACING = 2;
// #endregion
const Divider = styled.div`
  width: ${DIVIDER_DIMENSIONS}px;
  font-size: ${DIVIDER_FONT_SIZE}px;
  letter-spacing: ${DIVIDER_LETTER_SPACING}px;

  @media (max-width: 2560px) {
    width: ${DIVIDER_DIMENSIONS * MID_SCALE}px;
    font-size: ${DIVIDER_FONT_SIZE * MID_SCALE}px;
    letter-spacing: ${DIVIDER_LETTER_SPACING * MID_SCALE}px;
  }

  @media (max-width: 1920px) {
    width: ${DIVIDER_DIMENSIONS * HD_SCALE}px;
    font-size: ${DIVIDER_FONT_SIZE * HD_SCALE}px;
    letter-spacing: ${DIVIDER_LETTER_SPACING * HD_SCALE}px;
  }
`;

// #region BackArrow constants
const BACK_ARROW_WIDTH = 32;
const BACK_ARROW_HEIGHT = 20;
// #endregion
const BackArrow = styled.div`
  width: ${BACK_ARROW_WIDTH}px;
  height: ${BACK_ARROW_HEIGHT}px;
  background-image: url(../images/crafting/uhd/paper-history-left-arrow.png);
  background-size: contain;
  background-repeat: no-repeat;
  cursor: pointer;
  &.disabled {
    opacity: 0.6;
    cursor: not-allowed;
    &:hover {
      opacity: 0.6;
    }
  }
  &:hover {
    opacity: 0.8;
  }

  @media (max-width: 2560px) {
    width: ${BACK_ARROW_WIDTH * MID_SCALE}px;
    height: ${BACK_ARROW_HEIGHT * MID_SCALE}px;
  }

  @media (max-width: 1920px) {
    width: ${BACK_ARROW_WIDTH * HD_SCALE}px;
    height: ${BACK_ARROW_HEIGHT * HD_SCALE}px;
    background-image: url(../images/crafting/hd/paper-history-left-arrow.png);
  }
`;

// #region NextArrow constants
const NEXT_ARROW_WIDTH = 32;
const NEXT_ARROW_HEIGHT = 20;
// #endregion
const NextArrow = styled.div`
  width: ${NEXT_ARROW_WIDTH}px;
  height: ${NEXT_ARROW_HEIGHT}px;
  background-image: url(../images/crafting/uhd/paper-history-right-arrow.png);
  background-size: contain;
  background-repeat: no-repeat;
  cursor: pointer;
  &.disabled {
    opacity: 0.6;
    cursor: not-allowed;
    &:hover {
      opacity: 0.6;
    }
  }
  &:hover {
    opacity: 0.8;
  }

  @media (max-width: 2560px) {
    width: ${NEXT_ARROW_WIDTH * MID_SCALE}px;
    height: ${NEXT_ARROW_HEIGHT * MID_SCALE}px;
  }

  @media (max-width: 1920px) {
    width: ${NEXT_ARROW_WIDTH * HD_SCALE}px;
    height: ${NEXT_ARROW_HEIGHT * HD_SCALE}px;
    background-image: url(../images/crafting/hd/paper-history-right-arrow.png);
  }
`;

export interface Props {
  currentPage: number;
  numberOfPages: number;
  onChangeCurrentPage: (page: number) => void;
  hideArrows?: boolean;
}

class PageSelector extends React.Component<Props> {
  public render() {
    const { currentPage, hideArrows } = this.props;
    const { pages, lastPage } = this.getPages();
    return this.props.numberOfPages > 0 ? (
      <Container>
        <Pages>
          {pages.map((pageNumber, i) => {
            return (
              <Page
                key={i}
                onClick={() => this.props.onChangeCurrentPage(pageNumber)}
                className={currentPage === pageNumber ? 'active' : ''}>
                  {pageNumber}
              </Page>
            );
          })}
          {lastPage && [
            <Divider key='divider'>...</Divider>,
            <Page
              key='last-page'
              onClick={() => this.props.onChangeCurrentPage(lastPage)}
              className={currentPage === lastPage ? 'active' : ''}>
              {lastPage}
            </Page>,
          ]}
        </Pages>
        {!hideArrows &&
          <BackArrow
            className={!this.hasBackPage() ? 'disabled' : ''}
            onClick={this.onBackClick}
          />
        }
        {!hideArrows &&
          <NextArrow
            className={!this.hasNextPage() ? 'disabled' : ''}
            onClick={this.onNextClick}
          />
        }
      </Container>
    ) : null;
  }

  private hasBackPage = () => {
    const { currentPage } = this.props;
    const potentialBackPage = currentPage - 1;
    return  potentialBackPage >= 1;
  }

  private hasNextPage = () => {
    const { currentPage, numberOfPages } = this.props;
    const potentialNextPage = currentPage + 1;
    return potentialNextPage <= numberOfPages;
  }

  private onBackClick = () => {
    if (this.hasBackPage()) {
      this.props.onChangeCurrentPage(this.props.currentPage - 1);
    }
  }

  private onNextClick = () => {
    if (this.hasNextPage()) {
      this.props.onChangeCurrentPage(this.props.currentPage + 1);
    }
  }

  private getPages = () => {
    const { currentPage, numberOfPages } = this.props;
    const hasMidStartPage = currentPage - 1 > 0;
    const hasLastPage = currentPage + 3 < numberOfPages;
    const isSmallPageSet = currentPage - 4 <= 0;

    let startingIndex = 1;
    let nextPageSet = numberOfPages;

    if (hasLastPage) {
      if (hasMidStartPage) {
        // In middle of pages
        startingIndex = currentPage - 1;
        nextPageSet = currentPage + 2;
      } else {
        // Is near the end of pages
        startingIndex = currentPage;
        nextPageSet = currentPage + 3;
      }
    } else {
      if (!isSmallPageSet) {
        // At the end of all pages, there's no more specific delimited last page
        startingIndex = numberOfPages - 4;
        nextPageSet = numberOfPages;
      }
    }

    const pages = [];
    for (let i = startingIndex; i < nextPageSet; i++) {
      pages.push(i);
    }

    pages.push(numberOfPages);

    return {
      pages: hasLastPage ? pages.slice(0, 3) : pages,
      lastPage: hasLastPage ? pages[3] : null,
    };
  }
}

export default PageSelector;
