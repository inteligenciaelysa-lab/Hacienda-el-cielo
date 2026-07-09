export default function handler(req, res) {

    if (req.method !== "POST") {
        return res.status(405).end();
    }

    const { password } = req.body;

    if (password === process.env.SITE_PASSWORD) {
        return res.status(200).json({
            success: true
        });
    }

    return res.status(401).json({
        success: false
    });

}
