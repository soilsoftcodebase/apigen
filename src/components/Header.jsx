// import React, { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { FiLogOut } from "react-icons/fi";
// import PropTypes from "prop-types";
// import logo from "../assets/logo.png";

// const Header = ({ caption, onLogout }) => {
//   const navigate = useNavigate();
//   const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

//   return (
//     <header className="sticky top-0 left-0 w-full flex justify-center z-50 mt-10 ">
//       <div className="bg-gradient-to-r from-cyan-950 to-sky-900 rounded-xl px-8 py-4 shadow-lg w-full max-w-5xl flex items-center">
//         <img src={logo} alt="APIGEN Logo" className="h-16 mr-4" />
//         <span className="text-white text-4xl font-semibold text-align-end ">Advanced API Test Generator and Executor</span>
//       </div>

//       {/* Logout Icon */}
//       {/* Uncomment if you want to add logout functionality */}
//       {/* <FiLogOut
//         onClick={() => setShowLogoutConfirm(true)}
//         className="absolute top-4 right-6 text-white text-3xl cursor-pointer hover:text-red-500 transition duration-150"
//         title="Log Out"
//       /> */}

//       {/* Logout Confirmation Dialog */}
//       {/* {showLogoutConfirm && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
//           <div className="bg-white rounded-lg p-6 w-80 shadow-lg">
//             <h3 className="text-lg font-semibold text-gray-800 mb-2">
//               Confirm Logout
//             </h3>
//             <p className="text-gray-600 mb-4">
//               Are you sure you want to log out?
//             </p>
//             <div className="flex justify-end space-x-3">
//               <button
//                 onClick={() => setShowLogoutConfirm(false)}
//                 className="px-4 py-2 rounded bg-gray-300 text-gray-700 hover:bg-gray-400 transition duration-150"
//               >
//                 Cancel
//               </button>
//               <button
//                 onClick={handleLogout}
//                 className="px-4 py-2 rounded bg-red-500 text-white hover:bg-red-600 transition duration-150"
//               >
//                 Log Out
//               </button>
//             </div>
//           </div>
//         </div>
//       )} */}
//     </header>
//   );
// };

// Header.propTypes = {
//   caption: PropTypes.string.isRequired,
//   onLogout: PropTypes.func.isRequired,
// };

// export default Header;


import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import PropTypes from "prop-types";
import logo from "../assets/logo.png";
import line2 from "../assets/line.png";


const Header = ({ caption, onLogout }) => {
  const navigate = useNavigate();
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  return (
    <header
      className="fixed top-6 left-72 w-full flex  z-50 bg-gradient-to-r from-cyan-950 to-sky-900 shadow-lg rounded-2xl mb"
      style={{ height: "100px" }}
    >
      
      <div className="rounded-xl px-8 py-4 w-full max-w-8xl flex items-center">
        <img src={logo} alt="APIGEN Logo" className="h-20 justify-start" />
        <img src={line2} alt="Line" className="h-4 mr-4 justify-start" />
        <span className="text-white text-4xl font-semibold justify-end ">
          Advanced API Test Generator and Executor
        </span>
      </div>
    </header>
  );
};

Header.propTypes = {
  caption: PropTypes.string.isRequired,
  onLogout: PropTypes.func.isRequired,
};

export default Header;
