import React, { useState, useEffect, useRef, useContext } from "react";
import { Context } from "../store/appContext";
import "../../styles/chatbot.css";

export const Chatbot = () => {
  const { store } = useContext(Context);
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      type: "bot",
      text: "¡Hola! 👋 Soy tu asistente gastronómico. Puedo ayudarte a encontrar el restaurante perfecto. Dime tu ubicación, presupuesto y preferencias.",
      timestamp: new Date()
    }
  ]);
  const [inputText, setInputText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Función para procesar el mensaje del usuario
  const processUserMessage = (text) => {
    const lowerText = text.toLowerCase();
    
    // Extraer información del mensaje
    const cities = ["madrid", "barcelona", "valencia", "sevilla", "zaragoza", "alicante", 
                    "salamanca", "zamora", "bilbao", "cáceres", "san sebastián", 
                    "lisboa", "porto", "faro", "coimbra", "braga"];
    
    const foundCity = cities.find(city => lowerText.includes(city));
    
    // Extraer presupuesto
    let budget = null;
    const budgetMatch = lowerText.match(/(\d+)\s*(euros?|€)/i);
    if (budgetMatch) {
      budget = parseInt(budgetMatch[1]);
    }

    // Detectar ubicación (centro, norte, sur, etc.)
    const locations = ["centro", "norte", "sur", "este", "oeste"];
    const foundLocation = locations.find(loc => lowerText.includes(loc));

    // Detectar tipo de comida
    const types = {
      "japonés": "Restaurante Japonés",
      "japones": "Restaurante Japonés",
      "sushi": "Restaurante Japonés",
      "italiano": "Pizzería",
      "pizza": "Pizzería",
      "mexicano": "Restaurante Mexicano",
      "tacos": "Restaurante Mexicano",
      "indio": "Restaurante Indio",
      "curry": "Restaurante Indio",
      "vegano": "Restaurante Vegano",
      "vegetariano": "Restaurante Vegano",
      "tapas": "Tapas Bar",
      "mariscos": "Marisquería",
      "pescado": "Marisquería",
      "carne": "Asador",
      "asador": "Asador"
    };

    let foundType = null;
    for (const [key, value] of Object.entries(types)) {
      if (lowerText.includes(key)) {
        foundType = value;
        break;
      }
    }

    // Buscar restaurantes según los criterios
    let filteredRestaurants = [...store.restaurantes];

    if (foundCity) {
      filteredRestaurants = filteredRestaurants.filter(r => 
        r.ciudad.toLowerCase() === foundCity
      );
    }

    if (foundType) {
      filteredRestaurants = filteredRestaurants.filter(r => 
        r.tipo_local === foundType
      );
    }

    if (budget) {
      // Mapear presupuesto a nivel de precio
      let priceLevel;
      if (budget <= 15) priceLevel = 1;
      else if (budget <= 30) priceLevel = 2;
      else priceLevel = 3;

      filteredRestaurants = filteredRestaurants.filter(r => 
        r.precio <= priceLevel
      );
    }

    // Generar respuesta
    return generateResponse(filteredRestaurants, foundCity, budget, foundType, foundLocation);
  };

  const generateResponse = (restaurants, city, budget, type, location) => {
    if (restaurants.length === 0) {
      return "Lo siento, no encontré restaurantes que coincidan con tus criterios. ¿Podrías ser más específico o cambiar algún parámetro? 🤔";
    }

    // Tomar los primeros 3 restaurantes
    const topRestaurants = restaurants.slice(0, 3);
    
    let response = `¡Perfecto! Encontré ${restaurants.length} restaurante${restaurants.length > 1 ? 's' : ''} para ti`;
    
    if (city) response += ` en ${city.charAt(0).toUpperCase() + city.slice(1)}`;
    if (budget) response += ` con presupuesto de ${budget}€`;
    if (type) response += ` de tipo ${type}`;
    
    response += ". Aquí están mis mejores recomendaciones:\n\n";

    topRestaurants.forEach((restaurant, index) => {
      const priceSymbol = "€".repeat(restaurant.precio);
      response += `${index + 1}. **${restaurant.nombre}**\n`;
      response += `   📍 ${restaurant.ciudad}\n`;
      response += `   🍽️ ${restaurant.tipo_local}\n`;
      response += `   💰 ${priceSymbol}\n`;
      response += `   📝 ${restaurant.descripcion.substring(0, 80)}...\n\n`;
    });

    if (restaurants.length > 3) {
      response += `\n✨ Y ${restaurants.length - 3} opciones más disponibles. ¿Quieres que te muestre más detalles?`;
    }

    return response;
  };

  const handleSendMessage = async () => {
    if (!inputText.trim()) return;

    // Agregar mensaje del usuario
    const userMessage = {
      type: "user",
      text: inputText,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText("");
    setIsTyping(true);

    // Simular delay de procesamiento
    setTimeout(() => {
      const botResponse = processUserMessage(inputText);
      
      const botMessage = {
        type: "bot",
        text: botResponse,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, botMessage]);
      setIsTyping(false);
    }, 1000);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const quickQuestions = [
    "Restaurante en el centro de Madrid por 20€",
    "Comida japonesa en Barcelona",
    "Restaurante vegano económico",
    "Marisquería en Valencia"
  ];

  const handleQuickQuestion = (question) => {
    setInputText(question);
  };

  return (
    <>
      {/* Botón flotante */}
      <button 
        className={`chatbot-toggle ${isOpen ? 'open' : ''}`}
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        ) : (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
          </svg>
        )}
      </button>

      {/* Ventana del chat */}
      {isOpen && (
        <div className="chatbot-window">
          <div className="chatbot-header">
            <div className="chatbot-header-info">
              <div className="chatbot-avatar">🤖</div>
              <div>
                <h3>Asistente Gastronómico</h3>
                <span className="chatbot-status">En línea</span>
              </div>
            </div>
          </div>

          <div className="chatbot-messages">
            {messages.map((message, index) => (
              <div key={index} className={`message ${message.type}`}>
                <div className="message-content">
                  {message.text.split('\n').map((line, i) => {
                    // Procesar markdown simple
                    const boldText = line.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
                    return (
                      <p key={i} dangerouslySetInnerHTML={{ __html: boldText }} />
                    );
                  })}
                </div>
                <span className="message-time">
                  {message.timestamp.toLocaleTimeString('es-ES', { 
                    hour: '2-digit', 
                    minute: '2-digit' 
                  })}
                </span>
              </div>
            ))}

            {isTyping && (
              <div className="message bot">
                <div className="message-content typing">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Preguntas rápidas */}
          {messages.length === 1 && (
            <div className="quick-questions">
              <p>Prueba con:</p>
              {quickQuestions.map((question, index) => (
                <button
                  key={index}
                  className="quick-question-btn"
                  onClick={() => handleQuickQuestion(question)}
                >
                  {question}
                </button>
              ))}
            </div>
          )}

          <div className="chatbot-input">
            <textarea
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Escribe tu consulta... (ej: restaurante en Cáceres por 20€)"
              rows="1"
            />
            <button 
              onClick={handleSendMessage}
              disabled={!inputText.trim()}
              className="send-btn"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="22" y1="2" x2="11" y2="13"></line>
                <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
              </svg>
            </button>
          </div>
        </div>
      )}
    </>
  );
};
