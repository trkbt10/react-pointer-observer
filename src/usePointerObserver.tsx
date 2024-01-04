import * as React from "react";
import type { PointerInfo } from "./types";
import { observePointer } from "./observePointer";

export const usePointerObserver = <T extends HTMLElement | SVGElement>(
  ref: React.RefObject<T>
) => {
  const [pointerInfo, setPointerInfo] = React.useState<PointerInfo>();
  observePointer(ref, setPointerInfo);
  const deferredValue = React.useDeferredValue(pointerInfo);
  return deferredValue;
};
