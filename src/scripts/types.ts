export type DrawElement = {
  id: string;
  color: string;
  points: DrawPoint[];
};

export type DrawPoint = { x: number; y: number };
