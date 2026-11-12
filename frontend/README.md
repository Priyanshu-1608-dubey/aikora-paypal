# AIKORA - Cross-Border Family Wallet & Voice AI

AIKORA is a cross-border family wallet, quick-pay, and voice-driven gifting application built for the **PayPal + AI Hackathon**. It helps families living across different countries (such as the US, UK, UAE, and India) manage shared gifting, scan QR codes, shop by voice, and send festive digital shagun cards together.

---

## Key Features

- **QuickPay Actions:** Scan any QR code using the live device camera (or upload a QR image), pay anyone, initiate a bank transfer, or do a mobile recharge, all connected to PayPal Sandbox checkout.
- **Apnaa AI (Voice Agentic Commerce):** Tap the microphone and speak naturally (e.g., *"Sweets under $25"*) or select quick category chips to filter gifts by category and budget with 1-click **Buy with PayPal** cards.
- **Digital Shagun & WhatsApp Share:** Generates a festive Digital Shagun card with the verified PayPal transaction ID right after payment, ready to share on WhatsApp in one click.
- **Multi-Currency Switcher:** Live conversion across **USD ($)**, **INR (₹)**, **AED (د.إ)**, **GBP (£)**, and **EUR (€)** across the entire dashboard.
- **Autonomous Predictive Gifting Alerts:** Proactive festival reminders on the dashboard (e.g., upcoming Diwali) with 1-click *Approve & Pay* support.
- **Multi-Page Navigation & Auth:** Dedicated routes for Landing (`/`), Login (`/login`), Signup (`/signup`), Overview (`/dashboard`), Family Circle (`/dashboard/family`), Apnaa AI (`/dashboard/ai`), UtsavPay & Wallet (`/dashboard/wallet`), Celebrations (`/dashboard/celebrations`), and SevaConnect (`/dashboard/seva`).

---

## How We Used PayPal & AI

### PayPal Integration
- Integrated the **PayPal Developer Platform (Sandbox)** using `@paypal/react-paypal-js` (PayPal JS SDK).
- Used `actions.order.create` and `actions.order.capture` inside a unified PayPal checkout modal triggered across QuickPay flows (QR Pay, Pay Anyone, Bank Transfer, Mobile Recharge), AI-recommended product cards, Family Circle transfers, and SevaConnect donations.
- Captured transaction IDs are displayed on the post-payment Digital Shagun card.

### AI Integration
- **Apnaa AI Voice Commerce:** Uses the browser **Web Speech API** (`SpeechRecognition` / `webkitSpeechRecognition`) for voice commands combined with intent and budget extraction (e.g., matching categories like sweets, dry fruits, puja decor, fashion, shagun, and price limits like `under $25`).
- **Autonomous Predictive Alerts:** Proactively surfaces upcoming cultural gifting recommendations on the command center with one-click approval.

---

## Tech Stack

- **Frontend:** React, TypeScript, Vite, Tailwind CSS v4, React Router, Lucide Icons
- **Payments:** PayPal JS SDK (`@paypal/react-paypal-js`)
- **Voice & QR:** Web Speech API, `html5-qrcode` (live camera + image upload fallback)
- **Backend:** Spring Boot (Java 21), Spring Security, Maven
- **Database:** Neon Serverless PostgreSQL
- **Mobile App:** Capacitor (Android APK)

---

## Project Structure

```text
AIKORA-PayPal/
├── backend/                 # Spring Boot REST API + PostgreSQL config
├── frontend/                # React + TypeScript + Vite + Tailwind v4 app
│   ├── src/
│   │   ├── components/      # QuickPayActions (QR, Pay Anyone, Bank, Recharge)
│   │   ├── data/            # aiCatalog (products, categories, budget matcher)
│   │   ├── pages/           # Home, Login, Signup, Dashboard
│   │   └── services/        # API base URL helper (web + Capacitor mobile)
│   └── android/             # Capacitor Android project
├── LICENSE                  # MIT License
└── README.md
```

---

## Step-by-Step Setup Instructions

### Prerequisites
- **Node.js** (v18+) and **npm**
- **Java 21 (JDK 21)** and **Maven**
- **Android Studio / Android SDK** (only needed if building the Android APK)

---

### 1. Clone the Repository
```bash
git clone https://github.com/Priyanshu-1608-dubey/aikora-paypal.git
cd aikora-paypal
```

---

### 2. Run the Backend (Spring Boot + PostgreSQL)
```bash
cd backend
./mvnw spring-boot:run
```
*(On Windows PowerShell, use `.\mvnw.cmd spring-boot:run`)*

The backend server runs on `http://localhost:8080`.

---

### 3. Run the Frontend (React + Vite)
Open a new terminal:
```bash
cd frontend
npm install
npm run dev
```
Open **`http://localhost:5173`** in Google Chrome or Microsoft Edge.

---

### 4. Build the Android APK (Optional)
Inside the `frontend` folder:
```bash
npm run build
npx cap sync android
cd android
./gradlew assembleDebug
```
*(On Windows PowerShell, use `.\gradlew.bat assembleDebug`)*

The generated APK will be located at:
`frontend/android/app/build/outputs/apk/debug/app-debug.apk`

---

## Testing Guide
1. Open the app and click **Create account** or **Login** to enter the dashboard.
2. Switch currencies (**USD, INR, AED, GBP, EUR**) from the top-right dropdown to see live amount updates.
3. Try **Scan any QR code** (camera or upload QR image), **Pay anyone**, **Bank transfer**, or **Mobile recharge** to open **PayPal Sandbox** checkout.
4. Complete a sandbox payment to view the **Digital Shagun Card** and test **Share on WhatsApp**.
5. Open **Apnaa AI (Voice)** in the sidebar, click the Mic button (or tap a quick category chip), and click **Buy with PayPal** on any recommended item.

---

## License
This project is licensed under the **MIT License**. See the [LICENSE](LICENSE) file for details.
