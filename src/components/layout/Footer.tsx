import Link from "next/link";
import Image from "next/image";
import { Globe, MessageCircle, Share2, Mail } from "lucide-react";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-primary-dark text-gray-300 pt-16 pb-8">
      <div className="w-full px-4 sm:px-6 lg:px-12 xl:px-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8 mb-16">
          
          {/* Brand & Tagline */}
          <div className="flex flex-col items-center md:items-start text-center md:text-left gap-6">
            <Link href="/" className="inline-block">
              <div className="bg-white p-2 rounded-md w-fit mx-auto md:mx-0">
                <Image
                  src="/logo.jpg"
                  alt="Aashray Infotech Logo"
                  width={140}
                  height={40}
                  className="w-auto h-8 object-contain rounded-sm"
                />
              </div>
            </Link>
            <div>
              <p className="text-gray-400 font-medium tracking-wide uppercase mb-2 text-sm">
                Aashray Infotech
              </p>
              <p className="text-gray-300 font-sans leading-relaxed">
                DPDP compliance, on your own infrastructure. Designed & Engineered in India.
              </p>
            </div>
          </div>

          {/* Quick Links */}
          <div className="text-center md:text-left">
            <h3 className="text-white font-semibold mb-6">Quick Links</h3>
            <ul className="space-y-4">
              <li><Link href="#about" className="hover:text-white transition-colors text-sm">About Us</Link></li>
              <li><Link href="#products" className="hover:text-white transition-colors text-sm">Products</Link></li>
              <li><Link href="/learning" className="hover:text-white transition-colors text-sm">Learning</Link></li>
              <li><Link href="/book-a-demo" className="hover:text-white transition-colors text-sm">Request a Demo</Link></li>
            </ul>
          </div>

          {/* Explore */}
          <div className="text-center md:text-left">
            <h3 className="text-white font-semibold mb-6">Explore</h3>
            <ul className="space-y-4">
              <li><Link href="/privacy-policy" className="hover:text-white transition-colors text-sm">Privacy Policy</Link></li>
              <li><Link href="/cookie-policy" className="hover:text-white transition-colors text-sm">Cookie Policy</Link></li>
              <li><Link href="/terms" className="hover:text-white transition-colors text-sm">Terms of Service</Link></li>
              <li>
                <button 
                  id="open-cookie-settings" 
                  className="hover:text-white transition-colors text-sm"
                >
                  Cookie Settings
                </button>
              </li>
            </ul>
          </div>

          {/* Contact Us */}
          <div className="text-center md:text-left">
            <h3 className="text-white font-semibold mb-6">Contact Us</h3>
            <div className="flex items-center justify-center md:justify-start gap-4 mb-6">
              <a href="#" className="w-10 h-10 rounded-full border border-gray-600 flex items-center justify-center text-gray-400 hover:text-white hover:border-white transition-colors">
                <Globe className="w-4 h-4" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full border border-gray-600 flex items-center justify-center text-gray-400 hover:text-white hover:border-white transition-colors">
                <MessageCircle className="w-4 h-4" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full border border-gray-600 flex items-center justify-center text-gray-400 hover:text-white hover:border-white transition-colors">
                <Share2 className="w-4 h-4" />
              </a>
            </div>
            
            <a href="mailto:support@aashrayinfotech.com" className="flex items-center justify-center md:justify-start gap-3 text-gray-400 hover:text-white transition-colors text-sm group mt-4">
              <span className="p-2 bg-white/5 rounded-full group-hover:bg-primary transition-colors shrink-0">
                <Mail className="w-4 h-4 text-accent" />
              </span>
              support@aashrayinfotech.com
            </a>

            <div className="mt-6 text-sm text-gray-400 space-y-4 text-left">
              <div>
                <strong className="text-gray-300 block mb-1">Corporate Office:</strong>
                UNIT NO. 902 NINTH FLOOR BLOCK A, UNITECH - THE ARCADIA, SOUTH CITY-2, GURGAON, Haryana, India - 122018.
              </div>
              <div>
                <strong className="text-gray-300 block mb-1">Registered Office:</strong>
                C-80, UGF, SHIVAJI PARK, WEST PUNJABI BAGH, Shivaji Park (West Delhi), New Delhi, West Delhi- 110026, Delhi
              </div>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-gray-800 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-gray-500 text-center md:text-left">
            &copy; {currentYear} Aashray Infotech Private Limited. All rights reserved.
          </p>
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <span className="w-2 h-2 rounded-full bg-accent"></span>
            DPDP Compliant Platform
          </div>
        </div>
      </div>
    </footer>
  );
}
