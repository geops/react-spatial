#

This demonstrates the use of SidebarMenuItem.

```jsx
import React, { useState } from 'react';
import { MdNavigateBefore, MdDomain } from 'react-icons/md';
import { FaGithub } from 'react-icons/fa';
import Button from 'react-spatial/components/Button';
import Sidebar from 'react-spatial/components/Sidebar';
import SidebarMenuItem from 'react-spatial/components/SidebarMenuItem';

function SidebarMenuItemExample() {
  const [open, setOpen] = useState(true);
  return (
    <div className="tm-sidebar-example">
      <Button onClick={() => { setOpen(!open); }}>
        Open sidebar
      </Button>
      <Sidebar
        open={open}
        onModalClick={() => { setOpen(false); }}
      >
        <div className="tm-close-wrapper">
          <Button
            onClick={() => { setOpen(false); }}
            className="tm-sidebar-close"
          >
            <MdNavigateBefore focusable={false} />
          </Button>
        </div>
        <SidebarMenuItem
          icon={<MdDomain focusable={false} />}
          showIconOnly={!open}
          title="Visit geops.de"
          onClick={() => {
            window.open('https://geops.de/', '_blank')
          }}
        />
        <SidebarMenuItem
          icon={<FaGithub focusable={false} />}
          showIconOnly={!open}
          title="Visit our Github"
          onClick={() => {
            window.open('https://github.com/geops', '_blank');
          }}
        />
      </Sidebar>
    </div>
  );
}

<SidebarMenuItemExample />;
```
