import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import nprogress from 'nprogress';
import 'nprogress/nprogress.css';

// Configure nprogress
nprogress.configure({ 
  showSpinner: false,
  trickleSpeed: 200,
  minimum: 0.08
});

export function LoadingProgress() {
  const location = useLocation();

  useEffect(() => {
    nprogress.start();
    
    // Simulate a bit of loading for smoother feel even on local
    const timer = setTimeout(() => {
      nprogress.done();
    }, 200);

    return () => {
      clearTimeout(timer);
      nprogress.done();
    };
  }, [location]);

  return null;
}
