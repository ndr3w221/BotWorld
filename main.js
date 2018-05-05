const http = require('http');
const express = require('express');
const app = express();
app.get("/", (request, response) => {
  console.log(Date.now() + " Ping Received");
  response.sendStatus(200);
});
app.listen(process.env.PORT);
setInterval(() => {
  http.get(`http://${process.env.PROJECT_DOMAIN}.glitch.me/`);
  console.log(bot.guilds.size);
}, 280000);

//Setup for editing the filesystem for config
var fs = require('fs');
//Discord
const Discord = require('discord.js');
//Config
const config = require(`./config.json`);

const dbl = require(`discord-bot-list`);

let bot = new Discord.Client({'disableEveryone': true});
bot.commands = new Discord.Collection();
bot.queue;
bot.dispatcher;

//Read economy commands
fs.readdir('./commands/economy/', function(err, files){
    if(err) console.log(err);

    let jsfile = files.filter(f => f.split('.').pop() == 'js');
    if(jsfile.length<=0){
        console.log('error reading files');
    }

    jsfile.forEach(function(f, i){
        let props = require(`./commands/economy/${f}`);
        props.help.names.forEach(function(name){
            bot.commands.set(name, props);
        });
    });
});

//read fun commands
fs.readdir('./commands/fun/', function(err, files){
    if(err) console.log(err);

    let jsfile = files.filter(f => f.split('.').pop() == 'js');
    if(jsfile.length<=0){
        console.log('error reading files');
    }

    jsfile.forEach(function(f, i){
        let props = require(`./commands/fun/${f}`);
        props.help.names.forEach(function(name){
            bot.commands.set(name, props);
        });
    });
});

//read admin commands
fs.readdir('./commands/admin/', function(err, files){
    if(err) console.log(err);

    let jsfile = files.filter(f => f.split('.').pop() == 'js');
    if(jsfile.length<=0){
        console.log('error reading files');
    }

    jsfile.forEach(function(f, i){
        let props = require(`./commands/admin/${f}`);
        props.help.names.forEach(function(name){
            bot.commands.set(name, props);
        });
    });
});

//read technical commands
fs.readdir('./commands/technical/', function(err, files){
    if(err) console.log(err);

    let jsfile = files.filter(f => f.split('.').pop() == 'js');
    if(jsfile.length<=0){
        console.log('error reading files');
    }

    jsfile.forEach(function(f, i){
        let props = require(`./commands/technical/${f}`);
        props.help.names.forEach(function(name){
            bot.commands.set(name, props);
        });
    });
});

//Read music commands
fs.readdir('./commands/music/', function(err, files){
    if(err) console.log(err);

    let jsfile = files.filter(f => f.split('.').pop() == 'js');
    if(jsfile.length<=0){
        console.log('error reading files');
    }

    jsfile.forEach(function(f, i){
        let props = require(`./commands/music/${f}`);
        props.help.names.forEach(function(name){
            bot.commands.set(name, props);
        });
    });
});


const client = new dbl({
    token: config.dbl,
    id: "404762043527462922"
});

function updateDiscordBotList(count){
    client.postStats(count, (err, res) => {
        if(err) {
            console.error(err);
        } else {
            console.log(res);
        }
    })
}

//On bot.ready
bot.on('ready', function(){
    console.log(`${bot.user.username}: online`);
    bot.user.setActivity('b-help');
    updateDiscordBotList(bot.guilds.size);
});

bot.on('guildCreate', updateDiscordBotList);
bot.on('guildDelete', updateDiscordBotList);

bot.on('message', function(message){
    //setup command variables
    let prefix = config.prefix;
    if(message.content.toLowerCase().substring(0, prefix.length)!=prefix && message.content){
      return;
    }
    let args = message.content.split(" ");
    let command = args[0];
    command = command.slice(prefix.length).toLowerCase();
    args = args.slice(1); 

    let commandFile = bot.commands.get(command);
    if(commandFile){
        commandFile.run(bot,command,args,message, 
    function updateJSON(){
        if(JSON.stringify(config, null, 2).endsWith("}}")){
            fs.writeFile('../../../config', JSON.stringify(config, null, 2).substring(0, JSON.stringify(config, null, 2).length - 1), function (err) {
                if (err) return console.log(err);
            });
        }else{
            fs.writeFile('./config.json', JSON.stringify(config, null, 2), function (err) {
                if (err) return console.log(err);
            });
        }
    }, function addFooter(embed, bot, message, command, args){
        embed.setFooter(`${bot.user.tag} version 2.5.2 - ` + new Date().toISOString(), bot.user.avatarURL);
    });
    }
});

bot.login(config.token);
