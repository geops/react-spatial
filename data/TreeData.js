/**
 *  Node definition:
 *
 *     id: 'root',
 *     children: ['ovnetzkarteschweiz', 'bauprojekte'],
 *     isExpanded: true,
 *     isChecked: false,
 *     isChildrenLoading: false,
 *     type: 'checkbox',
 *     data: {
 *       title: 'root',
 *     },
 *
 */

const data = {
  rootId: 'root',
  items: {
    root: {
      id: 'root',
      children: ['ovnetzkarteschweiz', 'bauprojekte'],
      type: 'checkbox',
      data: {
        title: 'root',
      },
    },
    ovnetzkarteschweiz: {
      id: 'ovnetzkarteschweiz',
      children: ['bahnhofplane', 'passagierfrequenzen'],
      type: 'radio',
      data: {
        title: 'ovnetzkarteschweiz',
      },
    },
    bauprojekte: {
      id: 'bauprojekte',
      type: 'radio',
      data: {
        title: 'bauprojekte',
      },
    },
    bahnhofplane: {
      id: 'bahnhofplane',
      children: ['interaktivbahnhoplan', 'printprodukte'],
      type: 'checkbox',
      data: {
        title: 'bahnhofplane',
      },
    },
    passagierfrequenzen: {
      id: 'passagierfrequenzen',
      children: ['interaktivbahnhoplan2', 'printprodukte2'],
      type: 'checkbox',
      data: {
        title: 'passagierfrequenzen',
      },
    },
    interaktivbahnhoplan: {
      id: 'interaktivbahnhoplan',
      type: 'radio',
      data: {
        title: 'interaktivbahnhoplan',
      },
    },
    printprodukte: {
      id: 'printprodukte',
      type: 'radio',
      data: {
        title: 'printprodukte',
      },
    },
    interaktivbahnhoplan2: {
      children: ['interaktivbahnhoplan3', 'printprodukte3'],
    },
    printprodukte2: {},
    interaktivbahnhoplan3: {},
    printprodukte3: {},
  },
};

const applyDefaultValues = id => {
  if (!data.items[id]) {
    console.error(`No item with id  ${id}`);
    return;
  }
  data.items[id].id = data.items[id].id || id;
  data.items[id].type = data.items[id].type || 'checkbox';
  data.items[id].data = data.items[id].data || {};
  data.items[id].data.title = data.items[id].data.title || id;
  data.items[id].hasChildren = !!(
    data.items[id].children && data.items[id].children.length
  );
  data.items[id].hasParent = data.items[id].hasParent || false;
  data.items[id].parentId = data.items[id].parentId || null;
  data.items[id].isExpanded = data.items[id].isExpanded || false;
  data.items[id].isChecked = data.items[id].isChecked || false;
  data.items[id].isChildrenLoading = data.items[id].isChildrenLoading || false;
};

// Fill the data tree with some helpers properties
Object.keys(data.items).forEach(id => {
  applyDefaultValues(id);

  if (data.items[id].hasChildren) {
    data.items[id].hasChildren = true;
    data.items[id].children.forEach(childId => {
      applyDefaultValues(childId);
      data.items[childId].parentId = id;
      data.items[childId].hasParent = true;
    });
  } else {
    data.items[id].children = [];
  }
});

// See styleguide.config.js
module.exports = data;
