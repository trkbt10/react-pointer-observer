import * as React from "react";
import { PointerManager } from "./PointerManager";
import type { ObservePointerCallback } from "./types";

const SingletonPointerManager = class {
  private static instance: PointerManager;
  private constructor() {}
  public static getInstance() {
    if (!SingletonPointerManager.instance) {
      SingletonPointerManager.instance = new PointerManager();
    }
    return SingletonPointerManager.instance;
  }
};

export const observePointer = <T extends HTMLElement | SVGElement>(
  ref: React.RefObject<T> | React.MutableRefObject<T>,
  callback: ObservePointerCallback
) => {
  const shared = SingletonPointerManager.getInstance();

  const callbackRef = React.useRef<ObservePointerCallback>();
  callbackRef.current = callback;

  React.useEffect(() => {
    if (!ref.current) {
      return;
    }
    const elm = ref.current as HTMLElement;
    const handlePointerDown = (e: PointerEvent) => {
      if (e.defaultPrevented) {
        return;
      }
      e.preventDefault();
      shared.addTrackTarget(e, (params) => {
        if (!callbackRef.current) {
          return;
        }
        callbackRef.current(params);
      });
    };
    elm.addEventListener("pointerdown", handlePointerDown);
    return () => {
      elm.removeEventListener("pointerdown", handlePointerDown);
    };
  }, []);
};
