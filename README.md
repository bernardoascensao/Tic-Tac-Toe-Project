# Tic Tac Toe with React, Node.js and Stream Chat

This project is a full-stack Tic Tac Toe game that combines a modern React frontend with a Node.js backend. The frontend is bundled using Webpack and styled with Tailwind CSS. The backend is built with Express and uses Knex.js for database operations, with SQLite3 as the storage engine during development.

Players can create and join matches, and there's real-time communication integration using the Stream Chat API, enabling in-game chat between players. The architecture is modular and designed for clarity, scalability, and ease of development.

This setup is ideal for learning how to structure full-stack JavaScript applications, work with build tools like Webpack, and integrate third-party APIs in a clean and maintainable way.


---

## Prerequisites

- [Node.js](https://nodejs.org/en) (v14+ recommended)

---

## Stream Chat API Key & Secret

This project uses the [GetStream](https://getstream.io/) API for real-time chat.

1. Create a free account at [https://getstream.io/](https://getstream.io/)
2. Create an application and copy your **API Key** and **Secret**
3. Create a `.env` file inside the `server/` folder with the following content:

```env
API_KEY=your_api_key_here
API_SECRET=your_api_secret_here
NODE_ENV=development
```

## Installation

1. Clone the repository:
```bash
git clone <REPOSITORY_URL>
cd <PROJECT_NAME>
```

2. Install dependencies (backend):
```bash
cd server/
npm install
```

3. Install dependencies (frontend):
```bash
cd client/
npm install
```

4. Initialize the database with the necessary tables:
```bash
cd server/
node migrations/init.js
```
This will create a local SQLite3 database file named `tictactoe.db` inside the `server/data/` folder.

5. Create a file named `environment.js` inside the `client/` folder with the following content:
```javascript
export const environment = {
  production: false,
  apiUrl: 'http://localhost:3001/api', // Backend API base URL
  api_key: '<Your-StreamChat-ApiKey>'
}
```

## How to run the project

1. Run the frontend:
```bash
cd client/
npm run start
```

2. Run the backend:
```bash
cd server/
npm run start
```