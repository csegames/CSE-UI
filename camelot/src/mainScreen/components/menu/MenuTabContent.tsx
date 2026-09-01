/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as React from 'react';
import { Dispatch } from '@reduxjs/toolkit';
import { connect } from 'react-redux';
import { RootState } from '../../redux/store';
import { MenuContentData, MenuSectionData } from './menuData';
import { getStringTableValue } from '../../helpers/stringTableHelpers';
import { StringTableEntryDef } from '../../dataSources/manifest/stringTableManifest';
import { Dictionary } from '@csegames/library/dist/_baseGame/types/ObjectMap';
import { FactionScrollArea } from '../FactionScrollArea';
import { getFactionData } from '../../gameData/factionData';

// CSS classes
const Main = 'HUD-Menu-Main';
const MainInner = 'HUD-Menu-MainInner';
const Sidebar = 'HUD-Menu-Sidebar';
const SidebarFooter = 'HUD-Menu-SidebarFooter';
const SectionLabelContainer = 'HUD-Menu-SectionLabelContainer';
const SectionLabel = 'HUD-Menu-SectionLabel';
const SectionLabelSelected = 'HUD-Menu-SectionLabelSelected';
const SectionLabelSelectedTop = 'HUD-Menu-SectionLabelSelected-Top';
const SectionLabelSelectedBottom = 'HUD-Menu-SectionLabelSelected-Bottom';
const SectionLabelSelectedArrow = 'HUD-Menu-SectionLabelSelected-Arrow';
const MainContent = 'HUD-Menu-MainContent';
const MainContentInner = 'HUD-Menu-MainContentInner';
const ComingSoon = 'HUD-Menu-ComingSoon';

// String IDs
const StringIDMenuComingSoon = 'MenuComingSoon';

interface ReactProps {
  tabID: string;
  sectionID: string | null;
  setSectionID: (sectionID: string) => void;
  sections?: MenuSectionData[];
  content?: MenuContentData;
  sidebarFooter?: React.ReactNode;
}

interface InjectedProps {
  stringTable: Dictionary<StringTableEntryDef>;
  uiFactionID: string;
  dispatch?: Dispatch;
}

type Props = ReactProps & InjectedProps;

class AMenuTabContent extends React.Component<Props> {
  constructor(props: Props) {
    super(props);
  }

  render(): JSX.Element {
    const content = this.getContent();
    const factionData = getFactionData(this.props.uiFactionID);

    return (
      <div className={Main}>
        <div className={MainInner}>
          {this.props.sections && (
            <div
              className={Sidebar}
              style={{
                backgroundImage: `url(${factionData.bagBackgroundImage})`,
                borderRightColor: factionData.borderColor
              }}
            >
              {this.props.sections.map(({ id, title, onOpen }) => {
                const openSection = (): void => {
                  if (this.props.sectionID !== id) {
                    this.props.setSectionID(id);
                    onOpen?.();
                  }
                };
                return (
                  <div className={SectionLabelContainer} onClick={openSection.bind(this)}>
                    <div className={SectionLabel}>{title}</div>
                    {this.props.sectionID === id && (
                      <div className={SectionLabelSelected}>
                        <img className={SectionLabelSelectedTop} src={factionData.dividerVerticalImage} />
                        <img className={SectionLabelSelectedBottom} src={factionData.dividerVerticalImage} />
                        <img className={SectionLabelSelectedArrow} src={factionData.arrowPointerImage} />
                      </div>
                    )}
                  </div>
                );
              })}
              {this.props.sidebarFooter && <div className={SidebarFooter}>{this.props.sidebarFooter}</div>}
            </div>
          )}
          <div className={MainContent}>
            {content?.scrollable ? (
              <FactionScrollArea className={MainContentInner}>
                {content?.node ?? (
                  <p className={ComingSoon}>{getStringTableValue(StringIDMenuComingSoon, this.props.stringTable)}</p>
                )}
              </FactionScrollArea>
            ) : (
              <div className={MainContentInner}>
                {content?.node ?? (
                  <p className={ComingSoon}>{getStringTableValue(StringIDMenuComingSoon, this.props.stringTable)}</p>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  getContent(): MenuContentData | null {
    if (this.props.sections) {
      return this.props.sections.find((section) => section.id === this.props.sectionID)?.content ?? null;
    }
    if (this.props.content) {
      return this.props.content;
    }
    return null;
  }
}

const mapStateToProps = (state: RootState, ownProps: ReactProps): Props => {
  return {
    ...ownProps,
    stringTable: state.stringTable.stringTable,
    uiFactionID: state.hud.uiFactionID
  };
};

export const MenuTabContent = connect(mapStateToProps)(AMenuTabContent);
