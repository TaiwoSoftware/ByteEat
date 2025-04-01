const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white py-6 mt-12">
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-center">
          {/* Left Section: Copyright */}
          <div className="mb-4 md:mb-0 text-center md:text-left">
            <p className="text-sm">
              &copy; {new Date().getFullYear()} Your Company. All Rights
              Reserved.
            </p>
          </div>

          {/* Right Section: Social Media Links */}
          <div className="flex space-x-6 justify-center md:justify-end">
            <a
              href="#"
              className="text-white hover:text-gray-400 transition-colors duration-300"
            >
              <i className="fab fa-facebook-f"></i>
            </a>
            <a
              href="#"
              className="text-white hover:text-gray-400 transition-colors duration-300"
            >
              <i className="fab fa-twitter"></i>
            </a>
            <a
              href="#"
              className="text-white hover:text-gray-400 transition-colors duration-300"
            >
              <i className="fab fa-instagram"></i>
            </a>
            <a
              href="#"
              className="text-white hover:text-gray-400 transition-colors duration-300"
            >
              <i className="fab fa-linkedin-in"></i>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
