import UserProfile from './UserProfile';
import ImageGallery from './ImageGallery';
import FileUpload from './FileUpload';
import NoteSection from './NoteSection';

export default function Dashboard() {
  return (
    <div className="container mx-auto p-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* User Profile */}
        <div className="col-span-1">
          <UserProfile />
        </div>

        {/* File Upload and Image Gallery */}
        <div className="col-span-2">
          <FileUpload />
          <ImageGallery />
        </div>

        {/* Notes Section */}
        <div className="col-span-3">
          <NoteSection />
        </div>
      </div>
    </div>
  );
}
