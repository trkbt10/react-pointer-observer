import type {
  ObservePointerCallback,
  PointerInfo,
  TargetPointer,
} from "./types";
import { getZIndexList } from "./getZIndexList";
import { compareTwoPointerIndex } from "./compareTwoPointerIndex";

export class PointerManager {
  private rafId: number = 0;
  private pointerIds: string[] = [];
  private handlers: { [pointerId: string]: ObservePointerCallback } = {};
  private targetPointers: {
    [pointerId: string]: TargetPointer;
  } = {};
  private pointers: {
    [pointerId: string]: {
      pageX: number;
      pageY: number;
    };
  } = {};
  constructor() {
    window.addEventListener("pointermove", (e) => {
      if (!this.pointers[e.pointerId]) {
        this.pointers[e.pointerId] = {
          pageX: e.pageX,
          pageY: e.pageY,
        };
      } else {
        this.pointers[e.pointerId].pageX = e.pageX;
        this.pointers[e.pointerId].pageY = e.pageY;
      }
    });
    const cancelEvent = this.removeTrackTarget.bind(this);
    window.addEventListener("pointercancel", cancelEvent);
    window.addEventListener("pointerup", cancelEvent);
    document.addEventListener("pointerleave", cancelEvent);
    this.start();
  }
  start() {
    this.tick();
  }
  end() {
    cancelAnimationFrame(this.rafId);
  }
  removeTrackTarget(e: PointerEvent) {
    this.emitChange(e.pointerId.toString(), "pointerend");
    delete this.pointers[e.pointerId];
    delete this.targetPointers[e.pointerId];
    delete this.handlers[e.pointerId];
    const index = this.pointerIds.indexOf(e.pointerId.toString());
    this.pointerIds.splice(index, 1);
  }

  tick() {
    for (const pointerId of this.pointerIds) {
      const trackTarget = this.targetPointers[pointerId];
      const pointerInfo = this.pointers[pointerId];
      if (!trackTarget || !pointerInfo) {
        continue;
      }

      const [prevX, prevY] = [trackTarget.deltaX, trackTarget.deltaY];
      trackTarget.deltaX = pointerInfo.pageX - trackTarget.startX;
      trackTarget.deltaY = pointerInfo.pageY - trackTarget.startY;

      trackTarget.elapsedtime = performance.now() - trackTarget.timestamp;
      if (prevX === trackTarget.deltaX && prevY === trackTarget.deltaY) {
        continue;
      }
      this.emitChange(pointerId, "pointermove");
    }
    this.rafId = requestAnimationFrame(() => this.tick());
  }
  emitChange(pointerId: string | number, eventType: PointerInfo["type"]) {
    if (!this.handlers[pointerId]) {
      return;
    }
    const trackTarget = this.targetPointers[pointerId];
    const pointerInfo = this.pointers[pointerId];
    this.handlers[pointerId]({
      pointerId: pointerId.toString(),
      timestamp: trackTarget.timestamp,
      elapsedtime: trackTarget.elapsedtime,
      type: eventType,
      pageX: pointerInfo.pageX,
      pageY: pointerInfo.pageY,
      deltaX: trackTarget.deltaX,
      deltaY: trackTarget.deltaY,
      startX: trackTarget.startX,
      startY: trackTarget.startY,
      button: trackTarget.button,
      localX: trackTarget.localX,
      localY: trackTarget.localY,
      isFinal: eventType === "pointerend",
      target: trackTarget.target,
      pointerLength: this.pointerIds.length,
      ZIndexList: trackTarget.ZIndexList,
      defaultPrevented: trackTarget.defaultPrevented,
    });
  }
  addTrackTarget(e: PointerEvent, callback: ObservePointerCallback) {
    if (
      !(e.target instanceof HTMLElement) &&
      !(e.target instanceof SVGElement)
    ) {
      return;
    }
    this.pointerIds.push(e.pointerId.toString());
    const boundRect = e.target.getBoundingClientRect();
    const targetX = boundRect.left + window.scrollX;
    const targetY = boundRect.top + window.scrollY;
    this.targetPointers[e.pointerId] = {
      timestamp: performance.now(),
      pointerLength: this.pointerIds.length,
      elapsedtime: 0,
      deltaX: 0,
      deltaY: 0,
      localX: e.pageX - targetX,
      localY: e.pageY - targetY,
      startX: e.pageX,
      startY: e.pageY,
      button: e.button,
      target: e.target,
      ZIndexList: getZIndexList(e.target),
      defaultPrevented: e.defaultPrevented,
    };
    this.pointerIds = this.pointerIds.sort((a, b) => {
      return compareTwoPointerIndex(
        this.targetPointers[a]?.ZIndexList ?? [],
        this.targetPointers[b]?.ZIndexList ?? []
      );
    });
    this.pointers[e.pointerId] = {
      pageX: e.pageX,
      pageY: e.pageY,
    };
    this.handlers[e.pointerId] = callback;
    this.emitChange(e.pointerId, "pointerdown");
  }
}
