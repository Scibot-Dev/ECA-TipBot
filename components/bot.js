const Discord = require("discord.js");
const config = require("../config.json");
const { handleCommand } = require('./commandHandler');

const client = new Discord.Client();

client.on("ready", () => {
    console.log("I am ready!");
});

client.on("message", (message) => {
    if (message.author.bot) return;

    if (message.channel.type === 'dm') {
        handleCommand(message, client);
    } else if (message.channel.id === config.mainChannel && message.content.startsWith(config.prefix)) {
        handleCommand(message, client);
    }
});

// The Code Below Messages Every New User With Their Address
// If No Address Set It Will Message Them With Greeting
// If You Have Many Tip Bots In One Room, This Can Get Annoying
// So I Turned Off. Turn On By Removing // At Beginning Of All Lines

/*
client.on("guildMemberAdd", async (member) => {
    try {
        const addresses = await readAddresses();
        if (!addresses[member.id]) {
            console.log(`(ノಠ益ಠ)ノ彡┻━┻ \n No Address Set For ${member.user} : Sending Greeting`);
            await member.send(
                ` (◕‿◕✿)  Hey! ${member.user},  \n \n I Am A Bot That Tips ECA \n \n If You Want To Receive Tips Reply: \n \n !address YourECA_Address \n \n ^^^^^^ DM This To Set Tip Address ^^^^^ \n \n Change Your Address Anytime By Repeating This Command. `);
        } else {
            console.log(`A Wild ${member.user} Has Appeared!`);
            await member.send(`(◕‿◕✿) \n Hey! ${member.user}, Your Address is ${addresses[member.id]}. \n \n You can change this with !address Your_Address`);
        }
    } catch (err) {
        console.error("Error handling new member:", err);
    }
});
*/

client.login(config.token);