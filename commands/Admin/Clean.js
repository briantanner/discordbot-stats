"use strict";

const Command = require('discordbot-core').Command;

class Clean extends Command {
  
  constructor(config) {
    super(config);
    
    this.aliases = ["clean"];
    this.group = "Admin";
    this.description = "Delete 100 messages";
    this.usage = "clean";
    this.hideFromHelp = true;
    this.permissions = "admin";
  }
  
  execute(msg, args) {
    super.execute.apply(this, arguments);
    if (!this.validate(args, 1)) return;
    
    let deleted = 0;
    
    msg.client.getChannelLogs(msg.channel, args[0], (err, messages) => {
      if (err) {
        return msg.client.sendMessage(msg.channel, "```" + err + "```");
      }

      // let msgs = [];
      
      // for (let m of messages) {
      //   if (deleted >= args[0]) continue;
      //   if (m.author === m.client.user) {
      //     msgs.push(m);
      //     deleted++;
      //   }
      // }

      msg.client.deleteMessages(messages).then(() => {
        console.log('Done');
      }).catch(err => {
        console.log(err);
      });
    });
  }
}

module.exports = Clean;