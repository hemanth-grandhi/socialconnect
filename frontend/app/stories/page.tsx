"use client";

import { useEffect, useState } from "react";
import { apiRequest, ApiError } from "@/lib/http";
import { getInitials } from "@/lib/utils";

type Story = {
  id: string;
  content: string;
  imageUrl?: string | null;
  createdAt: string;
  author: {
    id: string;
    username: string;
  };
};

type StoryGroup = {
  author: {
    id: string;
    username: string;
  };
  stories: Story[];
  latestStory: Story;
};

export default function StoriesPage() {
  const [storyGroups, setStoryGroups] = useState<StoryGroup[]>([]);
  const [selectedStoryGroup, setSelectedStoryGroup] = useState<StoryGroup | null>(null);
  const [currentStoryIndex, setCurrentStoryIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadStories();
  }, []);

  async function loadStories() {
    setIsLoading(true);
    setError("");

    try {
      const stories = await apiRequest<Story[]>("/stories");
      // Group stories by author
      const groups: { [key: string]: StoryGroup } = {};

      stories.forEach((story) => {
        const authorId = story.author.id;
        if (!groups[authorId]) {
          groups[authorId] = {
            author: story.author,
            stories: [],
            latestStory: story,
          };
        }
        groups[authorId].stories.push(story);
        if (new Date(story.createdAt) > new Date(groups[authorId].latestStory.createdAt)) {
          groups[authorId].latestStory = story;
        }
      });

      setStoryGroups(Object.values(groups));
    } catch (e) {
      setError(e instanceof ApiError ? e.message : "Failed to load stories");
    } finally {
      setIsLoading(false);
    }
  }

  const openStoryViewer = (storyGroup: StoryGroup) => {
    setSelectedStoryGroup(storyGroup);
    setCurrentStoryIndex(0);
  };

  const closeStoryViewer = () => {
    setSelectedStoryGroup(null);
    setCurrentStoryIndex(0);
  };

  const nextStory = () => {
    if (!selectedStoryGroup) return;
    if (currentStoryIndex < selectedStoryGroup.stories.length - 1) {
      setCurrentStoryIndex(currentStoryIndex + 1);
    } else {
      // Move to next user's stories
      const currentIndex = storyGroups.findIndex(g => g.author.id === selectedStoryGroup.author.id);
      if (currentIndex < storyGroups.length - 1) {
        setSelectedStoryGroup(storyGroups[currentIndex + 1]);
        setCurrentStoryIndex(0);
      } else {
        closeStoryViewer();
      }
    }
  };

  const prevStory = () => {
    if (!selectedStoryGroup) return;
    if (currentStoryIndex > 0) {
      setCurrentStoryIndex(currentStoryIndex - 1);
    } else {
      // Move to previous user's stories
      const currentIndex = storyGroups.findIndex(g => g.author.id === selectedStoryGroup.author.id);
      if (currentIndex > 0) {
        const prevGroup = storyGroups[currentIndex - 1];
        setSelectedStoryGroup(prevGroup);
        setCurrentStoryIndex(prevGroup.stories.length - 1);
      }
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Stories</h1>
        <p className="text-gray-600">See what's happening with your network</p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <p className="text-red-800 text-sm font-medium">{error}</p>
        </div>
      )}

      {isLoading ? (
        <div className="flex space-x-4 overflow-x-auto pb-4">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="flex-shrink-0">
              <div className="w-20 h-20 bg-gray-200 rounded-full animate-pulse"></div>
              <div className="w-16 h-3 bg-gray-200 rounded mt-2 animate-pulse"></div>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex space-x-4 overflow-x-auto pb-4">
          {/* Add Story Button */}
          <div className="flex-shrink-0">
            <div className="relative">
              <div className="w-20 h-20 bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500 rounded-full flex items-center justify-center cursor-pointer hover:scale-105 transition-transform">
                <div className="w-18 h-18 bg-white rounded-full flex items-center justify-center">
                  <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                </div>
              </div>
              <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2">
                <div className="bg-white rounded-full p-1">
                  <div className="w-6 h-6 bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-xs font-bold">+</span>
                  </div>
                </div>
              </div>
            </div>
            <p className="text-xs text-center text-gray-600 mt-2 w-20">Your story</p>
          </div>

          {/* Story Groups */}
          {storyGroups.map((group) => (
            <div
              key={group.author.id}
              className="flex-shrink-0 cursor-pointer"
              onClick={() => openStoryViewer(group)}
            >
              <div className="relative">
                <div className="w-20 h-20 bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500 rounded-full p-0.5">
                  <div className="w-full h-full bg-white rounded-full flex items-center justify-center">
                    <span className="text-purple-600 font-semibold text-lg">
                      {getInitials(group.author.username)}
                    </span>
                  </div>
                </div>
                {group.stories.length > 1 && (
                  <div className="absolute -top-1 -right-1 w-6 h-6 bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-xs font-bold">{group.stories.length}</span>
                  </div>
                )}
              </div>
              <p className="text-xs text-center text-gray-600 mt-2 w-20 truncate">
                {group.author.username}
              </p>
            </div>
          ))}
        </div>
      )}

      {/* Story Viewer Modal */}
      {selectedStoryGroup && (
        <div className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center">
          <div className="relative w-full h-full max-w-md mx-auto">
            {/* Story Header */}
            <div className="absolute top-0 left-0 right-0 z-10 p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500 rounded-full flex items-center justify-center">
                    <span className="text-white font-semibold text-sm">
                      {getInitials(selectedStoryGroup.author.username)}
                    </span>
                  </div>
                  <span className="text-white font-semibold">
                    {selectedStoryGroup.author.username}
                  </span>
                  <span className="text-white/70 text-sm">
                    {new Date(selectedStoryGroup.stories[currentStoryIndex].createdAt).toLocaleTimeString()}
                  </span>
                </div>
                <button
                  onClick={closeStoryViewer}
                  className="text-white hover:text-gray-300"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Progress Bars */}
              <div className="flex space-x-1 mt-4">
                {selectedStoryGroup.stories.map((_, index) => (
                  <div
                    key={index}
                    className="flex-1 h-0.5 bg-white/30 rounded-full overflow-hidden"
                  >
                    <div
                      className={`h-full bg-white transition-all duration-200 ${
                        index < currentStoryIndex ? 'w-full' :
                        index === currentStoryIndex ? 'w-1/2' : 'w-0'
                      }`}
                    ></div>
                  </div>
                ))}
              </div>
            </div>

            {/* Story Content */}
            <div className="w-full h-full flex items-center justify-center">
              {selectedStoryGroup.stories[currentStoryIndex].imageUrl ? (
                <img
                  src={selectedStoryGroup.stories[currentStoryIndex].imageUrl}
                  alt="Story"
                  className="max-w-full max-h-full object-contain"
                />
              ) : (
                <div className="text-white text-center p-8">
                  <p className="text-xl">{selectedStoryGroup.stories[currentStoryIndex].content}</p>
                </div>
              )}
            </div>

            {/* Navigation Areas */}
            <div
              className="absolute left-0 top-0 w-1/2 h-full cursor-pointer"
              onClick={prevStory}
            ></div>
            <div
              className="absolute right-0 top-0 w-1/2 h-full cursor-pointer"
              onClick={nextStory}
            ></div>
          </div>
        </div>
      )}
    </div>
  );
}