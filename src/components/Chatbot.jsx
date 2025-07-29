import React, { useState, useEffect, useRef } from 'react';
import { supabase } from '../supabaseClient';
import { FiMessageSquare, FiX, FiSend } from 'react-icons/fi';
import './Chatbot.css';

const Chatbot = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([]);
    const [options, setOptions] = useState([]);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(scrollToBottom, [messages]);

    const fetchOptions = async (parentId = 1) => { // ID 1 es el nodo raíz "Inicio"
        const { data, error } = await supabase
            .from('knowledge_base')
            .select('*')
            .eq('parent_id', parentId);

        if (error) {
            console.error("Error fetching options:", error);
            return [];
        }
        return data;
    };

    const startConversation = async () => {
        setMessages([{ text: "¡Hola! Soy tu asistente de ZapaEleg. ¿En qué puedo ayudarte hoy?", from: 'bot' }]);
        const initialOptions = await fetchOptions(1);
        setOptions(initialOptions);
    };

    const handleOptionClick = async (option) => {
        // Añadir la elección del usuario al chat
        const userMessage = { text: option.question, from: 'user' };
        setMessages(prev => [...prev, userMessage]);
        
        // Si la opción tiene una respuesta directa, mostrarla
        if (option.answer) {
            setTimeout(async () => {
                const botMessage = { text: option.answer, from: 'bot' };
                setMessages(prev => [...prev, botMessage]);
                // Volver a mostrar las opciones del menú principal
                const initialOptions = await fetchOptions(1);
                setOptions(initialOptions);
            }, 500);
        } else {
            // Si no, es un submenú. Buscar las opciones hijas.
            const subOptions = await fetchOptions(option.id);
            if (subOptions.length > 0) {
                setOptions(subOptions);
            } else {
                // Lógica futura para búsqueda de productos
                const botMessage = { text: "Esta función está en desarrollo, ¡pronto podrás buscar productos desde aquí!", from: 'bot' };
                setMessages(prev => [...prev, botMessage]);
                const initialOptions = await fetchOptions(1);
                setOptions(initialOptions);
            }
        }
    };
    
    const toggleChat = () => {
        if (!isOpen) {
            startConversation();
        }
        setIsOpen(!isOpen);
    };

    return (
        <div className="chatbot-container">
            {isOpen && (
                <div className="chat-window">
                    <div className="chat-header">
                        Asistente ZapaEleg
                        <button onClick={toggleChat} className="close-chat-btn"><FiX /></button>
                    </div>
                    <div className="chat-messages">
                        {messages.map((msg, index) => (
                            <div key={index} className={`message ${msg.from}`}>
                                {msg.text}
                            </div>
                        ))}
                        <div ref={messagesEndRef} />
                    </div>
                    <div className="chat-options">
                        {options.map(option => (
                            <button key={option.id} onClick={() => handleOptionClick(option)} className="option-button">
                                {option.question}
                            </button>
                        ))}
                    </div>
                </div>
            )}
            <button onClick={toggleChat} className="chat-toggle-button">
                {isOpen ? <FiX size={24} /> : <FiMessageSquare size={24} />}
            </button>
        </div>
    );
};

export default Chatbot;
