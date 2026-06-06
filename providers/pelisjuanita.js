const cheerio = require('cheerio');

async function scrape(type, id) {
    const baseUrl = "https://pelisjuanita.com";
    const url = `${baseUrl}/${type}/${id}`;
    
    try {
        const response = await fetch(url, {
            headers: { "User-Agent": "Mozilla/5.0" }
        });
        const html = await response.text();
        const $ = cheerio.load(html);
        
        let streams = [];
        
        // Iteramos sobre los botones que ya teníamos identificados
        const options = $('#player_options_ul li');
        
        for (let i = 0; i < options.length; i++) {
            const el = options[i];
            const num = $(el).attr('data-nume');
            const post = $(el).attr('data-post');
            const typeVal = $(el).attr('data-type');
            
            // La URL que descubrimos en tu captura de Network
            const ajaxUrl = `${baseUrl}/wp-admin/admin-ajax.php`;
            
            // Hacemos la petición POST tal cual la hace el navegador
            const ajaxResponse = await fetch(ajaxUrl, {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'User-Agent': 'Mozilla/5.0'
                },
                body: `action=doo_player_ajax&post=${post}&nume=${num}&type=${typeVal}`
            });
            
            const data = await ajaxResponse.json();
            
            // Aquí extraemos el link real del JSON que recibimos
            if (data.embed_url) {
                streams.push({
                    title: `Servidor ${num}`,
                    url: data.embed_url
                });
            }
        }

        return streams;
    } catch (error) {
        console.error("Error al obtener los links:", error);
        return [];
    }
}

module.exports = { scrape };
