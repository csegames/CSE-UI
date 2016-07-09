import {client, channelId, events} from 'camelot-unchained';

class BlockActions {
  private modeCallbacks: { (mode: number): void }[] = [];

  public listenForModeChange(callback: { (mode: number): void }) {
    this.modeCallbacks.push(callback);
    console.log("added listener: "+this.modeCallbacks.length);
  }

  public changeMode(mode: number) {
    console.log("changeMode to "+mode);
    setTimeout(() => {
      this.modeCallbacks.forEach((callback: (mode: number) => void) => {
        callback(mode);
      })
    }, 500);
  }

 public unlistenForModeChange(callback: { (mode: number): void }) {
    const index: number = this.modeCallbacks.indexOf(callback);
    if (index > -1) {
      this.modeCallbacks.splice(index, 1);
    }
    console.log("removed listener: "+this.modeCallbacks.length);
  }

  public commit() {
    console.log("commit");
  }

  public undo() {
    console.log("undo");
  }

  public redo() {
    console.log("redo");
  }

  public rotX() {
    console.log("comrotXmit");
  }

  public rotY() {
    console.log("rotY");
  }

  public rotZ() {
    console.log("rotZ");
  }

  public flipX() {
    console.log("flipX");
  }

  public flipY() {
    console.log("flipY");
  }

  public flipZ() {
    console.log("flipZ");
  }
}
export default new BlockActions();