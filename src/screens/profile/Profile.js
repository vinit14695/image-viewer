import React, { Component } from "react";
import "./Profile.css";
import IconButton from "@material-ui/core/IconButton";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import PopupState, { bindTrigger, bindMenu } from "material-ui-popup-state";
import GridList from "@material-ui/core/GridList";
import GridListTile from "@material-ui/core/GridListTile";
import Card from "@material-ui/core/Card";
import CardMedia from "@material-ui/core/CardMedia";
import Avatar from "@material-ui/core/Avatar";
import FavoriteIcon from "@material-ui/icons/Favorite";
import FavoriteBorderIcon from "@material-ui/icons/FavoriteBorder";
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import Input from "@material-ui/core/Input";
import Button from "@material-ui/core/Button";
import EditIcon from "@material-ui/icons/Edit";
import Fab from "@material-ui/core/Fab";
import ReactDOM from "react-dom";
import Login from "../login/Login";
import Modal from "react-modal";
import Typography from "@material-ui/core/Typography";
import Home from "../home/Home";

//Style for the full name edit div
const customStyles = {
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)",
  },
};

const TabContainer = function (props) {
  return (
    <Typography component="div" style={{ padding: 0 }}>
      {props.children}
    </Typography>
  );
};

class Profile extends Component {
  constructor() {
    super();
    this.state = {
      loggedIn: sessionStorage.getItem("access-token") == null ? false : true,
      searchString: "",
      comment: "",
      modalIsOpen: false,
      modelDetailsIsOpen: false,
      updated_full_name: "",
      postDetails: {
        id: "",
        user: {
          id: "",
          full_name: "",
          profilePicture: "",
          username: "",
        },
        images: {
          thumbnail: {
            width: 150,
            height: 150,
            url: "",
          },
          low_resolution: {
            width: 0,
            height: 0,
            url: "",
          },
          standard_resolution: {
            width: 0,
            height: 0,
            url: "",
          },
        },
        created_time: "",
        caption: {
          id: "",
          text: "",
          created_time: "",
          from: {
            id: "",
            full_name: "",
            profilePicture: "",
            username: "",
          },
        },
        user_has_liked: false,
        likes: {
          count: 0,
        },
        tags: [],
        filter: "",
        comments: {
          count: 0,
        },
        type: "",
        link: "",
        location: {
          latitude: 0,
          longitude: 0,
          name: "",
          id: 0,
        },
        attribution: null,
        users_in_photo: [],
        user_comments: "",
        user_commented: false,
      },
      profileData: {
        data: {
          id: "",
          username: "",
          profilePicture: "",
          full_name: "",
          bio: "",
          website: "",
          is_business: false,
          counts: {
            media: 0,
            follows: 0,
            followed_by: 0,
          },
        },
        meta: {
          code: 0,
        },
      },
      pageData: [
        {
          id: "",
          user: {
            id: "",
            full_name: "",
            profilePicture: "",
            username: "",
          },
          images: {
            thumbnail: {
              width: 150,
              height: 150,
              url: "",
            },
            low_resolution: {
              width: 0,
              height: 0,
              url: "",
            },
            standard_resolution: {
              width: 0,
              height: 0,
              url: "",
            },
          },
          created_time: "",
          caption: {
            id: "",
            text: "",
            created_time: "",
            from: {
              id: "",
              full_name: "",
              profilePicture: "",
              username: "",
            },
          },
          user_has_liked: false,
          likes: {
            count: 0,
          },
          tags: [],
          filter: "",
          comments: {
            count: 0,
          },
          type: "",
          link: "",
          location: {
            latitude: 0,
            longitude: 0,
            name: "",
            id: 0,
          },
          attribution: null,
          users_in_photo: [],
          user_comments: "",
          user_commented: false,
        },
      ],
    };
  }

  //Fetch posts from instagram
  getPageData() {
    let that = this;
    let data = null;
    let xhrMovie = new XMLHttpRequest();
    xhrMovie.addEventListener("readystatechange", function () {
      if (this.readyState === 4) {
        that.setState({
          pageData: JSON.parse(this.responseText).data,
        });
      }
    });

    xhrMovie.open(
      "GET",
      "https://api.instagram.com/v1/users/self/media/recent?access_token=" +
        sessionStorage.getItem("access-token")
    );
    xhrMovie.setRequestHeader("Cache-Control", "no-cache");
    xhrMovie.send(data);
  }

  //Fetch the profile information on load.
  componentWillMount() {
    let that = this;
    let data = null;
    let xhrMovie = new XMLHttpRequest();
    xhrMovie.addEventListener("readystatechange", function () {
      if (this.readyState === 4) {
        that.setState({
          profileData: JSON.parse(this.responseText),
        });

        that.getPageData();
      }
    });

    xhrMovie.open(
      "GET",
      "https://api.instagram.com/v1/users/self/?access_token=" +
        sessionStorage.getItem("access-token")
    );
    xhrMovie.setRequestHeader("Cache-Control", "no-cache");
    xhrMovie.send(data);
  }

  //Likes or unlike the post
  likePost(data) {
    let dataList = [];
    for (let item of this.state.pageData) {
      let post = item;
      if (item.id === data.id) {
        data.user_has_liked === true
          ? (post.user_has_liked = false)
          : (post.user_has_liked = true);
        post.user_has_liked === false
          ? (post.likes.count = post.likes.count - 1)
          : (post.likes.count = post.likes.count + 1);
      }
      dataList.push(post);
    }
    this.setState({ pageData: dataList });
  }

  //Capture comment text
  commentTextChangeHandler = (e) => {
    this.setState({ comment: e.target.value });
  };

  //Add comment text to the div
  AddCommentClickHandler = (data) => {
    if (this.state.comment === "") return;

    let dataList = [];
    for (let item of this.state.pageData) {
      let post = item;
      if (item.id === data.id) {
        post.user_comments = this.state.comment;
        post.user_commented = true;
      }
      dataList.push(post);
    }
    this.setState({ pageData: dataList });
    this.setState({ comment: "" });
    console.log(this.state.comment);
  };

  //Clears the session token and navigate to login page
  logout() {
    sessionStorage.clear();
    console.log(sessionStorage.getItem("access-token"));
    ReactDOM.render(<Login />, document.getElementById("root"));
  }

  //Name update model open and close handles
  openModelHandler = () => {
    this.setState({ modalIsOpen: true });
  };

  closeModalHandler = () => {
    this.setState({ modalIsOpen: false });
  };

  inputFullChangeHandler = (e) => {
    this.setState({ updated_full_name: e.target.value });
    console.log(this.state.updated_full_name);
  };

  //Updates the name
  updateClickHandler = () => {
    this.setState({ modalIsOpen: false });
    console.log(this.state.updated_full_name);
    let updatedProfileData = this.state.profileData;
    updatedProfileData.data.full_name = this.state.updated_full_name;
    this.setState({ profileData: updatedProfileData });
  };

  //Open post details when clicked
  showPostDetails = (data) => {
    this.setState({ postDetails: data });
    this.setState({ modelDetailsIsOpen: true });
  };

  //Open post details modal
  openPostsModelHandler = () => {
    this.setState({ modelDetailsIsOpen: true });
  };

  //Close post details modal
  closePostsModelHandler = () => {
    this.setState({ modelDetailsIsOpen: false });
  };

  //When logo is clicked, set the session token and navigate to home page.
  goToHome = () => {
    sessionStorage.setItem(
      "access-token",
      "8661035776.d0fcd39.39f63ab2f88d4f9c92b0862729ee2784"
    );
    ReactDOM.render(<Home />, document.getElementById("root"));
  };

  render() {
    return (
      <div>
        <header className="app-header-home">
          <label className="app-text" onClick={this.goToHome}>
            Image viewer
          </label>
          <div className="app-sub-header">
            <PopupState variant="popover" popupId="demo-popup-menu">
              {(popupState) => (
                <React.Fragment>
                  <IconButton
                    color="primary"
                    className="profile-picture"
                    {...bindTrigger(popupState)}
                  >
                    <img
                      src={this.state.profileData.data.profile_picture}
                      className="profile_img"
                      alt={this.state.profileData.data.username}
                    />
                  </IconButton>
                  <Menu {...bindMenu(popupState)} className="menu-container">
                    <MenuItem onClick={this.logout}>Logout</MenuItem>
                  </Menu>
                </React.Fragment>
              )}
            </PopupState>
          </div>
        </header>
        <div className="profile-Info">
          <IconButton color="primary" className="profile-picture-body">
            <img
              src={this.state.profileData.data.profile_picture}
              className="profile-img-large"
              alt={this.state.profileData.data.username}
            />
          </IconButton>
          <div className="profile-data">
            <div>
              <span className="profile-username">
                {this.state.profileData.data.username}
              </span>
              <div className="profile-stats">
                <span className="counts-media">
                  {" "}
                  Posts: {this.state.profileData.data.counts.media}{" "}
                </span>
                <span className="counts">
                  {" "}
                  Follows: {this.state.profileData.data.counts.follows}{" "}
                </span>
                <span className="counts">
                  {" "}
                  Followed By: {
                    this.state.profileData.data.counts.followed_by
                  }{" "}
                </span>
              </div>
              <div className="profile-full-name">
                {this.state.profileData.data.full_name}
                <span className="span-fab">
                  <Fab
                    size="small"
                    color="secondary"
                    className="edit-button"
                    onClick={this.openModelHandler}
                  >
                    <EditIcon />
                  </Fab>
                </span>
              </div>
            </div>
          </div>
        </div>
        <Modal
          ariaHideApp={false}
          isOpen={this.state.modalIsOpen}
          contentLabel="Update"
          onRequestClose={this.closeModalHandler}
          style={customStyles}
        >
          <TabContainer>
            <FormControl>
              <label className="edit-label">Edit</label>
            </FormControl>
            <FormControl>
              <InputLabel htmlFor="fullName" required>
                Full Name
              </InputLabel>
              <Input
                id="fullName"
                type="text"
                fullName={this.state.updated_full_name}
                onChange={this.inputFullChangeHandler}
              />
            </FormControl>
            <br />
            <br />
            <Button
              variant="contained"
              color="primary"
              onClick={this.updateClickHandler}
            >
              UPDATE
            </Button>
          </TabContainer>
        </Modal>

        <GridList cellHeight={300} cols={3}>
          {this.state.pageData.map((data) => (
            <GridListTile
              className="grid-item"
              key={"grid" + data.id}
              style={{ height: "auto" }}
              onClick={() => this.showPostDetails(data)}
            >
              <Card className="postsImages">
                <CardMedia>
                  <img
                    src={data.images.standard_resolution.url}
                    className="movie-poster"
                    alt="test"
                  />
                </CardMedia>
              </Card>
            </GridListTile>
          ))}
        </GridList>

        <Modal
          ariaHideApp={false}
          isOpen={this.state.modelDetailsIsOpen}
          contentLabel="Update"
          onRequestClose={this.closePostsModelHandler}
          style={customStyles}
        >
          <div className="post-details">
            <div className="post-image-div">
              <img
                src={this.state.postDetails.images.standard_resolution.url}
                className="post-image"
                alt="test"
              />
            </div>
            <div className="post-user-container">
              <div className="post-info">
                <span>
                  {
                    <Avatar aria-label="recipe">
                      <img
                        src={
                          this.state.postDetails.caption.from.profile_picture
                        }
                        className="posted-by"
                        alt="test"
                      />
                    </Avatar>
                  }
                </span>
                <span className="span-user-name">
                  {this.state.postDetails.user.username}
                </span>
              </div>
              <hr className="horizontal-rule-style" />
              <div>{this.state.postDetails.caption.text.split("\n")[0]}</div>
              <div className="hashTags">
                {this.state.postDetails.tags.map((tag) => (
                  <span key={this.state.postDetails.id + tag}>#{tag} </span>
                ))}
              </div>
              <div className="div-comments">
                <div className="likes-div">
                  <IconButton
                    onClick={() => this.likePost(this.state.postDetails)}
                  >
                    {this.state.postDetails.user_has_liked === true ? (
                      <FavoriteIcon className="fav-icon-color" />
                    ) : (
                      <FavoriteBorderIcon />
                    )}
                  </IconButton>
                  <span className="like-counter">
                    {" "}
                    {this.state.postDetails.likes.count} Likes
                  </span>
                </div>
                <div
                  className="comments-show"
                  style={{
                    display: this.state.postDetails.user_commented
                      ? "block"
                      : "none",
                  }}
                >
                  <span className="comment-username">
                    {this.state.postDetails.user.username}:
                  </span>
                  <span> {this.state.postDetails.user_comments}</span>
                </div>
                <div className="comment-section">
                  <FormControl>
                    <InputLabel
                      htmlFor={"inputComment" + this.state.postDetails.id}
                    >
                      Add a comment
                    </InputLabel>
                    <Input
                      id={"inputComment" + this.state.postDetails.id}
                      type="text"
                      inputcomment={this.state.comment}
                      onChange={this.commentTextChangeHandler}
                    />
                  </FormControl>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() =>
                      this.AddCommentClickHandler(this.state.postDetails)
                    }
                  >
                    ADD
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </Modal>
      </div>
    );
  }
}
export default Profile;
