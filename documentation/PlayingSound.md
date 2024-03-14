# Playing Sound

### Playing sound in CU

1. Go to `library/src/camelotunchained/game/types/SoundEvents.ts` you will see a `SoundEvents` enum.
2. Each of these IDs are generally provided by the sound engineer (dB). Adding an id is as simple as adding the id to this enum and building the library (see Library.md for instructions on building library)
3. Now, go to whichever CU project you would like to add the song to.
4. There is a function attached to the global `game` object called `playGameSound`. Whenever you want to play a sound, just call the function and pass in the sound ID to the parameter.

```
game.playGameSound(SoundEvents.PLAY_UI_MENU_BOONSELECT);
game.playGameSound(SoundEvents.PLAY_UI_MENU_BANESELECT);
etc.
```

### Playing sound in FSR -- Similar to CU

1. Go to `library/src/hordetest/game/types/SoundEvents.ts` you will se a `SoundEvent` enum.
2. Each of these IDs are generally provided by the sound engineer (dB). Adding an id is as simple as adding the id to this enum and building the library (see Library.md for instructions on building library)
3. Now, go to whichever FSR project you would like to add the song to.
4. There is a function attached to the global `game` object called `playGameSound`. Whenever you want to play a sound, just call the function and pass in the sound ID to the parameter.

### Playing sound in the Launcher

1. Consult the enumeration in `launcher/lib/Sound.ts` to pick the sound you want to play.  New sounds can be added by including a new .ogg file and adding it to the enumeration.
2. Import `{ Sound, playSound }` in the file that you're editing
3. Call `playSound(Sound.XXXX)` to make the sound play.
