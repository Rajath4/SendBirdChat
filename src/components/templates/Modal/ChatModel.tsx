import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import ReactModal from 'react-modal';
import ChatView from './ChatView'; // Ensure ChatView is appropriately typed
import TextInputWithButton from './TextInputWithButton'; // Ensure TextInputWithButton is appropriately typed
import { StatefulDirectCall } from '../../../lib/sendbird-calls';
import SendbirdChat, { SendbirdChatWith } from '@sendbird/chat';
import { GroupChannelModule, GroupChannel, GroupChannelHandler } from '@sendbird/chat/groupChannel';
import { SendableMessage } from '@sendbird/chat/lib/__definition';

interface ModalProps {
  isOpen: boolean;
  call: StatefulDirectCall;
  onRequestClose: () => void;
  title: string;
  content: React.ReactNode;
  footer: {
    cancel?: {
      label: string;
      onClick?: () => void;
    };
    confirm?: {
      label: string;
      onClick?: () => void;
    };
  };
}

interface Message {
  id: string;
  userId: string;
  text: string;
}

const customStyles = {
  overlay: {
    backgroundColor: 'rgba(33, 34, 66, 0.06)',
    zIndex: 1000,
  },
  content: {
    top: '10%',
    left: '10%',
    right: '10%',
    bottom: '10%',
    border: 'none',
    background: 'none',
    padding: '0',
    overflow: 'hidden',
    borderRadius: '10px',
  },
};

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  padding: 18px 24px 22px 24px;
  border-radius: 4px;
  background-color: var(--white);
  box-shadow: 0 6px 10px -5px rgba(33, 34, 66, 0.04), 0 6px 30px 5px rgba(33, 34, 66, 0.08), 0 16px 24px 2px rgba(33, 34, 66, 0.12);
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  width: 100%;
  margin-bottom: 18px;
`;

const Title = styled.div`
  font-size: 24px;
  font-weight: 600;
  color: var(--navy-900);
`;

const Close = styled.div`
  width: 32px;
  height: 32px;
  padding: 6px;
  border-radius: 4px;
  cursor: pointer;
`;

const ICClose = styled.div`
  width: 20px;
  height: 20px;
  background-image: url('/icons/ic-close.svg');
`;

const Content = styled.div`
  flex-grow: 1;
  overflow-y: auto;
`;

const Footer = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-top: auto;
`;

let allChatMessagesData:Message[] = [];

const ChatModel: React.FC<ModalProps> = ({ isOpen, call, onRequestClose, title, content, footer }) => {
  const [sb, setSb] = useState<SendbirdChatWith<GroupChannelModule[]> | null>(null);
  const [allChatMessages, setAllChatMessages] = useState<Message[]>([]);
  const [groupChannel, setGroupChannel] = useState<GroupChannel | null>(null);
  const isInit = useRef(false);


  useEffect(() => {
    console.warn('Updated message allChatMessagesData:', allChatMessagesData.length);
    // This logs the message count whenever allChatMessages changes
    console.warn('Updated message count:', allChatMessages.length);
  }, [allChatMessages]);  // Dependency on allChatMessages

  useEffect(() => {
    let isMounted = true;  // Track the mounting status
    if (!isInit.current) {
      allChatMessagesData = [];
      const initSendBird = async () => {
        console.error("AAAAAAAA")
        const sbInstance = SendbirdChat.init({
          appId: '90E3E38F-B82C-474B-B820-886118346945',
          modules: [new GroupChannelModule()]
        });
        setSb(sbInstance);
        try {
          sbInstance.connect(call.callee.userId)
          .then(() => {
            setSb(sbInstance);

            return sbInstance.groupChannel.createChannel({
              name: `Chat Session ${call.callId}`,
              invitedUserIds: [call.caller.userId, call.callee.userId],
              customType: call.callId,
              isDistinct: false
            });
          })
          .then(channel => {
            setGroupChannel(channel);
            return channel.getMessagesByTimestamp(new Date().getTime(), {
              prevResultSize: 50,
              nextResultSize: 0,
              isInclusive: true
            });
          })
          .then(historicalMessages => {
            setAllChatMessages(historicalMessages.map((msg:any) => ({
              id: msg.messageId,
              userId: call.remoteUser.userId, 
                               // @ts-ignore
              text: msg.message
            })));
          })
          .catch(console.error);


          await sbInstance.connect(call.callee.userId);
          console.log('User connected');
          const sessionId = call.callId;
          const params = {
            name: `Chat Session ${sessionId}`,
            userIds: [call.caller.userId, call.callee.userId],
            customType: sessionId,
            isDistinct: false
          };

          const channel = await sbInstance.groupChannel.createChannel(params);
          setGroupChannel(channel);
          // const historicalMessages = await channel.getMessagesByTimestamp(new Date().getTime(), {
          //   prevResultSize: 50,
          //   nextResultSize: 0,
          //   isInclusive: true
          // });
          // setAllChatMessages(historicalMessages.map((msg: any) => ({
          //   id: msg.messageId,
          //   userId: msg.sender.userId,
          //   text: msg.message
          // })));
          const groupChannelModule = sbInstance.groupChannel as GroupChannelModule;
          const channelHandler = new GroupChannelHandler()
          channelHandler.onMessageReceived = (channel, message) => {
            allChatMessagesData.push({
              id: message.messageId.toString(),
              userId: call.remoteUser.userId, 
               // @ts-ignore
              text: message.message    
            });

            setAllChatMessages([...allChatMessagesData]);
            console.log('Message received from:', call.remoteUser.userId);

          };
          groupChannelModule.addGroupChannelHandler(call.callId, channelHandler);

          isInit.current = true;
        } catch (error) {
          console.error('Error during Sendbird initialization:', error);
        }
      };
      initSendBird();

      return () => {
        isMounted = false;  // Indicate the component has been unmounted
        // Assuming `sb` has a method to remove handlers or disconnect
        sb?.disconnect();  // Cleanup Sendbird connection
    };
    }
  }, [call.callId]);

  const handleSendMessage = async (message: string) => {
    console.log('Sending message by', call.localUser.userId);
    if (groupChannel) {
      try {
        groupChannel.sendUserMessage({ message })
          .onSucceeded((sentMessage: SendableMessage) => {
            allChatMessagesData.push({
              id: sentMessage.messageId.toString(),
              userId: call.localUser.userId, 
               // @ts-ignore
              text: sentMessage.message    
            });

            setAllChatMessages([...allChatMessagesData]);
            console.log('Message sent:', sentMessage,allChatMessages.length);

          })
          .onFailed((error: Error) => {
            console.error('Error sending message:', error);
          });
      } catch (error) {
        console.error('Error sending message:', error);
      }
    }
  };

  return (
    <ReactModal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      style={customStyles}
      ariaHideApp={false}
    >
      <Wrapper>
        <Header>
          <Title>{title}</Title>
          <Close onClick={onRequestClose}><ICClose /></Close>
        </Header>
        <Content>
          <ChatView allChatMessages={allChatMessages} CURRENT_USER_ID={call.localUser.userId} />
        </Content>
        <Footer>
          <TextInputWithButton onSendMessage={handleSendMessage} />
        </Footer>
      </Wrapper>
    </ReactModal>
  );
};

export default ChatModel;
