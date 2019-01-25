#

This demonstrates the use of Button.

```jsx
const React = require('react');
const Button = require('./Button').default;
require('./Button.md.css');

const ButtonExample = () => (
  <Button
    className="tm-button-example"
    title="this is a simple button"
    onClick={() => alert('clicked')}
  >
    click
  </Button>
);

<ButtonExample />;
```
