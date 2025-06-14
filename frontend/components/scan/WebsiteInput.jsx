export default function WebsiteInput({ type, url, setUrl }) {
  return (
    <div className="mb-4">
      <label
        htmlFor="company-website"
        className="block text-base font-medium text-gray-900"
      >
        Enter the URL to {type}
      </label>
      <div className="mt-1">
        <input
          type="text"
          name="url"
          id="url"
          className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-purple-600 sm:text-sm sm:leading-6"
          placeholder="www.example.com"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
        />
      </div>
    </div>
  );
}
