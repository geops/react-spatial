#

This demonstrates the use of ColorPicker.

```jsx
import React, { useState } from 'react';
import Button from 'react-spatial/components/Button';
import ColorPicker from 'react-spatial/components/ColorPicker';

const colors = [
  { name: 'transparent', fill: [255, 255, 255, 0.01], border: 'white' },
  { name: 'black', fill: [0, 0, 0, 1], border: 'white' },
  { name: 'blue', fill: [0, 0, 255, 1], border: 'white' },
  { name: 'gray', fill: [128, 128, 128, 1], border: 'white' },
  { name: 'green', fill: [0, 128, 0, 1], border: 'white' },
  { name: 'orange', fill: [255, 165, 0, 1], border: 'black' },
  { name: 'red', fill: [255, 0, 0, 1], border: 'white' },
  { name: 'white', fill: [255, 255, 255, 1], border: 'black' },
  { name: 'yellow', fill: [255, 255, 0, 1], border: 'black' },
];
function ColorPickerExample() {
  const [color, setColor] = useState(colors[6]);
  const [displayColorPicker, setDisplayColorPicker] = useState(false);

  const handleChange = c => setColor(c);
  return (
    <div className="tm-colorpicker-example">
      <div className="tm-colorpicker-swatch">
        <ColorPicker
          selectedColor={color}
          colors={colors}
          className="tm-colorpicker-button"
          onChange={c => handleChange(c)}
        />
      </div>
      <div style={{ marginTop: '10px' }}>
        You have selected <strong>{color.name}</strong> color.
      </div>
    </div>
  );
}

<ColorPickerExample />;
```
