import React from 'react';
import styled from 'styled-components';

const ChatContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  overflow-y: auto;
  padding: 10px;
  background-color: #f4f4f4;
`;

const Message = styled.div<{ isCurrentUser: boolean }>`
  align-self: ${props => props.isCurrentUser ? 'flex-end' : 'flex-start'};
  max-width: 60%;
  margin-bottom: 10px;
  padding: 8px 16px;
  background-color: ${props => props.isCurrentUser ? '#007BFF' : '#e9e9eb'};
  color: ${props => props.isCurrentUser ? 'white' : 'black'};
  border-radius: 12px;
  border-bottom-right-radius: ${props => props.isCurrentUser ? '0' : '12px'};
  border-bottom-left-radius: ${props => props.isCurrentUser ? '12px' : '0'};
`;

const ScrollToBottomButton = styled.button<{ visible: boolean }>`
  display: ${props => props.visible ? 'block' : 'none'};
  position: sticky;
  bottom: 10px;
  align-self: center;
  padding: 8px 16px;
  background-color: #007BFF;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  z-index: 1000;
`;

interface IMessage {
  id: string;
  userId: string;
  text: string;
}

interface ChatViewProps {
  CURRENT_USER_ID: string;
  allChatMessages: IMessage[];
}
const ChatView: React.FC<ChatViewProps> = ({ allChatMessages, CURRENT_USER_ID }) => {


  const bottomRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    console.error('messages', allChatMessages);
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [allChatMessages]);

  return (
    <ChatContainer>
      {allChatMessages.map(message => (
        <Message key={message.id} isCurrentUser={message.userId === CURRENT_USER_ID}>

          {message.text}
        </Message>
      ))}
      <div ref={bottomRef} />
    </ChatContainer>
  );
};

export default ChatView;
