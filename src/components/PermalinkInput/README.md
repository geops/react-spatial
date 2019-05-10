#

This demonstrates the use of PermalinkInput.

```jsx
import React from 'react';
import PermalinkInput from 'react-spatial/components/PermalinkInput';

class PermalinkInputExample extends React.Component {
  constructor(props) {
    super(props);
    this.state = { value: window.location.href };
  }

  render() {
    const { value } = this.state;
    return (
      <div className="tm-permalink-input-example">
        <PermalinkInput value={value} />
      </div>
    );
  }
}

<PermalinkInputExample />;
```
