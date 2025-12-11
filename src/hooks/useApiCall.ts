// src/hooks/useApiCall.ts
import { useState, useCallback } from 'react';

// Tipagem genérica para um objeto Error, que pode ser extendido ou customizado
interface CustomError extends Error {
  statusCode?: number;
  code?: string;
  details?: string;
}

interface UseApiCallOptions<TData, TError extends CustomError> {
  // TError agora estende CustomError
  onSuccess?: (data: TData) => void;
  onError?: (error: TError) => void;
}

interface UseApiCallResult<
  TData,
  TError extends CustomError,
  TArgs extends unknown[],
> {
  // TError estende CustomError
  data: TData | null;
  loading: boolean;
  error: TError | null;
  call: (...args: TArgs) => Promise<TData | null>;
}

export function useApiCall<
  TData = unknown,
  TError extends CustomError = Error,
  TArgs extends unknown[] = unknown[],
>( // TData = unknown, TError = Error, TArgs = any[]
  apiFunction: (...args: TArgs) => Promise<TData>,
  options?: UseApiCallOptions<TData, TError>,
): UseApiCallResult<TData, TError, TArgs> {
  const [data, setData] = useState<TData | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<TError | null>(null);

  const call = useCallback(
    async (...args: TArgs): Promise<TData | null> => {
      setLoading(true);
      setError(null);
      setData(null);
      try {
        const result = await apiFunction(...args);
        setData(result);
        options?.onSuccess?.(result);
        return result;
      } catch (err) {
        // <- 'err' agora é tipado como unknown por padrão
        // Tenta moldar o erro para TError. Se err não for uma instância de Error, pode haver problemas.
        // Em projetos reais, você teria uma função para normalizar erros de API.
        setError(
          err instanceof Error
            ? (err as TError)
            : ({ message: String(err) } as TError),
        );
        options?.onError?.(
          err instanceof Error
            ? (err as TError)
            : ({ message: String(err) } as TError),
        );
        return null;
      } finally {
        setLoading(false);
      }
    },
    [apiFunction, options],
  ); // <- 'options' adicionado ao array de dependências
  // options?.onSuccess e options?.onError já são acessados via 'options'

  return { data, loading, error, call };
}
