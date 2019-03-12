#

This demonstrates the use of SelectLinks.

```jsx
const React = require('react');
const SelectLinks = require('./SelectLinks').default;

class SelectLinksExample extends React.Component {
  constructor(props) {
    super(props);

    this.options = [
      { label: 'New york', value: 'ny' },
      { label: 'Los angeles', value: 'ls' },
      { label: 'Orlando', value: 'orl' },
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
        <div>You selected: {this.state.selected.label}</div>
      </div>
    );
  }
}

<SelectLinksExample />;
```
