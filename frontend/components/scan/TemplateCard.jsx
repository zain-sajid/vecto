import { useRouter } from 'next/router';

import SeverityBadge from '../SeverityBadge';

import { CheckCircleIcon } from '@heroicons/react/20/solid';

function classNames(...classes) {
  return classes.filter(Boolean).join(' ');
}

export default function TemplateCard({ template, checked, toggleTemplate }) {
  const router = useRouter();

  function viewTemplate(id) {
    router.push(`/templates/${id}`);
  }

  return (
    <div
      className={classNames(
        checked ? 'border-transparent' : 'border-gray-300',
        'relative flex cursor-pointer rounded-lg border bg-white p-4 shadow-sm focus:outline-none'
      )}
      onClick={() => {
        toggleTemplate(template.template_id);
      }}
    >
      <span className="flex flex-1">
        <span className="flex flex-col">
          <span className="block text-sm font-medium text-gray-900">
            {template.name}
          </span>
          <span className="mt-1 flex items-center text-sm text-gray-500">
            {template.description}
          </span>
          <span className="mt-6 text-sm font-medium text-gray-900">
            <div className="flex gap-2">
              <SeverityBadge>{template.severity}</SeverityBadge>
              <div
                className="flex items-center gap-[2px] text-gray-700"
                onClick={() => viewTemplate(template.template_id)}
              >
                <div className="text-xs hover:underline">View</div>
              </div>
            </div>
          </span>
        </span>
      </span>
      <CheckCircleIcon
        className={classNames(
          !checked ? 'invisible' : '',
          'h-5 w-5 text-purple-600'
        )}
        aria-hidden="true"
      />
      <span
        className={classNames(
          checked ? 'border-purple-500' : 'border-transparent',
          'pointer-events-none absolute -inset-px rounded-lg border-2'
        )}
        aria-hidden="true"
      />
    </div>
  );
}
