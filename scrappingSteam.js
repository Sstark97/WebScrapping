const axios = require('axios');
const cheerio = require('cheerio');
const disc = require('discord.js');

const { Client, MessageEmbed } = require('discord.js');

const urlGene = "https://store.steampowered.com/category/";
const category = process.argv[1]
let games = [];


const bot = new disc.Client();

bot.on("ready", () => {
    console.log("Tu bot (" + bot.user.tag + ") ahora se encuentra en línea!")
})

bot.on("message", async message => {
    const prefix = "$";
    const args = message.content.slice(prefix.length).trim().split(/ +/g);
    const command = args.shift().toLowerCase();
    const stop = args.pop();

    if (command === "help") {
        message.channel.send("**Hola! Tu bot está perfectamente recibiendo mensajes.**\n¿Tienes dudas sobre como modificarlo más? Visita la documentación: https://scripthubteam.github.io/docs/#/js/discord-js")
        return;
    } else if (command === "action") {
        if (typeof stop === 'undefined') {
            message.channel.send(`Introduce a limit: $action [number]`)
            return;
        } else {
            getGames(command,stop,message);
        }

    } else if (command === "roguelike") {
        if (typeof stop === 'undefined') {
            message.channel.send(`Introduce a limit: $roguelike [number]`)
            return;
        } else {
            getGames('action_rogue_like',stop,message);
        }

    }
})

function getGames(command,stop,message) {
    axios.get(urlGene + command).then(response => response.data)
                .then(body => {
                    const $ = cheerio.load(body);
                    const gameNames = $('.tab_item_name');
                    const pictureGames = $('.tab_item_cap_img');
                    const priceGames = $('.discount_final_price');

                    gameNames.each((index, gameName) => {
                        games.push({ gameName: $(gameName).text(), priceGames: $(priceGames[index]).text(), pictureGames: $(pictureGames[index]).attr('src') });
                    });

                    let limit = +stop;
                    let last = 0;
                    message.channel.send(`**These are the top ${limit}**`);
                    games.map(game => {
                        if (last === limit) {
                            return;
                        }
                        last++;
                        const embed = cardGame(game.gameName,game.priceGames,game.pictureGames);
                        message.channel.send(embed)
                        return 
                    })
                });
    
}

function cardGame(gameName,priceGames,pictureGames) {
    const embed = new MessageEmbed()
        // Set the title of the field
        .setTitle(gameName)
        .setImage(pictureGames)
        // Set the color of the embed
        .setColor(0xff0000)
        // Set the main content of the embed
        .setDescription('Price: '+priceGames);
    return embed;

}

bot.login("")