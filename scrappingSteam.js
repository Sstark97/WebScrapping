const axios = require('axios');
const cheerio = require('cheerio');
const disc = require('discord.js')

const urlGene = "https://store.steampowered.com/category/action";
const category = process.argv[1]
let games = [];

// axios.get(`${urlGene}/${category}`).then(async response => response.data)
//     .then(body => {
//         const $ = cheerio.load(body);
//         const gameNames = $('.tab_item_name');
//         const pictureGames = $('.tab_item_cap_img');
//         // const link = selector.attr("href").trim();
//         // const link = $('.tab_item   ')
//         // const pictureGames = $('.tab_item_cap>img:nth-child(1)');
//         const priceGames = $('.discount_final_price');
//         // console.log($(pictureGames).html());
//         // console.log(link.attr('href'));
//         gameNames.each((index, gameName) => {
//             games.push({ gameName: $(gameName).text(), pictureGames: $(pictureGames[index]).attr('src'), priceGames: $(priceGames[index]).text() });
//         });
//         console.log(games);
//     });

// --------------------------------------------------------------------------------------------

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
        console.log(stop);
        if(typeof stop === 'undefined'){
            message.channel.send(`Introduce a limit: $action [number]`)
            return;
        } else {
            axios.get(urlGene).then(response => response.data)
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
                games.map(game => {
                    if(last === limit){
                        return;
                    }
                    last++;
                    const msg = `**Title:** ${game.gameName}\n**Price:** ${game.priceGames}\n**Image:** ${game.pictureGames}\n`;
                    message.channel.send(msg)
                    return;
                })
                message.channel.send(`These are the top ${limit}`)
                return;
            });
        }
        
    }
})

bot.login("ODM4MDE1ODU0OTMwNTU4OTc2.YI09FQ.R6RNh28Vz-Q-WfukWQrjrdWNXP8")