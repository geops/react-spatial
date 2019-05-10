#

This demonstrates the use of PermalinkField.

```jsx
import React from 'react';
import PermalinkField from 'react-spatial/components/PermalinkField';

class PermalinkFieldExample extends React.Component {
  constructor(props) {
    super(props);
    this.state = { value: window.location.href };
  }

  render() {
    const { value } = this.state;
    return (
      <div className="tm-permalink-field-example">
        <PermalinkField value={value} />
      </div>
    );
  }
}

<PermalinkFieldExample />;
```
