'use client';
import { ChangeEvent, useState } from 'react';
import { BsPlus } from 'react-icons/bs';
import { FaSpinner } from 'react-icons/fa6';

type Props = {
  onSuccess: (result: any) => void;
  children?: React.ReactNode;
}

export default function Uploader({ onSuccess, children }: Props) {
  const [isUploading, setIsUploading] = useState(false);

  async function handleUpload(ev: ChangeEvent<HTMLInputElement>) {
    const file = ev.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    const formData = new FormData();
    formData.set('file', file);

    try {
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Upload failed');
      }

      const result = await response.json();
      onSuccess(result);
    } catch (e) {
      console.error(e);
      alert("Upload failed");
    } finally {
      setIsUploading(false);
    }
  }

  return (
    <>
      <label className="cursor-pointer">
        <input
          type="file"
          className="hidden"
          onChange={handleUpload}
          disabled={isUploading}
        />
        {isUploading ? (
          <div className="bg-gray-200 text-gray-500 px-4 py-2 rounded gap-2 flex items-center cursor-not-allowed">
            <FaSpinner className="animate-spin" />
            <span>Uploading...</span>
          </div>
        ) : (
          children ? children : (
            <div className="bg-blue-600 text-white px-4 py-2 rounded gap-2 flex items-center cursor-pointer">
              <BsPlus />
              <span>Upload Images</span>
            </div>
          )
        )}
      </label>
    </>
  );
}