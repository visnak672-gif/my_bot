import { NextResponse } from 'next/server';

export async function POST(request) {
    try {
        const update = await request.json();
        const token = process.env.TELEGRAM_TOKEN; 
        
        if (!token) {
            console.error("Ошибка: TELEGRAM_TOKEN не задан в Vercel!");
            return NextResponse.json({ ok: false }, { status: 500 });
        }

        if (update.message && update.message.text) {
            const chatId = update.message.chat.id;
            const text = update.message.text;

            if (text === '/start') {
                await sendMessage(token, chatId, "Привет! Бот успешно запущен и работает на Vercel! 🚀");
            } else if (text === '/info') {
                await sendMessage(token, chatId, "ℹ️ Информация: Этот бот работает на платформе Next.js v14 (App Router) и функциях Vercel.");
            } else if (text === '/help') {
                await sendMessage(token, chatId, "❓ Помощь: Используйте кнопки меню или введите /start для перезапуска.");
            } else {
                await sendMessage(token, chatId, `Вы написали: ${text}\nК сожалению, я не знаю такой команды. Попробуйте ввести /help.`);
            }
        }

        if (update.callback_query) {
            const chatId = update.callback_query.message.chat.id;
            const callbackData = update.callback_query.data;
            await sendMessage(token, chatId, `Вы нажали кнопку: ${callbackData}`);
        }

        return NextResponse.json({ хорошо: true });
    } catch (error) {
        console.error("Ошибка:", error);
        return NextResponse.json({ хорошо: true });
    }
}

async function sendMessage(token, chatId, text) {
    await fetch(`https://telegram.org{token}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ chat_id: chatId, text: text, parse_mode: 'Markdown' }),
    });
}
