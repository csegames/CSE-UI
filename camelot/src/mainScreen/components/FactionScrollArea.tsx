/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { Dispatch } from '@reduxjs/toolkit';
import * as React from 'react';
import { connect } from 'react-redux';
import { RootState } from '../redux/store';
import { getFactionData } from '../gameData/factionData';
import { genID } from '@csegames/library/dist/_baseGame/utils/idGen';
import { BorderBackground, BorderType, FactionBorder } from './FactionBorder';
import { SoundEvents } from '@csegames/library/dist/camelotunchained/game/types/SoundEvents';
import { clientAPI } from '@csegames/library/dist/camelotunchained/MainScreenClientAPI';

const Root = 'HUD-FactionScrollArea-Root';
const Wrapper = 'HUD-FactionScrollArea-Wrapper';
const BarTrack = 'HUD-FactionScrollArea-BarTrack';
const BorderOverlay = 'HUD-FactionScrollArea-BorderOverlay';

const LONG_ASPECT_RATIO = 512 / 64;
const SHORT_ASPECT_RATIO = 80 / 26;

interface State {
  id: string;
  height: number;
  contentHeight: number;
}

interface ReactProps extends React.HTMLAttributes<HTMLDivElement> {
  contentClassName?: string;
  factionIDOverride?: string;
  scrollbarWidth?: string;
  topFadeAmount?: string;
  bottomFadeAmount?: string;
  useSmallThumb?: boolean;
  barOnLeft?: boolean;
  hideTrack?: boolean;
  showEmptyTrack?: boolean;
  borderType?: BorderType;
  background?: BorderBackground;
  soundEventScrolled?: SoundEvents;
  scrollRef?: (node: HTMLDivElement) => void;
}

interface InjectedProps {
  uiFactionID: string;
  dispatch?: Dispatch;
}

type Props = ReactProps & InjectedProps;

class AFactionScrollArea extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = {
      id: genID(),
      height: -1,
      contentHeight: -1
    };
  }

  render(): JSX.Element {
    const {
      contentClassName,
      topFadeAmount,
      bottomFadeAmount,
      scrollbarWidth,
      dispatch,
      className,
      useSmallThumb,
      barOnLeft,
      uiFactionID,
      factionIDOverride,
      hideTrack,
      showEmptyTrack,
      borderType,
      background,
      scrollRef,
      style,
      soundEventScrolled,
      onScroll,
      ...otherProps
    } = this.props;
    const finalScrollbarWidth = this.props.scrollbarWidth ?? '2.5vmin';
    const thumbHeight = `calc(${finalScrollbarWidth} * ${useSmallThumb ? SHORT_ASPECT_RATIO : LONG_ASPECT_RATIO})`;

    const factionData = getFactionData(this.props.uiFactionID);

    const isThumbShown = this.state.height < this.state.contentHeight;
    const trackInset = useSmallThumb ? 0.43 : 0.36;

    const topFade = topFadeAmount ?? '0%';
    const bottomFade = `calc(100% - ${bottomFadeAmount ?? '0%'})`;

    const finalStyle: React.CSSProperties = {
      ...(style ?? {}),
      maskImage: `linear-gradient(to bottom, transparent, black ${topFade}, black ${bottomFade}, transparent)`,
      WebkitMaskImage: `linear-gradient(to bottom, transparent, black ${topFade}, black ${bottomFade}, transparent)`
    };

    return (
      <div
        className={`${Root} ${className ?? ''}${barOnLeft ? ' barOnLeft' : ''}`}
        style={finalStyle}
        {...otherProps}
        ref={this.boundSetRootRef}
      >
        {((!hideTrack && isThumbShown) || (!hideTrack && !isThumbShown && showEmptyTrack)) && (
          <div
            className={BarTrack}
            style={{
              borderColor: factionData.borderColor,
              right: barOnLeft ? undefined : `calc(${finalScrollbarWidth} * ${trackInset})`,
              left: barOnLeft ? `calc(${finalScrollbarWidth} * ${trackInset})` : undefined,
              width: `calc(${finalScrollbarWidth} * 0.28)`,
              borderRadius: `calc(${finalScrollbarWidth} * 0.14)`
            }}
          />
        )}
        {background && (
          <FactionBorder
            type={BorderType.None}
            background={background}
            className={BorderOverlay}
            style={{
              width: `calc(100% - ${finalScrollbarWidth})`,
              right: barOnLeft ? undefined : finalScrollbarWidth,
              left: barOnLeft ? finalScrollbarWidth : undefined
            }}
          />
        )}
        <div
          className={`${Wrapper} ${contentClassName ?? ''}`}
          id={this.state.id}
          onScroll={(e) => {
            if (soundEventScrolled) {
              clientAPI.playGameSound(soundEventScrolled);
            }
            onScroll?.(e);
          }}
        >
          <style>{`#${this.state.id}::-webkit-scrollbar-thumb { background-image: url(${
            useSmallThumb ? factionData.scrollbarShortImage : factionData.scrollbarImage
          }); height: ${thumbHeight} }`}</style>
          <style>{`#${this.state.id}::-webkit-scrollbar { width: ${finalScrollbarWidth}; }`}</style>
          <div
            style={barOnLeft ? { direction: 'ltr' } : {}}
            ref={(r) => {
              if (r) {
                if (this.state.contentHeight !== r.offsetHeight) {
                  this.setState({ contentHeight: r.offsetHeight });
                }
              }
            }}
          >
            {this.props.children}
          </div>
        </div>
        {borderType && (
          <FactionBorder
            type={borderType}
            className={BorderOverlay}
            style={{
              width: `calc(100% - ${finalScrollbarWidth})`,
              right: barOnLeft ? undefined : finalScrollbarWidth,
              left: barOnLeft ? finalScrollbarWidth : undefined
            }}
          />
        )}
      </div>
    );
  }

  // A pre-bound ref function won't trigger unnecessary re-renders.
  private boundSetRootRef = this.setRootRef.bind(this);
  private setRootRef(r: HTMLDivElement): void {
    if (r) {
      if (this.state.height !== r.offsetHeight) {
        this.setState({ height: r.offsetHeight });
      }
    }
    // If an external ref was requested, pass it out.
    this.props.scrollRef?.(r);
  }
}

const mapStateToProps = (state: RootState, ownProps: ReactProps): Props => {
  return {
    ...ownProps,
    uiFactionID: ownProps.factionIDOverride ?? state.hud.uiFactionID
  };
};

export const FactionScrollArea = connect(mapStateToProps)(AFactionScrollArea);
