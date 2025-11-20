# Real-Time Chat Application

A real-time chat application built with Python (FastAPI) and WebSockets, featuring a WhatsApp-like user interface.

## Features

-   **Real-time Messaging**: Instant message delivery using WebSockets.
-   **WhatsApp-like UI**: Clean and familiar interface with sidebar and chat area.
-   **Typing Indicators**: See when other users are typing.
-   **Read Receipts**: Double ticks to indicate message status.
-   **Sound Notifications**: Audio alerts for incoming messages.
-   **Responsive Design**: Works on desktop and mobile screens.
-   **Deployment Ready**: Configured for easy deployment on platforms like Render.

## Tech Stack

-   **Backend**: Python, FastAPI, Uvicorn, WebSockets
-   **Frontend**: HTML5, CSS3, JavaScript (Vanilla)
-   **Templating**: Jinja2

## Installation

1.  Clone the repository:
    ```bash
    git clone <your-repo-url>
    cd realtimechat
    ```

2.  Create a virtual environment (optional but recommended):
    ```bash
    python -m venv venv
    source venv/bin/activate  # On Windows: venv\Scripts\activate
    ```

3.  Install dependencies:
    ```bash
    pip install -r requirements.txt
    ```

## Usage

1.  Run the server:
    ```bash
    uvicorn main:app --reload
    ```

2.  Open your browser and navigate to `http://localhost:8000`.

3.  Open the same URL in multiple tabs or windows to simulate different users and start chatting!

## Deployment

This project is ready for deployment on Render.

1.  Push your code to GitHub.
2.  Create a new Web Service on Render.
3.  Connect your repository.
4.  Use the following Start Command:
    ```bash
    uvicorn main:app --host 0.0.0.0 --port $PORT
    ```
