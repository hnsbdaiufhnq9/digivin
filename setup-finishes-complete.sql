-- Script completo para configurar acabados de vinilo
-- Ejecutar en el SQL Editor de Supabase

-- 1. Verificar el enum actual
DO $$
DECLARE
  v_finish RECORD;
BEGIN
  RAISE NOTICE 'Acabados de vinilo actuales:';
  FOR v_finish IN 
    SELECT unnest(enum_range(NULL::vinyl_finish)) as finish
  LOOP
    RAISE NOTICE '  - %', v_finish.finish;
  END LOOP;
END $$;

-- 2. Agregar nuevos acabados al enum vinyl_finish
-- PostgreSQL no permite agregar valores directamente a un enum si ya está en uso
-- Esta es la forma correcta de hacerlo:

-- Primero creamos un nuevo enum con todos los valores
DO $$
BEGIN
  -- Intentar agregar cada valor individualmente
  BEGIN
    ALTER TYPE vinyl_finish ADD VALUE IF NOT EXISTS 'standard_color';
  EXCEPTION WHEN duplicate_object THEN NULL;
  END;
  
  BEGIN
    ALTER TYPE vinyl_finish ADD VALUE IF NOT EXISTS 'premium_gradient';
  EXCEPTION WHEN duplicate_object THEN NULL;
  END;
  
  BEGIN
    ALTER TYPE vinyl_finish ADD VALUE IF NOT EXISTS 'translucent';
  EXCEPTION WHEN duplicate_object THEN NULL;
  END;
  
  BEGIN
    ALTER TYPE vinyl_finish ADD VALUE IF NOT EXISTS 'marble';
  EXCEPTION WHEN duplicate_object THEN NULL;
  END;
  
  BEGIN
    ALTER TYPE vinyl_finish ADD VALUE IF NOT EXISTS 'gold';
  EXCEPTION WHEN duplicate_object THEN NULL;
  END;
  
  BEGIN
    ALTER TYPE vinyl_finish ADD VALUE IF NOT EXISTS 'splatter';
  EXCEPTION WHEN duplicate_object THEN NULL;
  END;
  
  BEGIN
    ALTER TYPE vinyl_finish ADD VALUE IF NOT EXISTS 'glitter';
  EXCEPTION WHEN duplicate_object THEN NULL;
  END;
  
  BEGIN
    ALTER TYPE vinyl_finish ADD VALUE IF NOT EXISTS 'color_in_color';
  EXCEPTION WHEN duplicate_object THEN NULL;
  END;
  
  BEGIN
    ALTER TYPE vinyl_finish ADD VALUE IF NOT EXISTS 'confetti';
  EXCEPTION WHEN duplicate_object THEN NULL;
  END;
  
  BEGIN
    ALTER TYPE vinyl_finish ADD VALUE IF NOT EXISTS 'split';
  EXCEPTION WHEN duplicate_object THEN NULL;
  END;
  
  BEGIN
    ALTER TYPE vinyl_finish ADD VALUE IF NOT EXISTS 'pinwheel';
  EXCEPTION WHEN duplicate_object THEN NULL;
  END;
  
  BEGIN
    ALTER TYPE vinyl_finish ADD VALUE IF NOT EXISTS 'pool';
  EXCEPTION WHEN duplicate_object THEN NULL;
  END;
  
  BEGIN
    ALTER TYPE vinyl_finish ADD VALUE IF NOT EXISTS 'streaks';
  EXCEPTION WHEN duplicate_object THEN NULL;
  END;
  
  BEGIN
    ALTER TYPE vinyl_finish ADD VALUE IF NOT EXISTS 'starburst';
  EXCEPTION WHEN duplicate_object THEN NULL;
  END;
END $$;

-- 3. Verificar que los valores se agregaron correctamente
DO $$
DECLARE
  v_finish RECORD;
BEGIN
  RAISE NOTICE 'Acabados de vinilo después de la actualización:';
  FOR v_finish IN 
    SELECT unnest(enum_range(NULL::vinyl_finish)) as finish
  LOOP
    RAISE NOTICE '  - %', v_finish.finish;
  END LOOP;
END $$;
