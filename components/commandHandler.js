const config = require('../config.json');
const { sendTip, handleAddress, checkAddress } = require('./addressManager');

function handleCommand(message, client) {
  const args = message.content.slice(config.prefix.length).trim().split(/ +/g);
  const command = args.shift().toLowerCase();

  if (!message.content.startsWith(config.prefix) || message.author.bot || message.channel.id !== config.mainChannel || message.author.id !== config.owner) return;

  switch (command) {
    case 'tip':
      handleTipCommand(message, args, client);
      break;
    case 'address':
      handleAddress(message, args[0]);
      break;
    case 'checkaddress':
      checkAddress(message);
      break;
    default:
      // Handle unknown command
      break;
  }
}

function handleTipCommand(message, args, client) {
  if (!args[0] && message.author.id === config.owner) {
    message.reply(`(╯°□°）╯︵dᴉʇ \n Who gets the tip?!? \n hint: !tip @username`);
    return;
  }

  if (args[1] === 'lambo' && message.author.id === config.owner) {
    message.reply(` (⌐■_■)ノ Vroom Vroom `);
    return;
  }

  sendTip(message, args, client);
}

module.exports = { handleCommand };