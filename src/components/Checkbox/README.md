#

This demonstrates the use of Checkbox.

```jsx
import React, {useState} from 'react';
import Checkbox from 'react-spatial/components/Checkbox';

function CheckboxExample() {
  const [check, setCheck] = useState(true);
  const [radio1, setRadio1] = useState(false);
  const [radio2, setRadio2] = useState(true);

  const onRadioClick = () => {
    setRadio1(!radio1);
    setRadio2(!radio2);
  }

  return (
    <div class="tm-checkbox-example">
      <Checkbox
        checked={check}
        onClick={() => setCheck(!check)}
      />
      <Checkbox
        checked={radio1}
        inputType="radio"
        onClick={() => onRadioClick()}
      />
      <Checkbox
        checked={radio2}
        inputType="radio"
        onClick={() => onRadioClick()}
      />
    </div>
  );
}

<CheckboxExample />;
```
