import { client } from 'camelot-unchained';
import {Promise} from 'es6-promise';

import SingleListener from '../../../../../../lib/SingleListener'
import {Material, MaterialType, getTypeFromTags} from '../../lib/Material';
import {Block} from '../../lib/Block';
import faker from './requester_fake';

class BuildingLoader {
  private materials: { [key: number]: Material } = {};
  private materialsList: Material[] = [];
  private blocks: { [key: number]: Block; } = {};

  private singleListener: SingleListener = new SingleListener((listener: any) => {
    const blockIdListener = (blockId: number) => {
      const matId: number = this.getMaterialIdFromBlockId(blockId);
      const shapeId: number = this.getShapeIdFromBlockId(blockId);

      const mat: Material = this.materials[matId];
      //select by shape instead of by block id, it is more reliable, the block id sent back 
      //can have extra information stored in it
      const block: Block = this.getBlockForShapeId(shapeId, mat.blocks);

      listener( mat, block);
    }
    /*
      Calling the faker here instead of at the top of the listen/unlisten methods because 
      I don't want to bypass this single listener concept when testing.
    */
    if (this.fake) {
      return faker.listenForBlockSelectionChange(blockIdListener);
    }
    client.OnBlockSelected(blockIdListener);
  });


  private numBlocksToLoad: number = 0;

  private win: any = window;
  private fake: boolean = (this.win.cuAPI == null);

  public changeBlockSelection(block: Block) {
    if (this.fake) {
      return faker.changeBlockSelection(block);
    }

    client.ChangeBlockType(block.id);
  }

  public listenForBlockSelectionChange(callback: { (mat: Material, block: Block): void }) {
    this.singleListener.listen(callback);
  }

  public unlistenForBlockSelectionChange(callback: { (mat: Material, block: Block): void }) {
    this.singleListener.unlisten(callback);
  }

  public loadMaterials(callback: (mats: Material[]) => void) {
    if (this.fake) {
      const loadIntercept = (mats: Material[])=>{
        this.materialsList = mats;
        this.materialsList.forEach((mat: Material)=>{
          this.materials[mat.id]=mat;
          mat.blocks.forEach((block: Block) => {
            this.blocks[block.id]
          });
        })
        callback(mats);
      }
      return faker.loadMaterials(loadIntercept);
    }

    client.OnReceiveBlocks(this.recieveBlocks);
    client.OnReceiveBlockTags((id: number, tags: any) => this.recieveBlockTags(id, tags, callback));
    //client.OnReceiveBlockIDs(this.recieveBlockIdsForSubstance)
    client.OnReceiveSubstances(this.recieveSubstances);
    client.RequestSubstances();
  }

  getBlockForShapeId(shapeId: number, blocks: Block[]) {
    for (let i in blocks) {
      const block = blocks[i];
      if (block.shapeId === shapeId) {
        return block;
      }
    }
    return blocks[0];
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
