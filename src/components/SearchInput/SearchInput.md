#

This demonstrates the use of SearchInput.

```jsx
const React = require('react');
const SearchInput = require('./SearchInput').default;

class SearchInputExample extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      value: '',
    };
  }

  render() {
    const { value } = this.state;
    return (
      <div className="tm-search-input-example">
        <SearchInput
          value={value}
          button="Go!!"
          placeholder="Type  some text ..."
          onChange={(e, val) => this.setState({ value: val })}
        />
        <br />
        <div>{`Value searched : ${value}`}</div>
      </div>
    );
  }
}

<SearchInputExample />;
```
