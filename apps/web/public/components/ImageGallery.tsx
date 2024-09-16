import { trpc } from '../../utils/trpc';

export default function ImageGallery() {
  const { data: images, isLoading } = trpc.useQuery(['file.getImages']);

  if (isLoading) {
    return <p>Loading...</p>;
  }

  return (
    <div className="grid grid-cols-2 gap-4">
      {/* {images?.map((image) => (
        // <img
        //   key={image.id}
        //   src={image.url}
        //   alt={image.filename}
        //   className="w-full h-auto rounded"
        // />
      ))} */}
    </div>
  );
}
