# WTM: Backend

This directory contains the AI-powered backend for WTM (What's the Move), responsible for machine learning, data processing, and external API integrations.

## 🚀 Vision & Objectives
*Replace this section with what you want to achieve!*

### Core Goals
- [ ] **ML-Driven Peak Times**: Use historical and real-time data to predict when bars will be busiest.
- [ ] **Intelligent Client Requests**: Handle complex filtering and sorting that exceeds simple database queries.
- [ ] **Dynamic Heatmap Service**: Serve processed traffic data to the mobile frontend.
- [ ] **Third-Party Integration**: Efficiently bridge Google Maps and Supabase.

---

## 🛠 Tech Stack
- **Framework**: FastAPI (Python)
- **Database**: Supabase (PostgreSQL)
- **ML Libraries**: Pandas, Scikit-learn, etc.
- **APIs**: Google Maps Services

## 🏃 Getting Started
1. **Setup Environment**:
   ```bash
   python -m venv venv
   source venv/bin/activate  # Mac/Linux
   # venv\Scripts\activate  # Windows
   ```
2. **Install Dependencies**:
   ```bash
   pip install -r requirements.txt
   ```
3. **Configure Environment**:
   Copy `.env.example` to `.env` and add your API keys.
4. **Run Server**:
   ```bash
   python main.py
   ```
