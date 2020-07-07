import React from 'react';
import { connect } from "react-redux";
import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import {statusChange, check, setError, initGame} from "../redux/actions";
import socketIOClient from "socket.io-client";
import axios from "axios"
import Snackbar from "./SnackBar";
const PUBLISH_URL = process.env.REACT_APP_PUBLISH_URL;
const ENDPOINT = process.env.REACT_APP_SOCKET_URL;



const useStyles = theme => ({
  root: {
    flexGrow: 2,
  },
  paper: {
    height: 50,
    width: 50,
  },
  control: {
    padding: theme.spacing(2),
  },

  abc: {
    padding: theme.spacing(2),
    textAlign: 'center',
  },
  btn: {
    margin: 'auto',
  }

});

class Start extends React.Component {

  constructor(props) {
    super(props);
    this.state = {value: '', error: false};
    this.gameStart = this.gameStart.bind(this)
    this.gameJoin = this.gameJoin.bind(this)
    this.makeid = this.makeid.bind(this)
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  componentDidMount() {
    const initScore = [
      [ {value: 0, status: false}, {value: 0, status: false}, {value: 0, status: false}, ],
      [ {value: 0, status: false}, {value: 0, status: false}, {value: 0, status: false}, ],
      [ {value: 0, status: false}, {value: 0, status: false}, {value: 0, status: false}, ],
    ]
    const gameStatus = parseInt(localStorage.getItem('gameStatus'))
    const channel = localStorage.getItem('channel')
    const player = parseInt(localStorage.getItem('player'))
    const turn = localStorage.getItem('turn') ? parseInt(localStorage.getItem('turn')) : 0
    const winner = localStorage.getItem('winner') ? parseInt(localStorage.getItem('winner')) : 0
    const scores = localStorage.getItem('scores') ? JSON.parse(localStorage.getItem('scores')) : initScore
    if (gameStatus && gameStatus !== 4 && channel && player) {
      this.props.statusChange({gameStatus: gameStatus, turn: turn, winner: winner, channel: channel, player: player, scores: scores})


      if ((gameStatus === 1 || gameStatus === 3) && player === 1) {
        const socket = socketIOClient(ENDPOINT);
        socket.on(channel, r => {
          const data = JSON.parse(r)
          if (data.from === 2 && data.reason === 'start') {
            this.props.statusChange({gameStatus: 3})
            let react = this
            axios.post(`${PUBLISH_URL}/publish/`, {token: channel, from: 1, reason: 'start'})
                .then(function (response) {console.log(response);})
                .catch(function (er) {
                  react.setState({error: true})
                  setInterval(() => { react.setState({error: false}) }, 3000);
                })

          }

          if (data.from === 2 && data.reason === 'gameplay') {
            console.log('frm 1', data.check)
            this.props.check(data.check)
          }

        });
      }

      if (gameStatus === 3 && player === 2) {
        console.log('stuck here')
        const socket = socketIOClient(ENDPOINT);
        socket.on(channel, r => {
          const data = JSON.parse(r)
          if (data.from === 1 && data.reason === 'gameplay') {
            this.props.check(data.check)
          }

        });
      }

    } else {
      localStorage.clear()
      this.props.initGame({})
    }



  }

  makeid(length) {
    var result           = '';
    var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for ( var i = 0; i < length; i++ ) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
  }


  async gameStart() {
    const token = this.makeid(10)
    // listen to chanel
    const socket = socketIOClient(ENDPOINT);
    let react = this
    try{
      axios.post(`${PUBLISH_URL}/store`, {token: token})
          .then(function (response) {
            localStorage.setItem('channel', token)
            localStorage.setItem('player', '1')
            react.props.statusChange({player: 1, gameStatus: 1, channel: token})
          })
          .catch(function (er) {
            react.setState({error: true})
            setTimeout(() => { react.setState({error: false}) }, 6000);
          })
    } catch (e) {
      console.log('error', e.response)
    }
    socket.on(token, r => {
      const data = JSON.parse(r)
      if (data.from === 2 && data.reason === 'start') {
        this.props.statusChange({gameStatus: 3})
        let react = this
        axios.post(`${PUBLISH_URL}/publish/`, {token: token, from: 1, reason: 'start'})
            .then(function (response) {})
            .catch(function (er) {
              react.setState({error: true})
              setTimeout(() => { react.setState({error: false}) }, 6000);
            })

      }

      if (data.from === 2 && data.reason === 'gameplay') {
        this.props.check(data.check)
      }

    });
  }

  gameJoin(row, col) {
    this.props.statusChange({player: 2, gameStatus: 2})

  }

  handleSubmit(event) {
    const token =  this.state.value
    const socket = socketIOClient(ENDPOINT);
    socket.on(token, r => {
      const data = JSON.parse(r)
      if (data.from === 1 && data.reason === 'start') {
        localStorage.setItem('channel', data.token)
        localStorage.setItem('player', '2')
        this.props.statusChange({gameStatus: 3, channel: data.token})
      }

      if (data.from === 1 && data.reason === 'gameplay') {
        this.props.check(data.check)
      }

    });
    event.preventDefault();
    let react = this
    axios.post(`${PUBLISH_URL}/publish/`, {token: token, from: 2, reason: 'start'})
        .then(function (response) {})
        .catch(function (er) {
          react.setState({error: true})
          setInterval(() => { react.setState({error: false}) }, 3000);
        })

  }

  handleChange(event) {
    this.setState({value: event.target.value});
  }

  render() {
    const {gameStatus, channel} = this.props.tiktac
    const {classes} = this.props
    return (
        <Grid className={classes.root} container justify="center">

          {gameStatus === 0 && <Grid container justify="center" >
            <Grid item xs={3} className={classes.abc}>
              <Button variant="contained" color="primary" onClick={(e) => this.gameStart()}>
                Start
              </Button>
            </Grid>

            <Grid item xs={3} className={classes.abc}>
              <Button variant="contained" color="secondary" onClick={(e) => this.gameJoin()}>
                Join
              </Button>
            </Grid>
          </Grid>}

          {gameStatus === 1 && <Grid container justify="center" >
            <Grid item xs={12} className={classes.abc}>
              <h4>Use this token to other player to join.</h4>
            </Grid>

            <Grid item xs={12} className={classes.abc}>
              <code>{channel}</code>
            </Grid>

            <Grid item xs={12} className={classes.abc}>
              <h5>Waiting for other player...</h5>
            </Grid>


          </Grid>}

          {gameStatus === 2 && <Grid container justify="center" >

            <Grid item xs={12} className={classes.abc}>
              <h4>Use token to join.</h4>
            </Grid>

            <Grid item xs={6} className={classes.abc}>
              <form className={classes.root} noValidate autoComplete="off">
                <TextField id="outlined-basic" label="Token" variant="outlined" value={this.state.value} onChange={this.handleChange} name="token" />
              </form>
            </Grid>



            <Grid item xs={3} className={classes.btn}>
              <Button variant="contained" color="secondary" type="button" onClick={this.handleSubmit}>
                Join
              </Button>
            </Grid>
          </Grid>}

          <Snackbar open={this.state.error}/>
        </Grid>
    );
  }

}

const mapStateToProps = state => {
  const { tiktac } = state;
  return { tiktac };
};

Start = withStyles(useStyles)(Start)

export default connect(
    mapStateToProps,
    {statusChange, check, setError, initGame},
    )(Start)