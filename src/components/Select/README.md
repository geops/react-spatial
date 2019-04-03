#

This demonstrates the use of Select.

```jsx
import React from 'react';
import Select from 'react-spatial/components/Select';

class SelectExample extends React.Component {
  constructor(props) {
    super(props);
    this.cities = [
      { label: 'New york', value: 'ny' },
      { label: 'Los angeles', value: 'ls' },
      { label: 'Orlando', value: 'orl' },
    ];
    this.state = { city: this.cities[1] };
  }

  render() {
    return (
      <div className="tm-select-example">
        <Select
          options={this.cities}
          value={this.state.city}
          onChange={(e, city) => {
            this.setState({ city });
          }}
        />
        <div>You selected "{this.state.city.label}".</div>
      </div>
    );
  }
}

<SelectExample />;
```
