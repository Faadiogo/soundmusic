
import React from 'react';
import Layout from '../../components/layout/Layout';
import { MessageCircle, Mail, Phone, Clock, HelpCircle, FileText, Music, CreditCard } from 'lucide-react';

const HelpPage: React.FC = () => {
  const helpTopics = [
    {
      icon: <Music className="text-yellow-500" size={24} />,
      title: "Distribuição de Música",
      description: "Como enviar suas músicas e distribuir para plataformas de streaming",
      topics: ["Upload de arquivos", "Metadados obrigatórios", "Formatos aceitos", "Tempo de distribuição"]
    },
    {
      icon: <CreditCard className="text-green-500" size={24} />,
      title: "Pagamentos e Royalties",
      description: "Informações sobre como receber seus royalties",
      topics: ["Quando recebo os pagamentos", "Como são calculados os royalties", "Métodos de pagamento", "Relatórios financeiros"]
    },
    {
      icon: <FileText className="text-blue-500" size={24} />,
      title: "Gerenciamento de Conta",
      description: "Como gerenciar seu perfil e configurações",
      topics: ["Atualizar informações pessoais", "Alterar dados bancários", "Configurações de privacidade", "Histórico de lançamentos"]
    },
    {
      icon: <HelpCircle className="text-purple-500" size={24} />,
      title: "Problemas Técnicos",
      description: "Soluções para problemas comuns da plataforma",
      topics: ["Erro no upload", "Login/senha", "Problemas de visualização", "Performance da plataforma"]
    }
  ];

  return (
    <Layout>
      <div className="page-container">
        <div className="max-w-6xl mx-auto">
          <h1 className="section-title text-center mb-8">Central de Ajuda</h1>
          <p className="text-lg text-gray-600 text-center mb-12">
            Estamos aqui para ajudar você a aproveitar ao máximo nossa plataforma de distribuição musical.
          </p>

          {/* Contatos de Suporte */}
          <div className="grid md:grid-cols-3 gap-6 mb-12">
            <div className="card text-center">
              <MessageCircle className="mx-auto text-green-500 mb-4" size={32} />
              <h3 className="text-lg font-semibold mb-2">WhatsApp</h3>
              <p className="text-gray-600 mb-4">Suporte rápido via WhatsApp</p>
              <a
                href="https://wa.me/5511910923929?text=Olá,%20preciso%20de%20ajuda%20com%20a%20plataforma"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary inline-block"
              >
                Iniciar Chat
              </a>
            </div>

            <div className="card text-center">
              <Mail className="mx-auto text-blue-500 mb-4" size={32} />
              <h3 className="text-lg font-semibold mb-2">Email</h3>
              <p className="text-gray-600 mb-4">Suporte por email</p>
              <a
                href="mailto:suporte@soundmusic.com.br"
                className="btn-primary inline-block"
              >
                Enviar Email
              </a>
            </div>

            <div className="card text-center">
              <Clock className="mx-auto text-yellow-500 mb-4" size={32} />
              <h3 className="text-lg font-semibold mb-2">Horário de Atendimento</h3>
              <p className="text-gray-600">
                Segunda a Sexta: 9h às 18h<br />
                Sábados: 9h às 14h
              </p>
            </div>
          </div>

          {/* Tópicos de Ajuda */}
          <h2 className="text-2xl font-bold text-center mb-8">Tópicos de Ajuda</h2>
          <div className="grid md:grid-cols-2 gap-6 mb-12">
            {helpTopics.map((topic, index) => (
              <div key={index} className="card">
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0">
                    {topic.icon}
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold mb-2">{topic.title}</h3>
                    <p className="text-gray-600 mb-4">{topic.description}</p>
                    <ul className="text-sm text-gray-500 space-y-1">
                      {topic.topics.map((item, itemIndex) => (
                        <li key={itemIndex} className="flex items-center">
                          <span className="w-1 h-1 bg-yellow-500 rounded-full mr-2"></span>
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Guias Rápidos */}
          <div className="bg-gray-50 rounded-lg p-8 mb-12">
            <h2 className="text-2xl font-bold text-center mb-8">Guias Rápidos</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="bg-white rounded-lg p-6 text-center">
                <h3 className="font-semibold mb-2">Primeiro Lançamento</h3>
                <p className="text-sm text-gray-600 mb-4">Passo a passo para seu primeiro upload</p>
                <button className="text-yellow-500 font-medium hover:underline">
                  Ver Guia
                </button>
              </div>
              
              <div className="bg-white rounded-lg p-6 text-center">
                <h3 className="font-semibold mb-2">Configurar Pagamentos</h3>
                <p className="text-sm text-gray-600 mb-4">Como configurar seus dados para recebimento</p>
                <button className="text-yellow-500 font-medium hover:underline">
                  Ver Guia
                </button>
              </div>
              
              <div className="bg-white rounded-lg p-6 text-center">
                <h3 className="font-semibold mb-2">Entender Relatórios</h3>
                <p className="text-sm text-gray-600 mb-4">Como interpretar seus relatórios de royalties</p>
                <button className="text-yellow-500 font-medium hover:underline">
                  Ver Guia
                </button>
              </div>
            </div>
          </div>

          {/* FAQ Rápido */}
          <div className="card">
            <h2 className="text-xl font-bold mb-6">Perguntas Mais Frequentes</h2>
            <div className="space-y-4">
              <div className="border-b border-gray-200 pb-4">
                <h3 className="font-medium mb-2">Quanto tempo leva para minha música aparecer no Spotify?</h3>
                <p className="text-gray-600 text-sm">Geralmente de 24 a 48 horas após a aprovação do seu lançamento.</p>
              </div>
              
              <div className="border-b border-gray-200 pb-4">
                <h3 className="font-medium mb-2">Quando recebo meus royalties?</h3>
                <p className="text-gray-600 text-sm">Os pagamentos são realizados mensalmente, até o dia 15 do mês seguinte.</p>
              </div>
              
              <div className="border-b border-gray-200 pb-4">
                <h3 className="font-medium mb-2">Posso alterar informações após o lançamento?</h3>
                <p className="text-gray-600 text-sm">Sim, mas algumas alterações podem levar tempo para serem refletidas nas plataformas.</p>
              </div>
              
              <div>
                <h3 className="font-medium mb-2">Como faço para remover uma música?</h3>
                <p className="text-gray-600 text-sm">Você pode solicitar a remoção através do seu painel de controle ou entrando em contato conosco.</p>
              </div>
            </div>
            
            <div className="mt-6 text-center">
              <a href="/faq" className="text-yellow-500 font-medium hover:underline">
                Ver todas as perguntas frequentes →
              </a>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default HelpPage;
