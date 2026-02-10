{
  "name": "godswill-ai-bot",
  "version": "2.0.0",
  "description": "Godswill AI-Powered WhatsApp Bot",
  "main": "index.js",
  "scripts": {
    "start": "node index.js"
  },
  "dependencies": {
    "whatsapp-web.js": "^1.23.0",
    "qrcode-terminal": "^0.12.0",
    "express": "^4.18.2",
    "axios": "^1.6.0",
    "node-fetch": "^2.7.0",
    "@google/generative-ai": "^0.1.3"
  }
}
File 2: index.js (ADVANCED AI BOT)
const { Client, LocalAuth, MessageMedia } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const express = require('express');
const axios = require('axios');

// Express Server
const app = express();
const PORT = process.env.PORT || 3000;

app.get('/', (req, res) => {
    res.send('🤖 Godswill AI Bot V2.0 - Online');
});

app.get('/status', (req, res) => {
    res.json({
        bot: 'Godswill AI Bot',
        version: '2.0',
        status: 'online',
        uptime: process.uptime(),
        owner: '2348145688688'
    });
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

// Bot Configuration
const PREFIX = '.';
const OWNER = '2348145688688@c.us';
const BOT_NAME = 'Godswill';

// AI Configuration (using free AI API)
const AI_API_URL = 'https://api.popcat.xyz/chatbot';

// Bot personality responses
const personalityResponses = {
    greetings: [
        "Hey! What's good? 😎",
        "Yo! What's up? 👋",
        "Sup! How you doing? 🔥",
        "Hey there! Ready to vibe? ✨"
    ],
    thanks: [
        "No problem! Anytime 😊",
        "You're welcome! Happy to help 💪",
        "Gotchu! That's what I'm here for 🙌",
        "Of course! Always here for you ✌️"
    ],
    confused: [
        "Hmm, I'm not sure I understand. Can you explain more?",
        "Could you rephrase that? I want to help you properly 🤔",
        "I didn't quite get that. Try asking differently?"
    ]
};

const client = new Client({
    authStrategy: new LocalAuth(),
    puppeteer: {
        headless: true,
        args: [
            '--no-sandbox',
            '--disable-setuid-sandbox',
            '--disable-dev-shm-usage',
            '--disable-accelerated-2d-canvas',
            '--no-first-run',
            '--no-zygote',
            '--single-process',
            '--disable-gpu'
        ]
    }
});

// QR Code
client.on('qr', (qr) => {
    console.log('📱 SCAN THIS QR CODE:');
    qrcode.generate(qr, { small: true });
});

// Ready
client.on('ready', () => {
    console.log('✅ Godswill AI Bot is Online!');
    console.log('🤖 AI Mode: Activated');
    console.log('👤 Owner: +234 814 568 8688');
});

// AI Chat Function
async function getAIResponse(message) {
    try {
        const response = await axios.get(AI_API_URL, {
            params: {
                msg: message,
                owner: 'Godswill',
                botname: 'Godswill Bot'
            }
        });
        return response.data.response || "I'm thinking... 🤔";
    } catch (error) {
        console.error('AI Error:', error);
        return "Sorry, I'm having trouble thinking right now 😅";
    }
}

// Random response helper
function randomResponse(array) {
    return array[Math.floor(Math.random() * array.length)];
}

// Message Handler
client.on('message', async (msg) => {
    try {
        const chat = await msg.getChat();
        const sender = msg.from;
        const body = msg.body;
        const isGroup = chat.isGroup;
        const contact = await msg.getContact();
        const name = contact.pushname || 'Friend';
        const isOwner = sender === OWNER;

        // ==================== AUTO-RESPOND TO "GODSWILL" MENTION ====================
        if (body.toLowerCase().includes('godswill') && !body.startsWith(PREFIX)) {
            const responses = [
                `Yes ${name}? You called? 👀`,
                `Yo ${name}! What's up? 🔥`,
                `${name}! I'm here, what you need? 💪`,
                `Sup ${name}? How can I help? ✨`,
                `${name}! You rang? 😎`
            ];
            await msg.reply(randomResponse(responses));
            return;
        }

        // ==================== AI CHAT MODE (No prefix needed for groups) ====================
        if (isGroup && !body.startsWith(PREFIX) && msg.mentionedIds.includes(client.info.wid._serialized)) {
            // Bot was mentioned/tagged in group
            const question = body.replace(/@\d+/g, '').trim();
            await chat.sendStateTyping();
            const aiResponse = await getAIResponse(question);
            await msg.reply(aiResponse);
            return;
        }

        // ==================== GREETINGS AUTO-RESPONSE ====================
        if (body.toLowerCase().match(/^(hi|hello|hey|sup|yo|whatsup|wassup)$/)) {
            await msg.reply(randomResponse(personalityResponses.greetings));
            return;
        }

        // ==================== THANK YOU AUTO-RESPONSE ====================
        if (body.toLowerCase().match(/^(thanks|thank you|thx|ty)$/)) {
            await msg.reply(randomResponse(personalityResponses.thanks));
            return;
        }

        // ==================== COMMANDS (with prefix) ====================
        if (!body.startsWith(PREFIX)) return;

        const args = body.slice(PREFIX.length).trim().split(/ +/);
        const command = args.shift().toLowerCase();

        console.log(`📨 Command: ${command} | From: ${name} | Group: ${isGroup}`);

        // ==================== MENU ====================
        if (command === 'menu' || command === 'help') {
            const menu = `
╔═══════════════════════╗
║  *GODSWILL AI BOT*  ║
╚═══════════════════════╝

👤 *Owner:* Godswill
📱 *Contact:* +234 814 568 8688
🤖 *AI Mode:* Activated
⚡ *Prefix:* ${PREFIX}

┌─────────────────────┐
│  🤖 *AI FEATURES*  │
└─────────────────────┘
• Tag me to chat with AI
• Say "Godswill" to get my attention
• I respond naturally in groups!

┌─────────────────────┐
│  📌 *GENERAL*  │
└─────────────────────┘
• ${PREFIX}menu - This menu
• ${PREFIX}ping - Check speed
• ${PREFIX}ai [question] - Ask AI
• ${PREFIX}runtime - Bot uptime
• ${PREFIX}alive - Bot status

┌─────────────────────┐
│  👥 *GROUP ADMIN*  │
└─────────────────────┘
• ${PREFIX}hidetag [text] - Hidden tag
• ${PREFIX}tagall [text] - Tag everyone
• ${PREFIX}groupinfo - Group info
• ${PREFIX}kick @user - Remove member
• ${PREFIX}add [number] - Add member
• ${PREFIX}promote @user - Make admin
• ${PREFIX}demote @user - Remove admin
• ${PREFIX}delete - Delete message
• ${PREFIX}everyone - Tag all (alternative)

┌─────────────────────┐
│  🎮 *FUN & GAMES*  │
└─────────────────────┘
• ${PREFIX}joke - Random joke
• ${PREFIX}quote - Motivation
• ${PREFIX}fact - Random fact
• ${PREFIX}roast - Roast someone
• ${PREFIX}compliment - Nice words
• ${PREFIX}roll - Roll dice
• ${PREFIX}flip - Flip coin
• ${PREFIX}8ball [question] - Magic 8 ball

┌─────────────────────┐
│  🎨 *MEDIA*  │
└─────────────────────┘
• ${PREFIX}sticker - Make sticker
• ${PREFIX}steal - Steal sticker
• ${PREFIX}toimg - Sticker to image

┌─────────────────────┐
│  ⚙️ *OWNER ONLY*  │
└─────────────────────┘
• ${PREFIX}broadcast [msg] - Broadcast
• ${PREFIX}block - Block user
• ${PREFIX}unblock - Unblock user

*Godswill AI Bot V2.0*
_Powered by AI - Chat naturally!_
            `;
            msg.reply(menu);
        }

        // ==================== AI CHAT ====================
        else if (command === 'ai') {
            if (args.length === 0) {
                return msg.reply('⚠️ Usage: .ai [your question]');
            }
            const question = args.join(' ');
            await chat.sendStateTyping();
            const aiResponse = await getAIResponse(question);
            msg.reply(`🤖 *AI Response:*\n\n${aiResponse}`);
        }

        // ==================== HIDETAG ====================
        else if (command === 'hidetag') {
            if (!isGroup) {
                return msg.reply('⚠️ This command only works in groups!');
            }

            const text = args.join(' ') || 'Hidden tag!';
            let mentions = [];

            for (let participant of chat.participants) {
                mentions.push(participant.id._serialized);
            }

            await chat.sendMessage(text, { mentions });
            await msg.delete(true); // Delete the command message
        }

        // ==================== TAGALL / EVERYONE ====================
        else if (command === 'tagall' || command === 'everyone') {
            if (!isGroup) {
                return msg.reply('⚠️ This command only works in groups!');
            }

            const text = args.join(' ') || 'Attention everyone!';
            let mentions = [];
            let message = `📢 *${text}*\n\n`;

            for (let participant of chat.participants) {
                mentions.push(participant.id._serialized);
                message += `@${participant.id.user} `;
            }

            await chat.sendMessage(message, { mentions });
        }

        // ==================== PING ====================
        else if (command === 'ping') {
            const start = Date.now();
            await msg.reply('🏓 Pinging...');
            const end = Date.now();
            msg.reply(`⚡ *Pong!*\n\n📊 Speed: *${end - start}ms*\n🤖 Status: Online\n⏰ Uptime: ${Math.floor(process.uptime())}s`);
        }

        // ==================== ALIVE ====================
        else if (command === 'alive') {
            msg.reply(`
✅ *I'm Alive and Kicking!*

🤖 Bot: Godswill AI Bot
📊 Version: 2.0
⚡ Status: Online
⏰ Uptime: ${Math.floor(process.uptime())}s
👤 Owner: Godswill (+234 814 568 8688)
🧠 AI: Activated

_Running smoothly! Tag me to chat! 💪_
            `);
        }

        // ==================== RUNTIME ====================
        else if (command === 'runtime') {
            const uptime = process.uptime();
            const hours = Math.floor(uptime / 3600);
            const minutes = Math.floor((uptime % 3600) / 60);
            const seconds = Math.floor(uptime % 60);
            
            msg.reply(`⏰ *Runtime*\n\n🕐 ${hours}h ${minutes}m ${seconds}s\n\n_Bot has been running strong! 💪_`);
        }

        // ==================== GROUP INFO ====================
        else if (command === 'groupinfo') {
            if (!isGroup) {
                return msg.reply('⚠️ This command only works in groups!');
            }

            const admins = chat.participants.filter(p => p.isAdmin).length;
            msg.reply(`
📊 *Group Information*

📛 *Name:* ${chat.name}
👥 *Members:* ${chat.participants.length}
👑 *Admins:* ${admins}
📝 *Description:* ${chat.description || 'No description'}
🔗 *Group ID:* ${chat.id._serialized}
            `);
        }

        // ==================== DELETE MESSAGE ====================
        else if (command === 'delete' || command === 'del') {
            if (msg.hasQuotedMsg) {
                const quotedMsg = await msg.getQuotedMessage();
                await quotedMsg.delete(true);
                await msg.reply('✅ Message deleted!');
            } else {
                msg.reply('⚠️ Reply to a message with .delete to remove it');
            }
        }

        // ==================== KICK ====================
        else if (command === 'kick' || command === 'remove') {
            if (!isGroup) {
                return msg.reply('⚠️ This command only works in groups!');
            }

            const mentioned = msg.mentionedIds;
            if (mentioned.length === 0) {
                return msg.reply('⚠️ Tag someone to kick!\n\nUsage: .kick @user');
            }

            for (let user of mentioned) {
                await chat.removeParticipants([user]);
            }
            msg.reply('✅ User(s) removed from group!');
        }

        // ==================== ADD ====================
        else if (command === 'add') {
            if (!isGroup) {
                return msg.reply('⚠️ This command only works in groups!');
            }

            if (args.length === 0) {
                return msg.reply('⚠️ Provide a number!\n\nUsage: .add 2348145688688');
            }

            const number = args[0].replace(/[^0-9]/g, '') + '@c.us';
            try {
                await chat.addParticipants([number]);
                msg.reply('✅ User added to group!');
            } catch (error) {
                msg.reply('❌ Failed to add user. Make sure the number is correct!');
            }
        }

        // ==================== PROMOTE ====================
        else if (command === 'promote') {
            if (!isGroup) {
                return msg.reply('⚠️ This command only works in groups!');
            }

            const mentioned = msg.mentionedIds;
            if (mentioned.length === 0) {
                return msg.reply('⚠️ Tag someone to promote!\n\nUsage: .promote @user');
            }

            for (let user of mentioned) {
                await chat.promoteParticipants([user]);
            }
            msg.reply('✅ User(s) promoted to admin!');
        }

        // ==================== DEMOTE ====================
        else if (command === 'demote') {
            if (!isGroup) {
                return msg.reply('⚠️ This command only works in groups!');
            }

            const mentioned = msg.mentionedIds;
            if (mentioned.length === 0) {
                return msg.reply('⚠️ Tag an admin to demote!\n\nUsage: .demote @user');
            }

            for (let user of mentioned) {
                await chat.demoteParticipants([user]);
            }
            msg.reply('✅ User(s) demoted from admin!');
        }

        // ==================== JOKE ====================
        else if (command === 'joke') {
            const jokes = [
                "Why don't scientists trust atoms? Because they make up everything! 😄",
                "I told my wife she was drawing her eyebrows too high. She looked surprised! 😂",
                "Why did the scarecrow win an award? He was outstanding in his field! 🌾",
                "What do you call a bear with no teeth? A gummy bear! 🐻",
                "Why don't eggs tell jokes? They'd crack up! 🥚",
                "I'm reading a book about anti-gravity. It's impossible to put down! 📚",
                "Why did the math book look sad? It had too many problems! 📖"
            ];
            msg.reply(randomResponse(jokes));
        }

        // ==================== QUOTE ====================
        else if (command === 'quote') {
            const quotes = [
                "The only way to do great work is to love what you do. - Steve Jobs ✨",
                "Believe you can and you're halfway there. - Theodore Roosevelt 💪",
                "Success is not final, failure is not fatal. - Winston Churchill 🔥",
                "Dream big and dare to fail. - Norman Vaughan 🌟",
                "The future belongs to those who believe in their dreams. - Eleanor Roosevelt 💫",
                "Don't watch the clock; do what it does. Keep going. - Sam Levenson ⏰"
            ];
            msg.reply(randomResponse(quotes));
        }

        // ==================== FACT ====================
        else if (command === 'fact') {
            const facts = [
                "🌍 The Earth is about 4.5 billion years old!",
                "🐝 Honey never spoils. 3000-year-old honey is still edible!",
                "🦈 Sharks existed before trees!",
                "🌙 A day on Venus is longer than its year!",
                "🐙 Octopuses have three hearts!",
                "🍌 Bananas are berries, but strawberries aren't!",
                "⚡ Lightning strikes the Earth 100 times per second!"
            ];
            msg.reply(randomResponse(facts));
        }

        // ==================== ROAST ====================
        else if (command === 'roast') {
            const roasts = [
                "You're not stupid, you just have bad luck when thinking! 😂",
                "I'd agree with you, but then we'd both be wrong! 🤷",
                "You bring everyone so much joy... when you leave the room! 😅",
                "I'm not saying you're dumb, but you have bad luck when it comes to thinking! 🧠",
                "If laughter is the best medicine, your face must be curing the world! 💀"
            ];
            msg.reply(randomResponse(roasts));
        }

        // ==================== COMPLIMENT ====================
        else if (command === 'compliment') {
            const compliments = [
                "You're more awesome than a unicorn riding a rainbow! 🦄🌈",
                "Your smile could light up a whole city! 😊✨",
                "You're one in a million! Actually, one in a billion! 💎",
                "You have the best laugh! 😄",
                "You're a gift to everyone you meet! 🎁"
            ];
            msg.reply(randomResponse(compliments));
        }

        // ==================== ROLL DICE ====================
        else if (command === 'roll') {
            const dice = Math.floor(Math.random() * 6) + 1;
            msg.reply(`🎲 You rolled: *${dice}*`);
        }

        // ==================== FLIP COIN ====================
        else if (command === 'flip') {
            const coin = Math.random() < 0.5 ? 'Heads' : 'Tails';
            msg.reply(`🪙 *${coin}!*`);
        }

        // ==================== 8BALL ====================
        else if (command === '8ball') {
            if (args.length === 0) {
                return msg.reply('⚠️ Ask a yes/no question!\n\nUsage: .8ball Will I be rich?');
            }
            const responses = [
                "Yes, definitely! ✅",
                "It is certain! 💯",
                "Without a doubt! 🎯",
                "Yes! 👍",
                "Most likely! 🤞",
                "Outlook good! 😊",
                "Maybe... 🤔",
                "Ask again later! ⏰",
                "Cannot predict now! 🔮",
                "Don't count on it! ❌",
                "No! 👎",
                "Very doubtful! 😬"
            ];
            msg.reply(`🎱 *Magic 8 Ball says:*\n\n${randomResponse(responses)}`);
        }

        // ==================== STICKER ====================
        else if (command === 'sticker' || command === 's' || command === 'steal') {
            if (msg.hasMedia) {
                const media = await msg.downloadMedia();
                await client.sendMessage(sender, media, {
                    sendMediaAsSticker: true,
                    stickerName: 'Godswill Bot',
                    stickerAuthor: 'Godswill'
                });
            } else if (msg.hasQuotedMsg) {
                const quotedMsg = await msg.getQuotedMessage();
                if (quotedMsg.hasMedia) {
                    const media = await quotedMsg.downloadMedia();
                    await client.sendMessage(sender, media, {
                        sendMediaAsSticker: true,
                        stickerName: 'Godswill Bot',
                        stickerAuthor: 'Godswill'
                    });
                }
            } else {
                msg.reply('⚠️ Send or reply to an image/video with .sticker');
            }
        }

        // ==================== OWNER COMMANDS ====================
        else if (command === 'broadcast' && isOwner) {
            if (args.length === 0) {
                return msg.reply('⚠️ Usage: .broadcast [message]');
            }
            const broadcastMsg = args.join(' ');
            const chats = await client.getChats();
            let count = 0;
            
            for (let chat of chats) {
                if (chat.isGroup) {
                    await chat.sendMessage(`📢 *Broadcast from Godswill*\n\n${broadcastMsg}`);
                    count++;
                }
            }
            msg.reply(`✅ Broadcast sent to ${count} groups!`);
        }

        // ==================== INVALID COMMAND ====================
        else {
            msg.reply(`❌ Unknown command: *${command}*\n\nType *.menu* for available commands.`);
        }

    } catch (error) {
        console.error('Error:', error);
        msg.reply('❌ Oops! Something went wrong. Try again later!');
    }
});

// Welcome new members (with AI touch)
client.on('group_join', async (notification) => {
    const chat = await notification.getChat();
    const contact = await notification.getContact();
    
    const welcomeMessages = [
        `Welcome to the squad, @${contact.id.user}! 🎉\n\nLet's vibe together! Type .menu to see what I can do.\n\n- Godswill`,
        `Yo @${contact.id.user}! Welcome! 👋\n\nGlad to have you here! Check out .menu for my commands.\n\n- Godswill`,
        `Hey @${contact.id.user}! 🔥\n\nWelcome to the group! I'm Godswill, your AI assistant. Type .menu to explore!\n\n- Godswill`
    ];
    
    await chat.sendMessage(randomResponse(welcomeMessages), {
        mentions: [contact]
    });
});

// Initialize
client.initialize();

console.log('🚀 Starting Godswill AI Bot V2.0...');
console.log('🤖 AI Features: Activated');
console.log('👤 Owner: +234 814 568 8688');
console.log('💬 Natural chat enabled!');
