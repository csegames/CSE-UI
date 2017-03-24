import * as React from 'react';
import * as _ from 'lodash';
import { css, StyleSheet, StyleDeclaration } from 'aphrodite';
import { ItemInfo } from '../../services/types/inventoryTypes';

export const defaultTooltipStyle = {
  tooltip: {
    backgroundColor: 'rgba(0,0,0,0.9)',
    maxWidth: '400px',
    maxHeight: '750px',
  },
};

export interface TooltipContentProps {
  item: ItemInfo;
  instructions?: string;
  styles?: Partial<TooltipContentStyle>;
  slotName?: string;
}

export interface TooltipContentStyle extends StyleDeclaration {
  tooltipContentContainer: React.CSSProperties;
  slotNameText: React.CSSProperties;
  primaryInfo: React.CSSProperties;
  armorInfo: React.CSSProperties;
  statInfo: React.CSSProperties;
  statNumber: React.CSSProperties;
  regularText: React.CSSProperties;
  instructionText: React.CSSProperties;
  itemTitle: React.CSSProperties;
}

export const defaultTooltipContentStyle: TooltipContentStyle = {
  tooltipContentContainer: {
    display: 'flex',
    flexDirection: 'column',
    maxWidth: '400px',
    maxHeight: '750px',
    overflow: 'hidden',
  },
  primaryInfo: {
    display: 'flex',
    flexDirection: 'column',
    flexWrap: 'wrap',
    maxHeight: '50%',
    maxWidth: '100%',
  },
  armorInfo: {
    columnCount: 3,
    webkitColumnCount: 3,
    maxHeight: '50%',
    maxWidth: '100%',
  },
  statInfo: {
    maxHeight: '50%',
    maxWidth: '100%',
  },
  slotNameText: {
    fontSize: '16px',
    color: 'gray',
    margin: 0,
    padding: 0,
  },
  statNumber: {
    display: 'inline',
    color: '#08d922',
    fontSize: '16px',
    margin: 0,
    padding: 0,
  },
  regularText: {
    display: 'inline',
    fontSize: '16px',
    color: 'white',
    margin: 0,
    padding: 0,
  },
  instructionText: {
    display: 'inline',
    fontSize: '16px',
    color: 'yellow',
    marginTop: '10px',
    marginBottom: 0,
    padding: 0,
  },
  itemTitle: {
    fontSize: '22px',
    color: 'orange',
    margin: 0,
    padding: 0,
  },
};

class TooltipContent extends React.Component<TooltipContentProps, {}> {
  public render() {
    const ss = StyleSheet.create(defaultTooltipContentStyle);
    const custom = StyleSheet.create(this.props.styles || {});

    const { item, slotName, instructions } = this.props;
    const stats = item.stats;
  
    return (
      <div className={css(ss.tooltipContentContainer, custom.tooltipContentContainer)}>
        <div className={css(ss.primaryInfo, custom.primaryInfo)}>
          <p className={css(ss.itemTitle, custom.itemTitle)}>{item.name}</p>
          {!slotName && item.gearSlot &&
            <p id='item-slot-name' className={css(ss.slotNameText, custom.slotNameText)}>
              {item.gearSlot.map((slotName) => {
                if (item.gearSlot.indexOf(slotName) !== item.gearSlot.length - 1) {
                  return `${this.prettifySlotName(slotName)}, `;
                }
                return this.prettifySlotName(slotName);
              })}
            </p>
          }
          {slotName &&
            <p id='item-slot-name' className={css(ss.slotNameText, custom.slotNameText)}>
              {this.prettifySlotName(slotName)}
            </p>
          }
          <p className={css(ss.regularText, custom.regularText)}>Resource ID: {item.id}</p>
          {stats && this.renderGeneralStatInfo(ss, custom)}
        </div>
        {stats && stats.armor && this.renderArmorInfo(ss, custom)}
        {stats && stats.weapon && this.renderSpecialStatInfo(ss, custom, 'weapon')}
        {stats && stats.substance && this.renderSpecialStatInfo(ss, custom, 'substance')}
        {stats && stats.alloy && this.renderSpecialStatInfo(ss, custom, 'alloy')}
        {instructions && <p className={css(ss.instructionText, custom.instructionText)}>{instructions}</p>}
      </div>
    );
  }

  private renderGeneralStatInfo = (ss: TooltipContentStyle, custom: Partial<TooltipContentStyle>) => {
    // This is used for the general stat info. e.g. quality, mass, agilityRequirement, etc.
    const stats = this.props.item.stats;
    return (
      Object.keys(stats).map((statType: string, i: number) => {
        if (!_.isObject(stats[statType])) {
          return (
            <p key={i} id={statType} className={css(ss.regularText, custom.regularText)}>
              {this.prettifySlotName(statType)}: {stats[statType]}
            </p>
          );
        }
      })
    );
  }

  private renderSpecialStatInfo = (ss: TooltipContentStyle, custom: Partial<TooltipContentStyle>, statType: string) => {
    // This is used for item stats that have the same UI layout
    const stats = this.props.item.stats;
    return (
      <div className={css(ss.weaponInfo, custom.weaponInfo)}>
        {Object.keys(stats[statType]).map((stat: string, i: number) => {
          if (stats[statType][stat] > 0) {
            return (
              <div key={i} id={stat}>
                <p className={css(ss.statNumber, custom.statNumber)}>+{stats[statType][stat]} </p>
                <p className={css(ss.regularText, custom.regularText)}>{this.prettifySlotName(stat)}</p>
              </div>
            );
          }
        })}
      </div>
    );
  }

  private renderArmorInfo = (ss: TooltipContentStyle, custom: Partial<TooltipContentStyle>) => {
    // Armor has a unique layout so we need a seperate function for armor stat info
    const { item } = this.props;
    const stats = item.stats;
    const addedResistances = {};
    const addedMitigations = {};

    if (stats && stats.armor) {
      item.gearSlot.forEach((slotName: string) => {
        stats.armor[slotName].resistances &&
          Object.keys(stats.armor[slotName].resistances).forEach((resistanceType: string) => {
            const resistance = stats.armor[slotName].resistances[resistanceType];
            if (resistance !== 0) {
              addedResistances[resistanceType] = addedResistances[resistanceType] ?
                addedResistances[resistanceType] + resistance : resistance; 
            }
          });
        stats.armor[slotName].mitigations &&
          Object.keys(stats.armor[slotName].mitigations).forEach((mitigationType: string) => {
            const mitigation = stats.armor[slotName].mitigations[mitigationType];
            if (mitigation !== 0) {
              addedMitigations[mitigationType] = addedMitigations[mitigationType] ?
                addedMitigations[mitigationType] + mitigation : mitigation;
            }
          });
      });
    }

    return (
      <div>
        {!_.isEmpty(addedResistances) && <p className={css(ss.regularText, custom.regularText)}>Resistances:</p>}
        <div className={css(ss.armorInfo, custom.armorInfo)}>
          {
            Object.keys(addedResistances).map((resistanceType: string, i: number) => {
              return <div key={i} id={resistanceType + '-resistance'}>
                <p className={css(ss.statNumber, custom.statNumber)}>
                  +{Math.round(addedResistances[resistanceType] * 100) / 100}&nbsp;
                </p>
                <p className={css(ss.regularText, custom.regularText)}>
                  {resistanceType.charAt(0).toUpperCase()}{resistanceType.substring(1, resistanceType.length)}
                </p>
              </div>;
            })
          }
        </div>
        {!_.isEmpty(addedMitigations) && <p className={css(ss.regularText, custom.regularText)}>Mitigations:</p>}
        <div className={css(ss.armorInfo, custom.armorInfo)}>
          {
            Object.keys(addedMitigations).map((mitigationType: string, i: number) => {
              return <div key={i} id={mitigationType + '-mitigation'}>
                <p className={css(ss.statNumber, custom.statNumber)}>
                  +{Math.round(addedMitigations[mitigationType] * 100) / 100}&nbsp;
                </p>
                <p className={css(ss.regularText, custom.regularText)}>
                  {mitigationType.charAt(0).toUpperCase()}{mitigationType.substring(1, mitigationType.length)}
                </p>
              </div>;
            })
          }
        </div>
      </div>
    );
  }

  private prettifySlotName = (slotName: string) => {
    return slotName.replace(/([A-Z])/g, ' $1').replace(/^./, (str) => { return str.toUpperCase(); });
  }
}

export default TooltipContent;
