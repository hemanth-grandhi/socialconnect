"use client";

import { useEffect, useState } from "react";
import { apiRequest, ApiError } from "@/lib/http";
import { imageUrl } from "@/lib/api";

type ExplorePost = {
  id: string;
  content: string;
  imageUrl?: string | null;
  createdAt: string;
  likeCount: number;
  commentCount: number;
  author: {
    id: string;
    username: string;
  };
};

export default function ExplorePage() {
  const [posts, setPosts] = useState<ExplorePost[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedPost, setSelectedPost] = useState<ExplorePost | null>(null);

  useEffect(() => {
    loadExplorePosts();
  }, []);

  async function loadExplorePosts() {
    setIsLoading(true);
    setError("");

    try {
      const data = await apiRequest<ExplorePost[]>("/posts/explore?limit=50");
      setPosts(data);
    } catch (e) {
      setError(e instanceof ApiError ? e.message : "Failed to load explore posts");
    } finally {
      setIsLoading(false);
    }
  }

  const openPostModal = (post: ExplorePost) => {
    setSelectedPost(post);
  };

  const closePostModal = () => {
    setSelectedPost(null);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Explore</h1>
        <p className="text-gray-600">Discover new posts and connect with creators</p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <p className="text-red-800 text-sm font-medium">{error}</p>
        </div>
      )}

      {isLoading ? (
        <div className="grid grid-cols-3 gap-1 md:gap-4">
          {[...Array(12)].map((_, i) => (
            <div key={i} className="aspect-square bg-gray-200 animate-pulse rounded-lg"></div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-3 gap-1 md:gap-4">
          {posts.map((post, index) => (
            <div
              key={post.id}
              className={`relative group cursor-pointer overflow-hidden rounded-lg ${
                index % 7 === 0 ? 'row-span-2' : ''
              }`}
              onClick={() => openPostModal(post)}
            >
              {post.imageUrl ? (
                <>
                  <img
                    src={imageUrl(post.imageUrl)}
                    alt="Post"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-opacity duration-200 flex items-center justify-center">
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center space-x-4 text-white">
                      <div className="flex items-center space-x-1">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                        </svg>
                        <span className="font-semibold">{post.likeCount}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                        </svg>
                        <span className="font-semibold">{post.commentCount}</span>
                      </div>
                    </div>
                  </div>
                </>
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-purple-100 via-pink-100 to-orange-100 flex items-center justify-center p-4">
                  <p className="text-purple-600 text-sm text-center line-clamp-4">
                    {post.content}
                  </p>
                </div>
              )}

              {/* Multiple images indicator */}
              {index % 5 === 0 && (
                <div className="absolute top-2 right-2 bg-black bg-opacity-60 rounded-full p-1">
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                  </svg>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Post Modal */}
      {selectedPost && (
        <div className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
            <div className="flex">
              {/* Image/Video Section */}
              <div className="w-1/2 bg-black flex items-center justify-center">
                {selectedPost.imageUrl ? (
                  selectedPost.imageUrl.match(/\.(mp4|webm|ogg)$/i) ? (
                    <video className="max-w-full max-h-full object-contain" controls>
                      <source src={imageUrl(selectedPost.imageUrl)} />
                    </video>
                  ) : (
                    <img
                      src={imageUrl(selectedPost.imageUrl)}
                      alt="Post"
                      className="max-w-full max-h-full object-contain"
                    />
                  )
                ) : (
                  <div className="text-white text-center p-8">
                    <p className="text-xl">{selectedPost.content}</p>
                  </div>
                )}
              </div>

              {/* Content Section */}
              <div className="w-1/2 flex flex-col">
                {/* Header */}
                <div className="p-4 border-b border-gray-200 flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-gradient-to-r from-purple-100 via-pink-100 to-orange-100 rounded-full flex items-center justify-center">
                      <span className="text-purple-600 font-semibold text-sm">
                        {selectedPost.author.username.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <span className="font-semibold text-gray-900">
                      {selectedPost.author.username}
                    </span>
                  </div>
                  <button
                    onClick={closePostModal}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                {/* Content */}
                <div className="flex-1 p-4 overflow-y-auto">
                  <p className="text-gray-900 mb-4">{selectedPost.content}</p>

                  {/* Stats */}
                  <div className="flex items-center space-x-4 text-sm text-gray-500 mb-4">
                    <span>{selectedPost.likeCount} likes</span>
                    <span>{selectedPost.commentCount} comments</span>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center space-x-4 mb-4">
                    <button className="flex items-center space-x-2 text-gray-600 hover:text-pink-600 transition-colors">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                      </svg>
                      <span>Like</span>
                    </button>
                    <button className="flex items-center space-x-2 text-gray-600 hover:text-purple-600 transition-colors">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                      </svg>
                      <span>Comment</span>
                    </button>
                    <button className="flex items-center space-x-2 text-gray-600 hover:text-orange-600 transition-colors">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
                      </svg>
                      <span>Share</span>
                    </button>
                  </div>

                  {/* Comments Section */}
                  <div className="space-y-3">
                    <h4 className="font-semibold text-gray-900">Comments</h4>
                    <div className="space-y-3">
                      {[...Array(3)].map((_, i) => (
                        <div key={i} className="flex items-start space-x-3">
                          <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                            <span className="text-gray-600 font-semibold text-xs">U{i+1}</span>
                          </div>
                          <div className="flex-1">
                            <p className="text-sm">
                              <span className="font-semibold">user{i+1}</span> This is a sample comment on this amazing post!
                            </p>
                            <p className="text-xs text-gray-500 mt-1">2h ago</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Add Comment */}
                <div className="p-4 border-t border-gray-200">
                  <div className="flex space-x-3">
                    <input
                      type="text"
                      placeholder="Add a comment..."
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors text-sm"
                    />
                    <button className="px-4 py-2 bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500 text-white rounded-lg hover:shadow-lg transition-all duration-200 text-sm">
                      Post
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}