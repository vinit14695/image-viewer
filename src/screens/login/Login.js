import React, { Component } from "react";
import "./Login.css";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import Input from "@material-ui/core/Input";
import FormHelperText from "@material-ui/core/FormHelperText";
import ReactDOM from "react-dom";
import Home from "../home/Home";

//Login page Handler
class Login extends Component {
  constructor() {
    super();
    this.state = {
      modalIsOpen: false,
      value: 0,
      usernameRequired: "dispNone",
      username: "",
      loginPasswordRequired: "dispNone",
      loginPassword: "",
      accessToken: "",
      registrationSuccess: false,
      loggedIn: true,
    };
  }

  loginClickHandler = () => {
    this.state.username === ""
      ? this.setState({ usernameRequired: "dispBlock" })
      : this.setState({ usernameRequired: "dispNone" });
    this.state.loginPassword === ""
      ? this.setState({ loginPasswordRequired: "dispBlock" })
      : this.setState({ loginPasswordRequired: "dispNone" });
    if (this.state.username === "" || this.state.loginPassword === "") {
      this.setState({
        loggedIn: true,
      });
    } else {
      if (
        this.state.username === "upgrad" &&
        this.state.loginPassword === "upgrad"
      ) {
        sessionStorage.setItem(
          "access-token",
          "8661035776.d0fcd39.39f63ab2f88d4f9c92b0862729ee2784"
        );
        ReactDOM.render(<Home />, document.getElementById("root"));
      } else {
        this.setState({
          loggedIn: false,
        });
      }
    }
  };

  //Gets username
  inputUsernameChangeHandler = (e) => {
    this.setState({ username: e.target.value });
  };

  //Gets password
  inputLoginPasswordChangeHandler = (e) => {
    this.setState({ loginPassword: e.target.value });
  };

  //Displays the login page.
  render() {
    return (
      <div>
        <header className="app-header">
          <label className="app-text">Image viewer</label>
          <div className="app-card-div">
            <Card className="cardStyle">
              <CardContent>
                <Typography variant="headline" component="h2">
                  LOGIN
                </Typography>
                <FormControl required>
                  <InputLabel htmlFor="username">Username</InputLabel>
                  <Input
                    id="username"
                    type="text"
                    username={this.state.username}
                    onChange={this.inputUsernameChangeHandler}
                  />
                  <FormHelperText className={this.state.usernameRequired}>
                    <span className="red">required</span>
                  </FormHelperText>
                </FormControl>
                <br />
                <br />
                <FormControl required>
                  <InputLabel htmlFor="loginPassword">Password</InputLabel>
                  <Input
                    id="loginPassword"
                    type="password"
                    loginpassword={this.state.loginPassword}
                    onChange={this.inputLoginPasswordChangeHandler}
                  />
                  <FormHelperText className={this.state.loginPasswordRequired}>
                    <span className="red">required</span>
                  </FormHelperText>
                </FormControl>
                <br />
                <br />
                {this.state.loggedIn === false && (
                  <FormControl>
                    <span className="failedText">
                      Incorrect username and/or password
                    </span>
                  </FormControl>
                )}
                <br />
                <br />
                <Button
                  variant="contained"
                  color="primary"
                  onClick={this.loginClickHandler}
                >
                  LOGIN
                </Button>
              </CardContent>
            </Card>
          </div>
        </header>
      </div>
    );
  }
}

export default Login;
