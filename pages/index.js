import { useState } from 'react';

export default function Home() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSend = async () => {
    if (!input.trim()) return;
    const userMessage = { role: 'user', content: input };
    setMessages([...messages, userMessage]);
    setInput('');
    setLoading(true);

    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ input })
      });
      const data = await res.json();
      const assistantMessage = { role: 'assistant', content: data.result };
      setMessages((prev) => [...prev, assistantMessage]);
    } catch (e) {
      setMessages((prev) => [...prev, { role: 'assistant', content: '에러 발생: ' + e.message }]);
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-[#1e1e1e] text-white flex flex-col">
      <header className="bg-[#121212] p-4 text-xl font-semibold text-center border-b border-gray-700">
        LuvRemi GPT
      </header>

      <main className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg, idx) => (
          <div key={idx} className={`p-3 rounded-lg max-w-xl ${msg.role === 'user' ? 'bg-gray-700 ml-auto' : 'bg-gray-800 mr-auto'}`}>
            {msg.content}
          </div>
        ))}
        {loading && (
          <div className="text-gray-400">GPT가 응답 중입니다...</div>
        )}
      </main>

      <footer className="border-t border-gray-700 p-4 bg-[#121212]">
        <div className="flex gap-2">
          <input
            className="flex-1 p-3 rounded bg-gray-800 text-white"
            placeholder="메시지를 입력하세요..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          />
          <button onClick={handleSend} className="bg-green-600 px-4 py-2 rounded hover:bg-green-700">
            전송
          </button>
        </div>
      </footer>
    </div>
  );
}
