# Sunrise Interiors - AI Voice Agent Cost & Architecture Guide

This document outlines the pricing structure, telephony requirements, and architecture options for deploying the outbound AI Voice Agent (**Zara**) to call Indian phone numbers.

---

## 1. Quick Cost Comparison (Summary Table)

| Option | Setup Complexity | Voice Accent Quality | Total Cost / Minute | Best Suited For |
| :--- | :--- | :--- | :--- | :--- |
| **Option 1: Bland.ai + Plivo** | **Low** (Bland.ai handles AI & voice; Plivo handles call routing) | Excellent (Natural ElevenLabs voice) | **~$0.069 (₹5.70) / min** | Fast deployment, high reliability, low maintenance. |
| **Option 2: Custom Backend** | **High** (Self-hosted FastAPI websocket pipeline) | Good (Cartesia / Deepgram voice) | **~$0.034 (₹2.80) / min** | Maximum cost savings, high scale. |
| **Current Test Sandbox** | **None** (Bland.ai shared number) | Good (Bland default voice) | **$0.09 (₹7.50) / min** | Sandbox prototyping only. |

---

## 2. Option 1 Details: Bland.ai + Plivo (₹5.70 / min)
This is the recommended path for launching quickly with high stability. Bland.ai runs the conversation logic, and routes calls through your Plivo carrier account.

### Cost Breakdown:
*   **Bland.ai Platform Fee (BYO Carrier rate):** $0.05 / minute (~₹4.15)
*   **Plivo Local Outbound Rate to India:** $0.019 / minute (~₹1.58)
*   **Total Cost:** **₹5.73 per minute**

### Architecture:
- **Web Dashboard** ➡️ *Trigger Outbound Call* ➡️ **FastAPI Backend**
- **FastAPI Backend** ➡️ *API Request* ➡️ **Bland.ai Engine**
- **Bland.ai Engine** ➡️ *SIP Trunk Routing* ➡️ **Plivo Carrier**
- **Plivo Carrier** ➡️ *Voice Call* ➡️ **Customer (Indian Mobile)**

---

## 3. Option 2 Details: Custom Backend (₹2.80 / min)
You host the full streaming pipeline yourself. The FastAPI backend opens direct WebSockets to Deepgram (Speech-to-Text) and Cartesia (Text-to-Speech).

### Cost Breakdown:
*   **Carrier Cost (Plivo Outbound):** $0.019 / minute (~₹1.58)
*   **Speech-to-Text (Deepgram Nova-2):** $0.0043 / minute (~₹0.35)
*   **Text-to-Speech (Cartesia / Deepgram Aura):** ~$0.012 / minute (~₹1.00)
*   **LLM Engine (Groq Llama-3):** Free (or <₹0.05/min at scale)
*   **Total Cost:** **₹2.93 per minute**

---

## 4. Crucial Compliance: The Indian Airtel/Jio Carrier Block
To call Indian mobile numbers (Airtel, Jio, Vi) from *any* cloud telephony carrier (Twilio, Plivo, Exotel), Indian Telecom Authority (TRAI) regulations mandate:

1.  **KYC Verification:** You must register your business with Plivo/Twilio using official Indian business documents (GST registration certificate, PAN Card, or Certificate of Incorporation).
2.  **Caller ID / Sender ID Registration:** You must rent a verified local Indian virtual number (approx. ₹100–300/month) to place the calls. International US/UK trial numbers are blocked by default to prevent spam.

*Note: In the current sandbox testing phase, Bland.ai routes calls through their own pre-verified enterprise carrier trunks, which is why it successfully bypasses this block for our developer tests.*
