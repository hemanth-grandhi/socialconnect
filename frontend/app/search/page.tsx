"use client";

import { useMemo, useState } from "react";
import { apiRequest } from "@/lib/http";

type User = {
  id: string;
  username: string;
  firstName: string;
  lastName: string;
};

export default function SearchPage() {
  const [query, setQuery] = useState("");
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);

  async function handleSearch() {
    setLoading(true);
    try {
      const list = await apiRequest<User[]>("/users");
      setUsers(list);
    } finally {
      setLoading(false);
    }
  }

  const filtered = useMemo(() => {
    const q = query.toLowerCase().trim();
    if (!q) return users;
    return users.filter((u) => u.username.toLowerCase().includes(q));
  }, [query, users]);

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Search Users</h1>
          <p className="text-gray-600">Find and connect with other users</p>
        </div>

        <div className="space-y-6">
          <div className="flex gap-3">
            <input
              type="text"
              placeholder="Search users..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors"
            />
            <button
              onClick={handleSearch}
              disabled={loading}
              className="px-6 py-3 bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500 text-white rounded-lg hover:shadow-lg disabled:bg-gray-400 disabled:cursor-not-allowed transition-all duration-200 flex items-center"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Searching...
                </>
              ) : (
                "Search"
              )}
            </button>
          </div>

          <div className="space-y-4">
            {filtered.map((user) => (
              <div key={user.id} className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                <div className="w-12 h-12 bg-gradient-to-r from-purple-100 via-pink-100 to-orange-100 rounded-full flex items-center justify-center">
                  <span className="text-purple-600 font-semibold text-lg">
                    {user.username.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900">{user.username}</h3>
                  <p className="text-gray-600 text-sm">
                    {user.firstName} {user.lastName}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {filtered.length === 0 && users.length > 0 && (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No users found</h3>
              <p className="text-gray-500">Try adjusting your search terms</p>
            </div>
          )}

          {users.length === 0 && !loading && (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Search for users</h3>
              <p className="text-gray-500">Click the search button to find users</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
