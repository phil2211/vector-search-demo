exports = async function({searchText, startRow, endRow}){
  const isEmpty = require("lodash/isEmpty");
  const agg = [];
  
  if (!isEmpty(searchText)) {
    const embedding = await getEmbedding(searchText);  
    agg.push({"$vectorSearch": {
          "queryVector": embedding,
          "path": "plot_embedding",
          "numCandidates": 100,
          "limit": 10,
          "index": "default"
        }})
  }
  

  var dbName = "sample_mflix";
  var collName = "embedded_movies";

  // Get a collection from the context
  var collection = context.services.get("mongodb-atlas").db(dbName).collection(collName);

  agg.push({
          "$project": {
            "title": 1,
            "plot": 1,
            "fullplot": 1,
            "poster": 1,
            "year": 1
        }}
  );
  
  agg.push(
        {
          "$facet": {
          "rows": [{"$skip": startRow?startRow:0}, {"$limit": endRow-startRow?endRow-startRow:2000}],
          "rowCount": [{"$count": 'lastRow'}]
        }}    
  );
  
  agg.push(
        {
          "$project": {
            "rows": 1,
            "lastRow": {"$ifNull": [{"$arrayElemAt": ["$rowCount.lastRow", 0]}, 0]}
        }}
  );
  
  console.log(JSON.stringify(agg));

  try {
    const documents = await collection.aggregate(agg).next();
    return documents
  } catch(err) {
    console.log("Error occurred while executing findOne:", err.message);
    return { error: err.message };
  }
};


async function getEmbedding(query) {
    const url = 'https://api.openai.com/v1/embeddings';
    const openai_key = context.values.get("openAI_value");
    
    // Call OpenAI API to get the embeddings.
    let response = await context.http.post({
        url,
        headers: {
          'Authorization': [`Bearer ${openai_key}`],
          'Content-Type': ['application/json']
        },
        body: JSON.stringify({
          input: query,
          model: "text-embedding-ada-002"
        })
    });
    
    if(response.statusCode === 200) {
        let responseData = EJSON.parse(response.body.text());
        return responseData.data[0].embedding;
    } else {
        throw new Error(`Failed to get embedding. Status code: ${response.status}`);
    }
}