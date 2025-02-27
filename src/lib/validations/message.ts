import { z } from 'zod'

// Define the schema for the message object
export const messageValidator = z.object({
  id: z.string(),
  senderId: z.string(),
  text: z.string(),
  timestamp: z.number(),
})

// Define the schema for the message array
export const messageArrayValidator = z.array(messageValidator)

// Define the type for the message object
export type Message = z.infer<typeof messageValidator>
