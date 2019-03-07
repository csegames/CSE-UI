/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 */

import * as React from 'react';
import { styled } from '@csegames/linaria/react';
import { MediaBreakpoints } from 'services/session/MediaBreakpoints';

const Container = styled.div`
  display: flex;
  align-items: center;
  font-size: 12px;
  font-family: TradeWinds;
`;

const Pages = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  min-width: 80px;
`;

const Page = styled.div`
  cursor: pointer;
  width: 20px;
  height: 14px;
  line-height: 14px;
  &.active {
    font-weight: bold;
    text-decoration: underline;
    font-size: 14px;
    &:hover {
      opacity: 1;
    }
  }
  &:hover {
    opacity: 0.6;
  }

  @media (min-width: ${MediaBreakpoints.UHD}px) {
    width: 40px;
    height: 28px;
    font-size: 28px;
    line-height: 28px;

    &.active {
      font-size: 28px;
    }
  }
`;

const Divider = styled.div`
  width: 16px;
  letter-spacing: 1px;

  @media (min-width: ${MediaBreakpoints.UHD}px) {
    width: 28px;
    height: 28px;
    font-size: 28px;
  }
`;

const BackArrow = styled.div`
  width: 16px;
  height: 10px;
  background: url(../images/crafting/1080/paper-history-left-arrow.png) no-repeat;
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

  @media (min-width: ${MediaBreakpoints.UHD}px) {
    width: 32px;
    height: 19px;
    background: url(../images/crafting/4k/paper-history-left-arrow.png) no-repeat;
  }
`;

const NextArrow = styled.div`
  width: 16px;
  height: 10px;
  background: url(../images/crafting/1080/paper-history-right-arrow.png) no-repeat;
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

  @media (min-width: ${MediaBreakpoints.UHD}px) {
    width: 32px;
    height: 19px;
    background: url(../images/crafting/4k/paper-history-right-arrow.png) no-repeat;
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
