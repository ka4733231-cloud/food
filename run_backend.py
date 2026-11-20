"""
NutriBite AI - Convenient Backend Launcher
Runs FastAPI backend with hot reloading regardless of current working directory.
"""

import sys
import os
import uvicorn

if __name__ == "__main__":
    root_dir = os.path.dirname(os.path.abspath(__file__))
    backend_dir = os.path.join(root_dir, "backend")
    
    if backend_dir not in sys.path:
        sys.path.insert(0, backend_dir)
    if root_dir not in sys.path:
        sys.path.insert(0, root_dir)

    print(f"Starting NutriBite AI FastAPI backend from {backend_dir} on port 8000...")
    uvicorn.run(
        "app.main:app",
        host="0.0.0.0",
        port=8000,
        reload=True,
        app_dir=backend_dir
    )
