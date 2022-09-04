import 'dotenv/config';
import express from 'express';
import {
  InteractionType,
  InteractionResponseType,
  InteractionResponseFlags,
  MessageComponentTypes,
  ButtonStyleTypes,
} from 'discord-interactions';
import { VerifyDiscordRequest, getRandomEmoji, DiscordRequest, mention } from './utils.js';
import {
  CREATE_COMMAND,
  TRANSFER_COMMAND,
  HasGuildCommands,
} from './commands.js';

// Create an express app
const app = express();
// Get port, or default to 3000
const PORT = process.env.PORT || 3000;
// Parse request body and verifies incoming requests using discord-interactions package
app.use(express.json({ verify: VerifyDiscordRequest(process.env.PUBLIC_KEY) }));
// Base URL for resolving the conga cards
const CONGA_BASE_URL='https://raw.githubusercontent.com/jkneubuh/full-stack-asset-transfer-guide/feature/nano-bot/applications/conga-bot/images';



// Store for in-progress games. In production, you'd want to use a DB
const activeGames = {};

/**
 * Interactions endpoint URL where Discord will send HTTP requests
 */
app.post('/interactions', async function (request, response) {
  // Interaction type and data
  const { type, id, data } = request.body;

  /**
   * Handle verification requests
   */
  if (type === InteractionType.PING) {
    return response.send({ type: InteractionResponseType.PONG });
  }

  /**
   * Handle slash command requests
   * See https://discord.com/developers/docs/interactions/application-commands#slash-commands
   */
  if (type === InteractionType.APPLICATION_COMMAND) {
    const { name } = data;

    if (name == CREATE_COMMAND.name) {
        return await handleCreateCommand(request, response);
    }

    if (name == TRANSFER_COMMAND.name) {
        return await handleTransferCommand(request, response);
    }
  }
});

async function handleCreateCommand(request, response) {
    const { data } = request.body;
    const card = data.options[0].value;
    const owner = request.body.member.user;

    console.log(`/create ${card} by ${JSON.stringify(owner)}`);

    const content = `${mention(owner.id)} has caught a wild ${card}! ${getRandomEmoji()}`;

    const embeds = [
        {
            title: card,
            image: {
                url: `${CONGA_BASE_URL}/${card}.png`,
            }
        }
    ];

    return response.send({
        type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
        data: {
            content: content,
            embeds: embeds,
        },
    });
}

async function handleTransferCommand(request, response) {
    const { data } = request.body;

    const card = data.options[0].value;
    const owner = request.body.member.user.id;
    const newOwner = data.options[1].value;

    console.log(`/transfer ${card} from ${owner} to ${newOwner}`);

    const content = `${mention(owner)} gave ${card} to ${mention(newOwner)}`;

    return response.send({
        type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
        data: {
            content: content,
        },
    });
}

app.listen(PORT, () => {
  console.log('Listening on port', PORT);

  // Check if guild commands from commands.json are installed (if not, install them)
  HasGuildCommands(process.env.APP_ID, process.env.GUILD_ID, [
    CREATE_COMMAND,
    TRANSFER_COMMAND,
  ]);
});
