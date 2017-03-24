import * as React from 'react';
import * as ReactDOM from 'react-dom';
import * as _ from 'lodash';
import { client, Tooltip, RaisedButton } from 'camelot-unchained';
import { css, StyleSheet, StyleDeclaration } from 'aphrodite';

import { ItemInfo, StackMap, ItemMap, InventoryItemsMap } from '../../../../services/types/inventoryTypes';
import { initializeExpandedItems, CharacterSheetState } from '../../../../services/session/character';
import Item from '../Item';

export interface InventoryStyle extends StyleDeclaration {
  inventoryWrapper: React.CSSProperties;
  inventoryContainer: React.CSSProperties;
  infoContainer: React.CSSProperties;
  filterButtonsContainer: React.CSSProperties;
  filterButton: React.CSSProperties;
  searchContainer: React.CSSProperties;
  searchInput: React.CSSProperties;
  searchIcon: React.CSSProperties;
  expandedSlotContainer: React.CSSProperties;
  createMoreSlotsButton: React.CSSProperties;
}

export const defaultInventoryStyle: InventoryStyle = {
  inventoryWrapper: {
    display: 'flex',
    flexDirection: 'column',
    userSelect: 'none',
  },
  inventoryContainer: {
    display: 'flex',
    flexWrap: 'wrap',
    overflow: 'auto',
  },
  infoContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    color: 'white',
    padding: '25px 15px 15px 15px',
  },
  filterButtonsContainer: {
    display: 'flex',
    alignItems: 'center',
    color: 'white',
  },
  filterButton: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '130px',
    height: '40px',
    marginLeft: '5px',
    color: 'white',
  },
  searchContainer: {
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
    color: '#666',
  },
  searchInput: {
    width: '200px',
  },
  searchIcon: {
    position: 'absolute',
    bottom: '15px',
    right: 5,
  },
  expandedSlotContainer: {
    display: 'flex',
    flex: 1,
    flexWrap: 'wrap',
    padding: '50px',
    border: '3px solid silver',
  },
  createMoreSlotsButton: {
    width: '100%',
    display: 'flex',
    justifyContent: 'center',
  },
};

export interface InventoryProps {
  styles?: Partial<InventoryStyle>;
  dispatch?: any;
  items: InventoryItemsMap;
  stacks: StackMap;
  expandedSlots: { item: ItemInfo, stack: string[] }[];
  expandedId: string;
  inventoryRef: any;
  characterSheetState: CharacterSheetState;
}

export interface InventoryState {
  initial: boolean;
  searchValue: string;
  filters: string[];
  lengthOfItemSlots: number;
}

export interface ItemSlot {
  item: ItemInfo;
  stack: string[];
}

const colors = {
  filterOn: '#c0f6d4',
};

class Inventory extends React.Component<InventoryProps, InventoryState> {

  constructor(props: InventoryProps) {
    super (props);
    this.state = {
      initial: true,
      searchValue: '',
      filters: [],
      lengthOfItemSlots: Object.keys(props.items).length + 300,
    };
  }

  public render() {
    const ss = StyleSheet.create(defaultInventoryStyle);
    const custom = StyleSheet.create(this.props.styles || {});

    const { filters, searchValue, lengthOfItemSlots } = this.state;
    const { stacks, items } = this.props;
    
    const itemSlots: ItemSlot[] = [];
    
    Object.keys(items).forEach((itemType: string) => {
      Object.keys(stacks).sort((a, b) => a.toLowerCase().localeCompare(b.toLowerCase())).forEach((key: string) => {
        const stack = stacks[key];
        const item = items[itemType][stack[0]];
        if (item) itemSlots.push({ item, stack });
        return;
      });
    });
    for (let i = 0; i < lengthOfItemSlots; i++) {
      itemSlots.push({ item: null, stack: null });
    }
    
    return (
      <div className={css(ss.inventoryWrapper, custom.inventoryWrapper)}>
        <div className={css(ss.infoContainer, custom.infoContainer)}>
          <div className={css(ss.filterButtonsContainer, custom.filterButtonsContainer)}>
            Filter by:
            {this.renderFilterButton('Armor', 'Armor')}
            {this.renderFilterButton('Weapon', 'Weapons')}
            {this.renderFilterButton('Arrow', 'Arrows')}
          </div>
          <div className={css(ss.searchContainer, custom.searchContainer)}>
            <input
              className={css(ss.searchInput, custom.searchInput)}
              placeholder='Search'
              onChange={this.onSearchChange}
              value={searchValue}
            />
            <i className={`fa fa-search ${css(ss.searchIcon, custom.searchIcon)}`} aria-hidden='true'></i>
          </div>
        </div>
        <div ref={this.props.inventoryRef} className={css(ss.inventoryContainer, custom.inventoryContainer)}>
          {this.displayItems(ss, custom, itemSlots)}
          <div className={css(ss.createMoreSlotsButton, custom.createMoreSlotsButton)}>
            <RaisedButton
              styles={{
                button: {
                ...defaultInventoryStyle.filterButton,
                width: '170px',
                },
              }}
              onClick={this.createMoreSlots}>
              Create more slots
            </RaisedButton>
          </div>
        </div>
      </div>
    );
  }

  private onSearchChange = (e: any) => {
    this.setState({ searchValue: e.target.value });
  }

  private renderItem = (itemSlot: { item: ItemInfo, stack: string[] },
                        index: number,
                        defaultStyles: InventoryStyle,
                        customStyles: Partial<InventoryStyle>) => {
    const { dispatch, expandedId, characterSheetState } = this.props;
    return (
      <div id={itemSlot.item && itemSlot.item.itemType + '-item'} key={index}>
        <Item
          dispatch={dispatch}
          item={itemSlot.item}
          stack={itemSlot.stack}
          onClick={(item: ItemInfo) => this.onItemClick(item, index)}
          expandedId={expandedId}
          characterSheetState={characterSheetState}
        />
        {itemSlot.item && itemSlot.item.container && this.props.expandedSlots.length > 0 && 
        <div className={css(defaultStyles.expandedSlotContainer, customStyles.expandedSlotContainer)}>
          {this.props.expandedSlots.map((itemSlot, index) => {
            return (
              <Item
                dispatch={dispatch}
                key={index}
                item={itemSlot.item}
                stack={itemSlot.stack}
                onClick={(item: ItemInfo) => this.onItemClick(item, index)}
                expandedId={expandedId}
                characterSheetState={characterSheetState}
              />
            );
          })}
        </div>}
      </div>
    );
  }

  private renderFilterButton = (filterType: string, buttonText: string) => {
    const { filters } = this.state;
    return (
      <div id={filterType + '-filter-type'}>
        <RaisedButton        
          styles={{
            button: {
              ...defaultInventoryStyle.filterButton,
              backgroundColor: filters.indexOf(filterType) > -1 ? '#AAA' : '#666',
              ':hover': {
                backgroundColor: filters.indexOf(filterType) > -1 ? '#AAA' : '#777',
              },
            },
          }}
          onClick={() => this.addFilter(filterType)}>{buttonText}</RaisedButton>
      </div>
    );
  }

  private createMoreSlots = () => {
    this.setState((state, props) => {
      return {
        lengthOfItemSlots: state.lengthOfItemSlots + 50,
      };
    });
  }

  private displayItems = (defaultStyles: InventoryStyle, customStyles: Partial<InventoryStyle>, itemSlots: ItemSlot[]) => {
    const { filters, searchValue } = this.state;

    return filters.length === 0 && searchValue === '' ? itemSlots.map((itemSlot, index) => {
      return this.renderItem(itemSlot, index, defaultStyles, customStyles);
    }) :
    filters.length > 0 && searchValue === '' ? itemSlots.filter(itemSlot =>
      filters.indexOf(itemSlot.item !== null && itemSlot.item.itemType) > -1 || itemSlot.item === null)
        .map((itemSlot, index) => {
        return this.renderItem(itemSlot, index, defaultStyles, customStyles);
    }) :
    itemSlots.filter(itemSlot => itemSlot.item &&
      ((filters.length > 0 ? filters.indexOf(itemSlot.item !== null && itemSlot.item.itemType) > -1 : true)
        && _.includes(itemSlot.item.name.toLowerCase(), searchValue.toLowerCase())) || itemSlot.item === null)
        .map((itemSlot, index) => {
        return this.renderItem(itemSlot, index, defaultStyles, customStyles);
    });
  }

  private onItemClick = (item: ItemInfo, index: number) => {
    if (item.container) {
      this.props.dispatch(initializeExpandedItems({ id: item.id, container: item.container }));
    } else {
      
    }
  }

  private addFilter = (filterType: string) => {
    this.setState((state, props) => {
      const filters = state.filters;
      if (filters.indexOf(filterType) > -1) {
        return { filters: filters.filter(filter => filter !== filterType) };
      } else {
        return { filters: [...filters, filterType] };
      }
    });
  }
}

export default Inventory;
