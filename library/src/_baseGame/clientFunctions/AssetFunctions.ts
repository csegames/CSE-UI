/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { engine } from '../engine';
import { Dictionary } from '../types/ObjectMap';

/** Data format from the CU `abilitybooktabs` tab. */
export interface AbilityBookTabsData {
  ID: string;
  Name: string;
  IconClass: string;
  SortOrder: number;
}

function isAbilityBookTabsData(obj: any): obj is AbilityBookTabsData {
  return Object.keys(obj).length === 4 && 'ID' in obj && 'Name' in obj && 'IconClass' in obj && 'SortOrder' in obj;
}

function isAbilityBookTabsDataArray(obj: any): obj is AbilityBookTabsData[] {
  if (!Array.isArray(obj)) {
    return false;
  } else {
    // Are there any items in the array that aren't the correct type?
    return (
      obj.find((arrayEntry) => {
        return !isAbilityBookTabsData(arrayEntry);
      }) === undefined
    );
  }
}

/** Data format from the CU `abilitynetworks` tab. */
export interface AbilityNetworksData {
  ID: string;
  AbilityBuilderHueRotation: string | null;
  AbilityBuilderMaskImage: string | null;
  AbilityBuilderNameplateImage: string | null;
  /** The bookTab on which abilities from this network should appear (or null if they shouldn't appear on any).
   */
  AbilityBookTab: string | null;
}

function isAbilityNetworksData(obj: any): obj is AbilityNetworksData {
  const isCorrectType =
    Object.keys(obj).length === 5 &&
    'ID' in obj &&
    'AbilityBuilderHueRotation' in obj &&
    'AbilityBuilderMaskImage' in obj &&
    'AbilityBuilderNameplateImage' in obj &&
    'AbilityBookTab' in obj;
  if (!isCorrectType) {
    console.error(`Found invalid AbilityNetworksData object`, obj);
  }
  return isCorrectType;
}

function isAbilityNetworksDataArray(obj: any): obj is AbilityNetworksData[] {
  if (!Array.isArray(obj)) {
    return false;
  } else {
    // Are there any items in the array that aren't the correct type?
    return (
      obj.find((arrayEntry) => {
        return !isAbilityNetworksData(arrayEntry);
      }) === undefined
    );
  }
}

/** Data format from the CU `systemability` tab. */
export interface SystemAbilityData {
  ID: number;
  Name: string;
  Description: string;
  IconURL: string;
}

function isSystemAbilityData(obj: any): obj is SystemAbilityData {
  return Object.keys(obj).length === 4 && 'ID' in obj && 'Name' in obj && 'Description' in obj && 'IconURL' in obj;
}

function isSystemAbilityDataArray(obj: any): obj is SystemAbilityData[] {
  if (!Array.isArray(obj)) {
    return false;
  } else {
    // Are there any items in the array that aren't the correct type?
    return (
      obj.find((arrayEntry) => {
        return !isSystemAbilityData(arrayEntry);
      }) === undefined
    );
  }
}

/** Data format from the CU `userclasses` tab. */
export interface UserClassesData {
  ID: string;
  AbilityBuilderBackgroundImage: string | null;
  AbilityBuilderHueRotation: string | null;
  PaperdollImage: Dictionary<Dictionary<string>>;
  /** key: AbilityNetworkId, value: imageURL */
  AbilityNetworkImage: Dictionary<string>;
  NameplateIconBackgroundImage: string | null;
  NameplateIconFrameImage: string | null;
}

function isUserClassesData(obj: any): obj is UserClassesData {
  const isCorrectType =
    Object.keys(obj).length === 7 &&
    'ID' in obj &&
    'AbilityBuilderBackgroundImage' in obj &&
    'AbilityBuilderHueRotation' in obj &&
    'AbilityNetworkImage' in obj &&
    'PaperdollImage' in obj &&
    'NameplateIconBackgroundImage' in obj &&
    'NameplateIconFrameImage' in obj;
  if (!isCorrectType) {
    console.error(`Found invalid UserClasses object`, obj);
  }
  return isCorrectType;
}

function isUserClassesDataArray(obj: any): obj is UserClassesData[] {
  if (!Array.isArray(obj)) {
    return false;
  } else {
    // Are there any items in the array that aren't the correct type?
    return (
      obj.find((arrayEntry) => {
        return !isUserClassesData(arrayEntry);
      }) === undefined
    );
  }
}

export interface DynamicManifest {
  findObject<T>(name: string): T | undefined;
  findResource(name: string): string | undefined;
  findStringValue(name: string): string | undefined;
}

export interface AssetFunctions {
  getAbilityBookTabsData(): Promise<AbilityBookTabsData[]>;
  getAbilityNetworksData(): Promise<AbilityNetworksData[]>;
  getSystemAbilityData(): Promise<SystemAbilityData[]>;
  getUserClassesData(): Promise<UserClassesData[]>;
}

interface TypedEntry {
  objects: Dictionary<{}>;
  resources: Dictionary<string>;
  stringValues: Dictionary<string>;
}

function isTypedEntry(value: any): value is TypedEntry {
  return typeof value.resources == 'object' && typeof value.stringValues == 'object';
}

class ObjectManifest implements DynamicManifest {
  constructor(private entry: TypedEntry) {}

  findObject<T>(name: string): T | undefined {
    return this.entry.objects[name] as T;
  }
  findResource(name: string): string | undefined {
    return this.entry.resources[name];
  }
  findStringValue(name: string): string | undefined {
    return this.entry.stringValues[name];
  }
}

const headers = { 'Content-Type': 'application/json' };
const emptyEntry: Promise<TypedEntry> = Promise.resolve({ objects: {}, resources: {}, stringValues: {} });
const emptyManifest: Promise<ObjectManifest> = Promise.resolve(
  new ObjectManifest({ objects: {}, resources: {}, stringValues: {} })
);

// actual fetch of underlying data via request to resource manager
async function fetchTypedEntry(bucket: string): Promise<TypedEntry> {
  try {
    const response = await fetch(bucket, { headers });
    if (!response.ok) {
      console.error(`could not load asset bucket "${bucket}"`, response.status);
      return emptyEntry;
    }
    const entry = await response.json();
    if (!isTypedEntry(entry)) {
      console.error(`asset bucket "${bucket}" is missing required fields`, entry);
      return emptyEntry;
    }
    return Promise.resolve(entry);
  } catch (e) {
    console.error(`could not load asset bucket "${bucket}"`, e);
    return emptyEntry;
  }
}

async function fetchJSON<T>(filename: string, isValid?: (obj: Object) => boolean): Promise<T> {
  try {
    const response = await fetch(filename, { headers });
    if (!response.ok) {
      console.error(`Could not load "${filename}"`, response.status);
      return Promise.resolve(null);
    }
    const entry = await response.json();
    if (isValid && !isValid(entry)) {
      console.error(`"${filename}" is missing required fields`, entry);
      return Promise.resolve(null);
    }
    return Promise.resolve(entry);
  } catch (e) {
    console.error(`Could not load "${filename}"`, e);
    return Promise.resolve(null);
  }
}

// caching layer, includes debouncing of requests in flight
class CoherentAssetFunctions implements AssetFunctions {
  private abilityBookTabs: Promise<AbilityBookTabsData[]>;
  private abilityNetworks: Promise<AbilityNetworksData[]>;
  private entries: Dictionary<Promise<TypedEntry>> = {};
  private systemAbilities: Promise<SystemAbilityData[]>;
  private userClassesData: Promise<UserClassesData[]>;

  getAbilityBookTabsData(): Promise<AbilityBookTabsData[]> {
    // Only actually load once.
    if (!this.abilityBookTabs) {
      this.abilityBookTabs = fetchJSON<AbilityBookTabsData[]>(
        '/dynamic/abilitybooktabs/manifest.json',
        isAbilityBookTabsDataArray
      );
    }

    // And always return the results of that single load call.
    return this.abilityBookTabs;
  }

  getAbilityNetworksData(): Promise<AbilityNetworksData[]> {
    // Only actually load once.
    if (!this.abilityNetworks) {
      this.abilityNetworks = fetchJSON<AbilityNetworksData[]>(
        '/dynamic/abilitynetworks/manifest.json',
        isAbilityNetworksDataArray
      );
    }

    // And always return the results of that single load call.
    return this.abilityNetworks;
  }

  getSystemAbilityData(): Promise<SystemAbilityData[]> {
    // Only actually load once.
    if (!this.systemAbilities) {
      this.systemAbilities = fetchJSON<SystemAbilityData[]>(
        '/dynamic/systemabilities/manifest.json',
        isSystemAbilityDataArray
      );
    }

    // And always return the results of that single load call.
    return this.systemAbilities;
  }

  getUserClassesData(): Promise<UserClassesData[]> {
    // Only actually load once.
    if (!this.userClassesData) {
      this.userClassesData = fetchJSON<UserClassesData[]>('/dynamic/userclasses/manifest.json', isUserClassesDataArray);
    }

    // And always return the results of that single load call.
    return this.userClassesData;
  }
}

// TODO : relative browser path to dummy data
class BrowserAssetFunctions implements AssetFunctions {
  getAbilityBookTabsData(): Promise<AbilityBookTabsData[]> {
    return Promise.resolve([]);
  }
  getAbilityNetworksData(): Promise<AbilityNetworksData[]> {
    return Promise.resolve([]);
  }
  getSystemAbilityData(): Promise<SystemAbilityData[]> {
    return Promise.resolve([]);
  }
  getUserClassesData(): Promise<UserClassesData[]> {
    return Promise.resolve([]);
  }
}

export const impl: AssetFunctions = engine.isAttached ? new CoherentAssetFunctions() : new BrowserAssetFunctions();
