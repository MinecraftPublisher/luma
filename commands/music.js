const Discord = require('discord.js');

const ytdl = require('ytdl-core');
const ytSearch = require('yt-search');

var queueUrl = [];
//var boundChannel = null;
var loop = false;

async function playMusic(ytUrl, connection, voiceChannel) {
    const videoFinder = async (query) => {
        const videoResult = await ytSearch(query);
        return (videoResult.videos.length > 1) ? videoResult.videos[0] : null;
    }
    //console.log(queueUrl)
    const stream = ytdl(ytUrl, {filter: 'audioonly'});
    connection.play(stream, {seek: 0, volume: 1})
    .on('finish', async () => {
        if (loop !== true) {
            if (queueUrl.length <= 1) {
                queueUrl = [];
                return voiceChannel.leave()
            } else {
                queueUrl.shift()
                const video = await videoFinder(queueUrl[0].split("|")[0])
                return playMusic(video.url, connection, voiceChannel)
            }
        } else {
            const video = await videoFinder(queueUrl[0].split("|")[0])
            return playMusic(video.url, connection, voiceChannel)
        }
    })
}

module.exports = {
    name: 'music',
    description: 'Luma is also music',
    args: ["play","stop","playing","loop","queue"],
    async execute(message, args) {
        if (args[0] === 'play') {
            args = args.slice(1)
            //console.log(args)
            const vc = message.member.voice.channel;
            if (!vc) return message.channel.send("I don't see you in a Vocal Chat");

            const permissions = vc.permissionsFor(message.client.user);
            if (!permissions.has('CONNECT')) return message.channel.send("You don't have the perms");
            if (!permissions.has('SPEAK')) return message.channel.send("You don't have the perms");
            if (!args.length) return message.channel.send("You don't have the perms");

            //boundChannel = message.channel;
            message.channel.startTyping();
            const videoFinder = async (query) => {
                const videoResult = await ytSearch(query);
                return (videoResult.videos.length > 1) ? videoResult.videos[0] : null;
            }
            //console.log(video.author.name)
            const connection = await vc.join()
            connection.voice.setSelfDeaf(true)
            if (typeof queueUrl[0] == 'undefined') {
                const yt = await videoFinder(args.join(' '));
                if (yt) {
                    queueUrl.push(yt.url + "|" + yt.title)
                    await playMusic(yt.url, connection, vc)
                    let musicEmbed = new Discord.MessageEmbed()
                    .setColor("#e10422")
                    .setDescription("🎶 Playing: `" + yt.title + "`")
                    .addFields(
                        { name: 'Request from    ', value: message.author.username, inline: true },
                        { name: 'Channel         ', value: yt.author.name, inline: true }
                    )
                    .addFields(
                        { name: 'Duration', value: yt.duration, inline: true }
                    )
                    .setThumbnail(yt.thumbnail)
                    .setAuthor("Found a video!", "https://www.gstatic.com/images/branding/product/1x/youtube_64dp.png", yt.url)

                    message.channel.stopTyping();
                    return await message.channel.send(musicEmbed)
                } else {
                    message.channel.send("YouTube didn't find anything related to `" + args.join(" ") + "`.")
                    vc.leave();
                }
            } else {
                /*name = +/-1 > index
                    
                push("smth") = +1 > last
                shift() = -1 > 1*/
                const yt = await videoFinder(args.join(' '));
                if (yt) {
                    queueUrl.push(yt.url + "|" + yt.title)
                    let musicEmbed = new Discord.MessageEmbed()
                    .setColor("#e10422")
                    .setDescription("🎶 Added to the queue: `" + yt.title + "`")
                    .addFields(
                        { name: 'Request from    ', value: message.author.username, inline: true },
                        { name: 'Channel         ', value: yt.author.name, inline: true },
                        { name: 'YouTube Link    ', value: yt.url, inline: true }
                    )
                    .addFields(
                        { name: 'Views   ', value: yt.views, inline: true },
                        { name: 'Duration', value: yt.duration, inline: true }
                    )
                    .setThumbnail(yt.thumbnail)
                    .setAuthor("YouTube", "https://www.gstatic.com/images/branding/product/1x/youtube_64dp.png", "https://www.youtube.com/")

                    message.channel.stopTyping();
                    return await message.channel.send(musicEmbed)
                } else {
                    message.channel.send("YouTube didn't find anything related to `" + args.join(" ") + "`.")
                }
            }
            /*message.delete();

            message.channel.stopTyping();
            console.log("Playing: \"" + video.title + "\" in " + voiceChannel + ". Link: " + video.url)*/

        } else if (args[0] === 'stop') {
            const voiceChannel = message.member.voice.channel;
            if (!voiceChannel) return message.channel.send("I don't see you in a Vocal Chat")
            voiceChannel.leave()
            queueUrl = [];
            loop = false;
            message.channel.send(":wave: Goodbye!")
        } else if (args[0] === 'loop') {
            if (!message.member.voice.channel) return message.channel.send("I don't see you in a Vocal Chat")
            loop = loop ? false : true;
            message.channel.send(`🔂 Loop mode set to **${loop}**`)
        } else if (args[0] === 'queue' || args[0] === 'q') {
            if (!message.member.voice.channel) return message.channel.send("I don't see you in a Vocal Chat")
            if (typeof queueUrl[0] == 'undefined') return message.channel.send("Nothing's in our ears")
            let msg = "";
            message.channel.startTyping()
            for (i = 0; i <= queueUrl.length - 1; i++) { 
                let count = (i === 0) ? "🎶" : i + 1
                msg = msg + `${count}. \`${queueUrl[i].split("|")[1]}\`\n`
            }
            let queueEmbed = new Discord.MessageEmbed()
            .setColor("#e10422")
            .setDescription(msg)
            .setAuthor("Queue", "https://www.gstatic.com/images/branding/product/1x/youtube_64dp.png", "https://www.youtube.com/")
            message.channel.send(queueEmbed);
            message.channel.stopTyping();
        } else if (args[0] === 'playing') {
            if (!message.member.voice.channel) return message.channel.send("I don't see you in a Vocal Chat")
            if (typeof queueUrl[0] == 'undefined') return message.channel.send("Nothing's in our ears")
            let playingEmbed = new Discord.MessageEmbed()
            .setColor("#e10422")
            .setDescription(`🎶 Now playing: \`${queueUrl[0].split("|")[1]}\``)
            .setAuthor("Now Playing", "https://www.gstatic.com/images/branding/product/1x/youtube_64dp.png", queueUrl[0].split("|")[0])
            message.channel.send(playingEmbed);
        } else {
            message.channel.send(":x: Error: You haven't written a correct argument.")
        }
    }
}