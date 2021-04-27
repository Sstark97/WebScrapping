const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs');

const urlWeb = 'https://store.steampowered.com/games/?l=latam#p=1&tab=NewReleases';
const url2 = 'https://store.steampowered.com/search/?sort_by=Released_DESC&tags=-1&category1=998,996';
let names1 = [];
let names2 = [];

axios.get(urlWeb).then(response => response.data)
                 .then(body => {
                     const $ = cheerio.load(body);
                     const elements = $('.tab_item_name');
                     elements.each((index,element) => {
                         names1.push($(element).text());
                     });
                     console.log(JSON.stringify(names1));
                     fs.writeFile('datos.json',JSON.stringify(names1),{encoding:'utf-8'},(err) =>{
                         console.log(err);
                     });
                 });


axios.get(url2).then(response => response.data)
                 .then(body => {
                     const $ = cheerio.load(body);
                     const elements = $('.title');
                     elements.each((index,element) => {
                         names2.push($(element).text());
                     });
                     console.log(names2);
                    //  fs.writeFile('datos2.json',JSON.stringify(names2),{encoding:'utf-8'},(err) =>{
                    //     console.log(err);
                    // });
                 })