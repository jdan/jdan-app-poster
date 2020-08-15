const contentful = require("contentful-management");
const { v4: uuidv4 } = require("uuid");
const strftime = require('strftime').timezone('-0400')

module.exports = (req, res) => {
    const client = contentful.createClient({
        accessToken: req.body.token,
    })

    const id = 'sms-' + uuidv4()
    const [title, ...lines] = req.body.text.split(/\r?\n{2}/)

    client.getSpace(req.body.space)
        .then((space) => {
            space.createEntryWithId(id, 'Entry', {
                fields: {
                    title: {
                        'en-US': title,
                    },
                    date: strftime('%FT%H:%M-04:00', new Date()),
                    body: {
                        'en-US': lines.join('\n\n'),
                    },
                    gallery: [],
                    score: 0,
                }
            })
        })
        .then((entry) => entry.publish())
        .then((entry) => {
            res.json({
                'message': `Entry ${id} published`,
            })
        })
        .catch((err) => {
            res.statusCode = 404;
            res.json({
                err: err
            })
        })
}