#

This demonstrates the use of Dialog.

```jsx
import React from 'react'
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
        <Button
          className="tm-button tm-dialog-btn"
          onClick={() => this.toggleDialog()}
        >
          Open Dialog
        </Button>
        <Dialog
          title={<span>Example Dialog</span>}
          classNameChildren="tm-dialog-content"
          onClose={() => this.toggleDialog()}
          isOpen={isOpen}
          isDraggable
          isModal
        >
          <span>I am the content of the dialog</span>
        </Dialog>
      </div>
    );
  }
}

<DialogExample />;
```
