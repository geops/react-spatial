#

This demonstrates the use of Select.

```jsx
const React = require('react');
const Select = require('./Select').default;

class SelectExample extends React.Component {
  constructor(props) {
    super(props);
    this.state = { value: 'ny' };
  }

  render() {
    return (
      <div className="tm-select-example">
        <Select
          options={[
            { label: 'New york', value: 'ny' },
            { label: 'Los angeles', value: 'ls' },
            { label: 'Orlando', value: 'orl' },
          ]}
          value={this.state.value}
          onChange={(e, value) => {
            this.setState({ value: value });
          }}
        />
        <div>You selected "{this.state.value}".</div>
      </div>
    );
  }
}

<SelectExample />;
```
