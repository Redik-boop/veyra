import React, { useState, useEffect } from 'react';
import { MapPin, Calendar, User as UserIcon, Image, Video, Music, Heart, MessageCircle, Share2 } from 'lucide-react';
import { useDB, getItems } from '../../hooks/useDB';
import { useAuth } from '../../hooks/useAuth';
import { cn } from '../../utils/cn';

export const ProfilePage: React.FC<{ userId?: string }> = ({ userId }) => {
  const db = useDB();
  const { currentUser } = useAuth();
  const targetUserId = userId || currentUser?.id;
  const [user, setUser] = useState<any>(null);
  const [posts, setPosts] = useState<any[]>([]);
  const [stats, setStats] = useState({ followers: 0, following: 0, posts: 0 });

  useEffect(() => {
    if (!db || !targetUserId) return;

    const fetchProfileData = async () => {
      // Fetch user
      const users = await getItems<any>(db, 'users');
      const foundUser = users.find(u => u.id === targetUserId);
      if (foundUser) setUser(foundUser);

      // Fetch posts
      const allPosts = await getItems<any>(db, 'posts');
      const userPosts = allPosts.filter(p => p.userId === targetUserId).sort((a, b) => b.createdAt - a.createdAt);
      setPosts(userPosts);

      // Calculate stats
      const allFollows = await getItems<any>(db, 'follows');
      const followers = allFollows.filter(f => f.followingId === targetUserId).length;
      const following = allFollows.filter(f => f.followerId === targetUserId).length;
      setStats({ followers, following, posts: userPosts.length });
    };

    fetchProfileData();
  }, [db, targetUserId]);

  if (!user) return <div className="flex items-center justify-center h-full text-veyra-textMuted">Loading profile...</div>;

  return (
    <div className="max-w-4xl mx-auto w-full space-y-8">
      {/* Profile Header */}
      <div className="glass-panel rounded-3xl overflow-hidden border border-white/10">
        <div className="h-32 bg-gradient-to-r from-veyra-accentBlue to-purple-600" />
        <div className="px-6 pb-6">
          <div className="relative flex justify-between items-end -mt-12 mb-4">
            <div className="relative">
              <div className="w-24 h-24 rounded-3xl bg-veyra-charcoal border-4 border-veyra-charcoal overflow-hidden shadow-xl">
                <img src={user.avatar} alt={user.displayName} className="w-full h-full object-cover" />
              </div>
            </div>
            <button className={cn(
              "px-6 py-2 rounded-full font-bold transition-all",
              targetUserId === currentUser?.id
                ? "bg-white/10 text-white hover:bg-white/20"
                : "bg-veyra-accentBlue text-white hover:bg-veyra-accentBlue/80"
            )}>
              {targetUserId === currentUser?.id ? 'Edit Profile' : 'Follow'}
            </button>
          </div>

          <div className="space-y-1">
            <h1 className="text-2xl font-bold">{user.displayName}</h1>
            <p className="text-veyra-textMuted text-sm">@{user.username}</p>
          </div>

          <p className="mt-3 text-veyra-textMain max-w-lg">
            {user.bio}
          </p>

          <div className="flex gap-6 mt-6">
            <div className="flex gap-2 items-center">
              <span className="font-bold text-lg">{stats.posts}</span>
              <span className="text-sm text-veyra-textMuted">Posts</span>
            </div>
            <div className="flex gap-2 items-center">
              <span className="font-bold text-lg">{stats.followers}</span>
              <span className="text-sm text-veyra-textMuted">Followers</span>
            </div>
            <div className="flex gap-2 items-center">
              <span className="font-bold text-lg">{stats.following}</span>
              <span className="text-sm text-veyra-textMuted">Following</span>
            </div>
          </div>
        </div>
      </div>

      {/* Profile Content Tabs */}
      <div className="space-y-6">
        <div className="flex border-b border-white/10">
          {['Posts', 'Media', 'Liked'].map((tab) => (
            <button
              key={tab}
              className={cn(
                "px-6 py-3 text-sm font-medium transition-colors relative",
                tab === 'Posts' ? "text-white" : "text-veyra-textMuted hover:text-white"
              )}
            >
              {tab}
              {tab === 'Posts' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-veyra-accentBlue" />}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {posts.length === 0 ? (
            <div className="col-span-full text-center py-20 glass-panel rounded-3xl">
              <p className="text-veyra-textMuted">No posts yet</p>
            </div>
          ) : (
            posts.map(post => (
              <div key={post.id} className="glass-panel p-4 rounded-2xl space-y-3 hover:bg-white/5 transition-colors border border-white/5">
                {post.mediaUrl && (
                  <div className="rounded-xl overflow-hidden aspect-video bg-veyra-darkgray">
                    <img src={post.mediaUrl} alt="" className="w-full h-full object-cover" />
                  </div>
                )}
                <p className="text-sm leading-relaxed">{post.content}</p>
                <div className="flex items-center justify-between pt-2 border-t border-white/5">
                  <div className="flex gap-4">
                    <button className="flex items-center gap-1.5 text-xs text-veyra-textMuted hover:text-pink-500 transition-colors">
                      <Heart size={14} /> {post.likes.length}
                    </button>
                    <button className="flex items-center gap-1.5 text-xs text-veyra-textMuted hover:text-veyra-accentBlue transition-colors">
                      <MessageCircle size={14} /> {post.comments.length}
                    </button>
                  </div>
                  <button className="flex items-center gap-1.5 text-xs text-veyra-textMuted hover:text-white transition-colors">
                    <Share2 size={14} />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
