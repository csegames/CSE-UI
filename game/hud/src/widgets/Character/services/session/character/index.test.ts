/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 * @Author: Andrew Jackson (jacksonal300@gmail.com)
 * @Date: 2017-05-12 11:47:02
 * @Last Modified by: Andrew Jackson (jacksonal300@gmail.com)
 * @Last Modified time: 2017-05-12 16:12:32
 */

import reducer, { getInitialState, types } from './index';
import { testWeaponItem, testArmorItem, testActualArmorItem, testInitialItems } from '../../../test';

describe('Character reducer', () => {
  test('Should return initial state', async () => {
    expect(reducer(undefined, {} as any)).toEqual({
      ...getInitialState(),
    });
  });

  test('Should initialize equipped items', async () => {
    expect(reducer(undefined, {
      type: types.INITIALIZE_EQUIPPED_ITEMS,
      items: testInitialItems,
    } as any)).toMatchObject({
      ...getInitialState(),
      equippedItems: {
        neck: testArmorItem,
        face: testArmorItem,
        shoulderRightUnder: testArmorItem,
        neckUnder: testArmorItem,
        weapon: testWeaponItem,
      },
    });
  });

  test('Should initialize inventory items', async () => {
    const testStacks = {
      'Test Weapon ItemWeapon': [
        testWeaponItem.id,
      ],
      'Test Armor ItemArmor': [
        testArmorItem.id,
      ],
    };
    expect(reducer(undefined, {
      type: types.INITIALIZE_INVENTORY_ITEMS,
      items: testInitialItems,
    } as any)).toMatchObject({
      ...getInitialState(),
      inventoryItems: {
        Armor: {
          testArmorId: testArmorItem,
        },
        Weapon: {
          testWeaponId: testWeaponItem,
        },
      },
      stacks: testStacks,
    });
  });

  test('Should initialize valid items', async () => {
    const validItems = {
      neck: { testArmorId: testArmorItem },
      face: { testArmorId: testArmorItem },
      shoulderRightUnder: { testArmorId: testArmorItem },
      neckUnder: { testArmorId: testArmorItem },
      weapon: { testWeaponId: testWeaponItem },
    };
    expect(reducer(undefined, {
      type: types.INITIALIZE_VALID_ITEMS,
      items: testInitialItems,
    } as any)).toMatchObject({
      ...getInitialState(),
      validItems,
    });
  });

  test('Should fill potentialCharacterSlots to focus', async () => {
    const potentialCharacterSlots = testArmorItem.gearSlot;
    expect(reducer(undefined, {
      type: types.ON_FOCUS_POTENTIAL_CHARACTER_SLOTS,
      item: testArmorItem,
    } as any)).toMatchObject({
      ...getInitialState(),
      potentialCharacterSlots,
    });
  });

  test('Should empty potentialCharacterSlots to defocus', async () => {
    expect(reducer(undefined, {
      type: types.ON_DEFOCUS_POTENTIAL_CHARACTER_SLOTS,
    })).toMatchObject({
      ...getInitialState(),
      potentialCharacterSlots: [],
    });
  });

  test('Should equip item and affect equippedItems, inventoryItems, validItems, and stacks. ' +
  'Should return opposite of unequipItem.', async () => {
    expect(reducer({
      ...getInitialState(),
      equippedItems: {
        neck: null,
        face: null,
        shoulderRightUnder: null,
        neckUnder: null,
      },
      inventoryItems: {
        Armor: {
          testArmorId: testArmorItem,
        },
      },
      validItems: {
        neck: { testArmorId: testArmorItem },
        face: { testArmorId: testArmorItem },
        shoulderRightUnder: { testArmorId: testArmorItem },
        neckUnder: { testArmorId: testArmorItem },
      },
      stacks: {
        'Test Armor ItemArmor': [
          testArmorItem.id,
        ],
      },
    } as any, {
      type: types.ON_EQUIP_ITEM,
      item: testArmorItem,
    } as any)).toMatchObject({
      ...getInitialState(),
      equippedItems: {
        face: testArmorItem,
        neck: testArmorItem,
        neckUnder: testArmorItem,
        shoulderRightUnder: testArmorItem,
      },
      inventoryItems: {},
      validItems: {},
      stacks: {},
    });
  });
  
  test('Should unequip item and affect equippedItems, inventoryItems, validItems, ' +
  'and stack. Should return opposite of equipItem', async () => {
    expect(reducer({
      ...getInitialState(),
      equippedItems: {
        face: testActualArmorItem,
        neck: testActualArmorItem,
        neckUnder: testActualArmorItem,
        shoulderRightUnder: testActualArmorItem,
      },
      inventoryItems: {
      },
      stacks: {},
    } as any, {
      type: types.ON_UNEQUIP_ITEM,
      item: testActualArmorItem,
      slot: 'neck',
    } as any)).toMatchObject({
      ...getInitialState(),
      equippedItems: {
        neck: null,
        face: null,
        shoulderRightUnder: null,
        neckUnder: null,
      },
      inventoryItems: {
        Armor: {
          testArmorId: testActualArmorItem,
        },
      },
      stacks: {
        'Test Armor ItemArmor': [
          testActualArmorItem.id,
        ],
      },
    });
  });
});
