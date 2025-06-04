
import React from 'react';
import Layout from '../../components/layout/Layout';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { useState } from 'react';

const FAQPage: React.FC = () => {
  const [openItems, setOpenItems] = useState<number[]>([]);

  const toggleItem = (index: number) => {
    setOpenItems(prev =>
      prev.includes(index)
        ? prev.filter(i => i !== index)
        : [...prev, index]
    );
  };

  const faqs = [
    {
      question: "Como funciona a distribuição de música?",
      answer: "Nossa plataforma distribui sua música para mais de 150 plataformas digitais globalmente, incluindo Spotify, Apple Music, Amazon Music, Deezer e muitas outras. O processo é simples: você faz upload da sua música, nós cuidamos de toda a distribuição e você recebe os royalties."
    },
    {
      question: "Quanto tempo leva para minha música aparecer nas plataformas?",
      answer: "Geralmente, sua música aparece nas principais plataformas em 24-48 horas após a aprovação. Algumas plataformas podem levar até 7 dias. Recomendamos sempre programar seus lançamentos com pelo menos uma semana de antecedência."
    },
    {
      question: "Qual é a porcentagem que vocês ficam dos royalties?",
      answer: "Mantemos uma taxa competitiva que varia de acordo com o plano escolhido. Com nosso plano básico, você mantém 85% dos royalties, e com planos premium, você pode manter até 95%. Não há taxas ocultas - você sempre saberá exatamente quanto receberá."
    },
    {
      question: "Posso distribuir música de qualquer gênero?",
      answer: "Sim! Aceitamos todos os gêneros musicais, desde pop e rock até música eletrônica, hip-hop, música clássica, regional e muito mais. Nossa plataforma é inclusiva e valoriza a diversidade musical."
    },
    {
      question: "Como recebo meus royalties?",
      answer: "Os royalties são pagos mensalmente via PIX ou transferência bancária. Você pode acompanhar seus ganhos em tempo real através do seu dashboard e recebe relatórios detalhados de reproduções e receita de cada plataforma."
    },
    {
      question: "Posso remover minha música das plataformas quando quiser?",
      answer: "Sim, você tem controle total sobre seu catálogo. Pode remover faixas a qualquer momento através do seu painel de controle. A remoção geralmente leva de 24-48 horas para ser efetivada em todas as plataformas."
    },
    {
      question: "Vocês oferecem suporte para criação de arte da capa?",
      answer: "Oferecemos orientações sobre especificações técnicas e melhores práticas para arte de capa. Para planos premium, temos parcerias com designers gráficos que podem criar capas profissionais por um custo adicional."
    },
    {
      question: "Minha música precisa estar masterizada?",
      answer: "Recomendamos que sua música esteja masterizada para melhor qualidade, mas não é obrigatório. Oferecemos serviços de masterização através de nossos parceiros para garantir que sua música tenha a melhor qualidade possível."
    }
  ];

  return (
    <Layout>
      <div className="page-container">
        <div className="max-w-4xl mx-auto">
          <h1 className="section-title text-center mb-8">Perguntas Frequentes (FAQ)</h1>
          <p className="text-lg text-gray-600 text-center mb-12">
            Encontre respostas para as dúvidas mais comuns sobre nossos serviços de distribuição musical.
          </p>

          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div key={index} className="card">
                <button
                  onClick={() => toggleItem(index)}
                  className="w-full px-6 py-4 flex justify-between items-center text-left hover:bg-gray-50 transition-colors"
                >
                  <h3 className="text-lg font-medium text-gray-900 pr-4">
                    {faq.question}
                  </h3>
                  {openItems.includes(index) ? (
                    <ChevronUp className="flex-shrink-0 text-yellow-500" size={20} />
                  ) : (
                    <ChevronDown className="flex-shrink-0 text-yellow-500" size={20} />
                  )}
                </button>
                {openItems.includes(index) && (
                  <div className="px-6 pb-4">
                    <p className="text-gray-600 leading-relaxed">
                      {faq.answer}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="mt-12 text-center">
            <p className="text-gray-600 mb-4">
              Não encontrou a resposta que procurava?
            </p>
            <a
              href="https://wa.me/5511910923929?text=Olá,%20tenho%20uma%20dúvida%20sobre%20os%20serviços"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary inline-block"
            >
              Entre em Contato
            </a>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default FAQPage;
