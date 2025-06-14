import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';

export default function SearchInput() {
  return (
    <div className="w-full relative flex items-center">
      <input
        type="text"
        name="search"
        id="search"
        autoComplete="off"
        className="block w-full rounded-md border-gray-300 pr-12 shadow-sm focus:border-purple-500 focus:ring-purple-500 sm:text-sm"
        placeholder="Search"
      />
      <div className="absolute inset-y-0 right-0 flex py-1.5 pr-1.5">
        <div className="inline-flex items-center rounded border border-gray-200 px-2 font-sans text-sm font-medium text-gray-400">
          <MagnifyingGlassIcon className="w-5" />
        </div>
      </div>
    </div>
  );
}
