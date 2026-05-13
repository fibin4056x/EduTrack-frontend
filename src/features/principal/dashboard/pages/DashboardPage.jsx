function DashboardPage() {
  return (
    <div>
      <h1 className="text-2xl font-semibold mb-4">
        Principal Dashboard
      </h1>

      <div className="grid grid-cols-3 gap-4">
        
        <div className="bg-white p-4 rounded-lg border">
          <p className="text-sm text-gray-500">Teachers</p>
          <p className="text-xl font-semibold">0</p>
        </div>

        <div className="bg-white p-4 rounded-lg border">
          <p className="text-sm text-gray-500">Students</p>
          <p className="text-xl font-semibold">0</p>
        </div>

        <div className="bg-white p-4 rounded-lg border">
          <p className="text-sm text-gray-500">Classes</p>
          <p className="text-xl font-semibold">0</p>
        </div>

      </div>
    </div>
  );
}

export default DashboardPage;