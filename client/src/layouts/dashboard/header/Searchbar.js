import { useState, useEffect } from 'react';
import { styled } from '@mui/material/styles';
import {
  Input,
  Slide,
  Button,
  IconButton,
  InputAdornment,
  ClickAwayListener,
  Paper
} from '@mui/material';
import { bgBlur } from '../../../utils/cssStyles';
import Iconify from '../../../components/iconify';

const HEADER_MOBILE = 64;
const HEADER_DESKTOP = 92;

const StyledSearchbar = styled('div')(({ theme }) => ({
  ...bgBlur({ color: theme.palette.background.default }),
  top: 0,
  left: 0,
  zIndex: 99,
  width: '100%',
  display: 'flex',
  position: 'absolute',
  alignItems: 'center',
  height: HEADER_MOBILE,
  padding: theme.spacing(0, 3),
  boxShadow: theme.customShadows.z8,
  [theme.breakpoints.up('md')]: {
    height: HEADER_DESKTOP,
    padding: theme.spacing(0, 5),
  },
}));

const SearchResult = styled('div')(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
  borderRadius: 10,
  top: 0,
  left: 0,
  zIndex: 999,
  width: '100%',
  display: 'flex',
  position: 'absolute',
  alignItems: 'center',
  height: HEADER_MOBILE,
  padding: theme.spacing(0, 3),
  boxShadow: theme.customShadows.z8,
  [theme.breakpoints.up('md')]: {
    height: HEADER_DESKTOP,
    padding: theme.spacing(0, 5),
  },
  marginTop: theme.spacing(11)
}));

export default function Searchbar() {
  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState('');

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
    }, 400);

    return () => {
      clearTimeout(timeoutId);
    };
  }, [searchQuery]);

  const handleOpen = () => {
    setOpen(!open);
  };

  const handleClose = () => {
    setOpen(false);
    setSearchResults([]);
  };

  const handleSearch = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/search-users?q=${debouncedSearchQuery}`);
      if (!response.ok) {
        throw new Error('Failed to fetch search results');
      }
      const data = await response.json();
      setSearchResults(data.results);
    } catch (error) {
      console.error('Error searching users:', error);
    }
  };

  console.log(searchResults);

  return (
    <ClickAwayListener onClickAway={handleClose}>
      <div>
        {!open && (
          <IconButton onClick={handleOpen}>
            <Iconify icon="eva:search-fill" />
          </IconButton>
        )}

        <Slide direction="down" in={open} mountOnEnter unmountOnExit>
          <StyledSearchbar>
            <Input
              autoFocus
              fullWidth
              disableUnderline
              placeholder="Type in user's name, email or name to search..."
              startAdornment={
                <InputAdornment position="start">
                  <Iconify icon="eva:search-fill" sx={{ color: 'text.disabled', width: 20, height: 20 }} />
                </InputAdornment>
              }
              sx={{ mr: 1, fontWeight: 'fontWeightBold' }}
              
              onChange={(event) => setSearchQuery(event.target.value)}
              onKeyDown={(event) => {if (event.key === 'Enter') { handleSearch();}
            }}
  
            />
            <Button variant="contained" onClick={handleSearch}>
              Search
            </Button>
          </StyledSearchbar>
        </Slide>

        {open && searchResults.length > 0 && (
          <div style={{ zIndex: 999 }}> {/* Adjusted position and z-index */}
            {searchResults.map((user) => (
              <SearchResult key={user._id} sx={{ color: 'black', fontWeight: 'fontWeightBold'}}>
                {user.first_name} {user.last_name}
              </SearchResult>
            ))}
          </div>
        )}
        
      </div>
    </ClickAwayListener>
  );
}
