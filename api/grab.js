export default async function handler(req, res) {
    // Izinkan akses dari web kamu saja
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    const targetUrl = req.query.url;
    if (!targetUrl) {
        return res.status(400).json({ error: 'URL target tidak boleh kosong!' });
    }

    try {
        // Server Vercel yang melakukan fetch, jadi aman dari blokir CORS browser
        const response = await fetch(targetUrl, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
            }
        });

        const htmlText = await response.text();

        return res.status(200).json({ success: true, html: htmlText });
    } catch (err) {
        return res.status(500).json({ success: false, error: "Gagal mengambil halaman web target." });
    }
}
