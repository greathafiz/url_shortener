const express = require("express");
const router = express.Router();
const { handleUrlRedirect } = require("../controllers/url");

router.get("/:id", handleUrlRedirect);

module.exports = router;
