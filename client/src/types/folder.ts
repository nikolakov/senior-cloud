export type Folder = {
  id: string;
  name: string;
  owner: string;
  parentFolder?: string;
  createdAt: Date;
  updatedAt: Date;
};
