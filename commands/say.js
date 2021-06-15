const Discord = require('discord.js');

module.exports = {
    name: 'say',
    description: 'Make the bot say something',
    args: ["message"],
    execute(message, args, color) {
        msg = args.join(" ")
        if (!msg) return message.channel.send("You need what you are going to say")
        message.delete()
        let sayEmbed = new Discord.MessageEmbed()
        .setColor(color)
        .setAuthor(`${message.author.username.toString()} says:`, message.author.avatarURL())
        .setDescription(msg)
        message.channel.send(sayEmbed);
    }
}