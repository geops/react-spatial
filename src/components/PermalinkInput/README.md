#

This demonstrates the use of PermalinkInput.

```jsx
import React from 'react';
import PermalinkInput from 'react-spatial/components/PermalinkInput';

class PermalinkInputExample extends React.Component {
  render() {
    return (
      <div className="tm-permalink-input-example">
        <PermalinkInput value={window.location.href} />
      </div>
    );
  }
}

<PermalinkInputExample />;
```
