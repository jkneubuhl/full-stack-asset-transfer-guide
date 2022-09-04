import { capitalize, DiscordRequest } from './utils.js';
import { WORKSHOP_CARDS } from './cards.js';

export async function HasGuildCommands(appId, guildId, commands) {
  if (guildId === '' || appId === '') return;

  commands.forEach((c) => HasGuildCommand(appId, guildId, c));
}

// Checks for a command
async function HasGuildCommand(appId, guildId, command) {
  // API endpoint to get and post guild commands
  const endpoint = `applications/${appId}/guilds/${guildId}/commands`;

  try {
    const res = await DiscordRequest(endpoint, { method: 'GET' });
    const data = await res.json();

    if (data) {
      const installedNames = data.map((c) => c['name']);
      // This is just matching on the name, so it's not good for updates
      if (!installedNames.includes(command['name'])) {
        console.log(`Installing "${command['name']}"`);
        InstallGuildCommand(appId, guildId, command);
      } else {
        console.log(`"${command['name']}" command already installed`);
      }
    }
  } catch (err) {
    console.error(err);
  }
}

// Installs a command
export async function InstallGuildCommand(appId, guildId, command) {
  // API endpoint to get and post guild commands
  const endpoint = `applications/${appId}/guilds/${guildId}/commands`;
  // install command
  try {
    await DiscordRequest(endpoint, { method: 'POST', body: command });
  } catch (err) {
    console.error(err);
  }
}

// Get the game choices from game.js
function createCommandChoices() {
  const choices = getRPSChoices();
  const commandChoices = [];

  for (let choice of choices) {
    commandChoices.push({
      name: capitalize(choice),
      value: choice.toLowerCase(),
    });
  }

  return commandChoices;
}

// Create a conga card
export const CREATE_COMMAND = {
    name: 'create',
    description: 'Create a Conga Card',
    type: 1,
    options: [
        {
            type: 3,
            name: 'conga',
            description: 'Name of your Conga Card',
            required: true,
            choices: WORKSHOP_CARDS,
        }
    ],
};

// Transfer a conga card to a new owner.
export const TRANSFER_COMMAND = {
    name: 'transfer',
    description: 'transfer a Conga Card',
    type: 1,
    options: [
        {
            type: 3,
            name: 'conga',
            description: 'Conga Card',
            required: true,
            choices: WORKSHOP_CARDS,
        },
        {
            type: 6,
            name: "to",
            description: "New owner of the card",
            required: true,
        }
    ],
};
