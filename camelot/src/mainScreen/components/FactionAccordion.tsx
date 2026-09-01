/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { Dispatch } from '@reduxjs/toolkit';
import * as React from 'react';
import { connect } from 'react-redux';
import { RootState } from '../redux/store';
import { getFactionData } from '../gameData/factionData';
import { genID } from '@csegames/library/dist/_baseGame/utils/idGen';
import { ResizeDetector } from '../../shared/components/ResizeDetector';
import { FactionScrollArea } from './FactionScrollArea';
import { SoundEvents } from '@csegames/library/dist/camelotunchained/game/types/SoundEvents';
import { clientAPI } from '@csegames/library/dist/camelotunchained/MainScreenClientAPI';

const Root = 'HUD-FactionAccordion-Root';
const RowRoot = 'HUD-FactionAccordion-RowRoot';
const RowContent = 'HUD-FactionAccordion-RowContent';
const RowLabel = 'HUD-FactionAccordion-RowLabel';
const RowArrow = 'HUD-FactionAccordion-RowArrow';
const RowPointer = 'HUD-FactionAccordion-RowPointer';
const CollapserContainer = 'HUD-FactionAccordion-CollapserContainer';
const Collapser = 'HUD-FactionAccordion-Collapser';
const ChildrenContainer = 'HUD-FactionAccordion-ChildrenContainer';
const ChildrenContent = 'HUD-FactionAccordion-ChildrenContent';
const ChildrenBackground = 'HUD-FactionAccordion-ChildrenBackground';
const SectionOpenBottom = 'HUD-FactionAccordion-SectionOpenBottom';
const SectionOpenTop = 'HUD-FactionAccordion-SectionOpenTop';

export interface AccordionRowData {
  content: string | ((isSelected: boolean) => React.ReactNode);
  children?: AccordionRowData[];
  extraData?: any;
}

interface AccordionRowState extends AccordionRowData {
  // For internal use only.
  childrenHeight?: number;
  isOpen: boolean;
  id: string;
}

interface State {
  data: AccordionRowState[];
  selectedRowID: string;
}

interface ReactProps extends React.HTMLAttributes<HTMLDivElement> {
  data: AccordionRowData[];
  factionIDOverride?: string;
  maxOpenedHeightVmin?: number;
  barOnLeft?: boolean;
  onRowSelected?: (datum: AccordionRowData) => void;
  soundEventScrolled?: SoundEvents;
  soundEventItemSelected?: SoundEvents;
  soundEventFoldingToggled?: SoundEvents;
}

interface InjectedProps {
  uiFactionID: string;
  vminPx: number;
  dispatch?: Dispatch;
}

type Props = ReactProps & InjectedProps;

class AFactionAccordion extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = { data: this.prepareData(props.data, true), selectedRowID: '' };
  }

  render(): JSX.Element {
    const { uiFactionID, factionIDOverride, maxOpenedHeightVmin, vminPx, dispatch, className, ...otherProps } =
      this.props;

    return (
      <div {...otherProps} className={`${Root} ${className}`}>
        {this.renderAccordionData(this.state.data)}
      </div>
    );
  }

  componentDidUpdate(prevProps: Readonly<Props>, prevState: Readonly<State>, snapshot?: any): void {
    if (this.props.data !== prevProps.data) {
      if (
        this.props.data.length !== prevProps.data.length || // Row added or removed.
        this.props.data.some((d, index) => prevProps.data[index].children?.length !== d.children?.length) // Child added or removed.
      ) {
        // Preserve the selection across data regeneration by matching extraData reference.
        const selectedExtraData = this.findRowByID(this.state.data, this.state.selectedRowID)?.extraData;
        const newData = this.prepareData(this.props.data, true);
        const newSelectedRowID = selectedExtraData != null
          ? (this.findRowByExtraData(newData, selectedExtraData)?.id ?? '')
          : '';
        this.setState({ data: newData, selectedRowID: newSelectedRowID });
      }
    }
  }

  private findRowByID(data: AccordionRowState[], id: string): AccordionRowState | undefined {
    for (const row of data) {
      if (row.id === id) return row;
      const found = this.findRowByID(row.children as AccordionRowState[], id);
      if (found) return found;
    }
    return undefined;
  }

  private findRowByExtraData(data: AccordionRowState[], extraData: any): AccordionRowState | undefined {
    for (const row of data) {
      if (row.extraData === extraData) return row;
      const found = this.findRowByExtraData(row.children as AccordionRowState[], extraData);
      if (found) return found;
    }
    return undefined;
  }

  private prepareData(data: AccordionRowData[], isInitial?: boolean): AccordionRowState[] {
    return data.map((datum) => {
      const d: AccordionRowState = {
        ...datum,
        children: this.prepareData(datum.children ?? []),
        id: genID(),
        // If there's only one top level entry, open it by default for convenience' sake.
        isOpen: !!isInitial && data.length === 1
      };
      return d;
    });
  }

  private renderAccordionData(data: AccordionRowState[]): React.ReactNode[] {
    const lines: React.ReactNode[] = data.map((datum) => this.renderAccordionRow(datum));
    return lines;
  }

  private renderAccordionRow(datum: AccordionRowState): React.ReactNode {
    const factionData = getFactionData(this.props.uiFactionID);

    const isSelected = datum.id === this.state.selectedRowID;
    const hasChildren = (datum.children?.length ?? 0) > 0;

    const { maxOpenedHeightVmin, vminPx, barOnLeft } = this.props;

    return (
      <React.Fragment key={datum.id}>
        <div className={RowRoot} onClick={this.onRowClick.bind(this, datum)}>
          <div
            className={RowContent}
            style={
              isSelected
                ? {
                    borderTopColor: factionData.borderColor,
                    borderBottomColor: factionData.borderColor
                  }
                : {}
            }
          >
            {typeof datum.content === 'string' ? (
              <>
                <div className={`${RowLabel}${isSelected ? ' selected' : ''}${hasChildren ? ' hasChildren' : ''}`}>
                  {datum.content}
                </div>
                <img
                  className={RowPointer}
                  src={factionData.arrowPointerImage}
                  style={{ opacity: isSelected ? 1 : 0 }}
                />
              </>
            ) : (
              datum.content(isSelected)
            )}
          </div>
          {hasChildren && (
            <img className={`${RowArrow} ${datum.isOpen ? 'open' : 'closed'}`} src={factionData.arrowPointerImage} />
          )}
          <img className={`${SectionOpenTop}${datum.isOpen ? ' open' : ''}`} src={factionData.dividerVerticalImage} />
        </div>
        {hasChildren && (
          <div className={CollapserContainer}>
            <div className={ChildrenBackground} style={{ backgroundImage: `url(${factionData.windowBackgroundImage})` }} />
            <div className={Collapser} style={{ height: datum.isOpen ? datum.childrenHeight : 0 }}>
              <FactionScrollArea
                className={`${ChildrenContainer}${barOnLeft ? ' barOnLeft' : ''}`}
                contentClassName={ChildrenContent}
                style={{
                  maxHeight: (maxOpenedHeightVmin ?? Number.MAX_SAFE_INTEGER) * vminPx,
                  borderLeftColor: factionData.borderColor,
                  borderRightColor: factionData.borderColor
                }}
                barOnLeft={barOnLeft}
                scrollbarWidth={'1.5vmin'}
                topFadeAmount={'2vmin'}
                bottomFadeAmount={'2vmin'}
                useSmallThumb
                soundEventScrolled={this.props.soundEventScrolled}
              >
                <ResizeDetector
                  onResize={(newWidth, newHeight) => {
                    if (newHeight !== datum.childrenHeight) {
                      datum.childrenHeight = newHeight;
                      this.setState({ data: [...this.state.data] });
                    }
                  }}
                />
                {this.renderAccordionData(datum.children as AccordionRowState[])}
              </FactionScrollArea>
            </div>
            <img className={`${SectionOpenTop}${datum.isOpen ? ' open' : ''}`} src={factionData.dividerVerticalImage} />
            <img
              className={`${SectionOpenBottom}${datum.isOpen ? ' open' : ''}`}
              src={factionData.dividerVerticalImage}
            />
          </div>
        )}
      </React.Fragment>
    );
  }

  private onRowClick(datum: AccordionRowState): void {
    if ((datum.children?.length ?? 0) > 0) {
      // Folding node.
      datum.isOpen = !datum.isOpen;
      this.setState({ data: [...this.state.data] });
      if (this.props.soundEventFoldingToggled) {
        clientAPI.playGameSound(this.props.soundEventFoldingToggled);
      }
    } else {
      this.setState({ selectedRowID: datum.id });
      this.props.onRowSelected?.(datum);
      if (this.props.soundEventItemSelected) {
        clientAPI.playGameSound(this.props.soundEventItemSelected);
      }
    }
  }
}

const mapStateToProps = (state: RootState, ownProps: ReactProps): Props => {
  return {
    ...ownProps,
    uiFactionID: ownProps.factionIDOverride ?? state.hud.uiFactionID,
    vminPx: state.hud.vminPx
  };
};

export const FactionAccordion = connect(mapStateToProps)(AFactionAccordion);
