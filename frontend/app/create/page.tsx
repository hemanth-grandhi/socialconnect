"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { apiRequest, ApiError } from "@/lib/http";

export default function CreatePostPage() {
  const router = useRouter();
  const [content, setContent] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string>("");

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setMessage("");
    setError("");
    setIsLoading(true);

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("Please log in first.");
        return;
      }

      const maxBytes = 2 * 1024 * 1024;
      if (image && image.size > maxBytes) {
        setError("Image must be 2MB or smaller.");
        return;
      }

      const formData = new FormData();
      formData.append("content", content);

      if (image) formData.append("image", image);

      await apiRequest("/posts", {
        method: "POST",
        body: formData,
        token,
        isFormData: true,
      });

      setMessage("Post created successfully.");
      setContent("");
      setImage(null);
      router.push("/feed");
    } catch (e) {
      setError(e instanceof ApiError ? e.message : "Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50 dark:from-gray-900 dark:via-gray-800 dark:to-purple-900">
      {/* Header */}
      <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg border-b border-purple-100 dark:border-gray-700">
        <div className="max-w-2xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                Create Post
              </h1>
              <p className="text-gray-600 dark:text-gray-300 text-sm">
                Share your thoughts with the world
              </p>
            </div>
            <Link
              href="/feed"
              className="text-gray-600 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-8">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-gray-100 dark:border-gray-700 overflow-hidden">
          <form onSubmit={handleSubmit} className="p-8 space-y-8">
            {/* Content Input */}
            <div>
              <label htmlFor="content" className="block text-lg font-semibold text-gray-900 dark:text-white mb-4">
                What's on your mind?
              </label>
              <div className="relative">
                <textarea
                  id="content"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  maxLength={280}
                  rows={5}
                  required
                  className="w-full px-6 py-4 border border-gray-200 dark:border-gray-600 rounded-2xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 resize-none bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 text-lg leading-relaxed"
                  placeholder="Share your thoughts, ideas, or anything you'd like to express..."
                />
                <div className="absolute bottom-4 right-4 flex items-center space-x-2">
                  <div className={`text-sm font-medium px-2 py-1 rounded-full ${
                    content.length > 250
                      ? 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400'
                      : content.length > 200
                      ? 'bg-yellow-100 text-yellow-600 dark:bg-yellow-900/30 dark:text-yellow-400'
                      : 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400'
                  }`}>
                    {content.length}/280
                  </div>
                </div>
              </div>
            </div>

            {/* Image Upload */}
            <div>
              <label className="block text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Add a photo or video (optional)
              </label>
              <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-2xl p-8 text-center hover:border-purple-400 dark:hover:border-purple-500 transition-all duration-200 bg-gray-50 dark:bg-gray-700/50 hover:bg-purple-50 dark:hover:bg-purple-900/20">
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/gif,video/mp4,video/webm"
                  onChange={(e) => {
                    const file = e.target.files?.[0] || null;
                    setImage(file);
                    setPreviewUrl(file ? URL.createObjectURL(file) : "");
                  }}
                  className="hidden"
                  id="image-upload"
                />
                <label htmlFor="image-upload" className="cursor-pointer">
                  <div className="flex flex-col items-center">
                    <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mb-4 shadow-lg">
                      <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                      </svg>
                    </div>
                    <p className="text-gray-700 dark:text-gray-300 font-semibold text-lg mb-2">
                      Click to add media
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      JPEG, PNG, GIF, MP4, WebM • Max 2MB
                    </p>
                  </div>
                </label>
              </div>
            </div>

            {/* Image Preview */}
            {previewUrl && (
              <div className="relative group">
                <div className="rounded-2xl overflow-hidden shadow-2xl">
                  {image?.type.startsWith('video/') ? (
                    <video
                      src={previewUrl}
                      controls
                      className="w-full max-h-96 object-cover"
                    />
                  ) : (
                    <img
                      src={previewUrl}
                      alt="Preview"
                      className="w-full max-h-96 object-cover hover:scale-105 transition-transform duration-300"
                    />
                  )}
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setImage(null);
                    setPreviewUrl("");
                  }}
                  className="absolute top-4 right-4 bg-red-600 hover:bg-red-700 text-white rounded-full p-2 shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-200 transform hover:scale-110"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
                <div className="absolute bottom-4 left-4 bg-black/50 text-white px-3 py-1 rounded-full text-sm font-medium backdrop-blur-sm">
                  {image?.type.startsWith('video/') ? 'Video' : 'Image'} • {(image?.size || 0) < 1024 * 1024 ? `${Math.round((image?.size || 0) / 1024)} KB` : `${Math.round((image?.size || 0) / (1024 * 1024))} MB`}
                </div>
              </div>
            )}

            {/* Submit Button */}
            <div className="pt-4">
              <button
                type="submit"
                disabled={isLoading || !content.trim()}
                className="w-full bg-gradient-to-r from-purple-600 via-pink-600 to-orange-600 hover:from-purple-700 hover:via-pink-700 hover:to-orange-700 disabled:from-gray-400 disabled:via-gray-400 disabled:to-gray-400 text-white font-bold py-4 px-6 rounded-2xl transition-all duration-300 flex items-center justify-center shadow-xl hover:shadow-2xl transform hover:scale-[1.02] disabled:transform-none disabled:cursor-not-allowed text-lg"
              >
                {isLoading ? (
                  <div className="flex items-center space-x-3">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
                    <span>Creating your post...</span>
                  </div>
                ) : (
                  <div className="flex items-center space-x-3">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                    </svg>
                    <span>Share Post</span>
                  </div>
                )}
              </button>
            </div>
          </form>

          {/* Messages */}
          {message && (
            <div className="mx-8 mb-8 p-4 bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-700 rounded-xl">
              <div className="flex items-center space-x-2">
                <svg className="w-5 h-5 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="text-green-800 dark:text-green-200 text-sm font-medium">{message}</p>
              </div>
            </div>
          )}

          {error && (
            <div className="mx-8 mb-8 p-4 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-700 rounded-xl">
              <div className="flex items-center space-x-2">
                <svg className="w-5 h-5 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="text-red-800 dark:text-red-200 text-sm font-medium">{error}</p>
              </div>
            </div>
          )}
        </div>

        {/* Tips */}
        <div className="mt-8 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-2xl p-6 border border-blue-200 dark:border-blue-800">
          <div className="flex items-start space-x-3">
            <div className="w-10 h-10 bg-blue-500 rounded-xl flex items-center justify-center flex-shrink-0">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Posting Tips</h3>
              <ul className="text-sm text-gray-600 dark:text-gray-300 space-y-1">
                <li>• Share authentic moments and genuine thoughts</li>
                <li>• Use high-quality images that tell a story</li>
                <li>• Engage with your audience through questions</li>
                <li>• Keep posts concise and meaningful</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
