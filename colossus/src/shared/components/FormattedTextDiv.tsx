/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as React from 'react';

const WordsContainer = 'FormattedTextDiv-WordsContainer';
const Line = 'FormattedTextDiv-Line';
const Word = 'FormattedTextDiv-Word';

interface TagData {
  /** Style or Node */
  tag: 's' | '/s' | 'n';
  /** The number in the tag (e.g. "3" from "<s3>"), used to index into `textClasses` and `nodes`. */
  tagIndex: number;
  startIndex: number;
  endIndex: number;
}

interface Props extends React.HTMLAttributes<HTMLDivElement> {
  text: string;
  textClasses: string[];
  nodes: React.ReactNode[];
}

export class FormattedTextDiv extends React.Component<Props> {
  constructor(props: Props) {
    super(props);
    this.state = { otherSize: '' };
  }

  public render() {
    const { text, textClasses, nodes, className, children, ...otherProps } = this.props;

    return (
      <div className={`${WordsContainer} ${className}`} {...otherProps}>
        {this.renderWords()}
      </div>
    );
  }

  private renderWords(): React.ReactNode[] {
    const spans: React.ReactNode[] = [];
    // Parse text, separate into words, extract and interpret tags.
    // The trick is that tags can be embedded into "words", which can result in a "word" including multiple tags.
    // So after the initial split, we have to break down each word to split out the tags.

    // First break the text into lines.
    const lines = this.props.text.split('\n');

    // We change the style as we hit each style node (<s#>).
    let currentStyle = this.props.textClasses[0];

    lines.forEach((line, lineIndex) => {
      // Then split each line into words (which may have tags in them).
      const words = line.split(' ');
      const lineSpans: React.ReactNode[] = [];
      words.forEach((word, wordIndex) => {
        // We may generate multiple spans from a single "word".
        // We want to keep them grouped for situations like punctuation.  Would be ugly if a period or comma wound up wrapping onto the next row.
        const subSpans: React.ReactNode[] = [];
        // Unfortunately we don't have a recent enough version to support the "d" flag, nor matchAll, so we have to
        // do some manual disassembly.
        // First we will locate every tag and sort them into order so it's easier to dissect the word later.
        const orderedTagData: TagData[] = [];
        // The tags are in the order that they were found, so we can locate the first and then step forward to find each subsequent tag.
        let searchStartIndex: number;

        const styleOpenTags = word.match(/<[s](\d+)>/g);
        if (styleOpenTags && styleOpenTags.length > 0) {
          searchStartIndex = 0;
          styleOpenTags.forEach((tag) => {
            const tagIndex = +tag.match(/\d+/g)[0];
            const startIndex = word.indexOf(tag, searchStartIndex);
            searchStartIndex = startIndex + tag.length;
            orderedTagData.push({ tag: 's', tagIndex, startIndex, endIndex: searchStartIndex });
          });
        }

        const styleCloseTags = word.match(/<\/s(\d+)>/g);
        if (styleCloseTags && styleCloseTags.length > 0) {
          searchStartIndex = 0;
          styleCloseTags.forEach((tag) => {
            const tagIndex = +tag.match(/\d+/g)[0];
            const startIndex = word.indexOf(tag, searchStartIndex);
            searchStartIndex = startIndex + tag.length;
            orderedTagData.push({ tag: '/s', tagIndex, startIndex, endIndex: searchStartIndex });
          });
        }

        const nodeTags = word.match(/<n(\d+)\/>/g);
        if (nodeTags && nodeTags.length > 0) {
          searchStartIndex = 0;
          nodeTags.forEach((tag) => {
            const tagIndex = +tag.match(/\d+/g)[0];
            const startIndex = word.indexOf(tag, searchStartIndex);
            searchStartIndex = startIndex + tag.length;
            orderedTagData.push({ tag: 'n', tagIndex, startIndex, endIndex: searchStartIndex });
          });
        }

        orderedTagData.sort((a, b) => a.startIndex - b.startIndex);
        // Now that all of the tags are in order, we can iterate through and generate spans.
        searchStartIndex = 0;
        let tagIndex = 0;
        do {
          // Make a span from characters before the next tag (if any).
          const tagStart = orderedTagData[tagIndex]?.startIndex ?? word.length;
          const text = word.substring(searchStartIndex, tagStart);
          if (text.length > 0) {
            // Create the actual span.
            subSpans.push(
              <div className={`${Word} ${currentStyle}`} key={`Word${lineIndex}-${wordIndex}-${searchStartIndex}`}>
                {text}
              </div>
            );
          }

          if (orderedTagData[tagIndex]) {
            const data = orderedTagData[tagIndex];
            // Apply tag effects.
            switch (data.tag) {
              case 's': {
                // Start using the specified style.
                currentStyle = this.props.textClasses[data.tagIndex];
                break;
              }
              case '/s': {
                // Revert to the default style.
                currentStyle = this.props.textClasses[0];
                break;
              }
              case 'n': {
                // Insert the specified node.
                subSpans.push(this.props.nodes[data.tagIndex]);
                break;
              }
            }
          }
          // Advance to the end of the current tag.
          searchStartIndex = orderedTagData[tagIndex]?.endIndex ?? word.length;
          // Move on to the next tag (if any).
          ++tagIndex;
        } while (searchStartIndex < word.length);

        // Now that we're done generating subspans for this "word", we can assemble them.

        // If there were multiple subspans, we need to group them.
        // We also put a space at the end to separate from the next "word".
        lineSpans.push(
          <div className={Word} key={`Word${lineIndex}-${wordIndex}`}>
            {subSpans}
            <div className={currentStyle}>{'\xa0'}</div>
          </div>
        );

        // It is possible that no subspans were generated (floating style tags).  In that case, we will just move on to the next "word".
      });
      // If a line is empty, put in an nbsp so it still has the appropriate height.
      if (lineSpans.length === 0) {
        lineSpans.push(<div className={Word}>{'\xa0'}</div>);
      }
      spans.push(
        <div className={Line} key={`Line${lineIndex}`}>
          {lineSpans}
        </div>
      );
    });

    return spans;
  }
}
