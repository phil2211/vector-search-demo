#Check all dependencies
if ! command -v atlas &> /dev/null
then
    echo "atlas could not be found, please install it"
    exit
fi

if ! command -v appservices &> /dev/null
then
    echo "appservices could not be found, please install it"
    exit
fi

if ! command -v npm &> /dev/null
then
    echo "npm could not be found, please install it"
    exit
fi

#Create Atlas Project
atlas auth login -P VectorSearchDemo && \
atlas projects create VectorSearchDemo -P VectorSearchDemo && \
atlas config set -P VectorSearchDemo project_id `atlas project ls -P VectorSearchDemo | grep VectorSearchDemo | awk '{ print $1 }'` && \
atlas quickstart --skipMongosh --provider AWS --region EU_CENTRAL_1 --tier M0 --username admin --password Passw0rd --accessListIp "0.0.0.0/0" --clusterName VectorSearchDemo -P VectorSearchDemo --force && \
atlas clusters search indexes create -P VectorSearchDemo -f "./vectorSearchMapping.json" --clusterName VectorSearchDemo && \
atlas project apiKeys create --desc appservices --role GROUP_OWNER -P VectorSearchDemo > AtlasAPIKeys.txt && \
appservices login --api-key $(cat AtlasAPIKeys.txt | grep "Public API Key" | awk '{ print $4 }') --private-api-key $(cat AtlasAPIKeys.txt | grep "Private API Key" | awk '{ print $4 }') -y --profile VectorSearchDemo && \
appservices apps create --profile VectorSearchDemo -n VectorSearchDemo -l DE-FF -d LOCAL --local DeleteMe && \
appservices secrets create --profile VectorSearchDemo -a VectorSearchDemo -n OpenAI_secret -v $(cat openai.key) && \  
appservices push --local "backend" --include-package-json -y --profile VectorSearchDemo && \
echo "REACT_APP_REALMAPP="$(appservices apps list --profile VectorSearchDemo | grep vectorsearchdemo | awk '{print $1}') > .env.local && \
echo "Please go to http://localhost:3000" && \
npm install && npm start