import React, { useEffect } from 'react';
import {
  Paper,
  Typography,
  // CircularProgress,
  Divider,
  Grid,
} from '@material-ui/core/';
import { Instagram } from 'react-content-loader';

import { useDispatch, useSelector } from 'react-redux';
import moment from 'moment';
import { useParams, useHistory } from 'react-router-dom';
import Comments from './Comments';
import PostComment from '../Posts/Post/Post';

import { getPost, getPostsBySearch } from '../../actions/posts';
import useStyles from './styles';
import useStyles3 from '../Posts/styles';

const Post = () => {
  const { post, posts, isLoading } = useSelector((state) => state.posts);
  const dispatch = useDispatch();
  const history = useHistory();
  const classes = useStyles();
  const { id } = useParams();
  const classes3 = useStyles3();

  useEffect(() => {
    dispatch(getPost(id));
  }, [dispatch, id]);

  useEffect(() => {
    if (post) {
      dispatch(
        getPostsBySearch({ search: 'none', tags: post?.tags.join(',') })
      );
    }
  }, [dispatch, post]);

  if (!post) return null;

  const openPost = (_id) => history.push(`/posts/${_id}`);

  if (isLoading) {
    return (
      <Paper elevation={6}>
        <Instagram />
      </Paper>
    );
  }
  const recommendedPosts = posts.filter(({ _id }) => _id !== post._id);

  return (
    <Paper style={{ padding: '20px', borderRadius: '15px' }} elevation={6}>
      <div className={classes.card}>
        <div className={classes.section}>
          <Typography variant='h3' component='h2'>
            {post.title}
          </Typography>
          <Typography
            gutterBottom
            variant='h6'
            color='textSecondary'
            component='h2'
          >
            {post.tags.map((tag) => `#${tag} `)}
          </Typography>
          <Typography gutterBottom variant='body1' component='p'>
            {post.message}
          </Typography>
          <Typography variant='h6'>Created by: {post.name}</Typography>
          <Typography variant='body1'>
            {moment(post.createdAt).fromNow()}
          </Typography>
          <Divider style={{ margin: '20px 0' }} />
          <Typography variant='body1'>
            <strong>Realtime Chat - coming soon!</strong>
          </Typography>
          <Divider style={{ margin: '20px 0' }} />
          <Comments post={post} />
          <Divider style={{ margin: '20px 0' }} />
        </div>
        <div className={classes.imageSection}>
          <img
            className={classes.media}
            src={
              post.selectedFile ||
              'https://user-images.githubusercontent.com/194400/49531010-48dad180-f8b1-11e8-8d89-1e61320e1d82.png'
            }
            alt={post.title}
          />
        </div>
      </div>
      {recommendedPosts.length && (
        <div className={classes.section}>
          <Typography gutterBottom variant='h5'>
            You might also like:
          </Typography>
          <Divider />
          <div className={classes.recommendedPosts}>
            <Grid
              className={classes3.container}
              container
              alignItems='stretch'
              spacing={2}
            >
              {recommendedPosts.map((post) => (
                <Grid key={post._id} item xs={6} sm={6} md={4} lg={3}>
                  <div
                    style={{ margin: '20px', cursor: 'pointer' }}
                    onClick={() => openPost(post._id)}
                    key={post._id}
                  >
                    <PostComment post={post} />
                  </div>
                </Grid>
              ))}
            </Grid>
          </div>
        </div>
      )}
    </Paper>
  );
};

export default Post;
