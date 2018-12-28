#

This demonstrates the use of ActionLink.

```jsx
const React = require('react');
const ActionLink = require('./ActionLink').default;

class ActionLinkExample extends React.Component {
  constructor(props) {
    super(props);
    this.ref = React.createRef();
    this.cpt = 0;
    this.label = 'Click me';
    this.title = 'foo';
    this.className = 'baz';
    this.onClick = (evt, val) => {
      this.ref.current.innerHTML =
        `The action link has been clicked: ` + `${this.cpt++} times`;
    };
  }

  render() {
    return (
      <div>
        <ActionLink
          label={this.label}
          title={this.title}
          className={this.className}
          onClick={this.onClick}
        />
        <div ref={this.ref} />
      </div>
    );
  }
}

<ActionLinkExample />;
```
