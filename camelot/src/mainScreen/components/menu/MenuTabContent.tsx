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

const Main = 'HUD-Menu-Main';
const MainInner = 'HUD-Menu-MainInner';
const Sidebar = 'HUD-Menu-Sidebar';
const SectionLabel = 'HUD-Menu-SectionLabel';
const SectionLabelSelected = 'HUD-Menu-SectionLabelSelected';
const SectionLabelInner = 'HUD-Menu-SectionLabelInner';
const MainContent = 'HUD-Menu-MainContent';
const MainContentInner = 'HUD-Menu-MainContentInner';
const MainContentInnerScrollable = 'HUD-Menu-MainContentInnerScrollable';
const ComingSoon = 'HUD-Menu-ComingSoon';
const Scroller = 'Scroller-ThumbOnly';

interface ReactProps {
  tabID: string;
  sectionID: string | null;
  setSectionID: (sectionID: string) => void;
  sections?: MenuSectionData[];
  content?: MenuContentData;
}

interface InjectedProps {
  dispatch?: Dispatch;
}

type Props = ReactProps & InjectedProps;

class AMenuTabContent extends React.Component<Props> {
  constructor(props: Props) {
    super(props);
  }

  render(): JSX.Element {
    const content = this.getContent();
    return (
      <div className={Main}>
        <div className={MainInner}>
          {this.props.sections && (
            <div className={Sidebar}>
              {this.props.sections.map(({ id, title }) => {
                const openSection = (): void => {
                  this.props.setSectionID(id);
                };
                return (
                  <div
                    className={this.props.sectionID === id ? `${SectionLabel} ${SectionLabelSelected}` : SectionLabel}
                    onClick={openSection.bind(this)}
                  >
                    <div className={SectionLabelInner} />
                    <span>{title}</span>
                  </div>
                );
              })}
            </div>
          )}
          <div className={MainContent}>
            <div
              className={
                content?.scrollable ? `${MainContentInner} ${MainContentInnerScrollable} ${Scroller}` : MainContentInner
              }
            >
              {content?.node ?? <p className={ComingSoon}>Coming soon</p>}
            </div>
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
    ...ownProps
  };
};

export const MenuTabContent = connect(mapStateToProps)(AMenuTabContent);
