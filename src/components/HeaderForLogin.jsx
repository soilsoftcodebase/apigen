import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiLogOut } from "react-icons/fi";
import PropTypes from "prop-types";
import logo from "../assets/logo.png";



const HeaderForLogin = () => {
  return (
    <div>
      <header className="sticky top-0 left-0 w-full flex justify-center z-50 mt-10 ">
      <div className="bg-gradient-to-r from-cyan-950 to-sky-900 rounded-xl px-8 py-4 shadow-lg w-full max-w-5xl flex items-center">
        <img src={logo} alt="APIGEN Logo" className="h-16 mr-4" />
        <span className="text-white text-4xl font-semibold text-align-end ">Advanced API Test Generator and Executor</span>
      </div>
    </header>
    </div>
  )
}

export default HeaderForLogin




// import React, { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import PropTypes from "prop-types";
// import logo from "../assets/logo.png";
// import line2 from "../assets/line.png";


// const Header = ({ caption, onLogout }) => {
//   const navigate = useNavigate();
//   const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

//   return (
//     <header
//       className="fixed top-6 left-72 w-full flex  z-50 bg-gradient-to-r from-cyan-950 to-sky-900 shadow-lg rounded-2xl mb"
//       style={{ height: "100px" }}
//     >
      
//       <div className="rounded-xl px-8 py-4 w-full max-w-8xl flex items-center">
//         <img src={logo} alt="APIGEN Logo" className="h-20 justify-start" />
//         <img src={line2} alt="Line" className="h-4 mr-4 justify-start" />
//         <span className="text-white text-4xl font-semibold justify-end ">
//           Advanced API Test Generator and Executor
//         </span>
//       </div>
//     </header>
//   );
// };

// Header.propTypes = {
//   caption: PropTypes.string.isRequired,
//   onLogout: PropTypes.func.isRequired,
// };

// export default Header;
