import { client } from 'camelot-unchained';
import {Promise} from 'es6-promise'

import {Material} from '../../lib/Material';
import {Block} from '../../lib/Block';

class BuildingLoader {
  private materials: { [key: number]: Material } = {};
  private materialsList: Material[] = [];
  private blocks: { [key: number]: Block; } = {};

  private numBlocksToLoad: number = 0;

  public changeBlockSelection(block: Block) {
    client.ChangeBlockType(block.id);
  }

  public listenForBlockSelectionChange(callback: { (matId: number, shapeId: number): void }) {
    const listener = (blockId: number) => {
      callback(
        this.getMaterialIdFromBlockId(blockId),
        this.getShapeIdFromBlockId(blockId)
      );
    }
    client.OnBlockSelected(listener);
  }

  public loadMaterials(callback: (mats: Material[]) => void) {
    client.OnReceiveBlocks(this.recieveBlocks);
    client.OnReceiveBlockTags((id: number, tags: any) => this.recieveBlockTags(id, tags, callback));
    //client.OnReceiveBlockIDs(this.recieveBlockIdsForSubstance)
    client.OnReceiveSubstances(this.recieveSubstances);
    client.RequestSubstances();
  }

  public getShapeIdFromBlockId(id: number) {
    return (id >> 21) & 31;
  }

  public getMaterialIdFromBlockId(id: number) {
    return (id >> 2) & 4095;
  }

  recieveSubstances = (subsRecieved: any): void => {
    let count = 0;
    for (let i in subsRecieved) {
      count++;
      let id = parseInt(i);

      let material: Material = {
        id: id,
        icon: subsRecieved[i],
        name: '',
        tags: '',
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
      let id = parseInt(i);
      this.blocks[id] = {
        id: id,
        icon: blocksRecieved[i],
        name: '',
        tags: '',
        shape: ''
      } as Block;
    }

    for (let i in blocksRecieved) {
      let id = parseInt(i);
      client.RequestBlockTags(id);
    }

    console.log('recieved ' + this.numBlocksToLoad + ' blocks')

  }

  recieveBlockTags = (id: number, tags: any, callback: { (mats: Material[]): void }) => {
    let i: number;
    const block: Block = this.blocks[id];
    block.name = tags.Types.join(', ');
    block.shapeId = this.getShapeIdFromBlockId(id);
    block.shape = tags.Shapes.join(', ');
    block.materialId = this.getMaterialIdFromBlockId(id);
    block.tags = tags.Types.join(', ');

    let material = this.materials[block.materialId];
    if (material == null) {
      console.log("unknown substance " + block.materialId + " for block " + block.id + "-" + block.name);
    }
    else {
      material.name = tags.Types.join(' ');
      material.tags = tags.Types.join('-');
      material.blocks.push(block);
    }

    if (--this.numBlocksToLoad === 0) {
      // finished loading shapes and types
      callback(this.materialsList);
    }
  }
}

export default new BuildingLoader();
