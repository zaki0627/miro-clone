export type BoardObjectType = "sticky" | "text" | "image";

export class BoardObject {
  id!: string;
  boardId!: string;
  type!: BoardObjectType;
  x!: number;
  y!: number;
  width?: number;
  height?: number;
  content?: string;
  color?: string;
  createdAt!: string;
  updatedAt!: string;

  constructor(data: BoardObject) {
    Object.assign(this, data);
  }
}
