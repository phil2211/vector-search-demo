# MongoDB Atlas Vector Search Demo
This demo is based on the blog post by [Benjamin Flast](https://www.mongodb.com/developer/products/atlas/semantic-search-mongodb-atlas-vector-search/)

You can create your own demo in just a few minutes using the `install.sh` script in the root of this repository. 

![Demo Setup](/assets/demoSetup.gif)

# How to spin up the demo
> Everything works on an Atlas Free Tier. No Credit Card needed, free forever

1. Clone this repo and go to the directory
```
git clone https://github.com/phil2211/vector-search-demo && \
cd vector-search-demo
```
2. Go to https://platform.openai.com/api-keys and create your own API key and paste this key to the `openai.key` file in the root of this project.

![OpenAI API Key](/assets/openAIKey.png)

```
echo "your openai api key" > openai.key
```

3. You need the following prerequisits met to follow along
- [MongoDB Atlas Account](https://cloud.mongodb.com) (Free account available, no credit card needed)
- [Atlas CLI](https://www.mongodb.com/tools/atlas-cli)
- [NodeJS](https://nodejs.org/)
- [Realm CLI](https://www.mongodb.com/docs/atlas/app-services/cli/)
---
I use Homebrew to do this on MacOS. If you don't have Homebrew, please follow the very simple instructions on the [Hombrew](https://brew.sh/) website to install it. The command below will install all necessary tools at once. If you are using Windows or Linux, see the links above for installation instructions for each component.
```
brew tap mongodb/brew && \
brew install mongodb-atlas-cli node npm
```

4. Install the [Realm CLI](https://www.mongodb.com/docs/atlas/app-services/cli/)
```
npm install -g mgeneratejs atlas-app-services-cli
```
- **Restart your shell to use it**
---

Now execute the `install.sh` script to spin up your own free MongoDB Atlas instance. Please wait until the cluster is deployed and the testdata is loaded. PLEASE DO NOT CTRL+C during that process.

After ~5 minutes your browser should start on http://localhost:3000 and you can start asking natural language questions to query the movie database. You can also use [MongoDB Compass](https://www.mongodb.com/try/download/compass) to connect to your cluster directly to browse the data.

![OpenAI API Key](/assets/setupProcess.gif)

Please feel free to contacte me if you have further questions or feedback to this demo.