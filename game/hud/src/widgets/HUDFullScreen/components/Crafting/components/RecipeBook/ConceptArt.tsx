/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as React from 'react';
import { styled } from '@csegames/linaria/react';

const Container = styled.div`
  width: 100%;
  height: 100%;
`;

const Image = styled.div`
  background-repeat: no-repeat;
  background-size: contain;
`;

export interface ConceptArtImage {
  width: number;
  height: number;
  url: string;
}

const imagePrefix = '../images/crafting/1080/drawings/';
const conceptArtImages: ConceptArtImage[] = [
  { width: 177, height: 250, url: imagePrefix + 'sketch-art-armor.png' },
  { width: 177, height: 250, url: imagePrefix + 'sketch-art-axe.png' },
  { width: 177, height: 250, url: imagePrefix + 'sketch-art-shield.png' },
  { width: 177, height: 250, url: imagePrefix + 'sketch-art-statue.png' },
  { width: 177, height: 250, url: imagePrefix + 'sketch-art-sword.png' },
  { width: 177, height: 250, url: imagePrefix + 'sketch-infusion1.png' },
  { width: 177, height: 250, url: imagePrefix + 'sketch-infusion2.png' },
  { width: 177, height: 250, url: imagePrefix + 'sketch-infusion3.png' },
  { width: 177, height: 250, url: imagePrefix + 'sketch-infusion4.png' },
  { width: 177, height: 250, url: imagePrefix + 'sketch-statue.png' },
];

enum FloatPositions {
  TopLeft,
  TopRight,
  BottomLeft,
  BottomRight,
}

export interface Props {
  key: any;
  scale?: number;
  disabled?: boolean;
}

export interface State {
  floatPosition: FloatPositions;
  backgroundImage: ConceptArtImage;
}

class ConceptArt extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      floatPosition: FloatPositions.TopLeft,
      backgroundImage: conceptArtImages[0],
    };
  }
  public render() {
    if (this.props.disabled) {
      return (this.props.children as any)({
        ...this.state,
        shouldTransform: false,
      });
    }

    const { scale } = this.props;
    const { floatPosition, backgroundImage } = this.state;
    const transform = this.shouldTransform() ? 'rotate(180deg)' : 'none';
    const float = this.getFloatFromFloatPosition(floatPosition);

    return (
      <Container style={{ transform }}>
        <Image
          style={{
            float,
            width: scale ? backgroundImage.width * scale : backgroundImage.width,
            height: scale ? backgroundImage.height * scale : backgroundImage.height,
            backgroundImage: `url(${backgroundImage.url})`,
            transform,
          }}
        />
        {(this.props.children as any)({
          ...this.state,
          shouldTransform: this.shouldTransform(),
        })}
      </Container>
    );
  }

  public componentDidMount() {
    this.initialize();
  }

  public componentDidUpdate(prevProps: Props) {
    if (this.props.key !== prevProps.key) {
      this.initialize();
    }
  }

  private initialize = () => {
    const floatPosition = this.getRandomFloatPosition();
    const backgroundImage = this.getRandomConceptArtImage();

    this.setState({ floatPosition, backgroundImage });
  }

  private shouldTransform = () => {
    const float = this.state.floatPosition;
    return float === FloatPositions.BottomLeft || float === FloatPositions.BottomRight;
  }

  private getFloatFromFloatPosition = (floatPosition: FloatPositions) => {
    switch (floatPosition) {
      case FloatPositions.TopRight:
      case FloatPositions.BottomRight:
        return 'right';
      case FloatPositions.TopLeft:
      case FloatPositions.BottomLeft:
        return 'left';
    }
  }

  private getRandomFloatPosition = () => {
    // Use 4 to add in Bottom. Things may get buggy.
    const randomIndex = Math.floor(Math.random() * 2);
    return randomIndex;
  }

  private getRandomConceptArtImage = () => {
    const randomIndex = Math.floor(Math.random() * conceptArtImages.length);
    return conceptArtImages[randomIndex];
  }
}

export default ConceptArt;
