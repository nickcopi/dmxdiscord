module.exports = class CommandParser{
	constructor(gameManager){
		this.gameManager = gameManager;
		this.actions = {
			'drugs':this.drugs.bind(this),
			'dealers':this.dealers.bind(this),
			'clients':this.clients.bind(this),
			'upgrades': this.upgrades.bind(this),
			'overview': this.overview.bind(this),
			'combine': this.combine.bind(this)
		}
	}
	async parseCommand(msg,author){
		if(msg[0] !== '!') return;
		const line = msg.substring(1, msg.length);
		const words = line.split(' ');
		const command = words.shift().toLowerCase();
		console.log(command,words);
		if(!(command in this.actions)) return;
		return await this.actions[command](words,author);

	}
	async drugs(options, author){
		const drugs = (await this.gameManager.getDrugs(author.id));
		return this.formatDrugs(drugs);
	}
	async dealers(options,author){
		const dealers = (await this.gameManager.getDealers(author.id));
		return this.makeEmbed('Dealers','',
			dealers.map((dealer, i)=>{
				return {
					name:`${i+1}: ${dealer.getName()}`,
					value:dealer.getDescription()
				}
			})
		);
	}
	async clients(options,author){
		const clients = (await this.gameManager.getClients(author.id));
		return this.makeEmbed('Clients','',
			clients.map((client, i)=>{
				return {
					name:`${i+1}: ${client.getName()}`,
					value:client.getDescription()
				}
			})
		);
	}
	async upgrades(options,author){
		const upgrades = (await this.gameManager.getUpgrades(author.id));
		return this.makeEmbed('Upgrades','',
			upgrades.map((upgrade, i)=>{
				return {
					name:`${i+1}: ${upgrade.getName()}`,
					value:`${upgrade.getDescription()} Costs $${upgrade.getCost()}.` 
				}
			})
		);
	}
	async overview(options,author){
		const level = (await this.gameManager.getLevel(author.id));
		const money = (await this.gameManager.getMoney(author.id));
		const drugs = (await this.gameManager.getDrugs(author.id));
		const clients = (await this.gameManager.getClients(author.id));
		return this.makeEmbed('Overview','',
			[
				{
					name:'Level',
					value:String(level)
				},
				{
					name:'Money',
					value:'$' + money
				},
				{
					name:'Drugs Stashed',
					value:String(drugs.length)
				},
				{
					name:'Clients unlocked',
					value:String(clients.length)
				}
			]
		);
	}
	async combine(options,author){
		if(options.length < 4) return 'Requires 4 parameters.';
		return await this.gameManager.combine(author.id,options);
	}



	formatDrugs(drugs){
		return this.makeEmbed('Drugs',drugs.map((drug,i)=>{
			return `${i+1}: ${drug.getGrams()} g of ${drug.getName()} at level ${drug.getLevel()} worth $${drug.getCost()} each.`;
		}).join('\n'));
	}


	makeEmbed(title,description,fields){
		return {
			"embed": {
				title,
				"color": 26112,
				description,
				"timestamp": (new Date()).toISOString(),
				"footer": {
					"icon_url": "https://cdn.discordapp.com/avatars/742408866851192905/57ba023853195e32ccad112540e034fe.png",
					"text": "Drug Maker Extreme"
				},
				fields
			}
		}

	}
}
