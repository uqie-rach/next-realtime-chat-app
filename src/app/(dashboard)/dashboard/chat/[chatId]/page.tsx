import { getServerSession } from "next-auth";
import Image from "next/image";
import { notFound } from "next/navigation";

import { fetchRedis } from "@/helpers/redis";
import { authOptions } from "@/lib/auth";
import { Message, messageArrayValidator } from "@/lib/validations/message";
import ChatInput from "@/components/ChatInput";
import Messages from "@/components/Messages";

interface IChatPageProps {
  params: {
    chatId: string;
  }
}

async function getChatMessages(chatId: string) {
  try {
    // Fetch messages from Redis
    const result = await fetchRedis(
      'zrange',
      `chat:${chatId}:messages`,
      0,
      -1
    )

    // Parse the messages
    const dbMessages = result.map((message: string) => JSON.parse(message) as Message)

    // Reverse the messages
    const reversedMessages = dbMessages.reverse()

    // Validate the messages
    const messages = messageArrayValidator.parse(reversedMessages)

    return messages
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error) {
    notFound()
  }
}

const page = async ({ params }: IChatPageProps) => {
  // Extract the chatId from the params
  const { chatId } = params

  // Auth
  const session = await getServerSession(authOptions)
  if (!session) notFound()

  // Extract payload from session
  const { user } = session

  // Split the chatId into two userIds
  const [userId1, userId2] = chatId.split('--')

  // Check if the user is part of the chat
  if (userId1 !== user.id && userId2 !== user.id) notFound()

  // Set partner chatId
  const partnerChatId = userId1 === user.id ? userId2 : userId1

  //
  const chatPartnerRaw = (await fetchRedis('get', `user:${partnerChatId}`)) as string
  const chatPartner = JSON.parse(chatPartnerRaw)

  // Retrieve initial messages
  const initialMessages = await getChatMessages(chatId)

  return (
    <div className='flex-1 justify-between flex flex-col h-full max-h-[calc(100vh-6rem)]'>
      <div className='flex sm:items-center justify-between py-3 border-b-2 border-gray-200'>
        <div className='relative flex items-center space-x-4'>
          <div className='relative'>
            <div className='relative w-8 sm:w-12 h-8 sm:h-12'>
              <Image
                fill
                referrerPolicy='no-referrer'
                src={chatPartner.image}
                alt={`${chatPartner.name} profile picture`}
                className='rounded-full'
              />
            </div>
          </div>

          <div className='flex flex-col leading-tight'>
            <div className='text-xl flex items-center'>
              <span className='text-gray-700 mr-3 font-semibold'>
                {chatPartner.name}
              </span>
            </div>

            <span className='text-sm text-gray-600'>{chatPartner.email}</span>
          </div>
        </div>
      </div>

      <Messages
        chatId={chatId}
        chatPartner={chatPartner}
        sessionImg={session.user.image}
        sessionId={session.user.id}
        initialMessages={initialMessages}
      />
      <ChatInput chatId={chatId} chatPartner={chatPartner} />
    </div>)
}

export default page;
