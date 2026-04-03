import sys
import os
import uvicorn

# Force unbuffered stdout so logs show immediately (important for background threads)
os.environ["PYTHONUNBUFFERED"] = "1"
sys.stdout.reconfigure(line_buffering=True)  # type: ignore


if __name__ == "__main__":
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)