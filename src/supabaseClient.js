    import { createClient } from '@supabase/supabase-js';

    // Usamos las variables de entorno específicas de Vite
    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
    const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

    // Creamos y exportamos el cliente de Supabase para usarlo en toda la web
    export const supabase = createClient(supabaseUrl, supabaseAnonKey);
    