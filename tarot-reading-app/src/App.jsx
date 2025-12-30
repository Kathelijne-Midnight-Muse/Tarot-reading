import React, { useState, useEffect } from 'react';
import { Sparkles, BookOpen, Calendar, TrendingUp } from 'lucide-react';
import './App.css';

const MAJOR_ARCANA = [
  'The Fool', 'The Magician', 'The High Priestess', 'The Empress', 'The Emperor',
  'The Hierophant', 'The Lovers', 'The Chariot', 'Strength', 'The Hermit',
  'Wheel of Fortune', 'Justice', 'The Hanged Man', 'Death', 'Temperance',
  'The Devil', 'The Tower', 'The Star', 'The Moon', 'The Sun', 'Judgement', 'The World'
];

const MINOR_ARCANA = {
  'Wands': ['Ace', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine', 'Ten', 'Page', 'Knight', 'Queen', 'King'],
  'Cups': ['Ace', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine', 'Ten', 'Page', 'Knight', 'Queen', 'King'],
  'Swords': ['Ace', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine', 'Ten', 'Page', 'Knight', 'Queen', 'King'],
  'Pentacles': ['Ace', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine', 'Ten', 'Page', 'Knight', 'Queen', 'King']
};

export default function TarotApp() {
  const [view, setView] = useState('input');
  const [cards, setCards] = useState([
    { card: '', orientation: 'upright', position: 'Past' },
    { card: '', orientation: 'upright', position: 'Present' },
    { card: '', orientation: 'upright', position: 'Future' }
  ]);
  const [reading, setReading] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [history, setHistory] = useState([]);

  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = () => {
    try {
      const stored = localStorage.getItem('tarot-readings');
      if (stored) {
        const readings = JSON.parse(stored);
        setHistory(readings.sort((a, b) => b.timestamp - a.timestamp));
      }
    } catch (error) {
      console.log('No history yet');
    }
  };

  const updateCard = (index, field, value) => {
    const newCards = [...cards];
    newCards[index][field] = value;
    setCards(newCards);
  };

  const generateReading = async () => {
    if (cards.some(c => !c.card)) {
      alert('Please select all three cards');
      return;
    }

    setIsLoading(true);
    setView('reading');

    try {
      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': import.meta.env.VITE_ANTHROPIC_API_KEY || '',
        },
        body: JSON.stringify({
          model: 'claude-sonnet-4-20250514',
          max_tokens: 1000,
          messages: [{
            role: 'user',
            content: `You are an experienced tarot reader using the Rider-Waite deck. I've drawn three cards for my daily reading:

${cards.map((c, i) => `${i + 1}. ${c.card} (${c.orientation}) - Position: ${c.position}`).join('\n')}

Please provide a deep, nuanced reading that:

- Interprets each card in its position, considering the Rider-Waite symbolism
- Explores how these cards work together and what patterns they reveal
- Offers guidance for my day and week ahead
- Speaks with warmth, wisdom, and insight

Keep the reading personal, meaningful, and around 300-400 words.`
          }]
        })
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error?.message || 'Failed to generate reading');
      }

      const readingText = data.content.map(item => item.type === 'text' ? item.text : '').join('\n');
      setReading(readingText);

      const readingData = {
        timestamp: Date.now(),
        date: new Date().toLocaleDateString(),
        cards: cards,
        reading: readingText
      };

      const stored = localStorage.getItem('tarot-readings') || '[]';
      const readings = JSON.parse(stored);
      readings.push(readingData);
      localStorage.setItem('tarot-readings', JSON.stringify(readings));
      loadHistory();
    } catch (error) {
      setReading(`Unable to generate reading: ${error.message}. Make sure you have set the VITE_ANTHROPIC_API_KEY environment variable.`);
    } finally {
      setIsLoading(false);
    }
  };

  const getAllCards = () => {
    const allCards = [...MAJOR_ARCANA];
    Object.entries(MINOR_ARCANA).forEach(([suit, ranks]) => {
      ranks.forEach(rank => {
        allCards.push(`${rank} of ${suit}`);
      });
    });
    return allCards.sort();
  };

  const viewHistoryReading = (historyItem) => {
    setCards(historyItem.cards);
    setReading(historyItem.reading);
    setView('reading');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-indigo-800 text-white">
      <div className="max-w-4xl mx-auto p-6">
        <header className="text-center mb-8 pt-6">
          <div className="flex items-center justify-center gap-3 mb-2">
            <Sparkles className="w-8 h-8 text-yellow-300" />
            <h1 className="text-4xl font-serif">Daily Tarot Companion</h1>
            <Sparkles className="w-8 h-8 text-yellow-300" />
          </div>
          <p className="text-purple-200 text-sm">Rider-Waite Deck Readings</p>
        </header>

        <nav className="flex gap-2 mb-6 bg-white/10 rounded-lg p-1">
          <button
            onClick={() => setView('input')}
            className={`flex-1 py-2 px-4 rounded flex items-center justify-center gap-2 transition ${
              view === 'input' ? 'bg-white/20' : 'hover:bg-white/5'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            New Reading
          </button>
          <button
            onClick={() => setView('history')}
            className={`flex-1 py-2 px-4 rounded flex items-center justify-center gap-2 transition ${
              view === 'history' ? 'bg-white/20' : 'hover:bg-white/5'
            }`}
          >
            <Calendar className="w-4 h-4" />
            History
          </button>
        </nav>

        {view === 'input' && (
          <div className="bg-white/10 backdrop-blur rounded-lg p-6 shadow-xl">
            <h2 className="text-2xl font-serif mb-6 text-center">Enter Your Three Cards</h2>
            
            <div className="space-y-6">
              {cards.map((card, index) => (
                <div key={index} className="bg-white/5 rounded-lg p-4">
                  <label className="block text-sm font-semibold mb-2 text-purple-200">
                    Card {index + 1} - {card.position}
                  </label>
                  
                  <select
                    value={card.card}
                    onChange={(e) => updateCard(index, 'card', e.target.value)}
                    className="w-full bg-white/10 border border-white/20 rounded px-3 py-2 mb-3 text-white"
                  >
                    <option value="">Select a card...</option>
                    <optgroup label="Major Arcana">
                      {MAJOR_ARCANA.map(c => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </optgroup>
                    {Object.entries(MINOR_ARCANA).map(([suit, ranks]) => (
                      <optgroup key={suit} label={suit}>
                        {ranks.map(rank => (
                          <option key={`${rank}-${suit}`} value={`${rank} of ${suit}`}>
                            {rank} of {suit}
                          </option>
                        ))}
                      </optgroup>
                    ))}
                  </select>

                  <div className="flex gap-4">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name={`orientation-${index}`}
                        checked={card.orientation === 'upright'}
                        onChange={() => updateCard(index, 'orientation', 'upright')}
                        className="w-4 h-4"
                      />
                      <span>Upright</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name={`orientation-${index}`}
                        checked={card.orientation === 'reversed'}
                        onChange={() => updateCard(index, 'orientation', 'reversed')}
                        className="w-4 h-4"
                      />
                      <span>Reversed</span>
                    </label>
                  </div>
                </div>
              ))}
            </div>

            <button
              onClick={generateReading}
              disabled={isLoading}
              className="w-full mt-6 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 py-3 rounded-lg font-semibold transition disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {isLoading ? 'Channeling wisdom...' : (
                <>
                  <Sparkles className="w-5 h-5" />
                  Generate Reading
                </>
              )}
            </button>
          </div>
        )}

        {view === 'reading' && (
          <div className="bg-white/10 backdrop-blur rounded-lg p-6 shadow-xl">
            <div className="mb-6">
              <h2 className="text-2xl font-serif mb-4 text-center">Your Reading</h2>
              <div className="grid grid-cols-3 gap-4 mb-6">
                {cards.map((card, i) => (
                  <div key={i} className="bg-white/5 rounded p-3 text-center">
                    <div className="text-xs text-purple-200 mb-1">{card.position}</div>
                    <div className="font-semibold text-sm">{card.card}</div>
                    <div className="text-xs text-yellow-300 mt-1">{card.orientation}</div>
                  </div>
                ))}
              </div>
            </div>

            {isLoading ? (
              <div className="text-center py-12">
                <div className="animate-pulse text-lg">Receiving guidance from the cards...</div>
              </div>
            ) : (
              <div className="prose prose-invert max-w-none">
                <div className="whitespace-pre-wrap leading-relaxed text-purple-50">
                  {reading}
                </div>
              </div>
            )}

            <button
              onClick={() => {
                setView('input');
                setCards([
                  { card: '', orientation: 'upright', position: 'Past' },
                  { card: '', orientation: 'upright', position: 'Present' },
                  { card: '', orientation: 'upright', position: 'Future' }
                ]);
                setReading('');
              }}
              className="w-full mt-6 bg-white/10 hover:bg-white/20 py-3 rounded-lg font-semibold transition"
            >
              New Reading
            </button>
          </div>
        )}

        {view === 'history' && (
          <div className="bg-white/10 backdrop-blur rounded-lg p-6 shadow-xl">
            <h2 className="text-2xl font-serif mb-6 text-center">Reading History</h2>
            
            {history.length === 0 ? (
              <div className="text-center py-12 text-purple-200">
                No readings yet. Create your first daily reading!
              </div>
            ) : (
              <div className="space-y-4">
                {history.map((item, idx) => (
                  <div
                    key={idx}
                    onClick={() => viewHistoryReading(item)}
                    className="bg-white/5 hover:bg-white/10 rounded-lg p-4 cursor-pointer transition"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <span className="font-semibold">{item.date}</span>
                      <TrendingUp className="w-4 h-4 text-yellow-300" />
                    </div>
                    <div className="text-sm text-purple-200">
                      {item.cards.map(c => c.card).join(' • ')}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
