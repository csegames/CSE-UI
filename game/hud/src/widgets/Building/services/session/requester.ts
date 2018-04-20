import { building, BuildingBlock } from '@csegames/camelot-unchained';
import faker from './requester_fake';

class BuildingRequests {
  private win: any = window;
  private fake: boolean = (this.win.cuAPI == null);

  public changeMode(mode: number) {
    if (this.fake) {
      return faker.changeMode(mode);
    }

    building.changeMode(mode);
  }

  public changeBlockSelection(block: BuildingBlock) {
    if (this.fake) {
      return faker.requestBlockSelect(block);
    }

    building.requestBlockSelect(block);
  }

  public loadMaterials() {
    if (this.fake) {
      return faker.requestMaterials();
    }

    building.requestMaterials();
  }


  public commit() {
    if (this.fake) {
      return faker.commit();
    }

    building.commit();
  }

  public undo() {
    if (this.fake) {
      return faker.undo();
    }

    building.undo();
  }

  public redo() {
    if (this.fake) {
      return faker.redo();
    }

    building.redo();
  }

  public rotX() {
    if (this.fake) {
      return faker.rotX();
    }

    building.rotateX();
  }

  public rotY() {
    if (this.fake) {
      return faker.rotY();
    }

    building.rotateY();
  }

  public rotZ() {
    if (this.fake) {
      return faker.rotZ();
    }

    building.rotateZ();
  }

  public flipX() {
    if (this.fake) {
      return faker.flipX();
    }

    building.flipX();
  }

  public flipY() {
    if (this.fake) {
      return faker.flipY();
    }

    building.flipY();
  }

  public flipZ() {
    if (this.fake) {
      return faker.flipZ();
    }

    building.flipZ();
  }
}

export default new BuildingRequests();
