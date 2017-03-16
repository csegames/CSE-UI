/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 * @Author: Andrew L. Jackson (jacksonal300@gmail.com)
 * @Date: 2017-03-03 16:12:15
 * @Last Modified by: Andrew L. Jackson (jacksonal300@gmail.com)
 * @Last Modified time: 2017-03-21 15:07:24
 */

import * as React from 'react';
import { StyleSheet, css, StyleDeclaration } from 'aphrodite';
import { BanesAndBoonsInfo, TraitMap, TraitIdMap } from '../../services/session/banesAndBoons';
import Bane from './Bane';
import Boon from './Boon';
import { TraitStyle } from './Trait';
import TraitSummary, { TraitSummaryStyle } from './TraitSummary';
import { events, Tooltip } from 'camelot-unchained';
import { styleConstants, colors } from "../../styleConstants";

export interface BanesAndBoonsStyle extends StyleDeclaration {
  banesAndBoonsContainer: React.CSSProperties;
  outerContainer: React.CSSProperties;
  summaryContainer: React.CSSProperties;
  boonsInnerWrapper: React.CSSProperties;
  banesInnerWrapper: React.CSSProperties;
  boonsHeader: React.CSSProperties;
  banesHeader: React.CSSProperties;
  boonsContainer: React.CSSProperties;
  banesContainer: React.CSSProperties;
  boonTitle: React.CSSProperties;
  baneTitle: React.CSSProperties;
  pointsContainer: React.CSSProperties;
  pointsBarContainer: React.CSSProperties;
  totalPointsText: React.CSSProperties;
  tooManyTraitsText: React.CSSProperties;
  pointsMeter: React.CSSProperties;
  balanceBar: React.CSSProperties;
  dropZoneContainer: React.CSSProperties;
  addedBoonContainer: React.CSSProperties;
  addedBaneContainer: React.CSSProperties;
  addBoon: React.CSSProperties;
  addBane: React.CSSProperties;
  addTraitImage: React.CSSProperties;
  emptyAddBoon: React.CSSProperties;
  emptyAddBane: React.CSSProperties;
  innerSummaryWrapper: React.CSSProperties;
  addedBoonSummaryWrapper: React.CSSProperties;
  addedBaneSummaryWrapper: React.CSSProperties;
  resetButtonsContainer: React.CSSProperties;
  boonResetButton: React.CSSProperties;
  baneResetButton: React.CSSProperties;
  resetAlertOverlay: React.CSSProperties;
  resetAlertDialog: React.CSSProperties;
  resetAlertDialogText: React.CSSProperties;
  alertPrimaryText: React.CSSProperties;
  resetAlertButtonContainer: React.CSSProperties;
  alertButton: React.CSSProperties;
  resetAlertButton: React.CSSProperties;
  rangePointsText: React.CSSProperties;
}

export interface BanesAndBoonsProps {
  generalBoons: TraitIdMap;
  playerClassBoons: TraitIdMap;
  raceBoons: TraitIdMap;
  factionBoons: TraitIdMap;
  generalBanes: TraitIdMap;
  playerClassBanes: TraitIdMap;
  raceBanes: TraitIdMap;
  factionBanes: TraitIdMap;
  traits: TraitMap;
  addedBanes: TraitIdMap;
  addedBoons: TraitIdMap;
  allPrerequisites: TraitIdMap;
  allExclusives: TraitIdMap;
  onBoonClick: Function;
  onBaneClick: Function;
  onCancelBoonClick: Function;
  onCancelBaneClick: Function;
  onResetClick: Function;
  onSelectRankBoon: Function;
  onSelectRankBane: Function;
  onCancelRankBoon: Function;
  onCancelRankBane: Function;
  totalPoints: number;
  styles: Partial<BanesAndBoonsStyle>;
  traitSummaryStyles: Partial<TraitSummaryStyle>;
  baneStyles: Partial<TraitStyle>;
  boonStyles: Partial<TraitStyle>;
  minPoints: number;
  maxPoints: number;
}

export interface BanesAndBoonsState {
  flexOfBoonBar: number;
  flexOfBaneBar: number;
  showResetBoonAlertDialog: boolean;
  showResetBaneAlertDialog: boolean;
}

export const defaultBanesAndBoonsStyles: BanesAndBoonsStyle = {
  banesAndBoonsContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(49,49,49,0.3)'
  },

  outerContainer: {
    flex: 1,
    flexDirection: 'column',
    paddingBottom: '15px',
    backgroundColor: colors.transparentBg,
    border: `1px solid ${colors.lightGray}`,
    overflow: 'visible'
  },

  summaryContainer: {
    width: '48vw',
    padding: '0 15px'
  },

  boonsInnerWrapper: {
    flex: 1,
    height: '50vh',
    width: '24vw',
    display: 'flex',
    flexDirection: 'column',
    overflowY: 'auto',
    paddingTop: '15px',
    paddingLeft: '15px',
    paddingRight: '15px',
    borderBottom: '1px solid #454545',
    borderTop: '1px solid #454545',
    '::-webkit-scrollbar': {
      width: '8px',
      borderRadius: '2px',
      backroundColor: 'rgba(0,0,0,0.5)'
    }
  },

  banesInnerWrapper: {
    flex: 1,
    height: '50vh',
    width: '24vw',
    display: 'flex',
    flexDirection: 'column',
    overflowY: 'auto',
    paddingTop: '15px',
    paddingLeft: '15px',
    paddingRight: '15px',
    borderBottom: '1px solid #454545',
    borderTop: '1px solid #454545',
    '::-webkit-scrollbar': {
      width: '8px',
      borderRadius: '2px',
      backgroundColor: 'rgba(0,0,0,0.5)'
    },
    ...styleConstants.alignItems.flexEnd,
  },

  banesHeader: {
    fontSize: '1.7em',
    marginTop: '10px',
    marginBottom: '10px',
    ...styleConstants.marginRight,
    ...styleConstants.textAlign.right
  },

  boonsHeader: {
    fontSize: '1.7em',
    marginTop: '10px',
    marginBottom: '10px',
    ...styleConstants.marginLeft
  },

  boonTitle: {
    fontSize: '20px',
    color: '#727272',
  },

  baneTitle: {
    fontSize: '20px',
    color: '#727272',
    ...styleConstants.textAlign.right,
    ...styleConstants.alignItems.flexEnd
  },

  boonsContainer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap'
  },

  banesContainer: {
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-end'
  },

  pointsContainer: {
    display: 'flex',
    flexDirection: 'column'
  },

  tooManyTraitsText: {
    fontSize: '24px',
    textAlign: 'center',
    margin: 0
  },

  totalPointsText: {
    fontSize: '1em',
    textAlign: 'center',
    marginTop: 0,
    marginBottom: '-28px'
  },

  pointsMeter: {
    display: 'flex',
    height: '20px',
    marginTop: '10px',
    marginBottom: '2px'
  },

  pointsBarContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between'
  },

  balanceBar: {
    transition: 'flex 0.5s, background-color 0.5s'
  },

  dropZoneContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '10px 10px 0 10px',
    backgroundColor: colors.transparentBg,
    minHeight: '47px',
    maxHeight: '10vh',
    overflow: 'auto',
    '::-webkit-scrollbar': {
      width: '5px',
      borderRadius: '2px'
    }
  },

  addedBoonContainer: {
    flex: 1,
    display: 'flex',
    alignItems: 'center',
    flexWrap: 'wrap'
  },

  addedBaneContainer: {
    flex: 1,
    display: 'flex',
    alignItems: 'center',
    flexWrap: 'wrap',
    ...styleConstants.direction.rtl
  },

  addBoon: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    width: '35px',
    height: '35px',
    marginBottom: '10px',
    border: '1px solid #ccc',
    backgroundColor: 'white',
    ...styleConstants.marginRight
  },

  addBane: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    width: '35px',
    height: '35px',
    marginBottom: '10px',
    border: '1px solid #ccc',
    backgroundColor: 'white',
    ...styleConstants.marginLeft
  },

  addTraitImage: {
    flexShrink: 0,
    width: '55px',
    height: '55px'
  },

  emptyAddBoon: {
    width: '35px',
    height: '35px',
    marginBottom: '10px',
    border: '1px solid #ccc',
    ...styleConstants.marginRight
  },

  emptyAddBane: {
    width: '35px',
    height: '35px',
    marginBottom: '10px',
    border: '1px solid #ccc',
    ...styleConstants.marginLeft
  },

  innerSummaryWrapper: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    height: '47.5vh',
    backgroundColor: colors.transparentBg,
    overflow: 'auto',
    '::-webkit-scrollbar': {
      width: '5px',
      borderRadius: '2px'
    }
  },

  addedBoonSummaryWrapper: {
    flex: 1,
    ...styleConstants.marginLeft
  },

  addedBaneSummaryWrapper: {
    flex: 1
  },

  resetButtonsContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '15px'
  },

  boonResetButton: {
    cursor: 'pointer',
    fontSize: '1em',
    transition: 'color 0.3s',
    textAlign: 'center',
    color: colors.boonPrimary,
    margin: 0,
    ':hover': {
      color: colors.transparentBoon
    }
  },

  baneResetButton: {
    cursor: 'pointer',
    fontSize: '1em',
    transition: 'color 0.3s',
    textAlign: 'center',
    color: colors.banePrimary,
    margin: 0,
    ':hover': {
      color: colors.transparentBane
    }
  },

  resetAlertOverlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.7)',
    transition: 'opacity 0.3s',
    zIndex: 10
  },

  resetAlertDialog: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'space-around',
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    margin: 'auto',
    backgroundColor: '#fff',
    padding: '15px',
    width: '300px',
    height: '200px',
    zIndex: 11,
    transition: 'opacity 0.3s',
    borderRadius: '7px'
  },

  resetAlertDialogText: {
    color: '#858585'
  },

  alertPrimaryText: {
    fontSize: '1.6em',
    fontWeight: 'bold',
    ...styleConstants.marginZero
  },

  resetAlertButtonContainer: {
    display: 'flex',
    alignItems: 'center'
  },

  alertButton: {
    cursor: 'pointer',
    padding: '5px 10px',
    backgroundColor: '#ccc',
    color: '#444',
    transition: 'background-color 0.1s',
    ':active': {
      boxShadow: 'inset 0 0 8px rgba(0,0,0,0.3)'
    },
    ':hover': {
      backgroundColor: '#bfbfbf'
    }
  },

  resetAlertButton: {
    cursor: 'pointer',
    padding: '5px 10px',
    backgroundColor: colors.banePrimary,
    color: 'white',
    transition: 'background-color 0.1s',
    ...styleConstants.marginLeft,
    ':active': {
      boxShadow: 'inset 0 0 8px rgba(0,0,0,0.3)'
    },
    ':hover': {
      backgroundColor: '#bf4333'
    }
  },

  rangePointsText: {
    margin: 0,
    fontSize: '1em',
    color: '#eee'
  }
};

class BanesAndBoons extends React.Component<BanesAndBoonsProps, BanesAndBoonsState> {
  constructor(props: BanesAndBoonsProps) {
    super(props);
    this.state = {
      flexOfBoonBar: 1,
      flexOfBaneBar: 1,
      showResetBoonAlertDialog: false,
      showResetBaneAlertDialog: false
    }
  }

  private componentDidMount() {
    const { totalPoints } = this.props;
    const shouldAffectBoonBar = totalPoints * -1 < 0;
    const shouldAffectBaneBar = totalPoints * -1 > 0;
    if (shouldAffectBoonBar) {
      this.setState(Object.assign({}, this.state, { flexOfBoonBar: totalPoints + 0.5, flexOfBaneBar: 1 }));
    }
    if (shouldAffectBaneBar) {
      this.setState(Object.assign({}, this.state, { flexOfBaneBar: (totalPoints * -1) + 0.5, flexOfBoonBar: 1 }));
    }
    if (totalPoints === 0) {
      events.fire('play-sound', 'success');
      this.setState(Object.assign({}, this.state, { flexOfBaneBar: 1, flexOfBoonBar: 1 }));
    }
  }

  private componentWillUpdate(nextProps: BanesAndBoonsProps) {
    if (nextProps.totalPoints != this.props.totalPoints) {
      const shouldAffectBoonBar = nextProps.totalPoints * -1 < 0;
      const shouldAffectBaneBar = nextProps.totalPoints * -1 > 0;
      if (shouldAffectBoonBar) {
        this.setState(Object.assign({}, this.state, { flexOfBoonBar: nextProps.totalPoints + 0.5, flexOfBaneBar: 1 }));
      }
      if (shouldAffectBaneBar) {
        this.setState(Object.assign({}, this.state, { flexOfBaneBar: (nextProps.totalPoints * -1) + 0.5, flexOfBoonBar: 1 }));
      }
      if (nextProps.totalPoints === 0) {
        events.fire('play-sound', 'success');
        this.setState(Object.assign({}, this.state, { flexOfBaneBar: 1, flexOfBoonBar: 1 }));
      }
    }
  };

  private onResetClick = (initType: 'banes' | 'boons' | 'both') => {
    setTimeout(() => this.props.onResetClick(initType), 100);
    events.fire('play-sound', 'reset-traits');
    this.setState(Object.assign({}, this.state, { showResetBoonAlertDialog: false, showResetBaneAlertDialog: false }))
  };

  render() {
    const {
      traits,
      generalBoons,
      playerClassBoons,
      raceBoons,
      factionBoons,
      generalBanes,
      playerClassBanes,
      raceBanes,
      factionBanes,
      addedBoons,
      addedBanes,
      allPrerequisites,
      allExclusives,
      onBoonClick,
      onBaneClick,
      onCancelBoonClick,
      onCancelBaneClick,
      totalPoints,
      onSelectRankBoon,
      onSelectRankBane,
      onCancelRankBoon,
      onCancelRankBane,
      styles,
      boonStyles,
      baneStyles,
      traitSummaryStyles,
      maxPoints,
      minPoints
    } = this.props;
    const {
      flexOfBoonBar,
      flexOfBaneBar,
      showResetBaneAlertDialog,
      showResetBoonAlertDialog
    } = this.state;
    const ss = StyleSheet.create(defaultBanesAndBoonsStyles);
    const custom = StyleSheet.create(styles || {});
    const allBoons = [
      ...Object.keys(playerClassBoons).map((id: string) => traits[id]),
      ...Object.keys(raceBoons).map((id: string) => traits[id]),
      ...Object.keys(factionBoons).map((id: string) => traits[id]),
      ...Object.keys(generalBoons).map((id: string) => traits[id])
    ]
    const allBanes = [
      ...Object.keys(playerClassBanes).map((id: string) => traits[id]),
      ...Object.keys(raceBanes).map((id: string) => traits[id]),
      ...Object.keys(factionBanes).map((id: string) => traits[id]),
      ...Object.keys(generalBanes).map((id: string) => traits[id])
    ]
    const boonPoints = Object.keys(addedBoons).length > 0 && Object.keys(addedBoons).map((id: string) =>
      traits[id].points).reduce((a, b) => a + b) || 0;
    const banePoints = Object.keys(addedBanes).length > 0 && Object.keys(addedBanes).map((id: string) =>
      traits[id].points * -1).reduce((a, b) => a + b) || 0;
    return (
      <div className={css(ss.banesAndBoonsContainer, custom.banesAndBoonsContainer)}>
        <div className={css(ss.outerContainer, custom.outerContainer)}>
          <p className={css(ss.boonsHeader, custom.boonsHeader)} style={{ color: colors.boonPrimary }}>Boons</p>
          
          <div className={css(ss.boonsInnerWrapper, custom.boonsInnerWrapper)}>
            <div className={css(ss.boonsContainer, custom.boonsContainer)}>
              {allBoons.map((trait: BanesAndBoonsInfo, index: number) => {
                return (
                  <Boon
                    key={index}
                    traits={traits}
                    trait={trait}
                    onBoonClick={onBoonClick}
                    onCancelBoon={onCancelBoonClick}
                    allPrerequisites={allPrerequisites}
                    allExclusives={allExclusives}
                    addedBoons={addedBoons}
                    onSelectRankBoon={onSelectRankBoon}
                    onCancelRankBoon={onCancelRankBoon}
                    styles={boonStyles}
                  />
                )
              })}
            </div>
          </div>
        </div>
        <div className={css(ss.summaryContainer, custom.summaryContainer)}>
          <div>
            <div className={css(ss.pointsContainer, custom.pointsContainer)}>
              <div className={css(ss.pointsBarContainer, custom.pointsBarContainer)}>
                <p className={css(ss.totalPointsText, custom.totalPointsText)}
                   style={{ color: colors.boonPrimary, marginTop: 0, marginBottom: '-5px' }}>
                  {boonPoints}
                </p>
                <Tooltip
                  styles={{
                    tooltip: {
                      backgroundColor: 'rgba(0,0,0,0.9)',
                      maxWidth: '200px',
                      ...styleConstants.direction.ltr
                    }
                  }}
                  content={() => (
                    <p>
                      {
                        banePoints + boonPoints < minPoints ? `A minimumn of ${minPoints} points spent in both Banes and Boons
                        is required. Current value: ${banePoints + boonPoints}` :
                        banePoints + boonPoints > maxPoints ? `The maximumn number of points spent in both Banes and Boons is
                        ${maxPoints}. Current value: ${banePoints + boonPoints}` :
                        totalPoints > 0 ? `The value of Banes, ${banePoints}, must equal the value of Boons, ${boonPoints}` :
                        totalPoints < 0 ? `The value of Boons, ${boonPoints}, must equal the value of Boons, ${banePoints}` :
                        'Balanced'
                      }
                    </p>
                )}>
                  <p className={css(ss.tooManyTraitsText, custom.tooManyTraitsText)}
                    style={{ color: totalPoints > 0 ? colors.boonPrimary : totalPoints < 0 ||
                    banePoints + boonPoints < minPoints || banePoints + boonPoints > maxPoints ?
                    colors.banePrimary : colors.success }}>
                    {
                      banePoints + boonPoints < minPoints ? 'Too few Banes and Boons' :
                      banePoints + boonPoints > maxPoints ? 'Too many Banes and Boons' :
                      totalPoints > 0 ? 'Not enough Banes' :
                      totalPoints < 0 ? 'Not enough Boons' :
                      'Balanced'
                    }
                  </p>
                </Tooltip>
                <p className={css(ss.totalPointsText, custom.totalPointsText)}
                   style={{ color: colors.banePrimary }}>
                  {banePoints}
                </p>
              </div>
              <div className={css(ss.pointsMeter, custom.pointsMeter)}>
                <div className={css(ss.balanceBar, custom.balanceBar)}
                  style={{ flex: flexOfBoonBar, backgroundColor: totalPoints !== 0 || banePoints + boonPoints < minPoints ||
                  banePoints + boonPoints > maxPoints ? colors.boonPrimary : colors.success }}
                />
                <div className={css(ss.balanceBar, custom.balanceBar)}
                  style={{ flex: flexOfBaneBar, backgroundColor: totalPoints !== 0 || banePoints + boonPoints < minPoints ||
                  banePoints + boonPoints > maxPoints ? colors.banePrimary : colors.success }}
                />
              </div>
              <div className={css(ss.resetButtonsContainer)}>
                <div className={css(ss.boonResetButton, custom.boonResetButton)}
                   onClick={() => {
                     events.fire('play-sound', 'select');
                     this.setState(Object.assign({}, this.state, { showResetBoonAlertDialog: true }))
                   }}>Reset boons</div>
                   <p className={css(ss.rangePointsText, custom.rangePointsText)}>Minimum Points: {minPoints}</p>
                   <p className={css(ss.rangePointsText, custom.rangePointsText)}>Maximum Points: {maxPoints}</p>
                <div className={css(ss.baneResetButton, custom.baneResetButton)}
                    onClick={() => {
                     events.fire('play-sound', 'select');
                     this.setState(Object.assign({}, this.state, { showResetBaneAlertDialog: true }))
                   }}>Reset banes</div>
              </div>
            </div>
            {/*<div className={css(ss.dropZoneContainer, custom.dropZoneContainer)}>
              <div className={css(ss.addedBoonContainer, custom.addedBoonContainer)}>
                {Object.keys(addedBoons).map((key: string, index: number) => (
                  <div className={css(ss.addBoon, custom.addBoon)} key={index}>
                    <img className={css(ss.addTraitImage, custom.addTraitImage)} src={traits[key].icon} />
                  </div>
                ))}
              </div>
              <div className={css(ss.addedBaneContainer, custom.addedBaneContainer)}>
                {Object.keys(addedBanes).map((key: string, index: number) => (
                  <div className={css(ss.addBane, custom.addBane)} key={index}>
                    <img className={css(ss.addTraitImage, custom.addTraitImage)} src={traits[key].icon} />
                  </div>
                ))}
              </div>
            </div>*/}
          </div>
          <div>
            <div className={css(ss.innerSummaryWrapper, custom.innerSummaryWrapper)}>
              <div className={css(ss.addedBoonSummaryWrapper, custom.addedBoonSummaryWrapper)}>
                {Object.keys(addedBoons).slice(0).reverse().map((key: string, index: number) => (
                  <TraitSummary
                    key={index}
                    trait={traits[key]}
                    onCancelClick={onCancelBoonClick}
                    onCancelRankTrait={onCancelRankBoon}
                    type='Boon'
                    styles={traitSummaryStyles}
                  />
                ))}
              </div>
              <div className={css(ss.addedBaneSummaryWrapper, custom.addedBaneSummaryWrapper)}>
                {Object.keys(addedBanes).slice(0).reverse().map((key: string, index: number) => (
                  <TraitSummary
                    key={index}
                    trait={traits[key]}
                    onCancelClick={onCancelBaneClick}
                    onCancelRankTrait={onCancelRankBoon}
                    type='Bane'
                    styles={traitSummaryStyles}
                  />
                ))}
              </div>
            </div>
            <div className={css(ss.resetAlertOverlay, custom.resetAlertOverlay)}
                 style={{ opacity: showResetBoonAlertDialog || showResetBaneAlertDialog ? 1 : 0,
                 visibility: showResetBoonAlertDialog || showResetBaneAlertDialog ? 'visible' : 'hidden' }} />
            <div className={css(ss.resetAlertDialog, custom.resetAlertDialog)}
                 style={{ opacity: showResetBoonAlertDialog || showResetBaneAlertDialog ? 1 : 0,
                  visibility: showResetBoonAlertDialog || showResetBaneAlertDialog ? 'visible' : 'hidden' }}>
              <p className={css(ss.resetAlertDialogText, ss.alertPrimaryText, custom.resetAlertDialogText, custom.alertPrimaryText)}>Are you sure?</p>
              <p className={css(ss.resetAlertDialogText, custom.resetAlertDialogText)}>
                Are you sure you want to reset all {showResetBoonAlertDialog && 'Boons'}{showResetBaneAlertDialog && 'Banes'}?
              </p>
              <div className={css(ss.resetAlertButtonContainer, custom.resetAlertButtonContainer)}>
                <div className={css(ss.alertButton, custom.alertButton)}
                     onClick={() => {
                       events.fire('play-sound', 'select');
                       this.setState(Object.assign({}, this.state, { showResetBoonAlertDialog: false, showResetBaneAlertDialog: false }))
                     }}>
                  Cancel
                </div>
                <div className={css(ss.resetAlertButton, custom.resetAlertButton)}
                     onClick={() => this.onResetClick(showResetBaneAlertDialog ? 'banes' : 'boons')}>
                  Yes, reset!
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className={css(ss.outerContainer, custom.outerContainer)}>
          <p className={css(ss.banesHeader, custom.banesHeader)} style={{ color: colors.banePrimary }}>Banes</p>
          <div className={css(ss.banesInnerWrapper, custom.banesInnerWrapper)}>
            <div className={css(ss.banesContainer, custom.banesContainer)}>
              {allBanes.map((trait: BanesAndBoonsInfo, index: number) => {
                return (
                  <Bane
                    key={index}
                    traits={traits}
                    trait={trait}
                    onBaneClick={onBaneClick}
                    onCancelBane={onCancelBaneClick}
                    allPrerequisites={allPrerequisites}
                    allExclusives={allExclusives}
                    addedBanes={addedBanes}
                    onSelectRankBane={onSelectRankBane}
                    onCancelRankBane={onCancelRankBane}
                    styles={baneStyles}
                  />
                )
              })}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default BanesAndBoons;
