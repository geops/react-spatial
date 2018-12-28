#

This demonstrates the use of Select.

```jsx
const React = require('react');
const Select = require('./Select').default;
require('./Select.md.css');

class SelectExample extends React.Component {
  constructor(props) {
    super(props);
    this.ref = React.createRef();

    this.options = [
      { label: 'foo', value: 'foo' },
      { label: 'bar', value: 'bar' },
      { label: 'baz', value: 'baz' },
    ];

    this.state = { value: 'foo' };

    this.onChange = evt => {
      this.setState({
        selected: evt.target.value,
      });

      this.ref.current.innerHTML = `Value selected: ${evt.target.value}`;
    };
  }

  render() {
    return (
      <div className="tm-select-example">
        <Select
          options={this.options}
          value={this.state.value}
          onChange={this.onChange}
        />
        <div ref={this.ref} />
      </div>
    );
  }
}

<SelectExample t="(a)=>(a)" />;
```
