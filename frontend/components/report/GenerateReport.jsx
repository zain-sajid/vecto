import { useState } from 'react';
import Select from '../Select';

const formats = [
  { id: 'json', name: 'JSON' },
  { id: 'pdf', name: 'PDF' },
];

export default function GenerateReport({ handleExport }) {
  const [selected, setSelected] = useState(formats[0]);

  return (
    <div className="bg-white shadow sm:rounded-lg h-fit">
      <div className="px-4 py-5 sm:p-6">
        <h3 className="text-lg font-medium leading-6 text-gray-900">
          Export Results
        </h3>
        <div className="mt-2 max-w-xl text-sm text-gray-500">
          <p>
            You can export a report of the scan results in different formats to
            share with your team.
          </p>
        </div>
        <form className="mt-5 sm:flex sm:items-center">
          <div className="w-full sm:max-w-xs">
            <label htmlFor="email" className="sr-only">
              Format
            </label>
            <Select
              formats={formats}
              selected={selected}
              setSelected={setSelected}
            />
          </div>
          <button
            type="button"
            className="mt-3 inline-flex w-full items-center justify-center rounded-md border border-transparent bg-purple-600 px-4 py-2 font-medium text-white shadow-sm hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
            onClick={() => handleExport(selected.id)}
          >
            Export
          </button>
        </form>
      </div>
    </div>
  );
}
