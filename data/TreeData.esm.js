/**
 *  Node definition:
 *
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

export default {
  rootId: 'root',
  items: {
    ovnetzkarteschweiz: {
      isExpanded: true,
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
      isExpanded: true,
      children: ['interaktivbahnhoplan', 'printprodukte'],
      type: 'checkbox',
      data: {
        title: 'bahnhofplane',
      },
      defaults: {
        isChecked: true,
        isExpanded: true,
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
