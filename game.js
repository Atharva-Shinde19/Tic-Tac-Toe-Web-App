const gameContainer = document.getElementById('gameContainer');
        const status = document.getElementById('status');
        const restartButton = document.getElementById('restartButton');
        const homeButton = document.getElementById('homeButton');
        const shareButton = document.getElementById('shareButton');
        const playerSelect = document.getElementById('playerSelect');
        const playerWins = { X: 0, O: 0 };

        let currentPlayer = playerSelect.value;
        let board = Array(9).fill(null);
        let gameActive = true;

        function updateLeaderboard(winner) {
            if (winner && winner !== 'Tie') {
                playerWins[winner]++;
                document.getElementById('playerXWins').textContent = playerWins['X'];
                document.getElementById('playerOWins').textContent = playerWins['O'];
            }
        }

        function checkWinner() {
            const winningCombinations = [
                [0, 1, 2], [3, 4, 5], [6, 7, 8], 
                [0, 3, 6], [1, 4, 7], [2, 5, 8], 
                [0, 4, 8], [2, 4, 6]            
            ];

            for (const combination of winningCombinations) {
                const [a, b, c] = combination;
                if (board[a] && board[a] === board[b] && board[a] === board[c]) {
                    return board[a];
                }
            }

            return board.includes(null) ? null : 'Tie';
        }

        function updateStatus(winner) {
            if (winner === 'Tie') {
                status.textContent = "It's a tie!";
            } else if (winner) {
                status.textContent = `${winner} wins!`;
                updateLeaderboard(winner);
                gameActive = false;
            } else {
                status.textContent = `Player ${currentPlayer}'s turn`;
            }
        }

        function handleCellClick(e) {
            const cell = e.target;
            const cellIndex = cell.getAttribute('data-index');

            if (!gameActive || board[cellIndex]) return;

            board[cellIndex] = currentPlayer;
            cell.textContent = currentPlayer;
            cell.classList.add('taken');

            const winner = checkWinner();
            if (winner) {
                updateStatus(winner);
            } else {
                currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
                updateStatus(null);
            }
        }

        function restartGame() {
            board = Array(9).fill(null);
            currentPlayer = playerSelect.value;
            gameActive = true;
            status.textContent = `Player ${currentPlayer}'s turn`;
            gameContainer.innerHTML = '';
            createBoard();
        }

        function createBoard() {
            for (let i = 0; i < 9; i++) {
                const cell = document.createElement('div');
                cell.classList.add('cell');
                cell.setAttribute('data-index', i);
                cell.addEventListener('click', handleCellClick);
                gameContainer.appendChild(cell);
            }
        }

        function shareGame() {
            navigator.share({
                title: 'Tic Tac Toe',
                text: 'Check out this Tic Tac Toe game!',
                url: window.location.href,
            }).catch((error) => console.log('Sharing failed', error));
        }

        restartButton.addEventListener('click', restartGame);
        homeButton.addEventListener('click', () => alert('Returning to home...'));
        shareButton.addEventListener('click', shareGame);
        playerSelect.addEventListener('change', () => currentPlayer = playerSelect.value);

        createBoard();
        updateStatus(null);