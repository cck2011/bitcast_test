import axios from "axios";
import dotenv from "dotenv";
import { Telegraf, Context, Markup } from "telegraf";
dotenv.config();

const TOKEN: string = process.env.TOKEN || "";
// console.log(TOKEN);

const bot = new Telegraf(TOKEN);
// const botComposer = new Composer()

bot.start((ctx: Context) => {
    ctx.reply("你好，我係bidcast bot，請打開左下角Menu 選擇項目");
});

bot.help((ctx: Context) => {
    // console.log(ctx);
    console.log("有人叫/help");

    ctx.reply(`/start 開始\n/help 幫手\n`);
});

// bot.command('bidcast', (ctx) =>
//   ctx.reply('你好，我係bidcast bot，請問有咩幫到你？\n 認証帳戶，請按：verify\n function2，請按：func2\n function3，請按：func3', Markup
//     .keyboard(['/Verify','/function2',"/function3"])
//     .oneTime()
//     .resize()
//   )
// )

// bot.command('verify', ctx.reply('Hey', Extra.markup(Markup.forceReply())))
// botComposer.settings(async (ctx:any) => {
//     await  ctx.setMyCommands([
//       {
//         command: '/Verify',
//         description: '認証Bidcast登記Telegram帳戶',
//       },
//       {
//         command: '/How',
//         description: 'How to verify',
//       },
//     ])
//     return ctx.reply('Ok')
//   })

bot.settings(async (ctx) => {
    await ctx.setMyCommands([
        {
            command: "/verify",
            description: "認証你於Bidcast上登記的 Telegram 帳戶",
        },
        {
            command: "/how",
            description: "查詢認証流程",
        },
        {
            command: "/recentbuyerinfo",
            description: "查詢近期3次直播的買家資料",
        },
        {
            command: "/recentsellerinfo",
            description: "查詢近期10件拍賣品的賣家資料",
        },
    ]);
    return ctx.reply("Ok");
});

bot.command("verify", (ctx) => {
    ctx.reply("請輸入TOKEN以確認 Telegram 帳戶", Markup.forceReply());
});
bot.command("how", (ctx) => {
    ctx.reply(
        "認証Bidcast的Telegram帳戶流程：\n\n  Step 1: 註冊成為bidcast會員\n  Step 2: 在手機telegram設置中，加入username\n  Step 3: 到更改帳戶資料頁面填上你的Telegram username(eg. @Bidcast_bot)\n  Step 4: 打開左下方Menu，選擇/verify\n  Step 5: 輸入你的bidcast TOKEN\n  Step 6: 看到成功確認信息後，回bidcast網頁的帳戶資料頁面，Telegram帳戶欄會變成「已確認」狀態"
    );
});

bot.hears(/token_/i, async (ctx) => {
    console.log("token detected");
    // ctx.reply("token detected")

    let tgChatId = ctx.message.from.id;
    let query = ctx.message.text.trim();

    // checking?
    let token = query.trim();
    console.log("token", token);
    ctx.reply(`接收TOKEN為：${token}`);

    let tgGetUsername = ctx.message.from.username
        ? `@${ctx.message.from.username}`
        : "";
    // let tgChatId = ctx.message.from.id;
    console.log("tgChatId>>>>>>>>>>>", tgChatId);
    console.log("tgUsername>>>>>>>>>>>", tgGetUsername);

    const result = await checkVerified(tgChatId, tgGetUsername, token);
    ctx.reply(result);

    // }
});

async function checkVerified(
    tgChatId: number,
    tgGetUsername: string,
    tgTokenBody: string
) {
    try {
        const res = await axios(
            `${process.env.REACT_APP_BACKEND_URL}/bidcast-bot/checkVerified`,
            {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                data: { tgChatId, tgGetUsername, tgTokenBody },
            }
        );

        // console.log("res", res);
        const result: any = await res.data;
        const msg = result.data.msg;
        return msg;
        // console.log("result", result.data.msg);
    } catch (error) {
        console.log(error);
    }
}

bot.command("recentbuyerinfo", async (ctx) => {
    let tgChatId = ctx.message.from.id;
    ctx.reply("正在查詢資訊...");
    try {
        const res = await axios.get<{
            message: string[];
        }>(
            `${process.env.REACT_APP_BACKEND_URL}/bidcast-bot/recentBuyerInfo?tgChatId=${tgChatId}`
        );

        ctx.reply(res.data.message.join("\n\n"));
    } catch (error) {
        console.log(error);
    }
});

bot.command("recentsellerinfo", async (ctx) => {
    let tgChatId = ctx.message.from.id;
    ctx.reply("正在查詢資訊...");
    try {
        const res = await axios.get<{
            message: string[];
        }>(
            `${process.env.REACT_APP_BACKEND_URL}/bidcast-bot/recentSellerInfo?tgChatId=${tgChatId}`
        );

        console.log(res.data);
        ctx.reply(res.data.message.join("\n\n"));
    } catch (error) {
        console.log(error);
    }
});

bot.on("text", (ctx) => {
    ctx.telegram.sendMessage(ctx.message.chat.id, `請打開左下角Menu 選擇項目`);

    // Explicit usage
    // ctx.telegram.sendMessage(ctx.message.chat.id, `Hello ${ctx.state.role}`);
    // Using context shortcut
    // ctx.reply(`Hello ${ctx.state.role}`);
});

bot.on("sticker", (ctx) => {
    ctx.telegram.sendMessage(ctx.message.chat.id, `請打開左下角Menu 選擇項目`);
});

bot.on("callback_query", (ctx) => {
    // Explicit usage
    ctx.telegram.answerCbQuery(ctx.callbackQuery.id);

    // Using context shortcut
    ctx.answerCbQuery();
});

bot.on("inline_query", (ctx) => {
    const result: any[] = [];
    // Explicit usage
    ctx.telegram.answerInlineQuery(ctx.inlineQuery.id, result);

    // Using context shortcut
    ctx.answerInlineQuery(result);
});

// bot.sendMessage("@cto56", "testing");

bot.catch((err) => {
    console.log(err);
});

bot.launch();

//*** Sample field ***
//*** Sample field ***
//*** Sample field ***

//! Send phone number or location
// bot.command('function2', (ctx) => {
//     return ctx.reply(
//       'Special buttons keyboard',
//       Markup.keyboard([
//         Markup.button.contactRequest('Send contact'),
//         Markup.button.locationRequest('Send location')
//       ]).resize()
//     )
//   })

//! quiz
// bot.command('quiz', (ctx) =>
//   ctx.replyWithQuiz(
//     '2b|!2b',
//     ['True', 'False'],
//     { correct_option_id: 0 }
//   )
// )
//! Poll
// bot.command('poll', (ctx) =>
//   ctx.replyWithPoll(
//     'Your favorite math constant',
//     ['x', 'e', 'π', 'φ', 'γ'],
//     { is_anonymous: false }
//   )
// )
//! create Poll or Quiz
// const keyboard = Markup.keyboard([
//     Markup.button.pollRequest('Create poll', 'regular'),
//     Markup.button.pollRequest('Create quiz', 'quiz')
//   ])
// bot.start((ctx) => ctx.reply('supported commands: /poll /quiz', keyboard))

//*** Sample field ***
//*** Sample field ***
//*** Sample field ***
