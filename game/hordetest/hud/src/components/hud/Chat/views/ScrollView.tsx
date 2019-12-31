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
import { View } from '../state/viewsState';

type LVProps = { show: boolean; } & React.HTMLProps<HTMLDivElement>;
const ListViewContainer = styled.div`
  width: 100%;
  flex: 1 1 auto;
  overflow-y: scroll;
  &::-webkit-scrollbar {
    width: 7px !important;
  }
  &::-webkit-scrollbar-track {
    -webkit-box-shadow: inset 0 0 0px transparent !important;
  }
  &::-webkit-scrollbar-thumb {
    border-radius: 2px;
    background: rgba(255, 255, 255, 0.7) !important;
    box-shadow: none !important;
  }
  direction: rtl;
  opacity: ${(props: LVProps) => props.show ? '1' : '0'};
  transition: opacity 0.5s;
`;


const ScrollContainer = styled.div`
  min-height: 100%;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  align-content: stretch;
  justify-content: flex-end;
  direction:ltr;
`;

export interface Props {
  minLineHeight: number;
  view: View;
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
    timeoutHandle: null,
    show: true,
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

  let updateTimeout = () => null;

  const onNewMessage = (m: ChatMessage) => {
    if (props.view.filter.rooms.indexOf(m.targetID) >= 0) {
      setState(state => ({
        ...state,
        messages: [m].concat(state.messages),
      }));
      if (state.scrollOnAdd) {
        setViewRange({
          topIndex: Math.min(state.messages.length + 1, batchSize.current),
          bottomIndex: 0,
        });
      }
      updateTimeout();
    }
  }

  const onSystemMessage = (m: string) => {
    if (props.view.filter.system) {
      setState(state => ({
        ...state,
        messages: [{type: 2, content: m, senderFlag: 1, when: new Date()}].concat(state.messages),
      }));
      if (state.scrollOnAdd) {
        setViewRange({
          topIndex: Math.min(state.messages.length + 1, batchSize.current),
          bottomIndex: 0,
        });
      }
      updateTimeout();
    }
  }

  useEffect(() => {
    updateTimeout = () => {
      const showOrHide = (show: boolean) => {
        setState(state => ({
          ...state,
          timeoutHandle: null,
          show,
        }));
      }
      setState(state => {
        if (state.timeoutHandle) {
          window.clearTimeout(state.timeoutHandle);
        }
        var timeoutHandle = window.setTimeout(() => showOrHide(false), 10000);
        return {
          ...state,
          timeoutHandle,
          show: true,
        };
      });
    }
  }, [state]);

  useEffect(() => {
    const handles: EventHandle[] = [];
    handles.push(game.onBeginChat(updateTimeout));
    handles.push(game.onSystemMessage(onSystemMessage));
    return () => handles.forEach(h => h.clear());
  }, []);

  // handle chat messages & update scroll position
  useEffect(() => {

    if (state.scrollOnAdd) {
      setTimeout(() => listRef.current.scrollTop = listRef.current.scrollHeight - listRef.current.clientHeight, 1);
    }

    const handle = chat.onChatMessage(onNewMessage);
    return () => handle.clear();
  }, [state]);

  useEffect(() => {
    setState(state => ({
      ...state,
      scrollOnAdd: true,
      messages: rooms.getMessages(props.view.filter.rooms),
    }));
  }, [props.view.filter.rooms]);

  useEffect(() => {
    batchSize.current = Math.ceil((bounds.height / props.minLineHeight) * 1.25);
    setViewRange({
      topIndex: batchSize.current,
      bottomIndex: 0,
    });
  }, [bounds.height]);

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const target = e.currentTarget as HTMLDivElement;
    updateTimeout();

    const atBottom = Math.floor(target.scrollHeight - target.scrollTop) <= target.clientHeight;
    if (atBottom) {
       // at bottom so enable auto-scrolling on new messages
       setState(state => ({
        ...state,
        scrollOnAdd: true,
      }));
      return;
    }

    setState(state => ({
      ...state,
      scrollOnAdd: false,
    }));

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
    <ListViewContainer ref={listRefCallback} onScroll={handleScroll} show={state.show}>
      <ScrollContainer>
        {lines}
      </ScrollContainer>
    </ListViewContainer>
  );
}
