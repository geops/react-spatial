#

This demonstrates the use of ColorPicker.

```jsx
import React, { useState } from 'react';
import Button from 'react-spatial/components/Button';
import ColorPicker from 'react-spatial/components/ColorPicker';

function ColorPickerExample() {
  const [color, setColor] = useState();
  const [displayColorPicker, setDisplayColorPicker] = useState(false);

  const handleChange = c => setColor(Object.values(c.rgb));

  return (
    <div className="tm-colorpicker-example">
      <ColorPicker
        className="tm-color-button"
        label="Choose Color"
        onChange={c => handleChange(c)}
      />
      <div>
        You selected <span style={{ color: `rgba(${color})` }}>color</span>.
      </div>
    </div>
  );
}

<ColorPickerExample />;
```
