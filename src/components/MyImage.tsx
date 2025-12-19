'use client';
import Image, { ImageProps } from "next/image";

type MyImageProps = ImageProps & {
  aiCrop?: boolean;
  width: number;
  height: number;
};

export default function MyImage({ src, width, height, aiCrop, ...props }: MyImageProps) {
  if (!src) return null;

  return (
    <Image
      src={src}
      width={width}
      height={height}
      style={{ objectFit: 'cover' }}
      {...props}
    />
  );
}