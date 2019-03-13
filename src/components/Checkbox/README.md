#

This demonstrates the use of Checkbox.

```jsx
const React = require('react');
const Checkbox = require('./Checkbox').default;

class CheckboxExample extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      check: true,
      radio1: false,
      radio2: true,
    }
  }

  onRadioClick() {
    const { radio1, radio2 } = this.state;
    this.setState({
      radio1: !radio1,
      radio2: !radio2,
    });
  }

  onCheckboxClick() {
    const { check } = this.state;
    this.setState({ check: !check });
  }

  render() {
    const { check, radio1, radio2 } = this.state;
    return (
      <div>
        <div>
          <Checkbox
            className="tm-checkbox-example"
            checked={check}
            onClick={() => this.onCheckboxClick()}
          />
        </div>
        <div>
          <Checkbox
            className="tm-checkbox-example"
            checked={radio1}
            inputType={'radio'}
            onClick={() => this.onRadioClick()}
          />
          <Checkbox
            className="tm-checkbox-example"
            checked={radio2}
            inputType={'radio'}
            onClick={() => this.onRadioClick()}
          />
        </div>
      </div>
    )
  }
}

<CheckboxExample />;
```
