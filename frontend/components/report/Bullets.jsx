export default function Bullets({ index, setIndex, numOfRecords }) {
  return (
    <nav className="flex items-center justify-center p-4" aria-label="Progress">
      <ol role="list" className="ml-8 flex items-center space-x-5">
        {[...Array(numOfRecords)].map((_, stepIndex) => (
          <li key={stepIndex}>
            {stepIndex === index ? (
              <div
                className="relative flex items-center justify-center"
                aria-current="step"
              >
                <span className="absolute flex h-5 w-5 p-px" aria-hidden="true">
                  <span className="h-full w-full rounded-full bg-purple-200" />
                </span>
                <span
                  className="relative block h-2.5 w-2.5 rounded-full bg-purple-600"
                  aria-hidden="true"
                />
                <span className="sr-only">{stepIndex}</span>
              </div>
            ) : (
              <div
                className="block h-2.5 w-2.5 rounded-full bg-gray-200 hover:bg-gray-400"
                onClick={() => {
                  setIndex(stepIndex);
                }}
              >
                <span className="sr-only">{stepIndex}</span>
              </div>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
