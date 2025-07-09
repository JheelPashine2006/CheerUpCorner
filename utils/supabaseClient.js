import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://dnddabohlomodcacflto.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRuZGRhYm9obG9tb2RjYWNmbHRvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTE5NTU2MjcsImV4cCI6MjA2NzUzMTYyN30.38G-9tplpt3oTcoIc17dzHQQw1kES96sEYPvTaDpyXE';

export const supabase = createClient(supabaseUrl, supabaseAnonKey); 