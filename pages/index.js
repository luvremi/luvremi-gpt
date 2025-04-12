import { useState, useEffect } from 'react';

export default function Home() {
  const [history, setHistory] = useState([]);
  const [output, setOutput] = useState('');
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [theme, setTheme] = useState('dark');
  const [pinned, setPinned] = useState(null);
  const [animatedOutput, setAnimatedOutput] = useState('');

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  useEffect(() => {
    if (!loading && output) {
      let index = 0;
      setAnimatedOutput('');
      const interval = setInterval(() => {
        setAnimatedOutput((prev) => prev + output[index]);
        index++;
        if (index >= output.length) clearInterval(interval);
      }, 20);
      return () => clearInterval(interval);
    }
  }, [output, loading]);

  const handleGenerate = async () => {
    if (!input.trim()) return;
    setLoading(true);

    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ input }),
      });
      const data = await res.json();
      const result = data.result;
      setOutput(result);
      setHistory((prev) => [...prev, { prompt: input, result }]);
    } catch (err) {
      setOutput('에러 발생: ' + err.message);
    }

    setLoading(false);
  };

  const handleExport = () => {
    const element = document.createElement('a');
    const file = new Blob([output], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = 'gpt_output.txt';
    document.body.appendChild(element);
    element.click();
  };

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  const handleLoadHistory = (item) => {
    setOutput(item.result);
  };

  const handleDeleteHistory = (index) => {
    setHistory((prev) => prev.filter((_, i) => i !== index));
  };

  const handlePin = (index) => {
    setPinned(index);
  };

  return (
    <div className={`min-h-screen ${theme === 'dark' ? 'bg-[#1e1e1e] text-white' : 'bg-white text-black'} flex flex-col`}>
      <div className="max-w-7xl w-full mx-auto p-6">
        {/* 상단 헤더 */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Remi's GPT 소설 생성기 📖</h1>
          <div className="space-x-2">
            <button onClick={toggleTheme} className="px-3 py-1 rounded bg-gray-300 dark:bg-gray-700">
              테마 전환
            </button>
            <button onClick={handleExport} className="px-3 py-1 rounded bg-blue-500 text-white">저장</button>
          </div>
        </div>

        {/* 본문 레이아웃 */}
        <div className="flex flex-col lg:flex-row gap-6">
          {/* 왼쪽: 출력 + 입력 */}
          <div className="flex-1 flex flex-col">
            <div className="h-[400px] bg-gray-100 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg p-6 overflow-y-auto mb-6">
              <pre className="whitespace-pre-wrap text-lg font-serif">
                {loading ? 'GPT가 소설을 작성 중입니다...' : animatedOutput || '여기에 소설이 출력됩니다.'}
              </pre>
            </div>
            <div className="flex gap-2">
              <input
                className="flex-1 p-3 rounded bg-gray-200 dark:bg-gray-800 text-black dark:text-white"
                placeholder="프롬프트를 입력하세요..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleGenerate()}
              />
              <button onClick={handleGenerate} className="bg-green-600 px-4 py-2 rounded text-white hover:bg-green-700">
                생성하기
              </button>
            </div>
          </div>

          {/* 오른쪽: 생성 내역 */}
          {history.length > 0 && (
            <div className="w-full lg:w-[300px]">
              <h2 className="text-lg font-semibold mb-2">📚 생성 내역</h2>
              <ul className="space-y-2">
                {history.map((item, idx) => (
                  <li key={idx} className={`p-3 rounded flex justify-between items-center ${pinned === idx ? 'bg-yellow-300 dark:bg-yellow-600' : 'bg-gray-200 dark:bg-gray-800'}`}>
                    <button onClick={() => handleLoadHistory(item)} className="text-left w-full mr-2 text-sm hover:underline">
                      {item.prompt.slice(0, 30)}...
                    </button>
                    <div className="flex gap-1">
                      <button onClick={() => handlePin(idx)} className="text-yellow-500 text-xs">📌</button>
                      <button onClick={() => handleDeleteHistory(idx)} className="text-red-500 text-xs">🗑</button>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
