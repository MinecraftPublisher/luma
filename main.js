const Discord = require('discord.js');
const config = require('./config.json');
const fs = require('fs');

const client = new Discord.Client();
const mango = require('./mangoose');
const mangoose = require('./mangoose');
const { mongo } = require('mongoose');
const messageCount = require('./message-counter')

const prefix = config.prefix;

client.commands = new Discord.Collection();
var commandFiles = fs.readdirSync('./commands/').filter(file => file.endsWith('.js'));
for (const file of commandFiles) {
    const command = require(`./commands/${file}`);
    client.commands.set(command.name, command);
}

function colour() {
    let bg_colour = Math.floor(Math.random() * 16777215).toString(16);
    bg_colour = "#" + ("000000" + bg_colour).slice(-6);
    return bg_colour;
}

var defaultStatus = `Progressing...`;
var usage = true;
// Leveling system to do

client.once('ready', async () => {
    /*await mango().then(mongoose => {
        try {
            console.log("Connected to mongo!")
        } finally {
            mongoose.connection.close()
        }
    })*/
    await client.user.setPresence({ status: 'dnd', activity: {
        name: defaultStatus,
        type: 'PLAYING'
    }});
    console.log(client.user.tag + ' is ready!');

    messageCount(client)
});

client.on('guildCreate', guild => {
    console.log("Join guild " + guild.name)
    let defaultChannel = "";
    guild.channels.cache.forEach((channel) => {
        if(channel.type == "text" && defaultChannel == "") {
            if(channel.permissionsFor(guild.me).has("SEND_MESSAGES")) {
                defaultChannel = channel;
            }
        }
    })
    let rc = colour()
    
    let joinEmbed = new Discord.MessageEmbed()
    .setColor(rc)
    .setTitle("Thank you for inviting me!")
    .setDescription(`Hello! I am Luma! A bot full of functionalities, either fun, either serious. Everything you could imagine is right here!
    But what makes Luma unique? Well you don't need to buy anything to get all the functionalities! Which is awesome! Isn't it?
    
    If you need help with commands, you can just do \`${prefix}help\` to get the command list`)
    .setFooter(`Joining ${guild.name} with ${guild.memberCount} members`)
    .setTimestamp()

    defaultChannel.send(joinEmbed)
}); 

client.on("error", () => {
    console.error("Got error somewhere. Safe-Disconnect")
    client.destroy()
});

client.on('message', message => {
    if (!message.content.startsWith(prefix) || message.author.bot) return;

    const args = message.content.slice(prefix.length).split(/ +/);
    const command = args.shift().toLowerCase();
    
    if (usage === false && command !== 'off' && command !== 'stop') return message.react("❌")
    
    if (command === 'reboot' || command === 'restart') {
        client.commands.get("stop").execute(message, args, client);
    } else if (command === 'meme') {
        client.commands.get("meme").execute(message, args, colour())  
    } else if (command === 'music') {
        client.commands.get("music").execute(message, args)  
    } else if (command === 'eval') {
        client.commands.get("eval").execute(message, args, prefix)
    } else if (command === 'credits' || command === 'credit') {
        rc = colour()

        let creditsEmbed = new Discord.MessageEmbed()
        .setColor(rc)
        .setTitle("Luma's Credits")
        .setDescription("<@675527873960083476> - Creator & Idea Donor\n<@474231265059405845> - Project Leader & Coder")
        
        message.channel.send(creditsEmbed)
    } else if (command === 'uptime') {
        let totalSeconds = (client.uptime / 1000);
        let days = Math.floor(totalSeconds / 86400);
        totalSeconds %= 86400;
        let hours = Math.floor(totalSeconds / 3600);
        totalSeconds %= 3600;
        let minutes = Math.floor(totalSeconds / 60);
        let seconds = Math.floor(totalSeconds % 60);
        
        message.channel.send(`Luma is on for:\n${days} days, ${hours} hours, ${minutes} minutes and ${seconds} seconds`)
    } else if (command === 'say') {
        rc = colour()
        client.commands.get("say").execute(message, args, rc)
    } else if (command === 'help') {
        color = colour();
        if (!args[0]) {
            var content = "Those commands are actually working on Luma";
            var commandFiles = fs.readdirSync('./commands/').filter(file => file.endsWith('.js'));
            commandFiles.forEach((file) => {
                const command = require(`./commands/${file}`);
                argsTxt = "";
                if (Array.isArray(cmdArgs)) {
                    cmdArgs = cmdArgs.join(" | ");
                    argsTxt = " " + `[ ${cmdArgs} ]`;
                }
                content += `\n`;
                content += `- **${command.name}**`;
                content += `\n`;
                content += `Usage: \`${prefix}${command.name}${argsTxt}\``;
            });
            content += `\nDo \`${prefix}help [command]\` for more information`;
            let helpEmbed = new Discord.MessageEmbed()
            .setTitle("Commands")
            .setDescription(content)
            .setColor(color);
            message.channel.send(helpEmbed);
        } else {
            if (typeof client.commands.get(args[0]) === 'undefined') return message.channel.send("What's that? A command?")
            var name = client.commands.get(args[0]).name
            var desc = client.commands.get(args[0]).description
            var cmdArgs = client.commands.get(args[0]).args
            argsTxt = "";
            if (Array.isArray(cmdArgs)) {
                cmdArgs = cmdArgs.join(" | ")
                argsTxt = `[ ${cmdArgs} ]`
            }
            msg = `${prefix}${name} ${argsTxt}`
            let commandEmbed = new Discord.MessageEmbed()
            .setTitle(msg)
            .setDescription(desc)
            .setColor(color)
            message.channel.send(commandEmbed)
        } 
    } else if (command === 'off' || command === 'stop' && message.author.id === '474231265059405845') {
        if (usage === true) {
            usage = false;
            client.user.setPresence({ status: 'dnd', activity: {
                name: "not usable right now",
                type: 'PLAYING'
            }});
            return message.channel.send("Okay, going to sleep then!")
        }
        if (usage === false) { 
            usage = true;
            client.user.setPresence({ status: 'dnd', activity: {
                name: defaultStatus,
                type: 'LISTENING'
            }});
            return message.channel.send("Alright, I'm back for you.")
        }
    } /*else if (command === 'yt_presentation') {
        let ytEmbed = new Discord.MessageEmbed()
        .setColor(colour())
        .setTitle("Welcome to _Lumination's YouTube!")
        .setDescription(`I know it doesn't seem like it's a YouTube channel even if we're on Discord right now,
        I still wanted to show y'all my talents with Discord bots
        
        What I'll be doing on this YouTube channel is written in the "About" tab of my YouTube channel so please check it :heart:
        And I'm kinda done. Thanks for watching!`)
        message.delete()
        message.channel.send(ytEmbed)
        // Subscribe please
    }*/ else {
        message.channel.send("What's that? A command?")
    }
})

client.login('TOKEN')