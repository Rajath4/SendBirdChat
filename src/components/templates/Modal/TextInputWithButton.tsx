import React, { useState } from 'react';
import styled from 'styled-components';

const InputGroup = styled.div`
  display: flex;
  width: 100%;
  align-items: center;
  justify-content: space-between;
`;

const TextInput = styled.input`
  flex-grow: 1;
  padding: 8px 12px;
  margin-right: 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 16px;
`;

const SendButton = styled.button`
  padding: 8px 16px;
  background-color: #007BFF;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 16px;
  &:hover {
    background-color: #0056b3;
  }
`;

interface TextInputWithButtonProps {
  onSendMessage: (message: string) => void;
}

const TextInputWithButton: React.FC<TextInputWithButtonProps> = ({ onSendMessage }) => {
  const [inputValue, setInputValue] = useState('');

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.target.value);
  };

  const handleSendClick = () => {
    onSendMessage(inputValue);
    setInputValue(''); // Clear the input after sending
  };

  return (
    <InputGroup>
      <TextInput
        type="text"
        value={inputValue}
        onChange={handleInputChange}
        placeholder="Enter your message"
      />
      <SendButton onClick={handleSendClick}>
        Send
      </SendButton>
    </InputGroup>
  );
};

export default TextInputWithButton;
