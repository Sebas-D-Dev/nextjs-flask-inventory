'use client';

import React from 'react';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

const API_BASE = process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:5328/api';

export default function ExportPreviewPage() {
  const router = useRouter();
  const [exportData, setExportData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    fetch(`${API_BASE}/export-preview`)
      .then((res) => {
        if (!res.ok) throw new Error('Failed to fetch export preview');
        return res.json();
      })
      .then((data) => {
        setExportData(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  return (
    <div className="max-w-2xl mx-auto mt-8">
      <h1 className="text-3xl font-bold mb-6">Export Preview</h1>
      {loading && <div>Loading...</div>}
      {error && <div className="text-red-600">{error}</div>}
      {!loading && !error && exportData && (
        <pre className="bg-gray-100 p-4 rounded">{JSON.stringify(exportData, null, 2)}</pre>
      )}
    </div>
  );
}