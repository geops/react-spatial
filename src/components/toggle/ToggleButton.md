#

This demonstrates the use of ToggleButton.

```jsx
const React = require('react');
const ToggleButton = require('./ToggleButton').default;
require('./ToggleButton.md.css');

class ToggleButtonExample extends React.Component {
  constructor(props) {
    super(props);
    this.state = { ref: null };

    // You could also use a simple class property but it will not force the
    // render a the component:
    // this.ref
  }

  render() {
    const { ref } = this.state;
    return (
      <>
        <ToggleButton
          target={this.state.ref}
          openComponent=<button>Show the red rectangle</button>
          closeComponent=<button>Hide the red rectangle</button>
        />
        <div
          className="tm-toggle"
          ref={ref => {
            if (!this.state.ref) {
              this.setState({ ref: ref });
            }
          }}
        />
      </>
    );
  }
}

<ToggleButtonExample />;
```
