'use client';
import UploadThumbnail from "@/components/UploadThumbnail";
import Image from "next/image";
import { useState } from "react";
import { BiChevronLeft, BiChevronRight } from "react-icons/bi";

export default function Gallery({ files }: { files: string[] }) {
  const [activeFile, setActiveFile] = useState<string | null>(files?.[0] || null);

  function next() {
    const activeFileIndex = files.findIndex(f => f === activeFile);
    const nextIndex = activeFileIndex === files.length - 1 ? 0 : activeFileIndex + 1;
    const nextFile = files[nextIndex];
    setActiveFile(nextFile);
  }
  function prev() {
    const activeFileIndex = files.findIndex(f => f === activeFile);
    const prevIndex = activeFileIndex === 0 ? files.length - 1 : activeFileIndex - 1;
    const prevFile = files[prevIndex];
    setActiveFile(prevFile);
  }

  if (!files || files.length === 0) return <div>No images</div>;

  return (
    <div className="flex flex-col h-full">
      <div className="relative aspect-square bg-gray-100 rounded-lg overflow-hidden border mb-4">
        {activeFile && (
          <Image
            src={activeFile}
            alt="Active product image"
            fill
            className="object-contain" // Contain to show full image
          />
        )}

        {files.length > 1 && (
          <>
            <button
              onClick={prev}
              className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full size-8 flex justify-center items-center bg-white border shadow hover:bg-gray-100"
            >
              <BiChevronLeft/>
            </button>
            <button
              onClick={next}
              className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full size-8 flex justify-center items-center bg-white border shadow hover:bg-gray-100"
            >
              <BiChevronRight />
            </button>
          </>
        )}
      </div>

      <div className="flex gap-2 justify-center overflow-x-auto">
        {files.map((file, i) => (
          <div
            key={i}
            className={`size-16 rounded border cursor-pointer relative ${activeFile === file ? 'ring-2 ring-blue-600' : ''}`}
            onClick={() => setActiveFile(file)}
          >
            <UploadThumbnail file={file} />
          </div>
        ))}
      </div>
    </div>
  );
}