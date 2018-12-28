#

This demonstrates the use of Autocomplete.

```jsx
const React = require('react');
const Autocomplete = require('./Autocomplete').default;
require('./Autocomplete.md.css');

class AutocompleteExample extends React.Component {
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
      this.setState({ suggestions: this.items });
      return;
    }
    this.setState({
      suggestions: this.items.filter(item => item.indexOf(value) !== -1),
    });
  }

  render() {
    const { value, suggestions } = this.state;
    return (
      <div className="tm-autocomplete-container">
        <Autocomplete
          value={value}
          items={suggestions}
          renderTitle={() => ''}
          renderItem={item => item}
          getItemKey={item => item}
          onChange={val => {
            this.setState({ value: val });
            this.updateSuggestions(val);
          }}
          onSelect={item => {
            this.setState({ value: item });
          }}
        />
      </div>
    );
  }
}

<AutocompleteExample />;
```
