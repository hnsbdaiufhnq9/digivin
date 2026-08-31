-- Script para configurar admin con créditos ilimitados
-- Ejecutar en el SQL Editor de Supabase

-- 1. Agregar campo is_admin a profiles si no existe
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'profiles' 
    AND column_name = 'is_admin'
  ) THEN
    ALTER TABLE public.profiles ADD COLUMN is_admin BOOLEAN NOT NULL DEFAULT FALSE;
    RAISE NOTICE 'Campo is_admin agregado a profiles';
  END IF;
END $$;

-- 2. Modificar restricción de créditos para permitir -1 (ilimitados)
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM pg_constraint 
    WHERE conname = 'user_credits_balance_check'
  ) THEN
    ALTER TABLE public.user_credits DROP CONSTRAINT user_credits_balance_check;
    ALTER TABLE public.user_credits ADD CONSTRAINT user_credits_balance_check 
      CHECK (balance >= 0 OR balance = -1);
    RAISE NOTICE 'Restricción de créditos actualizada para permitir -1';
  END IF;
END $$;

-- 3. Marcar arnauvqv@gmail.com como admin
UPDATE public.profiles 
SET is_admin = TRUE, updated_at = NOW()
WHERE id IN (SELECT id FROM auth.users WHERE email = 'arnauvqv@gmail.com');

-- 4. Dar créditos ilimitados (-1) a arnauvqv@gmail.com
UPDATE public.user_credits 
SET balance = -1, updated_at = NOW()
WHERE user_id IN (SELECT id FROM auth.users WHERE email = 'arnauvqv@gmail.com');

-- 5. Verificar resultado
DO $$
DECLARE
  v_user_id UUID;
  v_is_admin BOOLEAN;
  v_balance INT;
BEGIN
  SELECT id INTO v_user_id FROM auth.users WHERE email = 'arnauvqv@gmail.com' LIMIT 1;
  
  IF v_user_id IS NULL THEN
    RAISE NOTICE 'Usuario arnauvqv@gmail.com no encontrado en auth.users';
  ELSE
    SELECT is_admin INTO v_is_admin FROM public.profiles WHERE id = v_user_id;
    SELECT balance INTO v_balance FROM public.user_credits WHERE user_id = v_user_id;
    
    RAISE NOTICE 'Configuración de admin: user_id=%, is_admin=%, balance=%', 
      v_user_id, v_is_admin, v_balance;
      
    IF v_is_admin AND v_balance = -1 THEN
      RAISE NOTICE '✅ Admin configurado correctamente con créditos ilimitados';
    ELSE
      RAISE NOTICE '⚠️  Configuración incompleta: is_admin=%, balance=%', v_is_admin, v_balance;
    END IF;
  END IF;
END $$;

-- 6. Actualizar trigger para usuarios nuevos
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, display_name, avatar_url, is_admin)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email),
    NEW.raw_user_meta_data->>'avatar_url',
    NEW.email = 'arnauvqv@gmail.com'
  );
  INSERT INTO public.user_credits (user_id, balance) VALUES (
    NEW.id, 
    CASE WHEN NEW.email = 'arnauvqv@gmail.com' THEN -1 ELSE 3 END
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
