const fs = require('fs');
const path = require('path');
const { MongoClient, ObjectId } = require('mongodb');

const uri = "mongodb+srv://main_user:Passw0rd@realmbackend.aagmh.mongodb.net/?retryWrites=true&w=majority&appName=AtlasApp";
const client = new MongoClient(uri);

async function main() {
    try {
        await client.connect();
        console.log("Connected to MongoDB");

        const database = client.db("finma_content");
        const collection = database.collection("pdfcontent");

        const directoryPath = path.join('/Users/philip.eschenbacher/Downloads/FINMA_TXT');

        // Using readdirSync to read files synchronously
        const files = fs.readdirSync(directoryPath);

        for (const file of files) {
            const filePath = path.join(directoryPath, file);
            const content = fs.readFileSync(filePath, 'utf8');
            
            const jsonDocument = {
                _id: new ObjectId(),
                name: path.basename(file, path.extname(file)),
                content: content
            };

            await collection.insertOne(jsonDocument);
        }

        console.log("All files have been imported into MongoDB");
    } catch (err) {
        console.error(err);
    } finally {
        await client.close();
    }
}

main().catch(console.error);

