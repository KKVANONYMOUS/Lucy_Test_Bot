require('dotenv').config()
const { Telegraf } = require('telegraf')
const bot = new Telegraf(process.env.BOT_TOKEN)

bot.start(ctx=>ctx.reply("ldbfghcdgV"))

const evresp = (gevent) => {
    switch (gevent) {

        case "issues":
            return `
Issue Title and Number  : ${process.env.INPUT_IU_TITLE} | #${process.env.INPUT_IU_NUM}
Commented or Created By : \`${process.env.INPUT_IU_ACTOR}\`
Issue Body : *${process.env.INPUT_IU_BODY}*
[Link to Issue](https://github.com/${process.env.GITHUB_REPOSITORY}/issues/${process.env.INPUT_IU_NUM})
[Link to Repo ](https://github.com/${process.env.GITHUB_REPOSITORY}/)`
    }
}
const output = evresp(process.env.GITHUB_EVENT_NAME)
bot.telegram.sendMessage(process.env.CHAT_ID,output,{parse_mode : "Markdown"})
bot.launch()
