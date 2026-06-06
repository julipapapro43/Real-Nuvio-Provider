const cheerio = require('cheerio');

async function scrape(type, id) {
    const baseUrl = "https://pelisjuanita.com";
    const url = `${baseUrl}/${type}/${id}`;
    
    try {
        const response = await fetch(url);
        const html = await response.text();
        const $ = cheerio.load(html);
        
        let streams = [];
        
        // Esta es la parte crucial: El selector.
        // Si el sitio tiene los links en un lugar distinto, aquí es donde falla.
        $('a.button').each((i, el) => {
            const link = $(el).attr('href');
            if (link && link.includes('voe') || link.includes('streamwish')) {
                streams.push({
                    title: "Servidor PelisJuanita",
                    url: link
                });
            }
        });

        return streams;
    } catch (error) {
        console.error("Error en scraping:", error);
        return [];
    }
}

module.exports = { scrape };
