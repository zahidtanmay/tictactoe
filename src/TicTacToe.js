import React from "react";
import { connect } from "react-redux"

import Board from "./components/Board"
import Start from "./components/Start"

import CssBaseline from '@material-ui/core/CssBaseline';
import Typography from '@material-ui/core/Typography';
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import Close from '@material-ui/icons/Close';
import Check from '@material-ui/icons/Check';
import { withStyles } from '@material-ui/core/styles';
import './index.css'


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
    textAlign: 'center',
  },
  btn: {
    margin: 'auto',
  }

});



let TicTacToe = ({tiktac, classes}) => {
  const {gameStatus, channel, player, winner, error} = tiktac
  let {turn, } = tiktac
  turn++

  return (
      <div className="tictactoe-app">
        <React.Fragment>
          <CssBaseline />
          <Container maxWidth="sm">
            <Typography component="div" style={{ height: '100vh' }}>
              <Grid container justify="center">
                <h1>Tic Tac Toe</h1>
              </Grid>

              <Start/>



              {gameStatus === 3 && <div>

                <Grid container justify="center" >
                  <Grid container justify="center">
                    <Grid item className={classes.abc} ><div>You are Player: {player}    </div></Grid>

                    <Grid item className={classes.abc}>
                      <div>
                        {player % 2 !== 0 && <Close color="secondary"/>}
                        {player % 2 === 0 && <Check style={{ color: 'green' }} />}
                      </div>
                    </Grid>

                  </Grid>

                  <Grid container justify="center" >
                    <Grid container justify="center">
                      <Grid item className={classes.abc}><div>Next Turn: </div></Grid>


                      <Grid item className={classes.abc}>
                        <div>
                          {turn % 2 !== 0 && <Close color="secondary"/>}
                          {turn % 2 === 0 && <Check style={{ color: 'green' }} />}
                        </div>
                      </Grid>

                    </Grid>
                  </Grid>


                  <Grid item xs={12} className={classes.abc}>
                    {winner > 0 && <div>Player# {winner} Won.</div>}
                    {winner === -1 && <div>Match Drawn.</div>}
                  </Grid>

                </Grid>

                <br/>
                <br/>

                <Board/>
              </div>}

            </Typography>
          </Container>
        </React.Fragment>
      </div>
  );
}

const mapStateToProps = state => {
  const { tiktac } = state;
  return { tiktac };
};
TicTacToe = withStyles(useStyles)(TicTacToe)
export default connect(
    mapStateToProps
)(TicTacToe)