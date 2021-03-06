/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import React, { useContext, useState, useEffect } from 'react';
import { styled } from '@csegames/linaria/react';

import {
  ActionViewContextState,
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
  top: ${(props: ContainerProps) => props.y}%;
  left: ${(props: ContainerProps) => props.x}%;
  transform: translate(-50%, -50%);
  z-index: 9999;
`;

type BoundingRectProps = {top: number; left: number; width: number; height: number;} & React.HTMLProps<HTMLDivElement>;
const BoundingRect = styled.div`
  position: fixed;
  transform: translate(-50%, -50%);
  top: ${(props: BoundingRectProps) => props.top}%;
  left: ${(props: BoundingRectProps) => props.left}%;
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
  actionView: ActionViewContextState;
}

// tslint:disable-next-line:function-name
export function ActionBarAnchor(props: ActionBarAnchorProps) {
  const { actionView } = props;
  const isVisible = actionView.anchorIdToVisibility[props.id] || false;

  if (!isVisible) {
    return null;
  }

  const [viewport, setViewport] = useState(getViewportSize());
  const [dragPositionPercentage, setDragPositionPercentage] = useState(props.positionPercentage);
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
  const inEditMode = actionView.editMode !== EditMode.Disabled && actionView.editMode !== EditMode.Changing;

  useEffect(() => {
    window.addEventListener('optimizedResize', handleViewportResize);

    return () => {
      window.removeEventListener('optimizedResize', handleViewportResize);
    };
  }, [viewport]);

  useEffect(() => {
    if (ref) {
      setBounds(getBoundsWithChildren(ref));
    }
  }, [ref, inEditMode]);

  function handleMouseDown(e: React.MouseEvent) {
    if (e.button !== 0) return;

    // if ctrl+click, go to previous
    if (e.ctrlKey) {
      actionView.activatePrevGroup(props.id);
      return;
    }

    actionView.activateNextGroup(props.id);
  }

  function handleWheel(e: React.WheelEvent) {
    if (e.deltaY < 0) {
      actionView.activatePrevGroup(props.id);
      return;
    }

    actionView.activateNextGroup(props.id);
  }

  function handleViewportResize() {
    setViewport(getViewportSize());
  }

  function getPositionX() {
    if (((dragPositionPercentage.x / 100) * viewport.width) + (bounds.width / 2) > viewport.width) {
      const clampedPos = viewport.width - (bounds.width / 2);
      return (clampedPos / viewport.width) * 100;
    }

    return dragPositionPercentage.x;
  }

  function getPositionY() {
    if (((dragPositionPercentage.y / 100) * viewport.height) + (bounds.height / 2) > viewport.height) {
      const clampedPos = viewport.height - (bounds.height / 2);
      return (clampedPos / viewport.height) * 100;
    }

    return dragPositionPercentage.y;
  }

  function contextMenuItems() {
    const items = [];

    if (isSystemAnchorId(props.id)) {
      return [];
    }

    if (actionView.editMode === EditMode.Changing) {
      return [];
    }

    if (inEditMode) {

      if (props.groups.length < MAX_GROUP_COUNT) {
        items.push({
          title: `Add New Group (${props.groups.length + 1})`,
          onSelected: () => actionView.addGroup(props.id),
        });
      }

      if (props.groups.length > 1) {
        items.push({
          title: `Remove Group ${props.activeGroupIndex + 1}`,
          onSelected: () => actionView.removeGroup(props.id, props.groups[props.activeGroupIndex]),
        });
      }

      items.push({
        title: 'Add anchor',
        onSelected: () => actionView.addAnchor(),
      });

      if (Object.keys(actionView.anchors).filter(anchor => !isSystemAnchorId(Number(anchor))).length > 1) {
        items.push({
          title: 'Delete anchor',
          onSelected: () => actionView.removeAnchor(props.id),
        });
      }

      items.push({
        title: 'Exit Bar Editor',
        onSelected: () => actionView.disableEditMode(),
      });
    } else {
      items.push({
        title: 'Edit Action Bar',
        onSelected: () => actionView.enableActionEditMode(),
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
              x: e.mouse.x,
              y: e.mouse.y,
            };

            if (newPos.x < 0) {
              newPos.x = 0;
            } else if (newPos.x + (bounds.width / 2) > viewport.width) {
              newPos.x = viewport.width - (bounds.width / 2);
            }

            if (newPos.y < 0) {
              newPos.y = 0;
            } else if (newPos.y + (bounds.height / 2) > viewport.height) {
              newPos.y = viewport.height - (bounds.height / 2);
            }

            if (Vec2fExt.equals(props.positionPercentage, newPos)) return;

            const x = (newPos.x / viewport.width) * 100;
            const y = (newPos.y / viewport.height) * 100;
            setDragPositionPercentage({ x, y });
          }}

          onDragEnd={() => {
            actionView.setAnchorPosition(props.id, dragPositionPercentage);
          }}
        >
          <BoundingRect
            top={dragPositionPercentage.y}
            left={dragPositionPercentage.x}
            width={bounds.width}
            height={bounds.height}/>
        </Drag>)
      }
      <Container
        {...display}
        x={getPositionX()}
        y={getPositionY()}
        ref={r => setRef(r)}
      >
        {
          props.children.map(slotID => (
            <ActionBarSlot
              key={slotID}
              sumAngle={0}
              activeGroup={props.groups[props.activeGroupIndex]}
              actionView={actionView}
              {...actionView.slots[slotID]}
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
