/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as React from 'react';
import styled from 'react-emotion';

export interface PageControllerStyle {
  PageController: React.CSSProperties;
  controllerContainer: React.CSSProperties;
  contentContainer: React.CSSProperties;
  controllerButton: React.CSSProperties;
  disabledControllerButton: React.CSSProperties;
  pageNumberText: React.CSSProperties;
}

const ControllerButton = styled('button')`
  display: inline-block;
  cursor: pointer;
  &:active {
    text-shadow: 1px 1px rgba(0, 0, 0, 0.7);
  }
`;

const PageNumberText = styled('div')`
  margin: 0;
`;

export interface PageInfo<T> {
  render: (props: T) => JSX.Element;
  props?: any;
}

export interface PageControllerProps {
  styles?: Partial<PageControllerStyle>;
  prevButtonText?: string;
  nextButtonText?: string;
  onNextPageClick?: (activeIndex: number) => void;
  onPrevPageClick?: (activeIndex: number) => void;
  pages: PageInfo<Partial<{ active: boolean }>>[];
  onPageChange?: (page: number) => void;
  renderPageController?: (state: PageControllerState,
                          props: PageControllerProps,
                          onNextPageClick: any,
                          onPrevPageClick: any) => any;
  renderHeaderContainer?: (state: PageControllerState, props: PageControllerProps) => any;
}

export interface PageControllerState {
  activePageIndex: number;
}

export class PageController extends React.Component<PageControllerProps, PageControllerState> {
  constructor(props: PageControllerProps) {
    super(props);
    this.state = {
      activePageIndex: 0,
    };
  }

  public render() {
    const customStyles = this.props.styles || {};
    const activeContent = this.props.pages[this.state.activePageIndex];
    const { renderHeaderContainer, renderPageController } = this.props;
    return (
      <div style={customStyles.PageController}>
        {renderHeaderContainer && renderHeaderContainer(this.state, this.props)}
        {renderPageController ? renderPageController(this.state, this.props, this.onNextPage, this.onPrevPage) :
          this.renderPageController(customStyles)}
        {activeContent && <activeContent.render {...activeContent.props} />}
      </div>
    );
  }

  public componentWillReceiveProps(nextProps: PageControllerProps) {
    if (nextProps.pages.length < this.state.activePageIndex) {
      this.setState({ activePageIndex: 0 });
      this.props.onPageChange(0);
    }
  }

  private renderPageController = (customStyles: Partial<PageControllerStyle>) => {
    const moreNext = this.state.activePageIndex < this.props.pages.length - 1;
    const morePrev = this.state.activePageIndex > 0;
    return (
      <div style={customStyles.controllerContainer}>
        <ControllerButton
          style={!morePrev ?
            {...customStyles.controllerButton, ...customStyles.disabledControllerButton} : customStyles.controllerButton}
          onClick={this.onPrevPage}>
            {this.props.prevButtonText || '<Prev'}
        </ControllerButton>
        <p style={customStyles.pageNumberText}>
          {this.state.activePageIndex + 1} / {this.props.pages.length}
        </p>
        <ControllerButton
          style={!moreNext ?
            { ...customStyles.controllerButton, ...customStyles.disabledControllerButton } : customStyles.controllerButton}
            onClick={this.onNextPage}>
          {this.props.nextButtonText || 'Next>'}
        </ControllerButton>
      </div>
    );
  }

  private onNextPage = () => {
    if (this.state.activePageIndex < this.props.pages.length - 1) {
      const nextPageIndex = this.state.activePageIndex + 1;
      this.setState({ activePageIndex: nextPageIndex });
      if (typeof this.props.onNextPageClick === 'function') {
        this.props.onNextPageClick(nextPageIndex);
        this.props.onPageChange(nextPageIndex);
      }
    }
  }

  private onPrevPage = () => {
    if (this.state.activePageIndex > 0) {
      const prevPageIndex = this.state.activePageIndex - 1;
      this.setState({ activePageIndex: this.state.activePageIndex - 1 });
      if (typeof this.props.onPrevPageClick === 'function') {
        this.props.onPrevPageClick(prevPageIndex);
        this.props.onPageChange(prevPageIndex);
      }
    }
  }
}

export default PageController;
