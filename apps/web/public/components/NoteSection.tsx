import { useState } from 'react';
import { trpc } from '../../utils/trpc';

export default function NoteSection() {
  const [note, setNote] = useState('');
  const { data: notes } = trpc.useQuery(['note.getAll']);
  const createNoteMutation = trpc.useMutation('note.create');

  const handleCreateNote = async () => {
    await createNoteMutation.mutateAsync({ content: note });
    setNote(''); // Clear the note input after submission
  };

  return (
    <div className="bg-gray-100 p-4 rounded">
      <h2 className="text-xl font-bold">Notes</h2>
      <textarea
        value={note}
        onChange={(e) => setNote(e.target.value)}
        className="w-full p-2 border rounded"
        placeholder="Write a note..."
      />
      <button onClick={handleCreateNote} className="mt-2 p-2 bg-green-500 text-white rounded">
        Add Note
      </button>

      <div className="mt-4">
        {notes?.map((note) => (
          <div key={note.id} className="border-b py-2">
            <p>{note.content}</p>
            <span className="text-sm text-gray-500">{new Date(note.createdAt).toLocaleString()}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
