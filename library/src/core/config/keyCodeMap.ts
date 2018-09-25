import js from './keyCodes';
import vk from './VK_KeyCodes';

export function getVirtualKeyCode(jsCode: number) {
  switch (jsCode) {
    case js.KEY_Backspace: return vk.VK_BACK;
    case js.KEY_Tab: return vk.VK_TAB;
    case js.KEY_Enter: return vk.VK_RETURN;
    case js.KEY_Shift: return vk.VK_SHIFT;
    case js.KEY_Ctrl: return vk.VK_CONTROL;
    case js.KEY_Alt: return vk.VK_MENU;
    case js.KEY_PauseBreak: return vk.VK_PAUSE;
    case js.KEY_CapsLock: return vk.VK_CAPITAL;
    case js.KEY_Escape: return vk.VK_ESCAPE;
    case js.KEY_Spacebar: return vk.VK_SPACE;
    case js.KEY_PageUp: return vk.VK_PRIOR;
    case js.KEY_PageDown: return vk.VK_NEXT;
    case js.KEY_End: return vk.VK_END;
    case js.KEY_Home: return vk.VK_HOME;
    case js.KEY_LeftArrow: return vk.VK_LEFT;
    case js.KEY_UpArrow: return vk.VK_UP;
    case js.KEY_RightArrow: return vk.VK_RIGHT;
    case js.KEY_DownArrow: return vk.VK_DOWN;
    case js.KEY_PrintScrn: return vk.VK_PRINT;
    case js.KEY_Insert: return vk.VK_INSERT;
    case js.KEY_Delete: return vk.VK_DELETE;
    case js.KEY_Zero: return vk.VK_0;
    case js.KEY_One: return vk.VK_1;
    case js.KEY_Two: return vk.VK_2;
    case js.KEY_Three: return vk.VK_3;
    case js.KEY_Four: return vk.VK_4;
    case js.KEY_Five: return vk.VK_5;
    case js.KEY_Six: return vk.VK_6;
    case js.KEY_Seven: return vk.VK_7;
    case js.KEY_Eight: return vk.VK_8;
    case js.KEY_Nine: return vk.VK_9;
    case js.KEY_a: return vk.VK_A;
    case js.KEY_b: return vk.VK_B;
    case js.KEY_c: return vk.VK_C;
    case js.KEY_d: return vk.VK_D;
    case js.KEY_e: return vk.VK_E;
    case js.KEY_f: return vk.VK_F;
    case js.KEY_g: return vk.VK_G;
    case js.KEY_h: return vk.VK_H;
    case js.KEY_i: return vk.VK_I;
    case js.KEY_j: return vk.VK_J;
    case js.KEY_k: return vk.VK_K;
    case js.KEY_l: return vk.VK_L;
    case js.KEY_m: return vk.VK_M;
    case js.KEY_n: return vk.VK_N;
    case js.KEY_o: return vk.VK_O;
    case js.KEY_p: return vk.VK_P;
    case js.KEY_q: return vk.VK_Q;
    case js.KEY_r: return vk.VK_R;
    case js.KEY_s: return vk.VK_S;
    case js.KEY_t: return vk.VK_T;
    case js.KEY_u: return vk.VK_U;
    case js.KEY_v: return vk.VK_V;
    case js.KEY_w: return vk.VK_W;
    case js.KEY_x: return vk.VK_X;
    case js.KEY_y: return vk.VK_Y;
    case js.KEY_z: return vk.VK_Z;
    case js.KEY_LeftWindowKey: return vk.VK_LWIN;
    case js.KEY_RightWindowKey: return vk.VK_RWIN;
    case js.KEY_SelectKey: return vk.VK_SELECT;
    case js.KEY_Numpad0: return vk.VK_NUMPAD0;
    case js.KEY_Numpad1: return vk.VK_NUMPAD1;
    case js.KEY_Numpad2: return vk.VK_NUMPAD2;
    case js.KEY_Numpad3: return vk.VK_NUMPAD3;
    case js.KEY_Numpad4: return vk.VK_NUMPAD4;
    case js.KEY_Numpad5: return vk.VK_NUMPAD5;
    case js.KEY_Numpad6: return vk.VK_NUMPAD6;
    case js.KEY_Numpad7: return vk.VK_NUMPAD7;
    case js.KEY_Numpad8: return vk.VK_NUMPAD8;
    case js.KEY_Numpad9: return vk.VK_NUMPAD9;
    case js.KEY_Multiply: return vk.VK_MULTIPLY;
    case js.KEY_NumpadPlus: return vk.VK_ADD;
    case js.KEY_NumpadMinus: return vk.VK_SUBTRACT;
    case js.KEY_DecimalPoint: return vk.VK_DECIMAL;
    case js.KEY_Divide: return vk.VK_DIVIDE;
    case js.KEY_F1: return vk.VK_F1;
    case js.KEY_F2: return vk.VK_F2;
    case js.KEY_F3: return vk.VK_F3;
    case js.KEY_F4: return vk.VK_F4;
    case js.KEY_F5: return vk.VK_F5;
    case js.KEY_F6: return vk.VK_F6;
    case js.KEY_F7: return vk.VK_F7;
    case js.KEY_F8: return vk.VK_F8;
    case js.KEY_F9: return vk.VK_F9;
    case js.KEY_F10: return vk.VK_F10;
    case js.KEY_F11: return vk.VK_F11;
    case js.KEY_F12: return vk.VK_F12;
    case js.KEY_NumLock: return vk.VK_NUMLOCK;
    case js.KEY_ScrollLock: return vk.VK_SCROLL;
    case js.KEY_Semicolon: return vk.VK_OEM_1;
    case js.KEY_Equals: return vk.VK_OEM_PLUS;
    case js.KEY_Comma: return vk.VK_OEM_COMMA;
    case js.KEY_LessThan: return vk.VK_OEM_COMMA;
    case js.KEY_Minus: return vk.VK_OEM_MINUS;
    case js.KEY_Period: return vk.VK_OEM_PERIOD;
    case js.KEY_GreaterThan: return vk.VK_OEM_PERIOD;
    case js.KEY_ForwardSlash: return vk.VK_OEM_2;
    case js.KEY_QuestionMark: return vk.VK_OEM_2;
    case js.KEY_GraveAccent: return vk.VK_OEM_3;
    case js.KEY_Tilde: return vk.VK_OEM_3;
    case js.KEY_OpenCurlyBracket: return vk.VK_OEM_4;
    case js.KEY_OpenSquareBracket: return vk.VK_OEM_4;
    case js.KEY_BackSlash: return vk.VK_OEM_5;
    case js.KEY_VerticalPipe: return vk.VK_OEM_5;
    case js.KEY_CloseCurlyBracket: return vk.VK_OEM_6;
    case js.KEY_CloseSquareBracket: return vk.VK_OEM_6;
    case js.KEY_Quote: return vk.VK_OEM_7;
    case js.KEY_CommandFF: return vk.VK_OEM_7;
  }
  return 0;
}

export function getJSKeyCode(vkCode: number) {
  switch (vkCode) {
    case vk.VK_LBUTTON: return 0; // Left mouse button

    case vk.VK_RBUTTON: return 0; // Right mouse button

    case vk.VK_CANCEL: return js.KEY_PauseBreak; // Control-break processing

    case vk.VK_MBUTTON: return 0; // Middle mouse button (three-button mouse)

    case vk.VK_XBUTTON1: return 0; // X1 mouse button

    case vk.VK_XBUTTON2: return 0; // X2 mouse button

    case vk.VK_BACK: return js.KEY_Backspace; // BACKSPACE key

    case vk.VK_TAB: return js.KEY_Tab; // TAB key

    case vk.VK_CLEAR: return js.KEY_NumLock; // CLEAR key

    case vk.VK_RETURN: return js.KEY_Enter; // ENTER key

    case vk.VK_SHIFT: return js.KEY_Shift; // SHIFT key

    case vk.VK_CONTROL: return js.KEY_Ctrl; // CTRL key

    case vk.VK_MENU: return js.KEY_Alt; // ALT key

    case vk.VK_PAUSE: return js.KEY_PauseBreak; // PAUSE key

    case vk.VK_CAPITAL: return js.KEY_CapsLock; // CAPS LOCK key

    case vk.VK_KANA: return 0; // IME Kana mode

    case vk.VK_JUNJA: return 0; // IME Junja mode

    case vk.VK_FINAL: return 0; // IME final mode

    case vk.VK_HANJA: return 0; // IME Hanja mode

    case vk.VK_KANJI: return 0; // IME Kanji mode

    case vk.VK_ESCAPE: return js.KEY_Escape; // ESC key

    case vk.VK_CONVERT: return 0; // IME convert

    case vk.VK_NONCONVERT: return 0; // IME nonconvert

    case vk.VK_ACCEPT: return 0; // IME accept

    case vk.VK_MODECHANGE: return 0; // IME mode change request

    case vk.VK_SPACE: return js.KEY_Spacebar; // SPACEBAR

    case vk.VK_PRIOR: return js.KEY_PageUp; // PAGE UP key

    case vk.VK_NEXT: return js.KEY_PageDown; // PAGE DOWN key

    case vk.VK_END: return js.KEY_End; // END key

    case vk.VK_HOME: return js.KEY_Home; // HOME key

    case vk.VK_LEFT: return js.KEY_LeftArrow; // LEFT ARROW key

    case vk.VK_UP: return js.KEY_UpArrow; // UP ARROW key

    case vk.VK_RIGHT: return js.KEY_RightArrow; // RIGHT ARROW key

    case vk.VK_DOWN: return js.KEY_DownArrow; // DOWN ARROW key

    case vk.VK_SELECT: return js.KEY_SelectKey; // SELECT key

    case vk.VK_PRINT: return js.KEY_PrintScrn; // PRINT key

    case vk.VK_EXECUTE: return 0; // EXECUTE key

    case vk.VK_SNAPSHOT: return js.KEY_PrintScrn; // PRINT SCREEN key

    case vk.VK_INSERT: return js.KEY_Insert; // INS key

    case vk.VK_DELETE: return js.KEY_Delete; // DEL key

    case vk.VK_HELP: return 0; // HELP key

    case vk.VK_0: return js.KEY_Zero;

    case vk.VK_1: return js.KEY_One;

    case vk.VK_2: return js.KEY_Two;

    case vk.VK_3: return js.KEY_Three;

    case vk.VK_4: return js.KEY_Four;

    case vk.VK_5: return js.KEY_Five;

    case vk.VK_6: return js.KEY_Six;

    case vk.VK_7: return js.KEY_Seven;

    case vk.VK_8: return js.KEY_Eight;

    case vk.VK_9: return js.KEY_Nine;

    case vk.VK_A: return js.KEY_a;

    case vk.VK_B: return js.KEY_b;

    case vk.VK_C: return js.KEY_c;

    case vk.VK_D: return js.KEY_d;

    case vk.VK_E: return js.KEY_e;

    case vk.VK_F: return js.KEY_f;

    case vk.VK_G: return js.KEY_g;

    case vk.VK_H: return js.KEY_h;

    case vk.VK_I: return js.KEY_i;

    case vk.VK_J: return js.KEY_j;

    case vk.VK_K: return js.KEY_k;

    case vk.VK_L: return js.KEY_l;

    case vk.VK_M: return js.KEY_m;

    case vk.VK_N: return js.KEY_n;

    case vk.VK_O: return js.KEY_o;

    case vk.VK_P: return js.KEY_p;

    case vk.VK_Q: return js.KEY_q;

    case vk.VK_R: return js.KEY_r;

    case vk.VK_S: return js.KEY_s;

    case vk.VK_T: return js.KEY_t;

    case vk.VK_U: return js.KEY_u;

    case vk.VK_V: return js.KEY_v;

    case vk.VK_W: return js.KEY_w;

    case vk.VK_X: return js.KEY_x;

    case vk.VK_Y: return js.KEY_y;

    case vk.VK_Z: return js.KEY_z;

    case vk.VK_LWIN: return js.KEY_LeftWindowKey; // Left Windows key (Natural keyboard)

    case vk.VK_RWIN: return js.KEY_RightWindowKey; // Right Windows key (Natural keyboard)

    case vk.VK_APPS: return 0; // Applications key (Natural keyboard)

    case vk.VK_SLEEP: return 0; // Computer Sleep key

    case vk.VK_NUMPAD0: return js.KEY_Numpad0; // Numeric keypad 0 key

    case vk.VK_NUMPAD1: return js.KEY_Numpad1; // Numeric keypad 1 key

    case vk.VK_NUMPAD2: return js.KEY_Numpad2; // Numeric keypad 2 key

    case vk.VK_NUMPAD3: return js.KEY_Numpad3; // Numeric keypad 3 key

    case vk.VK_NUMPAD4: return js.KEY_Numpad4; // Numeric keypad 4 key

    case vk.VK_NUMPAD5: return js.KEY_Numpad5; // Numeric keypad 5 key

    case vk.VK_NUMPAD6: return js.KEY_Numpad6; // Numeric keypad 6 key

    case vk.VK_NUMPAD7: return js.KEY_Numpad7; // Numeric keypad 7 key

    case vk.VK_NUMPAD8: return js.KEY_Numpad8; // Numeric keypad 8 key

    case vk.VK_NUMPAD9: return js.KEY_Numpad9; // Numeric keypad 9 key

    case vk.VK_MULTIPLY: return js.KEY_Multiply; // Multiply key

    case vk.VK_ADD: return js.KEY_NumpadPlus; // Add key

    case vk.VK_SEPARATOR: return 0; // Separator key

    case vk.VK_SUBTRACT: return js.KEY_NumpadMinus; // Subtract key

    case vk.VK_DECIMAL: return js.KEY_DecimalPoint; // Decimal key

    case vk.VK_DIVIDE: return js.KEY_Divide; // Divide key

    case vk.VK_F1: return js.KEY_F1; // F1 key

    case vk.VK_F2: return js.KEY_F2; // F2 key

    case vk.VK_F3: return js.KEY_F3; // F3 key

    case vk.VK_F4: return js.KEY_F4; // F4 key

    case vk.VK_F5: return js.KEY_F5; // F5 key

    case vk.VK_F6: return js.KEY_F6; // F6 key

    case vk.VK_F7: return js.KEY_F7; // F7 key

    case vk.VK_F8: return js.KEY_F8; // F8 key

    case vk.VK_F9: return js.KEY_F9; // F9 key

    case vk.VK_F10: return js.KEY_F10; // F10 key

    case vk.VK_F11: return js.KEY_F11; // F11 key

    case vk.VK_F12: return js.KEY_F12; // F12 key

    case vk.VK_F13: return 0; // F13 key

    case vk.VK_F14: return 0; // F14 key

    case vk.VK_F15: return 0; // F15 key

    case vk.VK_F16: return 0; // F16 key

    case vk.VK_F17: return 0; // F17 key

    case vk.VK_F18: return 0; // F18 key

    case vk.VK_F19: return 0; // F19 key

    case vk.VK_F20: return 0; // F20 key

    case vk.VK_F21: return 0; // F21 key

    case vk.VK_F22: return 0; // F22 key

    case vk.VK_F23: return 0; // F23 key

    case vk.VK_F24: return 0; // F24 key


    case vk.VK_NUMLOCK: return js.KEY_NumLock; // NUM LOCK key

    case vk.VK_SCROLL: return js.KEY_ScrollLock; // SCROLL LOCK key

    case vk.VK_LSHIFT: return js.KEY_Shift; // Left SHIFT key

    case vk.VK_RSHIFT: return js.KEY_Shift; // Right SHIFT key

    case vk.VK_LCONTROL: return js.KEY_Ctrl; // Left CONTROL key

    case vk.VK_RCONTROL: return js.KEY_Ctrl; // Right CONTROL key

    case vk.VK_LMENU: return js.KEY_Alt; // Left MENU key

    case vk.VK_RMENU: return js.KEY_Alt; // Right MENU key

    case vk.VK_BROWSER_BACK: return 0; // Browser Back key

    case vk.VK_BROWSER_FORWARD: return 0; // Browser Forward key

    case vk.VK_BROWSER_REFRESH: return 0; // Browser Refresh key

    case vk.VK_BROWSER_STOP: return 0; // Browser Stop key

    case vk.VK_BROWSER_SEARCH: return 0; // Browser Search key

    case vk.VK_BROWSER_FAVORITES: return 0; // Browser Favorites key

    case vk.VK_BROWSER_HOME: return 0; // Browser Start and Home key

    case vk.VK_VOLUME_MUTE: return 0; // Volume Mute key

    case vk.VK_VOLUME_DOWN: return 0; // Volume Down key

    case vk.VK_VOLUME_UP: return 0; // Volume Up key

    case vk.VK_MEDIA_NEXT_TRACK: return 0; // Next Track key

    case vk.VK_MEDIA_PREV_TRACK: return 0; // Previous Track key

    case vk.VK_MEDIA_STOP: return 0; // Stop Media key

    case vk.VK_MEDIA_PLAY_PAUSE: return 0; // Play/Pause Media key

    case vk.VK_LAUNCH_MAIL: return 0; // Start Mail key

    case vk.VK_LAUNCH_MEDIA_SELECT: return 0; // Select Media key

    case vk.VK_LAUNCH_APP1: return 0; // Start Application 1 key

    case vk.VK_LAUNCH_APP2: return 0; // Start Application 2 key

    case vk.VK_OEM_1: return js.KEY_Semicolon; // Used for miscellaneous characters; it can vary by keyboard.
// For the US standard keyboard, the ';:' key

    case vk.VK_OEM_PLUS: return js.KEY_Equals; // For any country/region, the '+' key

    case vk.VK_OEM_COMMA: return js.KEY_Comma; // For any country/region, the ',' key

    case vk.VK_OEM_MINUS: return js.KEY_Minus; // For any country/region, the '-' key

    case vk.VK_OEM_PERIOD: return js.KEY_Period; // For any country/region, the '.' key

    case vk.VK_OEM_2: return js.KEY_ForwardSlash; // Used for miscellaneous characters; it can vary by keyboard.
// For the US standard keyboard, the '/?' key

    case vk.VK_OEM_3: return js.KEY_GraveAccent; // Used for miscellaneous characters; it can vary by keyboard.
// For the US standard keyboard, the '`~' key

    case vk.VK_OEM_4: return js.KEY_OpenSquareBracket; // Used for miscellaneous characters; it can vary by keyboard.
// For the US standard keyboard, the '[{' key

    case vk.VK_OEM_5: return js.KEY_BackSlash; // Used for miscellaneous characters; it can vary by keyboard.
// For the US standard keyboard, the '\|' key

    case vk.VK_OEM_6: return js.KEY_CloseSquareBracket; // Used for miscellaneous characters; it can vary by keyboard.
// For the US standard keyboard, the ']}' key

    case vk.VK_OEM_7: return js.KEY_Quote; // Used for miscellaneous characters; it can vary by keyboard.
// For the US standard keyboard, the 'single-quote/double-quote' key

    case vk.VK_OEM_8: return 0; // Used for miscellaneous characters; it can vary by keyboard.

    case vk.VK_OEM_102: return js.KEY_BackSlash;
    // Either the angle bracket key or the backslash key on the RT 102-key keyboard

    case vk.VK_PROCESSKEY: return 0; // IME PROCESS key

    case vk.VK_PACKET: return 0; // case vk.Used to pass Unicode characters as if they were keystrokes.
    // The VK_PACKET key is the low word of a 32-bit Virtual Key value used for non-keyboard input methods.
    // For more information, see Remark in KEYBDINPUT, SendInput, WM_KEYDOWN, and WM_KEYUP

    case vk.VK_CRSEL: return 0; // CrSel key

    case vk.VK_EXSEL: return 0; // ExSel key

    case vk.VK_EREOF: return 0; // Erase EOF key

    case vk.VK_PLAY: return 0; // Play key

    case vk.VK_ZOOM: return 0; // Zoom key

    case vk.VK_NONAME: return 0; // Reserved

    case vk.VK_PA1: return 0; // PA1 key

    case vk.VK_OEM_CLEAR: return 0; // Clear key

  }
  return 0;
}
