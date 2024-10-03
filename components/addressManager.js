const jsonfile = require('jsonfile');
const kapitalize = require('./kapitalize');
const addressesFile = './addresses.json';

async function readAddresses() {
  try {
    return await jsonfile.readFile(addressesFile);
  } catch (err) {
    console.error("Error reading addresses.json:", err);
    throw err;
  }
}

async function writeAddresses(data) {
  try {
    await jsonfile.writeFile(addressesFile, data);
  } catch (err) {
    console.error("Error writing to addresses.json:", err);
    throw err;
  }
}

async function sendTip(message, args, client) {
  const tipper = message.author.id;
  const sendToArg = args[0];
  const amount = parseInt(args[1]);

  if (!Number.isInteger(amount)) {
    console.log('Tip Amount Not Number');
    await client.fetchUser(tipper).then(user => user.send(`(◕‿◕✿) \n Tip Amount Must Be A Number! You Sent ${args[1]}`));
    message.reply(`(◕‿◕✿) \n Tip Amount Must Be A Number! You Sent ${args[1]}`);
    return;
  }

  const lastBit = sendToArg.lastIndexOf('>');
  const sendTo = sendToArg.substr(2, lastBit - 2);

  try {
    const addresses = await readAddresses();
    if (!addresses[sendTo]) {
      console.log(`User Address Not Found`);
      await client.fetchUser(tipper).then(user => user.send(`(ノಠ益ಠ)ノ \n This Person Has Not Set Up A Tip Address... Message Them And Find Out Why!`));
      await client.fetchUser(sendTo).then(user => user.send(`(◕‿◕✿) \n Hi ${sendToArg}! \n Someone Just Tried Sending You A Tip \n But You Have No Address Set Up! \n Reply With The Following To Set Up Address: \n !address YourECA_Address`));
    } else {
      kapitalize.sendToAddress(addresses[sendTo], amount);
      console.log(`Sent ${amount} ECA Sent To: ${addresses[sendTo]}`);
      message.reply(`Sent ${amount} ECA To ${sendToArg}`);
    }
  } catch (err) {
    console.error(err);
    message.reply(`(ノಠ益ಠ)ノ彡┻━┻ Error processing tip`);
  }
}

async function handleAddress(message, address) {
  const currentUser = message.author.id;

  if (address === undefined) {
    message.reply(`!address YourAddressHere \n ^^^^^is the correct way^^^^^`);
    console.log(`${message.author.id} Messed Up`);
    return;
  }

  if (address === `Your_Address`) {
    message.reply(`Type Your Public Address...`);
    console.log(`${message.author.id} Messed Up`);
    return;
  }

  try {
    const addresses = await readAddresses();
    addresses[currentUser] = address;
    await writeAddresses(addresses);
    console.log(`(◕‿◕✿) Information Saved! ${message.author.username}. Address: ${address}`);
    message.reply(`(◕‿◕✿) Information Saved! Address: ${address}`);
  } catch (err) {
    console.error(err);
    message.reply(`(ノಠ益ಠ)ノ彡┻━┻ Error saving address`);
  }
}

async function checkAddress(message) {
  const currentUser = message.author.id;

  try {
    const addresses = await readAddresses();
    if (!addresses[currentUser]) {
      console.log(`(ノಠ益ಠ)ノ彡┻━┻ No Address Set For This Person`);
      message.reply(`(ノಠ益ಠ)ノ彡┻━┻ \n You Have Not Set An Address \n \n Use !address Your_Address to set!`);
    } else {
      console.log(addresses[currentUser]);
      message.reply(`(◕‿◕✿) \n Your address is ${addresses[currentUser]}`);
    }
  } catch (err) {
    console.error(err);
    message.reply(`(ノಠ益ಠ)ノ彡┻━┻ Error checking address`);
  }
}

module.exports = { sendTip, handleAddress, checkAddress };