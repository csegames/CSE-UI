/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as React from 'react';
import {client, events} from 'camelot-unchained';

export interface CraftingProps {
}

export interface CraftingState {
  commandList: any[],
  activeCommand: string;
}

class Crafting extends React.Component<CraftingProps, CraftingState> {

  constructor(props: CraftingProps) {
    super(props);
    this.state = {
      commandList: [],
      activeCommand: ''
    };
  }

  componentWillMount() {
    this.setState({
      commandList: this.getCommands(),
      activeCommand: ''
    });
  }

  componentWillUnmount() {
    client.ReleaseInputOwnership();
  }

  closeWindow = (): void => {
    client.ReleaseInputOwnership();
    events.fire('hudnav--navigate', 'crafting');
  }

  onCommandFocus = (event: any): void => {
    client.RequestInputOwnership();
  }

  onCommandBlur = (event: any): void => {
    client.ReleaseInputOwnership();
  }

  onCommandChanged = (event: any): void => {
    this.setState({ activeCommand: event.target.value } as any);
  }

  onKeyDown = (event: any) => {
    if (event.key == 'Enter') {
      this.sendCommand();
    }
  }

  sendCommand = (): void => {
    this.state.commandList.forEach((tCmd: any): void => {
      const cutPos: number = this.state.activeCommand.indexOf(tCmd.cmd);
      if (cutPos > -1) {
        const tCmdArgs = this.state.activeCommand.substring(4);
        client.SendSlashCommand('cr ' + tCmdArgs);
      }
    });
    client.ReleaseInputOwnership();
    this.setState({ 'activeCommand': '' } as any);
  }

  getCommands = (): any => {
    const crCommands: any[] = [];

    crCommands.push({
      cmd: '/cr vox cancel',
      desc: 'Cancels the current vox job.'
    });

    crCommands.push({
      cmd: '/cr list inventory',
      desc: 'Lists crafting substances in your inventory.'
    });

    crCommands.push({
      cmd: '/cr list weapons',
      desc: 'Lists weapons that can be made by you.'
    });

    crCommands.push({
      cmd: '/cr list substances',
      desc: 'Lists substances that can be made.'
    });

    crCommands.push({
      cmd: '/cr specific',
      params: '"<substance name>" <quality(%)> <amount(kg)>',
      desc: 'Lists weapons that can be made by you.',
      ex: '/cr specific "Spider Silk" 25 5'
    });

    crCommands.push({
      cmd: '/cr split',
      params: '<entityID> <amount(kg)>',
      desc: 'Splits <entityID> into chunks of <amount(kg)> size each, up to 10 chunks.',
      ex: '/cr split abc123defg456hijk 5'
    });

    crCommands.push({
      cmd: '/cr nearby',
      params: '<range(m)>',
      desc: 'Shows nearby crafting entities such as substances, alloys, or voxes.',
      ex: '/cr nearby 20'
    });

    crCommands.push({
      cmd: '/cr purify',
      params: '<quality(%)> [check|do]',
      desc: 'Will process a nearby substance to <qualtiy (%)>. Requires 1 substance nearby, will randomly select 1 substance if multiple substances are nearby. Substance must be within 5m of vox and within 2m of you.',
      ex: '/cr purify 75 check'
    });

    crCommands.push({
      cmd: '/cr shape',
      params: '"<primary material>" [check|do]',
      desc: 'Will take all nearby substances and shape them into an alloy. Substances must be within 5m of vox and within 2m of you.',
      ex: '/cr shape "Iron" do'
    });

    crCommands.push({
      cmd: '/cr make',
      params: '"<item name>" "[given name]" [check|do]',
      desc: 'Makes the <item name> item, you may optionally specify a [given name]. use /cr list weapons to view currently available items.',
      ex: '/cr make "Sword" "Marc\'s Sword of Amazingness" do'
    });

    crCommands.push({
      cmd: '/cr vox setjob',
      params: '[purify|refine|grind|make]',
      desc: 'Sets the type of crafting job for your vox. If there is a current job it must be cleared before setting a new one',
      ex: '/cr vox setjob'
    });

    crCommands.push({
      cmd: '/cr vox clearjob',
      desc: 'Clears out the current job. All ingredients must be removed from the vox before running this command.'
    });

    crCommands.push({
      cmd: '/cr vox setrecipe',
      params: '"<recipeID>"',
      desc: 'Sets the recipe to be used in the crafting process.',
      ex: '/cr vox setrecipe craft_purify_aluminum'
    });

    crCommands.push({
      cmd: '/cr vox listpossibleingredients',
      desc: 'Lists integredents from your inventory in a numbered list.  This number is used to add the ingredient to the vox'
    });

    crCommands.push({
      cmd: '/cr vox addingredient',
      params: '[ingredient#]',
      desc: 'Takes the item from your inventory and adds it to the vox.',
      ex: '/cr vox addingredient'
    });

    crCommands.push({
      cmd: '/cr vox removeingredient',
      desc: 'Removes the last ingredient from the vox and moves it to your inventory.'
    });

    crCommands.push({
      cmd: '/cr vox setquality',
      params: '[1-100]',
      desc: 'Sets the quality when performing a refine job',
      ex: '/cr vox setquality 50'
    });

    crCommands.push({
      cmd: '/cr vox settemplate',
      params: '[weaponID]',
      desc: 'Sets which weapon to create during a make job.',
      ex: '/cr vox settemplate item_Arthurian_WeaponDagger01'
    });

    crCommands.push({
      cmd: '/cr vox setname',
      params: '[name]',
      desc: 'Sets the custom name for the weapon being made in the vox.',
      ex: '/cr vox setname TheMightySword'
    });

    crCommands.push({
      cmd: '/cr vox status',
      desc: 'Gives details about your nearby vox.'
    });

    crCommands.push({
      cmd: '/cr vox startjob',
      desc: 'Starts the job currently setup in the vox'
    });

    crCommands.push({
      cmd: '/cr vox cancel',
      desc: 'Cancel a job in the running state'
    });

    crCommands.push({
      cmd: '/cr vox collect',
      desc: 'Collect the output of a finished vox job.'
    });

    crCommands.push({
      cmd: '/cr list',
      params: '"<inventory|weapons|armor|substances|munitions|purifyrecipes|refinerecipes|grindrecipes>"',
      desc: 'Lists templates for various types of items and recipes',
      ex: '/cr list substances'
    });

    crCommands.push({
      cmd: '/cr nearby',
      params: '[range]',
      desc: 'Shows nearby crafing entities such as substances, alloys, and voxes.',
      ex: '/cr nearby 20'
    });

    return crCommands;
  }

  render() {
    const cmdList: JSX.Element[] = [];
    let key: number = 0;
    this.state.commandList.forEach((tCmd: any): void => {
      const tParam: JSX.Element = tCmd.hasOwnProperty('params') ? <span className="cmdItem-params">{tCmd.params}</span> : <span></span>;
      const tDesc: JSX.Element = tCmd.hasOwnProperty('desc') ? <div>> {tCmd.desc}</div> : <div></div>;
      const tExample: JSX.Element = tCmd.hasOwnProperty('ex') ? <div className="cmdItem-ex">{tCmd.ex}</div> : <div></div>;
      cmdList.push(
        <div key={key++} className='cmdItem'>
          <div className='cmdItem-cmd'>{tCmd.cmd} {tParam}</div>
          <div className='cmdItem-info'>
            {tDesc}
            {tExample}
          </div>
        </div>
      );
    });
    return (
      <div onKeyDown={this.onKeyDown}>
        <div id="crafting-window" className='crafting-active'>
          <div className="cu-window">
            <div className="cu-window-header">
              <div className="cu-window-title">Crafting Commands</div>
              <div className="cu-window-actions">
                <a onMouseDown={this.closeWindow} className="cu-window-close"></a>
              </div>
            </div>
            <div className="cu-window-content">
              <div className="cmdList">{cmdList}</div>
              <input type="text" id="input-crCmd" value={this.state.activeCommand || '/cr '} onChange={this.onCommandChanged} onFocus={this.onCommandFocus} onBlur={this.onCommandBlur}></input>
              <div id="btn-crSubmit" className="cu-window-btn-small" onClick={this.sendCommand}>Craft!</div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Crafting;
