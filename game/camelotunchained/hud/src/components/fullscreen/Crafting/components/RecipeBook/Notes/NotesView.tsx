/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 */

import * as React from 'react';
import { debounce } from 'lodash';
import { styled } from '@csegames/linaria/react';
import { VoxNote } from 'gql/interfaces';
import { MID_SCALE, HD_SCALE } from 'fullscreen/lib/constants';

// #region Container constants
const CONTAINER_FONT_SIZE = 32;
const CONTAINER_BOLD_FONT_SIZE = 40;
// #endregion
const Container = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
  font-family: Caveat;
  font-size: ${CONTAINER_FONT_SIZE}px;

  .bold-font {
    font-family: TradeWinds;
    font-size: ${CONTAINER_BOLD_FONT_SIZE}px;
  }

  @media (max-width: 2560px) {
    font-size: ${CONTAINER_FONT_SIZE * MID_SCALE}px;

    .bold-font {
      font-size: ${CONTAINER_BOLD_FONT_SIZE * MID_SCALE}px;
    }
  }

  @media (max-width: 1920px) {
    font-size: ${CONTAINER_FONT_SIZE * HD_SCALE}px;

    .bold-font {
      font-size: ${CONTAINER_BOLD_FONT_SIZE * HD_SCALE}px;
    }
  }
`;

// #region ComingSoonOverlay constants
const COMING_SOON_OVERLAY_FONT_SIZE = 32;
// #endregion
const ComingSoonOverlay = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  background: rgba(0, 0, 0, 0.6);
  text-transform: uppercase;
  font-family: Caveat;
  font-size: ${COMING_SOON_OVERLAY_FONT_SIZE}px;
  color: white;

  @media (max-width: 2560px) {
    font-size: ${COMING_SOON_OVERLAY_FONT_SIZE * MID_SCALE}px;
  }

  @media (max-width: 1920px) {
    font-size: ${COMING_SOON_OVERLAY_FONT_SIZE * HD_SCALE}px;
  }
`;

const Editor = styled.div`
  padding: 10px 15px;
`;

export interface Props {
  selectedVoxNote: VoxNote.Fragment;
  onNotesChange: (notes: string) => void;
}

export interface State {
  characterCount: number;
}

class NotesView extends React.Component<Props, State> {
  private isFocused: boolean = false;
  private editorRef: HTMLDivElement;
  constructor(props: Props) {
    super(props);
    this.state = {
      characterCount: 0,
    };

    this.onSaveNote = debounce(this.onSaveNote, 500);
  }

  public render() {
    return (
      <Container>
        <ComingSoonOverlay>Coming Soon</ComingSoonOverlay>
        <Editor
          ref={(r: HTMLDivElement) => this.editorRef = r}
          contentEditable
          onClick={this.onFocus}
          onBlur={this.onBlur}
          onInput={this.onInputChange}
        />
        <div>{this.state.characterCount} / 1000</div>
      </Container>
    );
  }

  public componentDidMount() {
    window.setTimeout(this.initialize, 1);
  }

  public componentDidUpdate(prevProps: Props) {
    if (!prevProps.selectedVoxNote && this.props.selectedVoxNote ||
        ((prevProps.selectedVoxNote && prevProps.selectedVoxNote.id) !==
        (this.props.selectedVoxNote && this.props.selectedVoxNote.id))) {
      this.initialize();
    }
  }

  private initialize = () => {
    const { selectedVoxNote } = this.props;
    this.editorRef.spellcheck = false;
    this.editorRef.innerHTML = selectedVoxNote ? this.getParsedInnerHTML(selectedVoxNote.notes) : '';
    this.setState({ characterCount: this.getParsedServerTextContent().length });
  }

  private onInputChange = () => {
    this.setState({ characterCount: this.getParsedServerTextContent().length });
    this.onSaveNote();
  }

  private onKeyDown = (e: KeyboardEvent) => {
    if (e.key === '*') {
      this.editorRef.innerHTML = this.getParsedInnerHTML(this.editorRef.innerHTML);
    }
  }

  private onSaveNote = () => {
    this.props.onNotesChange(this.getParsedServerTextContent());
  }

  private onFocus = () => {
    if (!this.isFocused) {
      window.addEventListener('keydown', this.onKeyDown);
      this.isFocused = true;
    }
  }

  private onBlur = () => {
    this.editorRef.innerHTML = this.getParsedInnerHTML(this.editorRef.innerHTML);
    window.removeEventListener('keydown', this.onKeyDown);
    this.isFocused = false;
  }

  private getParsedServerTextContent = () => {
    const newTextContent =
      this.editorRef.innerHTML
        .replace(new RegExp('&nbsp;', 'g'), ' ')
        .replace(new RegExp('<br>', 'g'), '↲')
        .replace(new RegExp('<div>', 'g'), '')
        .replace(new RegExp('</div>', 'g'), '')
        .replace(new RegExp('<span class="bold-font">', 'g'), '*')
        .replace(new RegExp('<span style="background-color: initial;">', 'g'), '')
        .replace(new RegExp('</span>', 'g'), '');

    return newTextContent;
  }

  private getParsedInnerHTML = (text: string) => {
    let newText = text;

    // Find words in between *, wrap them with bold font span
    const boldRegex = new RegExp(/([*'])(?:(?=(\\?))\2.)*?\1/g);
    const matches = text.match(boldRegex);
    if (matches) {
      matches.forEach((textMatch) => {
        newText = newText.replace(
          textMatch,
          '<span class="bold-font">' + textMatch.slice(1, textMatch.length - 1) + '</span>',
        );
      });
    }

    newText = newText.replace(new RegExp('↲', 'g'), '<div><br></div>');

    return newText;
  }
}

export default NotesView;
