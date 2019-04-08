#

This demonstrates the use of Dialog.

```jsx
import React from  'react'
import Button from 'react-spatial/components/Button';
import Dialog from 'react-spatial/components/Dialog';

class DialogExample extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      isOpen: false,
    };
  }

  toggleDialog() {
    const { isOpen } = this.state;
    this.setState({
      isOpen: !isOpen,
    });
  }

  render() {
    const { isOpen } = this.state;
    return (
      <div className="tm-dialog-example">
        <Dialog
          title={<span>Example Dialog</span>}
          onClose={() => this.toggleDialog()}
          isOpen={isOpen}
        >
          <div className="tm-dialog-content">
            I am the content of the dialog
          </div>
        </Dialog>
        <Button
          className="tm-button tm-dialog-btn"
          onClick={() => this.toggleDialog()}
        >
          Open Dialog
        </Button>
      </div>
    );
  }
}

<DialogExample />;
```
