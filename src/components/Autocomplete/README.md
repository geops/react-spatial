#

This demonstrates the use of Autocomplete.

```jsx
import React from  'react'
import Autocomplete from 'react-spatial/components/Autocomplete';

class AutocompleteExample extends React.PureComponent {
  constructor(props) {
    super(props);
    this.items = ['New York', 'New England', 'Old England', 'Old York'];
    this.state = {
      value: '',
      suggestions: [...this.items],
    };
  }

  updateSuggestions(value) {
    if (!value) {
      this.setState({ suggestions: this.items, value });
      return;
    }

    this.setState({
      suggestions: this.items.filter(item => item.indexOf(value) !== -1),
      value,
    });
  }

  render() {
    const { value, suggestions } = this.state;
    return (
      <div className="tm-autocomplete-example">
        <Autocomplete
          value={value}
          items={suggestions}
          placeholder="Search ..."
          onChange={val => this.updateSuggestions(val)}
          onSelect={val => val && this.setState({ value: val })}
        />
      </div>
    );
  }
}

<AutocompleteExample />;
```
