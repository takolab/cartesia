import { useState } from 'react';
import { Layout, Typography, Input, Button, Space, Card } from 'antd';

const { Header, Content } = Layout;
const { Title, Text } = Typography;
const { TextArea } = Input;

function App() {
  const [query, setQuery] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleStartWorkflow = async () => {
    if (!query.trim()) return;

    setIsSubmitting(true);

    // 🔧 TODO: replace this with real API call to your backend
    console.log('Trigger workflow with query:', query);

    // simulate a delay for now
    await new Promise((resolve) => setTimeout(resolve, 800));

    setIsSubmitting(false);
    // later: navigate to dashboard view, store workflow_id, etc.
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
                type="primary"
                loading={isSubmitting}
                onClick={handleStartWorkflow}
                disabled={!query.trim()}
              >
                Start workflow
              </Button>
            </div>
          </Space>
        </Card>
      </Content>
    </Layout>
  );
}

export default App;
