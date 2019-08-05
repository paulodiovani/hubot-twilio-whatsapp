const { TextMessage } = require('hubot')
const EventEmitter = require('events').EventEmitter
const Twilio = require('twilio')

class TwilioWhatsAppAdapter extends EventEmitter {
  constructor (robot) {
    super()
    this.robot = robot
    this.robot.logger.debug('Constructor')

    this.from = process.env.HUBOT_SMS_FROM
    this.client = Twilio(process.env.HUBOT_SMS_SID, process.env.HUBOT_SMS_TOKEN)
  }

  send (envelope, ...strings) {
    this.robot.logger.debug('Send Envelope', JSON.stringify(envelope))
    this.robot.logger.debug('Send Strings', JSON.stringify(strings))

    strings.forEach((str) => {
      const message = {
        from: `whatsapp:${this.from}`,
        body: str,
        to: envelope.user.number
      }
      this.robot.logger.debug('Send Message', JSON.stringify(message))

      this.client.messages.create(message)
        .then((msg) => this.robot.logger.info('MessageSid', msg.sid))
        .catch((err) => this.robot.logger.error('Error', err))
    })
  }

  emote (envelope, ...strings) {
    strings.forEach((str) => this.send(envelope, `* ${str}`))
  }

  reply (envelope, ...strings) {
    this.robot.logger.debug('Reply')
    const answers = strings.map((s) => `${this.senderName(envelope.user)}: ${s}`)
    this.send(envelope, ...answers)
  }

  run () {
    this.robot.logger.debug('Run')

    this.robot.router.post('/hubot/sms', (req, res) => {
      const payload = req.body.payload ? JSON.parse(req.body.payload) : req.body
      this.robot.logger.debug('Post', JSON.stringify(payload))

      this.receiveSms(payload, () => {
        res.writeHead(200, { 'Content-Type': 'text/plain' })
        res.end()
      })
    })

    this.emit('connected')
  }

  receiveSms (payload, cb) {
    const { Body, From, MessageSid = 'messageId' } = payload

    if (!From || !Body.trim()) return

    const user = this.robot.brain.userForId(From, { room: 'Twilio', number: From })
    const message = new TextMessage(user, Body.trim(), MessageSid)
    this.robot.logger.debug('Message', JSON.stringify(message))

    this.robot.receive(message, cb)
  }

  senderName (user) {
    const { name, number } = user

    if (name === number) return number.replace('whatsapp:', '@')
    return name
  }
}

exports.use = (robot) => new TwilioWhatsAppAdapter(robot)
