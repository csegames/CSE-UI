/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
import { client, restAPI } from 'camelot-unchained';
import { store } from './Building';

export interface Blueprint {
  id: number;
  name: string;
  icon: string;
}

export class BlueprintStore {

  private initDone: boolean = false;
  private blueprints: Blueprint[] = [];
  private loading: number = 0;
  private loadQ: Blueprint[] = [];
  private timer: any;

  private updateBlueprint = (blueprint: Blueprint): void => {
    for (let i: number = 0; i < this.blueprints.length; i++) {
      const bp: Blueprint = this.blueprints[i];
      if (bp.id === blueprint.id) {   // TODO: Use id or name here?
        this.blueprints[i] = blueprint;
        return;
      }
    }
    this.blueprints.push(blueprint);
  }

  private loadIcon = (blueprint: Blueprint): void => {
    this.updateBlueprint(blueprint);
    restAPI.getBlueprintIcon(blueprint.id)
      .then((icon: string): void => {
        blueprint.icon = icon;
        setTimeout(() => this.processQ(), 0);
      },(): void => {
        blueprint.icon = undefined;     // use a broken icon?
        setTimeout(() => this.processQ(), 0);
      });
  }

  private processQ = (): void => {
    if (this.timer) {
      clearTimeout(this.timer);
      this.timer = undefined;
    }
    if (this.loadQ.length === 0) {
      // call loaded on a timer, then if more
      // blueprints need loading, they will delay
      // calling loaded
      this.timer = setTimeout(() => {
        this.timer = undefined;     // timer fired
        this.loaded();
      },100);
    } else {
      this.loadIcon(this.loadQ.shift());
    }
  }

  private addBlueprint = (id: number, name: string): void => {
    this.loadQ.push({ id: id, name: name, icon: undefined });
    this.loading ++;
    this.processQ();
  }

  private downloadBlueprints = (charId: string): void => {
    restAPI.getBlueprints(charId)
      .then((data: any): void => {
        const blueprints: any[] = data.blueprints;
        for (var i = 0; i < blueprints.length; i++) {
          client.ReceiveBlueprintFromServer(blueprints[i].name, blueprints[i].cellData, blueprints[i]._id);
        }
      },(): void => {
        console.log('failed to download bluepritns');
      });
  }

  private uploadBlueprint = (charId: string, name: string, data: any): void => {
    restAPI.addBlueprint(charId, name, data)
      .then((data: any): void => {
        if (data.name && data.cellData && data._id) {
          client.ReceiveBlueprintFromServer(data.name, data.cellData, data._id);
        }
      },(): void => {
        console.log('failed to upload blueprint');
      });
  }

  private listenBlueprints = (): void => {
    client.OnDownloadBlueprints((charId: string) => {
      this.downloadBlueprints(charId);
    });
    client.OnNewBlueprint((index: number, name: string) => {
      this.addBlueprint(index, name);
    });
    client.OnCopyBlueprint(() => {
      store.dispatch({ type: 'COPY_BLUEPRINT', when: Date.now() } as any);
    });
    client.OnUploadBlueprint((charId: string, name: string, data: any) => {
      this.uploadBlueprint(charId, name, data);
    });
    client.OnBlueprintSelected(() => {
      debugger;       // TODO: Does this ever get fired?
    });
  }

  public init = (): void => {
    if (!this.initDone) {
      this.initDone = true;
      this.load();
    }
  }
  // loads Blueprint details from the server
  public load = (): void => {
    store.dispatch({ type: 'LOAD_BLUEPRINTS' });
    this.blueprints = [];
    this.listenBlueprints();
    client.RequestBlueprints();
    client.DownloadBlueprints();
    // because RequestBlueprints/DownloadBlueprints DONT inform us if there are no
    // blueprints, they simple don't bother sending us any info, we need to wait a
    // bit and then check if nothing was sent (loading still 0) and call loaded if
    // that is the case.
    setTimeout((): void => {
      if (this.loading === 0) {
        this.loaded();
      }
    }, 2000);
  }

  private loaded = (): void => {
    store.dispatch({ type: 'RECV_BLUEPRINTS', when: Date.now() } as any);
  }

  public getBlueprints = (): Blueprint[] => {
    if (!this.initDone) {
      setTimeout(() => this.load(),100);
    }
    return this.blueprints;
  }

  public getId = (name: string): number => {
    for (let i: number = 0; i < this.blueprints.length; i++) {
      if (this.blueprints[i].name.toLowerCase() === name) {
        return i;
      }
    }
  }

  public getBlueprint = (id: number): Blueprint => {
    for (let i: number = 0; i < this.blueprints.length; i++) {
      if (this.blueprints[i].id === id) {
        return this.blueprints[i];
      }
    }
  }

  public remove = (id: number): void => {
    for (let i: number = 0; i < this.blueprints.length; i++) {
      if (this.blueprints[i].id === id) {
        this.blueprints.splice(i,1);
        store.dispatch({ type: 'RECV_BLUEPRINTS', when: Date.now() } as any);
        return;
      }
    }
  }
}

export const blueprints: BlueprintStore = new BlueprintStore();
export default blueprints;
