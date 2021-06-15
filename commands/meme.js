const Discord = require("discord.js")
const fetch = require("node-fetch")

module.exports = {
    name: 'meme',
    description : 'Get a photo of a meme',
    execute(message, args, color) {
        //message.delete()
        var json = null;
        channel = message.channel
        channel.startTyping()
        fetch("https://meme-api.herokuapp.com/gimme")
        .then(res => res.json())
        .then(json => {
            if (json.nsfw === true) return message.channel.send("You should retry doing the command haha... :sweat_smile:")
            let memeEmbed = new Discord.MessageEmbed()
            .setColor(color)
            .setAuthor(`r/${json.subreddit}`, "", `https://www.reddit.com/r/${json.subreddit}/`)
            .setTitle(json.title)
            .setURL(json.postLink)
            .setImage(json.url)

            channel.stopTyping()
            return channel.send(memeEmbed)
        })
        setTimeout(() => {
            return channel.stopTyping()
        }, 10*1000)
        /*setTimeout(() => {
            channel.stopTyping()
            return channel.send("Nothing found...")
            .then((message) => {
                setTimeout(() => {
                    message.delete()
                }, 3500)
            }) 
        }, 1350)*/
    }
}