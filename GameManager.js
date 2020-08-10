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
}
