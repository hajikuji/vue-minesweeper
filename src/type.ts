export interface BlockState {
  x: number;
  y: number;
  revealed: boolean;
  mine?: boolean;
  flaged?: boolean;
  adjacentMines: number;
}