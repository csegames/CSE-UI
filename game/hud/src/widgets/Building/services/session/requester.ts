/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { building } from '../../lib/old-library';

class BuildingRequests {
  public changeMode(mode: number) {
    building.changeMode(mode);
  }

  public changeBlockSelection(block: Block) {
    building.requestBlockSelect(block);
  }

  public loadMaterials() {
    building.requestMaterials();
  }


  public commit() {
    building.commit();
  }

  public undo() {
    building.undo();
  }

  public redo() {
    building.redo();
  }

  public rotX() {
    building.rotateX();
  }

  public rotY() {
    building.rotateY();
  }

  public rotZ() {
    building.rotateZ();
  }

  public flipX() {
    building.flipX();
  }

  public flipY() {
    building.flipY();
  }

  public flipZ() {
    building.flipZ();
  }
}

export default new BuildingRequests();
