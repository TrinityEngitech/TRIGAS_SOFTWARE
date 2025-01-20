// import React, { useState, useEffect } from "react";

// // bootstrap
// import "bootstrap/dist/css/bootstrap.min.css";
// import "bootstrap-icons/font/bootstrap-icons.css";
// // pages
// import AdminPanel from "./component/AdminPanel";
// // import Login from "./Authentication/Login";


// function App() {
//   return (
//     <>
//       <div>
//         {/* <Login/> */}
//         <AdminPanel />
//       </div>
//     </>
//   );
// }

// export default App;


import React, { useState, useEffect } from "react";

// Bootstrap
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";

// Pages
import AdminPanel from "./component/AdminPanel";
import Login from "./Authentication/Login";

function App() {
  // State to track authentication status
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Check authentication status from localStorage on initial load
  useEffect(() => {
    const authStatus = localStorage.getItem("isAuthenticated");
    if (authStatus === "true") {
      setIsAuthenticated(true);
    }
  }, []);

  // Function to handle login
  const handleLogin = () => {
    setIsAuthenticated(true);
    localStorage.setItem("isAuthenticated", "true");
  };

  // Function to handle logout
  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem("isAuthenticated");
  };

  return (
    <div>
      {isAuthenticated ? (
        <AdminPanel onLogout={handleLogout} />
      ) : (
        <Login onLogin={handleLogin} />
      )}
    </div>
  );
}

export default App;
