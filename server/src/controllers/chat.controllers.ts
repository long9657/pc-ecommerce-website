import { Request, Response } from 'express'
import { GoogleGenerativeAI } from '@google/generative-ai'
import database from '../services/database.services'

export const chatController = async (req: Request, res: Response) => {
  try {
    const { message, history } = req.body

    if (!message) {
      return res.status(400).json({ message: 'Message is required' })
    }

    const apiKey = process.env.GEMINI_API_KEY
    if (!apiKey) {
      return res.status(500).json({ message: 'GEMINI_API_KEY is not configured in the environment' })
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

    const genAI = new GoogleGenerativeAI(apiKey)
    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash', systemInstruction })

    const chat = model.startChat({
      history: history || []
    })

    const result = await chat.sendMessage(message)
    const responseText = result.response.text()

    return res.status(200).json({
      message: 'Success',
      result: responseText
    })

  } catch (error: any) {
    console.error('Chat API Error:', error)
    return res.status(500).json({ message: error.message || 'Internal Server Error' })
  }
}
