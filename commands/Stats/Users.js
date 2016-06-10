"use strict";

const discordbot = require('discordbot-core');
const UserModel = require('../../models/Users');
const Command = discordbot.Command;
const logger = discordbot.logger;
const utils = discordbot.utils;

class Users extends Command {
  
  constructor(config) {
    super(config);
    
    this.aliases = ["users"];
    this.group = "Stats";
    this.description = "Get user stats per server";
    this.usage = "users";
  }

  toArray(obj) {
    const arr = [];
    for (let i in obj) {
      arr.push(obj[i]);
    }
    return arr;
  }
  
  execute(msg, args) {
    super.execute.apply(this, arguments);
    if (!this.validate(args)) return;

    let query = { server: msg.server.id };

    if (args.length) {
      query.channel = msg.server.channels.get("name", args[0].replace('#', '')).id;
    }

    UserModel.find(query).sort({ messages: 'desc' }).exec((err, docs) => {
      if (err) {
        logger.error(err);
        return this.sendMessage("Unable to get user stats for this server.");
      }

      let users = {};
      for (let doc of docs) {
        if (users[doc.uid]) {
          users[doc.uid].messages += doc.messages;
          users[doc.uid].score += doc.score;
        } else {
          users[doc.uid] = doc;
        }
      }

      users = this.toArray(users).sort((a, b) => {
        return (a.messages < b.messages) ? 1 : (a.messages > b.messages) ? -1 : 0;
      }).slice(0,15);

      const msgArray = [],
            serverOrChannel = query.channel ? 'channel' : 'server';

      msgArray.push('```');
      msgArray.push(`Most active users on this ${serverOrChannel}.\n`)
      for (let user of users) {
        user.username = user.username.replace(/`/g, "`" + String.fromCharCode(8203));
        msgArray.push(`${utils.pad(user.messages.toString(), 8)} ${user.username}`);
      }
      msgArray.push('```');

      for (let line of msgArray) {
        console.log(line);
      }

      this.sendMessage(msgArray);
    });
  }
}

module.exports = Users;
