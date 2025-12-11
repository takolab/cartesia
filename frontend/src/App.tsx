import { useState } from 'react';
import { Layout, Typography, Input, Button, Space, Card, message } from 'antd';

import {
  startPublicAgentConversation,
  endAgentConversation,
} from './services/elevenLabsConversationService';
import type { ConversationInstance } from './services/elevenLabsConversationService';

const { Header, Content } = Layout;
const { Title, Text } = Typography;
const { TextArea } = Input;

function App() {
  const [query, setQuery] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [conversation, setConversation] = useState<ConversationInstance | null>(null);

  const handleToggleConversation = async () => {
    // If already connected → end conversation
    if (conversation) {
      try {
        await endAgentConversation(conversation);
        setConversation(null);
        message.info('Conversation ended.');
      } catch (error) {
        console.error(error);
        message.error('Failed to end conversation.');
      }
      return;
    }

    if (!query.trim()) {
      message.warning('You can describe your intent, or just start talking.');
    }

    setIsSubmitting(true);
    try {
      const conv = await startPublicAgentConversation();
      setConversation(conv);
      message.success('Connected to agent. Start speaking!');
    } catch (error) {
      console.error(error);
      message.error('Failed to start conversation. Check console for details.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Header style={{ display: 'flex', alignItems: 'center' }}>
        <Title level={3} style={{ color: '#fff', margin: 0 }}>
          Conversational Agent Studio
        </Title>
      </Header>

      <Content style={{ padding: 24, display: 'flex', justifyContent: 'center' }}>
        <Card
          style={{ maxWidth: 720, width: '100%' }}
          title="Describe who you want to talk to & why"
        >
          <Space direction="vertical" size="middle" style={{ width: '100%' }}>
            <Text type="secondary">
              Example: <i>“I want to talk to Elon Musk about investments”</i>
            </Text>

            <TextArea
              autoSize={{ minRows: 3, maxRows: 6 }}
              placeholder="Type your query here..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />

            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <Button
                type={conversation ? 'default' : 'primary'}
                danger={!!conversation}
                loading={isSubmitting}
                onClick={handleToggleConversation}
              >
                {conversation ? 'End conversation' : 'Start conversation'}
              </Button>
            </div>
          </Space>
        </Card>
      </Content>
    </Layout>
  );
}

export default App;
