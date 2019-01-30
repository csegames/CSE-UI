/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import React, { useState, useEffect } from 'react';
import { getViewportSize } from 'lib/viewport';

export interface DragMoveEvent {
  position: Vec2f;
  lastPosition: Vec2f;
  move: Vec2f;
}

export interface DragMoveProps {

  initialPosition: Vec2f;
  children: React.ReactNode;

  // fixed position, this will mean you need to use onMove event
  // to actually move the element
  position?: Vec2f;
  dragBoundary?: 'window' | {
    x: number;
    y: number;
    width: number;
    height: number;
  };

  onMove?: (e: DragMoveEvent) => any;
  onDragStart?: () => any;
  onDragEnd?: () => any;
}

// tslint:disable-next-line:function-name
export function DragMove(props: DragMoveProps) {

  const [state, setState] = useState({
    isDragging: false,
    position: props.position || props.initialPosition,
    lastMousePosition: {
      clientX: -1000,
      clientY: -1000,
    },
    elBounds: {
      x: 0,
      y: 0,
      bottom: 0,
      top: 0,
      width: 0,
      height: 0,
    } as ClientRect | DOMRect,
  });

  function getNewPosition(move: Vec2f): Vec2f {
    const newPos = {
      x: state.position.x + move.x,
      y: state.position.y + move.y,
    };

    if (state.elBounds && props.dragBoundary) {

      if (props.dragBoundary === 'window') {
        const viewport = getViewportSize();

        if (newPos.x < 0) {
          newPos.x = 0;
        } else if (newPos.x + state.elBounds.width > viewport.width) {
          newPos.x = viewport.width - state.elBounds.width;
        }

        if (newPos.y < 0) {
          newPos.y = 0;
        } else if (newPos.y + state.elBounds.height > viewport.height) {
          newPos.y = viewport.height - state.elBounds.height;
        }

      } else {

        const rightBounds = props.dragBoundary.x + props.dragBoundary.width;
        const bottomBounds = props.dragBoundary.y + props.dragBoundary.height;

        if (newPos.x < props.dragBoundary.x) {
          newPos.x = props.dragBoundary.x;
        } else if (newPos.x + state.elBounds.width > rightBounds) {
          newPos.x = rightBounds - state.elBounds.width;
        }

        if (newPos.y < 0) {
          newPos.y = 0;
        } else if (newPos.y + state.elBounds.height > bottomBounds) {
          newPos.y = bottomBounds - state.elBounds.height;
        }
      }
    }

    return newPos;
  }

  useEffect(() => {
    if (!state.isDragging) return;
    props.onDragStart && props.onDragStart();

    function mouseMove(e: MouseEvent) {
      const move = {
        x: e.clientX - state.lastMousePosition.clientX,
        y: e.clientY - state.lastMousePosition.clientY,
      };
      const newPos = getNewPosition(move);
      props.onMove && props.onMove({
        position: newPos,
        lastPosition: state.position,
        move,
      });
      setState({
        ...state,
        position: props.position || newPos,
        lastMousePosition: {
          clientX: e.clientX,
          clientY: e.clientY,
        },
      });
    }

    function mouseUp(e: MouseEvent) {
      const move = {
        x: e.clientX - state.lastMousePosition.clientX,
        y: e.clientY - state.lastMousePosition.clientY,
      };
      const newPos = getNewPosition(move);
      props.onMove && props.onMove({
        position: newPos,
        lastPosition: state.position,
        move,
      });
      setState({
        ...state,
        position: props.position || newPos,
        lastMousePosition: {
          clientX: e.clientX,
          clientY: e.clientY,
        },
        isDragging: false,
      });
      props.onDragEnd && props.onDragEnd();
    }

    window.addEventListener('mousemove', mouseMove);
    window.addEventListener('mouseup', mouseUp);

    return () => {
      window.removeEventListener('mousemove', mouseMove);
      window.removeEventListener('mouseup', mouseUp);
    };
  }, [state.isDragging]);

  function handleMouseDown(e: React.MouseEvent) {
    setState({
      ...state,
      isDragging: true,
      lastMousePosition: {
        clientX: e.clientX,
        clientY: e.clientY,
      },
    });
  }

  const { children } = props as any;

  if (!children) {
    return null;
  }

  if (typeof children === 'string') {
    return (
      <span
        onMouseDown={handleMouseDown}
        ref={(r) => {
          setState({
            ...state,
            elBounds: r.getBoundingClientRect(),
          });
        }
      }>
        {children}
      </span>
    );
  }

  if (Array.isArray(children)) {
    console.warn('DragMove can only have one child element!');
    return null;
  }

  const newElement = React.cloneElement(children as any, {
    onMouseDown: (e) => {
      handleMouseDown(e);
      if (children.props && children.props.onMouseDown) {
        children.props.onMouseDown.call(newElement, e);
      }
    },
    ref: (r: any) => {
      if (!r || !r.getBoundingClientRect) return;
      const elBounds = (r as HTMLElement).getBoundingClientRect();
      if (state.elBounds.width !== elBounds.width || state.elBounds.height !== elBounds.height) {
        setState({
          ...state,
          elBounds,
        });
      }
    },
    // to work with emotion styled components
    innerRef: (r: any) => {
      if (!r || !r.getBoundingClientRect) return;
      const elBounds = (r as HTMLElement).getBoundingClientRect();
      if (state.elBounds.width !== elBounds.width || state.elBounds.height !== elBounds.height) {
        setState({
          ...state,
          elBounds,
        });
      }
    },
  });
  return newElement;
}
