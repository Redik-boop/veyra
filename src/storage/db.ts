import { openDB, IDBPDatabase } from 'idb';

export interface VeyraDB {
  users: {
    key: string;
    value: {
      id: string;
      username: string;
      displayName: string;
      bio: string;
      avatar: string;
      createdAt: number;
    };
  };
  posts: {
    key: string;
    value: {
      id: string;
      userId: string;
      content: string;
      mediaUrl?: string;
      mediaType?: 'image' | 'video';
      likes: string[];
      comments: string[];
      createdAt: number;
      repostedFrom?: string;
    };
  };
  comments: {
    key: string;
    value: {
      id: string;
      postId: string;
      userId: string;
      content: string;
      createdAt: number;
    };
  };
  messages: {
    key: string;
    value: {
      id: string;
      conversationId: string;
      senderId: string;
      content: string;
      timestamp: number;
    };
  };
  follows: {
    key: string;
    value: {
      followerId: string;
      followingId: string;
      createdAt: number;
    };
  };
  groups: {
    key: string;
    value: {
      id: string;
      name: string;
      description: string;
      avatar: string;
      creatorId: string;
      createdAt: number;
    };
  };
  groupMembers: {
    key: string;
    value: {
      groupId: string;
      userId: string;
      joinedAt: number;
    };
  };
  videos: {
    key: string;
    value: {
      id: string;
      userId: string;
      title: string;
      description: string;
      url: string;
      thumbnail: string;
      duration: number;
      createdAt: number;
      isShort: boolean;
    };
  };
  music: {
    key: string;
    value: {
      id: string;
      userId: string;
      title: string;
      artist: string;
      url: string;
      cover: string;
      duration: number;
      createdAt: number;
    };
  };
  notifications: {
    key: string;
    value: {
      id: string;
      userId: string;
      type: 'like' | 'comment' | 'follow' | 'message';
      fromUserId: string;
      targetId: string;
      content?: string;
      isRead: boolean;
      createdAt: number;
    };
  };
}

const DB_NAME = 'veyra_db';
const DB_VERSION = 1;

export const initDB = async () => {
  return openDB<IDBPDatabase>(DB_NAME, DB_VERSION, {
    upgrade(db) {
      if (!db.objectStoreNames.contains('users')) {
        db.createObjectStore('users', { keyPath: 'id' });
      }
      if (!db.objectStoreNames.contains('posts')) {
        db.createObjectStore('posts', { keyPath: 'id' });
      }
      if (!db.objectStoreNames.contains('comments')) {
        db.createObjectStore('comments', { keyPath: 'id' });
      }
      if (!db.objectStoreNames.contains('messages')) {
        db.createObjectStore('messages', { keyPath: 'id' });
      }
      if (!db.objectStoreNames.contains('follows')) {
        db.createObjectStore('follows', { keyPath: 'id' });
      }
      if (!db.objectStoreNames.contains('groups')) {
        db.createObjectStore('groups', { keyPath: 'id' });
      }
      if (!db.objectStoreNames.contains('groupMembers')) {
        db.createObjectStore('groupMembers', { keyPath: 'id' });
      }
      if (!db.objectStoreNames.contains('videos')) {
        db.createObjectStore('videos', { keyPath: 'id' });
      }
      if (!db.objectStoreNames.contains('music')) {
        db.createObjectStore('music', { keyPath: 'id' });
      }
      if (!db.objectStoreNames.contains('notifications')) {
        db.createObjectStore('notifications', { keyPath: 'id' });
      }
    },
  });
};
