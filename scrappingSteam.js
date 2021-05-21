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
        message.reply(`:man_raising_hand:`);
        message.channel.send( "**Hola! Tu bot está esperando un comando.**\n¿Tienes dudas?\n Para usarlos solo tienes que:\n$action [number]\n$roguelike [number]\n$rol [number]")
        return;
    } else if (command === "action") {
        if (typeof stop === 'undefined') {
            message.channel.send(`Introduce a limit: $action [number]`)
            return;
        } else {
            getGames("action",stop,message);
        }

    } else if (command === "roguelike") {
        if (typeof stop === 'undefined') {
            message.channel.send(`Introduce a limit: $roguelike [number]`)
            return;
        } else {
            getGames('action_rogue_like',stop,message);
        }

    }else if (command === "rol") {
        if(typeof stop === 'undefined'){
            message.channel.send(`Introduce a limit: $rol [number]`)
            return;
        } else {
            getGames("rpg", stop, message);
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
                    message.channel.send(`**:warning: These are the top ${limit} **:warning:`);
                    games.map(game => {
                        if (last === limit) {
                            return;
                        }
                        last++;
                        const embed = cardGame(game.gameName,game.priceGames,game.pictureGames);
                        games = [];
                        message.channel.send(embed)
                        return 
                    })
                });
    
}

function cardGame(gameName,priceGames,pictureGames) {
    const embed = new MessageEmbed()
        // Set the title of the field
        .setTitle(":video_game: " + gameName + " :video_game:")
        .setImage(pictureGames)
        // Set the color of the embed
        .setColor(0xff0000)
        // Set the main content of the embed
        .setDescription('Price: '+priceGames + " :moneybag:");
    return embed;

}

bot.login("");
