#

This demonstrates the use of Tabs

```jsx
import React, { useState } from 'react';
import Tabs from 'react-spatial/components/Tabs';
import TabItem from 'react-spatial/components/TabItem';

function TabsExample() {
  const [active, setActive] = useState(false);
  return (
    <div className="tm-tabs-example">
        <Tabs>
          <TabItem
          title="Tab 1"
          onClick={() => { setActive(!active); }}
          />
          <TabItem
          active={true}
          title="Tab 2"
          onClick={() => { setActive(!active); }}
          />
          <TabItem
          title="Tab 3"
          onClick={() => { setActive(!active); }}
          />
          <TabItem
          title="Tab 4"
          onClick={() => { setActive(!active); }}
          />
        </Tabs>
    </div>
  );
}

<TabsExample />;
```
