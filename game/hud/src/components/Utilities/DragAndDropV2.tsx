/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import React, { useState, useEffect } from 'react';
import styled from 'react-emotion';
import { createSharedState } from 'services/session/lib/sharedState';

enum MouseButtons {
  Left = 1,
  Middle = 1 << 1,
  Right = 1 << 2,
  M4 = 1 << 3,
  M5 = 1 << 4,
}

interface DragEvent {
  dataTransfer: any;
  dataKey: string;
  dropTargetID: string;

  screenX: number;
  screenY: number;
  clientX: number;
  clientY: number;
  button: MouseButtons;
  ctrlKey: boolean;
  shiftKey: boolean;
  altKey: boolean;
  metaKey: boolean;
}

interface DNDState {
  isDragging: boolean;

  dataTransfer: any;
  dataKey: string;
  dropTargetID: string;

  lastDragEvent: DragEvent;

  dragRender: () => React.ReactNode;
  dragRenderOffset: Vec2f;

  eventHandles: EventHandle[];

  // Fired when the user starts dragging an element.
  onDragStart: (callback: (e: DragEvent) => any) => EventHandle;

  // Register an event to be called when a drag ends.
  onDragEnd: (callback: (e: DragEvent) => any) => EventHandle;

  // Fired when a dragged element enters a valid drop target.
  onDragEnter: (callback: (e: DragEvent) => any) => EventHandle;

  // Fired when a drag item leaves a valid drop target.
  onDragLeave: (callback: (e: DragEvent) => any) => EventHandle;

  // Fired when a drag item is dropped on a valid drop target.
  onDrop: (callback: (e: DragEvent) => any) => EventHandle;

  // Fired when the user starts dragging an element.
  dragStart: (e: DragEvent) => void;

  // Fired when a drag is being ended (releasing the mouse or hitting esc, not when dropped).
  dragEnd: (e: DragEvent) => any;

  // Fired when a dragged element enters a valid drop target.
  dragEnter?: (event: DragEvent) => any;

  // Fired when a drag item leaves a valid drop target.
  dragLeave?: (event: DragEvent) => any;

  // Fired when a drag item is dropped on a valid drop target.
  drop?: (e: DragEvent) => any;
}

function createListenerRegistration(this: DNDState, eventName: string) {
  return function(callback: (...params: any[]) => any) {
    const handle = game.on(eventName, callback);
    this.eventHandles.push(handle);
    return handle;
  };
}

function creatFireEventMethod(this: DNDState, eventName: string, ...params: any[]) {
  return function(...params: any[]) {
    const handle = game.trigger(eventName, ...params);
    this.eventHandles.push(handle);
    return handle;
  };
}

function initialDNDState(): DNDState {
  return {
    isDragging: false,

    dataTransfer: null,
    dataKey: null,
    dropTargetID: null,

    lastDragEvent: null,

    dragRender: null,
    dragRenderOffset: { x: 0, y: 0 },

    eventHandles: [],

    onDragStart: createListenerRegistration.call(this, 'dnd-state-onDragStart'),
    onDragEnd: createListenerRegistration.call(this, 'dnd-state-onDragEnd'),
    onDragEnter: createListenerRegistration.call(this, 'dnd-state-onDragEnter'),
    onDragLeave: createListenerRegistration.call(this, 'dnd-state-onDragLeave'),
    onDrop: createListenerRegistration.call(this, 'dnd-state-onDrop'),

    dragStart: creatFireEventMethod.call(this, 'dnd-state-onDragStart'),
    dragEnd: creatFireEventMethod.call(this, 'dnd-state-onDragEnd'),
    dragEnter: creatFireEventMethod.call(this, 'dnd-state-onDragEnter'),
    dragLeave: creatFireEventMethod.call(this, 'dnd-state-onDragLeave'),
    drop: creatFireEventMethod.call(this, 'dnd-state-onDrop'),
  };
}

function resetDNDState(state: DNDState): DNDState {
  state.eventHandles.forEach((h) => {
    try {
      h && h.clear();
    } catch {}
  });
  return initialDNDState();
}

const useDNDState = createSharedState('drag-and-drop', initialDNDState(), resetDNDState);

export interface DragProps {
  type: 'drag';
  dataKey: string;
  dataTransfer: any;
  dragRender: () => React.ReactNode;
  dragRenderOffset: Vec2f;

  // Fired when an element is being dragged.
  onDrag?: (e: DragEvent) => any;

  // Fired when the user starts dragging an element.
  onDragStart?: (e: DragEvent) => any;

  // Fired when a drag is being ended (releasing the mouse or hitting esc, not when dropped).
  onDragEnd?: (e: DragEvent) => any;
  children: React.ReactNode;
}

export interface DropProps {
  type: 'drop';
  acceptKeys: string[];

  // Fired when a dragged element enters a valid drop target.
  onDragEnter?: (event: DragEvent) => any;

  // Fired when a drag item leaves a valid drop target.
  onDragLeave?: (event: DragEvent) => any;

  // Fired when a drag item is being dragged over a valid drop target.
  onDragOver?: (event: DragEvent) => any;

  // Fired when a drag item is dropped on a valid drop target.
  onDrop?: (e: DragEvent) => any;
  children: React.ReactNode;
}

export type DragAndDropProps =
  Omit<DragProps, 'type'> & Omit<DropProps, 'type'> & { type: 'drag-and-drop'; };

export type DNDProps = DragProps | DropProps | DragAndDropProps;

const DNDWrapper = styled('div')`
  pointer-events: all;
  display: inline-block;
  width: 100%;
  height: 100%;
`;

function dragEventMouseState(e: React.MouseEvent | MouseEvent) {
  return {
    screenX: e && e.screenX,
    screenY: e && e.screenY,
    clientX: e && e.clientX,
    clientY: e && e.clientY,
    button: e && e.button,
    ctrlKey: e && e.ctrlKey,
    shiftKey: e && e.shiftKey,
    altKey: e && e.altKey,
    metaKey: e && e.metaKey,
  };
}

// tslint:disable-next-line:function-name
export function DragAndDrop(props: DNDProps) {
  const [state, setState] = useDNDState();

  const [internalState, setInternalState] = useState({
    isDragging: false,
    isDragOver: false,
    id: genID(),
  });

  useEffect(() => {
    if (internalState.isDragOver) {

      const handles: EventHandle[] = [];
      if (props.type !== 'drag') {
        if (props.onDrop) {
          handles.push(state.onDrop(e => props.onDrop({
            ...e,
          })));
        }
      }

      return () => {
        handles.forEach(h => h.clear());
      };
    }
  }, [internalState.isDragOver]);

  function handleMouseMove(e: MouseEvent) {
    if (props.type !== 'drop') {
      const dragEvent = {
        dataTransfer: props.dataTransfer && props.dataTransfer,
        dataKey: props.dataKey || '',
        dropTargetID: props.type === 'drag-and-drop' ? internalState.id : null,
        ...dragEventMouseState(e),
      };
      setState({
        ...state,
        isDragging: true,
        dataTransfer: props.dataTransfer,
        dataKey: props.dataKey,
        dropTargetID: props.type === 'drag-and-drop' ? internalState.id : null,
        lastDragEvent: dragEvent,
        dragRender: props.dragRender,
        dragRenderOffset: props.dragRenderOffset,
      });
      setInternalState({
        ...internalState,
        isDragging: true,
        isDragOver: props.type === 'drag-and-drop',
      });
      state.dragStart(dragEvent);
      if (props.onDragStart) {
        props.onDragStart(dragEvent);
      }
      if (props.onDragEnd) {
        state.onDragEnd(props.onDragEnd);
      }
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    }
  }

  function handleMouseUp(e: MouseEvent) {
    window.removeEventListener('mousemove', handleMouseMove);
    window.removeEventListener('mouseup', handleMouseUp);
  }

  function handleMouseDown(e: React.MouseEvent) {
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
  }

  function handleMouseEnter(e: React.MouseEvent) {
    if (props.type !== 'drag') {
      setState({
        ...state,
        dropTargetID: internalState.id,
      });

      setInternalState({
        ...internalState,
        isDragOver: true,
      });
    }
  }

  function handleMouseLeave(e: React.MouseEvent) {
    if (props.type !== 'drag') {
      setState({
        ...state,
        dropTargetID: '',
      });

      setInternalState({
        ...internalState,
        isDragOver: false,
      });
    }
  }

  const { children } = props as any;
  return (
    <DNDWrapper
      onMouseDown={(e: React.MouseEvent) => {
        if (props.type !== 'drop') {
          handleMouseDown(e);
        }
      }}
      onMouseEnter={(e: React.MouseEvent) => {
        if (props.type !== 'drag') {
          handleMouseEnter(e);
        }
      }}
      onMouseLeave={(e: React.MouseEvent) => {
        if (props.type !== 'drag') {
          handleMouseLeave(e);
        }
      }}
    >
      {children}
    </DNDWrapper>
  );
}

const RenderWrapper = styled('div')`
  position: fixed;
  pointer-events: none !important;
  z-index: 9999;
`;

// tslint:disable-next-line:function-name
export function DragAndDropV2Renderer() {

  const [state,, resetState] = useDNDState();
  const [mousePosition, setMousePosition] = useState({
    x: -1000,
    y: -1000,
  });

  useEffect(() => {
    if (state.isDragging) {
      window.addEventListener('mousemove', updateMousePosition);
      window.addEventListener('mouseup', handleMouseUp);
      const handle = state.onDragEnd(dragEnd);
      return () => {
        window.removeEventListener('mousemove', updateMousePosition);
        window.removeEventListener('mouseup', handleMouseUp);
        handle.clear();
      };
    }
  }, [state.isDragging, state.dropTargetID]);

  function updateMousePosition(e: MouseEvent) {
    setMousePosition({
      x: e.clientX,
      y: e.clientY,
    });
  }

  function handleMouseUp(e: MouseEvent) {
    const dragEvent: DragEvent = {
      dataTransfer: state.dataTransfer,
      dataKey: state.dataKey,
      dropTargetID: state.dropTargetID,
      ...dragEventMouseState(e),
    };
    state.dragEnd(dragEvent);
    state.drop(dragEvent);
    resetState();
  }

  function dragEnd() {
    setMousePosition({
      x: -1000,
      y: -1000,
    });
  }

  if (!state.isDragging) {
    return null;
  }

  const left = mousePosition.x + state.dragRenderOffset.x;
  const top = mousePosition.y + state.dragRenderOffset.y;

  return (
    <RenderWrapper
      id='dnd-v2-renderer'
      style={{
        top: top + 'px',
        left: left + 'px',
      }}
    >
      {state.isDragging && state.dragRender()}
    </RenderWrapper>
  );
}
