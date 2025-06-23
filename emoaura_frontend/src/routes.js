import FeedPage from "./components/FeedPage";
import ExplorePage from "./components/Explore";
import ProfilePage from "./components/ProfilePage";
import MessagesDMPage from "./components/MessagesDMPage";

// Optionally import AdminPage, MessagingPage if implemented
// Placeholder exports if not implemented yet
const AdminPage = () => <div style={{padding: 32, fontSize: 20}}>AdminPage not implemented</div>;
const MessagingPage = MessagesDMPage;

// Export pages for use in App.js routes
export {
  FeedPage,
  ExplorePage,
  ProfilePage,
  AdminPage,
  MessagingPage
};
