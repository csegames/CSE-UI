/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as React from 'react';
import { connect } from 'react-redux';
import { AppDispatch, RootState } from '../redux/store';
import TooltipSource from './TooltipSource';
import { BorderBackground, BorderType, FactionBorder } from './FactionBorder';
import { getFactionData } from '../gameData/factionData';
import { genID } from '@csegames/library/dist/_baseGame/utils/idGen';
import { ResizeDetector } from '../../shared/components/ResizeDetector';

const Root = 'HUD-FactionComboBox-Root';
const BoxRoot = 'HUD-FactionComboBox-BoxRoot';
const RootBorder = 'HUD-FactionComboBox-RootBorder';
const ContentRow = 'HUD-FactionComboBox-ContentRow';
const SelectionLabel = 'HUD-FactionComboBox-SelectionLabel';
const RootArrow = 'HUD-FactionComboBox-RootArrow';
const OptionsCollapser = 'HUD-FactionComboBox-OptionsCollapser';
const OptionsContainer = 'HUD-FactionComboBox-OptionsContainer';
const OptionsList = 'HUD-FactionComboBox-OptionsList';
const OptionRow = 'HUD-FactionComboBox-OptionRow';
const SelectionArrow = 'HUD-FactionComboBox-SelectionArrow';

interface State {
  id: string;
  isOpen: boolean;
  contentHeight: number;
}

interface ReactProps extends React.HTMLAttributes<HTMLDivElement> {
  factionIDOverride?: string;
  options: string[];
  selectedOption: string;
  onSelectionChanged: (selection: string) => void;
  disabled?: boolean;
  disabledTooltip?: string;
}

interface InjectedProps {
  uiFactionID: string;
  dispatch?: AppDispatch;
}

type Props = ReactProps & InjectedProps;

class AFactionComboBox extends React.Component<Props, State> {
  private onWindowClick = () => {
    this.setState({ isOpen: false });
  };

  constructor(props: Props) {
    super(props);

    this.state = {
      id: genID(),
      isOpen: false,
      contentHeight: -1
    };
  }

  componentDidUpdate(_prevProps: Props, prevState: State): void {
    if (!prevState.isOpen && this.state.isOpen) {
      window.addEventListener('click', this.onWindowClick);
    } else if (prevState.isOpen && !this.state.isOpen) {
      window.removeEventListener('click', this.onWindowClick);
    }
  }

  componentWillUnmount(): void {
    window.removeEventListener('click', this.onWindowClick);
  }

  render(): JSX.Element {
    let {
      id,
      uiFactionID,
      factionIDOverride,
      disabled,
      disabledTooltip,
      dispatch,
      className,
      options,
      selectedOption,
      onSelectionChanged,
      ...otherProps
    } = this.props;

    // Can't use a combobox if there is nothing in it to select!
    disabled = disabled || options.length <= 0;

    const factionData = getFactionData(uiFactionID);

    return (
      <div
        className={`${Root} ${className}`}
        {...otherProps}
        onClick={(e) => {
          e.stopPropagation();
          this.setState({ isOpen: !this.state.isOpen });
        }}
      >
        {/** Yes, the 'aa' is deliberate.  It sets the opacity of the color to a lower value for hover than for selected. */}
        <style>{`.${this.state.id}:hover { background-color: ${factionData.borderColor}aa; }`}</style>
        <style>{`.${this.state.id}.selected { background-color: ${factionData.borderColor} !important; }`}</style>
        <div
          className={OptionsCollapser}
          style={
            this.state.contentHeight > 0 && this.state.isOpen
              ? { height: `calc(${this.state.contentHeight}px + 0.5vmin)` }
              : {}
          }
        >
          <FactionBorder
            factionIDOverride={uiFactionID}
            className={OptionsContainer}
            includeTop={false}
            type={BorderType.Primary}
            background={BorderBackground.PatternSmall}
          >
            <div className={OptionsList}>
              <ResizeDetector
                onResize={(newWidth, newHeight, oldWidth, oldHeight) => {
                  if (newHeight != this.state.contentHeight) {
                    this.setState({ contentHeight: newHeight });
                  }
                }}
              />
              {options.map((opt, index) => {
                const isSelected = opt === selectedOption;
                return (
                  <div
                    className={`${OptionRow}${isSelected ? ' selected' : ''} ${this.state.id}`}
                    key={index}
                    onClick={(e) => {
                      e.stopPropagation();
                      if (!isSelected) {
                        onSelectionChanged(opt);
                        this.setState({ isOpen: false });
                      }
                    }}
                  >
                    <div className={`${SelectionLabel}${isSelected ? ' selected' : ''}`}>{opt}</div>
                    {isSelected && <img className={SelectionArrow} src={factionData.arrowPointerImage} />}
                  </div>
                );
              })}
            </div>
          </FactionBorder>
        </div>
        <TooltipSource
          className={`${BoxRoot} ${disabled ? 'disabled' : ''}`}
          active={!!this.props.disabledTooltip && disabled}
          tooltipID={'DisabledComboBox'}
          content={() => this.props.disabledTooltip}
          positionType='mouse'
        >
          <FactionBorder
            className={RootBorder}
            type={BorderType.Primary}
            background={BorderBackground.PatternSmall}
            factionIDOverride={uiFactionID}
          >
            <div className={ContentRow}>
              <div className={SelectionLabel}>{this.props.selectedOption}</div>
              <img className={RootArrow} src={factionData.arrowPointerImage} />
            </div>
          </FactionBorder>
        </TooltipSource>
      </div>
    );
  }
}

const mapStateToProps = (state: RootState, ownProps: ReactProps): Props => {
  return {
    ...ownProps,
    uiFactionID: ownProps.factionIDOverride ?? state.hud.uiFactionID
  };
};

export const FactionComboBox = connect(mapStateToProps)(AFactionComboBox);
