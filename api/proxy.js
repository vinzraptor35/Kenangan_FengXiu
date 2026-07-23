export default async function handler(req, res) {
    // Ambil URL target dari parameter query, contoh: /api/proxy?url=https://target.com/api
    const targetUrl = req.query.url;

    if (!targetUrl) {
        return res.status(400).json({ error: 'URL target tidak boleh kosong!' });
    }

    try {
        // Lakukan fetch dari server Vercel (bebas CORS)
        const response = await fetch(targetUrl, {
            headers: {
                // Tambahkan User-Agent supaya tidak ditolak oleh web target
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/120.0.0.0'
            }
        });

        const data = await response.text();

        // Izinkan web Anda sendiri yang mengakses backend ini (CORS header untuk publik)
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Content-Type', response.headers.get('content-type') || 'text/plain');
        
        return res.status(200).send(data);
    } catch (error) {
        return res.status(500).json({ error: 'Gagal mengambil data: ' + error.message });
    }
}
