import * as React from 'react';
import * as _ from 'lodash';
import { Tooltip, ContextMenu, RaisedButton } from 'camelot-unchained';
import { css, StyleSheet, StyleDeclaration } from 'aphrodite';

import { ItemInfo, StackMap } from '../../../../services/types/inventoryTypes';
import {
  CharacterSheetState,
  onFocusPotentialCharacterSlots,
  onDefocusPotentialCharacterSlots,
  onEquipItem,
} from '../../../../services/session/character';
import TooltipContent, { defaultTooltipStyle } from '../../../TooltipContent';

export interface ItemProps {
  item?: ItemInfo;
  stack?: string[];
  styles?: Partial<ItemStyle>;
  dispatch?: any;
  characterSheetState: CharacterSheetState; 
  onClick: (item: ItemInfo) => void;
  expandedId: string;
}

export interface ItemState {
  hideTooltip: boolean;
  hideContextMenu: boolean;
}

export interface ItemStyle extends StyleDeclaration {
  itemContainer: React.CSSProperties;
  itemContainerDragging: React.CSSProperties;
  itemImage: React.CSSProperties;
  itemSlot: React.CSSProperties;
  hitBox: React.CSSProperties;
  expandedHighlight: React.CSSProperties;
  contextMenu: React.CSSProperties;
  stackLength: React.CSSProperties;
}

export const defaultItemStyle: ItemStyle = {
  itemContainer: {
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '60px',
    height: '60px',
    cursor: 'grab',
    margin: '5px',
    userSelect: 'none',
    overflow: 'hidden',
  },
  itemContainerDragging: {
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '50px',
    height: '50px',
    cursor: 'grabbing',
    margin: '0 5px 5px 5px',
    userSelect: 'none',
  },
  itemImage: {
    height: '100%',
    width: '100%',
    objectFit: 'contain',
    ':hover': {
      opacity: 0.7,
    },
  },
  itemSlot: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '60px',
    height: '60px',
    cursor: 'pointer',
    backgroundColor: 'rgba(0,0,0,0.6)',
    boxShadow: 'inset 0 0 5px rgba(0,0,0,0.8)',
    margin: '0 5px 5px 5px',
  },
  hitBox: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
    backgroundColor: 'transparent',
  },
  expandedHighlight: {
    boxShadow: 'inset 0 0 15px rgba(255,255,0,1)',
    position: 'absolute',
    width: '100%',
    height: '100%',
    top: 0,
    left: 0,
    cursor: 'pointer',
  },
  contextMenu: {
    position: 'absolute',
    width: '150px',
    top: 0,
    right: 0,
    zIndex: 10,
  },
  stackLength: {
    position: 'absolute',
    textAlign: 'center',
    bottom: 0,
    right: 0,
    minWidth: '20px',
    height: '20px',
    fontSize: '12px',
    color: 'white',
    backgroundColor: 'rgba(0,0,0,0.7)',
  },
};

class Item extends React.Component<ItemProps, ItemState> {

  private rotate: any;

  constructor(props: ItemProps) {
    super(props);
    this.state = {
      hideTooltip: false,
      hideContextMenu: true,
    };
  }
  public render() {
    const { item, stack, styles, onClick, expandedId, dispatch, characterSheetState } = this.props;
    const { hideTooltip, hideContextMenu } = this.state;
    
    const ss = StyleSheet.create(defaultItemStyle);
    const custom = StyleSheet.create(styles || {});

    if (item) {
      
      return (
        <div>
          <ContextMenu content={(contextMenuProps) => {
              return (
                item.stats && item.stats.armor ? <RaisedButton>
                  <p onClick={() => { this.onEquipItem(); contextMenuProps.close(); }}>Equip item</p>
                </RaisedButton> : null
              );
            }}>
            <Tooltip
              styles={hideTooltip ? {
                tooltip: {
                  display: 'none',
                },
              } : defaultTooltipStyle}
              content={() =>
                <TooltipContent
                  item={item}
                  instructions={item.stats && (item.stats.armor || item.stats.weapon) && 'Double click to equip'}
                />
              }>
              <div id={item.id} onMouseDown={() => item.gearSlot && dispatch(onFocusPotentialCharacterSlots({ item }))}>
                <div
                  className={css(ss.itemContainer, custom.itemContainer)}
                  onContextMenu={this.onToggleContextMenu}
                  onMouseEnter={this.focusCharacterSlots}
                  onMouseLeave={this.defocusCharacterSlots}
                  onDoubleClick={this.onEquipItem}
                  onClick={this.onItemClick}>
                  <img
                    id={item.id}
                    className={css(ss.itemImage, custom.itemImage)}
                    src={item.icon || 'http://camelot-unchained.s3.amazonaws.com/icons/components/120/stone-wall.jpg'}
                  />
                  <div id={item.id} className={css(ss.hitBox, custom.hitBox)} />
                  {stack.length > 1 && <div className={css(ss.stackLength, custom.stackLength)}>{stack.length}</div>}
                  <div className={css(expandedId === item.id && ss.expandedHighlight, custom.expandedHighlight)} />
                </div>
              </div>
            </Tooltip>
          </ContextMenu>
        </div>
      );
    } else {
      return <div id='empty-item' className={css(ss.itemSlot, custom.itemSlot)} />;
    }
  }

  private onItemClick = (e: any) => {
    const { item, dispatch, onClick } = this.props;
    onClick(item);
  }

  private onToggleContextMenu = () => {
    this.setState((state, props) => {
      const { dispatch, item } = props;
      if (state.hideContextMenu) {
        dispatch(onFocusPotentialCharacterSlots({ item }));
        return {
          hideContextMenu: false,
          hideTooltip: true,
        };
      } else {
        dispatch(onDefocusPotentialCharacterSlots());
        return {
          hideContextMenu: true,
          hideTooltip: false,
        };
      }
    });
  }

  private focusCharacterSlots = () => {
    this.rotate = setTimeout(() => {
      const { item, characterSheetState, dispatch } = this.props;
      const shouldDispatchFocusSlots = item.stats && !_.isEqual(item.gearSlot, characterSheetState.potentialCharacterSlots);
      if (shouldDispatchFocusSlots) dispatch(onFocusPotentialCharacterSlots({ item }));
    }, 1000);
  }

  private defocusCharacterSlots = () => {
    const { item, characterSheetState, dispatch } = this.props;
    clearTimeout(this.rotate);
    if (item.stats && characterSheetState.potentialCharacterSlots.length !== 0) dispatch(onDefocusPotentialCharacterSlots());
  }

  private onEquipItem = () => {
    const { item, dispatch } = this.props;
    if (item.stats) {
      dispatch(onEquipItem({ item }));
      this.setState({ hideTooltip: false });
    }
  }
}

export default Item;
