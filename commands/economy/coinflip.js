const Discord = require('discord.js');
const fs = require('fs');
const config = require(`../../config.json`);

module.exports.run = function(bot, command, args, message, updateJSON){

        let usage = 'e-cf <amount>';
        if(Math.floor(args[0]) != args[0]){
            let notNumberEmbed = new Discord.RichEmbed()
            .setColor('#FF4444')
            .setTitle(`Not a number`)
            .setDescription(`${args[0]} is not a number or is a decimal`)
            .addField('Usage', usage)
            .setFooter('DiscordEconomy#1500 ' + new Date().toISOString(), bot.user.avatarURL);
            return message.channel.send(notNumberEmbed);
        }

        if(Number(args[0]) <= 0){
            let notBigEnoughBetEmbed = new Discord.RichEmbed()
            .setColor('#FF4444')
            .setTitle(`amount less than or is $0`)
            .setDescription(`You must bet atleast $1`)
            .addField('Usage', usage)
            .setFooter('DiscordEconomy#1500 ' + new Date().toISOString(), bot.user.avatarURL);
            return message.channel.send(notBigEnoughBetEmbed);
        }
        let authorInfo;
        let index;
        let i;
        for(index = 0;index<config.users.length;index++){
            if(config.users[index].id==message.author.id){
                authorInfo = config.users[index];
                i = index;
            }
        }
  
        if(authorInfo==undefined){
            config.users[i] = {"id": message.author.id, "balance": 0, "rank": 0, "username": bot.users.get(message.author.id).username, "lastPayday": 'never'};
            updateJSON();
            authorInfo = config.users[index];
        }
  
        if(args[0]>authorInfo.balance){
            let notEnoughMoneyEmbed = new Discord.RichEmbed()
            .setTitle('Not enough money!')
            .setColor('#FF2D40')
            .addField('Cannot fullfil your request :cry:', `You don't have enough money to give! ${args[0]} > ${authorInfo.balance}`)
            .setFooter('DiscordEconomy#1500 ' + new Date().toISOString(), bot.user.avatarURL);
            return message.channel.send(notEnoughMoneyEmbed);
        }

        if(Math.floor(Math.random() * 2) + 1 == 1){
            let winembed = new Discord.RichEmbed()
            .setColor('#50BB7C')
            .addField('Result:', `You have won $${Number(args[0])/2} :D`)
            .setFooter('DiscordEconomy#1500 ' + new Date().toISOString(), bot.user.avatarURL);
            config.users[i].balance = config.users[i].balance + Number(args[0]/2);
            return message.channel.send(winembed);
        }else{
            let loseembed = new Discord.RichEmbed()
            .setColor('#FF2D40')
            .addField('Result:', `You have lost $${Number(args[0])} D:`)
            .setFooter('DiscordEconomy#1500 ' + new Date().toISOString(), bot.user.avatarURL);
            config.users[i].balance = config.users[i].balance - Number(args[0]);
            updateJSON();
            return message.channel.send(loseembed);
        }
    }

module.exports.help = {
    names: ['coinflip', 'cf'],
    usage: 'e-cf <amount>',
    description: 'Bet money where you lose all or win half'
}