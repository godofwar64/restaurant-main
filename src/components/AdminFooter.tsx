import { MessageCircle, Shield } from 'lucide-react';

const AdminFooter = () => {
  const currentYear = new Date().getFullYear();
  
  const whatsappNumber = '+201062772291';
  const whatsappLink = `https://wa.me/${whatsappNumber.replace('+', '')}`;

  return (
    <footer className="bg-slate-800 text-white border-t border-slate-600 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          
          {/* Admin Panel Info */}
          <div className="text-center md:text-left flex items-center gap-2">
            <Shield className="w-4 h-4 text-blue-400" />
            <div>
              <p className="text-sm text-gray-300">
                Admin Panel © {currentYear}
              </p>
              <p className="text-xs text-gray-400">
                Restaurant Management System
              </p>
            </div>
          </div>

          {/* Developer Info */}
          <div className="text-center md:text-right">
            <div className="flex items-center justify-center md:justify-end gap-2">
              <a
                href={whatsappLink}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-blue-400 hover:text-blue-300 transition-colors duration-200"
                title="Contact via WhatsApp"
              >
                <MessageCircle className="w-4 h-4" />
                <span className="font-medium">Essam Abo Elmgd</span>
              </a>
              <span className="text-sm text-gray-400">
                Developed by
              </span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default AdminFooter;
