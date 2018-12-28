#

This demonstrates the use of SelectLinks.

```jsx
const React = require('react');
const SelectLinks = require('./SelectLinks').default;
require('./SelectLinks.md.css');

class SelectLinksExample extends React.Component {
  constructor(props) {
    super(props);
    this.ref = React.createRef();
    this.state = { selected: 'bar' };
    this.option = [
      { label: 'foo', title: 'Foo' },
      { label: 'bar', title: 'Bar' },
      { label: 'baz', title: 'Baz' },
    ],

    this.onClick = option => {
      this.setState({ selected: option.label });
      this.ref.current.innerHTML = `Value selected: ${option.title}`;
    };
  }

  render() {
    return (
      <div className="tm-select-links-example">
        <SelectLinks
          isSelected={(option) => this.state.selected === option.label}
          options={this.option}
          onClick={(evt, option) => this.onClick(option)}
        />
        <div ref={this.ref} />
      </div>
    );
  }
}

<SelectLinksExample t="(a)=>(a)" />;
```
