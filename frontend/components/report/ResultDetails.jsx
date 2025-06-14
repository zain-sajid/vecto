import {
  ShieldCheckIcon,
  ShieldExclamationIcon,
} from '@heroicons/react/24/outline';

import Bullets from './Bullets';

export default function ResultDetails({
  result,
  numOfRecords,
  recordIndex,
  setRecordIndex,
}) {
  if (!result) {
    return (
      <div className="overflow-hidden bg-white shadow sm:rounded-lg">
        <div className="px-4 py-5 sm:px-6">
          <h3 className="flex items-center gap-2 text-lg font-medium leading-6 text-gray-900">
            <ShieldCheckIcon className="h-8 w-8 text-green-500" />
            No Vulnerability Detected.
          </h3>
          <p className="mt-1 max-w-2xl text-sm text-gray-500">
            Your website is safe from the specified vulnerability.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="overflow-hidden bg-white shadow sm:rounded-lg">
      <div className="flex justify-between">
        <div className="px-4 py-5 sm:px-6">
          <h3 className="flex items-center gap-2 text-lg font-medium leading-6 text-gray-900">
            <ShieldExclamationIcon className="h-8 w-8 text-red-500" />
            Vulnerability Detected
          </h3>
          <p className="mt-1 max-w-2xl text-sm text-gray-500">
            Please check the details of the request on which the vulnerability
            was detected.
          </p>
        </div>
        <Bullets
          numOfRecords={numOfRecords}
          index={recordIndex}
          setIndex={setRecordIndex}
        />
      </div>
      <div className="border-t border-gray-200 px-4 py-5 sm:p-0">
        <dl className="sm:divide-y sm:divide-gray-200">
          <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:py-5 sm:px-6">
            <dt className="text-sm font-medium text-gray-500">Vulnerability</dt>
            <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
              {result?.VulnerabilityType}
            </dd>
          </div>
          <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:py-5 sm:px-6">
            <dt className="text-sm font-medium text-gray-500">URL</dt>
            <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0 break-words">
              {result?.RequestUrl}
            </dd>
          </div>
          <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:py-5 sm:px-6">
            <dt className="text-sm font-medium text-gray-500">Method</dt>
            <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
              {result?.RequestMethod}
            </dd>
          </div>
          <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:py-5 sm:px-6">
            <dt className="text-sm font-medium text-gray-500">Payload</dt>
            <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
              {result?.Payload}
            </dd>
          </div>
        </dl>
      </div>
    </div>
  );
}
