import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(req) {
    try {
        const { email, items, total, tax, subtotal, paymentMethod } = await req.json();

        if (!email) {
            return NextResponse.json({ error: 'Email is required' }, { status: 400 });
        }

        // Configure Nodemailer transporter
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        });

        // Format Rupiah helper in backend
        const formatRupiah = (number) => {
            return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(number);
        };

        // Create HTML content for the receipt
        const itemsHtml = items.map(item => `
            <tr>
                <td style="padding: 10px; border-bottom: 1px solid #eee;">${item.name} (x${item.qty})</td>
                <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: right;">${formatRupiah(item.price * item.qty)}</td>
            </tr>
        `).join('');

        const mailOptions = {
            from: `"Muslimah Store" <${process.env.EMAIL_USER}>`,
            to: email,
            subject: 'Struk Pembelian Anda di Muslimah Store',
            html: `
                <div style="font-family: Arial, sans-serif; max-w-md; margin: 0 auto; color: #333; border: 1px solid #e5e7eb; border-radius: 12px; overflow: hidden;">
                    <div style="background-color: #B76E79; color: white; padding: 20px; text-align: center;">
                        <h1 style="margin: 0; font-size: 24px;">Muslimah Store</h1>
                        <p style="margin: 5px 0 0; opacity: 0.9;">Alhamdulillah, Terima Kasih atas Pesanan Anda</p>
                    </div>
                    
                    <div style="padding: 20px;">
                        <h3 style="margin-top: 0; color: #4b5563;">Rincian Pesanan</h3>
                        <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
                            ${itemsHtml}
                        </table>
                        
                        <div style="background-color: #f9fafb; padding: 15px; border-radius: 8px;">
                            <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
                                <span style="color: #6b7280;">Subtotal:</span>
                                <strong>${formatRupiah(subtotal)}</strong>
                            </div>
                            <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
                                <span style="color: #6b7280;">PPN (10%):</span>
                                <strong>${formatRupiah(tax)}</strong>
                            </div>
                            <div style="display: flex; justify-content: space-between; margin-top: 10px; padding-top: 10px; border-top: 2px solid #e5e7eb;">
                                <span style="font-weight: bold; font-size: 18px;">Total:</span>
                                <span style="font-weight: bold; font-size: 18px; color: #B76E79;">${formatRupiah(total)}</span>
                            </div>
                        </div>

                        <div style="margin-top: 20px; padding-top: 20px; border-top: 1px solid #eee; text-align: center;">
                            <p style="margin: 0; color: #6b7280; font-size: 14px;">Metode Pembayaran: <strong>${paymentMethod}</strong></p>
                            <p style="margin: 10px 0 0; font-style: italic; color: #9ca3af; font-size: 12px;">Semoga pakaian ini membawa keberkahan. Jazakillahu Khayran.</p>
                        </div>
                    </div>
                </div>
            `
        };

        // Send the email
        await transporter.sendMail(mailOptions);

        return NextResponse.json({ success: true, message: 'Email sent successfully' }, { status: 200 });
    } catch (error) {
        console.error('Failed to send email:', error);
        return NextResponse.json({ error: 'Failed to send email' }, { status: 500 });
    }
}
