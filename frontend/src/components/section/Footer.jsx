import React from 'react';
import { Facebook, Twitter, Instagram, Linkedin, Mail, MapPin, Phone } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-primary text-white pt-16 pb-8">
      <div className="max-w-[1400px] mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          {/* Brand & Description */}
          <div className="flex flex-col gap-4">
            <h3 className="text-2xl font-bold text-white">CareerFair</h3>
            <p className="text-gray-300 text-sm leading-relaxed">
              Connecting students, universities, and employers at scale. Discover careers, build skills, access internships, and hire talent through India's largest employability ecosystem.
            </p>
            <div className="flex items-center gap-4 mt-2">
              <a href="#" className="text-gray-300 hover:text-white transition-colors p-2 bg-white/10 rounded-full hover:bg-white/20">
                <Facebook size={20} />
              </a>
              <a href="#" className="text-gray-300 hover:text-white transition-colors p-2 bg-white/10 rounded-full hover:bg-white/20">
                <Twitter size={20} />
              </a>
              <a href="#" className="text-gray-300 hover:text-white transition-colors p-2 bg-white/10 rounded-full hover:bg-white/20">
                <Instagram size={20} />
              </a>
              <a href="#" className="text-gray-300 hover:text-white transition-colors p-2 bg-white/10 rounded-full hover:bg-white/20">
                <Linkedin size={20} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="flex flex-col gap-4">
            <h4 className="text-lg font-semibold text-white">Quick Links</h4>
            <ul className="flex flex-col gap-3 text-sm text-gray-300">
              <li><a href="#" className="hover:text-white transition-colors hover:underline underline-offset-4">Find Internships</a></li>
              <li><a href="#" className="hover:text-white transition-colors hover:underline underline-offset-4">Job Opportunities</a></li>
              <li><a href="#" className="hover:text-white transition-colors hover:underline underline-offset-4">Career Fairs</a></li>
              <li><a href="#" className="hover:text-white transition-colors hover:underline underline-offset-4">Partner with us</a></li>
              <li><a href="#" className="hover:text-white transition-colors hover:underline underline-offset-4">About Us</a></li>
            </ul>
          </div>

          {/* Resources */}
          <div className="flex flex-col gap-4">
            <h4 className="text-lg font-semibold text-white">Resources</h4>
            <ul className="flex flex-col gap-3 text-sm text-gray-300">
              <li><a href="#" className="hover:text-white transition-colors hover:underline underline-offset-4">Help Center</a></li>
              <li><a href="#" className="hover:text-white transition-colors hover:underline underline-offset-4">Career Guide</a></li>
              <li><a href="#" className="hover:text-white transition-colors hover:underline underline-offset-4">Resume Builder</a></li>
              <li><a href="#" className="hover:text-white transition-colors hover:underline underline-offset-4">Interview Tips</a></li>
              <li><a href="#" className="hover:text-white transition-colors hover:underline underline-offset-4">Blog</a></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="flex flex-col gap-4">
            <h4 className="text-lg font-semibold text-white">Contact Us</h4>
            <ul className="flex flex-col gap-4 text-sm text-gray-300">
              <li className="flex items-start gap-3">
                <MapPin size={20} className="text-white shrink-0 mt-0.5" />
                <span>123 Innovation Drive, Tech Park, Bangalore, India 560001</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone size={20} className="text-white shrink-0" />
                <span>+91 98765 43210</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail size={20} className="text-white shrink-0" />
                <span>support@careerfair.com</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-white/20 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-gray-300">
          <p>© {new Date().getFullYear()} CareerFair. All rights reserved.</p>
          <div className="flex gap-6">
            <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-white transition-colors">Cookie Settings</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
