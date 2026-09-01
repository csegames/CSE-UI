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
import { MenuTabContent } from './MenuTabContent';
import { FooterButtonData, MenuTabData } from './menuData';
import { BaseHUDWidgetDraggableHandle } from '../BaseHUDWidgetDraggableHandle';
import { requestAddImagesToCache } from '../../dataSources/imageCacheService';
import { getFactionData } from '../../gameData/factionData';
import { BorderBackground, FactionBorder, BorderType } from '../FactionBorder';
import { CornerButtonType, FactionCornerButton } from '../FactionCornerButton';
import { FactionButton } from '../FactionButton';
import { FactionBorderSelectable } from '../FactionBorderSelectable';

// CSS classes
const Root = 'HUD-Menu-Root';
const Container = 'HUD-Menu-Container';
const Content = 'HUD-Menu-Content';
const TabsNavigation = 'HUD-Menu-TabsNavigation';
const TabsBorder = 'HUD-Menu-TabsBorder';
const Tab = 'HUD-Menu-Tab';
const TabText = 'HUD-Menu-TabText';
const HeaderDivider = 'HUD-Menu-HeaderDivider';
const Footer = 'HUD-Menu-Footer';
const FooterButtons = 'HUD-Menu-FooterButtons';
const FooterButton = 'HUD-Menu-FooterButton';
const FooterInner = 'HUD-Menu-FooterInner';
const DraggableHandle = 'HUD-Menu-DraggableHandle';

requestAddImagesToCache(Root, ['images/menu/menu-leftnav-texture.png', 'images/ui/modal-bg.png']);

interface ReactProps {
  isDragCopy: boolean;
  menuID: string;
  closeSelf: () => void;
  title: string;
  tabs?: MenuTabData[];
  getFooterButtons?: (tabID: string, sectionID: string) => FooterButtonData[];
  sidebarFooter?: React.ReactNode;
  escapable?: boolean;
  hideCloseButton?: boolean;
  // Hides the tab navigation bar.
  hideTabBar?: boolean;
  // Optional content shown across the top of the panel, where the tab bar would be.
  header?: React.ReactNode;
}

interface InjectedProps {
  uiFactionID: string;
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

  render(): React.ReactNode {
    const factionData = getFactionData(this.props.uiFactionID);

    const tab = this.props.tabs?.find((tab) => tab.id === this.state.tabID);
    const footerButtons = this.props.getFooterButtons?.(this.state.tabID, this.state.sectionID) ?? [];

    return (
      <div className={Root}>
        {this.props.escapable && !this.props.isDragCopy && (
          <Escapable escapeID={this.props.menuID} onEscape={this.props.closeSelf?.bind(this)} />
        )}
        <div className={Container}>
          <FactionBorder
            className={Content}
            type={BorderType.Decorative}
            background={BorderBackground.PatternLarge}
            titleText={this.props.title}
            cornerButtons={
              this.props.hideCloseButton
                ? undefined
                : [<FactionCornerButton type={CornerButtonType.Close} onClick={this.props.closeSelf?.bind(this)} />]
            }
          >
            {this.props.header}
            {this.props.header && (
              <div className={HeaderDivider} style={{ backgroundColor: factionData.borderColor }} />
            )}
            {this.props.tabs && this.props.tabs.length > 0 && (
              <>
                {!this.props.hideTabBar && (
                  <div className={TabsNavigation}>
                    <div className={TabsBorder} style={{ borderBottomColor: factionData.borderColor }}>
                      {this.props.tabs.map(({ id, title }, index) => {
                        return (
                          <FactionBorderSelectable
                            isSelected={this.state.tabID === id}
                            onSelected={() => {
                              this.openTab(id);
                            }}
                            className={Tab}
                            background={BorderBackground.PatternSmall}
                          >
                            <div className={TabText}>{title}</div>
                          </FactionBorderSelectable>
                        );
                      })}
                    </div>
                  </div>
                )}
                <MenuTabContent
                  tabID={this.state.tabID}
                  sectionID={this.state.sectionID}
                  setSectionID={this.openSection.bind(this)}
                  sections={tab.sections}
                  content={tab.content}
                  sidebarFooter={this.props.sidebarFooter}
                />
              </>
            )}
            {this.props.children}
            {footerButtons.length > 0 && (
              <div className={Footer} style={{ borderTopColor: factionData.borderColor }}>
                <div className={FooterInner}>
                  <div className={FooterButtons}>
                    {this.props
                      .getFooterButtons(this.state.tabID, this.state.sectionID)
                      .map(({ text, onClick, isDisabled }, index) => (
                        <FactionButton className={FooterButton} disabled={isDisabled} onClick={onClick} key={index}>
                          {text}
                        </FactionButton>
                      ))}
                  </div>
                </div>
              </div>
            )}
            <BaseHUDWidgetDraggableHandle className={DraggableHandle} widgetID={this.props.menuID} />
          </FactionBorder>
        </div>
      </div>
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
    ...ownProps,
    uiFactionID: state.hud.uiFactionID
  };
};

export const Menu = connect(mapStateToProps)(AMenu);
