import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/router';

import axios from 'axios';

import { Bars3Icon } from '@heroicons/react/24/outline';

import Sidebar from '@/components/Sidebar';
import ResultDetails from '@/components/report/ResultDetails';
import MoreTemplates from '@/components/report/MoreTemplates';
import GenerateReport from '@/components/report/GenerateReport';
import Guide from '@/components/report/Guide';

import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

export default function Example() {
  const router = useRouter();

  const { scanId } = router.query;

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [scanResult, setScanResult] = useState(null);

  const [records, setRecords] = useState([]);
  const [recordIndex, setRecordIndex] = useState(0);

  const pdfComponent = useRef();

  function handleExport(type) {
    if (type === 'json') {
      const jsonData = JSON.stringify(scanResult, null, 2);
      const blob = new Blob([jsonData], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `report-${scanId}.json`;
      link.click();
    }
    if (type === 'pdf') {
      html2canvas(pdfComponent.current).then((canvas) => {
        const imgData = canvas.toDataURL('image/png');

        const doc = new jsPDF('p', 'mm', 'a4');
        const pdfWidth = doc.internal.pageSize.getWidth();
        const pdfHeight = doc.internal.pageSize.getHeight();
        const imgWidth = canvas.width;
        const imgHeight = canvas.height;
        const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight);

        doc.text(`Scan ID: ${scanId}`, 10, 10);
        doc.addImage(
          imgData,
          'PNG',
          0,
          10,
          imgWidth * ratio,
          imgHeight * ratio
        );
        doc.save(`report-${scanId}.pdf`);
      });
    }
  }

  useEffect(() => {
    if (scanId) {
      axios.get(`/api/scan/results/${scanId}`).then((res) => {
        setRecords(res.data.records);
        setScanResult(res.data.records[recordIndex]);
      });
    }
  }, [scanId]);

  useEffect(() => {
    setScanResult(records[recordIndex]);
  }, [recordIndex]);

  return (
    <>
      <Sidebar
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        activeLink={3}
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
          <div className="py-6 min-h-screen">
            <div className="mx-auto max-w-6xl px-4 sm:px-6 md:px-8">
              {/* Replace with your content */}
              <div className="py-4">
                <div className="w-full" ref={pdfComponent}>
                  <ResultDetails
                    result={scanResult}
                    numOfRecords={records.length}
                    recordIndex={recordIndex}
                    setRecordIndex={setRecordIndex}
                  />
                </div>

                <div className="flex flex-col gap-4 mt-4 lg:flex-row">
                  {scanResult ? (
                    <Guide type={scanResult?.VulnerabilityType} />
                  ) : (
                    <MoreTemplates />
                  )}
                  <GenerateReport handleExport={handleExport} />
                </div>
              </div>
              {/* /End replace */}
            </div>
          </div>
        </main>
      </div>
    </>
  );
}
