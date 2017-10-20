// Base values should never change for any given skill. Due to this
// reason we should only need to ever resend these values if they change
// with the exception of id which is used to identify the skill.
//
// Thus Base contains a partial optional value for BaseInfo.
export interface BaseInfo {

  // Type is used both for display differences and for how to handle
  // any optimistic ui updates
  //
  // For example, on a click from 'ready':
  //
  // If standard, a click effect is played immediately without waiting
  // for a new state to be provided.
  //
  // If modal, the button sets modal-on state
  type: 'standard' | 'modal';
  icon: string;
  keybind: string;

  // skill track id that this skill is on
  track: string;
}

export interface Base {
  id: string;
  info?: Partial<BaseInfo>;
}

// Progress is used for timing information and Disruption values
//
// When used for timing, values are in ms. Current and end both
// start from a base of 0 for that phase.
//
// When used for disruption, values are in units end being max
// units, current being the current value. This is based off
// 0 being no disruption and should not reset each phase.
export interface Progress {
  current: number;
  end: number;
}

// All active stages of a skill will have disruption
export interface ActiveBase extends Base {
  disruption: Progress;
}


// SKill is ready to be used when clicked / keybind pressed
export interface Ready extends Base {
  status: 'ready';
}

// Unusable skill is one that can not be used right now
// due to some temporary player state issue.
//
// ie. out of ammo, out of charges, player is stunned
export interface Unusable extends Base {
  status: 'unusable';

  // short message used primarily for display purposes for
  // why the button is unusable.
  reason: string;

  // descriptive message that will be displayed by the
  // ui when the user attempts to use this skill
  message: string;
}

// Disabled skill is one that can not be used
// due to a major player state issue.
//
// ie. wrong weapon equipped, player is in siege engine and can
// not use standard skills
export interface Disabled extends Base {
  status: 'disabled';
  reason: string;
  message: string;
}

export interface Queued extends Base {
  status: 'queued';
}

export interface Preparation extends ActiveBase {
  status: 'preparation';
  timing: Progress;
}

export interface Channel extends ActiveBase {
  status: 'channel';
  timing: Progress;
}

export interface Hold extends ActiveBase {
  status: 'hold';
}

export interface Recovery extends Base {
  status: 'recovery';
  timing: Progress;
}

export interface Cooldown extends Base {
  status: 'cooldown';
  timing: Progress;
}

export const skillStateColors = {
  unavailableColor: '#C1000E',
  readyColor: 'cyan',
  startCastColor: '#ffdf00',
  errorColor: 'red',
  activeColor: '#ffdf00',
  queuedColor: '#FF7C24',
  prepColor: '#FF9F19',
  cooldownColor: 'white',
  disruptionColor: '#d700ff',
  recoveryColor: '#19abff',
  hitColor: '#fff570',
  holdColor: '#fff570',
  channelColor: '#C5FFC5',
  modalColor: '#aaa',
};

export type SkillState = Ready | Unusable | Disabled | Queued | Preparation | Channel | Hold | Recovery | Cooldown;

export default SkillState;
