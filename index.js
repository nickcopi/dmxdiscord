require('dotenv').config();
const Eris = require('eris');
const GameManager = require('./GameManager');
const CommandParser = require('./CommandParser');
const settings = require('./settings.json');
const clientOptions = {
    intents: [
        "guilds",
        "guildMessages"
    ]
};
class Discord{
	constructor(settings){
		this.client = new Eris(process.env.TOKEN, clientOptions);
		this.client.on('ready',this.onReady);
		this.client.on('messageCreate',this.onMessageCreate.bind(this));
		this.client.on('error',this.onError);
		this.client.connect();
		this.settings = settings;
		this.gameManager = new GameManager();
		this.commandParser = new CommandParser(this.gameManager);
	}
	onReady(){
		console.log('Discord ready!')
	}
	async onMessageCreate(msg){
		if(msg.author.id === this.client.user.id) return;
		//if(msg.channel.id !== this.settings.botChannelId) return;
		const result = await this.commandParser.parseCommand(msg.content,msg.author);
		if(result) this.client.createMessage(msg.channel.id,result);
	}
	onError(error){
		console.error(error);
	}
	getChannel(channelName){
		//return this.client.guilds.get(this.settings.botGuild).channels.find(c => c.name === channel);
	}

}

const init = async()=>{
	console.log('Initiating Discord bot.');
	const discord = new Discord(settings);
}
init();
