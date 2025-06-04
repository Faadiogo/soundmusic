import React from 'react';
import { Link } from 'react-router-dom';
import { Music, Users, BarChart3, Quote } from 'lucide-react';
import Button from '../components/ui/Button';
import { motion } from 'framer-motion';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';

const Home: React.FC = () => {
  return (
    <div className="bg-white text-black">
      <Navbar />

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-black text-white">
        {/* Background animated bars */}
        <div className="absolute inset-0 opacity-15 pointer-events-none">
          <div className="flex justify-around h-full items-center">
            {[...Array(30)].map((_, i) => (
              <div
                key={i}
                className="w-1 h-28 bg-yellow-200 rounded-full mx-1 animate-sound-wave"
                style={{ animationDelay: `${i * 0.2}s` }}
              />
            ))}
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32 relative z-10">
          <div className="max-w-3xl">
            <motion.h1
              className="text-4xl md:text-5xl lg:text-6xl font-display font-bold mb-6 text-yellow-500"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              Distribua suas músicas em todas a plataformas de streaming para o mundo todo
            </motion.h1>
            <motion.p
              className="text-xl md:text-2xl mb-8 text-white"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              A SoundMusic conecta artistas independentes às maiores plataformas de streaming, mantendo você no controle da sua carreira musical.
            </motion.p>
            <motion.div
              className="flex flex-col sm:flex-row gap-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <Link to="/register">
                <Button size="lg" variant="accent" className="bg-yellow-500 text-black hover:bg-yellow-300 font-extrabold">
                  Quero lançar minha música
                </Button>
              </Link>
              <Link to="/login">
                <Button
                  size="lg"
                  variant="outline"
                  className="border-yellow-500 text-black hover:bg-gray-400 hover:text-black font-bold"
                >
                  Já tenho uma conta
                </Button>
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 md:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">Por que escolher a SOUNDMUSIC</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Fornecemos tudo que você precisa para lançar e acompanhar o desempenho das suas músicas
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <motion.div className="bg-white p-8 rounded-xl shadow-md" whileHover={{ y: -10 }}>
              <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center text-yellow-600 mb-6">
                <Music size={24} />
              </div>
              <h3 className="text-xl font-bold mb-3">Distribuição Global</h3>
              <p className="text-gray-600">
                Leve sua música para todas as principais plataformas como Spotify, TikTok, YouTube Music e mais.
              </p>
            </motion.div>

            <motion.div className="bg-white p-8 rounded-xl shadow-md" whileHover={{ y: -10 }} transition={{ delay: 0.05 }}>
              <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center text-yellow-600 mb-6">
                <Users size={24} />
              </div>
              <h3 className="text-xl font-bold mb-3">Gestão de Royalties</h3>
              <p className="text-gray-600">
                Divisão transparente de royalties entre compositores, cantores e produtores de forma simples e justa.
              </p>
            </motion.div>

            <motion.div className="bg-white p-8 rounded-xl shadow-md" whileHover={{ y: -10 }} transition={{ delay: 0.1 }}>
              <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center text-yellow-600 mb-6">
                <BarChart3 size={24} />
              </div>
              <h3 className="text-xl font-bold mb-3">Estatísticas Detalhadas</h3>
              <p className="text-gray-600">
                Acompanhe o desempenho da sua música com métricas claras e insights para crescer sua carreira musical.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="bg-gray-100 py-16">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl font-display font-bold text-center mb-12">O que os artistas dizem</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            {[
              { name: "Mc Pogba", quote: "Com a SOUNDMUSIC consegui distribuir minhas faixas no mundo todo sem complicações!" },
              { name: "MC D'lara", quote: "A transparência e suporte são impecáveis. Confio de olhos fechados." },
              { name: "DJ Tchouzen", quote: "Plataforma simples, eficiente e com ótimos relatórios!" }
            ].map(({ name, quote }) => (
              <motion.div key={name} className="bg-white p-6 rounded-lg shadow" whileHover={{ scale: 1.03 }}>
                <Quote className="mx-auto text-yellow-500 mb-4" size={32} />
                <p className="italic text-gray-700 mb-4">"{quote}"</p>
                <p className="font-semibold text-primary-900">{name}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-black text-white py-16">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">
            Pronto para lançar sua música?
          </h2>
          <p className="text-xl mb-8 max-w-3xl mx-auto text-yellow-100">
            Junte-se a milhares de artistas independentes que estão construindo carreiras de sucesso com a SOUNDMUSIC.
          </p>
          <Link to="/register">
            <Button size="lg" variant="primary" className="bg-yellow-500 font-extrabold hover:bg-yellow-300 hover:text-black">
              Comece agora
            </Button>
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Home;
