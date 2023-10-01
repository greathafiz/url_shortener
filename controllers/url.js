const { StatusCodes } = require("http-status-codes");
const isUrlHttp = require('is-url-http')
const generateUniqueId = require("generate-unique-id");
const Url = require("../model/Url");
const { BadRequestError, NotFoundError } = require("../errors");

const generateShortUrl = async (req, res) => {
  const { originalUrl } = req.body;
  const urlId = generateUniqueId({ length: 7 });

  if (isUrlHttp(originalUrl)) {
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
      res.status(StatusCodes.CREATED).json(url);
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
  res.status(StatusCodes.MOVED_PERMANENTLY).redirect(url.originalUrl);
};

module.exports = {
  generateShortUrl,
  handleUrlRedirect,
};
