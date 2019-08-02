const EventEmitter = require('events').EventEmitter
const { TextMessage } = require('hubot')

class TwilioWhatsAppAdapter extends EventEmitter {
  constructor (robot) {
    super()
    this.robot = robot
    this.robot.logger.debug('Constructor')
  }

  send (envelope, ...strings) {
    this.robot.logger.debug('Send', envelope, strings)
  }

  emote (envelope, ...strings) {
    Array.from(strings).map((str) => this.send(envelope, `* ${str}`))
  }

  reply (envelope, ...strings) {
    this.robot.logger.debug('Reply')
    const answers = strings.map((s) => `${envelope.user.name}: ${s}`)
    this.send(this, envelope, ...answers)
  }

  // reply (envelope, ...strings) {
  //   this.robot.logger.info('Reply')
  // }

  run () {
    this.robot.logger.debug('Run')

    this.robot.router.post('/hubot/sms', (req, res) => {
      const payload = req.body.payload ? JSON.parse(req.body.payload) : req.body
      this.robot.logger.debug('Post', payload)

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

    const user = this.robot.brain.userForId(From, { name: 'Twilio', room: 'Twilio', number: From })
    const message = new TextMessage(user, Body.trim(), MessageSid)
    this.robot.logger.debug('Message', message)

    this.robot.receive(message, cb)
  }
}

exports.use = (robot) => new TwilioWhatsAppAdapter(robot)
