import React from 'react';
import { Phone, Mail, MapPin, Facebook, Instagram, Twitter } from 'lucide-react';

const Footer: React.FC = () => {
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const openSocialLink = (platform: string) => {
    const urls = {
      facebook: 'https://facebook.com/newabhojan',
      instagram: 'https://instagram.com/newabhojan',
      twitter: 'https://twitter.com/newabhojan'
    };
    window.open(urls[platform as keyof typeof urls], '_blank');
  };

  return (
    <footer id="contact" className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <h3 className="text-2xl font-bold text-red-500">NewaBhojan</h3>
            <p className="text-gray-300">
              Bringing authentic Newari cuisine to your doorstep with traditional recipes 
              and fresh ingredients.
            </p>
            <div className="flex space-x-4">
              <Facebook 
                size={20} 
                className="text-gray-400 hover:text-red-500 cursor-pointer transition-colors" 
                onClick={() => openSocialLink('facebook')}
              />
              <Instagram 
                size={20} 
                className="text-gray-400 hover:text-red-500 cursor-pointer transition-colors" 
                onClick={() => openSocialLink('instagram')}
              />
              <Twitter 
                size={20} 
                className="text-gray-400 hover:text-red-500 cursor-pointer transition-colors" 
                onClick={() => openSocialLink('twitter')}
              />
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold">Quick Links</h4>
            <ul className="space-y-2">
              <li><button onClick={scrollToTop} className="text-gray-300 hover:text-red-500 transition-colors">Home</button></li>
              <li><button onClick={() => scrollToSection('menu')} className="text-gray-300 hover:text-red-500 transition-colors">Menu</button></li>
              <li><button onClick={() => scrollToSection('about')} className="text-gray-300 hover:text-red-500 transition-colors">About Us</button></li>
              <li><button onClick={() => scrollToSection('contact')} className="text-gray-300 hover:text-red-500 transition-colors">Contact</button></li>
            </ul>
          </div>

          {/* Categories */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold">Categories</h4>
            <ul className="space-y-2">
              <li><button onClick={() => scrollToSection('menu')} className="text-gray-300 hover:text-red-500 transition-colors">Main Course</button></li>
              <li><button onClick={() => scrollToSection('menu')} className="text-gray-300 hover:text-red-500 transition-colors">Snacks</button></li>
              <li><button onClick={() => scrollToSection('menu')} className="text-gray-300 hover:text-red-500 transition-colors">Traditional Sweets</button></li>
              <li><button onClick={() => scrollToSection('menu')} className="text-gray-300 hover:text-red-500 transition-colors">Beverages</button></li>
            </ul>
          </div>

          {/* Contact */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold">Contact Us</h4>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <Phone size={16} className="text-red-500" />
                <span className="text-gray-300">+977 9841234567</span>
              </div>
              <div className="flex items-center space-x-3">
                <Mail size={16} className="text-red-500" />
                <span className="text-gray-300">info@newabhojan.com</span>
              </div>
              <div className="flex items-center space-x-3">
                <MapPin size={16} className="text-red-500" />
                <span className="text-gray-300">Kathmandu, Nepal</span>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center">
          <p className="text-gray-400">
            © 2025 NewaBhojan. All rights reserved. | Authentic Newari Cuisine Delivered Fresh
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;