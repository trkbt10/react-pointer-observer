export function getZIndexList(e: HTMLOrSVGElement): number[] {
  const results: number[] = [];
  const traverseHTMLElement = (e: HTMLElement): any => {
    const z = window.getComputedStyle(e).getPropertyValue("z-index");

    const zNumber = +z;
    if (!Number.isNaN(zNumber)) {
      results.push(zNumber);
    }
    if (e.parentElement) {
      traverseHTMLElement(e.parentElement);
    }
  };
  if (e instanceof HTMLElement) {
    traverseHTMLElement(e);
  } else {
    const svg = e as SVGElement;
    const z = window.getComputedStyle(svg).getPropertyValue("z-index");
    const zNumber = +z;
    if (!Number.isNaN(zNumber)) {
      results.push(zNumber);
    }
  }
  return results.reverse();
}
