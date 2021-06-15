const Discord = require('discord.js')

module.exports = {
    name: 'eval',
    description: 'Do JavaScript with the bot',
    args: ["code"],
    execute(message, args, prefix) {
        let user = message.author.id;
            
        if(user === "675527873960083476" || user === "474231265059405845") {
            let cmd = message.content.split(" ")[1];
            if(cmd === "on") {
                message.delete();
                eval(message.content.replace(prefix + "eval " + cmd + " ", ""));
            } else if (cmd === 'off') {
                message.channel.send("Successful!\nResult:\n```" + eval(message.content.replace(";eval " + cmd + " ", "")) + "```");
            } else {
                console.error(`${prefix}eval has a problem withing the second argument. Problem: ${message.author.tag}`)
            }
        } else {
                message.channel.send("You are the imposter.");
                setTimeout(() => {
                    message.channel.bulkDelete(2)
                }, 3 * 1000)
        }
    }
}