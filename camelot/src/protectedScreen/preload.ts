import { loadGame } from '@csegames/library/dist/_baseGame';

// This file acts as a stub that dynamically loads index.tsx and its dependencies after
// the game and camelot objects are ready to use. This allows all of our code to directly
// reference those types without needing to worry about lifecycle concerns.
loadGame()
  .then(() => {
    import('.');
  })
  .catch((err: any) => {
    // decide what we want to do about this
    console.log('GameModel load failed', err);
  });
