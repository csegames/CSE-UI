/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 * @Author: JB (jb@codecorsair.com)
 * @Date: 2017-07-31 12:28:40
 * @Last Modified by: JB (jb@codecorsair.com)
 * @Last Modified time: 2017-07-31 14:04:03
 */
import * as React from 'react';
import { StyleSheet, css, StyleDeclaration } from 'aphrodite';
import { client, AnyEntityState, SiegeState, PlayerState } from 'camelot-unchained';
import { isEqual } from 'lodash';

const ProgressBar = (props: {current: number, max: number, foreground: string, background: string}) => {
  return (
    <div style={{
                width: '100%',
                height: '100%',
                position: 'relative',
                background: props.background,
                }}>
      <div style={{
                background: props.foreground,
                height: '100%',
                width: ((props.current/props.max) * 100).toFixed(2) + '%',
               }}></div>
    </div>
  );
};

const CenteredTextOverlay = (props: {text: string, textStyle: any, children: any}) => {
  return (
    <div style={{
                position: 'relative',
                display: 'inline-block',
               }}>
      {props.children}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}>
        <div style={{
                  ...props.textStyle
                 }}>
          {props.text}
        </div>
      </div>
    </div>
  );
};

interface SiegeButtonStyle extends StyleDeclaration {
  button: React.CSSProperties;
  buttonEnabled: React.CSSProperties;
  buttonDisabled: React.CSSProperties;
}

const deaultSiegeButtonStyle: SiegeButtonStyle = {
  button: {
     position: 'relative',
     display: 'inline-block',
     border: '1px solid rgba(220, 220, 220, 0.5)',
     padding: '2px 8px',
     userSelect: 'none',
     '-webkit-user-select': 'none',
     pointerEvents: 'all',
     background: 'rgba(0, 0, 0, 0.5)',
  },
  buttonEnabled: {
    cursor: 'pointer',
    ':hover': {
      background: 'red',
    }
  },
  buttonDisabled: {
    cursor: 'default',
  }
}

const SiegeButton = (props: {
                              enabled: boolean,
                              styles?: SiegeButtonStyle,
                              onClick?: () => void;
                              children: any,
                            }) => {
  const ss = StyleSheet.create(deaultSiegeButtonStyle);
  const custom = StyleSheet.create((props.styles || {}) as SiegeButtonStyle);
  return (
    <div className={css(ss.button, custom.button,
                    props.enabled ? ss.buttonEnabled : ss.buttonDisabled,
                    props.enabled ? custom.buttonEnabled : custom.buttonDisabled)}
        onClick={props.onClick}>
      {props.children}
    </div>
  );
}

const SiegeExitButton = (props: {}) => {
  return (
    <SiegeButton enabled={true} onClick={() => client.SendSlashCommand('siege exit')}>Exit</SiegeButton>
  );
}

const AlignRight = (props: {children: any}) => {
  return <div style={{display: 'flex', justifyContent: 'flex-end'}}>{props.children}</div>;
}

export const SiegeHealthBar = (props: {state: SiegeState, controlledBy: string | null, showExit: boolean}) => {
  return (
    <div style={{
      width: '200px',
      margin: 'auto',
      color: '#ececec',
      userSelect: 'none',
     '-webkit-user-select': 'none',
    }}>
      <div>{props.controlledBy === null ? props.state.name : `${props.state.name} (${props.controlledBy})`}</div>
      <CenteredTextOverlay text={props.state.health.current + '/' + props.state.health.max}
                           textStyle={{color: '#ececec', fontWeight: '700'}}>
        <div style={{
                     width: '200px',
                     height: '20px',
                     border: '2px solid rgba(220, 220, 220, 0.75)',
                   }}>
          <ProgressBar current={props.state.health.current} max={props.state.health.max}
                       foreground={'red'} background={'#333'} />
        </div>
      </CenteredTextOverlay>

      {
        props.showExit == false ? null :
        <AlignRight>
          <SiegeExitButton />
        </AlignRight>
      }
    </div>
  ); 
};

export enum HealthFor {
  Self,
  EnemyTarget,
  FriendlyTarget,
}
export interface SiegeHealthProps {
  for: HealthFor;
}
export interface SiegeHealthState {
  entity: AnyEntityState;
}

export class SiegeHealth extends React.Component<SiegeHealthProps, SiegeHealthState> {
  constructor(props: SiegeHealthProps) {
    super(props);
    this.state = {
      entity: null,
    };
  }
  private mounted = false;
  componentDidMount() {
    this.mounted = true;
    switch (this.props.for) {
      case HealthFor.Self: 
      client.OnPlayerStateChanged(entity => {
        if (this.mounted) {
          try {
            this.setState({entity})
          } catch(e) {}
        }
      });
      break;

      case HealthFor.EnemyTarget:
      client.OnEnemyTargetStateChanged(entity => {
        if (this.mounted) {
          try {
          this.setState({entity})
          } catch(e) {}
        }
      });
      break;

      case HealthFor.FriendlyTarget:
      client.OnFriendlyTargetStateChanged(entity => {
        if (this.mounted) {
          try {
          this.setState({entity})
          } catch(e) {}
        }
      });
      break;
    }
  }

  componentWillUnmount() {
    this.mounted = false;
  }

  shouldComponentUpdate(nextProps: SiegeHealthProps, nextState: SiegeHealthState) {
    if (!this.state.entity && nextState.entity) return true;
    if (this.state.entity && !nextState.entity) return true;
    if (!this.state.entity && !nextState.entity) return true;

    if (this.state.entity.type !== nextState.entity.type) return true;

    switch (this.state.entity.type) {
      case 'player': {
        const next = nextState.entity as PlayerState;

        const thisControlled = this.state.entity.controllingEntityState;
        const nextControlled = next.controllingEntityState;

        if (!thisControlled && !nextControlled) return false;

        if (!thisControlled && nextControlled) return true;
        if (thisControlled && !nextControlled) return true;

        if (thisControlled.type === 'siege' && nextControlled.type !== 'siege') return true;
        if (thisControlled.type !== 'siege' && nextControlled.type === 'siege') return true;

        if (thisControlled.type === 'siege' && nextControlled.type === 'siege') {
          return isEqual(thisControlled, nextControlled) === false;
        }
        return false;
      }
      case 'siege': {
        return isEqual(this.state.entity, nextState.entity) == false;
      }
    }
  }

  public render() {
    if (this.state.entity === null) return null;
    if (this.state.entity.type === 'player' && this.state.entity.controllingEntityState === null) return null;

    switch (this.state.entity.type) {
      case 'player': {
        const controlled = this.state.entity.controllingEntityState;
        if (!controlled || controlled.type !== 'siege') return null;
        return <SiegeHealthBar state={(controlled || null) as any}
                               controlledBy={this.state.entity.name}
                               showExit={this.props.for === HealthFor.Self} />;
      };
      case 'siege': {
        return <SiegeHealthBar state={this.state.entity}
                                           controlledBy={null}
                                           showExit={false}/>;
      }
    }
  }

}

export default SiegeHealth;
