import React from 'react';
import { 
  Card, 
  CardContent, 
  Typography, 
  Box, 
  Avatar, 
  Skeleton,
  useTheme 
} from '@mui/material';
import {
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
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
    <Card sx={{ 
      height: '100%', 
      position: 'relative', 
      overflow: 'visible',
      transition: 'all 0.3s ease',
      '&:hover': {
        transform: 'translateY(-4px)',
        boxShadow: theme.shadows[8],
      }
    }}>
      <CardContent sx={{ pb: '16px !important' }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <Box sx={{ flex: 1 }}>
            <Typography 
              color="textSecondary" 
              gutterBottom 
              variant="overline" 
              sx={{ fontSize: '0.75rem', fontWeight: 600 }}
            >
              {title}
            </Typography>
            
            <Typography 
              variant={variant === 'large' ? 'h3' : 'h4'} 
              component="div" 
              sx={{ 
                fontWeight: 'bold', 
                color: color, 
                mb: 1,
                lineHeight: 1.2
              }}
            >
              {isLoading ? (
                <Skeleton variant="text" width={80} height={variant === 'large' ? 50 : 40} />
              ) : (
                value || 0
              )}
            </Typography>

            {subtitle && (
              <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                {subtitle}
              </Typography>
            )}
            
            {trend && trendValue && (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                {trend === 'up' ? (
                  <TrendingUpIcon sx={{ fontSize: 16, color: 'success.main' }} />
                ) : (
                  <TrendingDownIcon sx={{ fontSize: 16, color: 'error.main' }} />
                )}
                <Typography 
                  variant="caption" 
                  sx={{ 
                    color: trend === 'up' ? 'success.main' : 'error.main',
                    fontWeight: 600
                  }}
                >
                  {trendValue}
                </Typography>
              </Box>
            )}
          </Box>
          
          <Avatar
            sx={{
              bgcolor: `${color}20`,
              color: color,
              width: 48,
              height: 48,
              ml: 1
            }}
          >
            {isLoading ? (
              <Skeleton variant="circular" width={24} height={24} />
            ) : (
              icon
            )}
          </Avatar>
        </Box>
      </CardContent>
    </Card>
  );
};

export default StatsCard;
