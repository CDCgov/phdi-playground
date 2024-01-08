import React, { useState } from 'react';
import { useData } from '@/utils/DataContext';
import { Checkbox } from '@trussworks/react-uswds';

export default CheckboxesPage = () => {
  const [checkedItems, setCheckedItems] = useState({});

  const handleCheckboxChange = (event) => {
    const { name, checked } = event.target;
    setCheckedItems((prevCheckedItems) => ({ ...prevCheckedItems, [name]: checked }));
  };

  const renderCheckboxes = () => {
    const checkboxData = useData(); // Access the shared data;

    return checkboxData.map((item) => (
      <Checkbox
        key={item.id}
        id={`checkbox-${item.id}`}
        name={`checkbox-${item.id}`}
        label={item.label}
        checked={checkedItems[`checkbox-${item.id}`] || true}
        onChange={handleCheckboxChange}
      />
    ));
  };

  const showCheckedOptions = () => {
    const checkedOptions = Object.entries(checkedItems)
      .filter(([key, value]) => value)
      .map(([key]) => key.replace('checkbox-', ''));

    if (checkedOptions.length > 0) {
      alert('Checked options:\n' + checkedOptions.join('\n'));
    } else {
      alert('No options are checked.');
    }
  };

  return (
    <div>
      <h1>Checkboxes Page with @trussworks/react-uswds</h1>
      {renderCheckboxes()}
      <button type="button" onClick={showCheckedOptions}>
        Show Checked Options
      </button>
    </div>
  );
};
