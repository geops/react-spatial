# Components

This folder contains all the components.

## Create a new component

Each component must have this structure:

```bash
src/
    components/
        MyComponent/
            index.js            // ES module export.
            MyComponent.js      // The JSX component WITHOUT hardcoded classNames !!!!
            MyComponent.test.js // The test file with at least snapshots tests.
            MyComponent.scss    // A sass file with default CSS when the main html element of MyComponent uses tm-mycomponent CSS class.
            README.md           // The MyComponentExample component of use to display in the doc.
            MyComponent.md.scss // A sass file for the MyComponentExample component used in README.md
```

Some rules must be followed:

- a component must allow to provide a className to the main html element of the component.
- a component must be controlled by his parent via props.
- a component must use `children` property instead of `renderXXX` functions when possible.
- a component must propagate basic props `<NewComp {...this.props}>` when possible.
- a component must have tests.
- a component can provide a translation function using a `t` property.
- default props must have a value or `undefined` (no `null` otherwise the attribute is created in the snapshot).
- no redux stuff.
- no hardcoded `className`, only in default props.
- no translation library specific stuff.
