# Playing Sound

### Playing sound in CU
1. Go to `library/src/camelotunchained/types/SoundEvent.ts` you will see a `SoundEvent` enum.
2. Each of these IDs are generally provided by the sound engineer (dB). Adding an id is as simple as adding the id to this enum and building the library (see Library.md for instructions on building library)
3. Now, go to whichever CU project you would like to add the song to.
4. There is a function attached to the global `game` object called `playGameSound`. Whenever you want to play a sound, just call the function and pass in the sound ID to the parameter.
```
game.playGameSound(SoundEvents.PLAY_UI_MENU_BOONSELECT);
game.playGameSound(SoundEvents.PLAY_UI_MENU_BANESELECT);
etc.
```

### Playing sound in FSR -- Similar to CU
1. Go to `library/src/hordetest/types/SoundEvents.ts` you will se a `SoundEvent` enum.
2. Each of these IDs are generally provided by the sound engineer (dB). Adding an id is as simple as adding the id to this enum and building the library (see Library.md for instructions on building library)
3. Now, go to whichever FSR project you would like to add the song to.
4. There is a function attached to the global `game` object called `playGameSound`. Whenever you want to play a sound, just call the function and pass in the sound ID to the parameter.

### Playing sound in the Patcher
Sounds are handled differently in the patcher than the in-game projects.

1. In `patcher/src/sounds/` you will see a couple `.ogg` files.
2. If you go to `patcher/src/components/Sound/index.tsx`. This component is responsible for receiving events and playing sounds. In this file, you can see that we have a `sounds` object with items that point to the .ogg file paths. If you go scroll down more, and look at the `generateAudioElement` function, you will see the id's that you can pass in to the event when you want to play a sound in the switch case.
3. To play a sound, go anywhere in the patcher and use the `play-sound` event.
```
game.trigger('play-sound', 'launch-game');
game.trigger('play-sound', 'server-select');
```
