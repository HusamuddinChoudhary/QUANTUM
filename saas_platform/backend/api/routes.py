import json
import uuid
import os
from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Body, Form
from typing import List, Dict, Any, Optional
from saas_platform.backend.auth.jwt_auth import (
    create_access_token, create_refresh_token, 
    verify_password, get_current_user, get_password_hash
)

router = APIRouter()

# In-memory storage for MVP/Demo
SESSIONS_CACHE = {}
DEMO_DIR = os.path.join(os.path.dirname(os.path.dirname(__file__)), "demo")

# Mock user database for testing signup/login without full DB migration
MOCK_USERS = {
    "admin@bank.com": {
        "id": "admin-id",
        "email": "admin@bank.com",
        "password_hash": get_password_hash("password"),
        "role": "ADMIN",
        "orgId": "bank-org-id",
        "fullName": "Alex Chen"
    }
}

# Auth Endpoints
@router.post("/auth/login")
async def login(data: dict = Body(...)):
    email = data.get("email")
    password = data.get("password")
    
    user = MOCK_USERS.get(email)
    
    if user and verify_password(password, user["password_hash"]):
        access = create_access_token({"sub": user["id"], "org_id": user["orgId"], "role": user["role"]})
        refresh = create_refresh_token(user["id"])
        # Don't send password hash to client
        user_data = {k: v for k, v in user.items() if k != "password_hash"}
        return {
            "accessToken": access,
            "refreshToken": refresh,
            "user": user_data
        }
    
    # Fallback to hardcoded demo (just in case)
    if email == "demo@hospital.com" and password == "demo":
         access = create_access_token({"sub": "demo-id", "org_id": "hosp-org-id", "role": "USER"})
         refresh = create_refresh_token("demo-id")
         return {
             "accessToken": access,
             "refreshToken": refresh,
             "user": {"id": "demo-id", "email": email, "role": "USER", "orgId": "hosp-org-id", "fullName": "Demo User"}
         }

    raise HTTPException(status_code=401, detail="Invalid credentials")

@router.post("/auth/signup")
async def signup(data: dict = Body(...)):
    email = data.get("email")
    password = data.get("password")
    full_name = data.get("full_name", email.split("@")[0])
    
    if not email or not password:
        raise HTTPException(status_code=400, detail="Email and password are required")
        
    if email in MOCK_USERS:
        raise HTTPException(status_code=400, detail="Email already registered")
        
    user_id = str(uuid.uuid4())
    org_id = str(uuid.uuid4())
    
    MOCK_USERS[email] = {
        "id": user_id,
        "email": email,
        "password_hash": get_password_hash(password),
        "role": "USER",
        "orgId": org_id,
        "fullName": full_name
    }
    
    return {"message": "User created successfully", "userId": user_id}

@router.post("/auth/refresh")
async def refresh(data: dict = Body(...)):
    token = data.get("refreshToken")
    # In a real app, verify the refresh token here
    new_access = create_access_token({"sub": "admin-id", "org_id": "bank-org-id", "role": "ADMIN"})
    return {"accessToken": new_access}

# Session Endpoints
@router.get("/sessions")
async def get_sessions(limit: int = 10, offset: int = 0, user=Depends(get_current_user)):
    # Return sessions from cache
    session_list = [
        {"id": sid, "name": s.get("name"), "status": "COMPLETE", "score": s.get("scores", {}).get("zt_score", 0), "timestamp": s.get("metadata", {}).get("timestamp")}
        for sid, s in SESSIONS_CACHE.items()
    ]
    return {"sessions": session_list, "total": len(session_list)}

@router.get("/sessions/{session_id}")
async def get_session_details(session_id: str, user=Depends(get_current_user)):
    if session_id not in SESSIONS_CACHE:
        raise HTTPException(status_code=404, detail="Session not found")
    return SESSIONS_CACHE[session_id]

# Validation Endpoint
@router.post("/validate")
async def validate_infra(
    file: Optional[UploadFile] = File(None),
    demo: Optional[str] = Form(None),
    user=Depends(get_current_user)
):
    session_id = str(uuid.uuid4())
    
    if demo:
        # Load from demo files
        file_path = os.path.join(DEMO_DIR, demo)
        if not os.path.exists(file_path):
            raise HTTPException(status_code=404, detail=f"Demo scenario {demo} not found")
        
        with open(file_path, "r") as f:
            data = json.load(f)
            SESSIONS_CACHE[session_id] = data
    else:
        # Placeholder for real file upload processing
        # For now, just generate a dummy session
        SESSIONS_CACHE[session_id] = {
            "name": file.filename if file else "Manual Upload",
            "status": "COMPLETE",
            "graph": {"nodes": [], "edges": []},
            "scores": {"zt_score": 50, "qvi": 50}
        }

    return {"sessionId": session_id, "status": "COMPLETE"}

# AI Chat Endpoint
@router.post("/chat")
async def chat_interaction(data: dict = Body(...), user=Depends(get_current_user)):
    from quantum_ares_core.advisory.advisor import AIAdvisor
    advisor = AIAdvisor()
    question = data.get("question")
    session_id = data.get("session_id")
    
    # Optional: Load context from SESSIONS_CACHE[session_id]
    context = SESSIONS_CACHE.get(session_id, {})
    
    answer = advisor.answer(question, context)
    return answer

# What-If Simulation
@router.post("/whatif")
async def whatif_simulation(data: dict = Body(...), user=Depends(get_current_user)):
    session_id = data.get("session_id")
    fixes = data.get("fixes", [])
    # In a real app, re-calculate based on fixes
    return {"new_score": 75.0, "delta": +15.0}

# Reports
@router.get("/reports")
async def list_reports(user=Depends(get_current_user)):
    return []

@router.get("/reports/{report_id}/download")
async def download_report(report_id: str, user=Depends(get_current_user)):
    # In a real app, generate/return PDF
    return {"detail": "PDF binary content"}
