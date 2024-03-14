import { BaseGameInterface } from '../_baseGame/BaseGameInterface';

export interface DevUIButtonParams {
  title: string;
  command?: string; // slash command to execute when set
  call?: keyof BaseGameInterface; // function to call on game object when set
  params?: any[]; // Parameters for call
}
