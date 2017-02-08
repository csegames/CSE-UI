/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 * @Author: Andrew L. Jackson (jacksonal300@gmail.com)
 * @Date: 2017-03-03 16:12:15
 * @Last Modified by: Andrew L. Jackson (jacksonal300@gmail.com)
 * @Last Modified time: 2017-03-03 16:19:16
 */

import * as React from 'react';
import { StyleSheet, css, StyleDeclaration } from 'aphrodite';
import { BanesAndBoonsInfo, TraitMap, TraitIdMap } from '../../services/session/banesAndBoons';
import Bane from './Bane';
import Boon from './Boon';
import { TraitStyle } from './Trait';
import TraitSummary, { TraitSummaryStyle } from './TraitSummary';
import { events } from 'camelot-unchained';
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
  totalPointsText: React.CSSProperties;
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
  summaryTitle: React.CSSProperties;
  resetButton: React.CSSProperties;
  summaryHeaderContainer: React.CSSProperties;
  resetAlertOverlay: React.CSSProperties;
  resetAlertDialog: React.CSSProperties;
  resetAlertDialogText: React.CSSProperties;
  alertPrimaryText: React.CSSProperties;
  resetAlertButtonContainer: React.CSSProperties;
  alertButton: React.CSSProperties;
  resetAlertButton: React.CSSProperties;
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
}

export interface BanesAndBoonsState {
  flexOfBoonBar: number;
  flexOfBaneBar: number;
  showResetAlertDialog: boolean;
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
    height: '55vh',
    width: '26vw',
    display: 'flex',
    flexDirection: 'column',
    overflowY: 'auto',
    paddingLeft: '15px',
    paddingRight: '15px',
    '::-webkit-scrollbar': {
      width: '5px',
      borderRadius: '2px'
    }
  },

  banesInnerWrapper: {
    flex: 1,
    height: '55vh',
    width: '26vw',
    display: 'flex',
    flexDirection: 'column',
    overflowY: 'auto',
    paddingLeft: '15px',
    paddingRight: '15px',
    '::-webkit-scrollbar': {
      width: '5px',
      borderRadius: '2px'
    },
    ...styleConstants.alignItems.flexEnd,
  },

  banesHeader: {
    fontSize: '1.4em',
    ...styleConstants.marginRight,
    ...styleConstants.textAlign.right
  },

  boonsHeader: {
    fontSize: '1.4em',
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
    alignItems: 'center',
    flexWrap: 'wrap',
    ...styleConstants.alignItems.flexEnd
  },

  pointsContainer: {
    display: 'flex',
    flexDirection: 'column'
  },

  totalPointsText: {
    fontSize: '24px',
    alignSelf: 'stretch',
    textAlign: 'center',
    ...styleConstants.marginZero
  },

  pointsMeter: {
    display: 'flex',
    height: '20px',
    marginTop: '15px',
    marginBottom: '15px'
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
    height: '48vh',
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

  summaryTitle: {
    fontSize: '1.2em',
    color: '#727272',
    margin: '10px'
  },

  resetButton: {
    cursor: 'pointer',
    fontSize: '1.2em',
    color: '#727272',
    transition: 'color 0.3s',
    textAlign: 'center',
    ':hover': {
      color: colors.banePrimary
    }
  },

  summaryHeaderContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between'
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
    backgroundColor: colors.banePrimary,
    color: 'white',
    ...styleConstants.marginLeft,
    ':hover': {
      backgroundColor: '#bf4333'
    }
  }
};

class BanesAndBoons extends React.Component<BanesAndBoonsProps, BanesAndBoonsState> {
  constructor(props: BanesAndBoonsProps) {
    super(props);
    this.state = {
      flexOfBoonBar: 1,
      flexOfBaneBar: 1,
      showResetAlertDialog: false
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

  private onResetClick = () => {
    setTimeout(() => this.props.onResetClick(), 100);
    this.setState(Object.assign({}, this.state, { showResetAlertDialog: false }))
  };

  private showTraitsSection = (listOfTraits: any, title: string, type: 'boon' | 'bane') => {
    const {
      onBaneClick,
      onBoonClick,
      onCancelBaneClick,
      onCancelBoonClick,
      allPrerequisites,
      allExclusives,
      addedBanes,
      addedBoons,
      onSelectRankBoon,
      onSelectRankBane,
      onCancelRankBoon,
      onCancelRankBane,
      styles,
      boonStyles,
      baneStyles,
      traits
    } = this.props;
    const ss = StyleSheet.create(defaultBanesAndBoonsStyles);
    const custom = StyleSheet.create(styles || {});
    return (
      Object.keys(listOfTraits).length !== 0 &&
      <div>
        <p className={css(type === 'boon' ? ss.boonTitle : ss.baneTitle, type === 'boon' ? custom.boonTitle : custom.baneTitle)}>{title}</p>
        <div className={css(type === 'boon' ? ss.boonsContainer : ss.banesContainer, type === 'boon' ? ss.banesContainer : custom.banesContainer)}>
          {Object.keys(listOfTraits).map((key, index) => (
            type === 'boon' ?
            <Boon
              key={index}
              traits={traits}
              trait={traits[key]}
              onBoonClick={onBoonClick}
              onCancelBoon={onCancelBoonClick}
              allPrerequisites={allPrerequisites}
              allExclusives={allExclusives}
              addedBoons={addedBoons}
              onSelectRankBoon={onSelectRankBoon}
              onCancelRankBoon={onCancelRankBoon}
              styles={boonStyles}
            /> :
              <Bane
                key={index}
                traits={traits}
                trait={traits[key]}
                onBaneClick={onBaneClick}
                onCancelBane={onCancelBaneClick}
                allPrerequisites={allPrerequisites}
                allExclusives={allExclusives}
                addedBanes={addedBanes}
                onSelectRankBane={onSelectRankBane}
                onCancelRankBane={onCancelRankBane}
                styles={baneStyles}
              />
          ))}
        </div>
      </div>
    )
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
      onCancelBoonClick,
      onCancelBaneClick,
      totalPoints,
      onSelectRankBoon,
      onSelectRankBane,
      onCancelRankBoon,
      onCancelRankBane,
      styles,
      traitSummaryStyles
    } = this.props;
    const {
      flexOfBoonBar,
      flexOfBaneBar,
      showResetAlertDialog
    } = this.state;
    const ss = StyleSheet.create(defaultBanesAndBoonsStyles);
    const custom = StyleSheet.create(styles || {});
    return (
      <div className={css(ss.banesAndBoonsContainer, custom.banesAndBoonsContainer)}>
        <div className={css(ss.outerContainer, custom.outerContainer)}>
          <p className={css(ss.boonsHeader, custom.boonsHeader)} style={{ color: colors.boonPrimary }}>Boons</p>
          <div className={css(ss.boonsInnerWrapper, custom.boonsInnerWrapper)}>
            {this.showTraitsSection(generalBoons, 'General', 'boon')}
            {this.showTraitsSection(playerClassBoons, 'Class', 'boon')}
            {this.showTraitsSection(raceBoons, 'Race', 'boon')}
            {this.showTraitsSection(factionBoons, 'Faction', 'boon')}
          </div>
        </div>
        <div className={css(ss.summaryContainer, custom.summaryContainer)}>
          <div>
            <div className={css(ss.pointsContainer, custom.pointsContainer)}>
              <p className={css(ss.totalPointsText, custom.totalPointsText)}
                 style={{ color: totalPoints > 0 ? colors.boonPrimary : totalPoints < 0 ? colors.banePrimary : colors.success }}>
                Total points: {totalPoints}
              </p>
              <div className={css(ss.pointsMeter, custom.pointsMeter)}>
                <div className={css(ss.balanceBar, custom.balanceBar)}
                  style={{ flex: flexOfBoonBar, backgroundColor: totalPoints !== 0 ? colors.boonPrimary : colors.success }}
                />
                <div className={css(ss.balanceBar, custom.balanceBar)}
                  style={{ flex: flexOfBaneBar, backgroundColor: totalPoints !== 0 ? colors.banePrimary : colors.success }}
                />
              </div>
            </div>
            <div className={css(ss.dropZoneContainer, custom.dropZoneContainer)}>
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
            </div>
          </div>
          <div>
            <div className={css(ss.summaryHeaderContainer, custom.summaryHeaderContainer)}>
              <p className={css(ss.summaryTitle, custom.summaryTitle)}>SUMMARY - YOUR CHARACTER</p>
              <div className={css(ss.resetButton, custom.resetButton)}
                   onClick={() => this.setState(Object.assign({}, this.state, { showResetAlertDialog: true }))}>RESET</div>
            </div>
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
                 style={{ opacity: showResetAlertDialog ? 1 : 0, visibility: showResetAlertDialog ? 'visible' : 'hidden' }} />
            <div className={css(ss.resetAlertDialog, custom.resetAlertDialog)}
                 style={{ opacity: showResetAlertDialog ? 1 : 0, visibility: showResetAlertDialog ? 'visible' : 'hidden' }}>
              <p className={css(ss.resetAlertDialogText, ss.alertPrimaryText, custom.resetAlertDialogText, custom.alertPrimaryText)}>Are you sure?</p>
              <p className={css(ss.resetAlertDialogText, custom.resetAlertDialogText)}>Are you sure you want to reset all Banes and Boons?</p>
              <div className={css(ss.resetAlertButtonContainer, custom.resetAlertButtonContainer)}>
                <div className={css(ss.alertButton, custom.alertButton)}
                     onClick={() => this.setState(Object.assign({}, this.state, { showResetAlertDialog: false }))}>
                  Cancel
                </div>
                <div className={css(ss.alertButton, ss.resetAlertButton, custom.alertButton, custom.resetAlertButton)}
                     onClick={this.onResetClick}>
                  Yes, reset!
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className={css(ss.outerContainer, custom.outerContainer)}>
          <p className={css(ss.banesHeader, custom.banesHeader)} style={{ color: colors.banePrimary }}>Banes</p>
          <div className={css(ss.banesInnerWrapper, custom.banesInnerWrapper)}>
            {this.showTraitsSection(generalBanes, 'General', 'bane')}
            {this.showTraitsSection(playerClassBanes, 'Class', 'bane')}
            {this.showTraitsSection(raceBanes, 'Race', 'bane')}
            {this.showTraitsSection(factionBanes, 'Faction', 'bane')}
          </div>
        </div>
      </div>
    );
  }
}

export default BanesAndBoons;
