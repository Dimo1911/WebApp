import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://pfltdvkqhxiblppwvrfq.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBmbHRkdmtxaHhpYmxwcHd2cmZxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODM4NjMzNDAsImV4cCI6MjA5OTQzOTM0MH0.oa7SU2mGBsalGgJB7eYaUnR1POqp5_lnUHJjEpt1iGk';

export const supabase = createClient(supabaseUrl, supabaseKey);
