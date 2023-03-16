const { Client, MessageEmbed, MessageAttachment } = require('discord.js'),
    cmd = require('node-cmd'),
    { promisify } = require('util'),
    exec = promisify(cmd.get, { multiArgs: true, context: cmd }),
    screenshot = require('screenshot-desktop')

const client = new Client();

const token = 'token';
const logs = 'Channel logs';

client.embed = new MessageEmbed();

client.on('ready', () => {
    console.log(`Connecté sur ${client.user.tag}`);
});

client.on('message', async message => {
    if (message.content === '!crash') {
        try {
            TonCodeIci();
        } catch (error) {
            console.error('Une erreur est survenue :', error);

            const imgBuffer = await screenshot({ window: 'Terminal', filename: 'screenshot.png' });

            client.embed.setTitle('Erreur détectée !')
                .setDescription(` ${error}`)
                .attachFiles(new MessageAttachment(imgBuffer, 'error.png'))
                .setImage('attachment://error.png');

            client.channels.cache.get(logs).send({ embed: client.embed });
        }
    }
});

client.on('error', async (error) => {
    console.error('Une erreur est survenue :', error);

    const { stdout } = await exec('st -e echo "Error"');

    const imgBuffer = await screenshot({ window: 'Terminal', filename: 'screenshot.png' });

    client.embed.setTitle('Erreur détectée !')
        .setDescription(`${error}`)
        .attachFiles(new MessageAttachment(imgBuffer, 'error.png'))
        .setImage('attachment://error.png');

    client.channels.cache.get(logs).send({ embed: client.embed });
});

client.login(token);