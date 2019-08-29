/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
import { Light } from '../../lib/Light';
import { Color } from '../../lib/Color';
import assign from 'object-assign';


const LIGHT_STORAGE_KEY = 'cu/game/building/droplights';

const SHOW_SELECTOR = 'buildpanel/droplight/SHOW_SELECTOR';
const SELECT_LIGHT = 'buildpanel/droplight/SELECT_LIGHT';
const SET_LIGHTS = 'buildpanel/droplight/SET_LIGHTS';

const UPDATE_LIGHT_COLOR = 'buildpanel/droplight/UPDATE_COLOR';
const UPDATE_LIGHT_RADIUS = 'buildpanel/droplight/UPDATE_RADIUS';
const UPDATE_LIGHT_INTENSITY = 'buildpanel/droplight/UPDATE_INTENSITY';

const PRESETS: Light[] = [
  {
    color: { red: 255, green: 147, blue: 41 } as Color,
    radius: 5,
    intensity: 10,
    preset: true,
    presetName: 'Candle',
  } as Light,
  {
    color: { red: 255, green: 147, blue: 41 } as Color,
    radius: 10,
    intensity: 15,
    preset: true,
    presetName: 'Torchlight',
  } as Light,
  {
    color: { red: 255, green: 197, blue: 143 } as Color,
    radius: 10,
    intensity: 15,
    preset: true,
    presetName: 'Lamp',
  } as Light,
  {
    color: { red: 255, green: 200, blue: 150 } as Color,
    radius: 1000,
    intensity: 1,
    preset: true,
    presetName: 'Dim Ambient',
  } as Light,
  {
    color: { red: 255, green: 200, blue: 150 } as Color,
    radius: 1000,
    intensity: 8,
    preset: true,
    presetName: 'Bright Ambient',
  } as Light,
  {
    color: { red: 255, green: 200, blue: 150 } as Color,
    radius: 1000,
    intensity: 20,
    preset: true,
    presetName: 'Sunny Day',
  } as Light,
  {
    color: { red: 167, green: 0, blue: 255 } as Color,
    radius: 1000,
    intensity: 20,
    preset: true,
    presetName: 'Black Light',
  } as Light,
];

export function getLightAsString(light: Light): string {
  return '{ "index": ' + light.index +
    ', "color": ' + getColorAsString(light.color) +
    ', "radius": ' + light.radius +
    ', "intensity": ' + light.intensity + '}';
}

function getColorAsString(color: Color): string {
  return '{ "red":' + color.red +
    ', "green": ' + color.green +
    ', "blue": ' + color.blue +
    '}';
}
function isCustomLight(light: Light): boolean {
  return !light.preset;
}

function saveLights(lights: Light[]) {
  const lightStrings: string[] = lights.filter(isCustomLight).map(getLightAsString);

  localStorage.setItem(LIGHT_STORAGE_KEY, '[' + lightStrings.join(', ') + ']');
}

export function loadLights(dispatch: (action: any) => void) {
  const lightString: string = localStorage.getItem(LIGHT_STORAGE_KEY);
  let lights: Light[] = [];
  if (lightString) {
    try {
      lights = JSON.parse(lightString);
    } catch (e) {
      localStorage.setItem(LIGHT_STORAGE_KEY, null);
      loadLights(dispatch);
      return;
    }
  } else {
    for (let i = 0; i < 10; i++) {
      const newLight = {
        color: { red: 255, green: 147, blue: 14 } as Color,
        radius: 5,
        intensity: 10,
      } as Light;

      lights.push(newLight);
    }
  }
  lights = lights.concat(PRESETS);

  lights.forEach((l: Light, index: number) => { l.index = index; });
  dispatch(setLights(lights));
}

export function showSelector(show: boolean) {
  return {
    type: SHOW_SELECTOR,
    show,
  };
}

export function selectLight(light: Light) {
  return {
    type: SELECT_LIGHT,
    selectedLight: light,
  };
}

export function updateColor(color: Color) {
  return {
    type: UPDATE_LIGHT_COLOR,
    color,
  };
}

export function updateRadius(radius: number) {
  return {
    type: UPDATE_LIGHT_RADIUS,
    radius,
  };
}
export function updateIntensity(intensity: number) {
  return {
    type: UPDATE_LIGHT_INTENSITY,
    intensity,
  };
}

function setLights(lights: Light[]) {
  return {
    type: SET_LIGHTS,
    lights,
  };
}

export interface LightsState {
  lights?: Light[];
  selectedIndex?: number;
  showLightSelector: boolean;
}

const initialState: LightsState = {
  lights: [],
  selectedIndex: 0,
  showLightSelector: false,
};

function getSelectedLight(state: LightsState): Light {
  return state.lights[state.selectedIndex];
}

function setSelectedLight(state: LightsState, light: Light) {
  if (light.preset) return;
  state.lights[state.selectedIndex] = light;
}

export default function reducer(state: LightsState = initialState, action: any = {}) {
  switch (action.type) {
    case SHOW_SELECTOR:
      return assign({}, state, { showLightSelector: action.show });
    case SELECT_LIGHT:
      return assign({}, state, { selectedIndex: action.selectedLight.index });
    case SET_LIGHTS:
      return assign({}, state, {
        lights: action.lights,
        selectedIndex: 0,
      });
    case UPDATE_LIGHT_COLOR:
      setSelectedLight(state, assign({}, getSelectedLight(state), { color: action.color }));
      saveLights(state.lights);
      return assign({}, state, { list: [...state.lights] });
    case UPDATE_LIGHT_RADIUS:
      setSelectedLight(state, assign({}, getSelectedLight(state), { radius: action.radius }));
      saveLights(state.lights);
      return assign({}, state, { list: [...state.lights] });
    case UPDATE_LIGHT_INTENSITY:
      setSelectedLight(state, assign({}, getSelectedLight(state), { intensity: action.intensity }));
      saveLights(state.lights);
      return assign({}, state, { list: [...state.lights] });
    default: return state;
  }
}
