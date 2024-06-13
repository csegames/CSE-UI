/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as React from 'react';
import { connect } from 'react-redux';
import { RootState } from '../../redux/store';
import { ResizeDetector } from '../../../shared/components/ResizeDetector';

const Root = 'RadialMenu-Root';
const ButtonContainer = 'RadialMenu-ButtonContainer';
const ButtonNumber = 'RadialMenu-ButtonNumber';
const ButtonContents = 'RadialMenu-ButtonContents';

// SVG Styling
const ButtonOuterRadius = 0.48;
const ButtonInnerRadius = 0.35;
const ButtonGap = 0.025; // Space between arcs.
const ButtonNumberRadius = 0.45;
const ButtonIconRadius = 0.7;

export interface RadialMenuButtonData {
  renderContents: (isHovered: boolean, isSelected: boolean, isDisabled: boolean) => React.ReactNode;
  isSelected?: boolean;
  isDisabled?: boolean;
  styleOverride?: (isHovered: boolean, isSelected: boolean, isDisabled: boolean) => RadialMenuButtonStyle;
}

export interface RadialMenuButtonStyle {
  backgroundColor?: string;
  borderColor?: string;
  borderWidth?: string;
}

interface ReactProps extends React.HTMLAttributes<HTMLDivElement> {
  /** The size of the array determines the number of rendered buttons. */
  buttons: RadialMenuButtonData[];
  /** Central button angle in radians.  Default is zero (button centered on the right side). */
  firstButtonAngle?: number;
  hideButtonNumbers?: boolean;
  overrideHoveredIndex?: number;

  onButtonClicked?: (buttonIndex: number) => void;
  onHoveredIndexChanged?: (hoveredIndex: number) => void;
  renderCenterContent?: () => React.ReactNode;
}

interface State {
  /** [startAngle,centerAngle,endAngle] in radians.  Values between 0 and 2*PI. */
  buttonAngles: [number, number, number][];
  arcPaths: string[];

  size: number; // Width/height of the menu in pixels (for SVG).
  or: number; // Outer radius.
  ir: number; // Inner radius.
  or2: number; // Outer radius squared.
  ir2: number; // Inner radius squared.
  gap: number; // Size of the gap between buttons.
  x: number; // Position of the Menu on the screen.
  y: number;
  hoveredIndex: number;
}

interface InjectedProps {}

type Props = ReactProps & InjectedProps;

function getRadialMenuButtonAngles(firstAngle: number, numButtons: number): [number, number, number][] {
  // halfArc is half the size (in radians) of a single button's arc.
  const halfArc = Math.PI / numButtons;
  const twoPI = 2 * Math.PI;

  const buttonAngles: [number, number, number][] = [];
  for (let index = 0; index < numButtons; ++index) {
    let centerAngle = firstAngle + (index * twoPI) / numButtons;
    // We want angles between 0 and 2*PI for simplicity later.
    while (centerAngle < 0) centerAngle += twoPI;
    while (centerAngle >= twoPI) centerAngle -= twoPI;

    let startAngle = centerAngle - halfArc;
    while (startAngle < 0) startAngle += twoPI;
    while (startAngle >= twoPI) startAngle -= twoPI;

    let endAngle = centerAngle + halfArc;
    while (endAngle < 0) endAngle += twoPI;
    while (endAngle >= twoPI) endAngle -= twoPI;

    buttonAngles.push([startAngle, centerAngle, endAngle]);
  }

  return buttonAngles;
}

/** Angles must be in radians. */
export function getRadialMenuButtonIndexForAngle(angle: number, firstButtonAngle: number, numButtons: number): number {
  // Guarantee that the angle is between 0 and twoPI
  const twoPI = 2 * Math.PI;
  while (angle < 0) angle += twoPI;
  while (angle >= twoPI) angle -= twoPI;

  let buttonIndex: number = -1;
  const buttonAngles = getRadialMenuButtonAngles(firstButtonAngle, numButtons);
  buttonAngles.forEach(([startAngle, _, endAngle], index) => {
    // If we've already found the answer, just stop.
    if (buttonIndex !== -1) return;

    if (startAngle < endAngle) {
      // Are we between startAngle and endAngle?
      if (angle >= startAngle && angle < endAngle) {
        buttonIndex = index;
      }
    } else {
      // If there is button that straddles the 0 and 2*PI line, this case catches it.
      if (angle >= startAngle || angle < endAngle) {
        buttonIndex = index;
      }
    }
  });

  return buttonIndex;
}

export class ARadialMenu extends React.Component<Props, State> {
  private rootRef: SVGSVGElement;

  constructor(props: Props) {
    super(props);
    // Set a zero state to start because the calculations
    // are based on data from multiple sources.
    const numButtons = props.buttons.length;
    const firstAngle = props.firstButtonAngle ?? 0;
    this.state = {
      buttonAngles: getRadialMenuButtonAngles(firstAngle, numButtons),
      arcPaths: [],
      size: 0, // Zero means we haven't calculated it yet.
      or: 0,
      ir: 0,
      or2: 0,
      ir2: 0,
      gap: 0,
      x: 0,
      y: 0,
      hoveredIndex: props.overrideHoveredIndex ?? -1
    };
  }

  render(): React.ReactNode {
    const { className, children, ...otherProps } = this.props;
    return (
      <div
        className={`${Root} ${className}`}
        {...otherProps}
        onMouseMove={this.onMouseMove.bind(this)}
        onMouseDown={this.onMouseDown.bind(this)}
        onMouseLeave={this.onMouseLeave.bind(this)}
      >
        <ResizeDetector
          onResize={(nw, nh, ow, oh) => {
            this.calculateSizes();
          }}
        />
        {this.renderButtonBackgrounds()}
        {this.renderButtonContents()}
        {children}
      </div>
    );
  }

  private renderButtonBackgrounds(): JSX.Element {
    // SVG to render all of the arc segments.
    return (
      <svg
        className={ButtonContainer}
        ref={(r) => {
          this.rootRef = r;
          this.calculateSizes();
        }}
      >
        {this.state.size > 0
          ? this.state.arcPaths.map((arc, index) => {
              const style = this.getButtonStyle(index);
              return (
                <path
                  stroke={style.borderColor}
                  stroke-width={style.borderWidth}
                  fill={style.backgroundColor}
                  d={arc}
                />
              );
            })
          : null}
      </svg>
    );
  }

  private renderButtonContents(): JSX.Element {
    if (this.state.size <= 0) {
      return null;
    }

    const numberRadius = this.state.or * ButtonNumberRadius;
    const iconRadius = this.state.or * ButtonIconRadius;
    const centerXY = this.state.size / 2;

    return (
      <div className={ButtonContainer}>
        {this.props.buttons.map((data, index) => {
          const angle = this.state.buttonAngles[index][1];
          const isHovered = index === this.state.hoveredIndex;
          return (
            <>
              {this.props.hideButtonNumbers ? null : (
                <div
                  className={`${ButtonNumber} ${data.isDisabled ? 'disabled' : ''}`}
                  style={{
                    top: Math.sin(angle) * numberRadius + centerXY,
                    left: Math.cos(angle) * numberRadius + centerXY
                  }}
                >
                  {index + 1}
                </div>
              )}
              {
                <div
                  className={ButtonContents}
                  style={{
                    top: Math.sin(angle) * iconRadius + centerXY,
                    left: Math.cos(angle) * iconRadius + centerXY
                  }}
                >
                  {data.renderContents(isHovered, data.isSelected, data.isDisabled)}
                </div>
              }
            </>
          );
        })}
      </div>
    );
  }

  private getButtonStyle(index: number): RadialMenuButtonStyle {
    const data = this.props.buttons[index];
    const isHovered = index === this.state.hoveredIndex;

    // Start by calculating the default style for this button state.
    let backgroundColor: string = 'rgba(14,17,36,0.95)';
    if (isHovered) backgroundColor = 'rgba(68,66,162,0.8)';
    if (data.isSelected) backgroundColor = 'rgba(68,66,162,0.95)';

    let borderColor: string = '#4442a2';
    if (isHovered || data.isSelected) borderColor = '#7ecffc';

    let borderWidth: string = '0.4%';
    if (data.isSelected) borderWidth = '2%';

    // Overrides may not include all items.  For instance, you may only want to override backgroundColor.
    const overrides = data.styleOverride?.(isHovered, data.isSelected, data.isDisabled) ?? {};

    const finalStyle: RadialMenuButtonStyle = {
      backgroundColor,
      borderColor,
      borderWidth,
      // Finally, if there is a style override, apply it.
      ...overrides
    };

    return finalStyle;
  }

  componentDidUpdate(prevProps: Readonly<Props>, prevState: Readonly<{}>, snapshot?: any): void {
    // We only have to recalculate layout if the number of buttons changes.
    if (this.props.buttons.length !== prevProps.buttons.length) {
      this.setState(this.calculateArcPaths(this.state.size));
    }

    // If the hoveredIndex has been overridden externally, apply the new value.
    if (this.props.overrideHoveredIndex !== undefined && this.props.overrideHoveredIndex !== this.state.hoveredIndex) {
      this.setState({ hoveredIndex: this.props.overrideHoveredIndex });
    }
  }

  private calculateSizes(): void {
    const top = this.rootRef?.getBoundingClientRect()?.top ?? 0;
    const left = this.rootRef?.getBoundingClientRect()?.left ?? 0;
    if (
      this.rootRef &&
      (this.rootRef.clientWidth !== this.state.size || top !== this.state.y || left !== this.state.x)
    ) {
      const or = this.rootRef.clientWidth * ButtonOuterRadius;
      const ir = or * ButtonInnerRadius;
      const gap = or * ButtonGap;
      this.setState({
        size: this.rootRef.clientWidth,
        or,
        ir,
        or2: or * or,
        ir2: ir * ir,
        gap,
        x: left,
        y: top
      });
      requestAnimationFrame(() => {
        this.calculateArcPaths(this.rootRef.clientWidth);
      });
    }
  }

  private calculateArcPaths(size: number): State {
    if (size <= 0) {
      return;
    }
    const numButtons = this.props.buttons.length;

    // Calculate arcPaths.  These are SVG inputs for four corners.
    const arcPaths: string[] = [];

    const { or, ir, gap } = this.state;
    const centerXY = size / 2;

    // The "angle gap" is how many radians we have to adjust forward or backward from the base angles
    // in order to maintain a gap of the specified size between buttons.
    const outerAngleGap = 2 * Math.asin(gap / 2 / or);
    const innerAngleGap = 2 * Math.asin(gap / 2 / ir);

    for (let i = 0; i < numButtons; ++i) {
      // The start and end angle go through the center of the gap between buttons.
      const endAngle = this.state.buttonAngles[i][0];
      const startAngle = this.state.buttonAngles[i][2];

      const outerStartCornerAngle = startAngle - outerAngleGap;
      const outerEndCornerAngle = endAngle + outerAngleGap;

      const innerStartCornerAngle = startAngle - innerAngleGap;
      const innerEndCornerAngle = endAngle + innerAngleGap;

      const x1 = centerXY + Math.cos(outerStartCornerAngle) * or;
      const y1 = centerXY + Math.sin(outerStartCornerAngle) * or;

      const x2 = centerXY + Math.cos(outerEndCornerAngle) * or;
      const y2 = centerXY + Math.sin(outerEndCornerAngle) * or;

      const x3 = centerXY + Math.cos(innerEndCornerAngle) * ir;
      const y3 = centerXY + Math.sin(innerEndCornerAngle) * ir;

      const x4 = centerXY + Math.cos(innerStartCornerAngle) * ir;
      const y4 = centerXY + Math.sin(innerStartCornerAngle) * ir;

      arcPaths.push(`M${x1} ${y1} A${or},${or} 0 0,0 ${x2} ${y2} L${x3} ${y3} A${ir},${ir} 0 0,1 ${x4} ${y4} Z`);
    }

    this.setState({ arcPaths });
  }

  private onMouseMove(e: React.MouseEvent<HTMLDivElement>): void {
    // Detect if we are hovering an arc segment.
    const x = e.clientX - this.state.x - this.state.size / 2;
    const y = e.clientY - this.state.y - this.state.size / 2;

    const r2 = x * x + y * y;
    const inRing = r2 >= this.state.ir2 && r2 <= this.state.or2;

    if (inRing) {
      // In radians.
      let angle = Math.atan2(y, x);

      const hoveredIndex = getRadialMenuButtonIndexForAngle(
        angle,
        this.props.firstButtonAngle ?? 0,
        this.props.buttons.length
      );

      if (this.state.hoveredIndex !== hoveredIndex) {
        this.props.onHoveredIndexChanged?.(hoveredIndex);
        this.setState({ hoveredIndex });
      }
    } else {
      if (this.state.hoveredIndex !== -1) {
        this.props.onHoveredIndexChanged?.(-1);
        this.setState({ hoveredIndex: -1 });
      }
    }
  }

  private onMouseDown(e: React.MouseEvent<HTMLDivElement>): void {
    // If they clicked on a button, send it out via the callback.
    if (this.state.hoveredIndex !== -1) {
      this.props.onButtonClicked?.(this.state.hoveredIndex);
    }
  }

  private onMouseLeave(e: React.MouseEvent<HTMLDivElement>): void {
    if (this.state.hoveredIndex !== -1) {
      this.setState({ hoveredIndex: -1 });
    }
  }
}

function mapStateToProps(state: RootState, ownProps: ReactProps): Props {
  return {
    ...ownProps
  };
}

export const RadialMenu = connect(mapStateToProps)(ARadialMenu);
