import { useState } from 'react';

// To be done












export default function Single() {
  const [options, setOptions] = useState([{ text: '' }]);

  const addOption = () => {
    setOptions([...options, { text: '' }]);
  };

  return (
    <div>
      {options.map((option, index) => (
        <div key={index} className="flex items-center my-2">
          <input type="radio" disabled className="mr-2"/>
          <input 
            type="text" 
            placeholder={`Option ${index + 1}`} 
            value={option.text}
            onChange={(e) => {
              const newOptions = [...options];
              newOptions[index].text = e.target.value;
              setOptions(newOptions);
            }}
            className="border p-2 flex-grow"
          />
        </div>
      ))}
      <button onClick={addOption} className="p-2 bg-green-500 text-white w-full mt-2">
        +
      </button>
    </div>
  );
}
