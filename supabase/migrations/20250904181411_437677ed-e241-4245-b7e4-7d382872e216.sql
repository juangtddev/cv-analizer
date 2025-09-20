-- Create security definer function to validate edge function operations
CREATE OR REPLACE FUNCTION public.validate_subscription_access(
  target_user_id UUID,
  target_email TEXT
)
RETURNS BOOLEAN AS $$
DECLARE
  requesting_user_id UUID;
  requesting_user_email TEXT;
BEGIN
  -- Get the user from the JWT token in the request
  requesting_user_id := auth.uid();
  requesting_user_email := auth.email();
  
  -- If no authenticated user, deny access
  IF requesting_user_id IS NULL THEN
    RETURN FALSE;
  END IF;
  
  -- Allow access only if:
  -- 1. The target_user_id matches the authenticated user, OR
  -- 2. The target_email matches the authenticated user's email
  RETURN (
    target_user_id = requesting_user_id OR 
    target_email = requesting_user_email
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;

-- Drop all existing policies to avoid conflicts
DROP POLICY IF EXISTS "Edge functions can insert subscriptions" ON public.subscribers;
DROP POLICY IF EXISTS "Edge functions can update subscriptions" ON public.subscribers;
DROP POLICY IF EXISTS "Users can view their own subscription" ON public.subscribers;
DROP POLICY IF EXISTS "Edge functions can insert user subscription" ON public.subscribers;
DROP POLICY IF EXISTS "Edge functions can update user subscription" ON public.subscribers;

-- Create secure policies that validate user access
CREATE POLICY "secure_edge_function_insert_v2" 
ON public.subscribers 
FOR INSERT 
WITH CHECK (
  public.validate_subscription_access(user_id, email)
);

CREATE POLICY "secure_edge_function_update_v2" 
ON public.subscribers 
FOR UPDATE 
USING (
  public.validate_subscription_access(user_id, email)
);

CREATE POLICY "secure_user_select_subscription_v2" 
ON public.subscribers 
FOR SELECT 
USING (
  auth.uid() = user_id OR auth.email() = email
);