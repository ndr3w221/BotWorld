const Discord = require('discord.js');
const fs = require('fs');
const config = require("../../botconfig/config.json");

module.exports = {
    name: "rolecount",
    usage: 'rolecount',
    description: 'Get roles in guild and number of users with the role',
    category: "Utility",
        run: async(bot, command, args, message, updateJSON, addFooter) => {
        let roleEmbed = new Discord.MessageEmbed()
        .setColor('#50BB7C')

        message.guild.cache.roles.forEach(function(role){
            roleEmbed.addField(role.name, role.members.size);
        });
        addFooter(roleEmbed, bot, message, command, args);
        message.channel.send(roleEmbed);
}
};
