import { Request, Response } from 'express'
import database from '../services/database.services'

export const chatController = async (req: Request, res: Response) => {
  try {
    const { message, history } = req.body

    if (!message) {
      return res.status(400).json({ message: 'Message is required' })
    }

    const apiKey = process.env.OPENROUTER_API_KEY || process.env.GEMINI_API_KEY
    if (!apiKey) {
      return res.status(500).json({ message: 'OPENROUTER_API_KEY or GEMINI_API_KEY is not configured in the environment' })
    }

    // Fetch brief product info to feed into the AI prompt
    // We limit to 50 products to avoid exceeding prompt size limits
    const products = await database.products.find({}).limit(50).toArray()
    const productListText = products.map(p => `- ${p.name}: ${p.price}$ (Stock: ${p.quantity}, Sold: ${p.sold})`).join('\n')

    const systemInstruction = `You are a helpful and polite customer support AI for an e-commerce website called "PC Store".
You assist customers in finding PC parts, accessories, and answering general questions about the store.
You communicate mostly in English, but you can reply in Vietnamese if the user asks in Vietnamese. Keep answers short, clear, and friendly.

Here is the current list of products available in the store:
${productListText}

If a user asks for a product not in this list, politely inform them that we do not currently have it in stock.
If they ask about price or stock, refer to the list.`

    // Chuyển đổi format History từ format của Google sang format của OpenAI/OpenRouter
    const formattedHistory = (history || []).map((msg: any) => ({
      role: msg.role === 'model' ? 'assistant' : 'user',
      content: msg.parts[0].text
    }))

    const messages = [
      { role: 'system', content: systemInstruction },
      ...formattedHistory,
      { role: 'user', content: message }
    ]

    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        // Sử dụng tính năng "Auto Router" của OpenRouter:
        // Sẽ tự động chuyển qua lại giữa các model miễn phí nếu một cái bị nghẽn mạng
        model: 'openrouter/free', 
        messages: messages
      })
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new Error(`OpenRouter Error: ${JSON.stringify(errorData)}`)
    }

    const data = await response.json()
    const responseText = data.choices[0].message.content

    return res.status(200).json({
      message: 'Success',
      result: responseText
    })

  } catch (error: any) {
    console.error('Chat API Error:', error)
    return res.status(500).json({ message: error.message || 'Internal Server Error' })
  }
}
