import { gql, useQuery, NetworkStatus } from '@apollo/client'
import ErrorMessage from './ErrorMessage'
import PostUpvoter from './PostUpvoter'

import Container from '@material-ui/core/Container';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';

import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';

const useStyles = makeStyles({
  root: {
    minWidth: 275,
  },
  bullet: {
    display: 'inline-block',
    margin: '0 2px',
    transform: 'scale(0.8)',
  },
  title: {
    fontSize: 14,
  },
  pos: {
    marginBottom: 12,
  },
});

export const ALL_POSTS_QUERY = gql`
  query allPosts($first: Int!, $skip: Int!) {
    allPosts(orderBy: { createdAt: desc }, first: $first, skip: $skip) {
      id
      title
      votes
      url
      createdAt
    }
    _allPostsMeta {
      count
    }
  }
`

export const allPostsQueryVars = {
  skip: 0,
  first: 10,
}

export default function PostList() {
  const classes = useStyles()
  const { loading, error, data, fetchMore, networkStatus } = useQuery(
    ALL_POSTS_QUERY,
    {
      variables: allPostsQueryVars,
      // Setting this value to true will make the component rerender when
      // the "networkStatus" changes, so we are able to know if it is fetching
      // more data
      notifyOnNetworkStatusChange: true,
    }
  )

  const loadingMorePosts = networkStatus === NetworkStatus.fetchMore

  const loadMorePosts = () => {
    fetchMore({
      variables: {
        skip: allPosts.length,
      },
    })
  }

  if (error) return <ErrorMessage message="Error loading posts." />
  if (loading && !loadingMorePosts) return <div>Loading</div>

  const { allPosts, _allPostsMeta } = data
  const areMorePosts = allPosts.length < _allPostsMeta.count

  return (
    <section>
      <Container maxWidth="sm">
        <Box my={4}>
          <Typography variant="h4" component="h1" gutterBottom>
            Next.js example
          </Typography>
        </Box>
        {allPosts.map((post, index) => (
          <Card className={classes.root} key={post.id}>
            <CardContent>
              <Typography className={classes.title} color="textSecondary" gutterBottom>
                {post.title}
              </Typography>
              <Typography className={classes.pos} color="textSecondary">
                Votes: {post.votes}
              </Typography>
            </CardContent>
            <CardActions>
              <Button size="small">Learn More</Button>
            </CardActions>
          </Card>
        ))}
        {areMorePosts && (
        <Button onClick={() => loadMorePosts()} disabled={loadingMorePosts}>
          {loadingMorePosts ? 'Loading...' : 'Show More'}
        </Button>
      )}
      </Container>
    </section>
  )
}
