require('dotenv').config();

const Discord = require('discord.js');
const { Client, MessageEmbed, ReactionManager } = require('discord.js');
const Winston = require('winston');
const Util = require('util');
const { sign } = require('crypto');

const TOKEN = process.env.TOKEN;
const LOGGER = Winston.createLogger({
    level: 'info',
    format: Winston.format.json(),
    transports: [
      new Winston.transports.Console(),
      new Winston.transports.File({ filename: 'app.log' })
    ] 
});

const raidEmoji = '🏰';
const dungeonEmoji = '🏚️';
const pvpEmoji = '🤺';
const signupEmoji = '✅';
const cancelSignupEmoji = '🔴';

const bot = new Discord.Client();

bot.login(TOKEN);

bot.on('ready', function (evt) {
    LOGGER.info('Connected!');
    LOGGER.info(`Logged in as: ${bot.user.tag}`);
});

bot.on('message', message => {
    if(message.content.substring(0,1) == '!') {
        var arguments = message.content.substring(1).split(' ');
        var command = arguments[0];
        arguments = arguments.splice(1);
        LOGGER.info(`command ${command.toString()}`);
        LOGGER.info(`arguments ${arguments.toString()}`);
        handleCommand(command, arguments, message);
    }
});

bot.on('messageReactionAdd', async(reaction, user) => {
    if(user.bot == false) {
        
        handleReaction(reaction, user);
    }
});

function handleCommand(command, arguments, message) {
    switch(command) {
        case 'lfg':
            handleLfg(arguments, message);
            break;
    }
}

function handleReaction(reaction, user) {
    switch(reaction.emoji.name) {
        case signupEmoji:
            // TODO: discern if Raid or Dungeon, etc
            var reactionMap = reaction.message.reactions.cache;
            if(reactionMap[signupEmoji]) {
                LOGGER.info("Signed Up");

            }

            if(reactionMap[cancelSignupEmoji]) {
                LOGGER.info("Cancelled");
            }
            LOGGER.info(`${Util.inspect(reaction.message.reactions.cache)} <--`);
        break;
    }
}

function handleLfg(arguments, message) {
    const event = arguments[0];
    const values = arguments.slice(1, arguments.length);

    LOGGER.info(`${event} with ${values}`);

    // slice lev, eow, sos, lw, sotp, cos, gos

    switch(event) {
        case 'raid':
            // NOTE: add arguments.length check for valid args else print help 

            LOGGER.info(Util.inspect(arguments));
            
            const title = evaluateRaidSelection(arguments[1]);

            const embed = new MessageEmbed()
            .setTitle(`Raid Signup - ${title}`)
            .setColor(0xFF0000)
            .setDescription(`Signup - ${signupEmoji}\nCancel Signup - ${cancelSignupEmoji}`);
            
            // Send the embed to the same channel as the message
            message.channel.send(embed).then(embeddedMessage => {
                embeddedMessage.react(signupEmoji);
                embeddedMessage.react(cancelSignupEmoji);
            });

            break;
    }
}

function evaluateRaidSelection(raidShortName) {
    var raidLongName;

    switch(raidShortName) {
        case 'lev':
            raidLongName = 'Leviathan';
            break;
        case 'eow':
            raidLongName = 'Eater of Worlds';
            break;
        case 'sos':
            raidLongName = 'Spire of Stars';
            break;
        case 'lw':
            raidLongName = 'Last Wish';
            break;
        case 'sotp':
            raidLongName = 'Scourge of the Past';
            break;
        case 'cos':
            raidLongName = 'Crown of Sorrow';
            break;
        case 'gos':
            raidLongName = 'Garden of Salvation';
            break;
                        
    }

    return raidLongName;
}