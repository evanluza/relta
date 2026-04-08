'use client';

import { useState, useRef } from 'react';

interface FileUploadProps {
  onFileSelected: (file: File) => void;
  selectedFile: File | null;
}

export function FileUpload({ onFileSelected, selectedFile }: FileUploadProps) {
  const [dragOver, setDragOver] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) onFileSelected(file);
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) onFileSelected(file);
  }

  return (
    <div
      className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-colors ${
        dragOver ? 'border-primary bg-primary/5' : 'border-card-border hover:border-muted'
      }`}
      onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
      onDragLeave={() => setDragOver(false)}
      onDrop={handleDrop}
      onClick={() => inputRef.current?.click()}
    >
      <input
        ref={inputRef}
        type="file"
        className="hidden"
        onChange={handleChange}
      />
      {selectedFile ? (
        <div>
          <p className="text-foreground font-medium">{selectedFile.name}</p>
          <p className="text-muted text-sm mt-1">
            {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
          </p>
        </div>
      ) : (
        <div>
          <p className="text-muted">Drop your file here or click to browse</p>
          <p className="text-muted/50 text-sm mt-1">Max 50MB</p>
        </div>
      )}
    </div>
  );
}
