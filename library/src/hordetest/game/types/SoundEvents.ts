/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

/**
 * These names and numbers should be pulled directly from `Colossus_Wwise_IDs.h` in the client repo.
 * Do not take the WHOLE file, just the ones that we need to trigger from the UI.
 */

export enum SoundEvents {
  // Scenario
  PLAY_SCENARIO_END = 777532938,
  PLAY_SCENARIO_RESET = 3722376796,

  PLAY_SCENARIO_START_COUNTDOWN_10 = 3645132515,
  PLAY_SCENARIO_START_COUNTDOWN_9 = 3628354937,
  PLAY_SCENARIO_START_COUNTDOWN_8 = 3628354936,
  PLAY_SCENARIO_START_COUNTDOWN_7 = 3628354935,
  PLAY_SCENARIO_START_COUNTDOWN_6 = 3628354934,
  PLAY_SCENARIO_START_COUNTDOWN_5 = 3628354933,
  PLAY_SCENARIO_START_COUNTDOWN_4 = 3628354932,
  PLAY_SCENARIO_START_COUNTDOWN_3 = 3628354931,
  PLAY_SCENARIO_START_COUNTDOWN_2 = 3628354930,
  PLAY_SCENARIO_START_COUNTDOWN_1 = 3628354929,
  PLAY_SCENARIO_START_COUNTDOWN_GO = 2940472538,

  // Lobby sounds
  PLAY_USER_FLOW_LOBBY = 2694245435,
  PLAY_USER_FLOW_CHAMP_SELECT = 2358959244,
  PLAY_USER_FLOW_LOADING_SCREEN = 2485029212,
  PLAY_EPILOGUE_1 = 298054046,

  PLAY_UI_CUSTOMIZEMENU_EMOTE_CLICK = 2480268909,
  PLAY_UI_CUSTOMIZEMENU_EQUIP_CLICK = 336424881,
  PLAY_UI_CUSTOMIZEMENU_ITEM_CLICK = 1384304624,
  PLAY_UI_CUSTOMIZEMENU_PORTRAIT_CLICK = 2410313132,
  PLAY_UI_CUSTOMIZEMENU_SELECTDEFAULT_CLICK = 1910956370,
  PLAY_UI_CUSTOMIZEMENU_SKINS_CLICK = 607256591,
  PLAY_UI_CUSTOMIZEMENU_SPRINT_CLICK = 1761090177,
  PLAY_UI_CUSTOMIZEMENU_WEAPONS_CLICK = 2034725394,
  PLAY_UI_CUSTOMIZEMENUPAGE_BACK_CLICK = 1897080735,
  PLAY_UI_CUSTOMIZEMENUPAGE_EMOTE_CLICK = 1055796336,
  PLAY_UI_CUSTOMIZEMENUPAGE_PORTRAIT_CLICK = 4210757407,
  PLAY_UI_CUSTOMIZEMENUPAGE_SKINS_CLICK = 602733722,
  PLAY_UI_CUSTOMIZEMENUPAGE_SPRINT_CLICK = 2720586086,
  PLAY_UI_CUSTOMIZEMENUPAGE_WEAPONS_CLICK = 1383559603,

  PLAY_UI_MAINMENU_CONFIRM_WINDOW_POPUP = 2899301306,
  PLAY_UI_MAINMENU_CONFIRM_WINDOW_POPUP_YES = 2899351490,
  PLAY_UI_MAINMENU_CONFIRM_WINDOW_POPUP_NO = 309512120,
  PLAY_UI_MAINMENU_CONFIRM_WINDOW_POPUP_YES_FAILURE = 2411850041,
  PLAY_UI_MAINMENU_TAB_STORE_OPEN = 3750248654,
  PLAY_UI_MAINMENU_TAB_CHAMPION_OPEN = 3921901464,
  PLAY_UI_MAINMENU_TAB_CHAMPION_AMAZON = 573172548,
  PLAY_UI_MAINMENU_TAB_CHAMPION_BERSERKER = 2390678243,
  PLAY_UI_MAINMENU_TAB_CHAMPION_CELT = 3515011292,
  PLAY_UI_MAINMENU_TAB_CHAMPION_GLADIATOR = 1192903031,
  PLAY_UI_MAINMENU_TAB_CHAMPION_KNIGHT = 4155250707,
  PLAY_UI_MAINMENU_TAB_CHAMPION_NINJA = 3044067340,
  PLAY_UI_MAINMENU_TAB_CAREER_OPEN = 1968479385,
  PLAY_UI_MAINMENU_SIDEBAR_CLOSE = 2275937613,
  PLAY_UI_MAINMENU_SIDEBAR_OPEN = 2055547399,
  PLAY_UI_MAINMENU_PLAYBUTTON = 3430847414,
  PLAY_UI_MAINMENU_CLICK = 2899345168,
  PLAY_UI_MAINMENU_HOVER = 3575700635,
  PLAY_UI_MAINMENU_MOUSEOVER = 3575700635,
  PLAY_UI_MAINMENU_CHARACTER_SELECT_LOCK_IN = 1626971452,
  PLAY_UI_ABILITY_FAIL = 2265997482,
  PLAY_UI_ABILITY_COOLDOWN = 1111752629,
  PLAY_UI_ABILITY_OUT_OF_RESOURCE = 1816493773,
  PLAY_UI_ABILITY_DISABLED = 3264545194,
  PLAY_UI_ABILITY_COOLDOWN_OVER = 3392214306,

  PLAY_UI_PROGRESSION_HOLD_SELECT_PROGRESS_BAR = 1427341561,
  PLAY_UI_PROGRESSION_REFUND_SELECT = 2924047584,
  PLAY_UI_PROGRESSION_UNLOCK = 2234121951,

  PLAY_UI_RUNEMENU_CLICK = 3967591163,
  PLAY_UI_RUNEMENU_RUNESELECTION_CLICK = 1804949444,
  PLAY_UI_RUNEMENUPAGE_BACK_CLICK = 3168364502,

  PLAY_UI_STOREMENU_BUNDLES_SELECT = 1347225308,
  PLAY_UI_STOREMENU_CHARACTER_SELECT = 894470962,
  PLAY_UI_STOREMENU_EMOTES_SELECT = 486091060,
  PLAY_UI_STOREMENU_PORTRAITS_SELECT = 3046440481,
  PLAY_UI_STOREMENU_POTIONS_SELECT = 871057837,
  PLAY_UI_STOREMENU_REWARDS_SELECT = 2717802757,
  PLAY_UI_STOREMENU_SKINS_SELECT = 1953313115,
  PLAY_UI_STOREMENU_SPRINTS_SELECT = 2419114036,
  PLAY_UI_STOREMENU_WEAPONS_SELECT = 1923717876,

  PLAY_MUSIC_IN_GAME = 962944353
}
