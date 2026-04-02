"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { apiRequest, ApiError } from "@/lib/http";
import { imageUrl } from "@/lib/api";

type Profile = {
  id: string;
  username: string;
  email: string;
  createdAt: string;
  _count: {
    posts: number;
    followers: number;
    following: number;
  };
};

type ProfilePost = {
  id: string;
  imageUrl?: string | null;
  content: string;
  author: { id: string };
};

export default function ProfilePage() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [posts, setPosts] = useState<ProfilePost[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadProfile() {
      setIsLoading(true);
      setError("");

      try {
        const userRaw = localStorage.getItem("user");
        if (!userRaw) {
          setError("Please login first.");
          return;
        }

        const currentUser = JSON.parse(userRaw) as { id: string };
        const [payload, allPosts] = await Promise.all([
          apiRequest<Profile>(`/users/${currentUser.id}`),
          apiRequest<ProfilePost[]>("/posts?limit=100&skip=0"),
        ]);
        setProfile(payload);
        setPosts(allPosts.filter((post) => post.author.id === currentUser.id));
      } catch (e) {
        setError(e instanceof ApiError ? e.message : "Something went wrong. Please try again.");
      } finally {
        setIsLoading(false);
      }
    }

    loadProfile();
  }, []);

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Profile Header */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden mb-8">
        <div className="bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500 h-32"></div>
        <div className="px-8 pb-8">
          <div className="flex flex-col sm:flex-row items-center sm:items-end -mt-16 mb-6">
            <div className="w-32 h-32 bg-white rounded-full border-4 border-white shadow-lg flex items-center justify-center mb-4 sm:mb-0 sm:mr-6">
              <span className="text-4xl font-bold text-gray-600">
                {profile ? profile.username.charAt(0).toUpperCase() : "?"}
              </span>
            </div>
            <div className="text-center sm:text-left">
              <h1 className="text-3xl font-bold text-gray-900 mb-1">
                {profile?.username || "Loading..."}
              </h1>
              <p className="text-gray-600">{profile?.email}</p>
            </div>
          </div>

          {profile && (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="text-2xl font-bold text-gray-900">{profile._count.posts}</div>
                <div className="text-sm text-gray-600">Posts</div>
              </div>
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="text-2xl font-bold text-gray-900">{profile._count.followers}</div>
                <div className="text-sm text-gray-600">Followers</div>
              </div>
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="text-2xl font-bold text-gray-900">{profile._count.following}</div>
                <div className="text-sm text-gray-600">Following</div>
              </div>
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="text-2xl font-bold text-gray-900">
                  {Math.floor((new Date().getTime() - new Date(profile.createdAt).getTime()) / (1000 * 60 * 60 * 24))}
                </div>
                <div className="text-sm text-gray-600">Days Active</div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
          <div className="animate-pulse">
            <div className="flex items-center space-x-4 mb-6">
              <div className="w-16 h-16 bg-gray-200 rounded-full"></div>
              <div>
                <div className="h-6 bg-gray-200 rounded w-32 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-48"></div>
              </div>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-16 bg-gray-200 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <p className="text-red-800 text-sm font-medium">{error}</p>
        </div>
      )}

      {/* Posts Grid */}
      {profile && posts.length > 0 && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">My Posts</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map((post) => (
              <div key={post.id} className="group relative bg-gray-50 rounded-lg overflow-hidden hover:shadow-md transition-shadow">
                {post.imageUrl ? (
                  <div className="aspect-square">
                    <img
                      src={imageUrl(post.imageUrl)}
                      alt="Post"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                    />
                  </div>
                ) : (
                  <div className="aspect-square p-6 flex items-center justify-center">
                    <p className="text-gray-600 text-sm line-clamp-4 text-center">
                      {post.content}
                    </p>
                  </div>
                )}
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-opacity duration-200 flex items-center justify-center">
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Empty State */}
      {profile && posts.length === 0 && !isLoading && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
          <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No posts yet</h3>
          <p className="text-gray-600 mb-6">Start sharing your thoughts and connect with others!</p>
          <Link
            href="/create"
            className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500 text-white rounded-lg hover:shadow-lg transition-all duration-200"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Create your first post
          </Link>
        </div>
      )}
    </div>
  );
}
