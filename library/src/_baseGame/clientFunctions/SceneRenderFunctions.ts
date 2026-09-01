import { engine } from '../../_baseGame/engine';

const RenderPaperDollCallbackName = 'scene.RenderPaperDoll';
const DeletePaperDollCallbackName = 'scene.DeletePaperDoll';
const PauseAllPaperDollExceptCallbackName = 'scene.PauseAllPaperDollExcept';

export interface SceneRenderFunctions {
  renderPaperDoll(character: string, classID: number, raceID: number, genderID: number, animation: string, defaultOutfit: string): void;
  deletePaperDoll(character: string): void;
  pauseAllPaperDollExcept(character: string): void;
}

class CoherentSceneRenderFunctions implements SceneRenderFunctions {
  renderPaperDoll(character: string, classID: number, raceID: number, genderID: number, animation: string, defaultOutfit: string): void {
    engine.trigger(RenderPaperDollCallbackName, character, classID, raceID, genderID, animation, defaultOutfit);
  }

  deletePaperDoll(character: string): void {
    engine.trigger(DeletePaperDollCallbackName, character);
  }

  pauseAllPaperDollExcept(character: string): void {
    engine.trigger(PauseAllPaperDollExceptCallbackName, character);
  }
}

class BrowserSceneRenderFunctions implements SceneRenderFunctions {
  renderPaperDoll(character: string, classID: number, raceID: number, genderID: number, animation: string, defaultOutfit: string) { }
  deletePaperDoll(character: string) { }
  pauseAllPaperDollExcept(character: string) { }
}

export const impl: SceneRenderFunctions = engine.isAttached ? new CoherentSceneRenderFunctions() : new BrowserSceneRenderFunctions();
