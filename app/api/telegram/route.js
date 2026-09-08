import { NextResponse } from 'next/server';

export async function POST(request) {
    try {
        const update = await request.json();
        const token = process.env.TELEGRAM_TOKEN; 
        
        if (!token) {
            console.error("Error: TELEGRAM_TOKEN is missing!");
            return NextResponse.json({ ok: false }, { status: 500 });
        }

        if (update.message && update.message.text) {
            const chatId = update.message.chat.id;
            const text = update.message.text;

            if (text === '/start') {
                await sendMessage(token, chatId, "Привет! Бот успешно запущен и работает на Vercel! 🚀");
            } else {
                await sendMessage(token, chatId, `Вы написали: ${text}`);
            }
        }

        return NextResponse.json({ ok: true });
    } catch (error) {
        console.error("Callback error:", error);
        return NextResponse.json({ ok: true });
    }
}

async function sendMessage(token, chatId, text) {
    await fetch(`https://telegram.org{token}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ chat_id: chatId, text: text }),
    });
}
