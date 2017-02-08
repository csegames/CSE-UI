import * as React from 'react';
import { StyleSheet, css } from 'aphrodite';
import { BanesAndBoonsInfo, AddedBaneOrBoonInfo } from '../widgets/BanesAndBoonsContainer/services/session/banesAndBoons';

export interface BanesAndBoonsProps {
  generalBoons: Array<BanesAndBoonsInfo>,
  realmBoons: Array<BanesAndBoonsInfo>,
  raceBoons: Array<BanesAndBoonsInfo>,
  classBoons: Array<BanesAndBoonsInfo>,
  generalBanes: Array<BanesAndBoonsInfo>,
  realmBanes: Array<BanesAndBoonsInfo>,
  raceBanes: Array<BanesAndBoonsInfo>,
  classBanes: Array<BanesAndBoonsInfo>,
  minPoints: number,
  maxPoints: number,
  addedBanes: Array<AddedBaneOrBoonInfo>,
  addedBoons: Array<AddedBaneOrBoonInfo>,
  onBoonClick: Function,
  onBaneClick: Function
}

export interface BanesAndBoonsState {
  mouseOverBoons: boolean,
  mouseOverBanes: boolean,
  mouseOverSummary: boolean
}

class BanesAndBoons extends React.Component<BanesAndBoonsProps, BanesAndBoonsState> {
  constructor(props: BanesAndBoonsProps) {
    super(props);
    this.state = {
      mouseOverBoons: false,
      mouseOverBanes: false,
      mouseOverSummary: false
    }
  }

  showTraitsSection = (listOfTraits: Array<BanesAndBoonsInfo>, title: string, type: "boon" | "bane") => {
    return (
      listOfTraits.length > 0 &&
      <div>
        <p className={css([ styles.traitTitle, type === 'bane' && styles.textAlignRight ])}>{title}</p>
        <div className={css([ styles.traitsContainer, type === 'bane' && styles.baneTraitsAlignment ])}>
          {listOfTraits.map((trait, index) => (
            <div
              key={index}
              className={css([ styles.trait, type === 'boon' ? styles.marginRight : styles.marginLeft ])}
              onClick={() => type === "boon" ? this.props.onBoonClick(trait) : this.props.onBaneClick(trait)}>
              <img src={trait.icon} />
            </div>
          ))}
        </div>
      </div>
    )
  };

  render() {
    const {
      generalBoons,
      realmBoons,
      raceBoons,
      classBoons,
      generalBanes,
      realmBanes,
      raceBanes,
      classBanes,
      minPoints,
      maxPoints,
      addedBoons,
      addedBanes
    } = this.props;
    const {
      mouseOverBanes,
      mouseOverBoons,
      mouseOverSummary
    } = this.state;
    return (
      <div className={css(styles.banesAndBoonsContainer)}>
        <div className={css(styles.outerContainer)}>
          <p className={css(styles.banesAndBoonsHeader)}>Boons</p>
          <div
            onMouseOver={() => this.setState({ mouseOverBoons: true, mouseOverBanes, mouseOverSummary })}
            onMouseOut={() => this.setState({ mouseOverBoons: false, mouseOverBanes, mouseOverSummary })}
            className={css([ styles.innerWrapper, !mouseOverBoons && styles.overflowHidden ])}>
            {this.showTraitsSection(generalBoons, "General", "boon")}
            {this.showTraitsSection(realmBoons, "Realm", "boon")}
            {this.showTraitsSection(raceBoons, "Race", "boon")}
            {this.showTraitsSection(classBoons, "Class", "boon")}
          </div>
        </div>
        <div className={css(styles.summaryContainer)}>
          <div>
            <div className={css(styles.pointsContainer)}>
              <div className={css(styles.pointsTextContainer)}>
                <p>Minimum points<p>{minPoints}</p></p>
                <p>Maximum points<p>{maxPoints}</p></p>
              </div>
              <div className={css(styles.pointsMeter)}>
                <div className={css(styles.minPoints)} />
                <div className={css(styles.maxPoints)} />
              </div>
              <div className={css(styles.pointsTextContainer)}>
                <p>{addedBoons.filter((item) => !item.empty).length} / 10</p>
                <p>{addedBanes.filter((item) => !item.empty).length} / 10</p>
              </div>
            </div>
            <div className={css(styles.dropZoneContainer)}>
              <div className={css(styles.addedBaneOrBoonContainer)}>
                {addedBoons.map((boon, index) => {
                  if (boon.empty) {
                    return (
                      <div className={css([ styles.emptyTrait, styles.marginRight ])} key={index} />
                    )
                  } else {
                    return (
                      <div key={index}>
                        <img src={boon.icon} />
                      </div>
                    )
                  }
                })}
              </div>
              <div className={css([ styles.addedBaneOrBoonContainer, styles.baneTraitsAlignment ])}>
                {addedBanes.map((bane, index) => {
                  if (bane.empty) {
                    return (
                      <div className={css([ styles.emptyTrait, styles.marginLeft ])} key={index} />
                    )
                  } else {
                    return (
                      <div key={index}>
                        <img src={bane.icon} />
                      </div>
                    )
                  }
                })}
              </div>
            </div>
          </div>
          <div>
            <p>SUMMARY - YOUR CHARACTER</p>
            <div
              onMouseOver={() => this.setState({ mouseOverSummary: true, mouseOverBoons, mouseOverBanes })}
              onMouseOut={() => this.setState({ mouseOverSummary: false, mouseOverBoons, mouseOverBanes })}
              className={css([ styles.innerSummaryWrapper, !mouseOverSummary && styles.overflowHidden ])}>
              <div>
                {addedBoons.map((boon, index) => {
                  return (
                    <div className={css([ styles.addedSummaryContainer, styles.marginRight ])} key={index}>
                      <p>{boon.name}</p>
                      <p>{boon.description}</p>
                    </div>
                  )
                })}
              </div>
              <div>
                {addedBanes.map((bane, index) => {
                  return (
                    <div className={css([ styles.addedSummaryContainer, styles.marginLeft ])} key={index}>
                      <p>{bane.name}</p>
                      <p>{bane.description}</p>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        </div>
        <div className={css(styles.outerContainer)}>
          <p className={css(styles.banesAndBoonsHeader, styles.textAlignRight)}>Banes</p>
          <div
            onMouseOver={() => this.setState({ mouseOverBanes: true, mouseOverBoons, mouseOverSummary })}
            onMouseOut={() => this.setState({ mouseOverBanes: false, mouseOverBoons, mouseOverSummary })}
            className={css([ styles.innerWrapper, styles.banesInnerWrapperAlignment, !mouseOverBanes && styles.overflowHidden ])}>
            {this.showTraitsSection(generalBanes, "General", "bane")}
            {this.showTraitsSection(realmBanes, "Realm", "bane")}
            {this.showTraitsSection(raceBanes, "Race", "bane")}
            {this.showTraitsSection(classBanes, "Class", "bane")}
          </div>
        </div>
      </div>
    );
  }
}

const styles = StyleSheet.create({
  marginLeft: {
    marginLeft: 15
  },
  marginRight: {
    marginRight: 15
  },
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
    paddingBottom: 15
  },
  summaryContainer: {
    width: '48vw'
  },
  innerWrapper: {
    flex: 1,
    height: '55vh',
    width: '26vw',
    display: 'flex',
    flexDirection: 'column',
    overflow: 'auto',
    paddingLeft: 15,
    paddingRight: 15,
    '::-webkit-scrollbar': {
      width: '3px',
      borderRadius: '2px'
    }
  },
  banesInnerWrapperAlignment: {
    alignItems: 'flex-end'
  },
  overflowHidden: {
    overflow: 'hidden',
  },
  banesAndBoonsHeader: {
    fontSize: "24px",
    color: '#1F1F1F',
    marginLeft: 15,
    marginRight: 15
  },
  textAlignRight: {
    textAlign: 'right'
  },
  traitsContainer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap'
  },
  baneTraitsAlignment: {
    justifyContent: 'flex-end'
  },
  trait: {
    width: '55px',
    height: '55px',
    backgroundColor: '#4D4D4D',
    marginBottom: '15px',
    border: '1px solid #636262',
    cursor: 'pointer'
  },
  traitTitle: {
    fontSize: '20px',
    color: '#727272'
  },
  dropZoneContainer: {
    display: 'flex',
    justifyContent: 'space-between'
  },
  pointsContainer: {
    display: 'flex',
    flexDirection: 'column'
  },
  pointsTextContainer: {
    display: 'flex',
    justifyContent: 'space-between'
  },
  pointsMeter: {
    display: 'flex',
    justifyContent: 'center',
    alignSelf: 'stretch'
  },
  minPoints: {

  },
  maxPoints: {

  },
  emptyTrait: {
    width: '35px',
    height: '35px',
    marginBottom: 10,
    backgroundColor: '#313131',
    border: '2px solid #ccc'
  },
  addedBaneOrBoonContainer: {
    display: 'flex',
    alignItems: 'center',
    flexWrap: 'wrap',
    padding: '5px',
    backgroundColor: 'rgba(77,77,77,0.3)'
  },
  innerSummaryWrapper: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    height: '40vh',
    overflow: 'auto',
    '::-webkit-scrollbar': {
      width: '3px',
      borderRadius: '2px'
    }
  },
  addedSummaryContainer: {
    padding: '5px',
    backgroundColor: '#313131',
    marginBottom: '15px'
  }
});

export default BanesAndBoons;
