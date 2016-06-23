/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
import { client } from 'camelot-unchained';
import { store } from './Building';

export interface Block {
  id: number;
  icon: string;
  shapes: string[];
  shape: string;
  types: string[];
  type: string;
}

export interface TypeBlock {
  id: number,
  type: string,
  shape: string,
  icon: string
}

export interface ShapeBlock {
  id: number,
  shape: string,
  icon: string
}

export class BlockStore {
  blockList: { [id: number]: Block; } = {};
  shapes: ShapeBlock[] = [];
  types: string[] = [];
  numBlocksToLoad: number = 0;

  private addBlock = (id: number, icon: string): void => {
    this.blockList[id] = { id: id, icon: icon, shapes: [], types: [], shape: "", type: "" };
    // client.RequestBlockTags(id); --- Bugged! (wrong interface)
    client.RequestBlockTags(id);
  }
  private listenBlockTags = (): void => {
    client.OnReceiveBlockTags((id: number, tags: any) => {
      let i: number;
      const block: Block = this.blockList[id];
      block.shapes = tags.Shapes;
      block.shape = tags.Shapes.join('-');
      block.types = tags.Types;
      block.type = tags.Types.join('-');
      if (--this.numBlocksToLoad === 0) {
        // finished loading shapes and types
        this.loaded();
      }
    });
  }
  private listenBlocks = (): void => {
    client.OnReceiveBlocks((blocks: any) => {
      let key: any;
      for (key in blocks) {
        ++this.numBlocksToLoad;
      }
      for (key in blocks) {
        this.addBlock(key|0, blocks[key]);
      }
    });
  }
  private loaded = (): void => {

    // build up list of type and shapeIcons
    this.findShapesAndTypes();

    // finally update state with loaded blocks
    store.dispatch({ type: 'RECV_BLOCKS', when: Date.now() } as any);
  }

  private findShapesAndTypes = (): void => {
    const shapes: any = {};
    const types: any = {};
    let key: number = 0;

    // build up shape and type maps
    for (var b in this.blockList) {
      var block = this.blockList[b];
      const shape: string = block.shape;
      if (shapes[shape] === undefined) {
        shapes[shape] = {
          shape: shape,
          id: block.id,
          icon: block.icon
        };
      }
      block.types.forEach((type: string): void => {
        if (types[type] === undefined) {
          types[type] = true;
        }
      })
    }

    // build up shape icon list
    this.shapes = [];
    for (let shape in shapes) {
      this.shapes.push(shapes[shape]);
    }

    // build up list of type keywords
    this.types = [];
    for (let type in types) {
      this.types.push(type);
    }
    this.types.sort((a: string, b: string) => a < b ? -1 : a > b ? 1 : 0);
  }

  // loads block details from the server
  public load = (): void => {
    store.dispatch({ type: 'LOAD_BLOCKS' });
    this.blockList = {};
    this.listenBlockTags();
    this.listenBlocks();
    client.RequestBlocks();
  }

  public getShapes = (): ShapeBlock[] => {
    return this.shapes;
  }

  public getTypes = (shape: string = undefined, keywords: string[] = undefined): TypeBlock[] => {
    function matches(block: Block) {
      for (let i = 0; i < keywords.length; i++) {
        if (block.types.indexOf(keywords[i]) === -1) return;
      }
      return true;
    }
    const types: TypeBlock[] = [];
    // build up type icon list
    for (var b in this.blockList) {
      var block = this.blockList[b];
      if (!shape || block.shape === shape) {
        if (!keywords || !keywords.length || matches(block)) {
          types.push({
            id: block.id,
            type: block.type,
            shape: block.shape,
            icon: block.icon
          });
        }
      }
    }
    return types;
  }

  public getTypeKeywords = (): string[] => {
    return this.types;
  }
}

export const blocks: BlockStore = new BlockStore();
export default blocks;
