const DrugMaker = require('./drugMaker').default;
const DbManager = require('./DbManager');
module.exports = class GameManager{
	constructor(){
		this.dbManager = new DbManager();
	}
	async getGame(id){
		return new DrugMaker(await this.dbManager.getSave(id));
	}
	async getDrugs(id){
		return (await this.getGame(id)).getDrugs();
	}
	async getDealers(id){
		return (await this.getGame(id)).getDealers();
	}
	async getClients(id){
		return (await this.getGame(id)).getClients();
	}
	async getUpgrades(id){
		return (await this.getGame(id)).getUpgrades();
	}
	async getLevel(id){
		return (await this.getGame(id)).getLevel();
	}
	async getMoney(id){
		return (await this.getGame(id)).getMoney();
	}
	async saveGame(id, game){
		const save = game.getSerializedSave();
		this.dbManager.writeSave(id,save);
	}
	async combine(id,options){
		const game = (await this.getGame(id));
		const drugs = game.getDrugs();
		const drug1 = drugs[Number(options[0])-1];
		const drug2 = drugs[Number(options[2])-1];
		if(!drug1 || !drug2) return 'Invalid drug index!';
		const result =  game.combineDrugs(drug1,drug2,Number(options[1]),Number(options[3]));
		if(result.success){
			this.saveGame(id,game);
		}
		return result.flavorText;

	}
	async sell(id,options){
		const game = (await this.getGame(id));
		const drugs = game.getDrugs();
		const clients = game.getClients();
		const client = clients[options[0]-1];
		const drug = drugs[options[1]-1];
		if(!client) return 'Invalid client index!';
		if(!drug) return 'Invalid drug index!';
		let quantity = Number(options[2]);
		if(isNaN(quantity)) quantity = 1;
		const result = game.sellToClient(drug, client, quantity);
		if(result.success){
			this.saveGame(id,game);
		}
		return result.flavorText;
	}
	async buy(id,options){
		const game = (await this.getGame(id));
		const dealers = game.getDealers();
		const dealer = dealers[options[0]-1];
		if(!dealer) return 'Invalid dealer index!';
		let quantity = Number(options[1]);
		if(isNaN(quantity)) quantity = 1;
		const result = game.buyFromDealer(dealer,quantity);
		if(result.success){
			this.saveGame(id,game);
		}
		return result.flavorText;
	}
	async upgrade(id,options){
		const game = (await this.getGame(id));
		const upgrades = game.getUpgrades();
		const upgrade = upgrades[options[0]-1];
		if(!upgrade) return 'Invalid upgrade index!';
		const result = game.buyUpgrade(upgrade);
		if(result.success){
			this.saveGame(id,game);
		}
		return result.flavorText;
	}
	async getRecipes(id,options){
		const game = (await this.getGame(id));
		return game.getRecipes();
	}
}
