/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as React from 'react';
import { SettingsPanel } from '../components/SettingsPanel';
import { OptionView } from 'hud/Settings/components/OptionView';



interface Props {
  category: OptionCategory;
  onCancel: () => void;
}

interface State {
  options: { [name: string]: GameOption };
  changes: { [name: string]: GameOption };
  error: string;
}

export class CategoryPane extends React.PureComponent<Props, State> {
  private settingsActionHandle: EventHandle;

  // promise when setting options as they are done async, and yes the type is really long
  private savePromise: CancellablePromise<Success |
    Failure & { failures: ArrayMap<{ option: GameOption, reason: string }> }> = null;

  constructor(props: Props) {
    super(props);
    this.state = {
      options: cloneDeep(game.options) as any,
      changes: {},
      error: '',
    };
  }

  public componentDidMount() {
    this.settingsActionHandle = game.on('settings--action', this.onAction);
  }

  public componentWillUnmount() {
    if (this.settingsActionHandle) this.settingsActionHandle.clear();
  }

  public render() {
    const opts = Object.values(this.state.options).filter(o => o.category === this.props.category);
    return (
      <SettingsPanel>
        {opts.map(opt => <OptionView key={opt.name} option={opt as GameOption} onChange={this.onChange} />)}
      </SettingsPanel>
    );
  }

  private onChange = (option: GameOption) => {
    this.setState((state) => {
      return {
        ...state,
        changes: {
          ...state.changes,
          [option.name]: option,
        },
      };
    });
  }

  private onAction = (args: any) => {
    switch (args.id) {
      case 'apply':
        const values = Object.values(this.state.changes);
        if (values.length > 0) {
          this.savePromise = game.setOptionsAsync(Object.values(this.state.changes));
          this.savePromise.then((result) => {
            if (result.success) {
              // yay! nothing really to do here...
              return;
            }

            const res = result as Failure & { failures: ArrayMap<{ option: GameOption, reason: string }> };
            const changes = {};
            let error = 'One ore more options failed to apply. ';
            const failures = Object.values(res.failures);
            failures.forEach((fail, index) => {
              changes[fail.option.name] = fail.option;
              error += fail.reason + (index === failures.length - 1 ? '' : ', ');
            });

            this.setState({
              error,
              changes,
            });
          });
        }
        break;
      case 'cancel':
        this.setState({
          changes: {},
          error: '',
        });
        this.props.onCancel();
        break;
      case 'default':
        game.resetOptions(OptionCategory.Input);
        break;
    }
  }
}
