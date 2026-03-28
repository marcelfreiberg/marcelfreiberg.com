"use client";

import Image from "next/image";

const PHOTO_URL =
  "https://mex7bxttci42tmsd.public.blob.vercel-storage.com/SKP_0981-quadrat.jpg";

export default function PhotoWindow() {
  return (
    <div className="w-full h-full flex items-center justify-center bg-surface">
      <Image
        src={PHOTO_URL}
        alt="Marcel Freiberg"
        width={400}
        height={400}
        className="object-cover w-full h-full"
        priority
      />
    </div>
  );
}
