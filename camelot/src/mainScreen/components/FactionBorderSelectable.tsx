/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as React from 'react';
import { BorderBackground, BorderType, FactionBorder } from './FactionBorder';

const Root = 'HUD-FactionBorderSelectable-Root';

interface State {
  isHovered: boolean;
}

interface ReactProps extends React.HTMLAttributes<HTMLDivElement> {
  isSelected: boolean;
  onSelected: () => void;
  isDisabled?: boolean;
  factionIDOverride?: string;
  background?: BorderBackground;
  cornerButtons?: React.ReactNode[];
  includeTop?: boolean;
  includeLeft?: boolean;
  includeRight?: boolean;
  includeBottom?: boolean;
}

interface InjectedProps {}

type Props = ReactProps & InjectedProps;

export class FactionBorderSelectable extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = { isHovered: false };
  }

  render(): JSX.Element {
    let {
      className,
      children,
      isSelected,
      onSelected,
      onClick,
      onMouseDown,
      onMouseEnter,
      onMouseLeave,
      isDisabled,
      ...otherProps
    } = this.props;

    let type = BorderType.Secondary;
    if (this.state.isHovered) {
      type = BorderType.Primary;
    }
    if (isSelected) {
      type = BorderType.Selected;
    }

    return (
      <FactionBorder
        className={`${Root} ${className}${isDisabled ? ' disabled' : ''}`}
        type={type}
        onMouseDown={this.handleClick.bind(this)}
        onMouseEnter={this.handleMouseEnter.bind(this)}
        onMouseLeave={this.handleMouseLeave.bind(this)}
        small
        {...otherProps}
      >
        {children}
      </FactionBorder>
    );
  }

  private handleClick(e: React.MouseEvent<HTMLDivElement, MouseEvent>): void {
    if (this.props.isDisabled) {
      return;
    }

    this.props.onSelected();
    this.props.onMouseDown?.(e);
    // We do onClick() here because the other mouse handling eats the normal onClick() pathway.
    this.props.onClick?.(e);
  }

  private handleMouseEnter(e: React.MouseEvent<HTMLDivElement, MouseEvent>): void {
    if (this.props.isDisabled) {
      return;
    }

    this.setState({ isHovered: true });
    this.props.onMouseEnter?.(e);
  }

  private handleMouseLeave(e: React.MouseEvent<HTMLDivElement, MouseEvent>): void {
    if (this.props.isDisabled) {
      return;
    }

    this.setState({ isHovered: false });
    this.props.onMouseLeave?.(e);
  }
}
