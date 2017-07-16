import * as React from 'react';
import { StyleSheet, css, StyleDeclaration } from 'aphrodite';

import { InventoryItemFragment } from '../../../../../gqlInterfaces';

export interface PopupMiniventoryStyle extends StyleDeclaration {
  container: React.CSSProperties;
}

export const defaultPopupMiniventoryStyle: PopupMiniventoryStyle = {
  container: {
    
  },
}

export enum Alignment {
  Top = 1 << 0,
  Bottom = 1 << 1,
  Left = 1 << 2,
  Right = 1 << 3,
  TopRight = Alignment.Top | Alignment.Right,
  TopLeft = Alignment.Top | Alignment.Left,
  BottomRight = Alignment.Bottom | Alignment.Right,
  BottomLeft = Alignment.Bottom | Alignment.Left,
};

export interface PopupMiniventoryProps {
  styles?: Partial<PopupMiniventoryStyle>;
  align: Alignment;
  filter: (item: InventoryItemFragment) => boolean;
}

export interface PopupMiniventoryState {
}

export class PopupMiniventory extends React.Component<PopupMiniventoryProps, PopupMiniventoryState> {
  constructor(props: PopupMiniventoryProps) {
    super(props);
    this.state = {
    };
  }

  render() {
    const ss = StyleSheet.create(defaultPopupMiniventoryStyle);
    const custom = StyleSheet.create(this.props.styles || {});
    return (
      <div className={css(ss.container, custom.container)}>
        MINIVENTORY
      </div>
    );
  }
}

export default PopupMiniventory;
