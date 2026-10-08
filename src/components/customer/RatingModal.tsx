import React, { useState } from 'react';
import { Star, ThumbsUp, X } from 'lucide-react';
import { sound } from '../../services/soundService';

interface RatingModalProps {
  orderId: string;
  driverName: string;
  onClose: () => void;
  onSubmit: (stars: number, tags: string[], feedback: string) => void;
}

export const RatingModal: React.FC<RatingModalProps> = ({
  orderId,
  driverName,
  onClose,
  onSubmit
}) => {
  const [stars, setStars] = useState(5);
  const [hoveredStars, setHoveredStars] = useState(0);
  const [selectedTags, setSelectedTags] = useState<string[]>(['On-time arrival', 'Careful loading']);
  const [feedback, setFeedback] = useState('');

  const availableTags = [
    'On-time arrival',
    'Careful loading',
    'Polite & helpful',
    'Clean cargo deck',
    'Quick unloading',
    'Smooth driving',
    'Clear communication'
  ];

  const toggleTag = (tag: string) => {
    sound.playClick();
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter((t) => t !== tag));
    } else {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sound.playSuccess();
    onSubmit(stars, selectedTags, feedback);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-slate-700 rounded-lg"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-center space-y-2">
          <div className="w-14 h-14 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center mx-auto mb-3">
            <ThumbsUp className="w-7 h-7" />
          </div>
          <h2 className="text-xl font-bold text-slate-900">Rate your experience</h2>
          <p className="text-xs text-slate-500">
            How was your delivery with <span className="font-semibold text-slate-800">{driverName}</span> for order <span className="font-mono">{orderId}</span>?
          </p>
        </div>

        {/* 5-star interactive picker */}
        <div className="flex items-center justify-center gap-2 my-6">
          {[1, 2, 3, 4, 5].map((val) => {
            const isFilled = (hoveredStars || stars) >= val;
            return (
              <button
                key={val}
                type="button"
                onMouseEnter={() => setHoveredStars(val)}
                onMouseLeave={() => setHoveredStars(0)}
                onClick={() => {
                  sound.playClick();
                  setStars(val);
                }}
                className="p-1 transition-transform hover:scale-125 focus:outline-none"
              >
                <Star
                  className={`w-9 h-9 transition-colors ${
                    isFilled ? 'text-amber-400 fill-amber-400' : 'text-slate-200'
                  }`}
                />
              </button>
            );
          })}
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Tag selections */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-2">
              What went great?
            </label>
            <div className="flex flex-wrap gap-1.5">
              {availableTags.map((tag) => {
                const isSelected = selectedTags.includes(tag);
                return (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => toggleTag(tag)}
                    className={`text-xs px-2.5 py-1 rounded-full border transition-all ${
                      isSelected
                        ? 'bg-blue-50 border-[#155EEF] text-[#155EEF] font-medium'
                        : 'bg-slate-50 border-slate-200 text-slate-600 hover:border-slate-300'
                    }`}
                  >
                    {tag}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Feedback textarea */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Additional Feedback (Optional)
            </label>
            <textarea
              rows={3}
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              placeholder="Driver was helpful with unloading cartons at the gate..."
              className="w-full text-xs p-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#155EEF] focus:border-transparent"
            />
          </div>

          <div className="pt-2">
            <button
              type="submit"
              className="w-full py-3 bg-[#155EEF] hover:bg-blue-700 text-white font-bold text-sm rounded-xl transition-colors shadow-md"
            >
              Submit Rating
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
