import { useEffect, useRef, useState } from 'react';

const DEFAULT_CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+-=[]{}|;:,.<>?';

const DecryptedText = ({
  text,
  speed = 50,
  maxIterations = 10,
  characters = DEFAULT_CHARS,
  className = '',
  parentClassName = '',
  encryptedClassName = 'opacity-60',
  animateOn = 'hover',
  revealDirection = 'start',
  sequential = false
}) => {
  const [displayText, setDisplayText] = useState(text);
  const [isAnimating, setIsAnimating] = useState(false);
  const [hasAnimated, setHasAnimated] = useState(false);
  const intervalRef = useRef(null);
  const elementRef = useRef(null);

  const animate = () => {
    if (isAnimating) return;

    setIsAnimating(true);
    const originalText = text;
    const textLength = originalText.length;
    let iteration = 0;

    clearInterval(intervalRef.current);

    intervalRef.current = setInterval(() => {
      setDisplayText(
        originalText
          .split('')
          .map((char, index) => {
            if (char === ' ') return ' ';

            let shouldReveal = false;
            if (revealDirection === 'start') {
              shouldReveal = index < (iteration / maxIterations) * textLength;
            } else if (revealDirection === 'end') {
              shouldReveal = index >= textLength - (iteration / maxIterations) * textLength;
            } else if (revealDirection === 'center') {
              const center = textLength / 2;
              const revealRadius = (iteration / maxIterations) * center;
              shouldReveal = Math.abs(index - center) < revealRadius;
            } else if (revealDirection === 'random') {
              shouldReveal = Math.random() < iteration / maxIterations;
            }

            if (shouldReveal) {
              return originalText[index];
            }

            return characters[Math.floor(Math.random() * characters.length)];
          })
          .join('')
      );

      iteration++;

      if (iteration > maxIterations) {
        clearInterval(intervalRef.current);
        setDisplayText(originalText);
        setIsAnimating(false);
        if (animateOn === 'view') {
          setHasAnimated(true);
        }
      }
    }, speed);
  };

  useEffect(() => {
    if (animateOn === 'view' && !hasAnimated && elementRef.current) {
      const observer = new IntersectionObserver(
        entries => {
          if (entries[0].isIntersecting) {
            animate();
            observer.disconnect();
          }
        },
        { threshold: 0.5 }
      );

      observer.observe(elementRef.current);

      return () => observer.disconnect();
    }
  }, [animateOn, hasAnimated]);

  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  const handleMouseEnter = () => {
    if (animateOn === 'hover') {
      animate();
    }
  };

  const handleClick = () => {
    if (animateOn === 'click') {
      animate();
    }
  };

  return (
    <span
      ref={elementRef}
      className={`inline-block ${parentClassName}`}
      onMouseEnter={handleMouseEnter}
      onClick={handleClick}
      style={{ cursor: animateOn === 'hover' || animateOn === 'click' ? 'pointer' : 'default' }}
    >
      <span className={`${className} ${isAnimating ? encryptedClassName : ''}`}>
        {displayText}
      </span>
    </span>
  );
};

export default DecryptedText;
