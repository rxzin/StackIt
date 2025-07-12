import { useState } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Container,
  Button,
  Card,
  CardContent,
  Box,
  ThemeProvider,
  createTheme,
  CssBaseline,
  TextField,
  InputAdornment,
  Chip,
  Avatar,
  Stack,
  IconButton,
  Badge,
  Menu,
  MenuItem,
  FormControl,
  Select,
  Pagination,
  Divider
} from '@mui/material';
import {
  Search,
  Notifications,
  Add,
  KeyboardArrowDown,
  ThumbUp,
  Comment,
  Bookmark,
  Person
} from '@mui/icons-material';

// Modern theme with updated colors
const theme = createTheme({
  palette: {
    primary: {
      main: '#6366f1', // Modern indigo
    },
    secondary: {
      main: '#ec4899', // Vibrant pink
    },
    background: {
      default: '#f8fafc',
    },
  },
  typography: {
    fontFamily: '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif',
  },
});

// Mock data for questions
const mockQuestions = [
  {
    id: 1,
    title: "How to join 2 columns in a data set to make a separate column in SQL",
    description: "I do not know the code for it as I am a beginner. As an example what I need to do is like there is a column 1 containing First name, and column 2 consists of last name I want a column to combine ...",
    tags: ["sql", "database"],
    user: "John Doe",
    answers: 5,
    votes: 12,
    views: 234,
    timeAgo: "2 hours ago"
  },
  {
    id: 2,
    title: "React useState not updating state immediately",
    description: "I'm having trouble with useState hook not updating the state immediately when I call the setter function. The component doesn't re-render with the new value...",
    tags: ["react", "javascript", "hooks"],
    user: "Jane Smith",
    answers: 3,
    votes: 8,
    views: 156,
    timeAgo: "4 hours ago"
  },
  {
    id: 3,
    title: "Python list comprehension with multiple conditions",
    description: "How can I create a list comprehension with multiple if conditions? I want to filter items based on multiple criteria...",
    tags: ["python", "list-comprehension"],
    user: "Mike Johnson",
    answers: 2,
    votes: 15,
    views: 89,
    timeAgo: "1 day ago"
  }
];

function App() {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('Newest');
  const [notificationAnchor, setNotificationAnchor] = useState(null);
  const [notifications] = useState(3); // Mock notification count

  const handleNotificationClick = (event) => {
    setNotificationAnchor(event.currentTarget);
  };

  const handleNotificationClose = () => {
    setNotificationAnchor(null);
  };

  const QuestionCard = ({ question }) => (
    <Card sx={{ mb: 2, '&:hover': { boxShadow: 3 }, cursor: 'pointer' }}>
      <CardContent sx={{ p: 3 }}>
        <Box display="flex" gap={2}>
          {/* Vote/Answer Stats */}
          <Box display="flex" flexDirection="column" alignItems="center" minWidth={80}>
            <Typography variant="body2" color="text.secondary">
              {question.votes} votes
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {question.answers} answers
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {question.views} views
            </Typography>
          </Box>

          {/* Question Content */}
          <Box flex={1}>
            <Typography variant="h6" component="h3" sx={{ mb: 1, color: '#6366f1', fontWeight: 500 }}>
              {question.title}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              {question.description}
            </Typography>

            {/* Tags and User Info */}
            <Box display="flex" justifyContent="space-between" alignItems="center">
              <Stack direction="row" spacing={1}>
                {question.tags.map((tag, index) => (
                  <Chip
                    key={index}
                    label={tag}
                    size="small"
                    sx={{
                      bgcolor: '#e0e7ff',
                      color: '#6366f1',
                      fontSize: '0.75rem',
                      '&:hover': { bgcolor: '#c7d2fe' }
                    }}
                  />
                ))}
              </Stack>

              <Box display="flex" alignItems="center" gap={1}>
                <Avatar sx={{ width: 20, height: 20, fontSize: '0.75rem' }}>
                  {question.user.charAt(0)}
                </Avatar>
                <Typography variant="body2" color="text.secondary">
                  {question.user}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {question.timeAgo}
                </Typography>
              </Box>
            </Box>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />

      {/* Header */}
      <AppBar position="static" sx={{ bgcolor: '#232629', boxShadow: 'none', borderBottom: '1px solid #3c4146' }}>
        <Toolbar sx={{ px: 3 }}>
          <Typography variant="h5" component="div" sx={{ fontWeight: 'bold', color: '#ec4899' }}>
            StackIt
          </Typography>

          <Box sx={{ flexGrow: 1, mx: 4 }}>
            <TextField
              fullWidth
              placeholder="Search..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search sx={{ color: '#9fa6ad' }} />
                  </InputAdornment>
                ),
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  bgcolor: '#3c4146',
                  color: 'white',
                  '& fieldset': { border: 'none' },
                  '&:hover fieldset': { border: 'none' },
                  '&.Mui-focused fieldset': { border: '1px solid #ec4899' },
                },
                '& .MuiInputBase-input::placeholder': {
                  color: '#9fa6ad',
                  opacity: 1,
                },
              }}
            />
          </Box>

          <Box display="flex" alignItems="center" gap={2}>
            {/* Notifications */}
            <IconButton
              onClick={handleNotificationClick}
              sx={{ color: '#9fa6ad', '&:hover': { color: '#ec4899' } }}
            >
              <Badge badgeContent={notifications} color="error">
                <Notifications />
              </Badge>
            </IconButton>

            <Menu
              anchorEl={notificationAnchor}
              open={Boolean(notificationAnchor)}
              onClose={handleNotificationClose}
            >
              <MenuItem onClick={handleNotificationClose}>
                New answer to your question
              </MenuItem>
              <MenuItem onClick={handleNotificationClose}>
                Someone mentioned you in a comment
              </MenuItem>
              <MenuItem onClick={handleNotificationClose}>
                Your answer was accepted
              </MenuItem>
            </Menu>

            <Button
              variant="contained"
              sx={{
                bgcolor: '#ec4899',
                '&:hover': { bgcolor: '#db2777' },
                textTransform: 'none',
                fontWeight: 500
              }}
            >
              Login
            </Button>
          </Box>
        </Toolbar>
      </AppBar>

      {/* Main Content */}
      <Container maxWidth="lg" sx={{ py: 3 }}>
        <Box display="flex" gap={3}>
          {/* Main Content Area */}
          <Box flex={1}>
            {/* Action Bar */}
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
              <Typography variant="h4" sx={{ fontWeight: 500 }}>
                All Questions
              </Typography>

              <Button
                variant="contained"
                startIcon={<Add />}
                sx={{
                  bgcolor: '#ec4899',
                  '&:hover': { bgcolor: '#db2777' },
                  textTransform: 'none',
                  fontWeight: 500
                }}
              >
                Ask New Question
              </Button>
            </Box>

            {/* Filters */}
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
              <Typography variant="body1">
                {mockQuestions.length} questions
              </Typography>

              <Box display="flex" gap={1}>
                <Button
                  variant={sortBy === 'Newest' ? 'contained' : 'outlined'}
                  size="small"
                  onClick={() => setSortBy('Newest')}
                  sx={{ textTransform: 'none' }}
                >
                  Newest
                </Button>
                <Button
                  variant={sortBy === 'Unanswered' ? 'contained' : 'outlined'}
                  size="small"
                  onClick={() => setSortBy('Unanswered')}
                  sx={{ textTransform: 'none' }}
                >
                  Unanswered
                </Button>
                <FormControl size="small" sx={{ minWidth: 100 }}>
                  <Select
                    value="more"
                    displayEmpty
                    endAdornment={<KeyboardArrowDown />}
                    sx={{ textTransform: 'none' }}
                  >
                    <MenuItem value="more">more</MenuItem>
                    <MenuItem value="most-voted">Most Voted</MenuItem>
                    <MenuItem value="most-viewed">Most Viewed</MenuItem>
                  </Select>
                </FormControl>
              </Box>
            </Box>

            {/* Questions List */}
            <Box>
              {mockQuestions.map((question) => (
                <QuestionCard key={question.id} question={question} />
              ))}
            </Box>

            {/* Pagination */}
            <Box display="flex" justifyContent="center" mt={4}>
              <Pagination count={7} page={1} color="primary" />
            </Box>
          </Box>

          {/* Sidebar */}
          <Box width={300}>
            <Card sx={{ mb: 3 }}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  The Overflow Blog
                </Typography>
                <Divider sx={{ mb: 2 }} />
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  • Featured on Meta
                </Typography>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  • Hot Network Questions
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  • Community Guidelines
                </Typography>
              </CardContent>
            </Card>

            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Watched Tags
                </Typography>
                <Divider sx={{ mb: 2 }} />
                <Stack direction="row" spacing={1} flexWrap="wrap">
                  <Chip label="javascript" size="small" />
                  <Chip label="react" size="small" />
                  <Chip label="python" size="small" />
                  <Chip label="sql" size="small" />
                </Stack>
              </CardContent>
            </Card>
          </Box>
        </Box>
      </Container>
    </ThemeProvider>
  );
}

export default App;
