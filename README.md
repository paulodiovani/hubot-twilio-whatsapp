# hubot-twilio-whatsapp

A [Hubot](https://hubot.github.com/) Adapter for Twilio Whastapp messages.

Based on [Hubot Twilio Adapter](https://github.com/jkarmel/hubot-twilio)

## Seting up

1. Create a Twilio account at http://www.twilio.com

1. Setup Whats Sandbox for Twilio: https://www.twilio.com/console/sms/whatsapp/learn

1. Add `twilio-whatsapp` adapter to your Hubot

  ```
  npm install --save hubot-twilio-whatsapp
  ```

1. Set Twilio account ID, token and phone number in env vars.

  ```
  export HUBOT_SMS_FROM=<your twilio phone number>
  export HUBOT_SMS_SID=<your twilio account id>
  export HUBOT_SMS_TOKEN=<your twilio token>
  ```

1. Start Hubot with adapter

  ```
  ./bin/hubot -a twilio-whatsapp
  ```
