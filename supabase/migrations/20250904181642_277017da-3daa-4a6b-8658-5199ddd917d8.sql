-- Fix function search path mutable security issue
-- Update the existing function to have a proper search path
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
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE SET search_path = public;

-- Also fix the existing handle_new_user function
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, nome, email)
  VALUES (NEW.id, NEW.raw_user_meta_data->>'nome', NEW.email);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Fix the update_updated_at_column function
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS trigger AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;