"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getInitials } from "@/lib/utils";
import { apiUrl, imageUrl } from "@/lib/api";
import { apiRequest, ApiError } from "@/lib/http";

type Post = {
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

type Comment = {
  id: string;
  content: string;
  user: {
    username: string;
  };
};

export default function FeedPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [skip, setSkip] = useState(0);
  const limit = 5;
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [hasMore, setHasMore] = useState(false);
  const [commentsByPost, setCommentsByPost] = useState<Record<string, Comment[]>>({});
  const [commentInputByPost, setCommentInputByPost] = useState<Record<string, string>>({});
  const [sharedPostId, setSharedPostId] = useState<string | null>(null);

  async function loadFeed(nextSkip = 0) {
    const token = localStorage.getItem("token");
    setIsLoading(true);
    setError("");

    try {
      const response = await fetch(
        `${apiUrl("/feed")}?limit=${limit}&skip=${nextSkip}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const payload = await response.json();
      if (!response.ok) {
        throw new ApiError(payload.error || "Failed to load feed.", response.status);
      }
      const data = payload.data as Post[];

      setPosts(data);
      setSkip(nextSkip);
      setHasMore(Boolean(payload.meta?.pagination?.hasMore));
      setMessage(data.length === 0 ? "No posts yet." : "");
    } catch (e) {
      setError(e instanceof ApiError ? e.message : "Something went wrong. Please try again.");
      setPosts([]);
    } finally {
      setIsLoading(false);
    }
  }

  async function toggleLike(postId: string) {
    const token = localStorage.getItem("token");
    try {
      await apiRequest(`/posts/${postId}/like`, {
        method: "POST",
        token,
      });
    } catch (e) {
      if (e instanceof ApiError && e.status === 409) {
        await apiRequest(`/posts/${postId}/like`, {
          method: "DELETE",
          token,
        });
      } else {
        setError(e instanceof ApiError ? e.message : "Unable to update like.");
        return;
      }
    }
    await loadFeed(skip);
  }

  async function loadComments(postId: string) {
    try {
      const payload = await apiRequest<Comment[]>(`/posts/${postId}/comments`);
      setCommentsByPost((prev) => ({ ...prev, [postId]: payload }));
    } catch (e) {
      setError(e instanceof ApiError ? e.message : "Unable to load comments.");
    }
  }

  async function addComment(postId: string) {
    const content = (commentInputByPost[postId] || "").trim();
    if (!content) return;
    const token = localStorage.getItem("token");

    try {
      await apiRequest(`/posts/${postId}/comments`, {
        method: "POST",
        token,
        body: { content },
      });
      setCommentInputByPost((prev) => ({ ...prev, [postId]: "" }));
      await loadComments(postId);
      await loadFeed(skip);
    } catch (e) {
      setError(e instanceof ApiError ? e.message : "Unable to add comment.");
    }
  }

  useEffect(() => {
    loadFeed();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-purple-900">
      {/* Header */}
      <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg border-b border-purple-100 dark:border-gray-700 sticky top-0 z-40">
        <div className="max-w-2xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                Home Feed
              </h1>
              <p className="text-gray-600 dark:text-gray-300 text-sm">
                Discover fresh posts from your network
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-xs text-gray-500 dark:text-gray-400">Live</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-6">
        {isLoading && posts.length === 0 && (
          <div className="space-y-6">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 p-6 animate-pulse">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-purple-100 to-pink-100 dark:from-purple-900/30 dark:to-pink-900/30 rounded-full"></div>
                  <div className="flex-1">
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-24 mb-2"></div>
                    <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-16"></div>
                  </div>
                </div>
                <div className="space-y-2 mb-4">
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
                </div>
                <div className="w-full h-64 bg-gray-200 dark:bg-gray-700 rounded-xl"></div>
              </div>
            ))}
          </div>
        )}

        {error && (
          <div className="bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-700 rounded-xl p-4 mb-6">
            <div className="flex items-center space-x-2">
              <svg className="w-5 h-5 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-red-800 dark:text-red-200 text-sm font-medium">{error}</p>
            </div>
          </div>
        )}

        <div className="space-y-6">
          {posts.map((post, index) => (
            <div
              key={post.id}
              className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-xl border border-gray-100 dark:border-gray-700 overflow-hidden transition-all duration-300 transform hover:-translate-y-1 animate-in slide-in-from-bottom-4"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              {/* Post Header */}
              <div className="p-6 pb-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500 rounded-full flex items-center justify-center shadow-lg">
                      <span className="text-white font-semibold text-sm">{getInitials(post.author.username)}</span>
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900 dark:text-white">{post.author.username}</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">{new Date(post.createdAt).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gradient-to-r from-green-100 to-emerald-100 dark:from-green-900/30 dark:to-emerald-900/30 text-green-800 dark:text-green-200 border border-green-200 dark:border-green-700">
                      <div className="w-1.5 h-1.5 bg-green-500 rounded-full mr-1.5"></div>
                      Public
                    </span>
                  </div>
                </div>
              </div>

              {/* Post Content */}
              <div className="px-6 pb-4">
                <p className="text-gray-900 dark:text-white mb-4 leading-relaxed">{post.content}</p>
                {post.imageUrl && (
                  <div className="rounded-xl overflow-hidden shadow-lg">
                    {imageUrl(post.imageUrl).match(/\.(mp4|webm|ogg)$/i) ? (
                      <video className="w-full max-h-96 object-cover" controls>
                        <source src={imageUrl(post.imageUrl)} />
                      </video>
                    ) : (
                      <img
                        src={imageUrl(post.imageUrl)}
                        alt="Post content"
                        className="w-full max-h-96 object-cover hover:scale-105 transition-transform duration-300"
                      />
                    )}
                  </div>
                )}
              </div>

              {/* Post Stats */}
              <div className="px-6 pb-4">
                <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
                  <div className="flex items-center space-x-1">
                    <svg className="w-4 h-4 text-pink-500" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                    </svg>
                    <span>{post.likeCount} likes</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <svg className="w-4 h-4 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                    <span>{post.commentCount} comments</span>
                  </div>
                </div>
              </div>

              {/* Post Actions */}
              <div className="px-6 pb-4 border-t border-gray-100 dark:border-gray-700">
                <div className="flex items-center justify-between pt-4">
                  <button
                    onClick={() => toggleLike(post.id)}
                    disabled={isLoading}
                    className="flex items-center space-x-2 text-gray-600 dark:text-gray-300 hover:text-pink-600 dark:hover:text-pink-400 transition-colors duration-200 px-3 py-2 rounded-lg hover:bg-pink-50 dark:hover:bg-pink-900/20"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                    <span className="font-medium">Like</span>
                  </button>
                  <button
                    onClick={() => loadComments(post.id)}
                    className="flex items-center space-x-2 text-gray-600 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400 transition-colors duration-200 px-3 py-2 rounded-lg hover:bg-purple-50 dark:hover:bg-purple-900/20"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                    <span className="font-medium">Comment</span>
                  </button>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(`${window.location.origin}/feed#${post.id}`);
                      setSharedPostId(post.id);
                    }}
                    className="flex items-center space-x-2 text-gray-600 dark:text-gray-300 hover:text-orange-600 dark:hover:text-orange-400 transition-colors duration-200 px-3 py-2 rounded-lg hover:bg-orange-50 dark:hover:bg-orange-900/20"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
                    </svg>
                    <span className="font-medium">Share</span>
                  </button>
                </div>
              </div>

              {sharedPostId === post.id && (
                <div className="px-6 pb-4">
                  <div className="bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-700 rounded-xl p-3">
                    <div className="flex items-center space-x-2">
                      <svg className="w-5 h-5 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <p className="text-green-800 dark:text-green-200 text-sm font-medium">Link copied to clipboard!</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Comments Section */}
              {(commentsByPost[post.id] || []).length > 0 && (
                <div className="px-6 pb-4 border-t border-gray-100 dark:border-gray-700">
                  <div className="space-y-3 pt-4">
                    {(commentsByPost[post.id] || []).map((comment) => (
                      <div key={comment.id} className="flex items-start space-x-3">
                        <div className="w-8 h-8 bg-gradient-to-r from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-600 rounded-full flex items-center justify-center">
                          <span className="text-gray-600 dark:text-gray-300 font-semibold text-xs">{getInitials(comment.user.username)}</span>
                        </div>
                        <div className="flex-1 bg-gray-50 dark:bg-gray-700 rounded-xl px-4 py-3">
                          <p className="text-sm font-semibold text-gray-900 dark:text-white">{comment.user.username}</p>
                          <p className="text-sm text-gray-700 dark:text-gray-300">{comment.content}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Add Comment */}
              <div className="px-6 pb-6">
                <div className="flex space-x-3">
                  <input
                    type="text"
                    placeholder="Write a comment..."
                    value={commentInputByPost[post.id] || ""}
                    onChange={(e) =>
                      setCommentInputByPost((prev) => ({ ...prev, [post.id]: e.target.value }))
                    }
                    onKeyPress={(e) => e.key === 'Enter' && addComment(post.id)}
                    className="flex-1 px-4 py-3 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                  />
                  <button
                    onClick={() => addComment(post.id)}
                    disabled={!commentInputByPost[post.id]?.trim()}
                    className="px-6 py-3 bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500 hover:from-purple-600 hover:via-pink-600 hover:to-orange-600 disabled:from-gray-400 disabled:via-gray-400 disabled:to-gray-400 text-white rounded-xl hover:shadow-lg disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-105 disabled:transform-none font-medium"
                  >
                    Post
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Load More */}
        {posts.length > 0 && (
          <div className="flex justify-center space-x-4 mt-8">
            <button
              disabled={skip === 0 || isLoading}
              onClick={() => loadFeed(Math.max(0, skip - limit))}
              className="px-6 py-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-xl text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 font-medium"
            >
              Previous
            </button>
            <button
              disabled={!hasMore || isLoading}
              onClick={() => loadFeed(skip + limit)}
              className="px-6 py-3 bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500 hover:from-purple-600 hover:via-pink-600 hover:to-orange-600 disabled:from-gray-400 disabled:via-gray-400 disabled:to-gray-400 text-white rounded-xl hover:shadow-lg disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-105 disabled:transform-none font-medium"
            >
              Next
            </button>
          </div>
        )}

        {posts.length === 0 && !isLoading && (
          <div className="text-center py-16">
            <div className="w-24 h-24 bg-gradient-to-r from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-12 h-12 text-gray-400 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">No posts yet</h3>
            <p className="text-gray-500 dark:text-gray-400 mb-6">Be the first to share something with your network!</p>
            <Link
              href="/create"
              className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white rounded-xl font-medium transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Create Your First Post
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
