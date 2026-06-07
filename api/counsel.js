// api/counsel.js

export default async function handler(req, res) {
    // CORS 및 요청 메서드 제한 (POST만 허용)
    if (req.method !== 'POST') {
        return res.status(405).json({ error: '허용되지 않는 요청 메서드입니다. POST만 가능합니다.' });
    }

    const { contents, tools, systemInstruction } = req.body;
    
    // Vercel 환경 변수에서 안전하게 API 키 로드
    const apiKey = process.env.GEMINI_API_KEY;
    
    if (!apiKey) {
        return res.status(500).json({ error: '서버 환경 변수에 GEMINI_API_KEY가 설정되어 있지 않습니다.' });
    }

    // Gemini API 엔드포인트 URL
    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.1-flash-lite:generateContent?key=${apiKey}`;

    try {
        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ contents, tools, systemInstruction })
        });

        if (!response.ok) {
            const errorData = await response.json();
            return res.status(response.status).json(errorData);
        }

        const data = await response.json();
        return res.status(200).json(data);
    } catch (error) {
        return res.status(500).json({ error: error.message || 'Gemini API 호출 중 서버 에러가 발생했습니다.' });
    }
}
