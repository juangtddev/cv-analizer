
import { Message } from '../types/chat';

export const generateAIResponse = (userInput: string, isLoggedIn: boolean = true): Message => {
  const input = userInput.toLowerCase();
  
  // Respostas para usuários não logados (landing page)
  if (!isLoggedIn) {
    if (input.includes('cadastr') || input.includes('registr') || input.includes('criar conta')) {
      return {
        id: Date.now().toString(),
        content: '🎉 **EXCELENTE DECISÃO! Você está a 1 clique da sua NOVA CARREIRA!**\n\n**📋 CADASTRO SUPER RÁPIDO (2 minutos):**\n1. Clique em "Registrar" no menu 👆\n2. Digite apenas email e nome\n3. Confirme no seu email\n4. PRONTO! Acesso liberado instantaneamente\n\n**🎁 BÔNUS EXCLUSIVOS AO SE CADASTRAR HOJE:**\n• ✅ 7 dias PREMIUM totalmente GRÁTIS\n• ✅ Análise completa do seu currículo\n• ✅ Lista personalizada de vagas\n• ✅ Simulação de entrevista ilimitada\n• ✅ Relatório de mercado da sua área\n• ✅ Template de currículo que FUNCIONA\n\n**⚡ AÇÃO LIMITADA:** Apenas os primeiros 50 cadastros hoje ganham esses bônus!\n\n**💼 RESULTADO COMPROVADO:**\n• Maria conseguiu vaga na Amazon em 15 dias\n• João aumentou salário em 45% com nossas dicas\n• Ana passou em 8 processos seletivos seguidos\n\n[**SIM! QUERO MEUS BÔNUS AGORA**] 🚀',
        sender: 'ia',
        timestamp: new Date(),
        type: 'text'
      };
    } else if (input.includes('plataforma') || input.includes('funciona') || input.includes('como')) {
      return {
        id: Date.now().toString(),
        content: '🚀 **Como a CVData vai TRANSFORMAR sua carreira:**\n\n**✨ ANÁLISE INTELIGENTE DE CURRÍCULO**\n• IA identifica exatamente o que está faltando no seu CV\n• Receba sugestões que AUMENTAM suas chances em 300%\n• Veja como grandes empresas enxergam seu perfil\n• Corrija erros que 90% dos candidatos cometem\n\n**🎯 MATCHING COM VAGAS DOS SONHOS**\n• Descubra qual % de chance você tem em cada vaga\n• Receba vagas compatíveis com seu perfil TODOS OS DIAS\n• Saiba exatamente quais habilidades desenvolver\n• Seja encontrado por recrutadores automaticamente\n\n**🏆 SIMULADOR DE ENTREVISTAS**\n• Treine com perguntas reais de empresas como Google, Microsoft\n• Feedback em tempo real para melhorar suas respostas\n• Chegue 100% preparado e confiante\n\n**💰 RESULTADO GARANTIDO:**\n• Usuários conseguem 60% mais entrevistas\n• Aumento médio de salário de 35%\n• 9 em cada 10 usuários conseguem vaga em até 60 dias\n\n🔥 **OFERTA LIMITADA: Cadastre-se HOJE e ganhe 7 dias PREMIUM GRÁTIS!**\n\n[**QUERO MINHA VAGA DOS SONHOS AGORA!**]',
        sender: 'ia',
        timestamp: new Date(),
        type: 'text'
      };
    } else if (input.includes('grátis') || input.includes('gratuito') || input.includes('preço')) {
      return {
        id: Date.now().toString(),
        content: '💰 **TRANSPARÊNCIA TOTAL - Sem pegadinhas!**\n\n**🆓 PLANO GRATUITO (Para sempre)**\n• 3 análises de currículo por mês\n• Matching básico com vagas\n• Acesso ao simulador de entrevistas\n• Relatórios essenciais\n\n**⭐ PLANO PREMIUM - R$ 29,90/mês**\n• ✅ Análises ILIMITADAS de currículo\n• ✅ IA mais avançada e precisa\n• ✅ Vagas exclusivas de empresas top\n• ✅ Simulador com 500+ perguntas reais\n• ✅ Suporte prioritário WhatsApp\n• ✅ Mentoria de carreira 1:1\n• ✅ Templates premium de currículo\n\n**🔥 OFERTA IRRESISTÍVEL:**\n• 7 dias PREMIUM completamente GRÁTIS\n• Se não conseguir entrevistas, devolvemos 100% do dinheiro\n• Cancele quando quiser, sem multa\n\n**💡 DICA VALIOSA:** O plano gratuito já é mais completo que 90% das ferramentas pagas do mercado!\n\n[**QUERO MEUS 7 DIAS GRÁTIS**] 🎁',
        sender: 'ia',
        timestamp: new Date(),
        type: 'text'
      };
    }
  }
  
  // Respostas para usuários logados
  if (input.includes('currículo') || input.includes('cv')) {
    return {
      id: Date.now().toString(),
      content: '📄 **Análise de Currículo**\n\nBaseado no seu perfil, identifiquei alguns pontos importantes:\n\n**Pontos Fortes:**\n• Experiência sólida na área\n• Boa progressão de carreira\n• Habilidades técnicas relevantes\n\n**Sugestões de Melhoria:**\n• Adicione mais métricas quantificáveis\n• Inclua certificações recentes\n• Otimize palavras-chave para ATS\n\nGostaria que eu detalhe algum desses pontos?',
      sender: 'ia',
      timestamp: new Date(),
      type: 'analysis'
    };
  } else if (input.includes('vaga') || input.includes('job')) {
    return {
      id: Date.now().toString(),
      content: '🎯 **Análise de Aderência às Vagas**\n\nCom base no seu perfil, aqui estão as vagas mais aderentes:\n\n**Vaga 1: Frontend Developer**\n• Aderência: 85%\n• Match: React, TypeScript, CSS\n• Faltando: Testes automatizados\n\n**Vaga 2: Fullstack Developer**\n• Aderência: 72%\n• Match: JavaScript, Git, APIs\n• Faltando: Backend com Node.js\n\nQuer que eu analise uma vaga específica?',
      sender: 'ia',
      timestamp: new Date(),
      type: 'analysis'
    };
  } else if (input.includes('melhoria') || input.includes('dica')) {
    return {
      id: Date.now().toString(),
      content: '💡 **Sugestões Personalizadas**\n\n**Para seu perfil atual, recomendo:**\n\n1. **Certificações Priority:**\n   • AWS Cloud Practitioner\n   • Google Analytics\n   • Scrum Master\n\n2. **Projetos para Portfólio:**\n   • App mobile com React Native\n   • Sistema com banco de dados\n   • Integração com APIs\n\n3. **Networking:**\n   • Participar de meetups tech\n   • Contribuir em projetos open source\n   • Escrever artigos técnicos\n\nQual área você gostaria de focar primeiro?',
      sender: 'ia',
      timestamp: new Date(),
      type: 'suggestion'
    };
  } else {
    // Resposta padrão baseada no status de login
    const defaultMessage = !isLoggedIn 
      ? '👋 **Olá! Sou sua consultora de carreira com IA!**\n\n**Estou aqui para TURBINAR sua carreira:**\n\n🔥 **Pergunte sobre:**\n• **"Como funciona"** - Veja como vamos transformar seu currículo\n• **"Cadastrar"** - Ganhe 7 dias premium GRÁTIS\n• **"Preços"** - Planos transparentes (tem gratuito!)\n• **"Resultados"** - Cases de sucesso dos nossos usuários\n\n**✨ FATO:** 87% dos nossos usuários conseguem mais entrevistas em 30 dias!\n\n💪 **Pronta para sua próxima conquista profissional?**'
      : 'Entendi sua pergunta! Posso te ajudar com várias questões sobre carreira:\n\n• **Análise de currículo** - Digite "analisar currículo"\n• **Vagas compatíveis** - Digite "vagas para mim"\n• **Dicas de melhoria** - Digite "como melhorar"\n• **Preparação para entrevista** - Digite "entrevista"\n\nOu me faça uma pergunta específica sobre sua carreira!';
    
    return {
      id: Date.now().toString(),
      content: defaultMessage,
      sender: 'ia',
      timestamp: new Date(),
      type: 'text'
    };
  }
};
