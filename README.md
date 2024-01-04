# react-pointer-observer

React UI hook that make pointer-events easier to use.

## Usage

```jsx
import { usePointerObserver } from "react-pointer-observer";

const Demo = () => {
  const ref = useRef(null);
  const pointer = usePointerObserver(ref);

  return (
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
    />
  );
};

import { observePointer } from "react-pointer-observer";

const Demo2 = () => {
  const ref = useRef(null);
  observePointer(ref, (pointer) => {
    console.log(pointer); // { startX: number, startY:number ... }
  });
  return <div ref={ref} />;
};
```
