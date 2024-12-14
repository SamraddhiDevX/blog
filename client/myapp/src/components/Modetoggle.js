import React from "react";
import { useTheme } from "../context/ThemeContext"; // Use the custom theme context

const Modetoggle = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme} // This toggles the theme on click
      className="px-4 py-2 border rounded-md hover:bg-gray-100 dark:hover:bg-gray-600 transition"
    >
      {theme === "light" ? "🌙" : "🌞"} {/* Display the icon/text based on the theme */}
    </button>
  );
};

export default Modetoggle;
