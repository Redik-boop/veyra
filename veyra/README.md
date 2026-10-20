# 🌌 Veyra | The Offline Social Network

Veyra is a high-fidelity, fully functional social networking prototype designed to operate **entirely offline**. It simulates a modern social media experience—complete with feeds, short-form video, long-form video, messaging, and community groups—without requiring a backend server, internet access, or cloud services.

## ✨ Key Features

### 🏠 Social Experience
- **Home Feed**: Share updates, like, comment, and repost.
- **Shorts**: A TikTok-inspired vertical video feed with immersive playback.
- **Video Library**: A YouTube-style hub for long-form local video content.
- **Explore**: Global search to find users, posts, and media within the local network.

### 💬 Connections
- **Messaging**: Real-time local direct messaging between demo accounts.
- **Groups**: Create and join local communities to share interests.
- **Profiles**: Full user profiles with bios and post histories.

### 🎵 Multimedia & System
- **Music Hub**: A local audio player with a spinning vinyl visualizer.
- **Notifications**: An activity center tracking local likes and follows.
- **System Settings**: 
  - **Theme Engine**: Seamless switching between Dark and Light modes.
  - **Device Integration**: Live battery status tracking and custom "Mood" indicators.

### 🛡️ Admin Console
- A dedicated administrative interface for moderating local content and monitoring system statistics.

## 🛠️ Technical Architecture

Veyra is built with a modern frontend stack designed for maximum performance and offline reliability:

- **Framework**: React 18 + Vite + TypeScript.
- **Styling**: Tailwind CSS (Custom Dark-First Palette).
- **Persistence**: **IndexedDB** (via `idb`) for structured data storage.
- **Routing**: React Router for seamless page transitions.
- **Icons**: Lucide-React.

## 🚀 Getting Started

### Installation
1. Clone the repository:
   ```bash
   git clone https://github.com/Redik-boop/veyra.git
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```

### Offline Usage
Once the dependencies are installed and the server is started, you can disconnect from the internet. The application will continue to function perfectly, saving all data locally to your browser's IndexedDB.

## 📱 Mobile Deployment (APK)
To turn Veyra into a mobile app:
1. Build the project: `npm run build`.
2. Use **Capacitor** to wrap the project:
   ```bash
   npm install @capacitor/core @capacitor/cli
   npx cap init Veyra com.veyra.app
   npx cap add android
   npx cap sync
   ```
3. Open in Android Studio and export as APK.

---
**Veyra** — *The power of connection, completely local.*
