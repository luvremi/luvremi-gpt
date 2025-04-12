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
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white flex flex-col">
      <header className="bg-gradient-to-r from-purple-900 to-blue-800 p-6 text-2xl font-bold text-center shadow-lg">
        <div className="max-w-4xl mx-auto flex items-center justify-center">
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-pink-400 to-blue-400">
            LuvRemi GPT
          </span>
          <span className="ml-2 text-xs bg-blue-500 px-2 py-1 rounded-full animate-pulse">
            LIVE
          </span>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto p-6 space-y-4 max-w-4xl w-full mx-auto">
        {messages.length === 0 && (
          <div className="text-center mt-20 text-gray-400">
            <h2 className="text-2xl font-light mb-2">LuvRemi GPT에 오신 것을 환영합니다</h2>
            <p className="text-sm">무엇이든 질문해보세요. 친절하게 답변해드립니다.</p>
          </div>
        )}
        
        {messages.map((msg, idx) => (
          <div 
            key={idx} 
            className={`p-4 rounded-xl max-w-3xl shadow-md transition-all duration-200 ${
              msg.role === 'user' 
                ? 'bg-gradient-to-r from-blue-600 to-blue-700 ml-auto' 
                : 'bg-gradient-to-r from-gray-800 to-gray-900 mr-auto border border-gray-700'
            }`}
          >
            <div className="flex items-start">
              {msg.role === 'assistant' && (
                <div className="bg-purple-500 rounded-full w-6 h-6 flex items-center justify-center mr-2 mt-1 flex-shrink-0">
                  <span className="text-xs">AI</span>
                </div>
              )}
              <div className="whitespace-pre-wrap">{msg.content}</div>
            </div>
          </div>
        ))}
        
        {loading && (
          <div className="flex items-center justify-center space-x-2 text-blue-400">
            <div className="w-2 h-2 rounded-full bg-current animate-bounce"></div>
            <div className="w-2 h-2 rounded-full bg-current animate-bounce delay-100"></div>
            <div className="w-2 h-2 rounded-full bg-current animate-bounce delay-200"></div>
            <span className="ml-2">답변을 생성 중입니다...</span>
          </div>
        )}
      </main>

      <footer className="p-6 bg-gray-900/50 backdrop-blur-sm border-t border-gray-800">
        <div className="max-w-4xl mx-auto flex gap-3">
          <input
            className="flex-1 p-4 rounded-xl bg-gray-800 text-white border border-gray-700 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/30 transition-all"
            placeholder="메시지를 입력하세요..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          />
          <button 
            onClick={handleSend} 
            disabled={loading}
            className="bg-gradient-to-r from-purple-600 to-blue-600 px-6 py-3 rounded-xl hover:from-purple-700 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg hover:shadow-purple-500/20"
          >
            {loading ? '전송 중...' : '전송'}
          </button>
        </div>
        <div className="text-center text-xs text-gray-500 mt-3">
          LuvRemi GPT는 실험적인 AI 챗봇입니다. 정확하지 않은 정보를 제공할 수 있습니다.
        </div>
      </footer>
    </div>
  );
}
