import { useState } from 'react';
import axios from 'axios';
import { FaRobot, FaTimes } from 'react-icons/fa';
import { ORIGIN_URL } from '../config';

const AIReviewButton = ({ postId }) => {
  const [aiResponse, setAiResponse] = useState('');
  const [showAIResponse, setShowAIResponse] = useState(false);
  const [showInput, setShowInput] = useState(false);
  const [prompt, setPrompt] = useState('');

  const handleGenerateAIReview = async () => {
    if (!prompt.trim()) return;

    try {
      const response = await axios.post(
        `${ORIGIN_URL}/api/v1/chat/completions/${postId}`,
        prompt,
        {
          withCredentials: true,
        }
      );

      setAiResponse(response.data.message.content);
    } catch (error) {
      setAiResponse('Failed to retrieve AI review');
    }
  };

  const handleCloseInput = () => {
    setShowInput(false);
    setPrompt('');
    setAiResponse('');
    setShowAIResponse(false);
  };

  return (
    <div className="fixed top-20 left-2">
      {!showInput ? (
        <button
          onClick={() => setShowInput(true)}
          className="p-3 bg-purple-500 rounded-full shadow-lg text-white"
        >
          <FaRobot size={30} />
        </button>
      ) : (
        <div className="relative">
          <button
            onClick={handleCloseInput}
            className="absolute top-0 right-0 p-2 text-red-500"
          >
            <FaTimes size={20} />
          </button>
          <input
            type="text"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Ask AI about this post..."
            className="p-4 border rounded-lg w-full"
          />
          <button
            onClick={async () => {
              setShowAIResponse(true);
              await handleGenerateAIReview();
            }}
            className="px-4 py-2 mt-2 text-white bg-purple-500 rounded"
          >
            Submit Question
          </button>
        </div>
      )}

      {showAIResponse && aiResponse && (
        <div className="mt-2 p-4 bg-gray-200 rounded-lg shadow">
          <p>{aiResponse}</p>
        </div>
      )}
    </div>
  );
};

export default AIReviewButton;
