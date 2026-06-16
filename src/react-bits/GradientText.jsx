import { useEffect, useRef, useState } from 'react';
import './GradientText.css';

export default function GradientText({ children, className = '', colors = ['#5227FF', '#FF9FFC', '#B497CF'], animationSpeed = 8 }) {
  const [position, setPosition] = useState(0);
  const requestRef = useRef(0);
  const startRef = useRef(0);

  useEffect(() => {
    const duration = animationSpeed * 1000;
    const animate = now => {
      if (!startRef.current) startRef.current = now;
      const elapsed = (now - startRef.current) % duration;
      setPosition((elapsed / duration) * 100);
      requestRef.current = requestAnimationFrame(animate);
    };
    requestRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(requestRef.current);
  }, [animationSpeed]);

  return (
    <span
      className={`animated-gradient-text ${className}`}
      style={{
        backgroundImage: `linear-gradient(90deg, ${[...colors, colors[0]].join(', ')})`,
        backgroundPosition: `${position}% 50%`
      }}
    >
      {children}
    </span>
  );
}
