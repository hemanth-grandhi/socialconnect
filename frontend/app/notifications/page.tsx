export default function NotificationsPage() {
  const mockItems = [
    "Aarav liked your post.",
    "Mira started following you.",
    "Noah commented: Nice shot!",
    "A new feature is available: profile avatars.",
  ];

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Notifications</h1>
          <p className="text-gray-600">Stay updated with your network activity</p>
        </div>

        <div className="space-y-4">
          {mockItems.map((item, idx) => (
            <div key={idx} className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
              <div className="w-10 h-10 bg-gradient-to-r from-purple-100 via-pink-100 to-orange-100 rounded-full flex items-center justify-center flex-shrink-0">
                <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5v-5zM4.868 12.683A17.925 17.925 0 0112 21c7.962 0 12-1.21 12-2.683m-12 2.683a17.925 17.925 0 01-7.132-8.317M12 21V9m0 0a3 3 0 110-6 3 3 0 010 6z" />
                </svg>
              </div>
              <p className="text-gray-900">{item}</p>
            </div>
          ))}
        </div>

        {mockItems.length === 0 && (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5v-5zM4.868 12.683A17.925 17.925 0 0112 21c7.962 0 12-1.21 12-2.683m-12 2.683a17.925 17.925 0 01-7.132-8.317M12 21V9m0 0a3 3 0 110-6 3 3 0 010 6z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No notifications yet</h3>
            <p className="text-gray-500">When someone interacts with your posts, you'll see them here</p>
          </div>
        )}
      </div>
    </div>
  );
}
