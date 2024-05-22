import React, { useState, useEffect } from 'react';
import { ThemeProvider, ChatBot, UserInput, Transcript } from 'react-simple-chatbot';
import { OpenAI } from 'openai';

const openai = new OpenAI({
  apiKey:process.env.OPENAI_API_KEY,
});

const ChatApp: React.FC = () => {
  const [messages, setMessages] = useState<{ type: 'human' | 'bot'; message: string }[]>([]);

  useEffect(() => {
    console.log('Component Rendered');
  }, []);

  const handleUserInput = async (input: string) => {
    console.log('User Input:', input);
    setMessages((prevMessages) => [...prevMessages, { type: 'human', message: input }]);

    try {
      const response = await openai.completions.create({
        model: 'text-davinci-003',
        prompt: `You are an AI assistant analyzing a dataset of ML Engineer salaries from 2020 to 2024. The dataset contains information about the year, salary, and job title. Based on the following conversation:\n\n${messages
          .map((message) => `${message.type}: ${message.message}`)
          .join('\n')}\nHuman: ${input}\n\nAI:`,
        temperature: 0.7,
        max_tokens: 1024,
        top_p: 1,
        frequency_penalty: 0,
        presence_penalty: 0,
      });

      const botResponse = response.choices[0].text?.trim() || 'I do not have a response for that.';
      console.log('Bot Response:', botResponse);
      setMessages((prevMessages) => [...prevMessages, { type: 'bot', message: botResponse }]);
    } catch (error) {
      console.error('Error:', error);
      setMessages((prevMessages) => [...prevMessages, { type: 'bot', message: 'Error occurred while processing your request.' }]);
    }
  };

  return (
    <ThemeProvider>
      <ChatBot
        headerTitle="ML Engineer Salaries Chat"
        userInput={<UserInput onUserInput={handleUserInput} />}
        transcript={<Transcript messages={messages} />}
      />
    </ThemeProvider>
  );
};

export default ChatApp;
