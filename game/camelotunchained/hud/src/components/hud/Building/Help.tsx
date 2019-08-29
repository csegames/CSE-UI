/*
* This Source Code Form is subject to the terms of the Mozilla Public
* License, v. 2.0. If a copy of the MPL was not distributed with this
* file, You can obtain one at http://mozilla.org/MPL/2.0/.
*/

import * as React from 'react';
import { styled } from '@csegames/linaria/react';
import { Btn } from './BlueprintNameDialog';

const Container = styled.div`
  flex: 1 1 auto;
  padding-top: 10px;
  overflow: auto;
  box-sizing: border-box!important;
  pointer-events: auto;
  display: grid;
  grid-template:
     'controls buttons' auto
     'controls extra' auto
     / 50% 50%;
  color: #ececec;
`;

const Controls = styled.div`
  grid-area: controls;
  padding: 5px;
  border-right 1px solid #444;
`;

const Control = styled.div`
  display: grid;
  grid-template:
    'keybind label' auto
    / 100px auto;
  margin-bottom: 5px;
`;

const ControlKeybind = styled.div`
  grid-area: keybind;
  border: 1px solid #444;
  padding: 5px;
  text-align: center;
`;

const ControlLabel = styled.div`
  grid-area: label;
`;

const Buttons = styled.div`
  grid-area: buttons;
  padding: 5px;
  border-bottom 1px solid #444;
`;

const Extra = styled.div`
  grid-area: extra;
  padding: 5px;
  border-bottom 1px solid #444;
`;

export const Help = function() {
  return (
    <Container className='cse-ui-scroller-thumbonly'>
      <Controls>
      <Control>
          <ControlKeybind>Alt</ControlKeybind>
          <ControlLabel>Toggle Building Selection Interface (this element).</ControlLabel>
        </Control>
        <Control>
          <ControlKeybind>
            {camelotunchained.game.getKeybindSafe(camelotunchained.game.keyActions.SelectionModeToggle).binds[0].name}
          </ControlKeybind>
          <ControlLabel>Toggle Selection/Placement Mode</ControlLabel>
        </Control>
        <Control>
          <ControlKeybind>
            {camelotunchained.game.getKeybindSafe(camelotunchained.game.keyActions.CubeCommitBlock).binds[0].name}
          </ControlKeybind>
          <ControlLabel>Commit Action - Place (in Placement Mode) or Remove (in Selection Mode)</ControlLabel>
        </Control>
        <Control>
          <ControlKeybind>
            {camelotunchained.game.getKeybindSafe(camelotunchained.game.keyActions.CubeUndoBlockPlacement).binds[0].name}
          </ControlKeybind>
          <ControlLabel>Deselect blocks</ControlLabel>
        </Control>
        <Control>
          <ControlKeybind>
            {camelotunchained.game.getKeybindSafe(camelotunchained.game.keyActions.CubeRotateBlockX).binds[0].name}
          </ControlKeybind>
          <ControlLabel>Rotate 90&deg; around the X axis</ControlLabel>
        </Control>
        <Control>
          <ControlKeybind>
            {camelotunchained.game.getKeybindSafe(camelotunchained.game.keyActions.CubeRotateBlockY).binds[0].name}
          </ControlKeybind>
          <ControlLabel>Rotate 90&deg; around the Y axis</ControlLabel>
        </Control>
        <Control>
          <ControlKeybind>
            {camelotunchained.game.getKeybindSafe(camelotunchained.game.keyActions.CubeRotateBlockZ).binds[0].name}
          </ControlKeybind>
          <ControlLabel>Rotate 90&deg; around the Z axis</ControlLabel>
        </Control>
        <Control>
          <ControlKeybind>
            {camelotunchained.game.getKeybindSafe(camelotunchained.game.keyActions.CubeFlipBlockX).binds[0].name}
          </ControlKeybind>
          <ControlLabel>Flip X faces</ControlLabel>
        </Control>
        <Control>
          <ControlKeybind>
            {camelotunchained.game.getKeybindSafe(camelotunchained.game.keyActions.CubeFlipBlockY).binds[0].name}
          </ControlKeybind>
          <ControlLabel>Flip Y faces</ControlLabel>
        </Control>
        <Control>
          <ControlKeybind>
            {camelotunchained.game.getKeybindSafe(camelotunchained.game.keyActions.CubeFlipBlockZ).binds[0].name}
          </ControlKeybind>
          <ControlLabel>Flip Z faces</ControlLabel>
        </Control>
        <Control>
          <ControlKeybind>
            {camelotunchained.game.getKeybindSafe(
              camelotunchained.game.keyActions.CubeCycleSelectedBlockShape).binds[0].name}
          </ControlKeybind>
          <ControlLabel>Cycle block</ControlLabel>
        </Control>
        <Control>
          <ControlKeybind>
            {camelotunchained.game.getKeybindSafe(
              camelotunchained.game.keyActions.CubeCycleSelectedBlockShape).binds[0].name}
          </ControlKeybind>
          <ControlLabel>Cycle material</ControlLabel>
        </Control>
        <Control>
          <ControlKeybind>
            {camelotunchained.game.getKeybindSafe(camelotunchained.game.keyActions.CubeBuildingCopy).binds[0].name}
          </ControlKeybind>
          <ControlLabel>Copy selected blocks as a temporary blueprint</ControlLabel>
        </Control>
        <Control>
          <ControlKeybind>
            {camelotunchained.game.getKeybindSafe(camelotunchained.game.keyActions.CubeBuildingPaste).binds[0].name}
          </ControlKeybind>
          <ControlLabel>Phantom blueprint becomes the copied blueprint</ControlLabel>
        </Control>
      </Controls>

      <Buttons>
        <Btn onClick={() => game.sendSlashCommand('fly 1')} >Fly Mode On</Btn>
        <Btn onClick={() => game.sendSlashCommand('fly 0')} >Fly Mode Off</Btn>

        <Btn onClick={() => game.sendSlashCommand('showPerfHUD 1')} >Show Perf HUD</Btn>
        <Btn onClick={() => game.sendSlashCommand('showPerfHUD 0')} >Hide Perf HUD</Btn>
      </Buttons>

      <Extra>
        <Control>
          <ControlKeybind>Ctrl+S</ControlKeybind>
          <ControlLabel>Save current selection as a new blueprint.</ControlLabel>
        </Control>
        <Control>
          <ControlKeybind>
            {camelotunchained.game.getKeybindSafe(camelotunchained.game.keyActions.UIHideToggle).binds[0].name}
          </ControlKeybind>
          <ControlLabel>Show / Hide UI &amp; Character</ControlLabel>
        </Control>
        <Control>
          <ControlKeybind>Alt+Left Click</ControlKeybind>
          <ControlLabel>Quick 1 click Place / Remove</ControlLabel>
        </Control>
        <Control>
          <ControlKeybind>Ctrl+Left Click</ControlKeybind>
          <ControlLabel>Set current block to block you click on in the world.</ControlLabel>
        </Control>
        <Control>
          <ControlKeybind>
            {camelotunchained.game.getKeybindSafe(camelotunchained.game.keyActions.UIToggleBuildingMode).binds[0].name}
          </ControlKeybind>
          <ControlLabel>Enter / Leave building mode</ControlLabel>
        </Control>
      </Extra>
    </Container>
  );
};
