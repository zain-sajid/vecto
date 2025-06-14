export default function SeverityBadge(props) {
  switch (props.children) {
    case 'Low':
      return (
        <span className="inline-flex items-center rounded bg-green-100 px-2 py-0.5 text-xs font-medium text-green-800">
          {props.children}
        </span>
      );
    case 'Medium':
      return (
        <span className="inline-flex items-center rounded bg-yellow-100 px-2 py-0.5 text-xs font-medium text-yellow-800">
          {props.children}
        </span>
      );
    case 'High':
      return (
        <span className="inline-flex items-center rounded bg-red-100 px-2 py-0.5 text-xs font-medium text-red-800">
          {props.children}
        </span>
      );
    default:
      return (
        <span className="inline-flex items-center rounded bg-neutral-100 px-2 py-0.5 text-xs font-medium text-green-800">
          Unknown
        </span>
      );
  }
}
