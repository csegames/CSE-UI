/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import React, { useState, useCallback, useEffect, useRef } from 'react';
import { styled } from '@csegames/linaria/react';
import { useChatOptions } from '../state/optionsState';
import { useRoomsState } from '../state/roomsState';
import { ChatLine } from './ChatLine';
import { useChat } from '../state/chat';
import { ChatTab } from '../state/tabsState';

const ListViewContainer = styled.div`
  width: 100%;
  flex: 1 1 auto;
  overflow-y: scroll;
  &::-webkit-scrollbar {
    width: 7px !important;
  }
  &::-webkit-scrollbar-track {
    -webkit-box-shadow: inset 0 0 6px rgba(0,0,0,0.3) !important;
  }
  &::-webkit-scrollbar-thumb {
    background: linear-gradient(to bottom, #222, #333, #222) !important;
    box-shadow: none !important;
  }
`;

const ScrollContainer = styled.div`
  min-height: 100%;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  align-content: stretch;
  justify-content: flex-end;
`;

export interface Props {
  minLineHeight: number;
  tab: ChatTab;
}

export function ScrollView(props: Props) {

  const chat = useChat();
  const [opts] = useChatOptions();
  const [rooms] = useRoomsState(opts);
  const [bounds, setBounds] = useState({
    height: 0,
    width: 0,
  });

  const [state, setState] = useState({
    messages: [],
    scrollOnAdd: true,
  });

  let listRef = useRef(null);
  let listRefCallback = useCallback(node => {
    if (node !== null) {
      const actualBounds = node.getBoundingClientRect();
      if (bounds.height !== actualBounds.height) {
        setBounds({
          height: actualBounds.height,
          width: actualBounds.width,
        });
      }
      listRef.current = node;
    }
  }, []);

  let batchSize = useRef(0);
  const [viewRange, setViewRange] = useState({
    topIndex: batchSize.current,
    bottomIndex: 0,
  });

  const onNewMessage = (m: ChatMessage) => {
    if (props.tab.filter.rooms.indexOf(m.targetID) >= 0) {
      setState({
        ...state,
        messages: [m].concat(state.messages),
      });
      if (state.scrollOnAdd) {
        setViewRange({
          topIndex: Math.min(state.messages.length + 1, batchSize.current),
          bottomIndex: 0,
        });
      }
    }
  }

  // handle chat messages & update scroll position
  useEffect(() => {

    if (state.scrollOnAdd) {
      setTimeout(() => listRef.current.scrollTop = listRef.current.scrollHeight - listRef.current.clientHeight, 1);
    }

    const handle = chat.onChatMessage(onNewMessage);
    return () => handle.clear();
  }, [state]);

  useEffect(() => {
    setState({
      scrollOnAdd: true,
      messages: rooms.getMessages(props.tab.filter.rooms)
    });
  }, [props.tab.filter.rooms]);

  useEffect(() => {
    batchSize.current = Math.ceil((bounds.height / props.minLineHeight) * 1.25);
    setViewRange({
      topIndex: batchSize.current,
      bottomIndex: 0,
    });
  }, [bounds.height]);

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const target = e.currentTarget as HTMLDivElement;

    const atBottom = Math.floor(target.scrollHeight - target.scrollTop) <= target.clientHeight;
    if (atBottom) {
       // at bottom so enable auto-scrolling on new messages
       setState({
        ...state,
        scrollOnAdd: true,
      });
      return;
    }

    setState({
      ...state,
      scrollOnAdd: false,
    });

    const loadMoreBottom = (target.scrollHeight - target.scrollTop - target.clientHeight) < (target.clientHeight / 2) 
      && viewRange.bottomIndex > 0;
    if (loadMoreBottom) {
      let newTop = viewRange.topIndex;
      let newBottom = viewRange.bottomIndex;
      
      newBottom = Math.max(0, newBottom - batchSize.current);
      newTop = Math.min(state.messages.length, newBottom + (viewRange.topIndex - viewRange.bottomIndex));

      setViewRange({
        topIndex: newTop,
        bottomIndex: newBottom,
      });
      return;
    }


    const loadMoreTop = target.scrollTop < (target.clientHeight / 4) && state.messages.length > viewRange.topIndex;
    if (loadMoreTop) {
      let newTop = viewRange.topIndex;
      let newBottom = viewRange.bottomIndex;
      
      newTop = Math.min(state.messages.length, viewRange.topIndex + batchSize.current);
      newBottom = Math.max(0, newTop - (batchSize.current * 2));

      setViewRange({
        topIndex: newTop,
        bottomIndex: newBottom,
      });
      return;
    }
  }

  const lines: JSX.Element[] = [];
  for (let index = viewRange.topIndex; index >= viewRange.bottomIndex; --index) {
    const message = state.messages[index];
    if (!message) continue;
    lines.push(<ChatLine
      key={message.when.getTime()}
      message={message}
    />);
  }

  return (
    <ListViewContainer ref={listRefCallback} onScroll={handleScroll}>
      <ScrollContainer>
        {lines}
      </ScrollContainer>
    </ListViewContainer>
  );
}
