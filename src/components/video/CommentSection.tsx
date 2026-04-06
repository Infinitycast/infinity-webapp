"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Flag, ThumbsUp, MoreVertical } from "lucide-react";
import { toast } from "sonner";
import { checkProfanity } from "@/lib/profanity-filter";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { User } from "@/lib/auth";

interface Comment {
  id: string;
  episodeId: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  content: string;
  filteredContent: string;
  timestamp: number;
  likes: number;
  reports: number;
  flaggedForSlur: boolean;
  hidden: boolean;
  parentId?: string;
  replies?: Comment[];
}

interface CommentSectionProps {
  user: User;
  episodeId: string;
  commentsEnabled: boolean;
  isCreator?: boolean;
  onToggleComments?: (enabled: boolean) => void;
}

export const CommentSection = ({
  user,
  episodeId,
  commentsEnabled,
  isCreator = false,
  onToggleComments,
}: CommentSectionProps) => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState("");
  const [likedComments, setLikedComments] = useState<Set<string>>(new Set());
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyText, setReplyText] = useState("");

  // ✅ Safe localStorage access
  useEffect(() => {
    if (typeof window === "undefined") return;

    const stored = localStorage.getItem(`comments-${episodeId}`);
    if (stored) {
      setComments(JSON.parse(stored));
    }

    if (user?.id) {
      const likedStored = localStorage.getItem(`liked-comments-${user.id}`);
      if (likedStored) {
        setLikedComments(new Set(JSON.parse(likedStored)));
      }
    }
  }, [episodeId, user?.id]);

  const saveComments = (updated: Comment[]) => {
    if (typeof window !== "undefined") {
      localStorage.setItem(`comments-${episodeId}`, JSON.stringify(updated));
    }
    setComments(updated);
  };

  const handlePostComment = () => {
    if (!user) return toast.error("Please log in");
    if (!newComment.trim()) return toast.error("Comment cannot be empty");

    const profanityCheck = checkProfanity(newComment);

    const comment: Comment = {
      id: `comment-${Date.now()}`,
      episodeId,
      userId: user.id,
      userName: user.first_name || "Anonymous",
      //userAvatar: user.avatar,
      content: newComment,
      filteredContent: profanityCheck.filteredText,
      timestamp: Date.now(),
      likes: 0,
      reports: 0,
      flaggedForSlur: profanityCheck.hasRacialSlur,
      hidden: false,
    };

    // Moderation queue
    if (profanityCheck.hasRacialSlur && typeof window !== "undefined") {
      const modQueue = JSON.parse(localStorage.getItem("mod-queue") || "[]");
      modQueue.push({
        ...comment,
        reason: "Racial slur detected",
        flaggedAt: Date.now(),
      });
      localStorage.setItem("mod-queue", JSON.stringify(modQueue));
      toast.warning("Comment flagged for review");
    }

    saveComments([comment, ...comments]);
    setNewComment("");
    toast.success("Comment posted!");
  };

  const handleLike = (commentId: string) => {
    if (!user) return toast.error("Login required");

    const updatedLikes = new Set(likedComments);

    const updatedComments = comments.map((c) => {
      if (c.id === commentId) {
        if (updatedLikes.has(commentId)) {
          updatedLikes.delete(commentId);
          return { ...c, likes: c.likes - 1 };
        } else {
          updatedLikes.add(commentId);
          return { ...c, likes: c.likes + 1 };
        }
      }
      return c;
    });

    setLikedComments(updatedLikes);

    if (typeof window !== "undefined") {
      localStorage.setItem(
        `liked-comments-${user.id}`,
        JSON.stringify([...updatedLikes])
      );
    }

    saveComments(updatedComments);
  };

  const handleDelete = (id: string) => {
    const updated = comments.filter((c) => c.id !== id);
    saveComments(updated);
    toast.success("Deleted");
  };

  const handleReport = (comment: Comment) => {
    if (!user) return toast.error("Login required");

    const updated = comments.map((c) => {
      if (c.id === comment.id) {
        const reports = c.reports + 1;
        return {
          ...c,
          reports,
          hidden: reports >= 2,
        };
      }
      return c;
    });

    saveComments(updated);
    toast.success("Reported");
  };

  // Threading
  const organizeComments = (all: Comment[]) => {
    const top = all.filter((c) => !c.parentId);
    return top.map((c) => ({
      ...c,
      replies: all.filter((r) => r.parentId === c.id),
    }));
  };

  const visibleComments = organizeComments(comments).filter((c) => {
    if (c.hidden && user && (c.userId === user.id || isCreator)) return true;
    return !c.hidden;
  });

  if (!commentsEnabled && !isCreator) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        Comments disabled
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Creator toggle */}
      {isCreator && onToggleComments && (
        <Button onClick={() => onToggleComments(!commentsEnabled)}>
          {commentsEnabled ? "Disable" : "Enable"} Comments
        </Button>
      )}

      {commentsEnabled && (
        <>
          {/* New comment */}
          <div className="flex gap-3">
            <Avatar>
              <AvatarImage src={""} />
              <AvatarFallback>{user?.first_name?.[0] || "U"}</AvatarFallback>
            </Avatar>

            <div className="flex-1">
              <Textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
              />
              <div className="flex justify-end mt-2">
                <Button onClick={handlePostComment}>Post</Button>
              </div>
            </div>
          </div>

          {/* Comments */}
          {visibleComments.map((comment) => (
            <div key={comment.id} className="flex gap-3">
              <Avatar>
                <AvatarImage src={comment.userAvatar} />
                <AvatarFallback>{comment.userName[0]}</AvatarFallback>
              </Avatar>

              <div className="flex-1">
                <p className="font-semibold">{comment.userName}</p>
                <p>{comment.filteredContent}</p>

                <div className="flex gap-3 mt-2">
                  <Button size="sm" onClick={() => handleLike(comment.id)}>
                    <ThumbsUp className="w-4 h-4 mr-1" />
                    {comment.likes}
                  </Button>

                  <Button size="sm" onClick={() => handleReport(comment)}>
                    <Flag className="w-4 h-4 mr-1" />
                    Report
                  </Button>

                  {user?.id === comment.userId && (
                    <Button size="sm" onClick={() => handleDelete(comment.id)}>
                      Delete
                    </Button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </>
      )}
    </div>
  );
};
