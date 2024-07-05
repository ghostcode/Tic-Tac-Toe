'use client'
import React, { useState } from 'react'

type SquareValue = 'X' | 'O' | null

interface SquareProps {
  value: SquareValue
  onClick: () => void
}

const Square: React.FC<SquareProps> = ({ value, onClick }) => (
  <button className="w-20 h-20 text-4xl font-bold flex items-center justify-center bg-white" onClick={onClick}>
    {value}
  </button>
)

interface BoardProps {
  squares: SquareValue[]
  onClick: (i: number) => void
}

const Board: React.FC<BoardProps> = ({ squares, onClick }) => (
  <div className="grid grid-cols-3 gap-1 bg-gray-300 p-1 rounded-lg shadow-lg">
    {squares.map((square, i) => (
      <Square key={i} value={square} onClick={() => onClick(i)} />
    ))}
  </div>
)

const calculateWinner = (squares: SquareValue[]): SquareValue => {
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

interface TicTacToeProps {
  isSinglePlayer: boolean
  onReturn: () => void
}

const TicTacToe: React.FC<TicTacToeProps> = ({ isSinglePlayer, onReturn }) => {
  const [board, setBoard] = useState<SquareValue[]>(Array(9).fill(null))
  const [xIsNext, setXIsNext] = useState<boolean>(true)

  const handleClick = (i: number): void => {
    if (calculateWinner(board) || board[i]) {
      return
    }

    const newBoard = board.slice()
    newBoard[i] = xIsNext ? 'X' : 'O'
    setBoard(newBoard)

    if (isSinglePlayer && xIsNext) {
      setTimeout(() => makeAIMove(newBoard), 500)
    }

    setXIsNext(!xIsNext)
  }

  const makeAIMove = (currentBoard: SquareValue[]): void => {
    const availableMoves = currentBoard.reduce<number[]>((acc, val, idx) => {
      if (val === null) acc.push(idx)
      return acc
    }, [])

    // Check if AI can win
    for (let move of availableMoves) {
      let boardCopy = currentBoard.slice()
      boardCopy[move] = 'O'
      if (calculateWinner(boardCopy) === 'O') {
        setBoard(boardCopy)
        setXIsNext(true)
        return
      }
    }

    // Check if player can win and block
    for (let move of availableMoves) {
      let boardCopy = currentBoard.slice()
      boardCopy[move] = 'X'
      if (calculateWinner(boardCopy) === 'X') {
        boardCopy[move] = 'O'
        setBoard(boardCopy)
        setXIsNext(true)
        return
      }
    }

    // If center is free, take it
    if (currentBoard[4] === null) {
      let boardCopy = currentBoard.slice()
      boardCopy[4] = 'O'
      setBoard(boardCopy)
      setXIsNext(true)
      return
    }

    // Otherwise, make a random move
    if (availableMoves.length > 0) {
      const randomMove = availableMoves[Math.floor(Math.random() * availableMoves.length)]
      const newBoard = currentBoard.slice()
      newBoard[randomMove] = 'O'
      setBoard(newBoard)
      setXIsNext(true)
    }
  }

  const resetGame = (): void => {
    setBoard(Array(9).fill(null))
    setXIsNext(true)
  }

  const winner = calculateWinner(board)
  let status: string
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
      <Board squares={board} onClick={handleClick} />
      <div className="mt-4 space-x-4">
        <button className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600" onClick={resetGame}>
          重新开始
        </button>
        <button className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600" onClick={onReturn}>
          返回
        </button>
      </div>
    </div>
  )
}

const GameModeSelector: React.FC = () => {
  const [gameMode, setGameMode] = useState<'single' | 'multi' | null>(null)

  const selectGameMode = (mode: 'single' | 'multi'): void => {
    setGameMode(mode)
  }

  const returnToModeSelection = (): void => {
    setGameMode(null)
  }

  if (gameMode === null) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
        <h1 className="text-3xl font-bold mb-8">选择游戏模式</h1>
        <div className="space-x-4">
          <button
            className="px-6 py-3 bg-blue-500 text-white rounded hover:bg-blue-600"
            onClick={() => selectGameMode('single')}
          >
            人机对战
          </button>
          <button
            className="px-6 py-3 bg-green-500 text-white rounded hover:bg-green-600"
            onClick={() => selectGameMode('multi')}
          >
            双人对战
          </button>
        </div>
      </div>
    )
  }

  return <TicTacToe isSinglePlayer={gameMode === 'single'} onReturn={returnToModeSelection} />
}

export default GameModeSelector
