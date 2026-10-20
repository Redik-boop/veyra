import { initDB } from './db';

export const seedDatabase = async () => {
  const db = await initDB();

  // Check if already seeded
  const userCount = await db.count('users');
  if (userCount > 0) return;

  const users = [
    {
      id: 'u1',
      username: 'alex_dev',
      displayName: 'Alex Rivers',
      bio: 'Building the future of the offline web. 🌐',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alex',
      createdAt: Date.now(),
    },
    {
      id: 'u2',
      username: 'sarah_sky',
      displayName: 'Sarah Sky',
      bio: 'Digital nomad and local explorer. 🏔️',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah',
      createdAt: Date.now(),
    },
    {
      id: 'u3',
      username: 'mike_beats',
      displayName: 'Mike Beats',
      bio: 'Producing lo-fi beats from my bedroom. 🎹',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Mike',
      createdAt: Date.now(),
    }
  ];

  const posts = [
    {
      id: 'p1',
      userId: 'u1',
      content: 'Just launched Veyra! The most powerful offline social network. No clouds, just local power. 🚀',
      likes: ['u2'],
      comments: ['c1'],
      createdAt: Date.now() - 100000,
    },
    {
      id: 'p2',
      userId: 'u2',
      content: 'Exploring the outskirts of the city today. Local maps are a lifesaver! 📍',
      likes: ['u1', 'u3'],
      comments: [],
      createdAt: Date.now() - 50000,
    },
    {
      id: 'p3',
      userId: 'u3',
      content: 'New beat just dropped. Check the music section! 🎧',
      likes: ['u1'],
      comments: [],
      createdAt: Date.now() - 10000,
    }
  ];

  const comments = [
    {
      id: 'c1',
      postId: 'p1',
      userId: 'u2',
      content: 'This is actually insane. Love the concept!',
      createdAt: Date.now() - 90000,
    }
  ];

  const videos = [
    {
      id: 'v1',
      userId: 'u2',
      title: 'Mountain Sunrise',
      description: 'A beautiful morning in the peaks.',
      url: '', // Placeholder for local file
      thumbnail: '',
      duration: 15,
      createdAt: Date.now(),
      isShort: true,
    },
    {
      id: 'v2',
      userId: 'u1',
      title: 'Veyra Tutorial',
      description: 'How to use Veyra offline.',
      url: '',
      thumbnail: '',
      duration: 300,
      createdAt: Date.now(),
      isShort: false,
    }
  ];

  const music = [
    {
      id: 'm1',
      userId: 'u3',
      title: 'Midnight Coffee',
      artist: 'Mike Beats',
      url: '',
      cover: '',
      duration: 180,
      createdAt: Date.now(),
    }
  ];

  const tx = db.transaction(['users', 'posts', 'comments', 'videos', 'music'], 'readwrite');
  await Promise.all([
    tx.objectStore('users').put(users[0]),
    tx.objectStore('users').put(users[1]),
    tx.objectStore('users').put(users[2]),
    tx.objectStore('posts').put(posts[0]),
    tx.objectStore('posts').put(posts[1]),
    tx.objectStore('posts').put(posts[2]),
    tx.objectStore('comments').put(comments[0]),
    tx.objectStore('videos').put(videos[0]),
    tx.objectStore('videos').put(videos[1]),
    tx.objectStore('music').put(music[0]),
  ]);
  await tx.done;
}
