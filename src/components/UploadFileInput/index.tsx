import React, { useState, useRef, useEffect } from 'react';
import { UseFormSetValue } from 'react-hook-form';
import { formatBytes } from '@/utils/formatBytes';
import Image from 'next/image';

type UploadFileType = {
  setValue: UseFormSetValue<any>;
};

const UploadFileInput: React.FC<UploadFileType> = ({ setValue }) => {
  const inputFileRef = useRef<HTMLInputElement | null>(null);
  const [pickedFile, setPickedFile] = useState<File | null>();

  useEffect(() => {
    console.log(pickedFile);
  }, [pickedFile]);

  return (
    <div className="w-full md:w-1/3 md:px-4">
      {!pickedFile ? (
        <>
          <input
            type="file"
            className="hidden"
            ref={inputFileRef}
            onChange={(e) => {
              setValue(`inputFile`, e.target.files);
              if (e.target.files) {
                setPickedFile(e.target.files[0]);
              }
            }}
          />
          <div className="flex flex-col items-center border-dotted border-4 border-gray-300 py-4 px-2 rounded-2xl ">
            <p className="uppercase text-gray-400 mb-6 text-center">
              PNG, GIF, WEBP, MP4 or MP3. Max 100mb.
            </p>
            <button
              className="py-2 px-4 font-bold bg-red-300 text-red-600 rounded-full hover:bg-red-400 transition-colors"
              onClick={() => inputFileRef.current?.click()}
              type="button"
            >
              Choose file
            </button>
          </div>
        </>
      ) : (
        <div className="flex h-40 w-full flex-row justify-around bg-white border-2 shadow-md rounded-2xl py-4 px-4 relative">
          <img src={URL.createObjectURL(pickedFile)} className="rounded-2xl" />
          <div>
            <span className=" font-bold">Name:</span> <br />
            {pickedFile.name} <br /> <br />
            <span className=" font-bold">Size:</span> <br />
            {formatBytes(pickedFile.size)}
          </div>
          <button
            type="button"
            className="w-0 flex flex-row justify-between"
            onClick={() => {
              setPickedFile(null);
              setValue(`inputFile`, null);
            }}
            onKeyDown={() => {
              setPickedFile(null);
              setValue(`inputFile`, null);
            }}
          >
            <img
              src="/icons/cancel.svg"
              className="absolute top-4 right-4 h-4 w-4 cursor-pointer"
            />
          </button>
        </div>
      )}
    </div>
  );
};

export default UploadFileInput;
