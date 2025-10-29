import React, { useState, useRef, useCallback } from 'react';
import { Star } from 'lucide-react';

interface InteractiveRatingProps {
  initialRating?: number;
  maxRating?: number;
  onRatingChange?: (rating: number) => void;
  size?: 'sm' | 'md' | 'lg';
  readonly?: boolean;
  showValue?: boolean;
  className?: string;
}

const InteractiveRating: React.FC<InteractiveRatingProps> = ({
  initialRating = 0,
  maxRating = 5,
  onRatingChange,
  size = 'md',
  readonly = false,
  showValue = true,
  className = ''
}) => {
  const [rating, setRating] = useState(initialRating);
  const [hoverRating, setHoverRating] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-5 w-5',
    lg: 'h-6 w-6'
  };

  const calculateRatingFromPosition = useCallback((clientX: number) => {
    if (!containerRef.current) return 0;
    
    const rect = containerRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    const starWidth = rect.width / maxRating;
    const newRating = Math.min(Math.max(Math.ceil(x / starWidth), 0), maxRating);
    
    return newRating;
  }, [maxRating]);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (readonly) return;
    
    setIsDragging(true);
    const newRating = calculateRatingFromPosition(e.clientX);
    setRating(newRating);
    setHoverRating(newRating);
    onRatingChange?.(newRating);
  };

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!isDragging || readonly) return;
    
    const newRating = calculateRatingFromPosition(e.clientX);
    setRating(newRating);
    setHoverRating(newRating);
    onRatingChange?.(newRating);
  }, [isDragging, readonly, calculateRatingFromPosition, onRatingChange]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  const handleMouseEnter = (starIndex: number) => {
    if (readonly || isDragging) return;
    setHoverRating(starIndex + 1);
  };

  const handleMouseLeave = () => {
    if (readonly || isDragging) return;
    setHoverRating(0);
  };

  const handleClick = (starIndex: number) => {
    if (readonly) return;
    
    const newRating = starIndex + 1;
    setRating(newRating);
    onRatingChange?.(newRating);
  };

  // Add global mouse event listeners for dragging
  React.useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging, handleMouseMove, handleMouseUp]);

  const displayRating = hoverRating || rating;

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <div
        ref={containerRef}
        className={`flex items-center gap-1 ${!readonly ? 'cursor-pointer select-none' : ''}`}
        onMouseDown={handleMouseDown}
        onMouseLeave={handleMouseLeave}
      >
        {[...Array(maxRating)].map((_, index) => {
          const isFilled = index < displayRating;
          
          return (
            <Star
              key={index}
              className={`${sizeClasses[size]} transition-all duration-150 ${
                isFilled
                  ? 'fill-yellow-400 text-yellow-400'
                  : 'text-gray-300 hover:text-yellow-400'
              } ${!readonly ? 'hover:scale-110' : ''}`}
              onMouseEnter={() => handleMouseEnter(index)}
              onClick={() => handleClick(index)}
            />
          );
        })}
      </div>
      
      {showValue && (
        <span className="text-sm font-medium text-muted-foreground">
          {displayRating.toFixed(1)} / {maxRating}
        </span>
      )}
      
      {isDragging && (
        <span className="text-xs text-primary animate-pulse">
          اسحب لتغيير التقييم
        </span>
      )}
    </div>
  );
};

export default InteractiveRating;
