import React, { useState } from 'react';
import './Chat.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCog, faTrashCan, faPaperPlane, faRobot } from '@fortawesome/free-solid-svg-icons';

interface Message {
  text: string;
  role: 'user' | 'assistant';
}

interface SettingsData {
  apiUrl: string;
  apiKey: string;
}

const ChatApp: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [showSettings, setShowSettings] = useState(false);
  const [settingsData, setSettingsData] = useState<SettingsData>({
    apiUrl: 'Azure OpenAI Endpoint',
    apiKey: 'Azure OpenAI Key',
  });

  const addMessage = (text: string, role: 'user' | 'assistant') => {
    const newMessage: Message = { text, role };
    setMessages((prevMessages) => [...prevMessages, newMessage]);
  };

  const handleUserInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputText(e.target.value);
  };

  const handleSendMessage = async () => {
    if (inputText.trim() === '') return;

    const requestBody = {
      messages: [
        { role: 'system', content: 'You are an AI assistant that helps people find information.' },
        { role: 'user', content: inputText },
      ],
      max_tokens: 800,
      temperature: 0.7,
      frequency_penalty: 0,
      presence_penalty: 0,
      top_p: 0.95,
      stop: null,
    };

    addMessage(inputText, 'user');
    setInputText('');

    try {
      const response = await fetch(settingsData.apiUrl, {
        method: 'POST',
        body: JSON.stringify(requestBody),
        headers: {
          'Content-Type': 'application/json',
          'api-key': settingsData.apiKey,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch response from the AI assistant');
      }

      const responseData = await response.json();
      console.log('Response data:', responseData);
      const assistantReply = responseData.choices[0]?.message.content;

      if (assistantReply) {
        addMessage(assistantReply, 'assistant');
      } else {
        addMessage('Error fetching data from the API', 'assistant');
      }
    } catch (error) {
      // console.error('Error fetching data from the API:', error.message);
      addMessage('Error fetching data from the API', 'assistant');
    }
  };

  const handleClearChat = () => {
    setMessages([]);
  };

  const handleSettingsClick = () => {
    setShowSettings(true);
  };

  const handleSettingsClose = () => {
    setShowSettings(false);
  };

  const handleSaveSettings = () => {
    setSettingsData({ apiUrl: settingsData.apiUrl, apiKey: settingsData.apiKey });
    setShowSettings(false);
  };

  return (
    <div className="container">
      <h2>
        <FontAwesomeIcon icon={faRobot} /> AI Chatapp
      </h2>

      {showSettings && (
        <div className="settings-popup">
          <div className="settings-content">
            <label htmlFor="apiUrl">API URL:</label>
            <input
              type="text"
              id="apiUrl"
              value={settingsData.apiUrl}
              onChange={(e) => setSettingsData({ ...settingsData, apiUrl: e.target.value })}
            />

            <label htmlFor="apiKey">API Key:</label>
            <input
              type="text"
              id="apiKey"
              value={settingsData.apiKey}
              onChange={(e) => setSettingsData({ ...settingsData, apiKey: e.target.value })}
            />

            <button onClick={handleSaveSettings}>Save</button>
            <button onClick={handleSettingsClose}>Cancel</button>
          </div>
        </div>
      )}

      <div className="chat-app">
        <div className="chat-window">
          {messages.map((message, index) => (
            <div key={index} className={message.role === 'user' ? 'user-message' : 'assistant-message'}>
              {message.text}
            </div>
          ))}
        </div>
        <div className="input-container">
          <input type="text" value={inputText} onChange={handleUserInput} placeholder="Type your message..." />
          <button onClick={handleSendMessage}>
            <FontAwesomeIcon icon={faPaperPlane} /> Send
          </button>
          <button onClick={handleClearChat}>
            <FontAwesomeIcon icon={faTrashCan} /> Clear
          </button>
          <button className="settings-button" onClick={handleSettingsClick}>
            <FontAwesomeIcon icon={faCog} /> Settings
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatApp;