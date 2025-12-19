import Image from "next/image";
import React from "react";

type Props = {
  file: string; // Now expecting a URL string
  onClick?: () => void;
}

export default function UploadThumbnail({ file, onClick }: Props) {
  function handleClick(ev: React.MouseEvent) {
    if (onClick) {
      ev.preventDefault();
      return onClick();
    }
    // window.open(file, '_blank');
  }

  // Check if it's an image URL (rough check or assume yes since we control upload)
  return (
    <div onClick={handleClick} className="relative w-full h-full cursor-pointer">
      <Image
        src={file}
        alt="thumbnail"
        fill
        className="object-cover"
        sizes="100px" // Optimization for thumbnail
      />
    </div>
  );
}