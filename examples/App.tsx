import * as React from "react";
import { usePointerObserver } from "../src/usePointerObserver";
import { PointerInfo } from "../src/types";
function fixed(strings: TemplateStringsArray, ...values: any[]) {
  let output = "";
  for (let i = 0; i < strings.length; i++) {
    output += strings[i];
    if (i < values.length) {
      const value = values[i];
      if (typeof value === "number") {
        output += value.toFixed(2);
      } else {
        output += value;
      }
    }
  }
  return output;
}
function round(value: number, precision: number) {
  return Math.round(value / precision) * precision;
}
export const App: React.FC<React.PropsWithChildren<{}>> = (props) => {
  const size = 100;

  return (
    <div
      style={{
        display: "grid",
        placeContent: "center",
        placeItems: "center",
        gridTemplateColumns: "repeat(5, 1fr)",
        gridTemplateRows: "repeat(5, 1fr)",
      }}
    >
      {Array.from({ length: size }).map((_, i) => (
        <div key={i}>
          <MoveableBox id={i} />
        </div>
      ))}
    </div>
  );
};
App.displayName = "App";
const MoveableBox = ({ id }: { id: number }) => {
  const ref = React.useRef<HTMLDivElement>(null);
  const pointer = usePointerObserver(ref);
  return (
    <>
      <div
        ref={ref}
        style={{
          border: "1px solid #ccc",
          display: "inline-flex",
          placeContent: "center",
          placeItems: "center",
          width: "100px",
          height: "100px",
          position: "absolute",
          boxSizing: "border-box",
          fontSize: "8px",
          top: pointer ? round(pointer.pageY - pointer.localY, 20) : 0,
          left: pointer ? round(pointer.pageX - pointer.localX, 20) : 0,
        }}
      >
        {id}
        <br />
        <DisplayBoundInfo bound={pointer} />
      </div>
    </>
  );
};
const DisplayBoundInfo: React.FC<
  React.PropsWithChildren<{ bound?: PointerInfo }>
> = (props) => {
  const { bound } = props;
  return (
    <>
      {bound && (
        <pre>{fixed`bound:${bound.pageX},${bound.pageY}
local:${bound.localX},${bound.localY}
delta:${bound.deltaX},${bound.deltaY}
pointer:${bound.pointerId}
top:${bound.pageY - bound.localY}
left:${bound.pageX - bound.localX}
      `}</pre>
      )}
    </>
  );
};
