import { createContext, useState, useEffect } from "react";

// Create the UserContext
export const UserContext = createContext({});

// Create a provider component
export function UserContextProvider({ children }) {
  const [userinfo, setUserinfo] = useState(null);

  useEffect(() => {
    // Check if there's any saved user data in localStorage when the app starts
    const storedUserInfo = JSON.parse(localStorage.getItem("userinfo"));
    if (storedUserInfo) {
      setUserinfo(storedUserInfo); // Set the user info to state if found
    }
  }, []);


 

  return (
    <UserContext.Provider value={{ userinfo, setUserinfo }}>
      {children}
    </UserContext.Provider>
  );
}
