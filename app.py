from flask import Flask, render_template, request
from flask_socketio import SocketIO, emit
from datetime import datetime

# Initialize Flask app and SocketIO
app = Flask(__name__)
app.config['SECRET_KEY'] = 'your-secret-key-here'
socketio = SocketIO(app, cors_allowed_origins="*")

# Store connected users: { session_id: username }
connected_users = {}

@app.route('/')
def index():
    """Serve the main chat page."""
    return render_template('index.html')

@socketio.on('connect')
def handle_connect():
    """Handle a new user connecting to the chat."""
    print(f"New connection: {request.sid}")

@socketio.on('join')
def handle_join(data):
    """Handle a user joining the chat with a username."""
    username = data.get('username', 'Anonymous').strip()
    if not username:
        username = 'Anonymous'

    connected_users[request.sid] = username

    # Notify everyone that a new user joined
    emit('system_message', {
        'message': f'{username} joined the chat!',
        'time': get_time(),
        'user_count': len(connected_users)
    }, broadcast=True)

    # Send current user list to the new user
    emit('user_list', {'users': list(connected_users.values())})
    print(f"{username} joined. Total users: {len(connected_users)}")

@socketio.on('send_message')
def handle_message(data):
    """Handle an incoming chat message and broadcast it."""
    username = connected_users.get(request.sid, 'Anonymous')
    message = data.get('message', '').strip()

    if not message:
        return  # Ignore empty messages

    emit('receive_message', {
        'username': username,
        'message': message,
        'time': get_time(),
        'sid': request.sid
    }, broadcast=True)
    print(f"[{get_time()}] {username}: {message}")

@socketio.on('typing')
def handle_typing(data):
    """Broadcast typing indicator to other users."""
    username = connected_users.get(request.sid, 'Anonymous')
    emit('user_typing', {
        'username': username,
        'is_typing': data.get('is_typing', False)
    }, broadcast=True, include_self=False)

@socketio.on('disconnect')
def handle_disconnect():
    """Handle a user disconnecting."""
    username = connected_users.pop(request.sid, 'Someone')

    emit('system_message', {
        'message': f'{username} left the chat.',
        'time': get_time(),
        'user_count': len(connected_users)
    }, broadcast=True)

    emit('user_list', {'users': list(connected_users.values())}, broadcast=True)
    print(f"{username} disconnected. Total users: {len(connected_users)}")

def get_time():
    """Return the current time as a formatted string."""
    return datetime.now().strftime('%I:%M %p')

if __name__ == '__main__':
    print("ChatRoom server starting...")
    print("Open your browser and go to: http://localhost:5000")
    socketio.run(app, debug=True, host='0.0.0.0', port=5000)
