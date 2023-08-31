const checkUrl = require("valid_url");
const generateUniqueId = require("generate-unique-id");
const Url = require("../model/Url");
const jwt = require('jsonwebtoken')
const { BadRequestError, NotFoundError } = require("../errors");

const generateShortUrl = async (req, res) => {
  const { originalUrl } = req.body;
  const urlId = generateUniqueId({ length: 7 });

  if (checkUrl(originalUrl)) {
    let url = await Url.findOne({ originalUrl });
    if (url) {
      res.json(url);
    } else {
      const shortenedUrl = `${process.env.BASE_URL}/${urlId}`;

      url = new Url({
        urlId,
        originalUrl,
        shortenedUrl,
      });
      await url.save();
      res.status(201).json(url);
    }
  } else {
    throw new BadRequestError("Invalid URL");
  }
};

// redirect shortened url to original url
const handleUrlRedirect = async (req, res) => {
  const { id } = req.params;
  const url = await Url.findOneAndUpdate(
    { urlId: id },
    { $inc: { clicks: 1 } }
  );

  if (!url) {
    throw new NotFoundError("Not Found");
  }
  res.status(301).redirect(url.originalUrl);
};

module.exports = {
  generateShortUrl,
  handleUrlRedirect,
};
