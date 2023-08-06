export type FolderFromApi = {
  id: string;
  name: string;
  owner: string;
  parentFolder?: string;
  createdAt: Date;
  updatedAt: Date;
};
