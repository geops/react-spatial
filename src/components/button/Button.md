#

This demonstrates the use of Button.

```jsx
const React = require('react');
const Button = require('./Button').default;
require('./Button.md.css');

class ButtonExample extends React.Component {
  constructor(props) {
    super(props);
    this.ref = React.createRef();
    this.className = 'tm-button-class';
    this.title = 'this is a simple button';
    this.children = 'click';
    this.onClick = () => {
      alert('clicked');
    };
  }

  render() {
    return (
      <Button
        className={this.className}
        title={this.title}
        children={this.children}
        onClick={this.onClick}
      />
    );
  }
}

<ButtonExample />;
```
