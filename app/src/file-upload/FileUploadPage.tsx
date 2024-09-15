import { createFile, useQuery, getAllFilesByUser, getDownloadFileSignedURL } from 'wasp/client/operations';
import axios from 'axios';
import { useState, useEffect, FormEvent } from 'react';
import { cn } from '../client/cn';

export default function FileUploadPage() {
  const [fileToDownload, setFileToDownload] = useState<string>('');

  const { data: files, error: filesError, isLoading: isFilesLoading } = useQuery(getAllFilesByUser);
  const { isLoading: isDownloadUrlLoading, refetch: refetchDownloadUrl } = useQuery(
    getDownloadFileSignedURL,
    { key: fileToDownload },
    { enabled: false }
  );

  useEffect(() => {
    if (fileToDownload.length > 0) {
      refetchDownloadUrl()
        .then((urlQuery) => {
          switch (urlQuery.status) {
            case 'error':
              console.error('Error fetching download URL', urlQuery.error);
              alert('Error fetching download');
              return;
            case 'success':
              window.open(urlQuery.data, '_blank');
              return;
          }
        })
        .finally(() => {
          setFileToDownload('');
        });
    }
  }, [fileToDownload]);

  const handleUpload = async (e: FormEvent<HTMLFormElement>) => {
    try {
      e.preventDefault();
      const formData = new FormData(e.target as HTMLFormElement);
      const file = formData.get('file-upload') as File;
      if (!file || !file.name || !file.type) {
        throw new Error('No file selected');
      }

      const fileType = file.type;
      const name = file.name;

      const { uploadUrl } = await createFile({ fileType, name });
      if (!uploadUrl) {
        throw new Error('Failed to get upload URL');
      }
      const res = await axios.put(uploadUrl, file, {
        headers: {
          'Content-Type': fileType,
        },
      });
      if (res.status !== 200) {
        throw new Error('File upload to S3 failed');
      }
    } catch (error) {
      alert('Error uploading file. Please try again');
      console.error('Error uploading file', error);
    }
  };

  return (
    <div className="py-16 lg:py-20 bg-gradient-to-b from-gray-900 via-gray-800 to-black text-white min-h-screen">
      <div className="container mx-auto px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-5xl font-bold tracking-tight text-white">
            <span className="text-yellow-500">AWS</span> File Upload
          </h2>
          <p className="mt-6 text-lg leading-8 text-gray-400">
            Easily upload and manage your files using our AWS S3 integration. Whether you need this feature or not, it's here for those who asked 🤝
          </p>
        </div>
        <div className="my-12 bg-gray-800 rounded-3xl p-8 shadow-lg">
          <form onSubmit={handleUpload} className="flex flex-col gap-4 items-center">
            <input
              type="file"
              name="file-upload"
              accept="image/jpeg, image/png, .pdf, text/*"
              className="text-gray-300 bg-gray-700 rounded-md p-2 cursor-pointer w-full"
            />
            <button
              type="submit"
              className="w-full max-w-xs font-medium text-white bg-yellow-500 shadow-lg rounded-md py-2 px-4 hover:bg-yellow-400 transition-all duration-200 ease-in-out focus:outline-none"
            >
              Upload
            </button>
          </form>
          <div className="border-b-2 border-gray-600 my-8"></div>
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-white">Uploaded Files</h2>
            {isFilesLoading && <p className="text-gray-400">Loading...</p>}
            {filesError && <p className="text-red-500">Error: {filesError.message}</p>}
            {!!files && files.length > 0 ? (
              files.map((file: any) => (
                <div
                  key={file.key}
                  className={cn('flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-gray-300', {
                    'opacity-70': file.key === fileToDownload && isDownloadUrlLoading,
                  })}
                >
                  <p className="truncate w-full sm:w-auto">{file.name}</p>
                  <button
                    onClick={() => setFileToDownload(file.key)}
                    disabled={file.key === fileToDownload && isDownloadUrlLoading}
                    className="min-w-[7rem] text-sm text-gray-900 bg-yellow-500 shadow-lg rounded-md py-1 px-2 hover:bg-yellow-400 transition-all duration-200 ease-in-out focus:outline-none disabled:cursor-not-allowed"
                  >
                    {file.key === fileToDownload && isDownloadUrlLoading ? 'Loading...' : 'Download'}
                  </button>
                </div>
              ))
            ) : (
              <p className="text-gray-400">No files uploaded yet :(</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
