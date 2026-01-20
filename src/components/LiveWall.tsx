import { MessageCircle } from "lucide-react";

interface Comment {
  id: string;
  text: string;
  time: string;
  vibe: string;
}

interface LiveWallProps {
  comments: Comment[];
}

export function LiveWall({ comments }: LiveWallProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
          <MessageCircle className="h-5 w-5 text-neon-purple" />
          Live Wall
        </h2>
        <span className="text-xs text-muted-foreground">{comments.length} updates</span>
      </div>

      <div className="space-y-3">
        {comments.map((comment) => (
          <div
            key={comment.id}
            className="bar-card p-4 space-y-2"
          >
            <div className="flex items-start justify-between">
              <p className="text-foreground flex-1">{comment.text}</p>
              <span className="text-xl ml-2">{comment.vibe}</span>
            </div>
            <p className="text-xs text-muted-foreground">{comment.time}</p>
          </div>
        ))}

        {comments.length === 0 && (
          <div className="bar-card p-8 text-center">
            <p className="text-muted-foreground">No updates yet. Be the first to report!</p>
          </div>
        )}
      </div>
    </div>
  );
}
