import {client, channelId, events} from 'camelot-unchained';
import faker from './requester_fake';

class ActionLoader {
  private win: any = window;
  private fake: boolean = (this.win.cuAPI == null);

  private modeCallbacks: { (mode: number): void }[] = [];
  private singleModeCallback: { (mode: number): void } = null;

  public listenForModeChange(callback: { (mode: number): void }) {
    if (this.fake) {
      return faker.listenForModeChange(callback);
    }

    this.modeCallbacks.push(callback);

    if (this.singleModeCallback == null) {
      this.singleModeCallback = (mode: number) => {
        this.modeCallbacks.forEach((callback: (mode: number) => void) => {
          callback(mode);
        });
      }
      client.OnBuildingModeChanged(this.singleModeCallback);
    }
  }

  public unlistenForModeChange(callback: { (mode: number): void }) {
    if (this.fake) {
      return faker.unlistenForModeChange(callback);
    }

    const index: number = this.modeCallbacks.indexOf(callback);
    if (index > -1) {
      this.modeCallbacks.slice(index, 1);
    }
  }

  public changeMode(mode: number) {
    if (this.fake) {
      return faker.changeMode(mode);
    }

    client.SetBuildingMode(mode);
  }

  public commit() {
    if (this.fake) {
      return faker.commit();
    }

    client.CommitBlock();
  }

  public undo() {
    if (this.fake) {
      return faker.undo();
    }

    client.UndoCube();
  }

  public redo() {
    if (this.fake) {
      return faker.redo();
    }

    client.RedoCube();
  }

  public rotX() {
    if (this.fake) {
      return faker.rotX();
    }

    client.BlockRotateX();
  }

  public rotY() {
    if (this.fake) {
      return faker.rotY();
    }

    client.BlockRotateY();
  }

  public rotZ() {
    if (this.fake) {
      return faker.rotZ();
    }

    client.BlockRotateZ();
  }

  public flipX() {
    if (this.fake) {
      return faker.flipX();
    }

    client.BlockFlipX();
  }

  public flipY() {
    if (this.fake) {
      return faker.flipY();
    }

    client.BlockFlipY();
  }

  public flipZ() {
    if (this.fake) {
      return faker.flipZ();
    }

    client.BlockFlipZ();
  }
}

export default new ActionLoader();
