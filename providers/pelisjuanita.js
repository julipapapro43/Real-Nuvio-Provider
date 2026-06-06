const cheerio = require('cheerio');

async function scrape(type, id) {
    const baseUrl = "https://pelisjuanita.com";
    const url = `${baseUrl}/${type}/${id}`;
    
    try {
        const response = await fetch(url);
        const html = await response.text();
        const $ = cheerio.load(html);
        
        let streams = [];
        
        // Buscamos específicamente dentro de la lista que encontramos en tu captura
        $('#player_options_ul li').each((i, el) => {
            const serverName = $(el).attr('data-nume'); 
            const postID = $(el).attr('data-post');
            const num = $(el).attr('data-nume');
            const typeVal = $(el).attr('data-type');
            
            // Esta es la URL que construye el link del reproductor basándose en el ID del post
            const streamUrl = `${baseUrl}/?trembed=1&trid=${postID}&trtype=${typeVal}&trnume=${num}`;
            
            streams.push({
                title: `Servidor ${serverName}`,
                url: streamUrl
            });
        });

        return streams;
    } catch (error) {
        console.error("Error en el scraping:", error);
        return [];
    }
}

module.exports = { scrape };
