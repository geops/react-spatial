#

This demonstrates the use of ToggleButton.

```jsx
const React = require('react');
const ToggleButton = require('./ToggleButton').default;

class ToggleButtonExample extends React.Component {
  constructor(props) {
    super(props);
    this.state = { ref: null, open: true };

    // You could also use a simple class property but it will not force the
    // render a the component:
    // this.ref
  }

  render() {
    const { ref } = this.state;
    return (
      <div className="tm-toggle-button-example">
        <ToggleButton
          target={this.state.ref}
          open={this.state.open}
          title={'Toggle'}
          openComponent=<button>Show the red rectangle</button>
          closeComponent=<button>Hide the red rectangle</button>
          onToggle={() => {
            this.setState({ open: !this.state.open });
          }}
        />
        <div
          className="tm-toggle"
          ref={ref => {
            if (!this.state.ref) {
              this.setState({ ref: ref });
            }
          }}
        />
      </div>
    );
  }
}

<ToggleButtonExample />;
```
