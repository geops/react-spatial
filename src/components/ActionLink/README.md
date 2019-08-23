#

This demonstrates the use of ActionLink.

```jsx
import React, {useState} from 'react';
import ActionLink from 'react-spatial/components/ActionLink';

function ActionLinkExample() {
  const [count, setCount] = useState(0);

  return (
    <div className="tm-action-link-example">
      <ActionLink onClick={() => setCount(count + 1)}>
        Click me!
      </ActionLink>
      <div>The action link has been clicked {count} times.</div>
    </div>
  );
}

<ActionLinkExample />;
```
