// src/components/video/CommentSection.jsx
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  createComment,
  getCommentsByVideo,
  updateComment,
  deleteComment,
  toggleLikeComment,
} from "../../store/slices/commentSlice";
import { formatDistanceToNow } from "date-fns";
import { ThumbsUp, Trash2, Edit, Send } from "lucide-react";
import { useToast } from "../ui/ToastContainer";

const CommentSection = ({ videoId }) => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { commentsByVideo, loading, error } = useSelector(
    (state) => state.comments,
  );
  const { showToast } = useToast();

  const comments = commentsByVideo[videoId] || [];

  const [newComment, setNewComment] = useState("");
  const [editingCommentId, setEditingCommentId] = useState(null);
  const [editContent, setEditContent] = useState("");

  // Fetch comments when component mounts or videoId changes
  useEffect(() => {
    if (videoId) {
      dispatch(getCommentsByVideo(videoId));
    }
  }, [dispatch, videoId]);

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    try {
      await dispatch(createComment({ videoId, content: newComment })).unwrap();
      setNewComment("");
      showToast("Comment posted successfully!", "success");
      // Refresh comments after posting
      dispatch(getCommentsByVideo(videoId));
    } catch (err) {
      showToast("Failed to post comment", "error");
    }
  };

  // const handleEditComment = (comment) => {
  //   setEditingCommentId(comment._id);
  //   setEditContent(comment.content);
  // };

  // const handleSaveEdit = async (commentId) => {
  //   console.log("SAVE EDIT clicked - Comment ID being sent:", commentId);
  //   if (!editContent.trim()) return;

  //   try {
  //     const result = await dispatch(
  //       updateComment({ commentId, content: editContent }),
  //     ).unwrap();
  //     console.log("Update SUCCESS:", result);
  //     setEditingCommentId(null);
  //     setEditContent("");
  //     showToast("Comment updated!", "success");
  //   } catch (err) {
  //     console.error("UPDATE FAILED:", {
  //       message: err.message,
  //       status: err.status,
  //       commentIdSent: commentId,
  //     });
  //     showToast(err.message || "Failed to update comment", "error");
  //   }
  // };

  const handleDeleteComment = async (commentId) => {
    console.log("DELETE clicked - Comment ID being sent:", commentId);
    if (!window.confirm("Delete this comment?")) return;

    try {
      const result = await dispatch(deleteComment(commentId)).unwrap();
      console.log("Delete SUCCESS:", result);
      showToast("Comment deleted", "success");
    } catch (err) {
      console.error("DELETE FAILED:", {
        message: err.message,
        status: err.status,
        commentIdSent: commentId,
      });
      showToast(err.message || "Failed to delete comment", "error");
    }
  };

  const handleToggleLike = async (commentId) => {
    if (!user) {
      showToast("Please log in to like comments", "warning");
      return;
    }

    try {
      await dispatch(toggleLikeComment(commentId)).unwrap();
      // Refresh comments to update like count
      dispatch(getCommentsByVideo(videoId));
    } catch (err) {
      showToast(err.message || "Failed to like/unlike comment", "error");
    }
  };

  if (loading && comments.length === 0) {
    return (
      <div className="text-center py-12 text-gray-400">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-cyan-500 mb-4"></div>
        <p>Loading comments...</p>
      </div>
    );
  }

  return (
    <div className="mt-10 bg-gray-900/60 rounded-2xl p-6 border border-gray-700 shadow-xl">
      <h3 className="text-2xl font-bold mb-6 text-white flex items-center gap-3">
        Comments{" "}
        <span className="text-gray-400 text-lg">({comments.length})</span>
      </h3>

      {/* Add Comment Form */}
      {user ? (
        <form onSubmit={handleAddComment} className="mb-10">
          <div className="flex gap-4">
            <img
              src={
                user.avatar ||
                `https://ui-avatars.com/api/?name=${encodeURIComponent(user.username || "You")}&background=6b7280&color=fff&size=128`
              }
              alt={user.username || "You"}
              className="w-12 h-12 rounded-full object-cover border-2 border-gray-700 flex-shrink-0"
            />
            <div className="flex-1">
              <textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Write a comment..."
                className="w-full px-5 py-4 bg-gray-800 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/30 resize-none min-h-[100px] transition-all"
                rows={3}
              />
              <div className="flex justify-end mt-3">
                <button
                  type="submit"
                  disabled={!newComment.trim() || loading}
                  className={`px-8 py-3 rounded-full font-medium transition-all flex items-center gap-2 ${
                    newComment.trim() && !loading
                      ? "bg-gradient-to-r from-cyan-600 to-teal-600 hover:from-cyan-700 hover:to-teal-700 text-white shadow-md"
                      : "bg-gray-700 text-gray-500 cursor-not-allowed"
                  }`}
                >
                  <Send size={18} />
                  Post Comment
                </button>
              </div>
            </div>
          </div>
        </form>
      ) : (
        <div className="text-center py-8 bg-gray-800/50 rounded-xl border border-gray-700 mb-10">
          <p className="text-gray-300 text-lg">
            Please{" "}
            <span className="text-cyan-400 font-semibold cursor-pointer hover:underline">
              log in
            </span>{" "}
            to join the conversation
          </p>
        </div>
      )}

      {/* Comments List */}
      {comments.length === 0 ? (
        <div className="text-center py-12 text-gray-400">
          <p className="text-xl">No comments yet</p>
          <p className="mt-2">Be the first to share your thoughts!</p>
        </div>
      ) : (
        <div className="space-y-8 max-h-[600px] overflow-y-auto pr-4 scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-gray-900">
          {comments.map((comment) => {
            // Safely access owner data
            const owner = comment.owner || {};
            const ownerUsername = owner.username;
            const ownerAvatar =
              owner.avatar ||
              `https://ui-avatars.com/api/?name=${encodeURIComponent(ownerUsername)}&background=6b7280&color=fff&size=128`;

            const isOwner = user && owner._id === user._id;
            const isLikedByUser = comment.likes?.includes(user?._id) || false;

            return (
              <div
                key={comment._id}
                className="flex gap-4 group animate-fade-in"
              >
                {/* Avatar */}
                <img
                  src={ownerAvatar}
                  alt={ownerUsername}
                  className="w-11 h-11 rounded-full object-cover border-2 border-gray-700 flex-shrink-0 mt-1"
                  onError={(e) => {
                    e.target.src = `https://ui-avatars.com/api/?name=Deleted&background=333&color=fff`;
                  }}
                />

                <div className="flex-1">
                  {/* Username & Time */}
                  <div className="flex items-center gap-3 mb-1.5">
                    <span className="font-semibold text-white">
                      {ownerUsername}
                    </span>
                    <span className="text-xs text-gray-500">
                      {formatDistanceToNow(new Date(comment.createdAt), {
                        addSuffix: true,
                      })}
                    </span>
                  </div>

                  {/* Content or Edit Mode */}
                  {editingCommentId === comment._id ? (
                    <div className="mb-3">
                      <textarea
                        value={editContent}
                        onChange={(e) => setEditContent(e.target.value)}
                        className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-cyan-500 min-h-[90px]"
                        rows={3}
                      />
                      <div className="flex gap-3 mt-3">
                        <button
                          onClick={() => handleSaveEdit(comment._id)}
                          className="px-6 py-2 bg-cyan-600 hover:bg-cyan-700 rounded-lg text-sm font-medium transition"
                        >
                          Save
                        </button>
                        <button
                          onClick={() => setEditingCommentId(null)}
                          className="px-6 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg text-sm font-medium transition"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <p className="text-gray-200 mb-3 leading-relaxed">
                      {comment.content}
                    </p>
                  )}

                  {/* Actions */}
                  <div className="flex items-center gap-8 text-sm text-gray-400">
                    {/* Like Button */}
                    <button
                      onClick={() => handleToggleLike(comment._id)}
                      className={`flex items-center gap-2 transition hover:text-cyan-400 ${
                        isLikedByUser ? "text-cyan-400" : ""
                      }`}
                    >
                      <ThumbsUp
                        size={18}
                        className={isLikedByUser ? "fill-cyan-400" : ""}
                      />
                      <span>{comment.likes?.length || 0}</span>
                    </button>

                    {/* Edit & Delete - only visible to owner */}
                    {isOwner && (
                      <div className="flex gap-6 opacity-0 group-hover:opacity-100 transition-opacity">
                        {/* <button
                          onClick={() => handleEditComment(comment)}
                          className="flex items-center gap-2 hover:text-cyan-400 transition"
                        >
                          <Edit size={18} />
                          Edit
                        </button> */}
                        <button
                          onClick={() => handleDeleteComment(comment._id)}
                          className="flex items-center gap-2 hover:text-red-400 transition"
                        >
                          <Trash2 size={18} />
                          Delete
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default CommentSection;
