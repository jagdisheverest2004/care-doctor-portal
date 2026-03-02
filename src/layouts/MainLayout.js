import Sidebar from "../layouts/Sidebar";
import Topbar from "../layouts/Topbar";

function MainLayout({ children, onLogout, onDarkModeToggle, isDarkMode }) {
  return (
    <div className="app-container">
      <Sidebar onLogout={onLogout} />
      <Topbar
        doctorName="Kailash"
        onDarkModeToggle={onDarkModeToggle}
        isDarkMode={isDarkMode}
      />
      <div className="main-content">{children}</div>
    </div>
  );
}

export default MainLayout;
