#

This demonstrates the use of ActionLink.

```jsx
import React from 'react';
import ActionLink from 'react-spatial/components/ActionLink';

class ActionLinkExample extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      count: 0,
    };
  }

  render() {
    const { count } = this.state;

    return (
      <div className="tm-action-link-example">
        <ActionLink onClick={() => this.setState({ count: count + 1 })}>
          Click me!
        </ActionLink>
        <div>The action link has been clicked {count} times.</div>
      </div>
    );
  }
}

<ActionLinkExample />;
```
