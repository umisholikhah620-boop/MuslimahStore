import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

async function testInsert() {
  const { data, error } = await supabase.from('transactions').insert([
    {
      total_amount: 100000,
      tax_amount: 10000,
      payment_method: 'TUNAI',
      customer_email: 'test@example.com',
      items: [{name: 'test', price: 10000, qty: 1}]
    }
  ]);
  
  if (error) {
    console.error("Test Error:", error);
  } else {
    console.log("Test Success:", data);
  }
}

testInsert();
