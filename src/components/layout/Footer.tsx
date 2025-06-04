
import React from 'react';
import { Facebook, Instagram } from 'lucide-react';
import { FaWhatsapp } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const Footer: React.FC = () => {
  return (
    <footer className="bg-yellow-500 text-white">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-2">
            <h2 className="text-2xl font-display font-bold mb-4">SOUNDMUSIC</h2>
            <p className="text-white mb-4 max-w-md">
              Distribua sua música para o mundo todo. Somos a plataforma que conecta artistas 
              às maiores plataformas de streaming.
            </p>
            <div className="flex space-x-4">
              <a href="https://www.facebook.com/share/1BgdHc4q2s/?mibextid=wwXIfr" target='_blank' className="text-white hover:text-white transition-colors">
                <Facebook size={26} color='#2f60f5'/>
              </a>

              <a href="https://www.instagram.com/soundmusicprodutora?igsh=MW0yajE3dWQ2ODQwYg==" target='_blank' className="text-white hover:text-white transition-colors">
                <Instagram size={26} color='#ff268f'/>
              </a>
              <a href="https://wa.me/5511910923929?text=Olá,%20Vim%20pelo%20site%20e%20gostaria%20de%20mais%20informações" target='_blank' className="text-white hover:text-white transition-colors">
                <FaWhatsapp size={26} color="#129e00" />
              </a>
            </div>
          </div>
          <div>
            <h3 className="text-lg font-medium mb-4">Links</h3>
            <ul className="space-y-2">
              <li><a href="#" className="text-white hover:text-white transition-colors">Sobre nós</a></li>
              <li><a href="#" className="text-white hover:text-white transition-colors">Serviços</a></li>
              <li><a href="#" className="text-white hover:text-white transition-colors">Blog</a></li>
              <li><a href="#" className="text-white hover:text-white transition-colors">Contato</a></li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-medium mb-4">Suporte</h3>
            <ul className="space-y-2">
              <li><Link to="/faq" className="text-white hover:text-white transition-colors">FAQ</Link></li>
              <li><Link to="/ajuda" className="text-white hover:text-white transition-colors">Ajuda</Link></li>
              <li><Link to="/termos" className="text-white hover:text-white transition-colors">Termos de Serviço</Link></li>
              <li><Link to="/privacidade" className="text-white hover:text-white transition-colors">Privacidade</Link></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-white mt-8 pt-8 text-sm text-white text-center">
          <p>© {new Date().getFullYear()} SOUNDMUSIC. Todos os direitos reservados. Desenvolvido por <strong>SyncTech.</strong></p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
