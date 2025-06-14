import { InformationCircleIcon } from '@heroicons/react/24/outline';

export default function InfoCard() {
  return (
    <div className="max-h-[80vh] max-w-sm overflow-y-scroll bg-white shadow sm:rounded-lg ml-2 scrollbar-thin scrollbar-thumb-neutral-400 scrollbar-track-neutral-200  scrollbar-thumb-rounded-full scrollbar-track-rounded-full">
      <div className="px-4 py-5 sm:px-6">
        <div className="flex items-center gap-2">
          <InformationCircleIcon className="w-6 h-6" />
          <h3 className="text-base font-semibold leading-6 text-gray-900">
            Information
          </h3>
        </div>
        <p className="mt-1 max-w-2xl text-sm text-gray-500">
          Information about the different keys to be defined in the template.
        </p>
      </div>
      <div className="border-t border-gray-200 px-4 py-5 sm:px-6">
        <dl className="grid grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-1">
          <div className="sm:col-span-1">
            <dt className="text-sm font-medium text-gray-500">
              Name<span className="text-red-500">*</span>
            </dt>
            <dd className="mt-1 text-sm text-gray-900">
              Used to identify the template for running a scan.
            </dd>
          </div>
          <div className="sm:col-span-1">
            <dt className="text-sm font-medium text-gray-500">
              Severity<span className="text-red-500">*</span>
            </dt>
            <dd className="mt-1 text-sm text-gray-900">
              Indicates the level of importance assigned to vulnerabilities.
              <br />
              <div className="mt-1">
                <span className="font-medium">Example:</span> High, Medium, Low
              </div>
            </dd>
          </div>
          <div className="sm:col-span-1">
            <dt className="text-sm font-medium text-gray-500">
              Category<span className="text-red-500">*</span>
            </dt>
            <dd className="mt-1 text-sm text-gray-900">
              Refers to the type of vulnerability it is designed to detect,
              helping to categorize
              <br />
              <div className="mt-1">
                <span className="font-medium">Example:</span> SQL Injection, XSS
              </div>
            </dd>
          </div>
          <div className="sm:col-span-1">
            <dt className="text-sm font-medium text-gray-500">
              Description<span className="text-red-500">*</span>
            </dt>
            <dd className="mt-1 text-sm text-gray-900">
              Provides details on the purpose and scope of the template
            </dd>
          </div>
          <div className="sm:col-span-1">
            <dt className="text-sm font-medium text-gray-500">
              Variables<span className="text-red-500">*</span>
            </dt>
            <dd className="mt-1 text-sm text-gray-900">
              The fields in which the payloads will be passed
            </dd>
          </div>
          <div className="sm:col-span-1">
            <dt className="text-sm font-medium text-gray-500">
              Payloads<span className="text-red-500">*</span>
            </dt>
            <dd className="mt-1 text-sm text-gray-900">
              The payloads that will be used to test the target
            </dd>
          </div>
          <div className="sm:col-span-1">
            <dt className="text-sm font-medium text-gray-500">
              Detection<span className="text-red-500">*</span>
            </dt>
            <dd className="mt-1 text-sm text-gray-900">
              The methods for detecting vulnerabilities (Case Sensitive).
              Currently, the following methods are supported:
              <ul className="list-disc ml-4">
                <li>isXSSDetected()</li>
                <li>isVulnerableToPathTraversal()</li>
                <li>isVulnerableToSQLInjection()</li>
                <li>isVulnerableToPrototypePollution()</li>
              </ul>
            </dd>
          </div>
        </dl>
      </div>
    </div>
  );
}
