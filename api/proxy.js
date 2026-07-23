export default async function handler(req, res) {
    const { targetUrl, loginUrl, username, password, usernameField, passwordField, cookie } = req.query;

    if (!targetUrl) {
        return res.status(400).json({ error: "URL target tidak boleh kosong!" });
    }

    try {
        let headersToUse = {};

        // --- SKenario 1: Jika pakai Cookie manual/sesi ---
        if (cookie) {
            headersToUse['Cookie'] = cookie;
        } 
        // --- SKENARIO 2: Jika pakai Username & Password ---
        else if (loginUrl && username && password) {
            const formData = new URLSearchParams();
            formData.append(usernameField || 'username', username);
            formData.append(passwordField || 'password', password);

            const loginResponse = await fetch(loginUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                body: formData,
                redirect: 'manual'
            });

            const setCookieHeader = loginResponse.headers.get('set-cookie');
            if (setCookieHeader) {
                headersToUse['Cookie'] = setCookieHeader;
            }
        }
        // --- SKENARIO 3: Tanpa Login (Web Publik Biasa) ---
        // Biarkan headersToUse kosong, langsung tembak targetUrl.

        // Ambil HTML dari target
        const targetResponse = await fetch(targetUrl, {
            method: 'GET',
            headers: headersToUse
        });

        const htmlText = await targetResponse.text();

        res.setHeader('Content-Type', 'text/html');
        res.status(200).send(htmlText);

    } catch (error) {
        res.status(500).json({ error: "Gagal mengambil halaman web: " + error.message });
    }
}
