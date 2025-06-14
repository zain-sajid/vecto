import { useState } from 'react';
import { RadioGroup } from '@headlessui/react';

function classNames(...classes) {
  return classes.filter(Boolean).join(' ');
}

export default function List({ group, groupName, options, values, setValues }) {
  const [metric, setMetric] = useState(values[group]);

  return (
    <div>
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-medium leading-6 text-gray-900">
          {groupName}
        </h2>
      </div>

      <RadioGroup
        value={metric}
        onChange={(val) => {
          setMetric(val);
          setValues({ ...values, [group]: val });
        }}
        className="mt-2 mb-4"
      >
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {Object.keys(options).map((option) => {
            return (
              <RadioGroup.Option
                key={option}
                value={option}
                className={({ active, checked }) =>
                  classNames(
                    active ? 'ring-2 ring-purple-600 ring-offset-2' : '',
                    checked
                      ? 'bg-purple-600 text-white hover:bg-purple-500'
                      : 'ring-1 ring-inset ring-gray-300 bg-white text-gray-900 hover:bg-gray-50',
                    'flex items-center justify-center rounded-md py-3 px-3 text-sm font-semibold sm:flex-1 cursor-pointer'
                  )
                }
              >
                <RadioGroup.Label as="span">
                  {options[option].name}
                </RadioGroup.Label>
              </RadioGroup.Option>
            );
          })}
        </div>
      </RadioGroup>
    </div>
  );
}
