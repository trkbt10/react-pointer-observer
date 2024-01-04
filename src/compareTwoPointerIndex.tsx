export function compareTwoPointerIndex(a: number[], b: number[]) {
  const pointerSize = Math.max(a.length, b.length);
  if (pointerSize <= 0) {
    return 0;
  }
  for (let i = 0; i < pointerSize; i++) {
    const az = a[i];
    const bz = b[i];
    if (typeof az === "undefined") {
      return -1;
    }
    if (typeof bz === "undefined") {
      return 1;
    }
    if (az === bz) {
      continue;
    }
    return az > bz ? -1 : 1;
  }
  return 0;
}
