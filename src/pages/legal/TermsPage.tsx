
import React from 'react';
import Layout from '../../components/layout/Layout';

const TermsPage: React.FC = () => {
  return (
    <Layout>
      <div className="page-container">
        <div className="max-w-4xl mx-auto">
          <h1 className="section-title text-center mb-8">Termos de Serviço</h1>
          <p className="text-sm text-gray-500 text-center mb-12">
            Última atualização: {new Date().toLocaleDateString('pt-BR')}
          </p>

          <div className="prose prose-lg max-w-none">
            <section className="mb-8">
              <h2 className="text-xl font-semibold mb-4 text-gray-900">1. Aceitação dos Termos</h2>
              <p className="text-gray-600 leading-relaxed mb-4">
                Ao acessar e usar os serviços da SOUNDMUSIC, você concorda em cumprir e estar vinculado a estes Termos de Serviço. Se você não concordar com qualquer parte destes termos, não deve usar nossos serviços.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold mb-4 text-gray-900">2. Descrição do Serviço</h2>
              <p className="text-gray-600 leading-relaxed mb-4">
                A SOUNDMUSIC é uma plataforma de distribuição digital de música que permite aos artistas distribuir seu conteúdo musical para diversas plataformas de streaming e download digital em todo o mundo.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold mb-4 text-gray-900">3. Elegibilidade</h2>
              <p className="text-gray-600 leading-relaxed mb-4">
                Para usar nossos serviços, você deve ter pelo menos 18 anos de idade ou ter o consentimento dos pais/responsáveis. Você deve fornecer informações precisas e completas durante o registro.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold mb-4 text-gray-900">4. Direitos Autorais e Conteúdo</h2>
              <p className="text-gray-600 leading-relaxed mb-4">
                Você declara e garante que possui todos os direitos necessários sobre o conteúdo musical que enviar, incluindo direitos autorais, direitos de performance e direitos de sincronização. Você é responsável por obter todas as licenças e autorizações necessárias.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold mb-4 text-gray-900">5. Pagamentos e Royalties</h2>
              <p className="text-gray-600 leading-relaxed mb-4">
                Os royalties são calculados com base nas receitas líquidas recebidas das plataformas de distribuição. Os pagamentos são realizados mensalmente, sujeitos a um valor mínimo de pagamento. A SOUNDMUSIC retém uma porcentagem dos royalties conforme especificado em seu plano de serviço.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold mb-4 text-gray-900">6. Proibições</h2>
              <div className="text-gray-600 leading-relaxed mb-4">
                É proibido:
                <ul className="list-disc ml-6 mt-2">
                  <li>Enviar conteúdo que viole direitos autorais de terceiros</li>
                  <li>Usar a plataforma para atividades ilegais</li>
                  <li>Tentar hackear ou comprometer a segurança do sistema</li>
                  <li>Criar múltiplas contas para o mesmo conteúdo</li>
                  <li>Enviar conteúdo com vírus ou código malicioso</li>
                </ul>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold mb-4 text-gray-900">7. Rescisão</h2>
              <p className="text-gray-600 leading-relaxed mb-4">
                Você pode encerrar sua conta a qualquer momento. A SOUNDMUSIC se reserva o direito de suspender ou encerrar contas que violem estes termos. Após o encerramento, seu conteúdo será removido das plataformas de distribuição.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold mb-4 text-gray-900">8. Limitação de Responsabilidade</h2>
              <p className="text-gray-600 leading-relaxed mb-4">
                A SOUNDMUSIC não será responsável por danos indiretos, incidentais ou consequenciais. Nossa responsabilidade máxima será limitada ao valor pago por você nos últimos 12 meses.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold mb-4 text-gray-900">9. Modificações dos Termos</h2>
              <p className="text-gray-600 leading-relaxed mb-4">
                Podemos modificar estes termos a qualquer momento. As alterações serão comunicadas por email e entrarão em vigor 30 dias após a notificação.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold mb-4 text-gray-900">10. Lei Aplicável</h2>
              <p className="text-gray-600 leading-relaxed mb-4">
                Estes termos são regidos pelas leis brasileiras. Qualquer disputa será resolvida nos tribunais competentes do Brasil.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold mb-4 text-gray-900">11. Contato</h2>
              <p className="text-gray-600 leading-relaxed">
                Para dúvidas sobre estes termos, entre em contato conosco através do WhatsApp: +55 11 91092-3929 ou pelo email: contato@soundmusic.com.br
              </p>
            </section>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default TermsPage;
