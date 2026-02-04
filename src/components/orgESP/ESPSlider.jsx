import React, { useRef } from 'react';
import { Box, Typography, IconButton } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { fonts } from '../../utility/fonts';

const ESPSectionHeader = ({ title, onPrev, onNext, prevDisabled, nextDisabled }) => (
  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
    <Typography
      sx={{
        fontFamily: fonts.sans,
        fontWeight: 700,
        fontSize: '32px',
        color: '#000',
      }}
    >
      {title}
    </Typography>
    <Box sx={{ display: 'flex', gap: 2 }}>
      <IconButton
        onClick={onPrev}
        disabled={prevDisabled}
        sx={{
          width: '61px',
          height: '61px',
          background: 'linear-gradient(155.92deg, #BF2F75 3.87%, #720361 63.8%)',
          color: '#fff',
          '&:disabled': { 
            background: '#ddd',
            opacity: 0.5 
          },
          '&:hover': { 
            opacity: 0.9,
            background: 'linear-gradient(155.92deg, #BF2F75 3.87%, #720361 63.8%)',
          }
        }}
      >
        <ArrowBackIcon sx={{ fontSize: '30px' }} />
      </IconButton>
      <IconButton
        onClick={onNext}
        disabled={nextDisabled}
        sx={{
          width: '61px',
          height: '61px',
          background: 'linear-gradient(155.92deg, #BF2F75 3.87%, #720361 63.8%)',
          color: '#fff',
          '&:disabled': { 
            background: '#ddd',
            opacity: 0.5 
          },
          '&:hover': { 
            opacity: 0.9,
            background: 'linear-gradient(155.92deg, #BF2F75 3.87%, #720361 63.8%)',
          }
        }}
      >
        <ArrowForwardIcon sx={{ fontSize: '30px' }} />
      </IconButton>
    </Box>
  </Box>
);

const ESPSlider = ({ title, children }) => {
  const scrollRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = React.useState(false);
  const [canScrollRight, setCanScrollRight] = React.useState(false);

  const checkScroll = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      setCanScrollLeft(scrollLeft > 2); // 2px buffer for sub-pixel issues
      setCanScrollRight(scrollLeft + clientWidth < scrollWidth - 2);
    }
  };

  React.useEffect(() => {
    // Initial check with a slight delay to ensure layout is done
    const timer = setTimeout(checkScroll, 100);
    
    const currentRef = scrollRef.current;
    if (currentRef) {
      currentRef.addEventListener('scroll', checkScroll);
      window.addEventListener('resize', checkScroll);
    }
    
    return () => {
      clearTimeout(timer);
      if (currentRef) {
        currentRef.removeEventListener('scroll', checkScroll);
        window.removeEventListener('resize', checkScroll);
      }
    };
  }, [children]);

  const handleNext = () => {
    if (scrollRef.current) {
      const scrollAmount = scrollRef.current.clientWidth;
      scrollRef.current.scrollBy({
        left: scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  const handlePrev = () => {
    if (scrollRef.current) {
      const scrollAmount = scrollRef.current.clientWidth;
      scrollRef.current.scrollBy({
        left: -scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  return (
    <Box sx={{ width: '100%', my: 6 }}>
      <ESPSectionHeader 
        title={title} 
        onPrev={handlePrev} 
        onNext={handleNext}
        prevDisabled={!canScrollLeft}
        nextDisabled={!canScrollRight}
      />
      <Box
        ref={scrollRef}
        sx={{
          display: 'flex',
          overflowX: 'auto',
          gap: 3,
          pb: 2,
          scrollSnapType: 'x mandatory',
          // Hide scrollbar but keep functionality
          '&::-webkit-scrollbar': { display: 'none' },
          msOverflowStyle: 'none',
          scrollbarWidth: 'none',
          '& > *': {
            flexShrink: 0,
            scrollSnapAlign: 'start',
          }
        }}
      >
        {children}
      </Box>
    </Box>
  );
};

export default ESPSlider;
export { ESPSectionHeader };
