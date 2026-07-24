import os
import time
import json
import asyncio
import httpx
from fastapi import FastAPI, Request, Form, Response
from fastapi.responses import HTMLResponse, JSONResponse, FileResponse
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv

load_dotenv()

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Bland.ai Configuration
BLAND_API_KEY = os.getenv("BLAND_API_KEY")
BASE_URL = os.getenv("BASE_URL")

# System Prompt (Zara Voice Agent Persona)
SYSTEM_PROMPT = """
You are "Zara", a warm, friendly, and knowledgeable sales and design representative calling from Sunrise Interiors — a premium home interiors company based in Bengaluru, India.
Your goal is to follow up with a visitor who showed interest in interior design for their home.

=== YOUR SERVICE KNOWLEDGE (use this when asked about services) ===

We offer three main services:

1. BESPOKE MODULAR KITCHENS (₹1.8 Lakhs – ₹5.5 Lakhs+)
   - Three tiers: Classic Matte (₹1.8L–₹2.5L), High-Gloss Acrylic (₹2.6L–₹4L), Luxury Glass & PU (₹4.2L+)
   - Includes: Marine ply cabinets, soft-close hinges, quartz countertops, smart storage systems
   - Layouts: U-shape, L-shape, Parallel, Island — all customized to Indian cooking style

2. PREMIUM CUSTOM WARDROBES (₹85,000 – ₹3 Lakhs+)
   - Three tiers: Swing Door Laminate (₹85k–₹1.4L), Sliding Acrylic (₹1.5L–₹2.5L), Luxury Glass Slider (₹2.6L+)
   - Includes: Custom internal configurations, LED sensor lighting, soft-close sliding channels

3. TURNKEY FULL-HOME INTERIORS (₹4.5 Lakhs for 2BHK / ₹6.5 Lakhs for 3BHK)
   - Covers everything: modular kitchen, wardrobes, false ceiling, TV unit, lighting, painting
   - Includes: dedicated senior designer, 3D renders, 45-day delivery guarantee, 10-year warranty
   - Elite Curated Package also available (custom quote) for PU/glass finishes, wallpaneling, automation

=== HOW TO TALK ABOUT SERVICES ===
- If someone asks about services in general: give a very brief 1-sentence overview of the 3 categories and their starting prices. Do NOT list everything at once.
- If they ask about a specific service (e.g. kitchen, wardrobe): share 1–2 key highlights and the starting price only.
- Only go into full detail (tiers, what's included) if the caller explicitly asks "tell me more" or "what exactly is included".
- Always end a service explanation by asking about their specific requirement or inviting them for a free consultation.

=== CONVERSATION FLOW ===
1. Greet warmly, introduce as Zara from Sunrise Interiors, ask if it's a good time.
2. If no — ask for a better time, thank them, end politely.
3. If yes — ask what kind of work they're looking for and their timeline.
4. Answer any service questions naturally using your knowledge above (keep it brief unless they ask for detail).
5. Offer a free 30-minute consultation call with a lead designer.
6. If they agree — suggest a time (e.g. "tomorrow at 4 PM or Monday morning") and confirm.
7. LANGUAGE RULE — VERY IMPORTANT: Always speak in natural Indian English. If the caller asks a question in Hindi (e.g. "kitchen ka price kya hai?"), answer that specific question in simple Hindi or Hinglish, then gently return to English. Never switch fully to Hindi. English is your default language at all times.

Crucial: Keep every response to 1 or 2 SHORT sentences max. Never list more than one thing at a time. Speak like a real person — casual, warm, and quick. Silence between turns should never exceed 2 seconds.
"""

# Active call session tracking
active_calls = {}

@app.get("/")
def read_root():
    return FileResponse("index.html")

@app.post("/api/make-call")
async def make_call(phone_number: str = Form(...), language: str = Form("en-IN")):
    if not BASE_URL:
        return JSONResponse(status_code=400, content={"error": "BASE_URL is not set. Please start ngrok/localtunnel."})
    
    clean_base_url = BASE_URL.replace("http://", "https://")
    
    # Determine greeting and language instructions based on language selection
    if language == "hi":
        first_sentence = "Namaste, main Sunrise Interiors se Zara baat kar rahi hoon. Kya yeh baat karne ka sahi time hai?"
        lang_instruction = "7. LANGUAGE RULE — VERY IMPORTANT: Since the caller's preferred language is Hindi, you MUST conduct the entire conversation in natural, simple Hindi. To ensure the voice synthesizer works correctly, you MUST write all your responses in Romanized Hindi (Hinglish/Latin script using the English alphabet, e.g. 'Namaste, aap kaise hain?'). Do NOT write in Devanagari script (Hindi characters). Answer all questions in simple Romanized Hindi, and do not switch to English. Speak warmly and keep it simple."
    elif language == "hi-Latn":
        first_sentence = "Hi, main Sunrise Interiors se Zara baat kar rahi hoon. Kya yeh baat karne ka sahi time hai?"
        lang_instruction = "7. LANGUAGE RULE — VERY IMPORTANT: Since the caller selected Hinglish, you MUST use the Hinglish greeting for your first sentence. However, for ALL subsequent responses and questions in the call, you MUST speak entirely in natural English. Do not speak in Hinglish or Hindi after the first greeting sentence."
    else:
        first_sentence = "Hi, this is Zara calling from Sunrise Interiors. Is this a good time to chat?"
        lang_instruction = "7. LANGUAGE RULE — VERY IMPORTANT: Always speak in natural Indian English. If the caller asks a question in Hindi (e.g. \"kitchen ka price kya hai?\"), answer that specific question in simple Hindi or Hinglish, then gently return to English. Never switch fully to Hindi. English is your default language at all times."
        
    dynamic_prompt = SYSTEM_PROMPT.replace(
        '7. LANGUAGE RULE — VERY IMPORTANT: Always speak in natural Indian English. If the caller asks a question in Hindi (e.g. "kitchen ka price kya hai?"), answer that specific question in simple Hindi or Hinglish, then gently return to English. Never switch fully to Hindi. English is your default language at all times.',
        lang_instruction
    )

    # Trigger outbound call via Bland.ai API
    bland_url = "https://api.bland.ai/v1/calls"
    headers = {
        "authorization": f"{BLAND_API_KEY}",
        "Content-Type": "application/json"
    }
    payload = {
        "phone_number": phone_number,
        "task": dynamic_prompt,
        "voice": "791bba5c-f36d-4f15-8b63-ceffffc19fea",  # Vibha - Indian female, calm & friendly
        "first_sentence": first_sentence,
        "wait_for_greeting": True,
        "record": True,
        "amd": False,
        "language": "hi" if language == "hi" else "en",
        "model": "enhanced",
        "resumption_speed": 1,
        "interruption_threshold": 50,
        "temperature": 0.5,
        "max_duration": 10,
        "webhook": f"{clean_base_url}/api/bland-webhook"
    }
    
    try:
        async with httpx.AsyncClient() as client:
            response = await client.post(bland_url, headers=headers, json=payload, timeout=15.0)
            print(f"Bland API Send Call response status: {response.status_code}")
            print(f"Bland API response body: {response.text}")
            
            if response.status_code not in [200, 201]:
                try:
                    err_json = response.json()
                    err_msg = err_json.get("message") or err_json.get("error") or response.text
                except Exception:
                    err_msg = response.text
                return JSONResponse(status_code=response.status_code, content={"error": err_msg})
            
            call_data = response.json()
            call_id = call_data.get("call_id")
            
            active_calls[call_id] = {
                "transcript": [],
                "status": "Initiating",
                "last_updated_time": time.time(),
                "last_transcript_length": 0
            }
            return {"message": "Call initiated", "call_sid": call_id}
    except Exception as e:
        print(f"Error initiating Bland.ai call: {e}")
        return JSONResponse(status_code=500, content={"error": str(e)})

@app.post("/api/bland-webhook")
async def bland_webhook(request: Request):
    try:
        payload = await request.json()
        print(f"Received Bland.ai Post-Call Webhook: {json.dumps(payload, indent=2)}")
        
        call_id = payload.get("call_id")
        if not call_id:
            return {"status": "ignored", "reason": "No call_id in payload"}
            
        if call_id not in active_calls:
            active_calls[call_id] = {"transcript": [], "status": "Completed"}
            
        # Parse transcript from the post-call payload
        transcript_text = payload.get("transcript", "")
        # Or parse the structured transcript list
        transcript_list = payload.get("transcripts", [])
        
        cleaned_transcript = []
        if transcript_list:
            cleaned_transcript = []
            for item in transcript_list:
                user_type = item.get("user", "user")
                text = item.get("text", "")
                if text:
                    cleaned_transcript.append({
                        "speaker": "Zara" if user_type == "assistant" else "User",
                        "text": text
                    })
            active_calls[call_id]["transcript"] = cleaned_transcript
        
        active_calls[call_id]["status"] = "Completed"
        
        # Latency/Cost Logger
        price = payload.get("price", 0)
        duration = payload.get("length", 0)  # Length in minutes or seconds
        
        if duration:
            active_calls[call_id]["call_length"] = duration
            total_seconds = int(duration * 60)
            mins = total_seconds // 60
            secs = total_seconds % 60
            active_calls[call_id]["duration_formatted"] = f"{mins}m {secs}s" if mins > 0 else f"{secs}s"
            active_calls[call_id]["cost_in_rupees"] = round(duration * 5.70, 2)
        print(f"\n================ CALL METRICS REPORT ================")
        print(f"Call ID: {call_id}")
        print(f"Duration: {duration} minutes")
        print(f"Total Call Cost: ${price} USD (approx. ₹{price * 83:.2f} INR)")
        print(f"======================================================\n")
        
        return {"status": "ok"}
    except Exception as e:
        print(f"Error processing Bland.ai webhook: {e}")
        return JSONResponse(status_code=500, content={"error": str(e)})

@app.get("/api/transcript/{call_sid}")
async def get_transcript(call_sid: str):
    session = active_calls.get(call_sid, {"transcript": [], "status": "Not found"})
    
    # Query Bland.ai API in real-time to fetch the live status and transcript
    bland_url = f"https://api.bland.ai/v1/calls/{call_sid}"
    headers = {
        "authorization": f"{BLAND_API_KEY}"
    }
    
    try:
        async with httpx.AsyncClient() as client:
            response = await client.get(bland_url, headers=headers, timeout=5.0)
            if response.status_code == 200:
                call_data = response.json()
                
                # Update status
                bland_status = call_data.get("status", "")
                if bland_status in ["ringing", "in-progress"]:
                    session["status"] = "Active"
                elif bland_status == "completed":
                    session["status"] = "Completed"
                elif bland_status in ["failed", "no-answer", "busy"]:
                    session["status"] = "Error"
                else:
                    session["status"] = bland_status.capitalize() if bland_status else session["status"]
                
                # Get call length and calculate cost
                call_length = call_data.get("call_length", 0)
                if not call_length:
                    call_length = call_data.get("length", 0)
                
                if call_length:
                    session["call_length"] = call_length
                    total_seconds = int(call_length * 60)
                    mins = total_seconds // 60
                    secs = total_seconds % 60
                    session["duration_formatted"] = f"{mins}m {secs}s" if mins > 0 else f"{secs}s"
                    session["cost_in_rupees"] = round(call_length * 5.70, 2)
                
                # Update transcript
                transcript_list = call_data.get("transcripts", [])
                if transcript_list:
                    cleaned_transcript = []
                    for item in transcript_list:
                        user_type = item.get("user", "user")
                        text = item.get("text", "")
                        if text:
                            cleaned_transcript.append({
                                "speaker": "Zara" if user_type == "assistant" else "User",
                                "text": text
                            })
                    session["transcript"] = cleaned_transcript
                    active_calls[call_sid]["transcript"] = cleaned_transcript
                
    except Exception as e:
        print(f"Error fetching live transcript from Bland.ai: {e}")
        
    # Check if a meeting is appointed based on transcript keywords
    meeting_appointed = False
    keywords = ["confirm", "booked", "scheduled", "calendar", "see you", "appointed", "slot", "tomorrow at", "monday at", "tuesday at", "wednesday at", "thursday at", "friday at"]
    for msg in session.get("transcript", []):
        if msg.get("speaker") == "Zara":
            text_lower = msg.get("text", "").lower()
            if any(kw in text_lower for kw in keywords):
                meeting_appointed = True
                break
    session["meeting_appointed"] = meeting_appointed
    
    # 7-second Inactivity Timeout Disconnect Logic
    if session.get("status") == "Active" and len(session.get("transcript", [])) > 0:
        current_len = len(session.get("transcript", []))
        
        # Initialize tracking keys if missing
        if "last_updated_time" not in session:
            session["last_updated_time"] = time.time()
            session["last_transcript_length"] = current_len
            
        if current_len > session.get("last_transcript_length", 0):
            # There is new speech activity; reset the timeout timer
            session["last_updated_time"] = time.time()
            session["last_transcript_length"] = current_len
        else:
            # Check elapsed silence duration
            elapsed = time.time() - session.get("last_updated_time", time.time())
            if elapsed >= 15.0:
                print(f"Inactivity detected for {elapsed:.2f} seconds. Auto-disconnecting call {call_sid}...")
                stop_url = f"https://api.bland.ai/v1/calls/{call_sid}/stop"
                stop_headers = {"authorization": f"{BLAND_API_KEY}"}
                try:
                    async with httpx.AsyncClient() as client:
                        stop_res = await client.post(stop_url, headers=stop_headers, timeout=5.0)
                        print(f"Stop call API status: {stop_res.status_code}, response: {stop_res.text}")
                except Exception as e:
                    print(f"Failed to automatically end call {call_sid} on inactivity: {e}")
                
                # Mark as completed/ended in backend state
                session["status"] = "Completed"
                # Update tracking so it doesn't trigger repeatedly
                session["last_updated_time"] = time.time()
        
    return JSONResponse(content=session)

@app.api_route("/{path_name:path}", methods=["GET", "POST", "PUT", "DELETE", "OPTIONS", "HEAD", "PATCH"])
async def catch_all(request: Request, path_name: str):
    # Exclude API routes
    if path_name.startswith("api/"):
        return JSONResponse(status_code=404, content={"detail": "Not Found"})
        
    next_url = f"http://localhost:3000/{path_name}"
    query_params = dict(request.query_params)
    
    async with httpx.AsyncClient() as client:
        try:
            req_headers = dict(request.headers)
            req_headers.pop("host", None)
            
            req_body = await request.body()
            
            response = await client.request(
                method=request.method,
                url=next_url,
                params=query_params,
                headers=req_headers,
                content=req_body,
                timeout=15.0
            )
            
            headers = dict(response.headers)
            headers.pop("content-encoding", None)
            headers.pop("content-length", None)
            
            return Response(
                content=response.content,
                status_code=response.status_code,
                headers=headers
            )
        except Exception as e:
            print(f"Error proxying to Next.js dev server: {e}")
            return JSONResponse(status_code=502, content={"error": "Next.js server is not reachable"})

# =====================================================================
# LEGACY TWILIO / DEEPGRAM / ELEVENLABS STREAMING PIPELINE (COMMENTED)
# =====================================================================
# @app.post("/api/twilio-voice")
# def twilio_voice():
#     ...
