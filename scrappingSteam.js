const axios = require('axios');
const cheerio = require('cheerio');
const disc = require('discord.js')

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
        if(typeof stop === 'undefined'){
            message.channel.send(`Introduce a limit: $action [number]`)
            return;
        } else {
            axios.get(urlGene+"action").then(response => response.data)
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
                    if(last === limit){
                        return;
                    }
                    last++;
                    const msg = `**Title:** ${game.gameName}\n**Price:** ${game.priceGames}\n**Image:** ${game.pictureGames}\n`;
                    message.channel.send(msg)
                    return;
                })
                // message.channel.send(`These are the top ${limit}`)
                // return;
            });
        }
        
    }else if (command === "roguelike") {
        if(typeof stop === 'undefined'){
            message.channel.send(`Introduce a limit: $roguelike [number]`)
            return;
        } else {
            axios.get(urlGene+"action_rogue_like").then(response => response.data)
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
                message.channel.send(`**These are the top ${limit}**`) 
                games.map(game => {
                    if(last === limit){
                        return;
                    }
                    last++;
                    const msg = `**Title:** ${game.gameName}\n**Price:** ${game.priceGames}\n**Image:** ${game.pictureGames}\n`;
                    message.channel.send(msg)
                    return;
                })
                
            });
        }
        
    }
})

bot.login("")