import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const supabase = createClient(supabaseUrl, supabaseAnonKey)


// 🧪 KODE PENGUJIAN KONEKSI
async function testConnection() {
  const { data, error } = await supabase.from('reports').select('count', { count: 'exact', head: true })
  
  if (error) {
    console.error('❌ Gagal terhubung ke Supabase:', error.message)
  } else {
    console.log('✅ Berhasil terhubung ke Supabase!')
  }
}

testConnection()