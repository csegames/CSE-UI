/*
* This Source Code Form is subject to the terms of the Mozilla Public
* License, v. 2.0. If a copy of the MPL was not distributed with this
* file, You can obtain one at http://mozilla.org/MPL/2.0/.
*/

import * as React from 'react';
import { styled } from 'linaria/react';
import { Dialog } from 'components/UI/Dialog';
import { DropDownSelect } from '@csegames/camelot-unchained/lib/components/DropDownSelect';
import { CheckInput } from 'components/UI/CheckInput';

const Container = styled.div`
  position: fixed;
  left: 50%;
  top: 50%;
  transform: translateX(-50%) translateY(-50%);
  width: 300px;
  pointer-events: auto;
  z-index: 1;
`;

const Content = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-items: center;
  justify-content: space-around;
  color: #ececec;
  padding-top: 10px;
  overflow: visible;
  box-sizing: border-box!important;
  min-height: 150px;
`;

const ReplacementField = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-items: center;
  justify-content: space-between;
  align-content: space-between;
  color: #ececec;
  padding-top: 10px;
  background-image: url(/hud-new/images/settings/bag-bg-grey.png);
  background-repeat: no-repeat;
  background-position: top center;
  overflow: visible;
  box-sizing: border-box!important;
  min-height: 150px;
`;

export const Btn = styled.div`
  position: relative;
  pointer-events: all;
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 170px;
  height: 50px;
  margin: 5px;
  text-align: center;
  font-family: Caudex;
  border-image: linear-gradient(180deg, #e2cb8e, #8e6d27) stretch;
  border-style: solid;
  border-width: 3px 1px;
  transition: background-color .3s;
  background-color: rgba(17, 17, 17, 0.8);
  border-image-slice: 1;
  color: ${(props: any) => props.textColor ? props.textColor : '#B89969'};
  cursor: pointer;
  opacity: ${(props: any) => props.disabled ? 0.5 : 1};
  font-size: 14px;
  letter-spacing: 2px;
  text-transform: uppercase;
  -webkit-mask-image: url(/hud-new/images/button-mask.png);
  -webkit-mask-repeat: no-repeat;
  -webkit-mask-size: cover;
  transition: all ease .2s;
  text-decoration: none;
  &:hover {
    background-color: ${(props: any) => props.disabled ? '' : 'rgba(36, 28, 28, 0.8)'};
    border-image-slice: 1;
    color: ${(props: any) => props.disabled ? '' : '#ffd695'};
  }
`;

const Image = styled.img`
  width: 64px;
  height: 64px;
`;

// tslint:disable-next-line:function-name
export function ReplaceDialog() {

  const [visible, setVisible] = React.useState(false);
  const materials = Object.values(game.building.materials) as Material[];
  const [fromMat, setFromMat] = React.useState(materials[0]);
  const [toMat, setToMat] = React.useState(materials[1]);
  const [useSelection, setSelection] = React.useState(true);

  React.useEffect(() => {
    console.log('using effect replace dialog');
    const matReplaceHandle = game.onWantReplaceMaterial(() => {
      console.log('Replace Dialog - set visible ' + !visible);
      setVisible(!visible);
    });

    return () => {
      console.log('cleaning up effect replace dialog');
      matReplaceHandle.clear();
    };
  }, []);

  return visible ? (
    <Container className='cse-ui-scroller-thumbonly' data-input-group='block'>
      <Dialog title='Create Blueprint' onClose={() => setVisible(false)}>
        <Content>
          <ReplacementField>
            <DropDownSelect
              items={materials}
              selectedItem={fromMat}
              onSelectedItemChaned={mat => setFromMat(mat)}
              renderListItem={mat => <Image src={'data:image/png;base64,' + mat.icon}/>}
              renderSelectedItem={mat => <Image src={'data:image/png;base64,' + mat.icon}/>}
            />
            <span>-&gt;</span>
            <DropDownSelect
              items={materials}
              selectedItem={toMat}
              onSelectedItemChaned={mat => setToMat(mat)}
              renderListItem={mat => <Image src={'data:image/png;base64,' + mat.icon}/>}
              renderSelectedItem={mat => <Image src={'data:image/png;base64,' + mat.icon}/>}
            />
          </ReplacementField>
          <div>
            <CheckInput
              name='selection'
              checked={useSelection}
              onChange={e => setSelection(e.target.checked)}></CheckInput>
            <label htmlFor='selection'>In Selection</label>
          </div>
          <Btn onClick={() => game.building.replaceMaterialsAsync(fromMat.id, toMat.id, useSelection)}>Replace</Btn>
        </Content>
      </Dialog>
    </Container>
  ) : null;
}
