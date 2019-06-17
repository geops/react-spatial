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
          >
          <p>Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet.</p>
          </TabItem>
          <TabItem
          active = {active}
          title="Tab 2"
          onClick= {() => activate('2')}
          >
          <p>The Tab component displays the name of the tab and adds an additional class if the tab is active. When clicked, the component will fire a handler that will let Tabs know which tab should be active.</p>
          </TabItem>
        </Tabs>
    </div>
  );
}

<TabsExample />;
```
