import React, { useState } from "react";
import { withStyles } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import Card from "@material-ui/core/Card";
import CardHeader from "@material-ui/core/CardHeader";
import CardMedia from "@material-ui/core/CardMedia";
import CardContent from "@material-ui/core/CardContent";
import CardActions from "@material-ui/core/CardActions";
import Collapse from "@material-ui/core/Collapse";
import Avatar from "@material-ui/core/Avatar";
import IconButton from "@material-ui/core/IconButton";
import Typography from "@material-ui/core/Typography";
import clsx from "clsx";
import { makeStyles } from "@material-ui/core/styles";
import CssBaseline from "@material-ui/core/CssBaseline";
import Grid from "@material-ui/core/Grid";
import FavoriteIcon from "@material-ui/icons/Favorite";
import ShareIcon from "@material-ui/icons/Share";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import { CircularProgress } from "@material-ui/core";
import { Link } from "react-router-dom";
import axios from "axios";
import { Formik } from "formik";
import * as Yup from "yup";
import { Container } from "@material-ui/core";
const useStyles = makeStyles((theme) => ({
  icon: {
    marginRight: theme.spacing(2),
  },
  heroContent: {
    backgroundColor: theme.palette.background.paper,
    padding: theme.spacing(8, 0, 6),
  },
  heroButtons: {
    marginTop: theme.spacing(4),
  },
  cardGrid: {
    paddingTop: theme.spacing(8),
    paddingBottom: theme.spacing(8),
  },
  card: {
    height: "100%",
    display: "flex",
    flexDirection: "column",
  },
  cardMedia: {
    paddingTop: "56.25%", // 16:9
  },
  cardContent: {
    flexGrow: 1,
  },
  large: {
    width: theme.spacing(5),
    height: theme.spacing(5),
  },
  footer: {
    backgroundColor: theme.palette.background.paper,
    padding: theme.spacing(6),
  },
}));

function Contact() {
  const classes = useStyles();

  const [isSubmitionCompleted, setSubmitionCompleted] = useState(false);
  const [expanded, setExpanded] = React.useState(false);
  const [repositories, setRepositories] = useState([]);

  const [loading, setLoading] = useState(false);
  const callingGithub = async (values, { setSubmitting }) => {
    setSubmitting(true);
    setLoading(true);
    await axios
      .get(`https://api.github.com/users/${values.name}/repos`)
      .then((response) => {
        setLoading(false);
        setRepositories(response.data);
        setSubmitionCompleted(true);
      });
  };

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  return (
    <React.Fragment>
      <React.Fragment>
        <CssBaseline />

        <main>
          <div className={classes.heroContent}>
            <Container maxWidth="lg">
              <Formik
                initialValues={{ name: "" }}
                onSubmit={callingGithub}
                validationSchema={Yup.object().shape({
                  name: Yup.string()
                    .required("name is required")
                    .min(3, "Minimun length must be 3"),
                })}
              >
                {(props) => {
                  const {
                    values,
                    touched,
                    errors,
                    dirty,
                    isSubmitting,
                    handleChange,
                    handleBlur,
                    handleSubmit,
                    handleReset,
                  } = props;
                  return (
                    <form onSubmit={handleSubmit}>
                      <TextField
                        label="name"
                        name="name"
                        className={classes.textField}
                        value={values.name}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        helperText={errors.name && touched.name && errors.name}
                        margin="normal"
                      />
                      <br />
                      <Button
                        type="button"
                        className="outline"
                        onClick={handleReset}
                        disabled={!dirty || isSubmitting}
                      >
                        Reset
                      </Button>
                      <Button type="submit" disabled={isSubmitting}>
                        Submit
                      </Button>
                      {/* <DisplayFormikState {...props} /> */}
                    </form>
                  );
                }}
              </Formik>
              {isSubmitionCompleted && (
                <h1 style={{ color: "black" }}>Repositories are loaded</h1>
              )}
            </Container>

            {loading ? (
              <CircularProgress />
            ) : (
              <Container className={classes.cardGrid} maxWidth="md">
                {/* End hero unit */}
                <Grid container spacing={4}>
                  {repositories.map((repository) => (
                    <Grid item key={repository.id} xs={12} sm={6} md={4}>
                      <Card className={classes.card} elevation={5}>
                        <CardHeader
                          avatar={
                            <Avatar
                              aria-label={repository.name}
                              src={repository.owner.avatar_url}
                              className={classes.large}
                            />
                          }
                          action={
                            <IconButton aria-label={repository.name}>
                              <MoreVertIcon />
                            </IconButton>
                          }
                          title={repository.name}
                          subheader={`Open issues count: ${repository.open_issues_count}`}
                        />
                        <CardMedia
                          className={classes.media}
                          title={repository.name}
                        />
                        <CardContent>
                          <Typography
                            variant="body2"
                            color="inherit"
                            component="p"
                          >
                            Watchers: {repository.watchers_count}
                          </Typography>

                          <Typography
                            variant="body2"
                            color="primary"
                            component="p"
                          >
                            Language:
                            {repository.language || "No language selected"}
                          </Typography>
                        </CardContent>
                        <CardActions disableSpacing>
                          <IconButton
                            aria-label="add to favorites"
                            size="small"
                          >
                            {repository.size}
                          </IconButton>

                          <Typography>
                            Created at: {repository.created_at}
                          </Typography>
                          <IconButton
                            className={clsx(classes.expand, {
                              [classes.expandOpen]: expanded,
                            })}
                            onClick={handleExpandClick}
                            aria-expanded={expanded}
                            aria-label="show more"
                          >
                            <ExpandMoreIcon />
                          </IconButton>
                        </CardActions>
                      </Card>
                    </Grid>
                  ))}
                </Grid>
              </Container>
            )}
          </div>
        </main>
      </React.Fragment>
    </React.Fragment>
  );
}

export default withStyles(useStyles)(Contact);
