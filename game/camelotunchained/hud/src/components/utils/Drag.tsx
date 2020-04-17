/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import React, { useState, useEffect } from 'react';

export interface DragEvent {
  move: Vec2f;
}

export interface DragProps {
  children: React.ReactNode;
  onDrag?: (e: DragEvent) => any;
  onDragStart?: () => any;
  onDragEnd?: () => any;
}

// tslint:disable-next-line:function-name
export function Drag(props: DragProps) {

  const [state, setState] = useState({
    isDragging: false,
    lastMousePosition: {
      clientX: -1000,
      clientY: -1000,
    },
  });

  const mouseMove = (e: MouseEvent) => {
    const move = {
      x: e.clientX - state.lastMousePosition.clientX,
      y: e.clientY - state.lastMousePosition.clientY,
    };

    setState(state => ({
      isDragging: state.isDragging,
      lastMousePosition: {
        clientX: e.clientX,
        clientY: e.clientY,
      },
    }));

    props.onDrag && props.onDrag({
      move,
    });
  };

  const mouseUp = (e: MouseEvent) => {
    const move = {
      x: e.clientX - state.lastMousePosition.clientX,
      y: e.clientY - state.lastMousePosition.clientY,
    };
    props.onDrag && props.onDrag({
      move,
    });
    props.onDragEnd && props.onDragEnd();
    setState({
      isDragging: false,
      lastMousePosition: {
        clientX: e.clientX,
        clientY: e.clientY,
      },
    });
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    setState({
      isDragging: true,
      lastMousePosition: {
        clientX: e.clientX,
        clientY: e.clientY,
      },
    });
  };

  useEffect(() => {
    if (!state.isDragging) return;
    props.onDragStart && props.onDragStart();

    window.addEventListener('mousemove', mouseMove);
    window.addEventListener('mouseup', mouseUp);

    return () => {
      window.removeEventListener('mousemove', mouseMove);
      window.removeEventListener('mouseup', mouseUp);
    };
  }, [state.isDragging]);

  const { children } = props as any;
  if (!children) {
    return null;
  }

  if (typeof children === 'string') {
    return (
      <span onMouseDown={handleMouseDown}>
        {children}
      </span>
    );
  }

  if (Array.isArray(children)) {
    console.warn('Drag can only have one child element!');
    return null;
  }

  const newElement = React.cloneElement(children as any, {
    onMouseDown: (e) => {
      handleMouseDown(e);
      if (children.props && children.props.onMouseDown) {
        children.props.onMouseDown.call(newElement, e);
      }
    },
  });
  return newElement;
}
