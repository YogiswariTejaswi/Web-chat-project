# ChatRoom — Real-Time Web Chat App

A beginner-friendly real-time chat application built with **Python (Flask)** and **WebSockets (Socket.IO)**.

---

## What This App Does

- Multiple users can join a shared chat room with a username
- Messages appear instantly for everyone (no page refresh needed)
- Shows who is currently online in a sidebar
- Displays a "User is typing..." indicator
- System messages announce when users join or leave

---

## Project Structure

```
project/
│
├── app.py                  # Python backend (Flask + Socket.IO)
├── README.md               # This file
│
├── templates/
│   └── index.html          # HTML frontend page
│
└── static/
    ├── style.css           # CSS styles
    └── chat.js             # JavaScript for real-time chat logic
```

---

## How to Run

### Step 1 — Install Python dependencies

Open your terminal and run:

```bash
pip install flask flask-socketio
```

### Step 2 — Start the server

```bash
python app.py
```

You should see:
```
ChatRoom server starting...
Open your browser and go to: http://localhost:5000
```

### Step 3 — Open the app

Open your browser and go to:
```
http://localhost:5000
```

To test with multiple users, open the same URL in **two different browser tabs** or share your IP address on a local network.

---

## Technologies Used

| Technology     | Purpose                              |
|----------------|--------------------------------------|
| Python 3       | Programming language                 |
| Flask          | Web framework (serves pages)         |
| Flask-SocketIO | Real-time WebSocket communication    |
| HTML5          | Page structure                       |
| CSS3           | Styling and layout                   |
| JavaScript     | Client-side logic and Socket.IO      |
| Socket.IO      | Bi-directional real-time messaging   |

---

## Key Concepts You Will Learn

- **WebSockets** — unlike normal HTTP, they keep a persistent connection open so the server can push data to clients instantly.
- **Events** — Socket.IO uses named events (`join`, `send_message`, `disconnect`) to communicate between server and browser.
- **Broadcasting** — when one user sends a message, the server forwards it to *all* connected users.
- **Flask routing** — `@app.route('/')` tells Flask what to show when someone visits the homepage.

---

## Troubleshooting

| Problem                          | Solution                                      |
|----------------------------------|-----------------------------------------------|
| `ModuleNotFoundError: flask`     | Run `pip install flask flask-socketio`        |
| Port 5000 already in use         | Change `port=5000` to `port=5001` in app.py   |
| Messages not appearing           | Make sure both tabs use the same URL          |
| Styles not loading               | Ensure the `static/` folder is in place       |

---

## Next Steps to Explore

- Add private/direct messaging between users
- Save chat history to a database (SQLite is great for beginners)
- Add user avatars or color-coded names
- Deploy to the internet using **Render** or **Railway** (both have free tiers)

---

*Built as a 1st year student project using Flask and Socket.IO.*
