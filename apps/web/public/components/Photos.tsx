export default function Photos() {
    return (
      <div className="bg-white p-4 rounded-lg shadow-md">
        <div className="font-bold text-lg">Photos</div>
        <p className="text-gray-500">Library · 0 Photos</p>
        <div className="grid grid-cols-3 gap-4 mt-4">
          {/* Placeholder for uploaded photos */}
          <div className="h-32 w-32 bg-gray-200"></div>
          <div className="h-32 w-32 bg-gray-200"></div>
          <div className="h-32 w-32 bg-gray-200"></div>
        </div>
      </div>
    );
  }
  