# Conga Cards

This project contains a basic illustration of integrating a Hyperledger Fabric Gateway Client with a Discord  
interaction app.

This project is based on the [#discord Getting Started](todo) guide and Fabric ApplicationDev guide for working
with chaincode event handlers.

When the conga-cards application has been installed on a guild / channel, users in a discord chat can issue
`/create` and `/transfer` commands to trade conga NFTs between users on the server.

The application subcribes to the chaincode event loop in order to replay a "journal," maintaining
a state table of cards currently held by each user.  When a card is transferred, a chaincode transaction
will be issued to the Gateway service and replayed by the event handler.

In this basic application, cards can be created and exchanged freely between users.  Can this be extended with
a more realistic card trading game?  Some seed / starter ideas:

- _Block Paper Scissors_
- _Rho Sham Block_ (like block-paper-scissors...) 
- _Block-e-mon_
- _Block Fish_
- ... 


## Running app locally

Before you start, you'll need to [create a Discord app](https://discord.com/developers/applications) with the proper permissions:
- `applications.commands`
- `bot` (with Send Messages enabled)

Configuring the app is covered in detail in the [getting started guide](https://discord.com/developers/docs/getting-started).

### Setup project

First clone the project:
```
git clone https://github.com/hyperledgendary/full-stack-asset-transfer-guide.git
```

Then navigate to its directory and install dependencies:
```
cd applications/conga-cards
npm install
```
### Get app credentials

Fetch the credentials from your app's settings and add them to a `.env` file (see `.env.sample` for an example). You'll need your app ID (`APP_ID`), server ID (`GUILD_ID`), bot token (`DISCORD_TOKEN`), and public key (`PUBLIC_KEY`).

Fetching credentials is covered in detail in the [getting started guide](https://discord.com/developers/docs/getting-started).

> 🔑 Environment variables can be added to the `.env` file in Glitch or when developing locally, and in the Secrets tab in Replit (the lock icon on the left).

### Run the app

After your credentials are added, go ahead and run the app:

```
node src/app.js
```

> ⚙️ A package [like `nodemon`](https://github.com/remy/nodemon), which watches for local changes and restarts your app, may be helpful while locally developing.


### Running the app in docker 

This project contains a Dockerfile which can be used to build the app and 
distribute in a container for deployment to a remote Kubernetes cluster.

- Build the docker image: 
```shell
docker build -t conga-cards .
```

- Run the docker image, binding to port 3000 on the local system: 
```shell
docker run \
  --rm \
  --name conga-cards \
  --env-file .env \
  -p 3000:3000 \
  conga-cards
```

- TODO: Deployment and Ingress on a remote k8s cluster.

### Set up interactivity

The project needs a public endpoint where Discord can send requests. To develop and test locally, you can use something like [`ngrok`](https://ngrok.com/) to tunnel HTTP traffic.

Install ngrok if you haven't already, then start listening on port `3000`:

```
ngrok http 3000
```

You should see your connection open:

```
Tunnel Status                 online
Version                       2.0/2.0
Web Interface                 http://127.0.0.1:4040
Forwarding                    http://1234-someurl.ngrok.io -> localhost:3000
Forwarding                    https://1234-someurl.ngrok.io -> localhost:3000

Connections                  ttl     opn     rt1     rt5     p50     p90
                              0       0       0.00    0.00    0.00    0.00
```

Copy the forwarding address that starts with `https`, in this case `https://1234-someurl.ngrok.io`, then go to your [app's settings](https://discord.com/developers/applications).

On the **General Information** tab, there will be an **Interactions Endpoint URL**. Paste your ngrok address there, and append `/interactions` to it (`https://1234-someurl.ngrok.io/interactions` in the example).

Click **Save Changes**, and your app should be ready to run 🚀

## Other resources
- Read **[the documentation](https://discord.com/developers/docs/intro)** for in-depth information about API features.
- Browse the `examples/` folder in this project for smaller, feature-specific code examples
- Join the **[Discord Developers server](https://discord.gg/discord-developers)** to ask questions about the API, attend events hosted by the Discord API team, and interact with other devs.
- Check out **[community resources](https://discord.com/developers/docs/topics/community-resources#community-resources)** for language-specific tools maintained by community members.
