const {Telegraf} = require('telegraf')
const { Octokit } = require('@octokit/rest');

const PROD_ENV = process.env.NODE_ENV === 'production';

if (!PROD_ENV) {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    require('dotenv').config();
}
const bot = new Telegraf(process.env.BOT_TOKEN || '')

bot.start(ctx=>ctx.reply("Lucy test bot online..."))

bot.command('DevTalks', async ctx => {
    const octokit = new  Octokit();
    const { data } = await octokit.issues.listForRepo({
      owner: 'COPS-IITBHU',
      repo: 'DevTalks',
    });
  
    if (data.length == 0) {
      ctx.reply('No upcoming dev talks.');
    }
  
    const msgList = data.map(
      (element) => `[${element.title}](${element.html_url}) by [${element.user.login}](${element.user.html_url})`,
    );
  
    ctx.telegram.sendMessage(ctx.chat.id,msgList.join('\n\n'),{
        parse_mode:'Markdown'
    })
});

if (!PROD_ENV) {
    bot.launch();
  }

