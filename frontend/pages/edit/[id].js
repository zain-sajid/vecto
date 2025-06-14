import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

import Editor from '@monaco-editor/react';
import yaml from 'js-yaml';
import axios from 'axios';
import { v4 } from 'uuid';

import { storage } from '@/config/firebase';
import { getDownloadURL, ref, uploadString } from 'firebase/storage';

import { Bars3Icon } from '@heroicons/react/24/outline';

import Sidebar from '@/components/Sidebar';
import Button from '@/components/Button';
import Loader from '@/components/Loader';
import InfoCard from '@/components/create/InfoCard';
import ProtectedRoute from '@/components/routes/ProtectedRoute';

export default function Edit() {
  const router = useRouter();

  const { id } = router.query;

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [code, setCode] = useState('');
  const [template, setTemplate] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const editTemplate = () => {
    setIsSaving(true);

    const uuid = v4();

    const obj = yaml.load(code, { encoding: 'utf-8' });

    const storageRef = ref(storage, `${uuid}.yaml`);

    uploadString(storageRef, code).then((snapshot) => {
      getDownloadURL(snapshot.ref).then((downloadURL) => {
        const reqBody = {
          template_id: template.template_id,
          user_id: template.user_id,
          name: obj.info.name,
          category: obj.info.category,
          description: obj.info.description,
          severity: obj.info.severity,
          file_path: downloadURL,
          file_name: `${uuid}.yaml`,
          created_at: template.created_at,
        };

        axios
          .put(`/api/template/${id}`, reqBody)
          .then((res) => {
            console.log('Template edited successfully!', res);
            alert('Template edited successfully!');
            setIsSaving(false);
          })
          .catch((err) => {
            console.log(err);
            setIsSaving(false);
          });
      });
    });
  };

  async function getTemplate() {
    axios.get(`/api/template/${id}`).then((res) => {
      setTemplate(res.data[0]);

      const url = res.data[0].file_path;

      axios.get(`/firebase/${url.split('googleapis.com')[1]}`).then((res) => {
        setCode(res.data);
        setIsLoading(false);
      });
    });
  }

  useEffect(() => {
    getTemplate();
  }, []);

  return (
    <ProtectedRoute>
      <Sidebar
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        activeLink={1}
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
              <div className="text-lg font-medium mb-4">Edit template</div>
              {/* Replace with your content */}
              <div className="flex">
                <div className="w-4/5">
                  {!isLoading && (
                    <>
                      <div className="w-full py-1 bg-[#011627]" />
                      <Editor
                        height="75vh"
                        defaultLanguage="yaml"
                        defaultValue={code}
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
                    </>
                  )}
                  <div className="text-right mt-2">
                    <Button onClick={editTemplate} disabled={isSaving}>
                      {!isSaving ? (
                        'Edit'
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
