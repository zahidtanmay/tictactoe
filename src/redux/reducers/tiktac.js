import {CHECK, SOCKET_DATA, STATUS_CHANGE, ERROR_DATA, INIT_GAME} from "../actionTypes";


const initialState = {
  turn: 0,
  scores: [
    [ {value: 0, status: false}, {value: 0, status: false}, {value: 0, status: false}, ],
    [ {value: 0, status: false}, {value: 0, status: false}, {value: 0, status: false}, ],
    [ {value: 0, status: false}, {value: 0, status: false}, {value: 0, status: false}, ],
  ],
  winner: 0,
  gameStatus: 0,
  player: 0,
  channel: '',
  error: false,
}

export default function(state = initialState, action) {
  console.log(state)
  switch (action.type) {

    case CHECK: {
      const { content } = action.payload;
      const {row, col} = content
      let scores = [...state.scores]
      let turn = state.turn
      let winner = 0
      if (!state.scores[row][col].status) {
        let score = {...scores[row][col]}
        turn++
        if (turn % 2 === 0) {
          score.value = 2
        }else {
          score.value = 1
        }
        score.status = true
        scores[row][col] = score
        winner = checkWinner(scores, turn)
        console.log(winner)
      }
      if (winner) {
        localStorage.setItem('gameStatus', '4')
      }
      localStorage.setItem('scores', JSON.stringify(scores))
      localStorage.setItem('turn', turn)
      localStorage.setItem('winner', winner)
      return {
        ...state,
        turn: turn,
        scores: scores,
        winner: winner
      };
    }

    case STATUS_CHANGE: {
      localStorage.setItem('gameStatus', action.payload.content.gameStatus)
      return {
        ...state,
        ...action.payload.content
      }
    }

    case ERROR_DATA: {

      return {
        ...state,
        ...action.payload.content
      }
    }

    case SOCKET_DATA: {
    }

    case INIT_GAME: {
      return {
        ...initialState
      }
    }

    default:
      return state;
  }
}

function checkWinner(scores, turn) {

  if (scores[0][0]['value'] === scores[0][1]['value'] &&  scores[0][1]['value'] === scores[0][2]['value']) {
    return scores[0][0]['value']
  }

  if (scores[1][0]['value'] === scores[1][1]['value'] && scores[1][1]['value'] === scores[1][2]['value']) {
    return scores[1][0]['value']
  }

  if (scores[2][0]['value'] === scores[2][1]['value'] && scores[2][1]['value'] === scores[2][2]['value']) {
    return scores[2][0]['value']
  }


  if (scores[0][0]['value'] === scores[1][0]['value'] && scores[1][0]['value']=== scores[2][0]['value']) {
    return scores[0][0]['value']
  }

  if (scores[0][1]['value'] === scores[1][1]['value'] && scores[1][1]['value'] === scores[2][1]['value']) {
    return scores[0][1]['value']
  }

  if (scores[0][2]['value'] === scores[1][2]['value'] && scores[1][2]['value'] === scores[2][2]['value']) {
    return scores[0][2]['value']
  }


  if (scores[0][0]['value'] === scores[1][1]['value'] && scores[1][1]['value'] === scores[2][2]['value']) {
    return scores[0][0]['value']
  }

  if (scores[0][2]['value'] === scores[1][1]['value'] && scores[1][1]['value'] === scores[2][0]['value']) {
    return scores[0][2]['value']
  }

  if(turn === 9) {
    return -1
  }


  return 0
}