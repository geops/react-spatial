#

This demonstrates the use of Select.

```jsx
const React = require('react');
const Select = require('./Select').default;
require('./Select.md.css');

class SelectExample extends React.Component {
  constructor(props) {
    super(props);
    this.state = { value: 'foo' };
  }

  render() {
    return (
      <div className="tm-select-example">
        <Select
          options={[
            { label: 'foo', value: 'foo' },
            { label: 'bar', value: 'bar' },
            { label: 'baz', value: 'baz' },
          ]}
          value={this.state.value}
          onChange={(e) => {
            this.setState({ value: e.target.value });

          }}
        />
        <div>
          You selected "{ this.state.value }".
        </div>
      </div>
    );
  }
}

<SelectExample t="(a)=>(a)" />;
```
