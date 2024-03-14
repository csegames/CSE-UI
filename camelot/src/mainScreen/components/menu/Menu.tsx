/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as React from 'react';
import { connect } from 'react-redux';
import { RootState } from '../../redux/store';
import Escapable from '../Escapable';
import { Dispatch } from '@reduxjs/toolkit';
import { CloseButton } from '../../../shared/components/CloseButton';
import { MenuTabContent } from './MenuTabContent';
import { FooterButtonData, MenuTabData } from './menuData';

const Root = 'HUD-Menu-Root';
const Container = 'HUD-Menu-Container';
const CloseButtonPosition = 'HUD-Menu-CloseButtonPosition';
const Corner = 'HUD-Menu-Corner';
const CornerX = 'HUD-Menu-CornerX';
const Content = 'HUD-Menu-Content';
const TabsNavigation = 'HUD-Menu-TabsNavigation';
const TabsBorder = 'HUD-Menu-TabsBorder';
const Tab = 'HUD-Menu-Tab';
const TabSelected = 'HUD-Menu-TabSelected';
const Title = 'HUD-Menu-Title';
const Footer = 'HUD-Menu-Footer';
const FooterButtons = 'HUD-Menu-FooterButtons';
const FooterButton = 'HUD-Menu-FooterButton';
const FooterOrnamentBefore = 'HUD-Menu-FooterOrnamentBefore';
const FooterOrnamentAfter = 'HUD-Menu-FooterOrnamentAfter';
const FooterInner = 'HUD-Menu-FooterInner';

interface ReactProps {
  menuID: string;
  closeSelf: () => void;
  title: string;
  tabs?: MenuTabData[];
  getFooterButtons?: (tabID: string, sectionID: string) => FooterButtonData[];
  escapable?: boolean;
  hideCloseButton?: boolean;
}

interface InjectedProps {
  dispatch?: Dispatch;
}

type Props = ReactProps & InjectedProps;

interface State {
  tabID: string | null;
  sectionID: string | null;
}

class AMenu extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      tabID: this.props.tabs?.[0]?.id ?? null,
      sectionID: this.props.tabs?.[0]?.sections?.[0]?.id ?? null
    };
  }

  render(): JSX.Element {
    const tab = this.props.tabs?.find((tab) => tab.id === this.state.tabID);
    const footerButtons =
      (this.props.getFooterButtons && this.props.getFooterButtons(this.state.tabID, this.state.sectionID)) ?? [];
    return (
      <>
        {this.props.escapable && <Escapable escapeID={this.props.menuID} onEscape={this.props.closeSelf.bind(this)} />}
        <div className={Root}>
          <div className={Container}>
            {!this.props.hideCloseButton && (
              <CloseButton className={CloseButtonPosition} onClick={this.props.closeSelf.bind(this)} />
            )}
            <div className={!this.props.hideCloseButton ? `${Corner} ${CornerX}` : Corner} />
            <div className={Content}>
              {this.props.tabs && this.props.tabs.length > 0 && (
                <>
                  <div className={TabsNavigation}>
                    <div className={TabsBorder}>
                      {this.props.tabs.map(({ id, title }) => {
                        const onClick = () => {
                          this.openTab(id);
                        };
                        return (
                          <div className={this.state.tabID === id ? `${Tab} ${TabSelected}` : Tab} onClick={onClick}>
                            <span>{title}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                  <MenuTabContent
                    tabID={this.state.tabID}
                    sectionID={this.state.sectionID}
                    setSectionID={this.openSection.bind(this)}
                    sections={tab.sections}
                    content={tab.content}
                  />
                </>
              )}
              {this.props.children}
              {footerButtons.length > 0 && (
                <div className={Footer}>
                  <div className={FooterInner}>
                    <div className={FooterOrnamentBefore} />
                    <div className={FooterButtons}>
                      {this.props
                        .getFooterButtons(this.state.tabID, this.state.sectionID)
                        .map(({ text, onClick }, index) => (
                          <div className={FooterButton} onClick={onClick} key={index}>
                            <span>{text}</span>
                          </div>
                        ))}
                    </div>
                    <div className={FooterOrnamentAfter} />
                  </div>
                </div>
              )}
            </div>
          </div>
          <div className={Title}>
            <span>{this.props.title}</span>
          </div>
        </div>
      </>
    );
  }

  openTab(tabID: string): void {
    if (this.state.tabID !== tabID) {
      const tab = this.props.tabs.find(({ id }) => tabID === id);
      this.setState({ sectionID: tab.sections?.[0]?.id ?? null });
    }
    this.setState({ tabID });
  }

  openSection(sectionID: string): void {
    this.setState({ sectionID });
  }
}

const mapStateToProps = (state: RootState, ownProps: ReactProps): Props => {
  return {
    ...ownProps
  };
};

export const Menu = connect(mapStateToProps)(AMenu);
