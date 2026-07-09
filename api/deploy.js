export default function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: "Method tidak diizinkan" });
    }

    const { namaWeb, kodeHtml } = req.body;

    if (!namaWeb || !kodeHtml) {
        return res.status(400).json({ error: "Data tidak lengkap" });
    }

    const cleanName = namaWeb.toLowerCase().replace(/[^a-z0-9-]/g, '-');
    
    const tokenPart1 = "vcp_0oo5TzBYsf3yZB7n7ji57BfPbs";
    const tokenPart2 = "WOYvjVxmVWN03pFqQqSP";
    const tokenVercel = tokenPart1 + tokenPart2;

    const payload = {
        name: cleanName,
        files: [
            {
                file: "index.html",
                data: kodeHtml
            }
        ],
        projectSettings: {
            framework: null
        }
    };

    fetch("https://api.vercel.com/v13/deployments", {
        method: "POST",
        headers: {
            "Authorization": "Bearer " + tokenVercel,
            "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
    })
    .then(response => response.json())
    .then(data => {
        if (data && data.url) {
            res.json({ success: true, url: "https://" + data.url });
        } else {
            res.status(500).json({ error: "Gagal deploy ke Vercel" });
        }
    })
    .catch(() => {
        res.status(500).json({ error: "Gangguan jaringan server" });
    });
}
