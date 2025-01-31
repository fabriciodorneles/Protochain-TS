# Protochain-TS

Protochain-TS is a simple implementation of a blockchain in TypeScript. This blockchain is intended for educational purposes only, it has a basic structure but is very similar to a normal blockchain.

It operates as a node in the network using the HTTP protocol instead of RPC (Remote Procedure Call). It runs through an Express server.

## Installation

1. Clone the repository:

   ```sh
   git clone <REPOSITORY_URL>
   cd Protochain-TS
   ```

2. Install the dependencies:
   ```sh
   npm install
   ```

## Scripts

- `compile`: Compiles the TypeScript code.
- `dev`: Starts the project in development mode.
- `start`: Starts the project in production mode.
- `test`: Runs the tests.

## Usage

To start the project in development mode:

```sh
npm run dev
```

To compile the project:

```sh
npm run compile
```

To start the project in production mode:

```sh
npm start
```

To run the tests:

```sh
npm test
```

## Project Structure

- `src/lib/block.ts`: Implementation of the `Block` class.
- `src/lib/blockchain.ts`: Implementation of the `Blockchain` class.
- `src/server.ts`: Implementation of the Express server.
- `__tests__/block.test.ts`: Tests for the `Block` class.
- `__tests__/blockchain.test.ts`: Tests for the `Blockchain` class.

## Contribution

Contributions are welcome! Feel free to open an issue or submit a pull request.

## License

This project is licensed under the MIT License.
