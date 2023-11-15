exports = async function(changeEvent) {
    // Get the full document from the change event.
    const doc = changeEvent.fullDocument;

    // Define the OpenAI API url and key.
    const url = 'https://api.openai.com/v1/embeddings';
    // Use the name you gave the value of your API key in the "Values" utility inside of App Services
    const openai_key = context.values.get("openAI_value");
    try {
        console.log(`Processing document with id: ${doc._id}`);

        // Call OpenAI API to get the embeddings.
        let response = await context.http.post({
            url: url,
             headers: {
                'Authorization': [`Bearer ${openai_key}`],
                'Content-Type': ['application/json']
            },
            body: JSON.stringify({
                // The field inside your document that contains the data to embed, here it is the "plot" field from the sample movie data.
                input: doc.plot,
                model: "text-embedding-ada-002"
            })
        });

        // Parse the JSON response
        let responseData = EJSON.parse(response.body.text());

        // Check the response status.
        if(response.statusCode === 200) {
            console.log("Successfully received embedding.");

            const embedding = responseData.data[0].embedding;

            // Use the name of your MongoDB Atlas Cluster
            const collection = context.services.get("mongodb-atlas").db("sample_mflix").collection("embedded_movies");

            // Update the document in MongoDB.
            const result = await collection.updateOne(
                { _id: doc._id },
                // The name of the new field you'd like to contain your embeddings.
                { $set: { plot_embedding: embedding }}
            );

            if(result.modifiedCount === 1) {
                console.log("Successfully updated the document.");
            } else {
                console.log("Failed to update the document.");
            }
        } else {
            console.log(`Failed to receive embedding. Status code: ${JSON.stringify(response)}`);
        }

    } catch(err) {
        console.error(err);
    }
};


/*
const input = {
  fullDocument: {
    _id: "123",
    plot: "Hello World"
  }
}
*/