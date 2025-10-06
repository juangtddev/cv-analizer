#!/bin/bash

# Este script baixa todas as Edge Functions listadas de um projeto Supabase.

# --- Configurações ---
# Substitua pelo seu Personal Access Token
SUPABASE_ACCESS_TOKEN="sbp_917156e2ee5a20eb44ef896ec2f5013279117b72"
# Substitua pelo ID do seu projeto Supabase
PROJECT_REF="yysnagznpvwgebjhgvzx"

# Lista de slugs das funções a serem baixadas
# Extraída da saída que você me forneceu
FUNCTIONS=(
  "check-subscription"
  "create-checkout"
  "customer-portal"
  "create-subscription"
  "send-confirmation-email"
  "test-email"
  "validate-card"
  "resend-confirmation"
  "send-email"
  "start-trial"
  "get-active-products"
  "check-email-exists"
  "create-resume"
  "get-user-resumes"
  "create-analysis"
  "get-analysis-by-id"
  "upload-resume-file"
)

# --- Execução ---

echo "Iniciando download das Edge Functions do projeto $PROJECT_REF..."
echo "Certifique-se de que a pasta 'supabase/functions' foi removida se você deseja uma sincronização limpa."
echo ""

for FUNCTION_NAME in "${FUNCTIONS[@]}"; do
  echo "Baixando função: $FUNCTION_NAME..."
  SUPABASE_ACCESS_TOKEN="$SUPABASE_ACCESS_TOKEN" npx supabase functions download "$FUNCTION_NAME" --project-ref "$PROJECT_REF"
  if [ $? -ne 0 ]; then
    echo "Erro ao baixar a função $FUNCTION_NAME. Verifique seu token de acesso e conexão."
    # Opcional: Para parar o script em caso de erro, descomente a linha abaixo:
    # exit 1
  else
    echo "Função $FUNCTION_NAME baixada com sucesso."
  fi
  echo ""
done

echo "Download de todas as funções concluído."
