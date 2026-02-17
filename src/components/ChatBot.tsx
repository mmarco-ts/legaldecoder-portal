import { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Minimize2, Send, Scale } from 'lucide-react';
import { useSpotterAgent, SpotterMessage } from '@thoughtspot/visual-embed-sdk/react';
import '../lib/thoughtspot';

interface TextMessage {
  id: string;
  type: 'user' | 'bot' | 'system';
  content: string;
  timestamp: Date;
}

interface SpotterResponseMessage {
  id: string;
  type: 'spotter';
  query: string;
  message: {
    worksheetId: string;
    convId: string;
    messageId: string;
    sessionId: string;
    genNo: number;
    acSessionId: string;
    acGenNo: number;
  };
  timestamp: Date;
}

type Message = TextMessage | SpotterResponseMessage;

const DATA_QUESTION_KEYWORDS = [
  'show', 'display', 'chart', 'graph', 'compare', 'comparison',
  'how much', 'how many', 'what is the', 'what are the',
  'total', 'sum', 'average', 'avg', 'count', 'number of',
  'top', 'bottom', 'highest', 'lowest', 'best', 'worst',
  'by firm', 'by law firm', 'by timekeeper', 'by matter',
  'breakdown', 'distribution', 'trend', 'over time',
  'invoices', 'invoice', 'billing', 'amount', 'hours',
  'flags', 'flagged', 'compliance', 'write-down', 'writedown',
  'vs', 'versus', 'compared to', 'relative to',
  'percentage', 'ratio', 'proportion', '%',
  'list', 'rank', 'sort', 'order by',
  'per', 'each', 'all', 'every',
  'quarterly', 'monthly', 'yearly', 'annual', 'weekly', 'daily',
  'performance', 'metrics', 'kpi', 'statistics',
  'discount', 'rate', 'spend', 'cost'
];

const GENERAL_QUESTION_KEYWORDS = [
  'tell me about', 'explain', 'what does', 'what is',
  'describe', 'help me understand', 'can you explain',
  'why', 'how does this work', 'what should',
  'meaning of', 'definition', 'interpret',
  'suggest', 'recommend', 'advice', 'should i',
  'hello', 'hi', 'hey', 'thanks', 'thank you',
  'who', 'when was', 'where is'
];

function classifyQuestion(question: string): { isDataQuestion: boolean; confidence: number } {
  const lowerQuestion = question.toLowerCase();
  let dataScore = 0;
  let generalScore = 0;
  
  for (const keyword of DATA_QUESTION_KEYWORDS) {
    if (lowerQuestion.includes(keyword)) dataScore += 1;
  }
  for (const keyword of GENERAL_QUESTION_KEYWORDS) {
    if (lowerQuestion.includes(keyword)) generalScore += 1;
  }
  if (lowerQuestion.match(/\d+/) || lowerQuestion.includes('$')) dataScore += 1;
  if (lowerQuestion.length < 15) generalScore += 1;
  
  const totalScore = dataScore + generalScore;
  const isDataQuestion = dataScore > generalScore;
  const confidence = totalScore > 0 ? Math.max(dataScore, generalScore) / totalScore : 0.5;
  return { isDataQuestion, confidence };
}

function generateTextResponse(question: string): string {
  const lowerQuestion = question.toLowerCase();
  
  if (lowerQuestion.match(/^(hi|hello|hey|good morning|good afternoon)/)) {
    return "Hello! I'm your Legal Decoder Analytics assistant. I can help you explore invoice compliance data.\n\nTry asking me:\n\u2022 \"Show me total billing by law firm\"\n\u2022 \"What are the top flagged invoices?\"\n\u2022 \"Show me potential write-downs by flag type\"\n\nOr ask me to explain metrics and insights.";
  }
  
  if (lowerQuestion.match(/(thanks|thank you)/)) {
    return "You're welcome! Let me know if you have any other questions about your legal spend data.";
  }
  
  if (lowerQuestion.includes('tell me about') || lowerQuestion.includes('explain') || lowerQuestion.includes('what is')) {
    if (lowerQuestion.includes('data') || lowerQuestion.includes('portal')) {
      return "This portal provides comprehensive legal spend analytics:\n\n\u2696\uFE0F **Compliance Flagging**: 48 automated flags across 3 categories\n\uD83D\uDCCA **Invoice Analysis**: Track billing amounts, hours, and rates\n\uD83D\uDCB0 **Write-Down Analysis**: Identify potential savings\n\uD83D\uDD0D **Firm Performance**: Compare law firms and timekeepers\n\nTry asking a specific question like \"Show top flagged invoices by amount\" to see visualizations.";
    }
    if (lowerQuestion.includes('flag') || lowerQuestion.includes('compliance')) {
      return "**Compliance Flags** are automated markers that identify potential billing issues:\n\n\u2022 **Billing Hygiene**: Vague entries, block billing, duplicate charges\n\u2022 **Workflow**: Excessive time, unnecessary tasks\n\u2022 **Staffing Efficiencies**: Wrong-level staffing, rate issues\n\nEach flag carries a discount percentage. The highest discount per line item drives the potential write-down.\n\nWant to see the data? Ask \"Show flagged amounts by flag type\".";
    }
    if (lowerQuestion.includes('write-down') || lowerQuestion.includes('writedown') || lowerQuestion.includes('discount')) {
      return "**Potential Write-Down** is the key savings metric:\n\nFormula: Invoice Line Amount x Highest Discount %\n\nFor each invoice line, we take the flag with the highest discount percentage and calculate the potential reduction.\n\nThis represents how much the client could save on their legal bills.\n\nAsk \"Show potential write-downs by law firm\" to see the data.";
    }
  }
  
  if (lowerQuestion.includes('help') || lowerQuestion.includes('what can you do')) {
    return "I can help you with:\n\n\uD83D\uDCCA **Data Questions** - Ask me to show charts and comparisons:\n\u2022 \"Show me billing by law firm\"\n\u2022 \"What are the top flagged invoices?\"\n\u2022 \"Compare write-downs by flag category\"\n\n\uD83D\uDCA1 **Insights** - Ask me to explain metrics:\n\u2022 \"What is a compliance flag?\"\n\u2022 \"Explain potential write-downs\"\n\n\uD83D\uDD0D **Analysis** - Explore your legal spend data:\n\u2022 \"Which firms have the most flags?\"\n\u2022 \"Show billing trends over time\"";
  }
  
  return "I can help answer questions about your legal spend data.\n\nFor **data visualizations**, try:\n\u2022 \"Show billing by law firm\"\n\u2022 \"Top flagged invoice lines by amount\"\n\nFor **explanations**, try:\n\u2022 \"What are compliance flags?\"\n\u2022 \"Explain write-down calculations\"\n\nWhat would you like to know?";
}

export default function ChatBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const chatMessagesRef = useRef<HTMLDivElement>(null);

  const { sendMessage } = useSpotterAgent({
    worksheetId: 'e94d24f4-a2ad-48b2-ab43-b83549c43017',
  });

  useEffect(() => {
    if (isOpen && !isMinimized && messages.length === 0) {
      setMessages([{
        id: 'welcome',
        type: 'bot',
        content: "Hello! I'm your Legal Decoder Analytics assistant. \u2696\uFE0F\n\nTry asking:\n\u2022 \"Show me total billing by law firm\"\n\u2022 \"What are the top flagged invoices?\"\n\u2022 \"Show potential write-downs\"",
        timestamp: new Date(),
      }]);
    }
  }, [isOpen, isMinimized, messages.length]);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
    return () => clearTimeout(timeoutId);
  }, [messages]);

  useEffect(() => {
    if (isOpen && !isMinimized) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen, isMinimized]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim() || isLoading) return;
    
    const userMessage: TextMessage = {
      id: `user-${Date.now()}`,
      type: 'user',
      content: inputValue.trim(),
      timestamp: new Date(),
    };
    
    setMessages(prev => [...prev, userMessage]);
    const question = inputValue.trim();
    setInputValue('');
    setIsLoading(true);
    
    try {
      const { isDataQuestion } = classifyQuestion(question);
      
      if (isDataQuestion) {
        try {
          const result = await sendMessage(question);
          
          if (result.error) {
            const textResponse = generateTextResponse(question);
            const botMessage: TextMessage = {
              id: `bot-${Date.now()}`,
              type: 'bot',
              content: `I couldn't query the data: ${result.error}\n\n${textResponse}`,
              timestamp: new Date(),
            };
            setMessages(prev => [...prev, botMessage]);
          } else if (result.message) {
            const spotterMessage: SpotterResponseMessage = {
              id: `spotter-${Date.now()}`,
              type: 'spotter',
              query: result.query || question,
              message: result.message,
              timestamp: new Date(),
            };
            setMessages(prev => [...prev, spotterMessage]);
          } else {
            const textResponse = generateTextResponse(question);
            const botMessage: TextMessage = {
              id: `bot-${Date.now()}`,
              type: 'bot',
              content: textResponse,
              timestamp: new Date(),
            };
            setMessages(prev => [...prev, botMessage]);
          }
        } catch (spotterError: unknown) {
          const errorMsg = spotterError instanceof Error ? spotterError.message : 'Unknown error';
          const textResponse = generateTextResponse(question);
          const botMessage: TextMessage = {
            id: `bot-${Date.now()}`,
            type: 'bot',
            content: `Sorry, I couldn't query the data (${errorMsg}).\n\n${textResponse}`,
            timestamp: new Date(),
          };
          setMessages(prev => [...prev, botMessage]);
        }
      } else {
        const textResponse = generateTextResponse(question);
        const botMessage: TextMessage = {
          id: `bot-${Date.now()}`,
          type: 'bot',
          content: textResponse,
          timestamp: new Date(),
        };
        setMessages(prev => [...prev, botMessage]);
      }
    } catch (error) {
      console.error('Error processing message:', error);
      const errorMessage: TextMessage = {
        id: `error-${Date.now()}`,
        type: 'system',
        content: 'Sorry, something went wrong. Please try again.',
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggle = () => {
    if (isMinimized) {
      setIsMinimized(false);
    } else {
      setIsOpen(!isOpen);
    }
  };

  const handleMinimize = () => {
    setIsMinimized(true);
  };

  const handleClose = () => {
    setIsOpen(false);
    setIsMinimized(false);
    setMessages([]);
  };

  const renderMessageContent = (content: string) => {
    const parts = content.split('\n');
    return parts.map((part, index) => {
      let formatted = part.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
      if (formatted.startsWith('\u2022 ') || formatted.startsWith('- ')) {
        formatted = `<span style="display: block; padding-left: 8px;">${formatted}</span>`;
      }
      return (
        <span 
          key={index} 
          dangerouslySetInnerHTML={{ __html: formatted }}
          style={{ display: 'block', marginBottom: part === '' ? '8px' : '2px' }}
        />
      );
    });
  };

  return (
    <>
      {isOpen && !isMinimized && (
        <div className="chatbot-panel">
          <div className="chatbot-header">
            <div className="chatbot-title">
              <Scale size={18} />
              <span>Legal Analytics Assistant</span>
            </div>
            <div className="chatbot-actions">
              <button className="chatbot-action-btn" onClick={handleMinimize} aria-label="Minimize">
                <Minimize2 size={16} />
              </button>
              <button className="chatbot-action-btn" onClick={handleClose} aria-label="Close">
                <X size={16} />
              </button>
            </div>
          </div>
          
          <div className="chatbot-messages" ref={chatMessagesRef}>
            {messages.map((message) => {
              if (message.type === 'spotter') {
                return (
                  <div key={message.id} className="chatbot-message bot spotter-response">
                    <div className="chatbot-bubble bot spotter-intro">
                      <span>Here's what I found for: "{message.query}"</span>
                    </div>
                    <div className="spotter-message-container">
                      <SpotterMessage 
                        message={message.message}
                        query={message.query}
                      />
                    </div>
                  </div>
                );
              }
              
              return (
                <div
                  key={message.id}
                  data-message-id={message.id}
                  className={`chatbot-message ${message.type}`}
                >
                  <div className={`chatbot-bubble ${message.type}`}>
                    {renderMessageContent(message.content)}
                  </div>
                </div>
              );
            })}
            
            {isLoading && (
              <div className="chatbot-message bot">
                <div className="chatbot-bubble bot">
                  <div className="chatbot-typing">
                    <span></span>
                    <span></span>
                    <span></span>
                  </div>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>
          
          <form className="chatbot-input-area" onSubmit={handleSubmit}>
            <input
              ref={inputRef}
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Ask about your legal spend data..."
              disabled={isLoading}
              className="chatbot-input"
            />
            <button 
              type="submit" 
              disabled={!inputValue.trim() || isLoading}
              className="chatbot-send-btn"
            >
              <Send size={18} />
            </button>
          </form>
        </div>
      )}

      <button 
        className={`chatbot-fab ${isOpen && !isMinimized ? 'active' : ''}`}
        onClick={handleToggle}
        aria-label="Open Legal Analytics Assistant"
      >
        {isOpen && !isMinimized ? (
          <X size={24} />
        ) : (
          <>
            <MessageCircle size={24} />
            {!isOpen && <span className="chatbot-fab-badge">AI</span>}
          </>
        )}
      </button>
    </>
  );
}
