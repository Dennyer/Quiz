
import { useEffect, useState } from 'react';

import createDOMPurify from 'dompurify';
import { JSDOM } from 'jsdom';

const window = new JSDOM('').window;
const DOMPurify = createDOMPurify(window);

export default function Multiple({ startingValues = [{text: '', isTrue: false}], collectDataCallback }) {
    const [options, setOptions] = useState(startingValues);

    useEffect(() => {
        collectDataCallback(options);
    }, [options]);

    const addOption = () => {
        setOptions([...options, { text: '', isTrue: false }]);
    };

    const handleCheckboxToggle = (index) => {
      const newOptions = [...options];
      newOptions[index].isTrue = !newOptions[index].isTrue;
      setOptions(newOptions);
  };

    return (
        <div>
            {options.map((option, index) => (
                <div key={index} className="flex items-center my-2">
                    <input 
                        type="checkbox" 
                        className="mr-2" 
                        checked={option.isTrue}
                        onChange={() => handleCheckboxToggle(index)}
                    />
                    <input
                        type="text"
                        placeholder={`Option ${index + 1}`}
                        value={option.text}
                        onChange={(e) => {
                            const newOptions = [...options];
                            newOptions[index].text = DOMPurify.sanitize(e.target.value);
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
