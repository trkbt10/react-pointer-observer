export type ObservePointerCallback = (params: PointerInfo) => void;
export type TargetPointer = Omit<
  PointerInfo,
  "pointerId" | "type" | "pageX" | "pageY" | "isFinal"
>;
export type PointerInfo = {
  pointerId: string;
  type: "pointerdown" | "pointerend" | "pointermove";
  timestamp: number;
  elapsedtime: number;
  pageX: number;
  pageY: number;
  deltaX: number;
  deltaY: number;
  startX: number;
  startY: number;
  localX: number;
  localY: number;
  button: number;
  isFinal: boolean;
  pointerLength: number;
  target: Element;
  defaultPrevented: boolean;
  ZIndexList: number[];
};
