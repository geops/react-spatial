#

The following example demonstrates the use of Overlay.

```jsx
import React, { useState, useEffect, useRef } from 'react';
import Overlay from 'react-spatial/components/Overlay';

function OverlayExample() {
  const [open, setOpen] = useState(true);
  const [ref, setRef] = useState(null);
  const refDiv = useRef(null);

  useEffect(() => {
    setRef(refDiv);
  }, [refDiv]);
  
  return (
    <div
      className="tm-overlay-example"
      ref={refDiv}
    >
      <div
        role="button"
        className="tm-clickable-feature"
        onClick={() => {
          setOpen(!open);
        }}
      >
        Toggle Overlay
      </div>
      {open && ref ? (
        <Overlay
          observe={ref.current}
          className="tm-overlay-container"
          mobileSize={{
              minimalHeight: '25%',
              maximalHeight: '80%',
              defaultSize: {
                height: '40%',
                width: '100%',
              },
            }}
        >
          <div
            role="button"
            onClick={() => {
              setOpen(false);
            }}
          >
            Close Overlay
          </div>
        </Overlay>
      ) : null}
    </div>
  );
}

<OverlayExample />;
```
