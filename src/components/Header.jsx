// import  { useState } from "react";
// import { useNavigate } from "react-router-dom";
import PropTypes from "prop-types";
import logo from "../assets/logo.png";
//import line2 from "../assets/line.png";

const Header = () => {
  //const navigate = useNavigate();
  //const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  return (
    <div
      className="fixed bg-gradient-to-br from-gray-50 to-gray-100 w-full flex z-50"
      style={{ height: "125px" }}
    >
      <header
        className="fixed top-6 ml-8 w-full flex z-50 bg-gradient-to-r from-cyan-950 to-sky-900 shadow-lg rounded-2xl mb"
        style={{ height: "100px" }}
      >
        <div className="rounded-xl px-8 py-4 w-full max-w-8xl flex items-center">
          <img src={logo} alt="APIGEN Logo" className="h-20 justify-start" />
          {/* <img src={line2} alt="Line" className="h-4 mr-4 justify-start" /> */}
          <span className="text-white text-4xl font-semibold justify-end ml-28">
            | Intelligent API Test Platform |
          </span>
        </div>
      </header>
    </div>
  );
};

Header.propTypes = {
  caption: PropTypes.string.isRequired,
  onLogout: PropTypes.func.isRequired,
};

export default Header;
