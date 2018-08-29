/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as React from 'react';
import { connect, DispatchProp } from 'react-redux';
import { StyleSheet, cssAphrodite, merge, tools, ToolsStyles } from '../styles';

// Helpers
import { slash } from '../services/game/slash';

import { setMessage } from '../services/session/job';

import Input from './Input';
import Button from './Button';
import VoxMessage from './VoxMessage';

export interface ToolsOwnProps {
  style?: Partial<ToolsStyles>;
  refresh: () => void;
}

export type ToolsProps = DispatchProp<any> & ToolsOwnProps;

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
  defaultValue?: string;
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
          onChange={args.change} value={args.get() || args.defaultValue}/>
      );
    };

    return (
      <div className={cssAphrodite(ss.tools)}>
        <div className={cssAphrodite(ss.section)}>
          <h1 className={cssAphrodite(ss.sectionHeading)}>Resources</h1>

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
        </div>

        <div className={cssAphrodite(ss.section)}>
          <h1 className={cssAphrodite(ss.sectionHeading)}>Admin Commands</h1>

          <div>
            { makeButton({
              label: '/cr vox create',
              click: () => this.slash('cr vox create', 'Vox created'),
            })}
            { makeButton({
              label: '/cr vox forcefinish',
              click: () => this.forceFinish(),
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
              click: () => this.slash('cr specific ' + this.state.alloyId, 'Check the ground around you'),
            })}
            { makeInput({
              get: () => this.state.alloyId,
              change: (value: string) => this.setState({ alloyId: value }),
              size: 40,
              defaultValue: 'item_craftingsubstance_aluminum_raw 100 1000',
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

          <div>
            { makeButton({
              label: '/siege pack',
              click: () => this.slash('siege pack', 'Pack away siege'),
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

  private forceFinish = () => {
    this.slash('cr vox forcefinish', 'Forced vox to finish');
    setTimeout(() => {
      this.props.refresh();
    }, 100);
  }
}

export default connect()(Tools);
