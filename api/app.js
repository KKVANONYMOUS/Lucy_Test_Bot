require('dotenv').config();
const {Telegraf} = require('telegraf')
const { Octokit } = require('@octokit/rest'); 

const {
  INPUT_STATUS: ipstatus, 
  INPUT_TOKEN: tgtoken, //Telegram api token
  INPUT_CHAT: chatid,// Telegram Chat ID
  INPUT_IU_TITLE: ititle,// Issue title
  INPUT_IU_NUM: inum,// Issue Number
  INPUT_IU_ACTOR: iactor, // Issue made by
  INPUT_IU_BODY: ibody, // Issue Body
  INPUT_PR_NUM: pnum, // PR Number
  INPUT_PR_STATE: prstate, // PR Opened, reponed or closed
  INPUT_PR_TITLE: ptitle, // PR Title
  INPUT_PR_BODY: pbody, // Body of the PR
  GITHUB_EVENT_NAME: ghevent, // Name of the trigger event
  GITHUB_REPOSITORY: repo, // Repository the trigger was made from
  GITHUB_ACTOR: ghactor, // User who triggered the action
  GITHUB_SHA: sha, // Commit ID
  GITHUB_WORKFLOW: ghwrkflw // Workflow Name
} = process.env;

const bot = new Telegraf(process.env.BOT_TOKEN)
// Function to return the response for the specific trigger
const evresp = (gevent) => {
  switch (gevent) {
//Switch statement for issues
      case "issues":
          return `
❗️❗️❗️❗️❗️❗️

Issue ${prstate}

Issue Title and Number  : ${ititle} | #${inum}

Commented or Created By : \`${iactor}\`

Issue Body : *${ibody}*

[Link to Issue](https://github.com/${repo}/issues/${inum})
[Link to Repo ](https://github.com/${repo}/)
[Build log here](https://github.com/${repo}/commit/${sha}/checks)`
// Switch statement for Pull Requests
      case "pull_request":
          return `
🔃🔀🔃🔀🔃🔀
PR ${prstate} 

PR Number:      ${pnum}

PR Title:       ${ptitle}

PR Body:        *${pbody}*

PR By:          ${ghactor}

[Link to Issue](https://github.com/${repo}/pull/${pnum})
[Link to Repo ](https://github.com/${repo}/)
[Build log here](https://github.com/${repo}/commit/${sha}/checks)`
      default:
// switch statement for Pushes
          return `
⬆️⇅⬆️⇅

ID: ${ghwrkflw}

Action was a *${ipstatus}!*

\`Repository:  ${repo}\` 

On:          *${ghevent}*

By:            *${ghactor}* 

Tag:        ${process.env.GITHUB_REF}

[Link to Repo ](https://github.com/${repo}/)
          `
  }
}

// assigning the output to a variable
const output = evresp(ghevent)
console.log(output)
bot.telegram.sendMessage(process.env.MY_ID,output,{parse_mode : "Markdown"})

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
  
    ctx.telegram.sendMessage(process.env.MY_ID,msgList.join('\n\n'),{
        parse_mode:'Markdown'
    })
});

bot.launch();

module.exports = (req,resp) => {
  if (req.method === 'POST') bot.handleUpdate(req.body, resp);
  else resp.status(200).send('Use POST to use Telegram bot!');
};
