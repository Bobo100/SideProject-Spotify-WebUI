import { MongoClient, Db, Collection } from 'mongodb';
export const collections: { [key: string]: Collection } = {};
// export async function connectToDatabase() {
//     const mongodbURL = `mongodb+srv://${process.env.NEXT_PUBLIC_USER_NAME}:${process.env.NEXT_PUBLIC_MONGODB_PASSEWORD}@cluster0.yjz075d.mongodb.net/${process.env.NEXT_PUBLIC_DATABASE_NAME}?retryWrites=true&w=majority`;
//     const client: mongoDB.MongoClient = new mongoDB.MongoClient(mongodbURL);
//     await client.connect();

//     const db: mongoDB.Db = client.db(process.env.NEXT_PUBLIC_DATABASE_NAME);

//     const playlistCollection: mongoDB.Collection = db.collection('playlist');
//     collections.playlist = playlistCollection;
//     const tokenCollection: mongoDB.Collection = db.collection('token');
//     collections.token = tokenCollection;
//     const userCollection: mongoDB.Collection = db.collection('user');
//     collections.user = userCollection;

//     console.log(`Successfully connected to database: ${db.databaseName}`);
// }


let client: MongoClient;
let cachedDb: Db;
const mongodbURL = `mongodb+srv://${process.env.NEXT_PUBLIC_USER_NAME}:${process.env.NEXT_PUBLIC_MONGODB_PASSEWORD}@cluster0.yjz075d.mongodb.net/${process.env.NEXT_PUBLIC_DATABASE_NAME}?retryWrites=true&w=majority`;

export async function connectToDatabase(): Promise<Db> {
    if (!client) {
        client = new MongoClient(mongodbURL);
        await client.connect();
    }

    if (!cachedDb) {
        cachedDb = client.db(process.env.NEXT_PUBLIC_DATABASE_NAME);
        const playlistCollection: Collection = cachedDb.collection('playlist');
        collections.playlist = playlistCollection;
        const tokenCollection: Collection = cachedDb.collection('token');
        collections.token = tokenCollection;
        const userCollection: Collection = cachedDb.collection('user');
        collections.user = userCollection;
    }

    return cachedDb;
}
