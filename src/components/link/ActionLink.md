#

This demonstrates the use of ActionLink.

```jsx
const React = require('react');
const ActionLink = require('./ActionLink').default;

class ActionLinkExample extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      count: 0,
    };

    this.onClick = (evt, val) => {
        `The action link has been clicked: ` + `${++this.cpt} times`;
    };
  }

  render() {
    const { count } = this.state;

    return (
      <div>
        <ActionLink onClick={() => this.setState({ count: count + 1})}>
          Click me!
        </ActionLink>
        <div>
          The action link has been clicked { count } times.
        </div>
      </div>
    );
  }
}

<ActionLinkExample />
```
