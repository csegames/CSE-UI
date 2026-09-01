/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { Dispatch } from '@reduxjs/toolkit';
import * as React from 'react';
import { connect } from 'react-redux';
import { RootState } from '../redux/store';
import { getFactionData, FactionData } from '../gameData/factionData';
import { FactionTitle } from './FactionTitle';
import { ResizingHandles } from './ResizingHandles';
import { Faction } from '@csegames/library/dist/camelotunchained/graphql/schema';

const Root = 'HUD-FactionBorder-Root';
const StandardBackground = 'HUD-FactionBorder-StandardBackground';
const Border = 'HUD-FactionBorder-Border';
const Corner = 'HUD-FactionBorder-Corner';
const DecorativeBorderRoot = 'HUD-FactionBorder-DecorativeBorderRoot';
const DecorativeCorner = 'HUD-FactionBorder-DecorativeCorner';
const EdgeContainer = 'HUD-FactionBorder-EdgeContainer';
const VerticalBorder = 'HUD-FactionBorder-VerticalBorder';
const HorizontalBorder = 'HUD-FactionBorder-HorizontalBorder';
const CornerButtonsContainer = 'HUD-FactionBorder-CornerButtonsContainer';
const FancyHeaderContainer = 'HUD-FactionBorder-FancyHeaderContainer';
const FancyHeaderBookend = 'HUD-FactionBorder-FancyHeaderBookend';
const FancyHeaderLabel = 'HUD-FactionBorder-FancyHeaderLabel';

export enum BorderType {
  None = 'none',
  Primary = 'primary',
  Secondary = 'secondary',
  Decorative = 'decorative',
  Fancy = 'fancy',
  FancyHeader = 'fancyheader',
  Selected = 'selectableselected'
}

export enum BorderBackground {
  None = 0,
  Bag,
  Black,
  Darken,
  Leather,
  PatternLarge,
  PatternSmall,
  ProgressBar
}

enum BorderCategory {
  None,
  Simple,
  Decorative,
  Fancy
}

enum BorderHeader {
  Normal,
  Fancy
}

interface BorderDef {
  category: BorderCategory;
  header: BorderHeader;
}

interface NoneBorderDef extends BorderDef {
  category: BorderCategory.None;
}

interface BasicBorderDef extends BorderDef {
  defaultCornerSize: string;
  defaultEdgeSize: string;
  tlCornerKey: string;
  trCornerKey: string;
  blCornerKey: string;
  brCornerKey: string;
  boxShadowColorKey?: string;
}

interface SimpleBorderDef extends BasicBorderDef {
  category: BorderCategory.Simple;
}

interface DecorativeBorderDef extends BasicBorderDef {
  category: BorderCategory.Decorative;
  trCornerKeyEmpty: string;
  tEdgeKey: string;
  rEdgeKey: string;
  bEdgeKey: string;
  lEdgeKey: string;
}

interface FancyBorderDef extends BasicBorderDef {
  category: BorderCategory.Fancy;
  tEdgeKey: string;
  rEdgeKey: string;
  bEdgeKey: string;
  lEdgeKey: string;
}

type AnyBorderDef = NoneBorderDef | SimpleBorderDef | DecorativeBorderDef | FancyBorderDef;

const AllBorders: Record<BorderType, AnyBorderDef> = {
  [BorderType.None]: {
    category: BorderCategory.None,
    header: BorderHeader.Normal
  },
  [BorderType.Primary]: {
    category: BorderCategory.Simple,
    header: BorderHeader.Normal,
    defaultCornerSize: '4vmin',
    defaultEdgeSize: '0.2vmin',
    tlCornerKey: 'cornerPrimaryTopLeftImage',
    trCornerKey: 'cornerPrimaryTopRightImage',
    blCornerKey: 'cornerPrimaryBottomLeftImage',
    brCornerKey: 'cornerPrimaryBottomRightImage'
  },
  [BorderType.Secondary]: {
    category: BorderCategory.Simple,
    header: BorderHeader.Normal,
    defaultCornerSize: '2vmin',
    defaultEdgeSize: '0.2vmin',
    tlCornerKey: 'cornerSecondaryTopLeftImage',
    trCornerKey: 'cornerSecondaryTopRightImage',
    blCornerKey: 'cornerSecondaryBottomLeftImage',
    brCornerKey: 'cornerSecondaryBottomRightImage'
  },
  [BorderType.Decorative]: {
    category: BorderCategory.Decorative,
    header: BorderHeader.Normal,
    defaultCornerSize: '5vmin',
    defaultEdgeSize: '5vmin',
    tlCornerKey: 'cornerDecorativeTopLeftImage',
    trCornerKey: 'cornerDecorativeTopRightImage',
    trCornerKeyEmpty: 'cornerDecorativeTopRightEmptyImage',
    blCornerKey: 'cornerDecorativeBottomLeftImage',
    brCornerKey: 'cornerDecorativeBottomRightImage',
    tEdgeKey: 'edgeDecorativeTopImage',
    rEdgeKey: 'edgeDecorativeRightImage',
    bEdgeKey: 'edgeDecorativeBottomImage',
    lEdgeKey: 'edgeDecorativeLeftImage'
  },
  [BorderType.Fancy]: {
    category: BorderCategory.Fancy,
    header: BorderHeader.Normal,
    defaultCornerSize: '20vmin',
    defaultEdgeSize: '5vmin',
    tlCornerKey: 'cornerFancyTopLeftImage',
    trCornerKey: 'cornerFancyTopRightImage',
    blCornerKey: 'cornerFancyBottomLeftImage',
    brCornerKey: 'cornerFancyBottomRightImage',
    tEdgeKey: 'edgeDecorativeTopImage',
    rEdgeKey: 'edgeDecorativeRightImage',
    bEdgeKey: 'edgeDecorativeBottomImage',
    lEdgeKey: 'edgeDecorativeLeftImage'
  },
  [BorderType.FancyHeader]: {
    category: BorderCategory.Fancy,
    header: BorderHeader.Fancy,
    defaultCornerSize: '20vmin',
    defaultEdgeSize: '5vmin',
    tlCornerKey: 'cornerFancyTopLeftHeaderImage',
    trCornerKey: 'cornerFancyTopRightHeaderImage',
    blCornerKey: 'cornerFancyBottomLeftImage',
    brCornerKey: 'cornerFancyBottomRightImage',
    tEdgeKey: 'edgeFancyTopImage',
    rEdgeKey: 'edgeDecorativeRightImage',
    bEdgeKey: 'edgeDecorativeBottomImage',
    lEdgeKey: 'edgeDecorativeLeftImage'
  },
  [BorderType.Selected]: {
    category: BorderCategory.Simple,
    header: BorderHeader.Normal,
    defaultCornerSize: '4vmin',
    defaultEdgeSize: '0.2vmin',
    tlCornerKey: 'cornerPrimaryTopLeftImage',
    trCornerKey: 'cornerPrimaryTopRightImage',
    blCornerKey: 'cornerPrimaryBottomLeftImage',
    brCornerKey: 'cornerPrimaryBottomRightImage',
    boxShadowColorKey: 'selectionGlowColor'
  }
};

interface ReactProps extends React.HTMLAttributes<HTMLDivElement> {
  type: BorderType;
  factionIDOverride?: string;
  cornerSize?: string;
  borderSize?: string;
  includeTop?: boolean;
  includeLeft?: boolean;
  includeRight?: boolean;
  includeBottom?: boolean;
  background?: BorderBackground | string;
  titleText?: string;
  titleCenterOverride?: string;
  cornerButtons?: React.ReactNode[];
  small?: boolean;
  /** If set, <ResizingHandles> will be rendered. */
  resizing?: {
    /** Fires every time the mouse moves while dragging a handle. */
    onSizeChanged: (deltaTop: number, deltaRight: number, deltaBottom: number, deltaLeft: number) => void;
    /** Fires when the mouse button is released to end a resize action. */
    onSizeFinalized: (deltaTop: number, deltaRight: number, deltaBottom: number, deltaLeft: number) => void;
  };
}

interface InjectedProps {
  uiFactionID: string;
  dispatch?: Dispatch;
}

type Props = ReactProps & InjectedProps;

class AFactionBorder extends React.Component<Props> {
  render(): JSX.Element {
    let {
      className,
      children,
      uiFactionID,
      factionIDOverride,
      type,
      includeTop,
      includeLeft,
      includeRight,
      includeBottom,
      background,
      cornerButtons,
      titleText,
      small,
      resizing,
      ...otherProps
    } = this.props;

    background = background ?? BorderBackground.None;

    const def = AllBorders[type];

    const isDecorative = def.category === BorderCategory.Decorative;
    const isFancy = def.category === BorderCategory.Fancy;

    const classNames = [Root];
    if (className) {
      classNames.push(className);
    }
    return (
      <div className={classNames.join(' ')} {...otherProps}>
        {background !== BorderBackground.None && (
          <div className={StandardBackground} style={this.getBackgroundStyle()} />
        )}
        {this.props.children}
        {this.renderBorder()}
        {this.props.cornerButtons && (
          <div
            className={`${CornerButtonsContainer}${small ? ' small' : ''}${isDecorative ? ' decorative' : ''}${
              isFancy ? ' fancy' : ''
            } ${uiFactionID}`}
          >
            {this.props.cornerButtons}
          </div>
        )}
        {titleText && this.renderHeader()}
        {this.renderResizingHandles()}
      </div>
    );
  }

  private getBackgroundStyle(): React.CSSProperties {
    let style: React.CSSProperties = {
      backgroundImage: `url(${
        typeof this.props.background === 'string' ? this.props.background : this.getBackgroundURL(this.props.background)
      })`
    };

    switch (this.props.background) {
      case BorderBackground.Black: {
        style.backgroundImage = undefined;
        style.backgroundColor = 'black';
        break;
      }
      case BorderBackground.Darken: {
        style.backgroundImage = undefined;
        style.backgroundColor = '#00000099';
        break;
      }
      case BorderBackground.ProgressBar: {
        style.backgroundRepeat = 'repeat-x';
        style.backgroundSize = 'contain';
        break;
      }
      default: {
        break;
      }
    }

    return style;
  }

  private renderHeader(): React.ReactNode {
    const factionData = getFactionData(this.props.uiFactionID);
    const def = AllBorders[this.props.type];

    switch (def.header) {
      case BorderHeader.Normal:
        return <FactionTitle>{this.props.titleText}</FactionTitle>;
      case BorderHeader.Fancy:
        const basicDef = def as BasicBorderDef;
        const cornerSize = this.props.cornerSize ?? basicDef.defaultCornerSize;
        const bookendHeight = `calc(${cornerSize} * 0.11)`;
        const titleFontSize = `calc(${cornerSize} * 0.05)`;
        return (
          <div
            className={FancyHeaderContainer}
            style={{
              top: `calc(${cornerSize} * -0.13)`,
              ...(this.props.titleCenterOverride ? { left: this.props.titleCenterOverride } : {})
            }}
          >
            <img
              className={`${FancyHeaderBookend} left`}
              style={{ height: bookendHeight }}
              src={factionData.headerFancyBookendImage}
            />
            <div className={FancyHeaderLabel} style={{ fontSize: titleFontSize }}>
              {this.props.titleText}
            </div>
            <img
              className={FancyHeaderBookend}
              style={{ height: bookendHeight }}
              src={factionData.headerFancyBookendImage}
            />
          </div>
        );
    }
  }

  private getBackgroundURL(background?: BorderBackground): string {
    const factionData = getFactionData(this.props.uiFactionID);
    switch (background) {
      case BorderBackground.None:
      case BorderBackground.Black:
      case BorderBackground.Darken:
        return '';
      case BorderBackground.Bag:
        return factionData.bagBackgroundImage;
      case BorderBackground.Leather:
        return factionData.backgroundLeatherImage;
      case BorderBackground.PatternLarge:
        return factionData.windowBackgroundImage;
      case BorderBackground.PatternSmall:
        return factionData.squareBackgroundImage;
      case BorderBackground.ProgressBar:
        return factionData.backgroundProgressBarImage;
    }
    return '';
  }

  private renderBorder(): React.ReactNode {
    const def = AllBorders[this.props.type];

    switch (def.category) {
      case BorderCategory.None: {
        return null;
      }
      case BorderCategory.Simple: {
        return this.renderSimpleBorder();
      }
      case BorderCategory.Decorative: {
        return this.renderDecorativeBorder();
      }
      case BorderCategory.Fancy: {
        return this.renderFancyBorder();
      }
    }
  }

  private renderSimpleBorder(): React.ReactNode {
    const def = AllBorders[this.props.type] as SimpleBorderDef;
    const factionData = getFactionData(this.props.uiFactionID);

    let { includeTop, includeBottom, includeLeft, includeRight } = this.props;
    includeTop = includeTop ?? true;
    includeLeft = includeLeft ?? true;
    includeRight = includeRight ?? true;
    includeBottom = includeBottom ?? true;
    const borderSize = this.props.borderSize ?? def.defaultEdgeSize;
    const cornerSize = this.props.cornerSize ?? def.defaultCornerSize;

    return (
      <>
        <div
          className={Border}
          style={{
            borderColor: factionData.borderColor,
            borderTopWidth: includeTop ? borderSize : '0px',
            borderBottomWidth: includeBottom ? borderSize : '0px',
            borderLeftWidth: includeLeft ? borderSize : '0px',
            borderRightWidth: includeRight ? borderSize : '0px',
            ...this.getBoxShadowStyle()
          }}
        />
        {includeTop && includeLeft && (
          <img
            style={{
              width: cornerSize,
              height: cornerSize,
              left: `calc(${cornerSize} / -2)`,
              top: `calc(${cornerSize} / -2)`
            }}
            className={Corner}
            src={factionData[def.tlCornerKey as keyof FactionData] as string}
          />
        )}
        {includeTop && includeRight && (
          <img
            style={{
              width: cornerSize,
              height: cornerSize,
              right: `calc(${cornerSize} / -2)`,
              top: `calc(${cornerSize} / -2)`
            }}
            className={Corner}
            src={factionData[def.trCornerKey as keyof FactionData] as string}
          />
        )}
        {includeBottom && includeLeft && (
          <img
            style={{
              width: cornerSize,
              height: cornerSize,
              left: `calc(${cornerSize} / -2)`,
              bottom: `calc(${cornerSize} / -2)`
            }}
            className={Corner}
            src={factionData[def.blCornerKey as keyof FactionData] as string}
          />
        )}
        {includeBottom && includeRight && (
          <img
            style={{
              width: cornerSize,
              height: cornerSize,
              right: `calc(${cornerSize} / -2)`,
              bottom: `calc(${cornerSize} / -2)`
            }}
            className={Corner}
            src={factionData[def.brCornerKey as keyof FactionData] as string}
          />
        )}
      </>
    );
  }

  private renderDecorativeBorder(): React.ReactNode {
    const def = AllBorders[this.props.type] as DecorativeBorderDef;
    const factionData = getFactionData(this.props.uiFactionID);

    let { includeTop, includeBottom, includeLeft, includeRight } = this.props;
    includeTop = includeTop ?? true;
    includeLeft = includeLeft ?? true;
    includeRight = includeRight ?? true;
    includeBottom = includeBottom ?? true;
    const borderSize = this.props.borderSize ?? def.defaultEdgeSize;
    const cornerSize = this.props.cornerSize ?? def.defaultCornerSize;

    const overhangRatio = 0.56;
    const edgeInset = `calc(${cornerSize} * -${overhangRatio})`;

    const cornerStyle: React.CSSProperties = {
      width: cornerSize,
      height: cornerSize
    };

    const cornerAdjustment = ` - ${cornerSize} + 3px`;
    const edgeAdjustment = ` + ${edgeInset}`;
    const verticalCornerAdjustment =
      (includeTop ? cornerAdjustment : edgeAdjustment) + (includeBottom ? cornerAdjustment : edgeAdjustment);
    const verticalEdgeContainerStyle: React.CSSProperties = {
      top: includeTop ? `calc(${cornerSize} - 3px)` : `calc(${cornerSize} * ${overhangRatio})`,
      width: borderSize,
      height: `calc(100%${verticalCornerAdjustment})`
    };

    const horizontalCornerAdjustment =
      (includeLeft ? cornerAdjustment : edgeAdjustment) + (includeRight ? cornerAdjustment : edgeAdjustment);
    const horizontalEdgeContainerStyle: React.CSSProperties = {
      left: includeLeft ? `calc(${cornerSize} - 3px)` : `calc(${cornerSize} * ${overhangRatio})`,
      height: borderSize,
      width: `calc(100%${horizontalCornerAdjustment})`
    };

    const trCornerKey = (this.props.cornerButtons?.length ?? 0) > 0 ? def.trCornerKeyEmpty : def.trCornerKey;

    return (
      <div
        className={DecorativeBorderRoot}
        style={{ top: edgeInset, left: edgeInset, right: edgeInset, bottom: edgeInset }}
      >
        {includeLeft && (
          <>
            {includeTop && (
              <img
                className={DecorativeCorner}
                style={{ ...cornerStyle, top: '0', left: '0' }}
                src={factionData[def.tlCornerKey as keyof FactionData] as string}
              />
            )}
            <div className={EdgeContainer} style={{ ...verticalEdgeContainerStyle, left: '0' }}>
              <div
                className={VerticalBorder}
                style={{
                  backgroundImage: `url(${factionData[def.lEdgeKey as keyof FactionData] as string})`,
                  minHeight: borderSize
                }}
              />
            </div>
            {includeBottom && (
              <img
                className={DecorativeCorner}
                style={{ ...cornerStyle, bottom: '0', left: '0' }}
                src={factionData[def.blCornerKey as keyof FactionData] as string}
              />
            )}
          </>
        )}

        {includeTop && (
          <div className={EdgeContainer} style={{ ...horizontalEdgeContainerStyle, top: '0' }}>
            <div
              className={HorizontalBorder}
              style={{
                backgroundImage: `url(${factionData[def.tEdgeKey as keyof FactionData] as string})`,
                minWidth: borderSize
              }}
            />
          </div>
        )}
        {includeBottom && (
          <div className={EdgeContainer} style={{ ...horizontalEdgeContainerStyle, bottom: '0' }}>
            <div
              className={HorizontalBorder}
              style={{
                backgroundImage: `url(${factionData[def.bEdgeKey as keyof FactionData] as string})`,
                minWidth: borderSize
              }}
            />
          </div>
        )}

        {includeRight && (
          <>
            {includeTop && (
              <img
                className={DecorativeCorner}
                style={{ ...cornerStyle, top: '0', right: '0' }}
                src={factionData[trCornerKey as keyof FactionData] as string}
              />
            )}
            <div className={EdgeContainer} style={{ ...verticalEdgeContainerStyle, right: '0' }}>
              <div
                className={VerticalBorder}
                style={{
                  backgroundImage: `url(${factionData[def.rEdgeKey as keyof FactionData] as string})`,
                  minHeight: borderSize
                }}
              />
            </div>
            {includeBottom && (
              <img
                className={DecorativeCorner}
                style={{ ...cornerStyle, bottom: '0', right: '0' }}
                src={factionData[def.brCornerKey as keyof FactionData] as string}
              />
            )}
          </>
        )}
      </div>
    );
  }

  private renderFancyBorder(): React.ReactNode {
    const def = AllBorders[this.props.type] as FancyBorderDef;
    const factionData = getFactionData(this.props.uiFactionID);

    let { includeTop, includeBottom, includeLeft, includeRight } = this.props;
    includeTop = includeTop ?? true;
    includeLeft = includeLeft ?? true;
    includeRight = includeRight ?? true;
    includeBottom = includeBottom ?? true;
    const borderSize = this.props.borderSize ?? def.defaultEdgeSize;
    const cornerSize = this.props.cornerSize ?? def.defaultCornerSize;

    const edgeInset = `calc(${cornerSize} * -0.39)`;
    const topEdgeInset = `calc(${cornerSize} * -0.51)`;

    const verticalEdgeContainerStyle: React.CSSProperties = {
      top: `calc(${cornerSize} - 3px)`,
      width: borderSize,
      height: `calc(100% - ${cornerSize}*2 + 6px)`
    };

    const horizontalEdgeContainerStyle: React.CSSProperties = {
      left: `calc(${cornerSize} - 3px)`,
      width: `calc(100% - ${cornerSize}*2 + 6px)`
    };

    const cornerStyle: React.CSSProperties = {
      width: cornerSize,
      height: cornerSize
    };

    return (
      <div
        className={DecorativeBorderRoot}
        style={{ top: topEdgeInset, left: edgeInset, right: edgeInset, bottom: edgeInset }}
      >
        {includeLeft && (
          <>
            {includeTop && (
              <img
                className={DecorativeCorner}
                style={{ ...cornerStyle, top: '0', left: '0' }}
                src={factionData[def.tlCornerKey as keyof FactionData] as string}
              />
            )}
            <div
              className={EdgeContainer}
              style={{
                ...verticalEdgeContainerStyle,
                left: `calc(${cornerSize} * 0.255)`
              }}
            >
              <div
                className={VerticalBorder}
                style={{
                  backgroundImage: `url(${factionData[def.lEdgeKey as keyof FactionData] as string})`,
                  minHeight: borderSize
                }}
              />
            </div>
            {includeBottom && (
              <img
                className={DecorativeCorner}
                style={{ ...cornerStyle, bottom: '0', left: '0' }}
                src={factionData[def.blCornerKey as keyof FactionData] as string}
              />
            )}
          </>
        )}

        {includeTop && (
          <div
            className={EdgeContainer}
            style={{
              ...horizontalEdgeContainerStyle,
              top: this.props.type === BorderType.FancyHeader ? 0 : `calc(${cornerSize} * 0.255)`,
              height: this.props.type === BorderType.FancyHeader ? cornerSize : borderSize
            }}
          >
            <div
              className={HorizontalBorder}
              style={{
                backgroundImage: `url(${factionData[def.tEdgeKey as keyof FactionData] as string})`,
                minWidth: borderSize
              }}
            />
          </div>
        )}
        {includeBottom && (
          <div
            className={EdgeContainer}
            style={{
              ...horizontalEdgeContainerStyle,
              height: borderSize,
              bottom: `calc(${cornerSize} * 0.255)`
            }}
          >
            <div
              className={HorizontalBorder}
              style={{
                backgroundImage: `url(${factionData[def.bEdgeKey as keyof FactionData] as string})`,
                minWidth: borderSize
              }}
            />
          </div>
        )}

        {includeRight && (
          <>
            {includeTop && (
              <img
                className={DecorativeCorner}
                style={{ ...cornerStyle, top: '0', right: '0' }}
                src={factionData[def.trCornerKey as keyof FactionData] as string}
              />
            )}
            <div
              className={EdgeContainer}
              style={{
                ...verticalEdgeContainerStyle,
                right: `calc(${cornerSize} * 0.255)`
              }}
            >
              <div
                className={VerticalBorder}
                style={{
                  backgroundImage: `url(${factionData[def.rEdgeKey as keyof FactionData] as string})`,
                  minHeight: borderSize
                }}
              />
            </div>
            {includeBottom && (
              <img
                className={DecorativeCorner}
                style={{ ...cornerStyle, bottom: '0', right: '0' }}
                src={factionData[def.brCornerKey as keyof FactionData] as string}
              />
            )}
          </>
        )}
      </div>
    );
  }

  private getBoxShadowStyle(): React.CSSProperties {
    const def = AllBorders[this.props.type] as BasicBorderDef;
    const factionData = getFactionData(this.props.uiFactionID);

    let style: React.CSSProperties = {};

    if ((def?.boxShadowColorKey?.length ?? 0) > 0) {
      style.boxShadow = `inset 0 0 0.5vmin 0.15vmin ${factionData[def.boxShadowColorKey as keyof FactionData]}`;
    }

    return style;
  }

  private renderResizingHandles(): React.ReactNode {
    if (this.props.resizing) {
      const { onSizeChanged, onSizeFinalized } = this.props.resizing;

      const [widthOcclusion, heightOcclusion] = this.getCornerButtonsOcclusion();

      return (
        <ResizingHandles
          style={{ top: `${this.getTopBorderLiftVmin()}vmin` }}
          cornerButtonWidthVmin={widthOcclusion}
          cornerButtonHeightVmin={heightOcclusion}
          onSizeChanged={onSizeChanged}
          onSizeFinalized={onSizeFinalized}
        />
      );
    }
  }

  private getTopBorderLiftVmin(): number {
    const def = AllBorders[this.props.type];
    return def.category === BorderCategory.Fancy ? -3 : 0;
  }

  private getCornerButtonsSizeVmin(): [number, number] {
    // From `HUD-FactionCornerButton-Root` style.
    const cornerButtonSizeVmin = this.props.small ? 2.86 : 4;
    const cornerButtonsWidth = cornerButtonSizeVmin * (this.props.cornerButtons ?? []).length;
    return [cornerButtonsWidth, (this.props.cornerButtons?.length ?? 0) > 0 ? cornerButtonSizeVmin : 0];
  }

  private getCornerButtonsOcclusion(): [number, number] {
    const def = AllBorders[this.props.type];
    const lift = this.getTopBorderLiftVmin();
    const [buttonsWidth, buttonsHeight] = this.getCornerButtonsSizeVmin();

    // These values are based on the `HUD-FactionBorder-CornerButtonsContainer` style.
    let buttonsTop = -1;
    let buttonsRight = -1;
    if (this.props.small) {
      buttonsTop = -0.4;
      buttonsRight = -0.4;

      if (def.category === BorderCategory.Decorative) {
        buttonsTop = -0.7;
        buttonsRight = -0.7;
      }
    }
    if (def.category === BorderCategory.Fancy) {
      buttonsTop = -4.2;
      buttonsRight = -1.7;

      if (this.props.uiFactionID === Faction.Arthurian) {
        buttonsTop = -5.2;
        buttonsRight = -2.7;
      }
    }

    // How much do the corner buttons overlap with the border edges?

    // The "lift" param's purpose is to put the top handle at the top of the (potentially very thick) top border.
    const buttonsBottom = buttonsTop - lift + buttonsHeight;
    const buttonsLeft = buttonsRight + buttonsWidth;

    return [buttonsLeft, buttonsBottom];
  }
}

const mapStateToProps = (state: RootState, ownProps: ReactProps): Props => {
  return {
    ...ownProps,
    uiFactionID: ownProps.factionIDOverride ?? state.hud.uiFactionID
  };
};

export const FactionBorder = connect(mapStateToProps)(AFactionBorder);
