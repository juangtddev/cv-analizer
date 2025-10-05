import { Body, Container, Head, Heading, Html, Preview, Text, Button, Section, Row, Column } from 'npm:@react-email/components@0.0.22';
import * as React from 'npm:react@18.3.1';
export const ConfirmationEmail = ({ confirmationUrl, userName = "Usuário" })=>/*#__PURE__*/ React.createElement(Html, null, /*#__PURE__*/ React.createElement(Head, null), /*#__PURE__*/ React.createElement(Preview, null, "Confirme seu email para acessar o CV Analyzer"), /*#__PURE__*/ React.createElement(Body, {
    style: main
  }, /*#__PURE__*/ React.createElement(Container, {
    style: container
  }, /*#__PURE__*/ React.createElement(Section, {
    style: header
  }, /*#__PURE__*/ React.createElement(Row, null, /*#__PURE__*/ React.createElement(Column, null, /*#__PURE__*/ React.createElement(Heading, {
    style: h1
  }, "🎯 CV Analyzer"), /*#__PURE__*/ React.createElement(Text, {
    style: headerSubtitle
  }, "Plataforma Inteligente de Análise de Currículos")))), /*#__PURE__*/ React.createElement(Section, {
    style: content
  }, /*#__PURE__*/ React.createElement(Heading, {
    style: h2
  }, "🎉 Confirme seu email"), /*#__PURE__*/ React.createElement(Text, {
    style: text
  }, "Olá ", /*#__PURE__*/ React.createElement("strong", null, userName), ", bem-vindo(a) ao ", /*#__PURE__*/ React.createElement("strong", null, "CV Analyzer"), "!"), /*#__PURE__*/ React.createElement(Text, {
    style: text
  }, "Estamos muito felizes em ter você conosco. Para garantir a segurança da sua conta e liberar o acesso completo à nossa plataforma, precisamos confirmar seu endereço de email."), /*#__PURE__*/ React.createElement(Section, {
    style: buttonContainer
  }, /*#__PURE__*/ React.createElement(Button, {
    href: confirmationUrl,
    style: button
  }, "✅ Confirmar Meu Email")), /*#__PURE__*/ React.createElement(Section, {
    style: securityNote
  }, /*#__PURE__*/ React.createElement(Text, {
    style: securityText
  }, /*#__PURE__*/ React.createElement("strong", null, "🔒 Importante para sua segurança:"), " Este link é válido por 24 horas e só pode ser usado uma vez. Se você não fez este cadastro, pode ignorar este email com segurança.")), /*#__PURE__*/ React.createElement(Section, {
    style: featuresSection
  }, /*#__PURE__*/ React.createElement(Heading, {
    style: h3
  }, "🚀 O que você terá acesso após a confirmação:"), /*#__PURE__*/ React.createElement(Text, {
    style: featureItem
  }, "📝 ", /*#__PURE__*/ React.createElement("strong", null, "Análise Inteligente de Currículos"), " - IA avançada para otimização"), /*#__PURE__*/ React.createElement(Text, {
    style: featureItem
  }, "🎯 ", /*#__PURE__*/ React.createElement("strong", null, "Simulador de Entrevistas"), " - Pratique com cenários reais"), /*#__PURE__*/ React.createElement(Text, {
    style: featureItem
  }, "📊 ", /*#__PURE__*/ React.createElement("strong", null, "Relatórios Detalhados"), " - Insights personalizados"), /*#__PURE__*/ React.createElement(Text, {
    style: featureItem
  }, "💼 ", /*#__PURE__*/ React.createElement("strong", null, "Sistema de Vagas"), " - Gerencie oportunidades"), /*#__PURE__*/ React.createElement(Text, {
    style: featureItem
  }, "📈 ", /*#__PURE__*/ React.createElement("strong", null, "Histórico Completo"), " - Acompanhe seu progresso"), /*#__PURE__*/ React.createElement(Text, {
    style: featureItem
  }, "💳 ", /*#__PURE__*/ React.createElement("strong", null, "Validação de Pagamentos"), " - Sistema seguro integrado")), /*#__PURE__*/ React.createElement(Text, {
    style: text
  }, /*#__PURE__*/ React.createElement("strong", null, "Problemas com o botão?"), " Copie e cole este link no seu navegador:"), /*#__PURE__*/ React.createElement(Text, {
    style: linkBackup
  }, confirmationUrl), /*#__PURE__*/ React.createElement(Text, {
    style: text
  }, "Qualquer dúvida, estamos aqui para ajudar! 💪")), /*#__PURE__*/ React.createElement(Section, {
    style: footer
  }, /*#__PURE__*/ React.createElement(Text, {
    style: footerBrand
  }, "CV Analyzer"), /*#__PURE__*/ React.createElement(Text, {
    style: footerText
  }, "© 2024 - Transformando currículos em oportunidades"), /*#__PURE__*/ React.createElement(Text, {
    style: footerText
  }, "Este email foi enviado porque você se cadastrou em nossa plataforma.")))));
export default ConfirmationEmail;
// Styles
const main = {
  backgroundColor: '#f9fafb',
  fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", system-ui, sans-serif'
};
const container = {
  margin: '0 auto',
  padding: '20px',
  maxWidth: '600px'
};
const header = {
  background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
  borderRadius: '12px 12px 0 0',
  padding: '40px 30px',
  textAlign: 'center'
};
const h1 = {
  color: '#ffffff',
  fontSize: '32px',
  fontWeight: '700',
  margin: '0',
  textShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
};
const headerSubtitle = {
  color: 'rgba(255, 255, 255, 0.9)',
  fontSize: '16px',
  margin: '10px 0 0 0'
};
const content = {
  backgroundColor: '#ffffff',
  padding: '50px 40px',
  borderRadius: '0 0 12px 12px',
  boxShadow: '0 8px 25px rgba(0, 0, 0, 0.1)'
};
const h2 = {
  color: '#1f2937',
  fontSize: '26px',
  fontWeight: '600',
  marginBottom: '25px'
};
const h3 = {
  color: '#1f2937',
  fontSize: '18px',
  fontWeight: '600',
  marginBottom: '15px'
};
const text = {
  color: '#6b7280',
  fontSize: '16px',
  lineHeight: '1.6',
  marginBottom: '20px'
};
const buttonContainer = {
  textAlign: 'center',
  margin: '35px 0'
};
const button = {
  background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
  color: '#ffffff',
  padding: '18px 36px',
  borderRadius: '12px',
  textDecoration: 'none',
  fontWeight: '600',
  fontSize: '16px',
  display: 'inline-block',
  boxShadow: '0 4px 15px rgba(99, 102, 241, 0.4)'
};
const securityNote = {
  background: 'linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%)',
  border: '1px solid #93c5fd',
  borderRadius: '8px',
  padding: '20px',
  margin: '25px 0'
};
const securityText = {
  color: '#1e40af',
  fontSize: '14px',
  fontWeight: '500',
  margin: '0'
};
const featuresSection = {
  backgroundColor: '#f8fafc',
  borderRadius: '8px',
  padding: '25px',
  margin: '25px 0'
};
const featureItem = {
  color: '#4b5563',
  fontSize: '15px',
  marginBottom: '8px'
};
const linkBackup = {
  backgroundColor: '#f3f4f6',
  borderRadius: '6px',
  padding: '15px',
  margin: '20px 0',
  wordBreak: 'break-all',
  fontFamily: '"SF Mono", Monaco, "Cascadia Code", "Roboto Mono", Consolas, "Courier New", monospace',
  fontSize: '12px',
  color: '#374151',
  border: '1px solid #d1d5db'
};
const footer = {
  background: 'linear-gradient(135deg, #f9fafb 0%, #f3f4f6 100%)',
  padding: '30px',
  textAlign: 'center',
  borderTop: '1px solid #e5e7eb',
  borderRadius: '0 0 12px 12px'
};
const footerBrand = {
  color: '#6b7280',
  fontWeight: '600',
  fontSize: '16px',
  margin: '5px 0'
};
const footerText = {
  color: '#9ca3af',
  fontSize: '14px',
  margin: '5px 0'
};
