import { useState, useRef, useEffect } from 'react'
import { sendChatMessage } from '../../api/chat.api'
import ReactMarkdown from 'react-markdown'

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<{ role: 'user' | 'model', parts: [{ text: string }] }[]>([])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  // Initial welcome message
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      setMessages([{ role: 'model', parts: [{ text: 'Hello! I am the PC Store AI assistant. How can I help you today?' }] }])
    }
  }, [isOpen])

  const handleSend = async (e?: React.FormEvent) => {
    e?.preventDefault()
    if (!input.trim() || isLoading) return

    const userMessage = input.trim()
    setInput('')
    
    // Add user message to UI
    const newMessages: any = [...messages, { role: 'user', parts: [{ text: userMessage }] }]
    setMessages(newMessages)
    setIsLoading(true)

    try {
      // Prepare history format for Gemini API
      // Gemini requires history to start with a 'user' message, so we filter out the local initial welcome message.
      const history = newMessages
        .slice(0, -1)
        .filter((msg: any, index: number) => !(index === 0 && msg.role === 'model'))
        .map((msg: any) => ({
          role: msg.role,
          parts: msg.parts
        }))

      const res = await sendChatMessage(userMessage, history)
      const aiResponse = res.data.result

      setMessages([...newMessages, { role: 'model', parts: [{ text: aiResponse }] }])
    } catch (error) {
      console.error('Chat error:', error)
      setMessages([...newMessages, { role: 'model', parts: [{ text: 'Sorry, I am having trouble connecting to the server. Please try again later.' }] }])
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className='fixed bottom-6 right-6 z-50 font-sans'>
      {/* Chat Window */}
      {isOpen && (
        <div className='absolute bottom-20 right-0 w-[350px] sm:w-[400px] h-[500px] bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden border border-gray-200 animate-scale-up origin-bottom-right'>
          {/* Header */}
          <div className='bg-gradient-to-r from-blue-600 to-indigo-600 p-4 flex items-center justify-between shadow-md z-10'>
            <div className='flex items-center gap-3'>
              <div className='w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-xl shadow-inner'>
                🤖
              </div>
              <div>
                <h3 className='text-white font-bold text-base leading-tight'>PC Store AI</h3>
                <p className='text-blue-100 text-xs font-medium'>Online 24/7</p>
              </div>
            </div>
            <button 
              onClick={() => setIsOpen(false)}
              className='w-8 h-8 flex items-center justify-center text-white/80 hover:text-white hover:bg-white/20 rounded-full transition'
            >
              <svg className='w-5 h-5' fill='none' stroke='currentColor' viewBox='0 0 24 24'><path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M6 18L18 6M6 6l12 12'/></svg>
            </button>
          </div>

          {/* Messages Area */}
          <div className='flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50'>
            {messages.map((msg, idx) => (
              <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                {msg.role === 'model' && (
                  <div className='w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-sm mr-2 shrink-0 self-end mb-1'>🤖</div>
                )}
                <div 
                  className={`max-w-[75%] px-4 py-2.5 rounded-2xl text-sm leading-relaxed shadow-sm
                    ${msg.role === 'user' 
                      ? 'bg-blue-600 text-white rounded-br-sm' 
                      : 'bg-white text-gray-800 rounded-bl-sm border border-gray-100'
                    }`}
                >
                  {msg.role === 'model' ? (
                    <div className='prose prose-sm prose-p:my-1 prose-ul:my-1 max-w-none'>
                      <ReactMarkdown>{msg.parts[0].text}</ReactMarkdown>
                    </div>
                  ) : (
                    msg.parts[0].text
                  )}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className='flex justify-start'>
                <div className='w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-sm mr-2 shrink-0 self-end mb-1'>🤖</div>
                <div className='bg-white text-gray-800 px-4 py-3 rounded-2xl rounded-bl-sm border border-gray-100 shadow-sm flex gap-1.5 items-center'>
                  <span className='w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.3s]'></span>
                  <span className='w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.15s]'></span>
                  <span className='w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce'></span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <form onSubmit={handleSend} className='p-3 bg-white border-t border-gray-200 flex gap-2'>
            <input 
              type='text' 
              value={input}
              onChange={e => setInput(e.target.value)}
              placeholder='Type your message...'
              disabled={isLoading}
              className='flex-1 bg-gray-100 border-transparent focus:bg-white focus:border-blue-500 border rounded-full px-4 py-2.5 text-sm outline-none transition disabled:opacity-50'
            />
            <button 
              type='submit'
              disabled={!input.trim() || isLoading}
              className='w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center hover:bg-blue-700 transition shadow-sm disabled:opacity-50 shrink-0'
            >
              <svg className='w-4 h-4 ml-0.5' fill='none' stroke='currentColor' viewBox='0 0 24 24'><path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M12 19l9 2-9-18-9 18 9-2zm0 0v-8'/></svg>
            </button>
          </form>
        </div>
      )}

      {/* Floating Toggle Button */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className={`w-14 h-14 rounded-full flex items-center justify-center shadow-2xl transition-all duration-300 hover:scale-110 ${isOpen ? 'bg-gray-800 text-white rotate-90' : 'bg-blue-600 text-white'}`}
      >
        {isOpen ? (
          <svg className='w-6 h-6' fill='none' stroke='currentColor' viewBox='0 0 24 24'><path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M6 18L18 6M6 6l12 12'/></svg>
        ) : (
          <svg className='w-6 h-6' fill='none' stroke='currentColor' viewBox='0 0 24 24'><path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z'/></svg>
        )}
      </button>
    </div>
  )
}
