-- Script para agregar nuevos acabados de vinilo a la base de datos
-- Ejecutar en el SQL Editor de Supabase

-- Agregar nuevos acabados al enum vinyl_finish
ALTER TYPE vinyl_finish ADD VALUE IF NOT EXISTS 'standard_color';
ALTER TYPE vinyl_finish ADD VALUE IF NOT EXISTS 'premium_gradient';
ALTER TYPE vinyl_finish ADD VALUE IF NOT EXISTS 'translucent';
ALTER TYPE vinyl_finish ADD VALUE IF NOT EXISTS 'marble';
ALTER TYPE vinyl_finish ADD VALUE IF NOT EXISTS 'gold';
ALTER TYPE vinyl_finish ADD VALUE IF NOT EXISTS 'splatter';
ALTER TYPE vinyl_finish ADD VALUE IF NOT EXISTS 'glitter';
ALTER TYPE vinyl_finish ADD VALUE IF NOT EXISTS 'color_in_color';
ALTER TYPE vinyl_finish ADD VALUE IF NOT EXISTS 'confetti';
ALTER TYPE vinyl_finish ADD VALUE IF NOT EXISTS 'split';
ALTER TYPE vinyl_finish ADD VALUE IF NOT EXISTS 'pinwheel';
ALTER TYPE vinyl_finish ADD VALUE IF NOT EXISTS 'pool';
ALTER TYPE vinyl_finish ADD VALUE IF NOT EXISTS 'streaks';
ALTER TYPE vinyl_finish ADD VALUE IF NOT EXISTS 'starburst';

-- Verificar que los valores se agregaron correctamente
DO $$
DECLARE
  v_finish RECORD;
BEGIN
  RAISE NOTICE 'Acabados de vinilo disponibles:';
  FOR v_finish IN 
    SELECT unnest(enum_range(NULL::vinyl_finish)) as finish
  LOOP
    RAISE NOTICE '  - %', v_finish.finish;
  END LOOP;
END $$;
