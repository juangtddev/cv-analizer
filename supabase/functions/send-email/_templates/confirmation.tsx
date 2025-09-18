import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Link,
  Preview,
  Text,
  Button,
  Section,
  Row,
  Column,
  Img
} from 'npm:@react-email/components@0.0.22'
import * as React from 'npm:react@18.3.1'

interface ConfirmationEmailProps {
  confirmationUrl: string
  userName?: string
}

export const ConfirmationEmail = ({
  confirmationUrl,
  userName = "Usuário"
}: ConfirmationEmailProps) => (
  <Html>
    <Head />
    <Preview>Confirme seu email para acessar o CV Analyzer</Preview>
    <Body style={main}>
      <Container style={container}>
        {/* Header */}
        <Section style={header}>
          <Row>
            <Column>
              <Heading style={h1}>🎯 CV Analyzer</Heading>
              <Text style={headerSubtitle}>
                Plataforma Inteligente de Análise de Currículos
              </Text>
            </Column>
          </Row>
        </Section>

        {/* Main Content */}
        <Section style={content}>
          <Heading style={h2}>🎉 Confirme seu email</Heading>
          
          <Text style={text}>
            Olá <strong>{userName}</strong>, bem-vindo(a) ao <strong>CV Analyzer</strong>!
          </Text>
          
          <Text style={text}>
            Estamos muito felizes em ter você conosco. Para garantir a segurança da sua conta e liberar o acesso completo à nossa plataforma, precisamos confirmar seu endereço de email.
          </Text>

          {/* Call to Action */}
          <Section style={buttonContainer}>
            <Button 
              href={confirmationUrl}
              style={button}
            >
              ✅ Confirmar Meu Email
            </Button>
          </Section>

          {/* Security Note */}
          <Section style={securityNote}>
            <Text style={securityText}>
              <strong>🔒 Importante para sua segurança:</strong> Este link é válido por 24 horas e só pode ser usado uma vez. Se você não fez este cadastro, pode ignorar este email com segurança.
            </Text>
          </Section>

          {/* Features */}
          <Section style={featuresSection}>
            <Heading style={h3}>🚀 O que você terá acesso após a confirmação:</Heading>
            <Text style={featureItem}>📝 <strong>Análise Inteligente de Currículos</strong> - IA avançada para otimização</Text>
            <Text style={featureItem}>🎯 <strong>Simulador de Entrevistas</strong> - Pratique com cenários reais</Text>
            <Text style={featureItem}>📊 <strong>Relatórios Detalhados</strong> - Insights personalizados</Text>
            <Text style={featureItem}>💼 <strong>Sistema de Vagas</strong> - Gerencie oportunidades</Text>
            <Text style={featureItem}>📈 <strong>Histórico Completo</strong> - Acompanhe seu progresso</Text>
            <Text style={featureItem}>💳 <strong>Validação de Pagamentos</strong> - Sistema seguro integrado</Text>
          </Section>

          {/* Backup Link */}
          <Text style={text}>
            <strong>Problemas com o botão?</strong> Copie e cole este link no seu navegador:
          </Text>
          <Text style={linkBackup}>{confirmationUrl}</Text>
          
          <Text style={text}>
            Qualquer dúvida, estamos aqui para ajudar! 💪
          </Text>
        </Section>

        {/* Footer */}
        <Section style={footer}>
          <Text style={footerBrand}>CV Analyzer</Text>
          <Text style={footerText}>
            © 2024 - Transformando currículos em oportunidades
          </Text>
          <Text style={footerText}>
            Este email foi enviado porque você se cadastrou em nossa plataforma.
          </Text>
        </Section>
      </Container>
    </Body>
  </Html>
)

export default ConfirmationEmail

// Styles
const main = {
  backgroundColor: '#f9fafb',
  fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", system-ui, sans-serif',
}

const container = {
  margin: '0 auto',
  padding: '20px',
  maxWidth: '600px',
}

const header = {
  background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
  borderRadius: '12px 12px 0 0',
  padding: '40px 30px',
  textAlign: 'center' as const,
}

const h1 = {
  color: '#ffffff',
  fontSize: '32px',
  fontWeight: '700',
  margin: '0',
  textShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
}

const headerSubtitle = {
  color: 'rgba(255, 255, 255, 0.9)',
  fontSize: '16px',
  margin: '10px 0 0 0',
}

const content = {
  backgroundColor: '#ffffff',
  padding: '50px 40px',
  borderRadius: '0 0 12px 12px',
  boxShadow: '0 8px 25px rgba(0, 0, 0, 0.1)',
}

const h2 = {
  color: '#1f2937',
  fontSize: '26px',
  fontWeight: '600',
  marginBottom: '25px',
}

const h3 = {
  color: '#1f2937',
  fontSize: '18px',
  fontWeight: '600',
  marginBottom: '15px',
}

const text = {
  color: '#6b7280',
  fontSize: '16px',
  lineHeight: '1.6',
  marginBottom: '20px',
}

const buttonContainer = {
  textAlign: 'center' as const,
  margin: '35px 0',
}

const button = {
  background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
  color: '#ffffff',
  padding: '18px 36px',
  borderRadius: '12px',
  textDecoration: 'none',
  fontWeight: '600',
  fontSize: '16px',
  display: 'inline-block',
  boxShadow: '0 4px 15px rgba(99, 102, 241, 0.4)',
}

const securityNote = {
  background: 'linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%)',
  border: '1px solid #93c5fd',
  borderRadius: '8px',
  padding: '20px',
  margin: '25px 0',
}

const securityText = {
  color: '#1e40af',
  fontSize: '14px',
  fontWeight: '500',
  margin: '0',
}

const featuresSection = {
  backgroundColor: '#f8fafc',
  borderRadius: '8px',
  padding: '25px',
  margin: '25px 0',
}

const featureItem = {
  color: '#4b5563',
  fontSize: '15px',
  marginBottom: '8px',
}

const linkBackup = {
  backgroundColor: '#f3f4f6',
  borderRadius: '6px',
  padding: '15px',
  margin: '20px 0',
  wordBreak: 'break-all' as const,
  fontFamily: '"SF Mono", Monaco, "Cascadia Code", "Roboto Mono", Consolas, "Courier New", monospace',
  fontSize: '12px',
  color: '#374151',
  border: '1px solid #d1d5db',
}

const footer = {
  background: 'linear-gradient(135deg, #f9fafb 0%, #f3f4f6 100%)',
  padding: '30px',
  textAlign: 'center' as const,
  borderTop: '1px solid #e5e7eb',
  borderRadius: '0 0 12px 12px',
}

const footerBrand = {
  color: '#6b7280',
  fontWeight: '600',
  fontSize: '16px',
  margin: '5px 0',
}

const footerText = {
  color: '#9ca3af',
  fontSize: '14px',
  margin: '5px 0',
}