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
      { name: 'darkblue', fill: [0, 61, 133, 1] },
      { name: 'lightgreen', fill: [123, 181, 76, 1] },
      { name: 'darkgreen', fill: [19, 111, 62, 1] },
    ];
    this.state = { color: this.colors[1] };
  }

  render() {
    return (
      <div className="tm-selectcolors-example">
        <SelectColors
          options={this.colors}
          value={this.state.color}
          onChange={color => {
            let index = this.colors.findIndex(x => x.name === color);
            let selectedColor = this.colors[index];
            this.setState({ color: selectedColor });
          }}
        />
        <div>You selected "{this.state.color.name}".</div>
      </div>
    );
  }
}

<SelectColorsExample />;
```
