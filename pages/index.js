import { useState } from 'react';

export default function NovelPlatform() {
  const [chapters, setChapters] = useState([
    { id: 1, title: "프롤로그", content: "어느 추운 겨울날, 모든 것이 시작되었다...", wordCount: 245 },
    { id: 2, title: "1장. 만남", content: "그는 파란 눈의 소녀를 처음 본 순간을 결코 잊지 못할 것이라 생각했다...", wordCount: 512 },
  ]);
  const [currentChapter, setCurrentChapter] = useState(null);
  const [isWriting, setIsWriting] = useState(false);
  const [newChapterTitle, setNewChapterTitle] = useState('');
  const [aiPrompt, setAiPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  const startNewChapter = () => {
    setIsWriting(true);
    setCurrentChapter({
      id: chapters.length + 1,
      title: newChapterTitle,
      content: '',
      wordCount: 0
    });
    setNewChapterTitle('');
  };

  const saveChapter = () => {
    if (currentChapter) {
      setChapters([...chapters, currentChapter]);
      setIsWriting(false);
      setCurrentChapter(null);
    }
  };

  const generateWithAI = async () => {
    if (!aiPrompt.trim()) return;
    setIsGenerating(true);
    
    try {
      const res = await fetch('/api/generate-story', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: aiPrompt })
      });
      const data = await res.json();
      setCurrentChapter(prev => ({
        ...prev,
        content: prev.content + "\n\n" + data.result
      }));
    } catch (e) {
      alert('생성 중 오류 발생: ' + e.message);
    }
    
    setIsGenerating(false);
    setAiPrompt('');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-gray-100 flex">
      {/* 사이드바 */}
      <div className="w-64 bg-gray-800/90 border-r border-gray-700 p-4 flex flex-col">
        <h1 className="text-2xl font-bold mb-6 text-center text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">
          LuvRemi Novel
        </h1>
        
        <button 
          onClick={() => { setIsWriting(true); setCurrentChapter(null); }}
          className="mb-6 bg-gradient-to-r from-purple-600 to-pink-600 py-2 px-4 rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all shadow-md"
        >
          + 새 장 쓰기
        </button>
        
        <div className="flex-1 overflow-y-auto">
          <h2 className="text-sm font-semibold text-gray-400 mb-2">챕터 목록</h2>
          <ul className="space-y-2">
            {chapters.map(chapter => (
              <li 
                key={chapter.id}
                onClick={() => { setCurrentChapter(chapter); setIsWriting(true); }}
                className={`p-3 rounded-lg cursor-pointer hover:bg-gray-700/50 transition ${currentChapter?.id === chapter.id ? 'bg-gray-700 border-l-4 border-pink-500' : ''}`}
              >
                <h3 className="font-medium">{chapter.title}</h3>
                <p className="text-xs text-gray-400">{chapter.wordCount}자</p>
              </li>
            ))}
          </ul>
        </div>
        
        <div className="mt-auto pt-4 border-t border-gray-700">
          <div className="text-xs text-gray-400 mb-2">작성 진행도</div>
          <div className="w-full bg-gray-700 rounded-full h-2 mb-2">
            <div className="bg-pink-500 h-2 rounded-full" style={{ width: '30%' }}></div>
          </div>
          <div className="text-xs text-gray-400">총 12,345자 (3장 완료)</div>
        </div>
      </div>
      
      {/* 메인 작공간 */}
      <div className="flex-1 flex flex-col">
        {isWriting ? (
          <>
            <div className="p-6 border-b border-gray-700 bg-gray-800/50">
              <input
                type="text"
                placeholder="챕터 제목을 입력하세요..."
                value={currentChapter?.title || newChapterTitle}
                onChange={(e) => currentChapter 
                  ? setCurrentChapter({...currentChapter, title: e.target.value})
                  : setNewChapterTitle(e.target.value)}
                className="text-2xl font-bold bg-transparent border-none w-full focus:outline-none focus:ring-0 placeholder-gray-500"
              />
              <div className="flex justify-between items-center mt-2">
                <span className="text-sm text-gray-400">
                  {currentChapter?.content.length || 0}자
                </span>
                <div className="flex space-x-2">
                  {!currentChapter && (
                    <button
                      onClick={startNewChapter}
                      disabled={!newChapterTitle.trim()}
                      className="px-4 py-1 bg-gray-700 rounded hover:bg-gray-600 disabled:opacity-50 transition"
                    >
                      시작하기
                    </button>
                  )}
                  {currentChapter && (
                    <>
                      <button
                        onClick={saveChapter}
                        className="px-4 py-1 bg-pink-600 rounded hover:bg-pink-700 transition"
                      >
                        저장하기
                      </button>
                      <button
                        onClick={() => setIsWriting(false)}
                        className="px-4 py-1 bg-gray-700 rounded hover:bg-gray-600 transition"
                      >
                        취소
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
            
            <div className="flex-1 p-6 overflow-y-auto bg-gray-900/20">
              {currentChapter ? (
                <textarea
                  value={currentChapter.content}
                  onChange={(e) => setCurrentChapter({
                    ...currentChapter,
                    content: e.target.value,
                    wordCount: e.target.value.length
                  })}
                  className="w-full h-full bg-transparent resize-none focus:outline-none leading-relaxed text-lg font-serif tracking-wide"
                  placeholder="여기에 당신의 이야기를 펼쳐보세요..."
                  autoFocus
                />
              ) : (
                <div className="text-gray-500 italic">
                  챕터 제목을 입력하고 "시작하기"를 눌러 새 장을 시작하세요.
                </div>
              )}
            </div>
            
            {/* AI 도움 패널 */}
            <div className="p-4 border-t border-gray-700 bg-gray-800/70">
              <div className="max-w-4xl mx-auto">
                <h3 className="text-sm font-semibold text-gray-400 mb-2">AI 작가 도우미</h3>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={aiPrompt}
                    onChange={(e) => setAiPrompt(e.target.value)}
                    placeholder="ex) '사랑에 빠진 기사의 심경 변화를 묘사해줘'"
                    className="flex-1 p-3 rounded-lg bg-gray-700 border border-gray-600 focus:border-pink-500 focus:outline-none"
                    disabled={!currentChapter}
                  />
                  <button
                    onClick={generateWithAI}
                    disabled={!currentChapter || isGenerating}
                    className="bg-gradient-to-r from-purple-600 to-blue-600 px-4 py-3 rounded-lg hover:from-purple-700 hover:to-blue-700 disabled:opacity-50 transition-all"
                  >
                    {isGenerating ? '생성 중...' : '생성하기'}
                  </button>
                </div>
                <div className="mt-2 flex gap-2 overflow-x-auto pb-2">
                  {['다음 장면 제안', '캐릭터 묘사', '감정 표현', '배경 묘사', '플롯 전개'].map((tip) => (
                    <button
                      key={tip}
                      onClick={() => setAiPrompt(tip + " 예시: ")}
                      className="text-xs px-3 py-1 bg-gray-700 rounded-full hover:bg-gray-600 transition"
                    >
                      {tip}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center max-w-lg p-8">
              <h2 className="text-3xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-400">
                당신의 이야기를 세상에
              </h2>
              <p className="text-gray-400 mb-8">
                LuvRemi Novel은 작가를 위한 최적의 창작 환경을 제공합니다. 
                새로운 챕터를 시작하거나 왼쪽에서 기존 작업을 이어가세요.
              </p>
              <button
                onClick={() => { setIsWriting(true); setCurrentChapter(null); }}
                className="bg-gradient-to-r from-purple-600 to-pink-600 py-3 px-8 rounded-full hover:from-purple-700 hover:to-pink-700 transition-all shadow-lg text-lg"
              >
                새 작품 시작하기
              </button>
              
              <div className="mt-12 grid grid-cols-3 gap-4 text-sm">
                {['판타지', '로맨스', '미스터리', 'SF', '역사물', '현대물'].map((genre) => (
                  <div 
                    key={genre} 
                    className="p-3 bg-gray-800 rounded-lg hover:bg-gray-700 cursor-pointer transition border border-gray-700 hover:border-pink-500/30"
                  >
                    {genre}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
