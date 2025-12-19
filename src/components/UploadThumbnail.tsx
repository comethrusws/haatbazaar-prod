import Image from "next/image";
import React from "react";

type Props = {
  file: string; //expect url string
  onClick?: () => void;
}

export default function UploadThumbnail({ file, onClick }: Props) {
  function handleClick(ev: React.MouseEvent) {
    if (onClick) {
      ev.preventDefault();
      return onClick();
    }
  }

  return (
    <div onClick={handleClick} className="relative w-full h-full cursor-pointer">
      <Image
        src={file}
        alt="thumbnail"
        fill
        className="object-cover"
        sizes="100px" // thumbnail optimization
      />
    </div>
  );
}