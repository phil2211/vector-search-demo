const axios = require('axios');
const fs = require('fs');
const pdf = require('pdf-parse');
const { MongoClient } = require('mongodb');
const cheerio = require('cheerio');

const baseUrl = 'https://www.finma.ch';
const downloadDir = './downloads'; // Directory to save downloaded PDFs
const mongoUri = "mongodb+srv://main_user:Passw0rd@realmbackend.aagmh.mongodb.net/?retryWrites=true&w=majority&appName=AtlasApp"; // MongoDB connection string
const dbName = 'finma_content'; // Database name
const collectionName = 'pdfcontent'; // Collection name

const client = new MongoClient(mongoUri);

const downloadPDF = async (url, filename) => {
    try {
        const response = await axios({
            method: 'GET',
            url: url,
            responseType: 'stream'
        });

        const path = `${downloadDir}/${filename}`;
        const writer = fs.createWriteStream(path);

        response.data.pipe(writer);

        return new Promise((resolve, reject) => {
            writer.on('finish', resolve);
            writer.on('error', reject);
        });
    } catch (error) {
        console.error(`Error downloading file: ${url}`, error);
    }
};

const processPDF = async (filePath, url, filename) => {
    try {
        const dataBuffer = fs.readFileSync(filePath);
        const data = await pdf(dataBuffer);
        return { filename: filename.split('?')[0], content: data.text.replace(/\s+/g, ' '), url };
    } catch (error) {
        console.error(`Error processing file: ${filePath}`, error);
        return null;
    }
};

const uploadToMongoDB = async (document, url) => {
    try {
        await client.connect();
        const db = client.db(dbName);
        const collection = db.collection(collectionName);
        await collection.insertOne(document);
    } catch (error) {
        console.error('Error uploading to MongoDB', error);
    } finally {
        await client.close();
    }
};

const getArchiveLinks = async (url) => {
    try {
        const response = await axios.get(url);
        const $ = cheerio.load(response.data);
        const archiveLinks = [];

        $('a').each((i, link) => {
            const href = $(link).attr('href');
            const text = $(link).text();
            if (text.includes('Archiv') && href.includes('rundschreiben')) {
                archiveLinks.push(baseUrl + href); // Assuming href is a relative URL
            }
        });

        return archiveLinks;
    } catch (error) {
        console.error(error);
        return [];
    }
};

const listAllUrls = async (url) => {
    try {
        const response = await axios.get(url);
        const $ = cheerio.load(response.data);
        const urls = [];

        $('a').each((i, link) => {
            const href = $(link).attr('href');
            if (href && href.includes(".pdf?sc_lang=de")) {
                urls.push(baseUrl + href); // Assuming href is a relative URL
            }
        });

        return urls;
    } catch (error) {
        console.error(error);
        return [];
    }
};

const main = async () => {
    const archiveUrl = 'https://www.finma.ch/de/dokumentation/archiv/rundschreiben/';
    const archiveLinks = await getArchiveLinks(archiveUrl);

    if (!fs.existsSync(downloadDir)) {
        fs.mkdirSync(downloadDir);
    }

    for (const link of archiveLinks) {
        const pdfUrls = await listAllUrls(link);

        for (const pdfUrl of pdfUrls) {
            const filename = pdfUrl.split('/').pop();
            await downloadPDF(pdfUrl, filename);
            const filePath = `${downloadDir}/${filename}`;
            const document = await processPDF(filePath, pdfUrl, filename);

            if (document) {
                await uploadToMongoDB(document);
            }
        }
    }
};


main();