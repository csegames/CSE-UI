import type { Patcher } from './api/patcher/patcher';

declare global {
  interface Window {
    patcher: Patcher;
  }
}
