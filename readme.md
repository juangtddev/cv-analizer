# CVAnalyzer - Novas Funcionalidades de Autenticação e Assinatura

Este documento descreve as novas funcionalidades de login social, período de teste e fluxo de assinatura pagante que foram implementadas no projeto.

---

## ✨ Nova Funcionalidade: Autenticação Social e Fluxo de Assinatura

Para aprimorar a experiência de onboarding e monetização, foi desenvolvida uma jornada de usuário completa e robusta, com foco em flexibilidade e segurança.

### Resumo da Implementação

As seguintes funcionalidades foram adicionadas:

- **Autenticação Flexível:**
  - **Login Social (Google & LinkedIn):** Usuários agora podem se cadastrar e autenticar na plataforma de forma rápida e segura utilizando suas contas do Google e LinkedIn.
  - **Login Tradicional:** O fluxo de cadastro e login com E-mail e Senha foi mantido e aprimorado.
- **Período de Teste Gratuito (Trial):** Novos usuários têm a opção de iniciar um período de teste de 14 dias com um único clique, sem a necessidade de fornecer dados de pagamento.
- **Fluxo de Pagamento com Stripe:** Integração completa com a Stripe para gerenciar assinaturas recorrentes.
- **Página de Pagamento Dinâmica:** A aplicação agora apresenta uma página de pagamento inteligente que se adapta ao status do usuário:
  - **Usuário Novo:** Oferece a opção de iniciar o trial ou assinar.
  - **Usuário em Trial:** Mostra os dias restantes do teste e permite pular para o dashboard.
  - **Usuário com Trial Expirado:** Remove a opção de pular e exige a assinatura para continuar.
  - **Assinantes:** São direcionados diretamente para o dashboard, sem interrupções.
- **Seleção de Planos Dinâmica:** A página de pagamento busca os planos e preços ativos diretamente da API da Stripe, permitindo que a gestão de produtos seja feita no painel da Stripe sem necessidade de alterar o código.

### Arquitetura Técnica

A implementação foi dividida entre o frontend e o backend (Supabase), com os seguintes componentes principais:

- **Frontend (React):**

  - `src/contexts/AuthContext.tsx`: O "cérebro" da aplicação, refatorado para gerenciar de forma robusta o estado de todos os tipos de autenticação (social e tradicional) e assinatura.
  - `src/components/ProtectedRoute.tsx`: Aprimorado para controlar o acesso às rotas com base no status da assinatura do usuário.
  - `src/components/auth/CallbackHandler.tsx`: Criado para gerenciar o redirecionamento pós-login social.
  - `src/components/auth/SocialButtons.tsx`: Componente de UI para os botões de login do Google e LinkedIn.
  - `src/pages/PaymentPage.tsx`: Nova página de pagamento com UI e lógica dinâmicas.
  - `src/components/payment/CheckoutForm.tsx`: Componente seguro com Stripe Elements para a entrada de dados do cartão.

- **Backend (Supabase Edge Functions):**
  - `functions/get-active-products`: Nova função que busca os planos de assinatura na Stripe.
  - `functions/start-trial`: Nova função para iniciar o período de teste do usuário.
  - `functions/create-subscription`: Função que cria o cliente e a assinatura na Stripe.
  - `functions/check-subscription`: Refatorada para ser uma função de leitura segura, que verifica o status da assinatura de um usuário.

### Variáveis de Ambiente Necessárias

Para que esta funcionalidade opere, as seguintes variáveis de ambiente devem ser configuradas:

- **No Frontend (`.env.local`):**

  ```
  VITE_STRIPE_PUBLISHABLE_KEY=pk_test_...
  ```

- **No Backend (Supabase Secrets):**
  ```
  STRIPE_SECRET_KEY=sk_test_...
  STRIPE_PREMIUM_PRICE_ID=price_...
  ```

### Como Testar a Nova Funcionalidade

1.  **Limpe o Ambiente:** Delete o usuário de teste do Supabase Auth e das tabelas `profiles` e `subscribers`.
2.  **Fluxo de Trial com Login Social:** Faça login com uma nova conta **social (Google ou LinkedIn)**, navegue para a página de pagamento e clique em "Pular e Iniciar Teste Gratuito". Verifique se o acesso ao dashboard é concedido e se o registro é criado corretamente na tabela `subscribers`.
3.  **Fluxo de Assinatura com Login Social:** Com um novo usuário, na página de pagamento, selecione um plano, use um cartão de teste da Stripe (ex: `4242...`) e complete a assinatura. Verifique se o cliente e a assinatura são criados no painel da Stripe e se o status `subscribed: true` é refletido no banco de dados.
