const cheerio = require('cheerio');

async function scrape(type, id) {
    const baseUrl = "https://pelisjuanita.com";
    // Nota: Muchas webs de este tipo usan 'embed' como punto de entrada real
    const url = `${baseUrl}/${type}/${id}`;
    
    try {
        // Usamos un User-Agent de navegador real para evitar el bloqueo inicial
        const response = await fetch(url, {
            headers: {
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
            }
        });
        const html = await response.text();
        
        // Buscamos el ID necesario en el HTML
        const $ = cheerio.load(html);
        
        // A veces el servidor de video está en un atributo llamado 'data-id' 
        // o escondido dentro de un script que contiene un JSON
        let streams = [];
        
        // Buscamos dentro de los elementos que cargan el player
        $('.dooplay_player_option').each((i, el) => {
            const num = $(el).data('nume');
            const post = $(el).data('post');
            const typeVal = $(el).data('type');
            
            // Esta es la llamada real que hace el navegador para obtener el link
            // Intentamos recrear la URL de la API del reproductor
            const streamUrl = `${baseUrl}/wp-admin/admin-ajax.php?action=doo_player_ajax&post=${post}&nume=${num}&type=${typeVal}`;
            
            streams.push({
                title: `Servidor ${num}`,
                url: streamUrl
            });
        });

        return streams;
    } catch (error) {
        console.error("Error al extraer:", error);
        return [];
    }
}

module.exports = { scrape };
