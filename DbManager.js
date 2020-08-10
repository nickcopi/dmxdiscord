module.exports = class DbManager{
	constructor(){
		try{
			this.data = JSON.parse(fs.readFileSync('db.json').toString());
		} catch (e) {
			this.data = {};
		}
	}
	async getSave(id){
		return this.data[id];
	}
	async writeSave(id,save){
		this.data[id] = save;
		this.write();
	}
	write(){
		fs.writeFileSync('db.json',JSON.stringify(this.data));
	}
}
