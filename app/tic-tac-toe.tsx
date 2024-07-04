'use client'
import React, { useState } from 'react'

const TicTacToe = () => {
  const [board, setBoard] = useState(Array(9).fill(null))
  const [xIsNext, setXIsNext] = useState(true)

  const calculateWinner = (squares: any[]) => {
    const lines = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6],
    ]
    for (let i = 0; i < lines.length; i++) {
      const [a, b, c] = lines[i]
      if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
        return squares[a]
      }
    }
    return null
  }

  const handleClick = (i: number) => {
    if (calculateWinner(board) || board[i]) {
      return
    }
    const newBoard = board.slice()
    newBoard[i] = xIsNext ? 'X' : 'O'
    setBoard(newBoard)
    setXIsNext(!xIsNext)
  }

  const renderSquare = (i: number) => {
    return (
      <button className="w-20 h-20 text-4xl font-bold flex items-center justify-center" onClick={() => handleClick(i)}>
        {board[i]}
      </button>
    )
  }

  const winner = calculateWinner(board)
  let status
  if (winner) {
    status = `获胜者: ${winner}`
  } else if (board.every((square) => square)) {
    status = '平局'
  } else {
    status = `下一步: ${xIsNext ? 'X' : 'O'}`
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="mb-4 text-2xl font-bold">{status}</div>
      <div className="grid grid-cols-3 gap-1 bg-gray-300 p-1 rounded-lg shadow-lg">
        {[0, 1, 2].map((row) => (
          <React.Fragment key={row}>
            {[0, 1, 2].map((col) => (
              <div
                key={col}
                className={`bg-white ${col < 2 ? 'border-r-2' : ''} ${row < 2 ? 'border-b-2' : ''} border-gray-300`}
              >
                {renderSquare(row * 3 + col)}
              </div>
            ))}
          </React.Fragment>
        ))}
      </div>
      <button
        className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        onClick={() => setBoard(Array(9).fill(null))}
      >
        重新开始
      </button>
    </div>
  )
}

export default TicTacToe
