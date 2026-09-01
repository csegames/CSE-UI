let nextId = 1;

export abstract class Line {
  public readonly id: number;

  constructor(public readonly numConnections: number, public readonly timestamp: number) {
    this.id = ++nextId;
  }

  public abstract render(): React.ReactChild;
}
