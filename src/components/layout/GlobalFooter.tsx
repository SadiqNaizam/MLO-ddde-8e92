import React from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Twitter, Instagram, Linkedin, Shield } from 'lucide-react';

const GlobalFooter: React.FC = () => {
  console.log('GlobalFooter loaded');
  const currentYear = new Date().getFullYear();

  const informationalLinks = [
    { label: 'About Us', path: '/about' },
    { label: 'Sizing Guide', path: '/sizing-guide' },
    { label: 'FAQ', path: '/faq' },
    { label: 'Terms of Service', path: '/terms' },
    { label: 'Privacy Policy', path: '/privacy' },
  ];

  const socialLinks = [
    { Icon: Facebook, path: 'https://facebook.com', label: 'Facebook' },
    { Icon: Twitter, path: 'https://twitter.com', label: 'Twitter' },
    { Icon: Instagram, path: 'https://instagram.com', label: 'Instagram' },
    { Icon: Linkedin, path: 'https://linkedin.com', label: 'LinkedIn' },
  ];

  return (
    <footer className="bg-slate-800 border-t border-slate-700 text-slate-400">
      <div className="container mx-auto px-4 py-12 md:px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {/* Brand Info */}
          <div>
            <Link to="/" className="flex items-center gap-2 mb-4 group">
              <Shield className="h-7 w-7 text-red-500 group-hover:text-red-400 transition-colors" />
              <span className="font-semibold text-lg text-slate-200 group-hover:text-red-400 transition-colors">
                Stark Industries
              </span>
            </Link>
            <p className="text-sm">
              Forging the future of custom apparel. Experience innovation, precision, and power.
            </p>
          </div>

          {/* Informational Links */}
          <div>
            <h3 className="text-md font-semibold text-slate-200 mb-3">Information</h3>
            <ul className="space-y-2">
              {informationalLinks.map((link) => (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    className="text-sm hover:text-red-400 transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Social Media & Contact Teaser */}
          <div>
            <h3 className="text-md font-semibold text-slate-200 mb-3">Connect With Us</h3>
            <div className="flex space-x-4 mb-4">
              {socialLinks.map(({ Icon, path, label }) => (
                <a
                  key={label}
                  href={path}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="text-slate-400 hover:text-red-400 transition-colors"
                >
                  <Icon className="h-5 w-5" />
                </a>
              ))}
            </div>
            <p className="text-sm">
              Follow our journey and get the latest updates on our cutting-edge designs.
            </p>
          </div>
        </div>

        <div className="border-t border-slate-700 pt-8 text-center">
          <p className="text-sm">
            &copy; {currentYear} Stark Industries. All rights reserved.
            <br />
            Designed with Arc Reactor Technology.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default GlobalFooter;