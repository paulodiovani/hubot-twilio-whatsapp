const EventEmitter = require('events').EventEmitter
const { TextMessage, User } = require('hubot')

class TwilioWhatsAppAdapter extends EventEmitter {
  constructor (robot) {
    super()
    this.robot = robot
    this.robot.logger.info('Constructor')
  }

  send (envelope, ...strings) {
    this.robot.logger.info('Send')
  }

  reply (envelope, ...strings) {
    this.robot.logger.info('Reply')
  }

  run () {
    this.robot.logger.info('Run')
    this.emit('connected')
    const user = new User(1001, { name: 'Sample User' })
    const message = new TextMessage(user, 'Some Sample Message', 'MSG-001')
    this.robot.receive(message)
  }
}

exports.use = (robot) => new TwilioWhatsAppAdapter(robot)
