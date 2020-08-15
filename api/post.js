const querystring = require("querystring");
const contentful = require("contentful-management");
const { v4: uuidv4 } = require("uuid");
const strftime = require("strftime").timezone("-0400");

module.exports = (req, res) => {
  let incoming = "";
  req.on("data", (chunk) => {
    incoming += chunk.toString();
  });
  req.on("end", () => {
    const { token, space, body } = querystring.parse(incoming);

    const client = contentful.createClient({
      accessToken: token,
    });

    const id = "sms-" + uuidv4();
    const [title, ...lines] = body.split(/(?:\r?\n){2,}/);

    client
      .getSpace(space)
      .then((space) =>
        space.createEntryWithId("post", id, {
          fields: {
            title: {
              "en-US": title,
            },
            date: {
              "en-US": strftime("%FT%H:%M-04:00", new Date()),
            },
            body: {
              "en-US": lines.join("\n\n"),
            },
            gallery: {
              "en-US": [],
            },
            score: {
              "en-US": 0,
            },
          },
        })
      )
      .then((entry) => entry.publish())
      .then((entry) => {
        res.send(id);
      })
      .catch(console.error);
  });
};
