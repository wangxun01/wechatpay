import { MongoClient } from 'mongodb';
import {MongodbApi} from './config/index.js'
import {
    serverUrl,
    databaseName
} from '../../secret/index.js';

const client = new MongoClient(serverUrl + databaseName);

MongodbApi.openCollect = async function(collectName) {
    try {
        if (!this.conn) {
            this.conn = await client.connect();
        }

        if (!this.db) {
            this.db = await this.conn.db(databaseName);
            console.log('mongodb: connect database successed');
        }

        if (!this.collectMap) {
            this.collectMap = new Map();
            const collect = await this.db.collection(collectName);
            this.collectMap.set(collectName, collect);
            console.log('mongodb: get collection & init collectMap successed');
        }

        if (!this.collectMap.has(collectName)) {
            const collect = await this.db.collection(collectName);
            this.collectMap.set(collectName, collect);
            console.log('mongodb: get new collection & add to collectMap successed');
        }
    } catch (err) {
        console.log('mongodb connect failed: ' + err);
    }
};

MongodbApi.clean = async function() {
    try {
        await client.close();
    } catch (err) {
        console.log('mongodb client close failed: ' + err);
    }
}

export {
    MongodbApi
}