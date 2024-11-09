import * as React from 'react';
import { useState } from 'react';

// Definimos los tipos de los mensajes
type Message = {
  sender: 'user' | 'bot';
  text: string;
};

const Chat: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [userInput, setUserInput] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userInput.trim()) return;

    // Añadir el mensaje del usuario al historial
    const newMessages: Message[] = [...messages, { sender: 'user', text: userInput }];
    setMessages(newMessages);
    setUserInput('');
    setLoading(true);

    // Llamada a la API de Ollama
    try {
      const response = await fetch('https://middleearthar.ddns.net:11434/api/generate', {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({  userInput })
      });
      const data = await response.json();

      // Añadir la respuesta de Ollama al historial de mensajes
      setMessages([...newMessages, { sender: 'bot', text: data.response }]);
    } catch (error) {
      console.error('Error al obtener respuesta:', error);
      setMessages([...newMessages, { sender: 'bot', text: 'Error al obtener respuesta.' }]);
    }
    setLoading(false);
  };

  return (
    <div className="flex flex-col w-full max-w-lg mx-auto p-4 border border-gray-200 rounded-lg shadow-lg h-5/6 mt-20 ">
      <div className="flex flex-col space-y-3 overflow-y-auto max-h-96 p-4 bg-slate-200 rounded-lg w-full h-5/6">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`p-2 rounded-lg max-w-xs ${message.sender === 'user'
              ? 'bg-blue-500 text-white self-end'
              : 'bg-gray-300 text-black self-start'}`}
          >
            {message.text}
          </div>
        ))}
        {loading && (
          <div className="bg-gray-300 text-black p-2 rounded-lg max-w-xs self-start">
            Escribiendo...
          </div>
        )}
      </div>
      <form onSubmit={handleSubmit} className="flex items-center mt-4 space-x-2">
        <input
          type="text"
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
          placeholder="Escribe tu mensaje..."
          className="flex-1 p-2 border border-gray-300 bg-slate-200 rounded-lg focus:outline-none focus:border-violet-800"
        />
        <button
          type="submit"
          disabled={loading}
          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50"
        >
          Enviar
        </button>
      </form>
    </div>
  );
};

export default Chat;
