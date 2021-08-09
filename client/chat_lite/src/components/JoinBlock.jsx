import axios from 'axios';
import React from 'react';
import {useHistory} from "react-router-dom";
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';

const useStyles = makeStyles((theme) => ({
    root: {
        display: 'flex',
        flexWrap: 'wrap',
        '& > *': {
            margin: theme.spacing(1),
            width: theme.spacing(16),
            height: theme.spacing(16),
        },
    },
}));

function JoinBlock({ onLogin }) {
    const [userName, setUserName] = React.useState('')
    const history = useHistory()
    const onEnter = async () => {
        if (!userName) {
            return alert('Please input all fields')
        } else if ( userName.length > 10) {
            return alert('Max length 10 symbols')
        } else {
            const obj = {
                userName
            }
            const {data} = await axios.post('http://localhost:9999/rooms', obj)
            obj.roomId = data
            onLogin(obj)
            history.push('/'+ data)
        }
    }

    return (
        <Paper >
            <TextField
              id="standard-basic"
              label="user name"
              placeholder='Name max 10 symblos'
              defaultValue={userName}
              onChange={e => setUserName(e.target.value)}
            />

            <Button variant="contained" color="primary" onClick={() => onEnter()}>
                TO ENTER
            </Button>
      </Paper>
    )
}

export default JoinBlock