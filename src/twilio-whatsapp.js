const { Adapter, TextMessage, User } = require('hubot')

class TwilioWhatsAppAdapter extends Adapter {
  constructor (robot) {
    super(robot)
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
