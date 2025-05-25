import React from "react";

const Footer = () => {
  const linkSections = [
    {
      title: "Quick Links",
      links: ["Home", "Best Sellers", "Offers & Deals", "Contact Us", "FAQs"],
    },
    {
      title: "Customer Service",
      links: ["Delivery Info", "Return & Refund Policy", "Payment Methods", "Track Order", "Support"],
    },
    {
      title: "Connect with Us",
      links: ["Instagram", "Twitter", "Facebook", "YouTube"],
    },
  ];

  return (
    <footer className="bg-green-50 pt-16 px-6 md:px-16 lg:px-24 xl:px-32 text-green-800">
      <div className="flex flex-col md:flex-row items-start justify-between gap-10 pb-12 border-b border-green-300/30">
        {/* Logo and About */}
        <div className="max-w-md">
          <img
            className="w-40 md:w-48 mb-6"
            src="/logo.svg" 
            alt="Farm2Basket Logo"
          />
          <p className="text-sm leading-relaxed text-green-700">
            Farm2Basket brings fresh, organic produce directly from farms to your doorstep. Experience the joy of healthy, sustainable living with every order. 🌿
          </p>
        </div>

        {/* Link Sections */}
        <div className="flex flex-wrap gap-8 md:w-[55%]">
          {linkSections.map((section, index) => (
            <div key={index}>
              <h3 className="font-bold text-lg mb-4 text-green-900">{section.title}</h3>
              <ul className="space-y-2 text-green-700 text-sm">
                {section.links.map((link, i) => (
                  <li key={i}>
                    <a
                      href="#"
                      className="hover:text-green-500 transition-colors duration-200"
                    >
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Note */}
      <p className="text-center text-xs md:text-sm text-green-600 mt-6 mb-4">
        © 2025 Farm2Basket. All Rights Reserved. Built with 🌱 and care.
      </p>
    </footer>
  );
};

export default Footer;
