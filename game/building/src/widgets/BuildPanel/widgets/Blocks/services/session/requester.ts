import { client } from 'camelot-unchained';
import {Promise} from 'es6-promise';

import {Material, MaterialType, getTypeFromTags} from '../../lib/Material';
import {Block} from '../../lib/Block';
import faker from './requester_fake';

class BuildingLoader {
  private materials: { [key: number]: Material } = {};
  private materialsList: Material[] = [];
  private blocks: { [key: number]: Block; } = {};

  private numBlocksToLoad: number = 0;

  private win: any = window;
  private fake: boolean = (this.win.cuAPI == null);

  public changeBlockSelection(block: Block) {
    if (this.fake) {
      return faker.changeBlockSelection(block);
    }

    client.ChangeBlockType(block.id);
  }

  public listenForBlockSelectionChange(callback: { (matId: number, shapeId: number): void }) {
    if (this.fake) {
      return faker.listenForBlockSelectionChange(callback);
    }

    const listener = (blockId: number) => {
      callback(
        this.getMaterialIdFromBlockId(blockId),
        this.getShapeIdFromBlockId(blockId)
      );
    }
    client.OnBlockSelected(listener);
  }

  public loadMaterials(callback: (mats: Material[]) => void) {
    if (this.fake) {
      return faker.loadMaterials(callback);
    }

    client.OnReceiveBlocks(this.recieveBlocks);
    client.OnReceiveBlockTags((id: number, tags: any) => this.recieveBlockTags(id, tags, callback));
    //client.OnReceiveBlockIDs(this.recieveBlockIdsForSubstance)
    client.OnReceiveSubstances(this.recieveSubstances);
    client.RequestSubstances();
  }

  getShapeIdFromBlockId(id: number) {
    return (id >> 21) & 31;
  }

  getMaterialIdFromBlockId(id: number) {
    return (id >> 2) & 4095;
  }

  recieveSubstances = (subsRecieved: any): void => {
    let count = 0;
    for (let i in subsRecieved) {
      count++;
      const id = parseInt(i);

      const material: Material = {
        id: id,
        icon: subsRecieved[i],
        name: '',
        tags: '',
        type: MaterialType.OTHER,
        blocks: []
      } as Material;

      this.materials[id] = material;
      this.materialsList.push(material);
    }
    client.RequestBlocks();
  }

  recieveBlockIdsForSubstance = (blockIds: any): void => {

  }

  recieveBlocks = (blocksRecieved: any): void => {

    for (let i in blocksRecieved) {
      this.numBlocksToLoad++;
      const id = parseInt(i);
      this.blocks[id] = {
        id: id,
        icon: blocksRecieved[i],
        name: '',
        tags: '',
        shape: ''
      } as Block;
    }

    for (let i in blocksRecieved) {
      const id = parseInt(i);
      client.RequestBlockTags(id);
    }
  }

  recieveBlockTags = (id: number, tags: any, callback: { (mats: Material[]): void }) => {
    const block: Block = this.blocks[id];
    block.name = tags.Types.join(', ');
    block.shapeId = this.getShapeIdFromBlockId(id);
    block.shape = tags.Shapes.join(', ');
    block.materialId = this.getMaterialIdFromBlockId(id);
    block.tags = tags.Types.join(', ');

    const material = this.materials[block.materialId];
    if (material == null) {
      console.log("unknown substance " + block.materialId + " for block " + block.id + "-" + block.name);
    } else {
      material.name = tags.Types.join(' ');
      material.tags = tags.Types.join('-');
      material.blocks.push(block);
      material.type = getTypeFromTags(tags.Types);
    }

    if (--this.numBlocksToLoad === 0) {
      // finished loading shapes and types
      callback(this.materialsList);
    }
  }
}

export default new BuildingLoader();
