"use strict";

const discordbot = require('discordbot-core');
const mongoose = require('mongoose');
const Users = require('../models/Users');
const Channels = require('../models/Channels');
const logger = discordbot.logger;
const utils = discordbot.utils;
const test = true;

class Stats {
  constructor(config) {
    this.config = config;

    mongoose.connect('mongodb://localhost/statbot');
    this.db = mongoose.connection;

    this.db.on('error', logger.error);
    this.db.once('open', () => logger.info("Connected to mongo."));
  }
  
  static get name() {
    return 'Stats';
  }

  start(client) {
    this.client = client;

    client.on("message", this.onMessage.bind(this));
  }

  onMessage(msg) {
    if (msg.author.bot) return;

    let words = msg.cleanContent,
        userId = msg.author.id + msg.channel.id;

    // ignore small words to prevent gaming and guage substance
    words = words.replace(/[^\w\s]/gi, '').split(' ').filter(word => word.length > 3);

    logger.debug(`${utils.pad(msg.server.name,12)} > ${utils.pad(msg.channel.name,12)} > ${utils.pad(msg.author.name, 16)} > ${words.length || 1} > ${msg.cleanContent.substring(0,90)}`);

    const userDoc = {
      _id: userId,
      uid: msg.author.id,
      username: msg.author.username,
      server: msg.server.id,
      channel: msg.channel.id,
      $inc: { messages: 1, score: words.length || 1 }
    };

    const channelDoc = {
      _id: msg.channel.id,
      server: msg.server.id,
      name: msg.channel.name,
      $inc: { messages: 1 }
    };

    Users.update({ _id: userId }, userDoc, { upsert: true }, (err) => {
      if (err) logger.error(err);
    });

    Channels.update({ _id: msg.channel.id }, channelDoc, { upsert: true }, (err) => {
      if (err) logger.error(err);
    });
  }
}

module.exports = Stats;
