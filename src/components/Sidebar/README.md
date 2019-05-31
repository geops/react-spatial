#

This demonstrates the use of Sidebar.

```jsx
import React, { useState } from 'react';
import Button from 'react-spatial/components/Button';
import Sidebar from 'react-spatial/components/Sidebar';

function SidebarExample() {
  const [open, setOpen] = useState(false);
  return (
    <div className="tm-sidebar-example">
      <Button onClick={() => { setOpen(!open); }}>
        Open sidebar
      </Button>
      <Sidebar
        open={open}
        onModalClick={() => { setOpen(false); }}>
        <Button onClick={() => { setOpen(false); }}>
          Close sidebar
        </Button>
      </Sidebar>
    </div>
  );
}

<SidebarExample />;
```
