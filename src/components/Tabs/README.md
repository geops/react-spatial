#

This demonstrates the use of Tabs

```jsx
import React, { useState } from 'react';
import Tabs from 'react-spatial/components/Tabs';
import TabItem from 'react-spatial/components/TabItem';



function TabsExample() {
  const [active, setActive] = useState(false);

  const activate = index => {
    console.log(index);
  };

  return (
    <div className="tm-tabs-example">
        <Tabs>
          <TabItem
          active = {active}
          title="Tab 1"
          onClick={() => activate('1')}
          >
          <p>Lorem Ipsum dolor sic amet</p>
          </TabItem>
          <TabItem
          active = {active}
          title="Tab 2"
          onClick= {() => activate('2')}
          />
        </Tabs>
    </div>
  );
}

<TabsExample />;
```
