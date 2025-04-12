export default async function handler(req, res) {
  const { input } = req.body;
  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      model: "gpt-4o",
      messages: [
        { role: "system", content: "당신은 감각적인 소설 작가입니다." },
        { role: "user", content: input }
      ],
      temperature: 0.8
    })
  });

  const data = await response.json();
  res.status(200).json({ result: data.choices[0].message.content });
}
