import Uploader from "@/components/Uploader";
import UploadThumbnail from "@/components/UploadThumbnail";
import { FaPlus } from "react-icons/fa6";
import { Dispatch, SetStateAction, useState } from "react";
import { BsImage, BsPlus } from "react-icons/bs";

type Props = {
  files: string[];
  setFiles: Dispatch<SetStateAction<string[]>>;
};

export default function UploadArea({ files, setFiles }: Props) {
  const [isUploading, setIsUploading] = useState(false);
  return (
    <div className="bg-gray-100 p-4 rounded">
      <h2 className="text-center text-xs text-gray-400 uppercase font-bold">
        Add photos your product
      </h2>
      <div className="flex flex-col">
        <BsImage className="h-24 text-gray-300" />
        <label
          className={
            'upload-btn mt-2 border px-4 py-2 rounded inline-flex gap-1 items-center justify-center '
            + (
              isUploading
                ? 'text-gray-400 cursor-not-allowed'
                : "border-blue-600 text-blue-600 cursor-pointer"
            )
          }>
          <Uploader
            onSuccess={result => {
              // result.secure_url is the URL from Cloudinary
              if (result && result.secure_url) {
                setFiles(prev => [...prev, result.secure_url]);
              }
              setIsUploading(false);
            }}
          >
            {isUploading ? (
              <span>Uploading...</span>
            ) : (
              <>
                <BsPlus />
                <span>Add photos</span>
              </>
            )}
          </Uploader>

        </label>
        <div className="flex gap-2 mt-2 flex-wrap">
          {files.map((url, index) => (
            <div key={url + index} className="size-16 rounded overflow-hidden">
              <UploadThumbnail file={url} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}