#

This demonstrates the use of SelectLinks.

```jsx
const React = require('react');
const SelectLinks = require('./SelectLinks').default;
require('./SelectLinks.md.css');

class SelectLinksExample extends React.Component {
  constructor(props) {
    super(props);

    this.options = [
      { label: 'foo', title: 'Foo' },
      { label: 'bar', title: 'Bar' },
      { label: 'baz', title: 'Baz' },
    ];

    this.state = { selected: this.options[0] };
  }

  render() {
    return (
      <div className="tm-select-links-example">
        <SelectLinks
          isSelected={opt => this.state.selected.label === opt.label}
          options={this.options}
          onClick={(e, opt) => {
            this.setState({ selected: opt });
          }}
        />
        <div>You selected: { this.state.selected.title }</div>
      </div>
    );
  }
}

<SelectLinksExample t="(a)=>(a)" />;
```
