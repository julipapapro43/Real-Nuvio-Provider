const cheerio = require('cheerio');

async function scrape(type, id) {
    const baseUrl = "https://pelisjuanita.com";
    
    try {
        // Esta es la lógica que buscará los enlaces dentro de la página
        const response = await fetch(`${baseUrl}/${type}/${id}`);
        const html = await response.text();
        const $ = cheerio.load(html);
        
        let streams = [];
        
        // Aquí extraemos los servidores (esto es un ejemplo basado en la estructura común de PelisJuanita)
        $('ul#playeroptionsul li').each((index, element) => {
            const serverName = $(element).attr('data-nume');
            // La lógica para obtener el link del iframe real
            streams.push({
                title: `Servidor ${serverName}`,
                url: `${baseUrl}/?trembed=1&trid=${id}&trtype=${type}` 
            });
        });

        return streams;
    } catch (error) {
        console.error("Error al scrapear PelisJuanita:", error);
        return [];
    }
}

module.exports = { scrape };
