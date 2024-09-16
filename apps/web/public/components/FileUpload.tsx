import { useState } from 'react';
import { trpc } from '../../utils/trpc';

export default function FileUpload() {
  const [file, setFile] = useState<File | null>(null);
  const uploadMutation = trpc.useMutation('file.upload');

  const handleFileUpload = async () => {
    if (file) {
      const formData = new FormData();
      formData.append('file', file);

      await uploadMutation.mutateAsync({ file: formData });
      setFile(null);  // Clear the file input
    }
  };

  return (
    <div className="bg-white p-4 rounded shadow">
      <input type="file" onChange={(e) => setFile(e.target.files ? e.target.files[0] : null)} />
      <button onClick={handleFileUpload} className="mt-2 p-2 bg-blue-500 text-white rounded">
        Upload File
      </button>
    </div>
  );
}
