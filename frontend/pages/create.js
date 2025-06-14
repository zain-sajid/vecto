import { useEffect, useState } from 'react';

import { storage } from '@/config/firebase';
import { getDownloadURL, ref, uploadString } from 'firebase/storage';

import Editor from '@monaco-editor/react';

import { Bars3Icon } from '@heroicons/react/24/outline';

import Sidebar from '@/components/Sidebar';
import Button from '@/components/Button';
import Loader from '@/components/Loader';
import InfoCard from '@/components/create/InfoCard';

import yaml from 'js-yaml';
import axios from 'axios';
import ProtectedRoute from '@/components/routes/ProtectedRoute';

export default function Create() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [name, setName] = useState('');
  const [code, setCode] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  const uploadTemplate = () => {
    if (!name) return alert('Please enter a name for your template');

    setIsSaving(true);

    const obj = yaml.load(code, { encoding: 'utf-8' });

    const storageRef = ref(storage, `${name}.yaml`);

    uploadString(storageRef, code).then((snapshot) => {
      getDownloadURL(snapshot.ref).then((downloadURL) => {
        const reqBody = {
          user_id: 1,
          name: obj.info.name,
          category: obj.info.category,
          description: obj.info.description,
          severity: obj.info.severity,
          file_path: downloadURL,
          file_name: `${name}.yaml`,
        };

        console.log(reqBody);

        axios
          .post('/api/template', reqBody)
          .then((res) => {
            console.log('Template added successfully!', res);
            alert('Template added successfully!');
            setIsSaving(false);
          })
          .catch((err) => {
            console.log(err);
            setIsSaving(false);
          });
      });
    });
  };

  async function getStatus() {
    const result = await axios.get('/api');
  }

  useEffect(() => {
    getStatus();
  }, []);

  return (
    <ProtectedRoute>
      <Sidebar
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        activeLink={2}
      />

      <div className="flex flex-1 flex-col md:pl-64 bg-gray-100">
        <div className="sticky top-0 z-10 bg-gray-100 pl-1 pt-1 sm:pl-3 sm:pt-3 md:hidden">
          <button
            type="button"
            className="-ml-0.5 -mt-0.5 inline-flex h-12 w-12 items-center justify-center rounded-md text-gray-500 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500"
            onClick={() => setSidebarOpen(true)}
          >
            <span className="sr-only">Open sidebar</span>
            <Bars3Icon className="h-6 w-6" aria-hidden="true" />
          </button>
        </div>

        <main className="flex-1">
          <div className="py-8 min-h-screen">
            <div className="mx-auto px-4 sm:px-6 md:px-8">
              <div className="text-lg font-medium mb-4">Create a template</div>
              {/* Replace with your content */}
              <div className="flex">
                <div className="w-4/5">
                  <input
                    type="text"
                    name="name"
                    id="name"
                    className="block w-full sm:text-sm py-3 pl-4 font-mono text-white bg-[#011627]"
                    placeholder="Enter your template name here (without .yaml)"
                    autoComplete="off"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                  <Editor
                    height="75vh"
                    defaultLanguage="yaml"
                    defaultValue="# Add your template here"
                    onChange={(value, event) => {
                      setCode(value);
                    }}
                    onMount={(editor, monaco) => {
                      import('monaco-themes/themes/Night Owl.json').then(
                        (data) => {
                          monaco.editor.defineTheme('nightOwl', data);
                          monaco.editor.setTheme('nightOwl');
                        }
                      );
                    }}
                  />
                  <div className="text-right mt-2">
                    <Button onClick={uploadTemplate} disabled={isSaving}>
                      {!isSaving ? (
                        'Create'
                      ) : (
                        <div className="w-5 h-5">
                          <Loader />
                        </div>
                      )}
                    </Button>
                  </div>
                </div>

                <InfoCard />
              </div>

              {/* /End replace */}
            </div>
          </div>
        </main>
      </div>
    </ProtectedRoute>
  );
}
