import React, { useState, useEffect } from 'react';
import { AppBar, Typography, Toolbar, Avatar, Button } from '@material-ui/core';
import { Link, useHistory, useLocation } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import decode from 'jwt-decode';
import useStyles from './styles';
import memoriesLogo from '../../images/memories-Logo.png';
import memoriesText from '../../images/memories-Text.png';
import { signin } from '../../actions/auth';

const Navbar = () => {
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('profile')));
  const formData = {
    email: "testUser@gmail.com",
    password: "test1234"
  };
  const dispatch = useDispatch();
  const location = useLocation();
  const history = useHistory();
  const classes = useStyles();

  const logout = () => {
    dispatch({ type: 'LOGOUT' });
    history.push('/');
    setUser(null);
  };

  useEffect(() => {
    const token = user?.token;

    if (token) {
      const decodedToken = decode(token);
      // console.log(decodedToken);
      if (decodedToken.exp * 1000 < new Date().getTime()) logout();
    }

    setUser(JSON.parse(localStorage.getItem('profile')));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location]);


  function handleTestButtonClick(e) {
    e.preventDefault();
    dispatch(signin(formData, history));
  }

  return (
    <AppBar className={classes.appBar} position='static' color='inherit'>
      {/* <div> */}
      <Link to='/' className={classes.brandContainer}>
        <img
          className={classes.image}
          src={memoriesText}
          alt='icon'
          height='45px'
        />
        <img
          className={classes.image}
          src={memoriesLogo}
          alt='icon'
          height='40px'
        />
      </Link>
      {/* </div> */}
      <Toolbar className={classes.toolbar}>
        {user ? (
          <div className={classes.profile}>
            <Avatar
              className={classes.purple}
              alt={user.result.name}
              src={user.result.imageUrl}
            >
              {user.result.name.charAt(0)}
            </Avatar>
            <Typography className={classes.userName} variant='h6'>
              {user.result.name}
            </Typography>
            <Button
              variant='contained'
              className={classes.logout}
              color='secondary'
              onClick={logout}
            >
              Logout
            </Button>
          </div>
        ) : (
          <>
            <Button
              component={Link}
              to='/auth'
              variant='contained'
              color='primary'
              style={{ margin: '5px' }}
              onClick={(e) => handleTestButtonClick(e)}
            >
              Test User Sign In
            </Button>
            <Button
              component={Link}
              to='/auth'
              variant='contained'
              color='primary'
            >
              Sign In
            </Button>
          </>
        )

        }
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
