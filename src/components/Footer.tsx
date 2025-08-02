import { Heart, MessageCircle } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

const Footer = () => {
  const { translations, isRTL } = useLanguage();
  const currentYear = new Date().getFullYear();
  
  const whatsappNumber = '+201062772291';
  const whatsappLink = `https://wa.me/${whatsappNumber.replace('+', '')}`;

  return (
    <footer className="bg-slate-900 text-white border-t border-slate-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          
          {/* Copyright */}
          <div className="text-center md:text-left">
            <p className="text-sm text-gray-300">
              © {currentYear} {translations.hero.title}{translations.hero.titleHighlight} {isRTL ? 'جميع الحقوق محفوظة' : 'All rights reserved'}
            </p>
            {/* <p className="text-xs text-gray-400">
              
            </p> */}
          </div>

          {/* Developer Info */}
          <div className="text-center md:text-right">
            <div className="flex items-center justify-center md:justify-end gap-2">
              <a
                href={whatsappLink}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-primary hover:text-accent transition-colors duration-200"
                title={isRTL ? 'تواصل عبر واتساب' : 'Contact via WhatsApp'}
              >
                <MessageCircle className="w-4 h-4" />
                <span className="font-medium">Essam Abo Elmgd</span>
              </a>
              <span className="text-sm text-gray-400">
                {isRTL ? 'طُور بواسطة' : 'Developed by'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
