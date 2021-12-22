const urlModel = require('../model/urlModel')
const shortId = require('shortid')
////////////////////////////////////////////////////////////////to connect with redis
const redis = require("redis")     //version:3.1.2
const { promisify } = require("util")
const redisClient = redis.createClient(
  14960,
  "redis-14960.c10.us-east-1-4.ec2.cloud.redislabs.com",
  { no_ready_check: true }
)
redisClient.auth("vqPUmovNnlSem9nxLl3f4Qo2Bv8aPI8n", function (err) {
  if (err) throw err
});
redisClient.on("connect", async function () {
  console.log("connected to redis...")
});
/////////////////////////////////////////////////////////////////////////to implement set and get command of redis
const SET_ASYNC = promisify(redisClient.SET).bind(redisClient)
const GET_ASYNC = promisify(redisClient.GET).bind(redisClient)
/////////////////////////////////////////////////////////////////////////////

const baseUrl = "http://localhost:3000"
////////////////////////////////////////////////////validations
const isValid = function (value) {
  if (typeof value === 'undefined' || value === null) return false
  if (typeof value === 'string' && value.trim().length === 0) return false
  return true
}
const isValidRequestBody = function (requestBody) {
  return Object.keys(requestBody).length > 0
}
/////////////////////////Api to shorten long url
const urlShortner = async function (req, res) {
  let requestBody = req.body
  let url = req.body.url
  let givenUrl = url.trim()
  if (!isValidRequestBody(requestBody)) {
    return res.status(400).send({ 'status': 'failed', 'msg': 'please enter valid request' })
  }
  if (!isValid(givenUrl)) {
    return res.status(400).send({ 'status': 'failed', 'msg': 'please enter valid url' })
  }
  if (!(/\b(https?|ftp|file):\/\/[\-A-Za-z0-9+&@#\/%?=~_|!:,.;]*[\-A-Za-z0-9+&@#\/%=~_|]/.test(givenUrl))) {
    return res.status(400).send({ 'status': 'failed', 'msg': 'invalid url entered' })
  }
  try {
    let longUrlData = await GET_ASYNC(`${givenUrl}`)
    cachedLongUrlData = JSON.parse(longUrlData)
    if (cachedLongUrlData) {
      return res.status(200).send({ 'msg': "'provided url already exist in record", 'record': cachedLongUrlData })
    }
    let checkUrl = await urlModel.findOne({ longUrl: givenUrl })
    if (checkUrl) {
      await SET_ASYNC(`${givenUrl}`, JSON.stringify(checkUrl))
      return res.status(200).send({ 'status': 'provided url already exist in record', 'record': checkUrl })
    }
    let code = shortId.generate()
    let urlObj = {
      longUrl: givenUrl,
      shortUrl: baseUrl + '/' + code,
      urlCode: code
    }
    let data = await urlModel.create(urlObj)
    res.status(201).send({
      status: true,
      'record': data
    })
  }
  catch (err) {
    res.status(500).send({ status: false, 'error': err })
  }
}
////////////////////////////////////////////////////////api to redirect to long url
const urlRedirector = async function (req, res) {
  let code = req.params.urlCode
  let shortCode = code.trim()
  if (!isValid(shortCode)) {
    res.status(400).send({ 'status': 'failed', 'message': 'please enter valid code' })
  }
  let cachedUrlData = await GET_ASYNC(`${shortCode}`)
  if (cachedUrlData) {
    urlRecord = JSON.parse(cachedUrlData)
    let long_Url = urlRecord.longUrl
    return res.redirect(302, long_Url)
  }
  let record = await urlModel.findOne({ urlCode: shortCode })
  if (!record) {
    return res.status(404).send({ status: false, 'msg': 'document not found with given code' })
  }
  await SET_ASYNC(`${shortCode}`, JSON.stringify(record))
  let path = record.longUrl
  res.redirect(301, path)
}
/////////////////////////////////////////////////////////////////////
module.exports.urlShortner = urlShortner
module.exports.urlRedirector = urlRedirector