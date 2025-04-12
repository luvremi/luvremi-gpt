import { useState } from 'react'

export default function Home() {
  const [input, setInput] = useState('')
  const [output, setOutput] = useState('')
  const [loading, setLoading] = useState(false)
  const [authenticated, setAuthenticated] = useState(false)
  const [password, setPassword] = useState('')

  const handleAuth = () => {
    if (password === process.env.NEXT_PUBLIC_SITE_PASSWORD) {
      setAuthenticated(true)
    } else {
      alert('비밀번호가 틀렸습니다')
    }
  }

  const handleGenerate = async () => {
    setLoading(true)
    setOutput('')
    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ input })
      })
      const data = await res.json()
      setOutput(data.result)
    } catch (e) {
      setOutput('에러 발생: ' + e.message)
    }
    setLoading(false)
  }

  if (!authenticated) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
        <h1 className="text-xl font-semibold mb-4">비공개 GPT 포털</h1>
        <input
          type="password"
          placeholder="비밀번호 입력"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="p-2 rounded border"
        />
        <button onClick={handleAuth} className="mt-4 bg-black text-white px-4 py-2 rounded">
          접속하기
        </button>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white p-8">
      <h1 className="text-2xl font-bold mb-6">나만의 GPT-4o 소설 생성기 ✨</h1>
      <textarea
        rows={4}
        className="w-full border p-2 rounded mb-4"
        placeholder="프롬프트 입력 (예: 어두운 숲에서 그녀는...)"
        value={input}
        onChange={(e) => setInput(e.target.value)}
      />
      <button
        onClick={handleGenerate}
        className="bg-blue-600 text-white px-4 py-2 rounded"
        disabled={loading}
      >
        {loading ? '생성 중...' : 'GPT-4o로 생성'}
      </button>
      {output && (
        <div className="mt-6 whitespace-pre-wrap border p-4 rounded bg-gray-50">
          {output}
        </div>
      )}
    </div>
  )
}
