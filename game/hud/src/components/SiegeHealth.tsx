/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
import * as React from 'react';
import styled, { css } from 'react-emotion';
import { SiegeStateModel, FriendlyTargetState, EnemyTargetState, SelfPlayerState } from '@csegames/camelot-unchained';
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
        width: ((props.current / props.max) * 100).toFixed(2) + '%',
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
          ...props.textStyle,
        }}>
          {props.text}
        </div>
      </div>
    </div>
  );
};

const Button = styled('div')`
  position: relative;
  display: inline-block;
  border: 1px solid rgba(220, 220, 220, 0.5);
  padding: 2px 8px;
  user-select: none;
  -webkit-user-select: none;
  pointer-events: all;
  background: rgba(0, 0 ,0, 0.5);
`;

const ButtonEnabled = css`
  cursor: pointer;
  &:hover {
    background: red;
  }
`;

const ButtonDisabled = css`
  cursor: default;
`;

const SiegeButton = (props: {
  enabled: boolean,
  onClick?: () => void;
  children: any,
}) => {
  return (
    <Button className={props.enabled ? ButtonDisabled : props.enabled ? ButtonEnabled : ''}
        onClick={props.onClick}>
      {props.children}
    </Button>
  );
};

const SiegeContextButton = (props: {}) => {
  return (
    <SiegeButton enabled={true} onClick={() => game.sendSlashCommand('siege context')}>
      <i className='fa fa-cog' aria-hidden='true'></i>
    </SiegeButton>
  );
};

const AlignRight = (props: {children: any}) => {
  return <div style={{ display: 'flex', justifyContent: 'flex-end' }}>{props.children}</div>;
};

export const SiegeHealthBar = (props: {state: SiegeStateModel, controlledBy: string | null, showExit: boolean}) => {
  return (
    <div style={{
      width: '200px',
      margin: 'auto',
      color: '#ececec',
      userSelect: 'none',
      WebkitUserSelect: 'none',
    }}>
      <div>{props.controlledBy === null ? props.state.name : `${props.state.name} (${props.controlledBy})`}</div>
      <CenteredTextOverlay
        text={props.state.health.current + '/' + props.state.health.max}
        textStyle={{ color: '#ececec', fontWeight: '700' }}>
        <div style={{
          width: '200px',
          height: '20px',
          border: '2px solid rgba(220, 220, 220, 0.75)',
        }}>
          <ProgressBar
            current={props.state.health.current} max={props.state.health.max}
            foreground={'red'} background={'#333'}
          />
        </div>
      </CenteredTextOverlay>

      {
        props.showExit === false ? null :
        <AlignRight>
          <SiegeContextButton />
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
  entity: SelfPlayerState | FriendlyTargetState | EnemyTargetState;
}

export class SiegeHealth extends React.Component<SiegeHealthProps, SiegeHealthState> {
  private eventHandles: EventHandle[] = [];
  constructor(props: SiegeHealthProps) {
    super(props);
    this.state = {
      entity: null,
    };
  }
  public componentDidMount() {
    switch (this.props.for) {
      case HealthFor.Self:
        this.eventHandles.push(game.selfPlayerState.onUpdated(() => {
          try {
            this.setState({ entity: game.selfPlayerState as SelfPlayerState });
          } catch (e) {}
        }));
        break;

      case HealthFor.EnemyTarget:
        this.eventHandles.push(game.enemyTargetState.onUpdated(() => {
          try {
            this.setState({ entity: game.enemyTargetState as EnemyTargetState });
          } catch (e) {}
        }));
        break;

      case HealthFor.FriendlyTarget:
        this.eventHandles.push(game.friendlyTargetState.onUpdated(() => {
          try {
            this.setState({ entity: game.friendlyTargetState as FriendlyTargetState });
          } catch (e) {}
        }));
        break;
    }
  }

  public componentWillUnmount() {
    this.eventHandles.forEach(eventHandle => eventHandle.clear());
  }

  public shouldComponentUpdate(nextProps: SiegeHealthProps, nextState: SiegeHealthState) {
    if (!this.state.entity && nextState.entity) return true;
    if (this.state.entity && !nextState.entity) return true;
    if (!this.state.entity && !nextState.entity) return true;

    if (this.state.entity.type !== nextState.entity.type) return true;

    const next: SelfPlayerState | FriendlyTargetState | EnemyTargetState = nextState.entity;

    switch (next.type) {
      case 'player': {
        if (this.state.entity.type !== 'player') return true;

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
        return isEqual(this.state.entity, nextState.entity) === false;
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
        return (
          <SiegeHealthBar
            state={(controlled || null) as any}
            controlledBy={this.state.entity.name}
            showExit={this.props.for === HealthFor.Self}
          />
        );
      }
      case 'siege': {
        return (
          <SiegeHealthBar
            state={this.state.entity}
            controlledBy={null}
            showExit={false}
          />
        );
      }
    }
  }

}

export default SiegeHealth;
