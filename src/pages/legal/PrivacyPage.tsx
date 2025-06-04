
import React from 'react';
import Layout from '../../components/layout/Layout';

const PrivacyPage: React.FC = () => {
  return (
    <Layout>
      <div className="page-container">
        <div className="max-w-4xl mx-auto">
          <h1 className="section-title text-center mb-8">Política de Privacidade</h1>
          <p className="text-sm text-gray-500 text-center mb-12">
            Última atualização: {new Date().toLocaleDateString('pt-BR')}
          </p>

          <div className="prose prose-lg max-w-none">
            <section className="mb-8">
              <h2 className="text-xl font-semibold mb-4 text-gray-900">1. Informações que Coletamos</h2>
              <div className="text-gray-600 leading-relaxed mb-4">
                Coletamos as seguintes informações:
                <ul className="list-disc ml-6 mt-2">
                  <li><strong>Informações de conta:</strong> nome, email, telefone, dados bancários para pagamento</li>
                  <li><strong>Conteúdo musical:</strong> arquivos de áudio, metadados, arte da capa</li>
                  <li><strong>Dados de uso:</strong> como você usa nossa plataforma, preferências, histórico de atividades</li>
                  <li><strong>Informações técnicas:</strong> endereço IP, tipo de navegador, sistema operacional</li>
                </ul>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold mb-4 text-gray-900">2. Como Usamos Suas Informações</h2>
              <div className="text-gray-600 leading-relaxed mb-4">
                Usamos suas informações para:
                <ul className="list-disc ml-6 mt-2">
                  <li>Fornecer e melhorar nossos serviços de distribuição</li>
                  <li>Processar pagamentos e royalties</li>
                  <li>Comunicar sobre seu conta e serviços</li>
                  <li>Oferecer suporte técnico</li>
                  <li>Cumprir obrigações legais e regulamentares</li>
                  <li>Prevenir fraudes e garantir a segurança</li>
                </ul>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold mb-4 text-gray-900">3. Compartilhamento de Informações</h2>
              <p className="text-gray-600 leading-relaxed mb-4">
                Não vendemos suas informações pessoais. Podemos compartilhar informações com:
              </p>
              <div className="text-gray-600 leading-relaxed mb-4">
                <ul className="list-disc ml-6">
                  <li><strong>Plataformas de streaming:</strong> para distribuição do seu conteúdo</li>
                  <li><strong>Processadores de pagamento:</strong> para processar royalties</li>
                  <li><strong>Provedores de serviços:</strong> que nos ajudam a operar a plataforma</li>
                  <li><strong>Autoridades legais:</strong> quando exigido por lei</li>
                </ul>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold mb-4 text-gray-900">4. Segurança dos Dados</h2>
              <p className="text-gray-600 leading-relaxed mb-4">
                Implementamos medidas de segurança técnicas e organizacionais para proteger suas informações, incluindo criptografia, controles de acesso e monitoramento regular de segurança.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold mb-4 text-gray-900">5. Seus Direitos (LGPD)</h2>
              <div className="text-gray-600 leading-relaxed mb-4">
                Conforme a Lei Geral de Proteção de Dados (LGPD), você tem direito a:
                <ul className="list-disc ml-6 mt-2">
                  <li>Acessar seus dados pessoais</li>
                  <li>Corrigir dados incompletos ou incorretos</li>
                  <li>Solicitar a exclusão de dados desnecessários</li>
                  <li>Revogar consentimento</li>
                  <li>Solicitar portabilidade dos dados</li>
                  <li>Ser informado sobre o uso de seus dados</li>
                </ul>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold mb-4 text-gray-900">6. Cookies e Tecnologias Similares</h2>
              <p className="text-gray-600 leading-relaxed mb-4">
                Usamos cookies e tecnologias similares para melhorar sua experiência, analisar o uso da plataforma e personalizar conteúdo. Você pode gerenciar suas preferências de cookies nas configurações do seu navegador.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold mb-4 text-gray-900">7. Retenção de Dados</h2>
              <p className="text-gray-600 leading-relaxed mb-4">
                Mantemos suas informações pelo tempo necessário para fornecer nossos serviços e cumprir obrigações legais. Dados de conta são mantidos enquanto sua conta estiver ativa ou conforme necessário para fins legais.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold mb-4 text-gray-900">8. Transferências Internacionais</h2>
              <p className="text-gray-600 leading-relaxed mb-4">
                Como distribuímos música globalmente, suas informações podem ser transferidas para outros países. Garantimos que essas transferências atendam aos padrões de proteção de dados aplicáveis.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold mb-4 text-gray-900">9. Menores de Idade</h2>
              <p className="text-gray-600 leading-relaxed mb-4">
                Nossos serviços não são direcionados a menores de 18 anos. Se você é menor de idade, precisará do consentimento dos pais ou responsáveis para usar nossa plataforma.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold mb-4 text-gray-900">10. Alterações nesta Política</h2>
              <p className="text-gray-600 leading-relaxed mb-4">
                Podemos atualizar esta política periodicamente. Notificaremos sobre mudanças significativas por email ou através de aviso em nossa plataforma.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold mb-4 text-gray-900">11. Contato - Encarregado de Dados</h2>
              <p className="text-gray-600 leading-relaxed">
                Para exercer seus direitos ou esclarecer dúvidas sobre esta política, entre em contato com nosso Encarregado de Proteção de Dados:
                <br />
                Email: privacidade@soundmusic.com.br
                <br />
                WhatsApp: +55 11 91092-3929
              </p>
            </section>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default PrivacyPage;
