const cheerio = require('cheerio');

async function scrape(type, id) {
    const baseUrl = "https://pelisjuanita.com";
    const url = `${baseUrl}/${type}/${id}`;
    
    try {
        const response = await fetch(url);
        const html = await response.text();
        
        // ¡Ojo aquí! Vamos a ver si el HTML realmente tiene el contenido
        if (html.includes("player_options_ul")) {
            console.log("¡Encontré el contenedor!");
        } else {
            console.log("No encontré el contenedor. La web podría estar bloqueando el acceso.");
        }

        const $ = cheerio.load(html);
        let streams = [];
        
        $('#player_options_ul li').each((i, el) => {
            console.log("Servidor detectado:", $(el).attr('data-nume'));
            
            streams.push({
                title: "Servidor " + $(el).attr('data-nume'),
                url: `${baseUrl}/?trembed=1&trid=${$(el).attr('data-post')}&trtype=${$(el).attr('data-type')}&trnume=${$(el).attr('data-nume')}`
            });
        });

        return streams;
    } catch (error) {
        console.error("Error crítico:", error);
        return [];
    }
}

module.exports = { scrape };
