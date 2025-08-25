import React from 'react';
import { 
  Card, 
  CardContent, 
  Typography, 
  Box, 
  Avatar, 
  Skeleton,
  useTheme,
  Paper,
  LinearProgress,
  IconButton
} from '@mui/material';
import {
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
  MoreVert as MoreVertIcon,
  ArrowForward as ArrowForwardIcon
} from '@mui/icons-material';

const StatsCard = ({ 
  title, 
  value, 
  icon, 
  color = '#1976d2', 
  isLoading = false, 
  trend = null, 
  trendValue = null,
  subtitle = null,
  variant = 'default'
}) => {
  const theme = useTheme();

  return (
    <Paper
      elevation={0}
      sx={{ 
        height: '100%', 
        position: 'relative', 
        overflow: 'visible',
        transition: 'all 0.2s ease',
        borderRadius: 2,
        border: '1px solid',
        borderColor: 'divider',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: theme.shadows[3],
          borderColor: 'transparent'
        }
      }}
    >
      {/* Progress indicator on top of card */}
      <Box 
        sx={{ 
          position: 'absolute', 
          top: 0, 
          left: 0, 
          right: 0, 
          height: 4, 
          borderTopLeftRadius: 8,
          borderTopRightRadius: 8,
          overflow: 'hidden'
        }}
      >
        <LinearProgress 
          variant="determinate" 
          value={trend === 'up' ? 70 : 30} 
          sx={{
            height: '100%',
            bgcolor: 'transparent',
            '& .MuiLinearProgress-bar': {
              bgcolor: color
            }
          }}
        />
      </Box>
      
      <CardContent sx={{ pb: '16px !important', pt: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <Box sx={{ flex: 1 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Typography 
                color="textSecondary" 
                gutterBottom 
                variant="overline" 
                sx={{ 
                  fontSize: '0.75rem', 
                  fontWeight: 700,
                  letterSpacing: 0.5 
                }}
              >
                {title}
              </Typography>
              
              <IconButton 
                size="small"
                sx={{ 
                  width: 18, 
                  height: 18, 
                  opacity: 0.6,
                  '&:hover': { opacity: 1 }
                }}
              >
                <MoreVertIcon fontSize="small" sx={{ fontSize: 14 }} />
              </IconButton>
            </Box>
            
            <Box sx={{ display: 'flex', alignItems: 'flex-end', mt: 1 }}>
              <Typography 
                variant={variant === 'large' ? 'h3' : 'h4'} 
                component="div" 
                sx={{ 
                  fontWeight: 700, 
                  color: theme.palette.text.primary, 
                  lineHeight: 1,
                  letterSpacing: -0.5
                }}
              >
                {isLoading ? (
                  <Skeleton variant="text" width={80} height={variant === 'large' ? 50 : 40} />
                ) : (
                  value || 0
                )}
              </Typography>
              
              {trend && trendValue && (
                <Box 
                  sx={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: 0.5,
                    ml: 1,
                    mb: 0.5
                  }}
                >
                  {trend === 'up' ? (
                    <TrendingUpIcon sx={{ fontSize: 16, color: 'success.main' }} />
                  ) : (
                    <TrendingDownIcon sx={{ fontSize: 16, color: 'error.main' }} />
                  )}
                  <Typography 
                    variant="caption" 
                    sx={{ 
                      color: trend === 'up' ? 'success.main' : 'error.main',
                      fontWeight: 600,
                      fontSize: '0.7rem'
                    }}
                  >
                    {trendValue}
                  </Typography>
                </Box>
              )}
            </Box>

            {subtitle && (
              <Typography 
                variant="body2" 
                color="text.secondary" 
                sx={{ mt: 1, fontSize: '0.75rem' }}
              >
                {subtitle}
              </Typography>
            )}
          </Box>
          
          <Avatar
            sx={{
              bgcolor: `${color}15`,
              color: color,
              width: 56,
              height: 56,
              ml: 1.5,
              boxShadow: '0 4px 8px rgba(0,0,0,0.05)'
            }}
          >
            {isLoading ? (
              <Skeleton variant="circular" width={28} height={28} />
            ) : (
              icon
            )}
          </Avatar>
        </Box>
        
        {/* Bottom action link */}
        <Box 
          sx={{ 
            display: 'flex', 
            alignItems: 'center',
            mt: 2,
            pt: 2,
            borderTop: '1px dashed',
            borderColor: 'divider',
            opacity: 0.7,
            transition: 'opacity 0.2s ease',
            '&:hover': {
              opacity: 1
            }
          }}
        >
          <Typography 
            variant="caption" 
            sx={{ 
              fontSize: '0.7rem',
              fontWeight: 500,
              cursor: 'pointer',
              color: color
            }}
          >
            Xem chi tiết
          </Typography>
          <ArrowForwardIcon sx={{ fontSize: 12, ml: 0.5, color: color }} />
        </Box>
      </CardContent>
    </Paper>
  );
};

export default StatsCard;
