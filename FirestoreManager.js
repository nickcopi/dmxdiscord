
module.exports = class DbManager{
	constructor(){
		this.initDb();
	}
	async initDb(){
		const admin = require('firebase-admin');

		const serviceAccount = require('./firebasekey.json');

		admin.initializeApp({
			  credential: admin.credential.cert(serviceAccount)
		});

		this.db = admin.firestore();
		this.collection = this.db.collection('drugmakerextreme');

	}
	async getSave(id){
		const doc = await this.collection.doc(id).get();
		if(!doc.exists) return;
		return JSON.stringify(doc.data());
	}
	async writeSave(id,save){
		await this.collection.doc(id).set(JSON.parse(save));
	}
}
/*module.exports = class DbManager{
	constructor(){
		this.initDb();
	}
	async initDb(){
		const admin = require('firebase-admin');

		const serviceAccount = require('./firebasekey.json');

		admin.initializeApp({
			  credential: admin.credential.cert(serviceAccount)
		});

		this.db = admin.firestore();
		this.document = this.db.collection('drugmakerextreme').doc('users');

	}
	async getSave(id){
		return (await this.document.get()).data()[id];
	}
	async writeSave(id,save){
		const object = {};
		object[id] = save;
		await this.document.set(object);
	}
}*/
