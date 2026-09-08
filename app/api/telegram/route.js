import { NextResponse } from 'next/server';

const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const TELEGRAM_API = `https://telegram.org{BOT_TOKEN}`;

async function sendTelegram(method, body) {
  try {
    const res = await fetch(`${TELEGRAM_API}/${method}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    return await res.json();
  } catch (error) {
    console.error(`Помилка під час виклику ${method}:`, error);
  }
}

async function setupBotMenu() {
  await sendTelegram('setMyCommands', {
    commands: [
      { command: 'start', description: 'Запустити бота та відкрити меню' },
      { command: 'info', description: 'Отримати інформацію про сервіс' },
      { command: 'help', description: 'Довідка та контакти' },
    ],
  });
}

export async function POST(request) 

  try {
    const update = await request.json();

    if (update.callback_query) {
      const chatId = update.callback_query.message.chat.id;
      const data = update.callback_query.data;
      const callbackQueryId = update.callback_query.id;

      await sendTelegram('answerCallbackQuery', { callback_query_id: callbackQueryId });

      if (data === 'btn_services') {
        await sendTelegram('sendMessage', {
          chat_id: chatId,
          text: '🛠 **Наші послуги:**\n1. Розробка сайтів на Next.js\n2. Інтеграція Telegram-ботів\n3. Хостинг на Vercel',
          parse_mode: 'Markdown',
        });
      } else if (data === 'btn_contacts') {
        await sendTelegram('sendMessage', {
          chat_id: chatId,
          text: '📞 **Контакти:**\nЗв’яжіться з нами через email: support@example.com або пишіть адміну @username.',
          parse_mode: 'Markdown',
        });
      }
      return NextResponse.json({ ok: true });
    }

    if (update.message && update.message.text) {
      const chatId = update.message.chat.id;
      const text = update.message.text.trim();

      await setupBotMenu();

      if (text === '/start') {
        await sendTelegram('sendMessage', {
          chat_id: chatId,
          text: `👋 Привіт! Ласкаво просимо до нашого бота.\n\nВикористовуйте меню команд або кнопки нижче, щоб отримати інформацію.`,
          reply_markup: {
            inline_keyboard: [
              [
                { text: '🛠 Наші послуги', callback_data: 'btn_services' },
                { text: '📞 Контакти', callback_data: 'btn_contacts' }
              ],
              [
                { text: '🌐 Перейти на сайт', url: 'https://vercel.com' }
              ]
            ]
          }
        });
        return NextResponse.json({ ok: true });
      }

      if (text === '/info') {
        await sendTelegram('sendMessage', {
          chat_id: chatId,
          text: 'ℹ️ **Інформація:** Цей бот працює на платформі Next.js v16 (App Router) та розгорнутий на Vercel Serverless Functions за допомогою вебхуків.',
          parse_mode: 'Markdown',
        });
        return NextResponse.json({ ok: true });
      }

      if (text === '/help') {
        await sendTelegram('sendMessage', {
          chat_id: chatId,
          text: '❓ **Довідка:**\n• /start — перезапустити бота\n• /info — дізнатися про технології\n• Використовуйте вбудовані кнопки для швидкої навігації.',
          parse_mode: 'Markdown',
        });
        return NextResponse.json({ ok: true });
      }

      await sendTelegram('sendMessage', {
        chat_id: chatId,
        text: `🤖 Ви написали: "${text}". На жаль, я розпізнаю лише команди з меню або натискання на кнопки. Спробуйте ввести /help.`,
      });
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error('Помилка обробки запиту:', err);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
