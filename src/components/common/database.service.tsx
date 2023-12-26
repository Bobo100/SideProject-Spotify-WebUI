import * as mongoDB from 'mongodb';
export const collections: { [key: string]: mongoDB.Collection } = {};
export async function connectToDatabase() {

    const mongodbURL = `mongodb+srv://${process.env.NEXT_PUBLIC_USER_NAME}:${process.env.NEXT_PUBLIC_MONGODB_PASSEWORD}@cluster0.yjz075d.mongodb.net/${process.env.NEXT_PUBLIC_DATABASE_NAME}?retryWrites=true&w=majority`
    const client: mongoDB.MongoClient = new mongoDB.MongoClient(mongodbURL);
    await client.connect();

    const db: mongoDB.Db = client.db(process.env.NEXT_PUBLIC_DATABASE_NAME);

    const playlistCollection: mongoDB.Collection = db.collection('playlist');
    collections.playlist = playlistCollection;
    const tokenCollection: mongoDB.Collection = db.collection('token');
    collections.token = tokenCollection;
    const userCollection: mongoDB.Collection = db.collection('user');
    collections.user = userCollection;

    console.log(`Successfully connected to database: ${db.databaseName}`);
}