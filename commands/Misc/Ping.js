"use strict";

const fs = require('fs');
const path = require('path');
const Command = require('discordbot-core').Command;

let img;

class Ping extends Command {
  
  constructor(config) {
    super(config);
    
    this.aliases = ["ping"];
    this.group = "Misc";
    this.description = 'Ping the bot';
    this.usage = 'ping';
    
    img = fs.readFileSync(path.join(config.imagePath, "finger-trans-118.png"));
  }
  
  /**
   * @param {Object} msg
   * @param {String} command
   * @param {Array} args
   */
  execute(msg, args) {
    super.execute.apply(this, arguments);
    if (!this.validate(args)) return;
    
    msg.client.sendFile(msg.channel, img, () => {
      this.sendMessage("Pong Motherfucker!");
    });
    
    this.log("Command", "Ping");
  }
}

module.exports = Ping;