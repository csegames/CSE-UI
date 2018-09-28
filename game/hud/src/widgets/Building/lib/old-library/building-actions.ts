import client from '../core/client';

export function changeMode(mode: number) {
  client.SetBuildingMode(mode);
}

export function commit() {
  client.CommitBlock();
}

export function undo() {
  client.UndoCube();
}

export function redo() {
  client.RedoCube();
}

export function rotateX() {
  client.BlockRotateX();
}

export function rotateY() {
  client.BlockRotateY();
}

export function rotateZ() {
  client.BlockRotateZ();
}

export function flipX() {
  client.BlockFlipX();
}

export function flipY() {
  client.BlockFlipY();
}

export function flipZ() {
  client.BlockFlipZ();
}
