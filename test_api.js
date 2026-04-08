import fetch from 'node-fetch';

async function testEmail() {
  const response = await fetch('http://localhost:3000/api/send-receipt', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: 'umisholikhah21@gmail.com',
      items: [{ name: 'Test Product', price: 100000, qty: 1 }],
      total: 110000,
      tax: 10000,
      subtotal: 100000,
      paymentMethod: 'TEST_QRIS'
    })
  });
  
  const text = await response.text();
  console.log("Status:", response.status);
  console.log("Body:", text);
}

testEmail();
