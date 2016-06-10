"use strict";

const discordbot = require('discordbot-core');
const ChannelModel = require('../../models/Channels');
const Command = discordbot.Command;
const logger = discordbot.logger;
const utils = discordbot.utils;

class Channels extends Command {
  
  constructor(config) {
    super(config);
    
    this.aliases = ["channels"];
    this.group = "Stats";
    this.description = "Get channel stats per server";
    this.usage = "channels";
  }
  
  execute(msg, args) {
    super.execute.apply(this, arguments);
    if (!this.validate(args)) return;

    ChannelModel.find({ server: msg.server.id }).sort({ messages: 'desc' }).exec((err, docs) => {
      if (err) {
        logger.error(err);
        return this.sendMessage("Unable to get channel stats on this server.");
      }

      const msgArray = [];
      msgArray.push('```Most active channels on this server.\n');
      for (let doc of docs) {
        msgArray.push(`${utils.pad(doc.messages.toString(), 8)} #${doc.name}`);
      }
      msgArray.push('```');

      this.sendMessage(msgArray);
    });
  }
}

module.exports = Channels;
