#

This demonstrates the use of BlankLink.

```jsx
const React = require('react');
const BlankLink = require('./BlankLink').default;

class BlankLinkExample extends React.Component {
  constructor(props) {
    super(props);
    this.cpt = 0;
    this.href = 'https://geops.de';
    this.label = 'Open geops website';
    this.title = 'foo';
    this.className = 'baz';
  }

  render() {
    return (
      <div>
        <BlankLink
          href={this.href}
          label={this.label}
          title={this.title}
          className={this.className}
        />
      </div>
    );
  }
}

<BlankLinkExample />;
```
