const Footer = () => {
  return (
    <footer className="p-4 text-gray-300 bg-gray-800">
      <div className="container mx-auto text-center">
        <p className="text-sm">
          &copy; {new Date().getFullYear()}Travel Journal. All rights reserved.
        </p>
        <div className="mt-2 space-x-4">
          <a href="/about" className="hover:text-white">
            About
          </a>
          <a href="/contact" className="hover:text-white">
            Contact
          </a>
          <a href="/privacy" className="hover:text-white">
            Privacy Policy
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
