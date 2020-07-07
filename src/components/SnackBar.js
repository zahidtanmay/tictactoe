import React from 'react';
import Snackbar from '@material-ui/core/Snackbar';
import {withStyles} from '@material-ui/core/styles';
import Alert from '@material-ui/lab/Alert';

const useStyles = theme => ({
  root: {
    width: '100%',
    '& > * + *': {
      marginTop: theme.spacing(2),
    },
  },
});

class SnackBar extends React.Component {

  constructor(props) {
    super(props)
  }

  render(){
    const { classes } = this.props;
    return (
        <div className={classes.root}>
          <Snackbar open={this.props.open} autoHideDuration={6000} anchorOrigin={{ vertical: 'top', horizontal: 'right'}}>
            <Alert severity="error">Invalid Request !</Alert>
          </Snackbar>
        </div>
    );
  }




}


export default withStyles(useStyles)(SnackBar)