const mongo = require('./mangoose')
const messageCountSchema = require('./schemas/message-count-schema')

module.exports = (client) => {
    client.on('message', async (message) => {
        const { author } = message
        const { id } = author
        //console.log('AUTHOR: ' + author)

        await mongo().then(async (mongoose) => {
            try {
                await messageCountSchema.findOneAndUpdate({
                    _id: id
                }, {
                    $inc: {
                        'messageCount': 1
                    }
                }, {
                    upsert: true
                }).exec()
            } finally {
                mongoose.connection.close()
            }
        })
    })
}