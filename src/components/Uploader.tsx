'use client';
import { CldUploadWidget } from 'next-cloudinary';
import { BsPlus } from 'react-icons/bs';

type Props = {
  onSuccess: (result: any) => void;
  children?: React.ReactNode;
}

export default function Uploader({ onSuccess, children }: Props) {
  return (
    <CldUploadWidget
      uploadPreset="haatbazaar_default"
      onSuccess={(result) => {
        if (result.event === 'success') {
          onSuccess(result.info);
        }
      }}
      options={{
        sources: ['local', 'url', 'camera'],
        multiple: true,
      }}
    >
      {({ open }) => {
        return (
          <div onClick={() => open()}>
            {children ? children : (
              <button className="bg-blue-600 text-white px-4 py-2 rounded gap-2 flex items-center">
                <BsPlus />
                <span>Upload Images</span>
              </button>
            )}
          </div>
        );
      }}
    </CldUploadWidget>
  );
}