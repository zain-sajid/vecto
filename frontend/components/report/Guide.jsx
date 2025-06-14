import { useState, useEffect } from 'react';
import Loader from '../Loader';

const { Configuration, OpenAIApi } = require('openai');

const configuration = new Configuration({
  apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
});

// for making requests to the OpenAPI from client-side
delete configuration.baseOptions.headers['User-Agent'];

const openai = new OpenAIApi(configuration);

export default function Guide({ type }) {
  const [guide, setGuide] = useState(null);
  const [loading, setLoading] = useState(false);

  const prompt = `How to fix ${type}?`;

  useEffect(() => {
    setLoading(true);

    openai
      .createCompletion({
        model: 'text-davinci-003',
        prompt,
        max_tokens: 300,
      })
      .then((completion) => {
        setGuide({
          question: prompt,
          answer: completion.data.choices[0].text.slice(2),
        });
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
      });
  }, []);

  return (
    <div className="w-full overflow-hidden bg-white shadow sm:rounded-md px-4 sm:px-6">
      {loading ? (
        <div className="flex h-full justify-center items-center">
          <div className="w-8 h-8">
            <Loader />
          </div>
        </div>
      ) : (
        <>
          <div className="text-lg font-medium leading-6 pt-5  ">
            {guide?.question}
          </div>

          <div className="mt-2 text-sm text-gray-500 whitespace-pre-wrap pb-4">
            <p>{guide?.answer}</p>
          </div>
        </>
      )}
    </div>
  );
}
