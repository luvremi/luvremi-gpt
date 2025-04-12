import { useState } from 'react';

export default function SquareChatbot() {
  const [messages, setMessages] = useState([
    { role: 'assistant', content: '안녕하세요! LuvRemi 챗봇입니다. 무엇이든 물어보세요.' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSend = async () => {
    if (!input.trim()) return;
    
    const userMessage = { role: 'user', content: input };
    setMessages([...messages, userMessage]);
    setInput('');
    setLoading(true);

    try {
      // API 호출 시뮬레이션
      await new Promise(resolve => setTimeout(resolve, 1000));
      const botResponse = { role: 'assistant', content: `${input}에 대한 답변입니다. 더 자세한 정보가 필요하시면 말씀해주세요.` };
      setMessages(prev => [...prev, botResponse]);
    } catch (e) {
      setMessages(prev => [...prev, { role: 'assistant', content: '오류가 발생했습니다: ' + e.message }]);
    }

    setLoading(false);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 p-4">
      {/* 네모난 챗봇 창 */}
      <div className="w-full max-w-md h-[500px] bg-white rounded-lg shadow-xl flex flex-col border border-gray-300 overflow-hidden">
        
        {/* 헤더 */}
        <div className="bg-blue-600 p-4 text-white">
          <h2 className="text-lg font-bold">LuvRemi 챗봇</h2>
          <p className="text-xs opacity-80">실시간 AI 어시스턴트</p>
        </div>
        
        {/* 채팅 내용 영역 */}
        <div className="flex-1 p-4 overflow-y-auto bg-gray-50">
          <div className="space-y-3">
            {messages.map((msg, idx) => (
              <div 
                key={idx} 
                className={`max-w-[80%] p-3 rounded-lg ${msg.role === 'user' 
                  ? 'bg-blue-500 text-white ml-auto rounded-br-none' 
                  : 'bg-gray-200 text-gray-800 mr-auto rounded-bl-none'}`}
              >
                {msg.content}
              </div>
            ))}
            {loading && (
              <div className="mr-auto max-w-[80%] p-3 bg-gray-200 rounded-lg rounded-bl-none">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce delay-100"></div>
                  <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce delay-200"></div>
                </div>
              </div>
            )}
          </div>
        </div>
        
        {/* 입력 영역 */}
        <div className="p-3 border-t border-gray-300 bg-white">
          <div className="flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder="메시지를 입력하세요..."
              className="flex-1 p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <button
              onClick={handleSend}
              disabled={loading}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 rounded disabled:opacity-50"
            >
              전송
            </button>
          </div>
          <p className="text-xs text-gray-500 mt-1 text-center">
            Enter 키로 전송할 수 있습니다
          </p>
        </div>
      </div>
    </div>
  );
}
