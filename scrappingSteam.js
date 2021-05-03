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
        message.reply(`:man_raising_hand:`);
        message.channel.send( "**Hola! Tu bot está esperando un comando.**\n¿Tienes dudas?\n Para usarlos solo tienes que:\n$action [number]\n$roguelike [number]\n$rol [number]")
        return;
    } else if (command === "action") {
        console.log("stop:" + stop);
        if(typeof stop === 'undefined'){
            message.channel.send(`Introduce a limit: $action [number]`)
            return;
        } else {
            getGames("action", stop, message);
        }
        
    }else if (command === "roguelike") {
        console.log("stop:" + stop);
        if(typeof stop === 'undefined'){
            message.channel.send(`Introduce a limit: $roguelike [number]`)
            return;
        } else {
        getGames("action_rogue_like", stop, message);
        }
        
    }else if (command === "rol") {
        console.log("stop:" + stop);
        if(typeof stop === 'undefined'){
            message.channel.send(`Introduce a limit: $rol [number]`)
            return;
        } else {
            getGames("rpg", stop, message);
        }
        
    }// else if (command != "rol" && command != "action" && command != "roguelike" ){ //no funciona
    //    console.log(  stop);
    //    message.reply(`:man_raising_hand:`);
    //    message.channel.send( "**Hola! Tu bot está esperando un comando.**\n¿Tienes dudas?\n Para usarlos solo tienes que:\n$action [number]\n$roguelike [number]\n$rol [number]")
    //    return;
    //}
})

function getGames(section, num, message) {
    axios.get(urlGene+section).then(response => response.data)
            .then(body => {
                
                const $ = cheerio.load(body);
                const gameNames = $('.tab_item_name');
                const pictureGames = $('.tab_item_cap_img');
                const priceGames = $('.discount_final_price');
                
                gameNames.each((index, gameName) => {
                    games.push({ gameName: $(gameName).text(), priceGames: $(priceGames[index]).text(), pictureGames: $(pictureGames[index]).attr('src') });
                });

                let limit = +num;
                let last = 0;
                message.channel.send(`**:warning:  These are the top ${limit} :warning: **`)
                games.map(game => {
                    if(last === limit){
                        return;
                    }
                    last++;
                    const msg = `**Title:** ${game.gameName} :video_game:\n**Price:** ${game.priceGames} :moneybag:\n**Image:** ${game.pictureGames}\n`;
                    games = [];
                    message.channel.send(msg)
                    return;
                })
                
            });
}

bot.login("token"); 