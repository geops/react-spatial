#

This demonstrates the use of SelectColors.

```jsx
import React from 'react';
import SelectColors from 'react-spatial/components/SelectColors';

class SelectColorsExample extends React.Component {
  constructor(props) {
    super(props);
    this.colors = [
      { name: 'none', fill: [255, 255, 255, 0.01] },
      { name: 'black', fill: [0, 0, 0, 1] },
      { name: 'lightgrey', fill: [247, 244, 244, 1] },
    ];
    this.state = { color: this.colors[1] };
  }

  render() {
    return (
      <div className="tm-selectcolors-example">
        <SelectColors
          options={this.colors}
          value={this.state.color}
          onChange={(e, color) => {
            this.setState({ color });
          }}
        />
        <div>You selected "{this.state.color.name}".</div>
      </div>
    );
  }
}

<SelectColorsExample />;
```
