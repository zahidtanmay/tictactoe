import React from 'react';
import { connect } from "react-redux";
import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import Close from '@material-ui/icons/Close';
import Check from '@material-ui/icons/Check';
import {check} from "../redux/actions";
import axios from "axios";
const PUBLISH_URL = process.env.REACT_APP_PUBLISH_URL;

const useStyles = theme => ({
  root: {
    flexGrow: 2,
  },
  paper: {
    height: 50,
    width: 50,
    padding: theme.spacing(2),
    textAlign: 'center',
  },
  control: {
    padding: theme.spacing(2),
  },

});

class Board extends React.Component {

  constructor(props) {
    super(props);
    this.handleClick = this.handleClick.bind(this)
  }



  handleClick(row, col) {
    const data = {row: row, col: col}
    this.props.check(data)
    const {player, channel} = this.props.tiktac
    axios.post(`${PUBLISH_URL}/publish/`, { from: player, reason: 'gameplay', check: data, token: channel, })
  }

  render() {
    let { scores, player, turn, winner } = this.props.tiktac
    const {classes} = this.props
    turn++
    return (
        <Grid className={classes.root}>

          {scores.map((row, ri) => (
              <Grid key={ri} xs={12} container justify="center" spacing={2} item>
                {row.map((col, ci) => (
                    <Grid item key={ci}>
                      <Button
                          variant="outlined"
                          className={classes.paper}
                          onClick={(e) => this.handleClick(ri, ci)}
                          disabled={(player === 1 && turn % 2 ===0) || (player === 2 && turn % 2 !== 0) || winner !== 0}
                      >
                        {/*{ri},{ci}, {col.value}, {col.status}*/}
                        {col.status && col.value === 1 && <Close color="secondary"/>}
                        {col.status && col.value === 2 && <Check style={{ color: 'green' }} />}
                      </Button>
                    </Grid>
                ))}

              </Grid>
          ))}


        </Grid>
    );
  }

}

const mapStateToProps = state => {
  const { tiktac } = state;
  return { tiktac };
};

Board = withStyles(useStyles)(Board)

export default connect(
    mapStateToProps,
    { check })(Board)