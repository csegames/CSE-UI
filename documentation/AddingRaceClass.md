# Adding Race/Class

### To the patcher
There are a lot of hardcoded pieces of the patcher for this process.

**The api server needs to have the data about the new race/class in order to enable the UI to add to the patcher.**

**Also, this process isn't ideal. An ideal process would be completely data-driven by the api-server.**

### Step 1: Updating the enums
1. Go to `library/` and update the web api definitions. If the api server is up to date
- For CU, `yarn start definitions.camelotunchained`
- For FSR, `yarn start definitions.hordetest`
2. Build the library `yarn start build`

### Step 2: Adding the class description
1. Go to `patcher/src/widgets/CharacterCreation/components/Class/PlayerClassSelect.tsx`
2. Insert descriptions about the class in the `classText` object (I obtain them from our website)
- https://camelotunchained.com/v3/realms/arthurians/
- https://camelotunchained.com/v3/realms/tuatha-de-danann/
- https://camelotunchained.com/v3/realms/vikings/

### Step 3: Add the art for the class
1. Go to `patcher/src/widgets/CharacterCreation/sass/_class-select.scss`. You will see thumbnail images prefixed with thumb__ and also standing images prefixed with standing__. You need images for both.
2. Obtain image (currently, I obtain the new ones from the website.)
- https://camelotunchained.com/v3/realms/arthurians/
- https://camelotunchained.com/v3/realms/tuatha-de-danann/
- https://camelotunchained.com/v3/realms/vikings/
If you scroll down on the website, you will see profile icons for the classes. Use these for the thumb__. Click on them and you will see a "standing" image. Save that and use that for the standing__ image.
3. To obtain an image from the website, go to the specific image, right click on it, and click `Save Image as...`
4. Add the standing image to `patcher/src/images/classes/`. Standing images follow this naming convention `race-genderLetter-class.png`
5. Add the thumbnail image to `patcher/src/images/classes/profile`. Profile images follow this naming convention
6. Now go to the `_class_select.scss` we had opened earlier. Add the respective classes pointing to these images.

### Step 4: Update Character Select
1. Go to `patcher/src/widgets/Controller/components/CharacterSelect/components/CharacterSelectListItem.tsx`.
2. Go to the function `renderCharImg`. You can see that a charIdentifier and a classImg gets passed into the function. This function is in charge of setting unique (or not) styles to that specific RaceGenderClass combo so that the image looks good for each combo.
3. Scroll up to the `render` function. You can see that the variable `classImg` is utilizing a function called `getCharImage`. Go to that function.
4. Once you are in the file that contains getCharImage, `characterImages.ts`, if you obtained the images from the website, you'll need to go to the `isSpecialClass` function and add the classes to that if statement. This is because the patcher has been given art in the past that had gender/race specific class art, but we haven't gotten that for a while from the art team so we've been getting the art off of the website. The art of the website has no gender/race specific assets.

### Step 5: Done
This should be everything you need to add a class to the patcher. You can make minor edits to positions depending on the image you get for polish.

### To CU HUD
The only thing that should require some intervention from a UI engineer is setting up the class for the Ability Builder. CU is pretty data driven, the only thing that isn't are the images that go onto the type select items.

1. Go to `game/camelotunchained/hud/src/components/fullscreen/AbilityBuilder/AbilityTypeSelect/AbilityAtypeSelectItem.tsx` and you will see a function called `getSelectImage`.
2. getSelectImage returns a file path that points to an image. That file path includes a class.
3. Go to the file path in the return function, and add the image to use for that archetype.

That's about it (atm) for updating the game.
