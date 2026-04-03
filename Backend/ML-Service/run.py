import sys
import os

# Force unbuffered stdout so all print() calls show immediately in terminal,
# even from background threads (RabbitMQ consumer runs in a daemon thread).
os.environ["PYTHONUNBUFFERED"] = "1"
sys.stdout.reconfigure(line_buffering=True)  # type: ignore

import uvicorn

if __name__ == "__main__":
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)
