export type States = 'online' | 'offline' | 'initializing';
export type DataTypes = 'string' | 'status';

export type DataMapper = {
  [key: string]: DataTypes | { title?: string, type?: DataTypes };
};
