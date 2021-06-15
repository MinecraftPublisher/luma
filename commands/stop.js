const Discord = require("discord.js")

module.exports = {
    name: 'stop',
    description: 'Shut downs the bot',
    async execute(message, args, client) {
        if (message.member.user.id === "474231265059405845") {
            await client.user.setPresence({ status: 'invisible', activity: {
                name: "Disconnecting.",
                type: 'PLAYING'
            }});
            message.channel.send("Bye bye!")
            setTimeout(async () => {  
                console.log("Disconnecting...")
                await client.destroy();
                console.log("Disconnected.")
            }, 3 * 1000)
        } else {
            message.channel.send(":x: Not enough permissions.")
        }
    }
}