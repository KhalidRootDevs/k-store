import React from 'react';

export default function PDFViewer({ link }: { link: string }) {
  return (
    <iframe src={link} title="Company Policy PDF" className="h-full w-full" />
  );
}
