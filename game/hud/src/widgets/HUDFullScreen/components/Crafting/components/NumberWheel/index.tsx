/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 */

import * as React from 'react';
import { findIndex, isEmpty, isEqual } from 'lodash';
import { styled } from '@csegames/linaria/react';
import NumberItem, { AngleData } from './NumberItem';
import NumberWheelInput from './NumberWheelInput';
import { MediaBreakpoints } from 'services/session/MediaBreakpoints';

const DIMENSIONS = 100;
const LARGE_DIMENSIONS = 245;
const WHEEL_RADIUS = DIMENSIONS / 2;
const LARGE_WHEEL_RADIUS = LARGE_DIMENSIONS / 2;
const EXTRA_SPACING = 6;
const INNER_CIRCLE_DIFF = 10;

const Container = styled.div`
  position: relative;
  width: ${DIMENSIONS}px;
  height: ${DIMENSIONS}px;
  &:before {
    content: '';
    position: absolute;
    top: -26px;
    left: -26px;
    width: 160px;
    height: 160px;
    background: url(../images/crafting/1080/output-dial-counter.png);
    background-size: cover;
    background-position: center center;
  }

  @media (min-width: ${MediaBreakpoints.UHD}px) {
    width: 300px;
    height: 300px;
    &:before {
      width: 348px;
      height: 348px;
      background: url(../images/crafting/4k/output-dial-counter.png);
      background-size: cover;
      background-position: center center;
    }
  }
`;

const Hand = styled.div`
  position: absolute;
  width: 20px;
  height: 30px;
  background: url(../images/crafting/1080/output-dial-pointer.png) no-repeat;
  background-size: contain;
  pointer-events: all;
  cursor: pointer;
  &.isDragging {
    -webkit-filter: brightness(150%);
    filter: brightness(150%);
  }
  @media (min-width: ${MediaBreakpoints.UHD}px) {
    width: 36px;
    height: 63px;
    background: url(../images/crafting/4k/output-dial-pointer.png);
    background-size: contain;
  }
  &:hover {
    -webkit-filter: brightness(120%);
    filter: brightness(120%);
  }
`;

const InputContainer = styled.div`
  position: absolute;
  top: 0;
  right: 0;
  left: 0;
  bottom: 0;
  margin: auto;
  display: flex;
  align-items: center;
  justify-content: center;
  pointer-events: none;
`;

export interface InjectedProps {
  uiContext: UIContext;
}

export interface ComponentProps {
  // Min amount of items that can be created at the moment
  minValue: number;

  // Max amount of items that can be created at the moment
  maxValue: number;

  onSelectValue: (value: number) => void;
  defaultValue: number;

  // Hard max cutoff of items that can be created no matter what
  maxCutoffValue?: number;

  // These are for display only
  // Text to add before the value in the input
  prevValueDecorator?: string;
  trailValueDecorator?: string;
}

export type Props = InjectedProps & ComponentProps;

export interface State {
  selectedValue: number;
  handTransformData: { rotation: number, x: number, y: number };
  isDraggingHand: boolean;
  arrOfNums: number[];
}

const defaultArrayOfNums = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14];

class NumberWheel extends React.Component<Props, State> {
  private shouldUse4kAssets: boolean = false;
  constructor(props: Props) {
    super(props);
    this.state = {
      selectedValue: props.defaultValue,
      handTransformData: { rotation: 0, x: 0, y: 0 },
      isDraggingHand: false,
      arrOfNums: defaultArrayOfNums,
    };
  }

  public render() {
    const { rotation, x, y } = this.state.handTransformData;
    const numberWheelArr = [...this.state.arrOfNums, 'Back', 'Next'];
    return (
      <Container>
        {numberWheelArr.map((val, i) => {
          const disabled = this.isItemDisabled(val, i);
          const shouldHideItem = this.shouldHideItem(val, i);
          return !shouldHideItem ? (
            <NumberItem
              key={i}
              disabled={disabled}
              value={val}
              index={i}
              wheelRadius={this.props.uiContext.isUHD() ? LARGE_WHEEL_RADIUS : WHEEL_RADIUS}
              totalNumberItems={numberWheelArr.length}
              extraSpacing={EXTRA_SPACING}
              selectedIndex={this.state.selectedValue === val && i}
              onClick={this.onClickIndex}
              onNextPage={this.onNextPage}
              onBackPage={this.onBackPage}
              onMouseOver={this.onMouseOverIndex}
              onMouseDown={this.onHandMouseDown}
              onMouseUp={this.onHandMouseUp}
            />
          ) : null;
        })}
        <InputContainer>
          <NumberWheelInput
            value={this.state.selectedValue}
            minValue={this.props.minValue}
            maxValue={this.props.maxValue}
            onChange={this.onInputChange}
            prevValueDecorator={this.props.prevValueDecorator}
            trailValueDecorator={this.props.trailValueDecorator}
          />
        </InputContainer>
        {findIndex(numberWheelArr, val => val === this.state.selectedValue) !== -1 &&
          <Hand
            className={this.state.isDraggingHand ? 'isDragging' : ''}
            onMouseDown={this.onHandMouseDown}
            style={{ WebkitTransform: `rotate(${rotation}deg)`, top: y, left: x }}
          />
        }
      </Container>
    );
  }

  public componentDidMount() {
    const { arrOfNums } = this.state;
    this.shouldUse4kAssets = this.props.uiContext.isUHD();

    const potentialIndex = findIndex(arrOfNums, num => num === this.state.selectedValue);
    if (potentialIndex !== -1) {
      this.initializeHand(potentialIndex, arrOfNums);
    } else {
      this.goToPageWith(this.state.selectedValue);
    }
  }

  public componentDidUpdate(prevProps: Props, prevState: State) {
    if (this.shouldUse4kAssets !== this.props.uiContext.isUHD()) {
      this.shouldUse4kAssets = this.props.uiContext.isUHD();
      this.initializeHand();
    }

    if (this.props.maxValue < this.state.selectedValue) {
      this.setToMin();
      return;
    }

    if (!this.state.isDraggingHand && !prevProps.defaultValue.floatEquals(this.props.defaultValue, 1) &&
        !this.state.selectedValue.floatEquals(this.props.defaultValue, 1)) {
      this.setToMin();
      return;
    }

    if (prevProps.minValue !== this.props.minValue && this.state.selectedValue < this.props.minValue) {
      this.setToMin();
      return;
    }
  }

  private initializeHand = (index?: number, arrOfNumbers?: number[]) => {
    const arrOfNums = arrOfNumbers || this.state.arrOfNums;
    const potentialIndex = index || arrOfNums.findIndex(num => num === this.state.selectedValue);

    this.setState(
      this.getHandTransformData(
        this.state.selectedValue,
        NumberItem.getAngleForIndex(potentialIndex, arrOfNums.length + 2),
      ),
    );
  }

  private setToMin = () => {
    this.goToPageWith(this.props.minValue);
  }

  private onClickIndex = (value: number, angle: AngleData) => {
    this.setState(this.getHandTransformData(value, angle));
    this.props.onSelectValue(value);
  }

  private onMouseOverIndex = (value: number, angle: AngleData) => {
    if (this.state.isDraggingHand) {
      this.setState(this.getHandTransformData(value, angle));
      this.props.onSelectValue(value);
    }
  }

  private onInputChange = (newVal: number) => {
    this.props.onSelectValue(newVal);

    const { arrOfNums } = this.state;
    const potentialIndex = findIndex(arrOfNums, num => num === newVal);
    if (potentialIndex === -1) {
      this.goToPageWith(newVal);
    } else {
      this.setState(
        this.getHandTransformData(newVal, NumberItem.getAngleForIndex(potentialIndex, arrOfNums.length + 2)),
      );
    }
  }

  private getHandTransformData = (value: number, angle: AngleData) => {
    const isLargeResolution = this.props.uiContext.isUHD();
    const wheelRadius = isLargeResolution ? LARGE_WHEEL_RADIUS : WHEEL_RADIUS;
    const extraSpacing = isLargeResolution ? 0 : EXTRA_SPACING;
    const x = Math.floor((Math.cos(angle.radians) * (wheelRadius - INNER_CIRCLE_DIFF)) + (wheelRadius - extraSpacing));
    const y = Math.floor((Math.sin(angle.radians) * (wheelRadius - INNER_CIRCLE_DIFF)) + (wheelRadius - extraSpacing));
    return {
      selectedValue: value,
      handTransformData: { rotation: angle.degrees + 90, x, y },
    };
  }

  private goToPageWith = (value: number) => {
    const { arrOfNums } = this.state;
    let newArrOfNums = [];
    let potentialIndex = findIndex(arrOfNums, num => num === value);
    if (potentialIndex === -1) {
      // We need to change pages
      const remainder = value % 14;
      const startingValue = (value + 1) - remainder;
      for (let i = startingValue; i < startingValue + 14; i++) {
        newArrOfNums.push(i);
      }

      potentialIndex = remainder - 1;
    }

    if (isEmpty(newArrOfNums)) {
      newArrOfNums = [...arrOfNums];
    }

    const handAngle = NumberItem.getAngleForIndex(potentialIndex, newArrOfNums.length + 2);
    const handTransformData = this.getHandTransformData(value, handAngle);

    this.setState({
      arrOfNums: newArrOfNums,
      selectedValue: handTransformData.selectedValue,
      handTransformData: handTransformData.handTransformData,
    }, () => {
      this.props.onSelectValue(handTransformData.selectedValue);
    });
  }

  private onNextPage = () => {
    const { arrOfNums } = this.state;
    const newArrOfNums = [];
    const firstNumber = arrOfNums[arrOfNums.length - 1] + 1;
    for (let i = firstNumber; i < firstNumber + 14; i++) {
      newArrOfNums.push(i);
    }

    this.setState({ arrOfNums: newArrOfNums });
  }

  private onBackPage = () => {
    const { arrOfNums } = this.state;
    const newArrOfNums = [];
    const lastNumber = arrOfNums[0];
    for (let i = lastNumber - 14; i < lastNumber; i++) {
      newArrOfNums.push(i);
    }

    this.setState({ arrOfNums: newArrOfNums });
  }

  private onHandMouseDown = () => {
    this.setState({ isDraggingHand: true });
    window.addEventListener('mouseup', this.onHandMouseUp);
  }

  private onHandMouseUp = () => {
    this.setState({ isDraggingHand: false });
    window.removeEventListener('mouseup', this.onHandMouseUp);
  }

  private isItemDisabled = (val: number | string, index: number) => {
    const { minValue, maxValue, maxCutoffValue } = this.props;
    const { arrOfNums } = this.state;
    return (minValue > val || val > maxValue) ||
      (val === 'Back' && arrOfNums[0] === 1) ||
      (val === 'Next' && (arrOfNums[arrOfNums.length - 3] + 1) > maxCutoffValue);
  }

  private shouldHideItem = (val: number | string, index: number) => {
    const { maxCutoffValue } = this.props;
    return val > maxCutoffValue && val !== 'Back' && val !== 'Next';
  }
}

class NumberWheelWithInjectedContext extends React.Component<ComponentProps> {
  public render() {
    return (
      <UIContext.Consumer>
        {(uiContext: UIContext) => {
          return (
            <NumberWheel {...this.props} uiContext={uiContext} />
          );
        }}
      </UIContext.Consumer>
    );
  }

  public shouldComponentUpdate(nextProps: Props, nextState: State) {
    return !isEqual(this.state, nextState) ||
      this.props.defaultValue !== nextProps.defaultValue ||
      this.props.maxCutoffValue !== nextProps.maxCutoffValue ||
      this.props.maxValue !== nextProps.maxValue ||
      this.props.minValue !== nextProps.minValue ||
      this.props.prevValueDecorator !== nextProps.prevValueDecorator ||
      this.props.trailValueDecorator !== nextProps.trailValueDecorator;
  }
}

export default NumberWheelWithInjectedContext;
