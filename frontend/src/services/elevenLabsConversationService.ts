// src/services/elevenLabsConversationService.ts
import { Conversation } from '@elevenlabs/client';

const TEST_AGENT_ID = 'agent_9301kc7b1k14f5wv01kazanwv5hs';

export type ConversationInstance = Awaited<
  ReturnType<typeof Conversation.startSession>
>;

export async function startPublicAgentConversation(
  agentId: string = TEST_AGENT_ID
): Promise<ConversationInstance> {
  // Ask for mic permission first
  await navigator.mediaDevices.getUserMedia({ audio: true });

  const conversation = await Conversation.startSession({
    agentId,
    connectionType: 'webrtc', // or 'websocket'
  });

  return conversation;
}

export async function endAgentConversation(
  conversation: ConversationInstance | null,
) {
  if (!conversation) return;
  await conversation.endSession();
}
