/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 */

import * as React from 'react';
import { css } from '@csegames/linaria';
import { styled } from '@csegames/linaria/react';
import { Tooltip } from '../../../components/Tooltip';
import { CharacterCreationPage } from '../index';

const Container = styled.div`
  display: flex;
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #0D0D0D;
  height: 50px;
  padding: 0 10px;
  z-index: 10;
  user-select: none;
  -webkit-user-select: none;
`;

const Section = css`
  flex: 1;
`;

const MiddleNavContainer = styled.div`
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const CreateContainer = styled.div`
  display: flex;
  justify-content: flex-end;
  align-items: center;
`;

const ProgressContainer = styled.div`
  display: flex;
  align-items: center;
`;

const ProgressImage = styled.img`
  cursor: pointer;
  width: 55px;
  height: 55px;
  margin: 5px 0 0 0;
`;

const NavProgressSection = styled.div`
  display: flex;
  align-items: center;
  flex: 1;
`;

const NavButton = styled.button`
  font-size: 14px;
  font-family: 'Caudex';
  cursor: pointer;
  color: #D6B597;
  background-color: #2D2B27;
  border: 0px;
  padding: 10px 20px;
  margin: 0px 10px;
  width: 120px;
  outline: 1px solid #4C4036;
  outline-offset: -5px;
  letter-spacing: 2px;
  text-transform: uppercase;
  &:hover {
    color: #e0c7b1;
    filter: brightness(150%);
  }
`;

const NavConnector = styled.div`
  height: 2px;
  width: 30px;
  margin: 0px -5px;
  background-color: #5c5650;
`;

const NavConnectorCompleted = css`
  background-color: #D2B59D;
`;

const NavArrow = styled.span`
  margin: 0 2px;
`;

const CreateButton = css`
  color: #ECC867;
  outline: 0;
  padding: 8px 20px;
  border-image: linear-gradient(180deg,#e2cb8e,#8e6d27) stretch;
  border-style: solid;
  border-width: 3px 1px;
  background-color: rgba(17,17,17,0.8);
  border-image-slice: 1;
`;

const Disabled = css`
  color: #454545;
  opacity: 0.2;
  &:hover {
    color: #454545;
    filter: brightness(100%);
  }
`;

export interface NavigationPageInfo {
  pageNumber: CharacterCreationPage;
  pageComplete: boolean;
  pageVisited: boolean;
  onClick: () => void;
}

export interface NavigationProps {
  onNextClick: () => void;
  onBackClick: () => void;
  onCancelClick: () => void;
  onHelpClick: () => void;
  pages: NavigationPageInfo[];
  currentPage: CharacterCreationPage;
  disableNavButtons: boolean;
}

export interface NavigationState {
}

export const navImages = {
  current: 'images/character-creation-nav/current.png',
  done: 'images/character-creation-nav/done.png',
  empty: 'images/character-creation-nav/empty.png',
  visited: 'images/character-creation-nav/visited.png',
};

export class Navigation extends React.Component<NavigationProps, NavigationState> {
  constructor(props: NavigationProps) {
    super(props);
    this.state = {
    };
  }

  public render() {
    const nextDisabled = this.props.currentPage === this.props.pages.length - 1;
    const backDisabled = this.props.currentPage === 0;

    return (
      <Container>
        <div className={Section} />
        <MiddleNavContainer className={Section}>
          <NavButton
            disabled={backDisabled}
            className={backDisabled ? Disabled : ''}
            onClick={this.props.onBackClick}>
            <NavArrow className='fa fa-angle-left' />
            BACK
          </NavButton>
          <ProgressContainer>
            {this.props.pages.map((page, i) => {
              const imageSource = page.pageNumber === this.props.currentPage ? navImages.current :
                page.pageComplete ? navImages.done :
                page.pageVisited && !page.pageComplete ? navImages.visited :
                !page.pageVisited && !page.pageComplete && navImages.empty;
              const pageName = CharacterCreationPage[page.pageNumber];
              return (
                <NavProgressSection key={i}>
                  <Tooltip
                    styles={{
                      tooltip: {
                        backgroundColor: 'rgba(0,0,0,0.8)',
                      },
                    }}
                  content={pageName}>
                    <ProgressImage src={imageSource} onClick={!this.props.disableNavButtons ? page.onClick : () => {}} />
                  </Tooltip>
                  {i < this.props.pages.length - 1 &&
                    <NavConnector className={page.pageComplete ? NavConnectorCompleted : ''} />
                  }
                </NavProgressSection>
              );
            })}
          </ProgressContainer>
          <NavButton
            id='cu-char-creation-next'
            disabled={nextDisabled}
            className={nextDisabled ? Disabled : ''}
            onClick={this.props.onNextClick}>
            NEXT
            <NavArrow className='fa fa-angle-right' />
          </NavButton>
        </MiddleNavContainer>
        <CreateContainer className={Section}>
          {nextDisabled &&
            <NavButton className={CreateButton} onClick={this.props.onNextClick}>
              CREATE
            </NavButton>
          }
        </CreateContainer>
      </Container>
    );
  }
}

export default Navigation;
