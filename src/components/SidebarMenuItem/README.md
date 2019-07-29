#

This demonstrates the use of SidebarMenuItem.

```jsx
import React, { useState } from 'react';
import {
  MdGrade,
  MdNavigateBefore,
  MdNavigateNext,
  MdDomain,
} from 'react-icons/md';
import { FaGithub, FaSearch } from 'react-icons/fa';
import Button from 'react-spatial/components/Button';
import Sidebar from 'react-spatial/components/Sidebar';
import SidebarMenuItem from 'react-spatial/components/SidebarMenuItem';

function SidebarMenuItemExample() {
  const [open, setOpen] = useState(true);
  const [active, setActive] = useState(false);
  return (
    <div className="tm-sidebar-example">
      <Sidebar
        open={open}
        collapseWidth={40}
        onModalClick={() => { setOpen(false); }}
      >
        <div className="tm-close-wrapper">
          <Button
            onClick={() => { setOpen(!open); }}
            className="tm-sidebar-close"
          >
            {
              open
              ? <MdNavigateBefore className="tm-closer" />
              : <MdNavigateNext className="tm-opener" />
            }
          </Button>
        </div>
        <SidebarMenuItem
          active={active}
          icon={<MdGrade focusable={false} />}
          showIconOnly={!open}
          title="Click me"
          onClick={() => { setActive(!active); }}
        />
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
