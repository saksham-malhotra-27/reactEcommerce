import React from 'react';

function Footer() {
  return (
    <footer id='contacts' className="bg-[#141414] text-white py-8 px-4">
      <div className="container mx-auto flex flex-wrap justify-between">
        <div className="w-full md:w-1/2 lg:w-1/3 mb-4 md:mb-0">
          <h3 className="text-xl font-semibold mb-2">About Trigify</h3>
          <p className="text-base leading-relaxed">
            Trigify is your one-stop shop for eco-friendly products. We offer a curated selection of sustainable items that make a difference for the planet.
          </p>
        </div>

        <div className="w-full md:w-1/2 lg:w-1/3 mb-4 md:mb-0">
          <h3 className="text-xl font-semibold mb-2">Contact</h3>
          <ul className="list-none">
            <li className="mb-2">
              <a href="mailto:support@trigify.com" className="text-white hover:text-gray-400">
                support@trigify.com
              </a>
            </li>
            <li>
              <a href="tel:+1234567890" className="text-white hover:text-gray-400">
                +1 (234) 567-890
              </a>
            </li>
          </ul>
        </div>

        <div className="w-full md:w-1/2 lg:w-1/3 mb-4 md:mb-0">
          <h3 className="text-xl font-semibold mb-2">Follow Us</h3>
          <ul className="list-none flex space-x-4">
            <li>
              <a
                href="https://www.facebook.com/trigify"
                target="_blank"
                rel="noreferrer noopener"
                className="text-white hover:text-gray-400"
              >
                <i className="fab fa-facebook-f"></i>
              </a>
            </li>
            <li>
              <a
                href="https://www.instagram.com/trigify"
                target="_blank"
                rel="noreferrer noopener"
                className="text-white hover:text-gray-400"
              >
                <i className="fab fa-instagram"></i>
              </a>
            </li>
            {/* Add more social media links as needed */}
          </ul>
        </div>
      </div>

      <div className="text-center pt-4">
        <p className="text-sm">© {new Date().getFullYear()} Trigify. All Rights Reserved.</p>
      </div>
    </footer>
  );
}

export default Footer;
