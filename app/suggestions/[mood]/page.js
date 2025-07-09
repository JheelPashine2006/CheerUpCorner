// app/suggestions/[mood]/page.js

"use client"; // Because we need useState and client-side interactivity

import { useState, useEffect } from "react";
import { suggestions } from "@/utils/suggestions";
import Link from "next/link";
import { useAuth } from "@/utils/AuthProvider";

export default function SuggestionPage({ params }) {
  const { mood } = params;
  const { user, supabase, loading } = useAuth();

  const [currentSuggestion, setCurrentSuggestion] = useState("");
  const [storyText, setStoryText] = useState("");
  const [stories, setStories] = useState([]);
  const [saving, setSaving] = useState(false);
  const [fetching, setFetching] = useState(false);
  const [expandedStoryId, setExpandedStoryId] = useState(null);
  const [title, setTitle] = useState("");
  const [editStoryId, setEditStoryId] = useState(null);
  const [editTitle, setEditTitle] = useState("");
  const [editText, setEditText] = useState("");
  const [showStoriesModal, setShowStoriesModal] = useState(false);
  const [showSavedPopup, setShowSavedPopup] = useState(false);

  // Mood-specific gradient backgrounds for the main container
  const moodGradients = {
    happy: "bg-gradient-to-br from-yellow-200 via-yellow-100 to-yellow-300 text-yellow-900",
    sad: "bg-gradient-to-br from-blue-200 via-blue-100 to-blue-300 text-blue-900",
    romantic: "bg-gradient-to-br from-purple-200 via-purple-100 to-purple-300 text-purple-900",
    angry: "bg-gradient-to-br from-red-300 via-red-200 to-red-400 text-red-900",
    calm: "bg-gradient-to-br from-green-200 via-green-100 to-green-300 text-green-900",
    excited: "bg-gradient-to-br from-purple-200 via-purple-100 to-purple-300 text-purple-900",
  };

  // Mood emojis
  const moodEmojis = {
    happy: "😊",
    sad: "😢",
    romantic: "😍",
    angry: "😤",
    calm: "😌",
    excited: "🤩",
  };

  useEffect(() => {
    getRandomSuggestion();
  }, [mood]);

  // Fetch stories for this user and mood
  useEffect(() => {
    if (user) {
      setFetching(true);
      supabase
        .from("stories")
        .select("id, title, story_text, created_at")
        .eq("user_id", user.id)
        .eq("mood", mood)
        .order("created_at", { ascending: false })
        .then(({ data, error }) => {
          if (!error) setStories(data);
          setFetching(false);
        });
    } else {
      setStories([]);
    }
  }, [user, mood]);

  // Save a new story
  const handleSaveStory = async (e) => {
    e.preventDefault();
    if (!title.trim() || !storyText.trim()) return;
    setSaving(true);
    const { error } = await supabase.from("stories").insert([
      { user_id: user.id, mood, title, story_text: storyText }
    ]);
    if (!error) {
      setTitle("");
      setStoryText("");
      setShowSavedPopup(true);
      setTimeout(() => setShowSavedPopup(false), 2000);
      // Refetch stories
      supabase
        .from("stories")
        .select("id, title, story_text, created_at")
        .eq("user_id", user.id)
        .eq("mood", mood)
        .order("created_at", { ascending: false })
        .then(({ data }) => setStories(data));
    }
    setSaving(false);
  };

  // Delete a story
  const handleDeleteStory = async (id) => {
    if (!window.confirm("Are you sure you want to delete this story?")) return;
    await supabase.from("stories").delete().eq("id", id);
    setStories(stories.filter(s => s.id !== id));
    if (expandedStoryId === id) setExpandedStoryId(null);
  };

  // Start editing a story
  const handleEditStory = (story) => {
    setEditStoryId(story.id);
    setEditTitle(story.title);
    setEditText(story.story_text);
  };

  // Save edited story
  const handleSaveEdit = async (id) => {
    if (!editTitle.trim() || !editText.trim()) return;
    await supabase.from("stories").update({ title: editTitle, story_text: editText }).eq("id", id);
    setStories(stories.map(s => s.id === id ? { ...s, title: editTitle, story_text: editText } : s));
    setEditStoryId(null);
  };

  // Cancel editing
  const handleCancelEdit = () => {
    setEditStoryId(null);
  };

  const getRandomSuggestion = () => {
    const moodSuggestions = suggestions[mood] || [];
    if (moodSuggestions.length > 0) {
      const randomIndex = Math.floor(Math.random() * moodSuggestions.length);
      setCurrentSuggestion(moodSuggestions[randomIndex]);
    } else {
      setCurrentSuggestion("No suggestions found for this mood.");
    }
  };

  return (
    <main
      className={`min-h-screen flex flex-col items-center justify-center p-8 relative overflow-hidden ${moodGradients[mood] || "bg-gradient-to-br from-gray-200 via-gray-100 to-gray-300 text-gray-800"}`}
    >
      {/* Decorative floating elements */}
      <div className="absolute top-20 left-10 w-20 h-20 rounded-full opacity-20 animate-bounce" style={{ animationDelay: '0s' }}></div>
      <div className="absolute top-40 right-20 w-16 h-16 rounded-full opacity-30 animate-bounce" style={{ animationDelay: '1s' }}></div>
      <div className="absolute bottom-40 left-20 w-12 h-12 rounded-full opacity-25 animate-bounce" style={{ animationDelay: '2s' }}></div>
      <div className="absolute bottom-20 right-10 w-24 h-24 rounded-full opacity-20 animate-bounce" style={{ animationDelay: '0.5s' }}></div>

      {/* Main content container */}
      <div className="relative z-10 bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-2xl border border-white/20 max-w-2xl w-full">
        {/* Story Saved Popup */}
        {showSavedPopup && (
          <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-gradient-to-r from-blue-400 to-yellow-400 text-white font-bold px-8 py-4 rounded-full shadow-lg text-lg z-50 animate-fade-in">
            Story saved! <button className="underline ml-2" onClick={() => setShowStoriesModal(true)}>View your stories</button>
          </div>
        )}
        {/* View All My Stories Button */}
        {user && (
          <div className="flex justify-end mb-4">
            <button
              className="flex items-center gap-2 px-6 py-2 bg-gradient-to-r from-purple-400 via-blue-400 to-yellow-400 text-white font-bold rounded-full shadow hover:scale-105 transition-all duration-200"
              onClick={() => setShowStoriesModal(true)}
            >
              <span className="text-lg">📚</span> View All My Stories
            </button>
          </div>
        )}
        {/* Header with emoji */}
        <div className="text-center mb-12 relative z-20">
          {/* Decorative background elements */}
          <div className="absolute inset-0 bg-gradient-to-r from-blue-100/50 via-yellow-100/50 to-purple-100/50 rounded-2xl blur-sm"></div>
          <div className="absolute -top-2 -left-2 w-8 h-8 bg-gradient-to-r from-blue-400 to-yellow-400 rounded-full opacity-60 animate-pulse"></div>
          <div className="absolute -top-1 -right-1 w-6 h-6 bg-gradient-to-r from-yellow-400 to-purple-400 rounded-full opacity-60 animate-pulse" style={{ animationDelay: '0.5s' }}></div>
          <div className="absolute -bottom-1 left-1/4 w-4 h-4 bg-gradient-to-r from-purple-400 to-blue-400 rounded-full opacity-60 animate-pulse" style={{ animationDelay: '1s' }}></div>
          
          {/* Main content */}
          <div className="relative z-10 p-6">
            <div className="text-8xl mb-6 animate-bounce drop-shadow-lg">
              {moodEmojis[mood] || "💭"}
            </div>
            <h1 className="text-4xl mb-4 font-extrabold capitalize bg-gradient-to-r from-purple-600 via-blue-600 to-yellow-600 bg-clip-text text-transparent drop-shadow-lg tracking-wide">
              Your {mood} thought
            </h1>
            <div className="flex items-center justify-center gap-4 mb-4">
              <div className="w-20 h-1 bg-gradient-to-r from-purple-400 to-blue-400 rounded-full shadow-lg"></div>
              <div className="w-6 h-6 bg-gradient-to-r from-blue-400 to-yellow-400 rounded-full animate-pulse shadow-lg"></div>
              <div className="w-20 h-1 bg-gradient-to-r from-yellow-400 to-purple-400 rounded-full shadow-lg"></div>
            </div>
            <p className="text-xl text-gray-600 font-semibold">Share your feelings and memories</p>
          </div>
        </div>

        {/* Suggestion display */}
        <div className="relative flex flex-col items-center justify-center mb-8">
        
          <div className="bg-white/70 backdrop-blur-lg rounded-3xl p-8 pt-10 shadow-2xl border-4 border-transparent bg-clip-padding border-gradient-to-r from-blue-400 to-yellow-400">
            <p className="text-2xl text-center leading-relaxed font-semibold text-gray-800">
              "{currentSuggestion}"
            </p>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex flex-col items-center gap-4">
          <button
            onClick={getRandomSuggestion}
            className="px-8 py-4 bg-gradient-to-r from-yellow-400 via-blue-400 to-purple-400 text-white font-bold rounded-2xl shadow-xl transform transition-all duration-300 hover:scale-105 hover:shadow-2xl focus:outline-none focus:ring-4 focus:ring-blue-300/50"
          >
             Show Another one!
          </button>
        </div>

        {/* User Stories Section */}
        <div className="mt-10 relative">
          {/* Decorative background for stories section */}
          <div className="absolute inset-0 bg-gradient-to-r from-blue-50/80 via-yellow-50/80 to-purple-50/80 rounded-2xl blur-sm"></div>
          
          <div className="relative z-10">
            {/* Enhanced section header */}
            <div className="text-center mb-6">
              <div className="flex items-center justify-center gap-3 mb-3">
                <div className="w-8 h-1 bg-gradient-to-r from-blue-400 to-yellow-400 rounded-full"></div>
                <span className="text-2xl">📝</span>
                <div className="w-8 h-1 bg-gradient-to-r from-yellow-400 to-purple-400 rounded-full"></div>
              </div>
              <h2 className="text-3xl font-bold mb-2 bg-gradient-to-r from-purple-600 via-blue-600 to-yellow-600 bg-clip-text text-transparent">
                Your {mood} Stories
              </h2>
              <p className="text-gray-600 font-medium">Capture your thoughts and memories</p>
            </div>
            
            {loading ? (
              <div className="text-center text-gray-500 py-8">
                <div className="text-2xl mb-2">⏳</div>
                Loading your stories...
              </div>
            ) : user ? (
              <>
                <form onSubmit={handleSaveStory} className="flex flex-col gap-3 mb-8">
                  <div className="bg-white/90 rounded-xl shadow-lg border border-blue-200 p-6 flex flex-col gap-3">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-lg">✍️</span>
                      <span className="font-semibold text-gray-700">Write Your Story</span>
                    </div>
                    <input
                      className="w-full p-3 rounded-lg bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-300 text-gray-800 font-semibold border border-gray-200"
                      placeholder="Story Title"
                      value={title}
                      onChange={e => setTitle(e.target.value)}
                      maxLength={100}
                      disabled={saving}
                      required
                    />
                    <textarea
                      className="w-full p-4 rounded-lg bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-300 min-h-[100px] resize-none text-gray-800 border border-gray-200"
                      placeholder={`Write your ${mood} story...`}
                      value={storyText}
                      onChange={e => setStoryText(e.target.value)}
                      disabled={saving}
                      required
                    />
                  </div>
                  <button
                    type="submit"
                    className="self-end px-8 py-3 bg-gradient-to-r from-blue-400 to-yellow-400 text-white font-bold rounded-xl shadow-lg hover:scale-105 transition-all duration-200 flex items-center gap-2"
                    disabled={saving}
                  >
                    {saving ? (
                      <>
                        <span className="animate-spin">⏳</span>
                        Saving...
                      </>
                    ) : (
                      <>
                        <span>💾</span>
                        Save Story
                      </>
                    )}
                  </button>
                </form>
              </>
            ) : (
              <div className="text-center py-8">
                <div className="text-4xl mb-4">🔐</div>
                <div className="text-blue-500 font-semibold text-lg">Log in to save and view your stories!</div>
                <p className="text-gray-500 mt-2">Create an account to start sharing your thoughts</p>
              </div>
            )}
          </div>
        </div>

        {/* Attractive Back to moods button at the end */}
        <div className="flex justify-center mt-12">
          <Link href="/">
            <button className="flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-purple-400 via-blue-400 to-yellow-400 text-white font-bold rounded-full shadow-lg text-lg hover:scale-105 hover:shadow-2xl transition-all duration-200">
              <span className="text-2xl">←</span>
              Back to moods
            </button>
          </Link>
        </div>
      </div>

      {/* Bottom decorative wave */}
      <div className="absolute bottom-0 left-0 w-full h-20 bg-gradient-to-t from-white/20 to-transparent"></div>

      {/* Stories Modal */}
      {showStoriesModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="bg-white/95 backdrop-blur-md rounded-3xl shadow-2xl p-8 w-full max-w-2xl relative border border-white/20">
            <button
              className="absolute top-4 right-4 text-3xl text-gray-400 hover:text-blue-500 font-bold transition-colors duration-200"
              onClick={() => setShowStoriesModal(false)}
              aria-label="Close"
            >
              ×
            </button>
            <h2 className="text-3xl font-bold mb-6 text-center bg-gradient-to-r from-purple-600 via-blue-600 to-yellow-600 bg-clip-text text-transparent">
              All Your {mood} Stories
            </h2>
            {loading || fetching ? (
              <div className="text-center text-gray-500 py-8">
                <div className="text-2xl mb-2">⏳</div>
                Loading your stories...
              </div>
            ) : stories.length === 0 ? (
              <div className="text-center text-gray-400 py-8">
                <div className="text-4xl mb-4">📝</div>
                <div className="text-lg font-medium">No stories yet. Start by writing one!</div>
              </div>
            ) : (
              <ul className="space-y-4 max-h-96 overflow-y-auto">
                {stories.map(story => {
                  const isExpanded = expandedStoryId === story.id;
                  const isEditing = editStoryId === story.id;
                  return (
                    <li
                      key={story.id}
                      className={`bg-white/80 backdrop-blur-sm rounded-xl p-4 shadow-lg border border-blue-200/50 cursor-pointer transition-all duration-200 hover:shadow-xl ${isExpanded ? 'ring-2 ring-blue-300 shadow-xl' : ''}`}
                      onClick={() => !isEditing && setExpandedStoryId(isExpanded ? null : story.id)}
                    >
                      {isEditing ? (
                        <div className="flex flex-col gap-3">
                          <input
                            className="w-full p-3 rounded-lg bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-300 text-gray-800 font-semibold border border-gray-200"
                            value={editTitle}
                            onChange={e => setEditTitle(e.target.value)}
                            maxLength={100}
                            required
                          />
                          <textarea
                            className="w-full p-3 rounded-lg bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-300 min-h-[80px] resize-none text-gray-800 border border-gray-200"
                            value={editText}
                            onChange={e => setEditText(e.target.value)}
                            required
                          />
                          <div className="flex gap-3 justify-end mt-2">
                            <button
                              className="px-6 py-2 bg-gradient-to-r from-yellow-400 to-blue-400 text-white font-bold rounded-lg shadow hover:scale-105 transition-all duration-200"
                              onClick={e => { e.stopPropagation(); handleSaveEdit(story.id); }}
                            >
                              Save
                            </button>
                            <button
                              className="px-6 py-2 bg-gray-200 text-gray-700 font-bold rounded-lg shadow hover:scale-105 transition-all duration-200"
                              onClick={e => { e.stopPropagation(); handleCancelEdit(); }}
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      ) : (
                        <>
                          <div className="flex items-center justify-between">
                            <div className="font-bold text-lg text-blue-600 truncate max-w-xs" title={story.title}>{story.title}</div>
                            <div className="flex gap-3">
                              <button
                                className="text-sm text-blue-600 underline hover:text-blue-800 font-medium"
                                onClick={e => { e.stopPropagation(); handleEditStory(story); }}
                              >
                                Edit
                              </button>
                              <button
                                className="text-sm text-red-600 underline hover:text-red-800 font-medium"
                                onClick={e => { e.stopPropagation(); handleDeleteStory(story.id); }}
                              >
                                Delete
                              </button>
                            </div>
                          </div>
                          {isExpanded && (
                            <div className="text-gray-700 whitespace-pre-line mt-3 p-3 bg-gray-50 rounded-lg">
                              {story.story_text}
                            </div>
                          )}
                          <div className="text-xs text-right text-gray-400 mt-2">{new Date(story.created_at).toLocaleString()}</div>
                          <div className="text-xs text-blue-500 mt-1 text-right font-medium">{isExpanded ? 'Click to collapse' : 'Click to expand'}</div>
                        </>
                      )}
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        </div>
      )}
    </main>
  );
}
