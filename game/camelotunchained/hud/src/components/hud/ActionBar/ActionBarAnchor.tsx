/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import React, { useContext, useState, useEffect } from 'react';
import { styled } from '@csegames/linaria/react';

import {
  ActionViewContext,
  ActionViewAnchor,
  EditMode,
  MAX_GROUP_COUNT,
  isSystemAnchorId,
} from '../../context/ActionViewContext';
import { ActionBarSlot } from './ActionBarSlot';
import { ContextMenu } from 'shared/ContextMenu';
import { Drag } from 'utils/Drag';
import { getViewportSize } from 'hudlib/viewport';

type IMGProps = { radius: number, src: string } & React.HTMLProps<HTMLImageElement>;
const IMG = styled.img`
  width: ${(props: IMGProps) => props.radius * 2}px;
  height: ${(props: IMGProps) => props.radius * 2}px;
`;

const AnchorWrapper = styled.div`
  position: absolute;
  top: 0;
  left: 0;
`;

type ContainerProps = { radius: number; x: number; y: number; } & React.HTMLProps<HTMLDivElement>;
const Container = styled.div`
  display: flex;
  position: fixed;
  top: ${(props: ContainerProps) => props.y}px;
  left: ${(props: ContainerProps) => props.x}px;
  z-index: 9999;
`;

type BoundingRectProps = {top: number; left: number; width: number; height: number;} & React.HTMLProps<HTMLDivElement>;
const BoundingRect = styled.div`
  position: fixed;
  top: ${(props: BoundingRectProps) => props.top}px;
  left: ${(props: BoundingRectProps) => props.left}px;
  width: ${(props: BoundingRectProps) => props.width}px;
  height: ${(props: BoundingRectProps) => props.height}px;
  border: 2px solid rgba(255, 215, 0, 0.6);
  cursor: move;
  background: rgba(0, 100, 100, 0.2);
  z-index: 9999;
  &:hover {
    background: rgba(0, 100, 100, 0.4);
  }
`;


function getBoundsWithChildren(element: Element) {
  const myBoundingRect = element.getBoundingClientRect();
  const bounds = {
    width: myBoundingRect.width,
    height: myBoundingRect.height,
    top: myBoundingRect.top,
    left: myBoundingRect.left,
  };

  const children = element.children;
  for (let i = 0; i < children.length; ++i) {
    const current = getBoundsWithChildren(children[i]);
    if (current.width === 0 || current.height === 0) continue;

    if (current.left < bounds.left) {
      bounds.width += bounds.left - current.left;
      bounds.left = current.left;
      if (current.width > bounds.width) {
        bounds.width = current.width;
      }
    } else {
      const currentRight = current.left + current.width;
      const boundsRight = bounds.left + bounds.width;
      if (currentRight > boundsRight) {
        bounds.width += (currentRight - boundsRight);
      }
    }

    if (current.top < bounds.top) {
      bounds.height += bounds.top - current.top;
      bounds.top = current.top;
      if (current.height > bounds.height) {
        bounds.height = current.height;
      }
    } else {
      const currentBottom = current.top + current.height;
      const boundsBottom = bounds.top + bounds.height;
      if (currentBottom > boundsBottom) {
        bounds.height += (currentBottom - boundsBottom);
      }
    }
  }
  return bounds;
}

export interface ActionBarAnchorProps extends ActionViewAnchor {
}

// tslint:disable-next-line:function-name
export function ActionBarAnchor(props: ActionBarAnchorProps) {
  const actionViewContext = useContext(ActionViewContext);
  const [isVisible, setIsVisible] = useState(isSystemAnchorId(props.id) ? false : true);
  const [ref, setRef] = useState(null);
  const [bounds, setBounds] = useState({
    width: 0,
    height: 0,
    left: 0,
    top: 0,
  });

  const ui = useContext(UIContext);
  const theme = ui.currentTheme();
  const display = ui.isUHD() ? theme.actionButtons.display.uhd : theme.actionButtons.display.hd;
  const faction = FactionExt.abbreviation(camelotunchained.game.selfPlayerState.faction);
  const definition = ui.isUHD() ? 'uhd' : 'hd';

  const inEditMode = actionViewContext.editMode !== EditMode.Disabled;
  useEffect(() => {
    if (ref) {
      setBounds(getBoundsWithChildren(ref));
    }
  }, [ref, inEditMode]);

  useEffect(() => {
    const handle = game.onAnchorVisibilityChanged((anchorId: number, visible: boolean) => {
      if (anchorId === props.id) {
        setIsVisible(visible);
      }
    });

    return () => {
      handle.clear();
    }
  });

  function handleMouseDown(e: React.MouseEvent) {

    if (e.button !== 0) return;

    // if ctrl+click, go to previous
    if (e.ctrlKey) {
      actionViewContext.activatePrevGroup(props.id);
      return;
    }

    actionViewContext.activateNextGroup(props.id);
  }

  function handleWheel(e: React.WheelEvent) {
    if (e.deltaY < 0) {
      actionViewContext.activatePrevGroup(props.id);
      return;
    }

    actionViewContext.activateNextGroup(props.id);
  }

  function contextMenuItems() {
    const items = [];

    if (actionViewContext.editMode > 0) {

      if (props.groups.length < MAX_GROUP_COUNT) {
        items.push({
          title: `Add New Group (${props.groups.length + 1})`,
          onSelected: () => actionViewContext.addGroup(props.id),
        });
      }

      if (props.groups.length > 1) {
        items.push({
          title: `Remove Group ${props.activeGroupIndex + 1}`,
          onSelected: () => actionViewContext.removeGroup(props.id, props.groups[props.activeGroupIndex]),
        });
      }

      items.push({
        title: 'Add anchor',
        onSelected: () => actionViewContext.addAnchor(),
      });

      if (Object.keys(actionViewContext.anchors).length > 1) {
        items.push({
          title: 'Delete anchor',
          onSelected: () => actionViewContext.removeAnchor(props.id),
        });
      }

      items.push({
        title: 'Exit Bar Editor',
        onSelected: () => actionViewContext.disableEditMode(),
      });
    } else {
      items.push({
        title: 'Edit Action Bar',
        onSelected: () => actionViewContext.enableActionEditMode(),
      });
    }

    return items;
  }

  return isVisible ? (
    <>
      {inEditMode && (
        <Drag
          onDrag={(e) => {
            const newPos = {
              x: props.position.x + e.move.x,
              y: props.position.y + e.move.y,
            };

            const viewport = getViewportSize();
            if (newPos.x < 0) {
              newPos.x = 0;
            } else if (newPos.x + bounds.width > viewport.width) {
              newPos.x = viewport.width - bounds.width;
            }

            if (newPos.y < 0) {
              newPos.y = 0;
            } else if (newPos.y + bounds.height > viewport.height) {
              newPos.y = viewport.height - bounds.height;
            }

            if (Vec2fExt.equals(props.position, newPos)) return;

            actionViewContext.setAnchorPosition(props.id, newPos);
          }}
        >
          <BoundingRect
            top={props.position.y}
            left={props.position.x}
            width={bounds.width}
            height={bounds.height}/>
        </Drag>)
      }
      <Container
        {...display}
        {...props.position}
        ref={r => setRef(r)}
      >
        {
          props.children.map(slotID => (
            <ActionBarSlot
              key={slotID}
              sumAngle={0}
              activeGroup={props.groups[props.activeGroupIndex]}
              {...actionViewContext.slots[slotID]}
            />
          ))
        }
        <ContextMenu
          type='items'
          getItems={contextMenuItems}
        >
          <AnchorWrapper
            onMouseDown={handleMouseDown}
            onWheel={handleWheel}
          >
            <IMG
              draggable={false}
              radius={display.radius}
              src={`images/anchor/${definition}/${faction}-dock-${props.activeGroupIndex + 1}.png`}
            />
          </AnchorWrapper>
        </ContextMenu>
      </Container>
    </>
  ) : null;
}
