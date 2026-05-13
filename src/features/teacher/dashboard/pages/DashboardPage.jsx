function DashboardPage() {
  return (
    <div>
      <h1 className="text-2xl font-semibold mb-4">
        Teacher Dashboard
      </h1>

      <div className="bg-white p-4 rounded-lg border">
        <p className="text-sm text-gray-500">My Students</p>
        <p className="text-xl font-semibold">0</p>
      </div>
    </div>
  );
}

export default DashboardPage;