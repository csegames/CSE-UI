/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 * @Author: Mehuge (mehuge@sorcerer.co.uk)
 * @Date: 2017-05-20 18:42:59
 * @Last Modified by: Mehuge (mehuge@sorcerer.co.uk)
 * @Last Modified time: 2017-06-13 20:14:35
 */

import * as React from 'react';
import { connect } from 'react-redux';
import { GlobalState } from '../../services/session/reducer';
import { StyleSheet, css, merge, tools, ToolsStyles } from '../../styles';

// Helpers
import { slash } from '../../services/game/slash';

import { setMessage } from '../../services/session/job';
import { setCountdown } from '../../services/session/ui';

import Input from '../Input';
import Button from '../Button';
import VoxMessage from '../VoxMessage';

export interface ToolsPropsRedux {
  dispatch?: (action: any) => void;
  countdown?: number;
}

const select = (state: GlobalState, props: ToolsProps) : ToolsPropsRedux => {
  return { countdown: state.ui.countdown };
};

export interface ToolsProps extends ToolsPropsRedux {
  style?: Partial<ToolsStyles>;
  dispatch: (action: any) => void;
}

interface ToolsState {
  range: number;
  voxStatus: string;
  durability: number;
  points: number;
  resources: number;
  alloyId: string;
}

interface MakeButton {
  label: string;
  click: () => void;
  disabled?: boolean;
}

interface MakeInput {
  get: () => string;
  change: (value: string) => void;
  size: number;
  numeric?: boolean;
  min?: number;
  max?: number;
}

class Tools extends React.Component<ToolsProps, ToolsState> {
  constructor(props: ToolsProps) {
    super(props);
    this.state = {
      range: 1000,
      voxStatus: undefined,
      durability: 50,
      points: 100,
      resources: 1,
      alloyId: undefined,
    };
  }
  public render() {
    const ss = StyleSheet.create(merge({}, tools, this.props.style));

    const makeButton = (args: MakeButton) => {
      return (
        <Button disabled={args.disabled} style={{ button: tools.button }} onClick={args.click}>
          {args.label}
        </Button>
      );
    };

    const makeInput = (args: MakeInput) => {
      return (
        <Input size={args.size} numeric={args.numeric} min={args.min} max={args.max}
          onChange={args.change} value={args.get()}/>
      );
    };

    return (
      <div className={css(ss.tools)}>
        <div className={css(ss.section)}>
          <h1 className={css(ss.sectionHeading)}>Resources</h1>

          <div>
            { makeButton({
              label: '/cr nearby',
              click: () => this.slash('cr nearby ' + this.state.range, 'Check the System Tab!'),
            })}
            { makeInput({
              get: () => this.state.range.toString(),
              change: (value: string) => this.setState({ range: (value as any) | 0 }),
              size: 4, numeric: true, min: 0, max: 1000,
            })}
          </div>

          <div>
            { makeButton({
              label: '/harvestinfo',
              click: () => this.slash('harvestinfo', 'Check the System Tab!'),
            })}
          </div>

          <div>
            { makeButton({
              label: '/harvest' + (this.props.countdown ? ' [' + this.props.countdown + ']' : ''),
              click: () => this.harvest,
              disabled: this.props.countdown > 0,
            })}
            Harvest nearby resources.
          </div>
        </div>

        <div className={css(ss.section)}>
          <h1 className={css(ss.sectionHeading)}>Admin Commands</h1>

          <div>
            { makeButton({
              label: '/cr vox create',
              click: () => this.slash('cr vox create', 'Vox created'),
            })}
            { makeButton({
              label: '/cr vox forcefinish',
              click: () => this.slash('cr vox forcefinish', 'Forced vox to finish'),
            })}
          </div>

          <div>
            { makeButton({
              label: '/cr resources',
              click: () => this.slash('cr resources ' + this.state.resources, 'Check your inventory'),
            })}
            { makeInput({
              get: () => this.state.resources.toString(),
              change: (value: string) => this.setState({ resources: (value as any) | 0 }),
              size: 2, numeric: true, min: 1, max: 20,
            })}
          </div>

          <div>
            { makeButton({
              label: '/cr specific',
              click: () => this.slash('cr specific ' + this.state.alloyId, 'Check your inventory'),
            })}
            { makeInput({
              get: () => this.state.alloyId,
              change: (value: string) => this.setState({ alloyId: value }),
              size: 20,
            })}
          </div>

          <div>
            { makeButton({
              label: '/setequipmentrepairpoints',
              click: () => this.slash('setequipmentrepairpoints ' + this.state.points, 'Points set'),
            })}
            { makeInput({
              get: () => this.state.points.toString(),
              change: (value: string) => this.setState({ points: (value as any) | 0 }),
              size: 4, numeric: true, min: 0, max: 100,
            })}
          </div>

          <div>
            { makeButton({
              label: '/setequipmentdurability',
              click: () => this.slash('setequipmentdurability ' + this.state.durability, 'Durability set'),
            })}
            { makeInput({
              get: () => this.state.durability.toString(),
              change: (value: string) => this.setState({ durability: (value as any) | 0 }),
              size: 5, numeric: true, min: 0, max: 100,
            })}
          </div>
        </div>
        <VoxMessage/>
      </div>
    );
  }

  private slash(command: string, success: string, getAction?: () => any, errorAction?: () => any) {
    const props = this.props;
    slash(command, (response: any) => {
      if (response.errors) {
        if (errorAction) props.dispatch(errorAction());
        props.dispatch(setMessage({ type: 'error', message: response.errors[0] }));
      } else {
        if (getAction) props.dispatch(getAction());
        props.dispatch(setMessage({ type: 'success', message: success }));
      }
    });
  }

  private harvest = () => {
    this.slash('harvest', 'Check your Inventory!');
    let countdown = 10;
    const tick = () => {
      this.props.dispatch(setCountdown(countdown));
      if (countdown > 0) {
        setTimeout(() => { countdown--; tick(); }, 1000);
      }
    };
    tick();
  }
}

export default connect(select)(Tools);
