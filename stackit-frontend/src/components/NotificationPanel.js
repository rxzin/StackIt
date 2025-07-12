import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Avatar,
  IconButton,
  Chip,
  Divider,
  Button,
  useTheme,
  useMediaQuery,
  Badge,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  ListItemSecondaryAction
} from '@mui/material';
import {
  Close,
  ThumbUp,
  Comment,
  CheckCircle,
  Person,
  QuestionAnswer,
  Star,
  MarkEmailRead,
  Delete
} from '@mui/icons-material';

const NotificationPanel = ({ open, onClose, notifications, onMarkAsRead, onDeleteNotification }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [filter, setFilter] = useState('all');

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'answer':
        return <QuestionAnswer color="primary" />;
      case 'comment':
        return <Comment color="info" />;
      case 'vote':
        return <ThumbUp color="success" />;
      case 'accepted':
        return <CheckCircle color="success" />;
      case 'mention':
        return <Person color="warning" />;
      case 'badge':
        return <Star color="warning" />;
      default:
        return <QuestionAnswer color="primary" />;
    }
  };

  const getNotificationColor = (type) => {
    switch (type) {
      case 'answer':
        return '#6366f1';
      case 'comment':
        return '#0ea5e9';
      case 'vote':
        return '#10b981';
      case 'accepted':
        return '#10b981';
      case 'mention':
        return '#f59e0b';
      case 'badge':
        return '#f59e0b';
      default:
        return '#6366f1';
    }
  };

  const formatTimeAgo = (timestamp) => {
    const now = new Date();
    const time = new Date(timestamp);
    const diffInMinutes = Math.floor((now - time) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    return `${Math.floor(diffInMinutes / 1440)}d ago`;
  };

  const filteredNotifications = notifications.filter(notification => {
    if (filter === 'unread') return !notification.read;
    if (filter === 'read') return notification.read;
    return true;
  });

  const unreadCount = notifications.filter(n => !n.read).length;

  if (!open) return null;

  return (
    <Box
      sx={{
        position: 'fixed',
        top: 0,
        right: 0,
        width: isMobile ? '100vw' : 400,
        height: '100vh',
        bgcolor: 'background.paper',
        boxShadow: 3,
        zIndex: 1300,
        display: 'flex',
        flexDirection: 'column',
        transform: open ? 'translateX(0)' : 'translateX(100%)',
        transition: 'transform 0.3s ease-in-out'
      }}
    >
      {/* Header */}
      <Box
        sx={{
          p: 2,
          borderBottom: '1px solid',
          borderColor: 'divider',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          bgcolor: '#232629',
          color: 'white'
        }}
      >
        <Box display="flex" alignItems="center" gap={1}>
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            Notifications
          </Typography>
          {unreadCount > 0 && (
            <Badge badgeContent={unreadCount} color="error" />
          )}
        </Box>
        <IconButton onClick={onClose} sx={{ color: 'white' }}>
          <Close />
        </IconButton>
      </Box>

      {/* Filter Tabs */}
      <Box sx={{ p: 2, borderBottom: '1px solid', borderColor: 'divider' }}>
        <Box display="flex" gap={1}>
          {['all', 'unread', 'read'].map((filterType) => (
            <Chip
              key={filterType}
              label={filterType.charAt(0).toUpperCase() + filterType.slice(1)}
              onClick={() => setFilter(filterType)}
              variant={filter === filterType ? 'filled' : 'outlined'}
              size="small"
              sx={{
                textTransform: 'capitalize',
                ...(filter === filterType && {
                  bgcolor: '#ec4899',
                  color: 'white',
                  '&:hover': { bgcolor: '#db2777' }
                })
              }}
            />
          ))}
        </Box>
      </Box>

      {/* Actions */}
      {unreadCount > 0 && (
        <Box sx={{ p: 2, borderBottom: '1px solid', borderColor: 'divider' }}>
          <Button
            size="small"
            startIcon={<MarkEmailRead />}
            onClick={() => notifications.forEach(n => !n.read && onMarkAsRead(n.id))}
            sx={{ textTransform: 'none' }}
          >
            Mark all as read
          </Button>
        </Box>
      )}

      {/* Notifications List */}
      <Box sx={{ flex: 1, overflow: 'auto' }}>
        {filteredNotifications.length === 0 ? (
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              height: '100%',
              p: 3,
              textAlign: 'center'
            }}
          >
            <Typography variant="h6" color="text.secondary" gutterBottom>
              No notifications
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {filter === 'unread' 
                ? "You're all caught up!" 
                : filter === 'read'
                ? "No read notifications"
                : "You'll see notifications here when you get them"
              }
            </Typography>
          </Box>
        ) : (
          <List sx={{ p: 0 }}>
            {filteredNotifications.map((notification, index) => (
              <React.Fragment key={notification.id}>
                <ListItem
                  sx={{
                    bgcolor: notification.read ? 'transparent' : 'rgba(99, 102, 241, 0.05)',
                    borderLeft: notification.read ? 'none' : `3px solid ${getNotificationColor(notification.type)}`,
                    '&:hover': { bgcolor: 'action.hover' },
                    cursor: 'pointer',
                    py: 2
                  }}
                  onClick={() => !notification.read && onMarkAsRead(notification.id)}
                >
                  <ListItemAvatar>
                    <Avatar
                      sx={{
                        bgcolor: getNotificationColor(notification.type),
                        width: 40,
                        height: 40
                      }}
                    >
                      {getNotificationIcon(notification.type)}
                    </Avatar>
                  </ListItemAvatar>
                  
                  <ListItemText
                    primary={
                      <Typography
                        variant="body2"
                        sx={{
                          fontWeight: notification.read ? 400 : 600,
                          mb: 0.5
                        }}
                      >
                        {notification.title}
                      </Typography>
                    }
                    secondary={
                      <Box>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                          {notification.message}
                        </Typography>
                        <Box display="flex" alignItems="center" justifyContent="space-between">
                          <Typography variant="caption" color="text.secondary">
                            {formatTimeAgo(notification.timestamp)}
                          </Typography>
                          {notification.questionTitle && (
                            <Chip
                              label={notification.questionTitle}
                              size="small"
                              variant="outlined"
                              sx={{ fontSize: '0.7rem', maxWidth: 150 }}
                            />
                          )}
                        </Box>
                      </Box>
                    }
                  />

                  <ListItemSecondaryAction>
                    <IconButton
                      edge="end"
                      size="small"
                      onClick={(e) => {
                        e.stopPropagation();
                        onDeleteNotification(notification.id);
                      }}
                      sx={{ opacity: 0.6, '&:hover': { opacity: 1 } }}
                    >
                      <Delete fontSize="small" />
                    </IconButton>
                  </ListItemSecondaryAction>
                </ListItem>
                
                {index < filteredNotifications.length - 1 && <Divider />}
              </React.Fragment>
            ))}
          </List>
        )}
      </Box>
    </Box>
  );
};

export default NotificationPanel;