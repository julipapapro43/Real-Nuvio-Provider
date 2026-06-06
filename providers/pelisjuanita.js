const cheerio = require('cheerio');

async function scrape(type, id) {
    const url = `https://pelisjuanita.com/${type}/${id}`;
    
    try {
        const response = await fetch(url, {
            headers: {
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
            }
        });
        const html = await response.text();
        
        // Esto imprimirá el HTML en tus logs para ver si aparecen los servidores
        console.log("HTML recibido (primeros 500 caracteres):", html.substring(0, 500));

        const $ = cheerio.load(html);
        const elements = $('#player_options_ul li');
        console.log("Cantidad de servidores encontrados:", elements.length);

        let streams = [];
        elements.each((i, el) => {
            streams.push({
                title: "Servidor " + $(el).attr('data-nume'),
                url: `https://pelisjuanita.com/?trembed=1&trid=${$(el).attr('data-post')}&trtype=${type}&trnume=${$(el).attr('data-nume')}`
            });
        });

        return streams;
    } catch (error) {
        console.error("Error:", error);
        return [];
    }
}

module.exports = { scrape };
