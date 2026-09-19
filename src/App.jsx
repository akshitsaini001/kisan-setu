import { useEffect, useState } from "react";
import "./App.css";
import "./language-toggle.css";
import { supabase } from "./supabaseClient";
console.log("Supabase connected:", supabase);
/* =========================================
   CROP DATA
========================================= */

const crops = [
  { name: "Wheat", hindi: "गेहूँ", emoji: "🌾" },
{ name: "Rice", hindi: "धान", emoji: "🍚" },
  { name: "Maize", hindi: "मक्का", emoji: "🌽" },
  { name: "Mustard", hindi: "सरसों", emoji: "🌼" },
  { name: "Potato", hindi: "आलू", emoji: "🥔" },
  { name: "Gram", hindi: "चना", emoji: "🫘" },
];

/* =========================================
   PROCUREMENT CENTRES
========================================= */

const centres = [
  {
    name: "Rajajipuram Procurement Centre",
    distance: "3.2 km",
    waiting: 18,
    processing: 6,
    waitTime: "35 min",
    capacity: 72,
    status: "Available",
  },
  {
    name: "Aliganj Procurement Centre",
    distance: "5.8 km",
    waiting: 31,
    processing: 8,
    waitTime: "55 min",
    capacity: 88,
    status: "Busy",
  },
  {
    name: "Jankipuram Procurement Centre",
    distance: "7.1 km",
    waiting: 45,
    processing: 10,
    waitTime: "1 hr 20 min",
    capacity: 96,
    status: "Busy",
  },
];

/* =========================================
   INITIAL BUYER DEMANDS
========================================= */

const initialDemands = [
  {
    id: 1,
    buyer: "Shakti Agro Foods",
    crop: "Wheat",
    quantity: 100,
    rate: 2700,
    location: "Lucknow",
    expires: "2 days",
    status: "Active",
  },
  {
    id: 2,
    buyer: "UP Grain Traders",
    crop: "Wheat",
    quantity: 75,
    rate: 2650,
    location: "Barabanki",
    expires: "3 days",
    status: "Active",
  },
  {
    id: 3,
    buyer: "Kisan Fresh Foods",
    crop: "Wheat",
    quantity: 50,
    rate: 2725,
    location: "Lucknow",
    expires: "1 day",
    status: "Active",
  },
];

/* =========================================
   INITIAL TOKENS
========================================= */

const initialTokens = [
  {
    id: "KIS-042",
    farmer: "Ramesh Kumar",
    crop: "Wheat",
    quantity: 40,
    centre: "Rajajipuram",
    status: "Waiting",
  },
  {
    id: "KIS-043",
    farmer: "Suresh Yadav",
    crop: "Rice",
    quantity: 25,
    centre: "Rajajipuram",
    status: "Processing",
  },
  {
    id: "KIS-044",
    farmer: "Anil Verma",
    crop: "Wheat",
    quantity: 60,
    centre: "Rajajipuram",
    status: "Waiting",
  },
];

const translationsHi = {
  "Connecting Farmers, Buyers & Procurement Centres": "किसानों, खरीदारों और खरीद केंद्रों को जोड़ना",
  "Choose your role": "अपनी भूमिका चुनें",
  "Select how you want to access the Nova Farm platform.": "Nova Farm प्लेटफ़ॉर्म का उपयोग करने के लिए अपनी भूमिका चुनें।",
  "Farmer": "किसान",
  "Sell your crop, compare options and book procurement tokens.": "अपनी फसल बेचें, विकल्पों की तुलना करें और खरीद टोकन बुक करें।",
  "Procurement Officer": "खरीद अधिकारी",
  "Manage token queue and crop procurement operations.": "टोकन कतार और फसल खरीद की प्रक्रिया प्रबंधित करें।",
  "Verified Buyer": "सत्यापित खरीदार",
  "Create crop demand and connect with farmers.": "फसल की मांग बनाएं और किसानों से जुड़ें।",
  "Admin": "एडमिन",
  "Manage users, verification and platform monitoring.": "यूज़र्स, सत्यापन और प्लेटफ़ॉर्म की निगरानी करें।",
  "Secure access": "सुरक्षित प्रवेश",
  "Each role has its own login and dashboard.": "हर भूमिका के लिए अलग लॉगिन और डैशबोर्ड है।",
  "Back to roles": "भूमिका चयन पर वापस",
  "Welcome, Farmer": "स्वागत है, किसान",
  "Officer Login": "अधिकारी लॉगिन",
  "Buyer Login": "खरीदार लॉगिन",
  "Admin Login": "एडमिन लॉगिन",
  "FARMER LOGIN": "किसान लॉगिन",
  "PROCUREMENT OFFICER LOGIN": "खरीद अधिकारी लॉगिन",
  "VERIFIED BUYER LOGIN": "सत्यापित खरीदार लॉगिन",
  "ADMIN LOGIN": "एडमिन लॉगिन",
  "Login to access your Nova Farm dashboard.": "अपने Nova Farm डैशबोर्ड को एक्सेस करने के लिए लॉगिन करें।",
  "Farmer ID": "किसान ID",
  "Officer ID": "अधिकारी ID",
  "Buyer / Business ID": "खरीदार / बिज़नेस ID",
  "Registered Mobile Number": "रजिस्टर्ड मोबाइल नंबर",
  "Send OTP": "OTP भेजें",
  "OTP sent to registered mobile number.": "रजिस्टर्ड मोबाइल नंबर पर OTP भेज दिया गया है।",
  "Enter OTP": "OTP दर्ज करें",
  "Verify OTP & Login": "OTP सत्यापित करें और लॉगिन करें",
  "Change mobile number": "मोबाइल नंबर बदलें",
  "Demo OTP:": "डेमो OTP:",
  "Admin ID": "एडमिन ID",
  "Password": "पासवर्ड",
  "Login as Admin": "एडमिन के रूप में लॉगिन करें",
  "Demo Admin ID:": "डेमो एडमिन ID:",
  "This is a prototype login. Real authentication will be connected during backend integration.": "यह एक प्रोटोटाइप लॉगिन है। वास्तविक authentication backend integration के दौरान जोड़ा जाएगा।",
  "FARMER DASHBOARD": "किसान डैशबोर्ड",
  "Tell us about your crop to find the best selling option.": "बेहतर बिक्री विकल्प खोजने के लिए अपनी फसल की जानकारी दें।",
  "🌾 Crop Details": "🌾 फसल की जानकारी",
  "Select Crop": "फसल चुनें",
  "Expected Quantity (Quintal)": "अनुमानित मात्रा (क्विंटल)",
  "Compare Selling Options →": "बिक्री विकल्पों की तुलना करें →",
  "💡 Nova Farm": "💡 Nova Farm",
  "Government MSP aur verified private buyer demand ko compare karke farmer ko better option choose karne mein help karta hai.": "सरकारी MSP और सत्यापित निजी खरीदार की मांग की तुलना करके किसान को बेहतर विकल्प चुनने में मदद करता है।",
  "SELLING OPTIONS": "बिक्री विकल्प",
  "Compare government procurement with verified market demand.": "सरकारी खरीद और सत्यापित बाज़ार की मांग की तुलना करें।",
  "Government MSP": "सरकारी MSP",
  "Procurement Centre": "खरीद केंद्र",
  "Estimated Value": "अनुमानित मूल्य",
  "MSP price protected": "MSP मूल्य सुरक्षित",
  "Token / queue required": "टोकन / कतार आवश्यक",
  "Find Procurement Centre": "खरीद केंद्र खोजें",
  "Verified Market": "सत्यापित बाज़ार",
  "Private Buyer Demand": "निजी खरीदार की मांग",
  "✓ Verified Buyers": "✓ सत्यापित खरीदार",
  "+ ₹": "₹",
  " possible upside": " तक अतिरिक्त लाभ संभव",
  "View Buyer Demand": "खरीदार की मांग देखें",
  "PROCUREMENT CENTRES": "खरीद केंद्र",
  "Choose a nearby centre": "नज़दीकी केंद्र चुनें",
  "Select a centre based on distance and current queue.": "दूरी और वर्तमान कतार के आधार पर केंद्र चुनें।",
  "Available": "उपलब्ध",
  "Busy": "व्यस्त",
  "Waiting": "प्रतीक्षा",
  "Processing": "प्रक्रिया में",
  "Est. Wait": "अनुमानित प्रतीक्षा",
  "Capacity": "क्षमता",
  "Book Token": "टोकन बुक करें",
  "TOKEN GENERATED": "टोकन जनरेट हो गया",
  "Your procurement token is ready": "आपका खरीद टोकन तैयार है",
  "Crop": "फसल",
  "Quantity": "मात्रा",
  "Centre": "केंद्र",
  "Status": "स्थिति",
  "⏱ Estimated waiting time": "⏱ अनुमानित प्रतीक्षा समय",
  "Back to Farmer Dashboard": "किसान डैशबोर्ड पर वापस",
  "VERIFIED BUYER DEMAND": "सत्यापित खरीदार की मांग",
  "Available buyers": "उपलब्ध खरीदार",
  "These buyers have active crop requirements.": "इन खरीदारों की वर्तमान फसल आवश्यकताएं हैं।",
  "✓ Verified Buyer": "✓ सत्यापित खरीदार",
  "Connect with Buyer": "खरीदार से जुड़ें",
  "PROCUREMENT MANAGEMENT": "खरीद प्रबंधन",
  "Officer Dashboard": "अधिकारी डैशबोर्ड",
  "Manage procurement centre token queue.": "खरीद केंद्र की टोकन कतार प्रबंधित करें।",
  "● LIVE": "● लाइव",
  "Completed": "पूर्ण",
  "Centre Capacity": "केंद्र क्षमता",
  "🎫 Token Queue": "🎫 टोकन कतार",
  "Refresh": "रिफ्रेश",
  "Token": "टोकन",
  "Action": "कार्रवाई",
  "Start": "शुरू करें",
  "Complete": "पूर्ण करें",
  "📊 Centre Operations": "📊 केंद्र संचालन",
  "Daily Capacity": "दैनिक क्षमता",
  "Queue Load": "कतार लोड",
  "VERIFIED BUYER": "सत्यापित खरीदार",
  "Buyer Dashboard": "खरीदार डैशबोर्ड",
  "Create demand and connect with farmers.": "मांग बनाएं और किसानों से जुड़ें।",
  "✓ VERIFIED": "✓ सत्यापित",
  "Active Demands": "सक्रिय मांग",
  "Total Required": "कुल आवश्यक मात्रा",
  "Avg. Rate": "औसत दर",
  "➕ Create New Demand": "➕ नई मांग बनाएं",
  "Tell farmers what crop you need.": "किसानों को बताएं कि आपको कौन-सी फसल चाहिए।",
  "Required Quantity (Quintal)": "आवश्यक मात्रा (क्विंटल)",
  "Offered Rate / Quintal": "प्रति क्विंटल प्रस्तावित दर",
  "Location": "स्थान",
  "Publish Demand": "मांग प्रकाशित करें",
  "📋 Active Demands": "📋 सक्रिय मांग",
  "Your current crop requirements.": "आपकी वर्तमान फसल आवश्यकताएं।",
  "Remove": "हटाएं",
  "PLATFORM ADMINISTRATION": "प्लेटफ़ॉर्म प्रशासन",
  "Admin Dashboard": "एडमिन डैशबोर्ड",
  "Monitor Nova Farm users and operations.": "Nova Farm यूज़र्स और संचालन की निगरानी करें।",
  "● SYSTEM ONLINE": "● सिस्टम ऑनलाइन",
  "Registered Farmers": "रजिस्टर्ड किसान",
  "Verified Buyers": "सत्यापित खरीदार",
  "Procurement Centres": "खरीद केंद्र",
  "Pending Verification": "सत्यापन लंबित",
  "Farmers": "किसान",
  "Registered users": "रजिस्टर्ड यूज़र्स",
  "Buyers": "खरीदार",
  "Verified businesses": "सत्यापित व्यवसाय",
  "Centres": "केंद्र",
  "Active procurement centres": "सक्रिय खरीद केंद्र",
  "Tokens Today": "आज के टोकन",
  "Generated today": "आज जनरेट हुए",
  "🔎 Buyer Verification": "🔎 खरीदार सत्यापन",
  "Pending business verification requests.": "लंबित बिज़नेस सत्यापन अनुरोध।",
  "Pending": "लंबित",
  "Review": "समीक्षा करें",
  "📈 Platform Overview": "📈 प्लेटफ़ॉर्म अवलोकन",
  "Farmer Registration": "किसान पंजीकरण",
  "Buyer Verification": "खरीदार सत्यापन",
  "Centre Digitisation": "केंद्र डिजिटलीकरण",
  "Logout": "लॉगआउट",
  "Roles": "भूमिकाएं",
  "← Back": "← वापस",
  "← Back to roles": "← भूमिका चयन पर वापस",
  "© 2026 Nova Farm • Smart Agriculture Procurement Platform": "© 2026 Nova Farm • स्मार्ट कृषि खरीद प्लेटफ़ॉर्म",
  "Enter Farmer ID": "किसान ID दर्ज करें",
  "Enter Officer ID": "अधिकारी ID दर्ज करें",
  "Enter Buyer ID": "खरीदार ID दर्ज करें",
  "10 digit mobile number": "10 अंकों का मोबाइल नंबर",
  "Enter 6 digit OTP": "6 अंकों का OTP दर्ज करें",
  "Enter Admin ID": "एडमिन ID दर्ज करें",
  "Enter password": "पासवर्ड दर्ज करें",
  "Example: 50": "उदाहरण: 50",
  "Example: 100": "उदाहरण: 100",
  "Example: 2700": "उदाहरण: 2700",
  "Example: Lucknow": "उदाहरण: लखनऊ",
  "Please enter your ID.": "कृपया अपनी ID दर्ज करें।",
  "Please enter a valid 10-digit mobile number.": "कृपया मान्य 10 अंकों का मोबाइल नंबर दर्ज करें।",
  "Demo OTP: 123456": "डेमो OTP: 123456",
  "Invalid OTP. Use Demo OTP: 123456": "गलत OTP। डेमो OTP इस्तेमाल करें: 123456",
  "Please select a crop.": "कृपया फसल चुनें।",
  "Please enter a valid quantity.": "कृपया मान्य मात्रा दर्ज करें।",
  "Please fill all demand details.": "कृपया मांग की सभी जानकारी भरें।",
  "Demand created successfully.": "मांग सफलतापूर्वक बनाई गई।",
  "Queue refreshed": "कतार रिफ्रेश हो गई।",
  "Buyer verification approved": "खरीदार का सत्यापन स्वीकृत हो गया।",
  "Connection request sent to {buyer}": "{buyer} को कनेक्शन अनुरोध भेज दिया गया।",
  "Invalid Admin ID or password.\\n\\nDemo:\\nID: ADMIN001\\nPassword: admin123": "गलत Admin ID या पासवर्ड।\n\nडेमो:\nID: ADMIN001\nपासवर्ड: admin123",
  "possible upside": "तक अतिरिक्त लाभ संभव",
  "⚠️ Token / queue required": "⚠️ टोकन / कतार आवश्यक",
  "✔ MSP price protected": "✔ MSP मूल्य सुरक्षित",
  "🌾 Nova Farm": "🌾 Nova Farm",
  "🔐 Secure access": "🔐 सुरक्षित प्रवेश",
  "NOVA FARM PLATFORM": "NOVA FARM प्लेटफ़ॉर्म",
  "/quintal": "/क्विंटल",
  "LIVE TOKEN STATUS": "लाइव टोकन स्थिति",
  "Your procurement journey is updated in real time.": "आपकी खरीद प्रक्रिया रियल टाइम में अपडेट होती है।",
  "Token Booked": "टोकन बुक हो गया",
  "Entry Completed": "प्रवेश पूरा हो गया",
  "Waiting for Procurement": "खरीद की प्रतीक्षा",
  "Procurement Started": "खरीद शुरू हो गई",
  "Quality Check": "गुणवत्ता जांच",
  "Weighing": "वजन किया जा रहा है",
  "Procurement Completed": "खरीद पूरी हो गई",
  "Farmers ahead": "आपसे आगे किसान",
  "Last updated": "अंतिम अपडेट",
  "Live update": "लाइव अपडेट",
  "Mark Entry": "प्रवेश दर्ज करें",
  "Start Procurement": "खरीद शुरू करें",
  "Start Quality Check": "गुणवत्ता जांच शुरू करें",
  "Start Weighing": "वजन शुरू करें",
  "Don't have an account?": "क्या आपका अकाउंट नहीं है?",
  "Register as a New Buyer →": "नए खरीदार के रूप में रजिस्टर करें →",
  "NEW BUYER REGISTRATION": "नया खरीदार पंजीकरण",
  "Register as a New Buyer": "नए खरीदार के रूप में रजिस्टर करें",
  "Create your buyer profile for Nova Farm.": "Nova Farm के लिए अपना खरीदार प्रोफाइल बनाएं।",
  "Owner / Contact Name": "मालिक / संपर्क नाम",
  "Business / Company Name": "बिज़नेस / कंपनी का नाम",
  "Email Address": "ईमेल पता",
  "Business Type": "बिज़नेस प्रकार",
  "Select business type": "बिज़नेस प्रकार चुनें",
  "Trader": "ट्रेडर",
  "Processor": "प्रोसेसर",
  "Wholesaler": "थोक व्यापारी",
  "Retailer": "रिटेलर",
  "Other": "अन्य",
  "GSTIN": "GSTIN",
  "PAN": "PAN",
  "Business Address": "बिज़नेस का पता",
  "Enter your name": "अपना नाम दर्ज करें",
  "Enter business name": "बिज़नेस का नाम दर्ज करें",
  "Enter email address": "ईमेल पता दर्ज करें",
  "Enter GSTIN": "GSTIN दर्ज करें",
  "Enter PAN": "PAN दर्ज करें",
  "Enter business address": "बिज़नेस का पता दर्ज करें",
  "Submit Registration": "पंजीकरण सबमिट करें",
  "Back to Buyer Login": "← खरीदार लॉगिन पर वापस",
  "Please fill all registration details.": "कृपया पंजीकरण की सभी जानकारी भरें।",
  "Registration submitted successfully.": "पंजीकरण सफलतापूर्वक सबमिट हो गया।",
  "Your application is now pending Admin verification.": "आपका आवेदन अब Admin सत्यापन के लिए लंबित है।",
  "AI Voice Assistant": "AI वॉइस असिस्टेंट",
  "Get quick help with Nova Farm features and procurement.": "Nova farm के फीचर्स और खरीद प्रक्रिया में तुरंत मदद पाएं।",
  "Ask Assistant": "असिस्टेंट से पूछें",
  "Voice Assistant": "वॉइस असिस्टेंट",
  "Voice assistance will be available soon.": "वॉइस असिस्टेंस जल्द उपलब्ध होगा।",
  "Tap to Speak": "बोलने के लिए टैप करें",
  "Demo Feature": "डेमो फीचर",
  "Close": "बंद करें",
    "Payment Processing": "भुगतान प्रक्रिया में",
  "Payment Completed": "भुगतान पूरा हो गया",
  "Start Payment": "भुगतान शुरू करें",
  "Complete Payment": "भुगतान पूरा करें",
};

/* =========================================
   MAIN APP
========================================= */

function App() {

  /* =========================================
     LANGUAGE
     ========================================= */

  const [language, setLanguage] = useState(
    () => localStorage.getItem("kisanSetuLanguage") || "en"
  );

  const changeLanguage = (lang) => {
    setLanguage(lang);
    localStorage.setItem("kisanSetuLanguage", lang);
  };

  const t = (text) => {
    if (language === "en") return text;
    const hi = translationsHi[text];
    return hi || text;
  };

  /* =========================================
     MAIN SCREEN STATE
  ========================================= */

  const [screen, setScreen] = useState("roles");
  const [showVoiceAssistant, setShowVoiceAssistant] = useState(false);

  /* =========================================
     FARMER CROP FLOW
  ========================================= */

  const [crop, setCrop] = useState("");
  const [quantity, setQuantity] = useState("");
  const [selectedCentre, setSelectedCentre] = useState(null);

  /* =========================================
     SHARED DATA
  ========================================= */

  const [demands, setDemands] = useState(initialDemands);
  const [tokens, setTokens] = useState(() => {
    try {
      const saved = localStorage.getItem("kisanSetuTokens");
      return saved ? JSON.parse(saved) : initialTokens;
    } catch {
      return initialTokens;
    }
  });

  useEffect(() => {
    localStorage.setItem("kisanSetuTokens", JSON.stringify(tokens));
  }, [tokens]);

  useEffect(() => {
    const handleStorage = (event) => {
      if (event.key !== "kisanSetuTokens" || !event.newValue) return;
      try {
        setTokens(JSON.parse(event.newValue));
      } catch {
        // Ignore malformed storage data.
      }
    };

    window.addEventListener("storage", handleStorage);

    return () => {
      window.removeEventListener("storage", handleStorage);
    };
  }, []);
/* =========================================
   SUPABASE TOKEN REALTIME
========================================= */

useEffect(() => {
  const channel = supabase
    .channel("kisan-setu-token-updates")

    /* =========================================
       NEW TOKEN BOOKED - INSERT
    ========================================= */
    .on(
      "postgres_changes",
      {
        event: "INSERT",
        schema: "public",
        table: "tokens",
      },
      (payload) => {
        console.log("Realtime NEW token:", payload);

        const newTokenData = payload.new;

        const newToken = {
          id: newTokenData.token_id,
          farmer: newTokenData.farmer,
          crop: newTokenData.crop,
          quantity: Number(newTokenData.quantity),
          centre: newTokenData.centre,
          status: newTokenData.status,
          createdAt: newTokenData.created_at,
          updatedAt: newTokenData.updated_at,
          history: [],
        };

        setTokens((prev) => {
          // Prevent duplicate token on the farmer device.
          // The farmer already adds its own token locally.
          const alreadyExists = prev.some(
            (token) => token.id === newToken.id
          );

          if (alreadyExists) {
            return prev;
          }

          return [...prev, newToken];
        });
      }
    )

    /* =========================================
       TOKEN STATUS UPDATE
    ========================================= */
    .on(
      "postgres_changes",
      {
        event: "UPDATE",
        schema: "public",
        table: "tokens",
      },
      (payload) => {
        console.log("Realtime token update:", payload);

        const updatedToken = payload.new;

        setTokens((prev) =>
          prev.map((token) => {
            if (token.id !== updatedToken.token_id) {
              return token;
            }

            return {
              ...token,
              status: updatedToken.status,
              updatedAt: updatedToken.updated_at,
            };
          })
        );
      }
    )

    /* =========================================
       TOKEN HISTORY UPDATE
    ========================================= */
    .on(
      "postgres_changes",
      {
        event: "INSERT",
        schema: "public",
        table: "token_history",
      },
      async (payload) => {
        console.log("Realtime history update:", payload);

        const newHistory = payload.new;

        const { data: tokenData, error } = await supabase
          .from("tokens")
          .select("token_id")
          .eq("id", newHistory.token_id)
          .single();

        if (error || !tokenData) {
          console.error(
            "History token lookup error:",
            error
          );
          return;
        }

        setTokens((prev) =>
          prev.map((token) => {
            if (token.id !== tokenData.token_id) {
              return token;
            }

            const alreadyExists = (token.history || []).some(
              (item) =>
                item.status === newHistory.status &&
                item.time === newHistory.event_time
            );

            if (alreadyExists) {
              return token;
            }

            return {
              ...token,
              history: [
                ...(token.history || []),
                {
                  id: newHistory.id,
                  status: newHistory.status,
                  time: newHistory.event_time,
                },
              ],
            };
          })
        );
      }
    )

    /* =========================================
       SUBSCRIBE
    ========================================= */
    .subscribe((status) => {
      console.log("Realtime subscription:", status);
    });

  return () => {
    supabase.removeChannel(channel);
  };
}, []);

  /* =========================================
     LOAD TOKENS + HISTORY FROM SUPABASE
  ========================================= */

  useEffect(() => {
    const loadTokensFromSupabase = async () => {
      try {
        const { data, error } = await supabase
          .from("tokens")
          .select(`
            id,
            token_id,
            farmer,
            crop,
            quantity,
            centre_id,
            centre,
            status,
            created_at,
            updated_at,
            token_history (
              id,
              status,
              event_time
            )
          `)
          .order("created_at", { ascending: true });

        if (error) {
          console.error("Token fetch error:", error);
          return;
        }

        const backendTokens = (data || []).map((token) => ({
          id: token.token_id,
          farmer: token.farmer,
          crop: token.crop,
          quantity: token.quantity,
          centre: token.centre,
          status: token.status,
          createdAt: token.created_at,
          updatedAt: token.updated_at,
          history: (token.token_history || [])
            .sort(
              (a, b) =>
                new Date(a.event_time) - new Date(b.event_time)
            )
            .map((item) => ({
              id: item.id,
              status: item.status,
              time: item.event_time,
            })),
        }));

        setTokens((prev) => {
          const backendIds = new Set(
            backendTokens.map((token) => token.id)
          );

          const localOnlyTokens = prev.filter(
            (token) => !backendIds.has(token.id)
          );

          return [...backendTokens, ...localOnlyTokens];
        });
      } catch (error) {
        console.error(
          "Unexpected token fetch error:",
          error
        );
      }
    };

    loadTokensFromSupabase();
  }, []);

  /* =========================================
     AUTH STATE
  ========================================= */

  const [loginRole, setLoginRole] = useState("");
  const [loggedInRole, setLoggedInRole] = useState(() =>
    sessionStorage.getItem("kisanSetuLoggedInRole") || ""
  );

  const [loginId, setLoginId] = useState(() =>
    sessionStorage.getItem("kisanSetuLoginId") || ""
  );
  const [loginMobile, setLoginMobile] = useState(() =>
    sessionStorage.getItem("kisanSetuLoginMobile") || ""
  );
  const [loginOtp, setLoginOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);

  const [adminPassword, setAdminPassword] = useState("");
const [officerCentre, setOfficerCentre] = useState(() => {
  try {
    const saved = sessionStorage.getItem("kisanSetuOfficerCentre");
    return saved ? JSON.parse(saved) : null;
  } catch {
    return null;
  }
});

  /* =========================================
     RESTORE LOGIN SESSION AFTER REFRESH
  ========================================= */

  useEffect(() => {
    const savedRole = sessionStorage.getItem("kisanSetuLoggedInRole");
    const savedLoginId = sessionStorage.getItem("kisanSetuLoginId");
    const savedLoginMobile = sessionStorage.getItem("kisanSetuLoginMobile");
    const savedOfficerCentre = sessionStorage.getItem(
  "kisanSetuOfficerCentre"
);

    if (savedRole) {
      setLoggedInRole(savedRole);
      setLoginRole(savedRole);

      if (savedLoginId) {
        setLoginId(savedLoginId);
      }

      if (savedLoginMobile) {
        setLoginMobile(savedLoginMobile);
      }
      if (savedOfficerCentre) {
  try {
    setOfficerCentre(JSON.parse(savedOfficerCentre));
  } catch {
    sessionStorage.removeItem("kisanSetuOfficerCentre");
  }
}

      if (savedRole === "farmer") {
        setScreen("home");
      } else if (savedRole === "buyer") {
        setScreen("buyer");
      } else if (savedRole === "officer") {
        setScreen("officer");
      } else if (savedRole === "admin") {
        setScreen("admin");
      }
    }
  }, []);

  /* =========================================
     BUYER FORM
  ========================================= */

  const [buyerCrop, setBuyerCrop] = useState("");
  const [buyerQuantity, setBuyerQuantity] = useState("");
  const [buyerRate, setBuyerRate] = useState("");
  const [buyerLocation, setBuyerLocation] = useState("");

  /* =========================================
     BUYER REGISTRATION
  ========================================= */

  const [buyerRegisterMode, setBuyerRegisterMode] = useState(false);
  const [buyerName, setBuyerName] = useState("");
  const [buyerBusiness, setBuyerBusiness] = useState("");
  const [buyerEmail, setBuyerEmail] = useState("");
  const [buyerBusinessType, setBuyerBusinessType] = useState("");
  const [buyerGstin, setBuyerGstin] = useState("");
  const [buyerPan, setBuyerPan] = useState("");
  const [buyerAddress, setBuyerAddress] = useState("");

  const submitBuyerRegistration = () => {
    if (
      !buyerName.trim() ||
      !buyerBusiness.trim() ||
      !/^[0-9]{10}$/.test(loginMobile) ||
      !buyerEmail.trim() ||
      !buyerBusinessType ||
      !buyerGstin.trim() ||
      !buyerPan.trim() ||
      !buyerAddress.trim()
    ) {
      alert(t("Please fill all registration details."));
      return;
    }

    alert(
      `${t("Registration submitted successfully.")}\\n\\n${t(
        "Your application is now pending Admin verification."
      )}`
    );

    setBuyerRegisterMode(false);
    setBuyerName("");
    setBuyerBusiness("");
    setBuyerEmail("");
    setBuyerBusinessType("");
    setBuyerGstin("");
    setBuyerPan("");
    setBuyerAddress("");
    setLoginMobile("");
  };

  /* =========================================
     DEMO RATES
  ========================================= */

  const governmentRate = 2585;
  const marketRate = 2700;
  /* =========================================
     AUTH FUNCTIONS
  ========================================= */

  const resetLoginFields = () => {
    setLoginId("");
    setLoginMobile("");
    setLoginOtp("");
    setAdminPassword("");
    setOtpSent(false);
  };

  const chooseRole = (role) => {
    setLoginRole(role);
    resetLoginFields();
    setScreen("login");
  };

  const sendLoginOtp = () => {
    if (!loginId.trim()) {
      alert(t("Please enter your ID."));
      return;
    }

    if (!/^\d{10}$/.test(loginMobile)) {
      alert(t("Please enter a valid 10-digit mobile number."));
      return;
    }

    setOtpSent(true);

    alert(t("Demo OTP: 123456"));
  };

  const verifyLoginOtp = async () => {
    if (loginOtp !== "123456") {
      alert(t("Invalid OTP. Use Demo OTP: 123456"));
      return;
    }

    try {
      // Farmer / Buyer login
      if (loginRole !== "officer") {
        setLoggedInRole(loginRole);
        setLoginRole(loginRole);
        sessionStorage.setItem("kisanSetuLoggedInRole", loginRole);
        sessionStorage.setItem("kisanSetuLoginId", loginId.trim());
        sessionStorage.setItem("kisanSetuLoginMobile", loginMobile);

        if (loginRole === "farmer") {
          setScreen("home");
        } else if (loginRole === "buyer") {
          setScreen("buyer");
        }

        return;
      }

      // Officer login → fetch assigned centre
      const { data: officer, error } = await supabase
        .from("profiles")
        .select(`
          id,
          name,
          login_id,
          centre_id,
          procurement_centres (
            id,
            name
          )
        `)
        .eq("login_id", loginId.trim())
        .eq("role", "officer")
        .single();

      if (error || !officer) {
        console.error("Officer login error:", error);
        alert("Officer ID nahi mila. Please check your Officer ID.");
        return;
      }

      if (!officer.centre_id || !officer.procurement_centres) {
        alert(
          "Is officer ke saath koi procurement centre assigned nahi hai."
        );
        return;
      }

      // Save logged-in officer + assigned centre
      setLoggedInRole("officer");
      setLoginRole("officer");
      sessionStorage.setItem("kisanSetuLoggedInRole", "officer");
      sessionStorage.setItem("kisanSetuLoginId", loginId.trim());
      sessionStorage.setItem("kisanSetuLoginMobile", loginMobile);
      setScreen("officer");

      // Store officer centre information in React state
      setOfficerCentre({
        officerId: officer.id,
        loginId: officer.login_id,
        centreId: officer.centre_id,
        centreName: officer.procurement_centres.name,
      });

      // Store officer centre information in localStorage
      sessionStorage.setItem(
  "kisanSetuOfficerCentre",
  JSON.stringify({
    officerId: officer.id,
    loginId: officer.login_id,
    centreId: officer.centre_id,
    centreName: officer.procurement_centres.name,
  })
);

    } catch (error) {
      console.error("Unexpected officer login error:", error);
      alert("Officer login ke time kuch problem aa gayi.");
    }
  };

  const adminLogin = () => {
    if (loginId !== "ADMIN001" || adminPassword !== "admin123") {
      alert(
        t(
          "Invalid Admin ID or password.\n\nDemo:\nID: ADMIN001\nPassword: admin123"
        )
      );
      return;
    }

    setLoggedInRole("admin");
    setLoginRole("admin");
    sessionStorage.setItem("kisanSetuLoggedInRole", "admin");
    sessionStorage.setItem("kisanSetuLoginId", loginId.trim());
    setScreen("admin");
  };

  const logout = () => {
    sessionStorage.removeItem("kisanSetuLoggedInRole");
    sessionStorage.removeItem("kisanSetuLoginId");
    sessionStorage.removeItem("kisanSetuLoginMobile");
    sessionStorage.removeItem("kisanSetuOfficerCentre");

    setLoggedInRole("");
    setLoginRole("");
    setOfficerCentre(null);
    resetLoginFields();
    setScreen("roles");
  };
  /* =========================================
     FARMER FUNCTIONS
  ========================================= */

  const goToCompare = () => {
    if (!crop) {
      alert(t("Please select a crop."));
      return;
    }

    if (!quantity || Number(quantity) <= 0) {
      alert(t("Please enter a valid quantity."));
      return;
    }

    setScreen("compare");
  };

  const selectGovernment = () => {
    setScreen("centres");
  };
const generateToken = async (centre) => {
  setSelectedCentre(centre);

  try {
    const now = new Date().toISOString();

  const { data: latestToken, error: latestTokenError } = await supabase
  .from("tokens")
  .select("token_id")
  .order("token_id", { ascending: false })
  .limit(1)
  .maybeSingle();

if (latestTokenError) {
  console.error("Latest token fetch error:", latestTokenError);
  alert("Token number generate nahi ho paya. Please try again.");
  return;
}

let nextTokenNumber = 45;

if (latestToken?.token_id) {
  const lastNumber = parseInt(
    latestToken.token_id.replace("KIS-", ""),
    10
  );

  if (!Number.isNaN(lastNumber)) {
    nextTokenNumber = lastNumber + 1;
  }
}

const tokenNumber = `KIS-${String(nextTokenNumber).padStart(3, "0")}`;

    const { data: centreData, error: centreError } = await supabase
      .from("procurement_centres")
      .select("id, name")
      .eq("name", centre.name)
      .single();

    if (centreError) {
      console.error("Centre fetch error:", centreError);
      alert("Procurement centre database se connect nahi ho pa raha.");
      return;
    }

    const { data: newTokenData, error: tokenError } = await supabase
      .from("tokens")
      .insert([
        {
          token_id: tokenNumber,
          farmer: loginId || "Demo Farmer",
          crop,
          quantity: Number(quantity),
          centre_id: centreData.id,
          centre: centreData.name,
          status: "Waiting",
          created_at: now,
          updated_at: now,
        },
      ])
      .select()
      .single();

    if (tokenError) {
      console.error("Token insert error:", tokenError);
      alert("Token save nahi ho paya. Please try again.");
      return;
    }

    const { error: historyError } = await supabase
      .from("token_history")
      .insert([
        {
          token_id: newTokenData.id,
          status: "Token Booked",
          event_time: now,
        },
      ]);

    if (historyError) {
      console.error("History insert error:", historyError);
    }

    const newToken = {
      id: newTokenData.token_id,
      farmer: newTokenData.farmer,
      crop: newTokenData.crop,
      quantity: newTokenData.quantity,
      centre: newTokenData.centre,
      status: newTokenData.status,
      createdAt: newTokenData.created_at,
      updatedAt: newTokenData.updated_at,
      history: [
        {
          status: "Token Booked",
          time: now,
        },
      ],
    };

    setTokens((prev) => {
  const alreadyExists = prev.some(
    (token) => token.id === newToken.id
  );

  if (alreadyExists) {
    return prev;
  }

  return [...prev, newToken];
});

setScreen("token");

  } catch (error) {
    console.error("Unexpected token error:", error);
    alert("Something went wrong while booking token.");
  }
};

  /* =========================================
     BUYER FUNCTIONS
  ========================================= */

  const createDemand = () => {
    if (!buyerCrop || !buyerQuantity || !buyerRate || !buyerLocation) {
      alert(t("Please fill all demand details."));
      return;
    }

    const newDemand = {
      id: Date.now(),
      buyer: loginId || "Verified Buyer",
      crop: buyerCrop,
      quantity: Number(buyerQuantity),
      rate: Number(buyerRate),
      location: buyerLocation,
      expires: "5 days",
      status: "Active",
    };

    setDemands((prev) => [...prev, newDemand]);

    setBuyerCrop("");
    setBuyerQuantity("");
    setBuyerRate("");
    setBuyerLocation("");

    alert(t("Demand created successfully."));
  };

  const removeDemand = (id) => {
    setDemands((prev) => prev.filter((item) => item.id !== id));
  };
/* =========================================
   OFFICER FUNCTIONS
========================================= */

const updateTokenStatus = async (tokenId) => {
  const statusFlow = {
    Waiting: {
      next: "Entry Completed",
      history: "Entry Completed",
    },

    "Entry Completed": {
      next: "Processing",
      history: "Procurement Started",
    },

    Processing: {
      next: "Quality Check",
      history: "Quality Check",
    },

    "Quality Check": {
      next: "Weighing",
      history: "Weighing",
    },

    Weighing: {
      next: "Completed",
      history: "Procurement Completed",
    },

    /* ================================
       PAYMENT FLOW
    ================================= */

    Completed: {
      next: "Payment Processing",
      history: "Payment Processing",
    },

    "Payment Processing": {
      next: "Payment Completed",
      history: "Payment Completed",
    },
  };

  const currentToken = tokens.find(
    (token) => token.id === tokenId
  );

  if (!currentToken) {
    alert("Token nahi mila.");
    return;
  }

  const transition = statusFlow[currentToken.status];

  if (!transition) {
    return;
  }

  const now = new Date().toISOString();

  try {
    /* =========================================
       1. UPDATE TOKEN IN SUPABASE
    ========================================= */

    const { data: updatedToken, error: tokenError } =
      await supabase
        .from("tokens")
        .update({
          status: transition.next,
          updated_at: now,
        })
        .eq("token_id", tokenId)
        .select()
        .single();

    if (tokenError) {
      console.error("Token update error:", tokenError);

      alert(
        "Token status update nahi ho paya. Please try again."
      );

      return;
    }

    /* =========================================
       2. SAVE STATUS HISTORY
    ========================================= */

    const { error: historyError } = await supabase
      .from("token_history")
      .insert([
        {
          token_id: updatedToken.id,
          status: transition.history,
          event_time: now,
        },
      ]);

    if (historyError) {
      console.error(
        "Token history error:",
        historyError
      );

      alert(
        "Token update ho gaya, lekin history save nahi ho payi."
      );
    }

    /* =========================================
       3. UPDATE LOCAL UI
    ========================================= */

    setTokens((prev) =>
      prev.map((token) => {
        if (token.id !== tokenId) {
          return token;
        }

        return {
          ...token,
          status: transition.next,
          updatedAt: now,
          history: [
            ...(token.history || []),
            {
              status: transition.history,
              time: now,
            },
          ],
        };
      })
    );

  } catch (error) {
    console.error(
      "Unexpected status update error:",
      error
    );

    alert(
      "Something went wrong while updating token."
    );
  }
};

  /* =========================================
     LIVE TOKEN HELPERS
  ========================================= */

  const farmerToken = [...tokens]
    .reverse()
    .find((token) => token.farmer === (loginId || "Demo Farmer"));

  const getTokenStatusLabel = (status) => {
    const labels = {
      Waiting: "Token Booked",
      "Entry Completed": "Entry Completed",
      Processing: "Procurement Started",
      "Quality Check": "Quality Check",
      Weighing: "Weighing",
      Completed: "Procurement Completed",

          "Payment Processing": "Payment Processing",
    "Payment Completed": "Payment Completed",
    };
    return labels[status] || status;
  };

 const getNextOfficerAction = (status) => {
  const actions = {
    Waiting: "Mark Entry",
    "Entry Completed": "Start Procurement",
    Processing: "Start Quality Check",
    "Quality Check": "Start Weighing",
    Weighing: "Complete",

    Completed: "Start Payment",
    "Payment Processing": "Complete Payment",
  };

  return actions[status] || "Complete";
};

const getQueueAhead = (token) => {
  if (!token) return 0;

  const activeAtCentre = tokens.filter(
    (item) =>
      item.centre === token.centre &&
      ![
        "Completed",
        "Payment Processing",
        "Payment Completed",
      ].includes(item.status)
  );

  const index = activeAtCentre.findIndex(
    (item) => item.id === token.id
  );

  return index >= 0 ? index : 0;
};
  /* =========================================
     ROLE NAME
  ========================================= */

  const getRoleName = () => {
    if (loggedInRole === "farmer") return t("Farmer");
    if (loggedInRole === "officer") return t("Procurement Officer");
    if (loggedInRole === "buyer") return t("Verified Buyer");
    if (loggedInRole === "admin") return t("Admin");

    return "";
  };

  /* =========================================
     CROP CARD COMPONENT
  ========================================= */

  const CropCards = ({ value, onChange }) => {
    return (
      <div className="crop-selection">
        <label>{t("Select Crop")}</label>

        <div className="crop-grid">
          {crops.map((item) => (
            <button
              type="button"
              key={item.name}
              className={`crop-card ${
                value === item.name ? "selected" : ""
              }`}
              onClick={() => onChange(item.name)}
            >
              <span className="crop-emoji">
                {item.emoji}
              </span>

              <span className="crop-name">
                {item.name}
              </span>

              <span className="crop-hindi">
                {item.hindi}
              </span>

              {value === item.name && (
                <span className="crop-check">
                  ✓
                </span>
              )}
            </button>
          ))}
        </div>
      </div>
    );
  };

  /* =========================================
     RETURN
  ========================================= */

  return (
    <div className="app">

      {/* =========================================
          HEADER
      ========================================= */}

      <header className="header">

        <div>
          <div className="logo">
            {t("🌾 Nova Farm")}
          </div>

          <div className="tagline">
            {t("Connecting Farmers, Buyers & Procurement Centres")}
          </div>
        </div>

        <div className="language-switcher">
          <button
            className={`language-button ${language === "en" ? "active" : ""}`}
            onClick={() => changeLanguage("en")}
          >
            English
          </button>
          <button
            className={`language-button ${language === "hi" ? "active" : ""}`}
            onClick={() => changeLanguage("hi")}
          >
            हिंदी
          </button>
        </div>

        <div className="header-actions">

          {loggedInRole && (
            <>
              <span className="logged-role">
                {getRoleName()}
              </span>

              <button
                className="secondary-button header-button"
                onClick={logout}
              >
                {t("Logout")}
              </button>
            </>
          )}

          {!loggedInRole && screen !== "roles" && (
            <button
              className="secondary-button header-button"
              onClick={() => setScreen("roles")}
            >
              {t("Roles")}
            </button>
          )}

        </div>

      </header>

      {/* =========================================
          ROLE SELECTION
      ========================================= */}

      {screen === "roles" && (
        <main className="container">

          <div className="welcome-card">

            <div>
              <div className="eyebrow">
                {t("NOVA FARM PLATFORM")}
              </div>

              <h1>
                {t("Choose your role")}
              </h1>

              <p>
                {t("Select how you want to access the Nova Farm platform.")}
              </p>
            </div>

          </div>

          <div className="role-grid">

            <button
              className="role-button"
              onClick={() => chooseRole("farmer")}
            >
              <div className="role-icon">
                👨‍🌾
              </div>

              <div>
                <h3>{t("Farmer")}</h3>

                <p>
                  {t("Sell your crop, compare options and book procurement tokens.")}
                </p>
              </div>
            </button>

            <button
              className="role-button"
              onClick={() => chooseRole("officer")}
            >
              <div className="role-icon">
                🧑‍💼
              </div>

              <div>
                <h3>{t("Procurement Officer")}</h3>

                <p>
                  {t("Manage token queue and crop procurement operations.")}
                </p>
              </div>
            </button>

            <button
              className="role-button"
              onClick={() => chooseRole("buyer")}
            >
              <div className="role-icon">
                🏢
              </div>

              <div>
                <h3>{t("Verified Buyer")}</h3>

                <p>
                  {t("Create crop demand and connect with farmers.")}
                </p>
              </div>
            </button>

            <button
              className="role-button"
              onClick={() => chooseRole("admin")}
            >
              <div className="role-icon">
                👑
              </div>

              <div>
                <h3>{t("Admin")}</h3>

                <p>
                  {t("Manage users, verification and platform monitoring.")}
                </p>
              </div>
            </button>

          </div>

          <div className="info-card">

            <strong>
              {t("🔐 Secure access")}
            </strong>

            <p>
              {t("Each role has its own login and dashboard.")}
            </p>

          </div>

        </main>
      )}

      {/* =========================================
          LOGIN
      ========================================= */}

      {screen === "login" && (
        <main className="container login-container">

          <button
            className="back-button"
            onClick={() => {
              resetLoginFields();
              setScreen("roles");
            }}
          >
            {t("← Back to roles")}
          </button>

          <div className="login-card">

            <div className="login-icon">

              {loginRole === "farmer" && "👨‍🌾"}
              {loginRole === "officer" && "🧑‍💼"}
              {loginRole === "buyer" && "🏢"}
              {loginRole === "admin" && "👑"}

            </div>

            <div className="eyebrow">

              {loginRole === "farmer" && t("FARMER LOGIN")}
              {loginRole === "officer" && t("PROCUREMENT OFFICER LOGIN")}
              {loginRole === "buyer" &&
                (buyerRegisterMode
                  ? t("NEW BUYER REGISTRATION")
                  : t("VERIFIED BUYER LOGIN"))}
              {loginRole === "admin" && t("ADMIN LOGIN")}

            </div>

            <h1>

              {loginRole === "farmer" && t("Welcome, Farmer")}
              {loginRole === "officer" && t("Officer Login")}
              {loginRole === "buyer" &&
                (buyerRegisterMode
                  ? t("Register as a New Buyer")
                  : t("Buyer Login"))}
              {loginRole === "admin" && t("Admin Login")}

            </h1>

            <p className="login-subtitle">
              {loginRole === "buyer" && buyerRegisterMode
                ? t("Create your buyer profile for Nova Farm.")
                : t("Login to access your Nova Farm dashboard.")}
            </p>

            {loginRole === "buyer" && buyerRegisterMode ? (
              <>
                <div className="login-field">
                  <label>{t("Owner / Contact Name")}</label>
                  <input
                    type="text"
                    placeholder={t("Enter your name")}
                    value={buyerName}
                    onChange={(e) => setBuyerName(e.target.value)}
                  />
                </div>

                <div className="login-field">
                  <label>{t("Business / Company Name")}</label>
                  <input
                    type="text"
                    placeholder={t("Enter business name")}
                    value={buyerBusiness}
                    onChange={(e) => setBuyerBusiness(e.target.value)}
                  />
                </div>

                <div className="login-field">
                  <label>{t("Registered Mobile Number")}</label>
                  <input
                    type="tel"
                    maxLength="10"
                    placeholder={t("10 digit mobile number")}
                    value={loginMobile}
                    onChange={(e) =>
                      setLoginMobile(e.target.value.replace(/\D/g, ""))
                    }
                  />
                </div>

                <div className="login-field">
                  <label>{t("Email Address")}</label>
                  <input
                    type="email"
                    placeholder={t("Enter email address")}
                    value={buyerEmail}
                    onChange={(e) => setBuyerEmail(e.target.value)}
                  />
                </div>

                <div className="login-field">
                  <label>{t("Business Type")}</label>
                  <select
                    value={buyerBusinessType}
                    onChange={(e) => setBuyerBusinessType(e.target.value)}
                  >
                    <option value="">{t("Select business type")}</option>
                    <option value="Trader">{t("Trader")}</option>
                    <option value="Processor">{t("Processor")}</option>
                    <option value="Wholesaler">{t("Wholesaler")}</option>
                    <option value="Retailer">{t("Retailer")}</option>
                    <option value="Other">{t("Other")}</option>
                  </select>
                </div>

                <div className="login-field">
                  <label>{t("GSTIN")}</label>
                  <input
                    type="text"
                    placeholder={t("Enter GSTIN")}
                    value={buyerGstin}
                    onChange={(e) =>
                      setBuyerGstin(e.target.value.toUpperCase())
                    }
                  />
                </div>

                <div className="login-field">
                  <label>{t("PAN")}</label>
                  <input
                    type="text"
                    maxLength="10"
                    placeholder={t("Enter PAN")}
                    value={buyerPan}
                    onChange={(e) =>
                      setBuyerPan(e.target.value.toUpperCase())
                    }
                  />
                </div>

                <div className="login-field">
                  <label>{t("Business Address")}</label>
                  <textarea
                    rows="3"
                    placeholder={t("Enter business address")}
                    value={buyerAddress}
                    onChange={(e) => setBuyerAddress(e.target.value)}
                  />
                </div>

                <button
                  className="primary-button"
                  onClick={submitBuyerRegistration}
                >
                  {t("Submit Registration")}
                </button>

                <button
                  className="text-button"
                  onClick={() => setBuyerRegisterMode(false)}
                >
                  {t("Back to Buyer Login")}
                </button>
              </>
            ) : (
              <>
            {/* FARMER / OFFICER / BUYER */}

            {loginRole !== "admin" && (
              <>
                <div className="login-field">

                  <label>

                    {loginRole === "farmer" && "Farmer ID"}
                    {loginRole === "officer" && "Officer ID"}
                    {loginRole === "buyer" && "Buyer / Business ID"}

                  </label>

                  <input
                    type="text"
                    placeholder={
                      loginRole === "farmer"
                        ? "Enter Farmer ID"
                        : loginRole === "officer"
                        ? "Enter Officer ID"
                        : "Enter Buyer ID"
                    }
                    value={loginId}
                    onChange={(e) =>
                      setLoginId(e.target.value)
                    }
                  />

                </div>

                <div className="login-field">

                  <label>
                    {t("Registered Mobile Number")}
                  </label>

                  <input
                    type="tel"
                    maxLength="10"
                    placeholder={t("10 digit mobile number")}
                    value={loginMobile}
                    onChange={(e) =>
                      setLoginMobile(
                        e.target.value.replace(/\D/g, "")
                      )
                    }
                  />

                </div>

                {!otpSent ? (
                  <button
                    className="primary-button"
                    onClick={sendLoginOtp}
                  >
                    {t("Send OTP")}
                  </button>
                ) : (
                  <>
                    <div className="otp-message">
                      {t("OTP sent to registered mobile number.")}
                    </div>

                    <div className="login-field">

                      <label>
                        {t("Enter OTP")}
                      </label>

                      <input
                        className="otp-input"
                        type="text"
                        maxLength="6"
                        placeholder={t("Enter 6 digit OTP")}
                        value={loginOtp}
                        onChange={(e) =>
                          setLoginOtp(
                            e.target.value.replace(/\D/g, "")
                          )
                        }
                      />

                    </div>

                    <button
                      className="primary-button"
                      onClick={verifyLoginOtp}
                    >
                      {t("Verify OTP & Login")}
                    </button>

                    <button
                      className="text-button"
                      onClick={() => {
                        setOtpSent(false);
                        setLoginOtp("");
                      }}
                    >
                      {t("Change mobile number")}
                    </button>
                  </>
                )}

                <div className="demo-otp">
                  {t("Demo OTP:")} <strong>123456</strong>
                </div>
              </>
            )}

            {/* ADMIN LOGIN */}

            {loginRole === "admin" && (
              <>
                <div className="login-field">

                  <label>
                    {t("Admin ID")}
                  </label>

                  <input
                    type="text"
                    placeholder={t("Enter Admin ID")}
                    value={loginId}
                    onChange={(e) =>
                      setLoginId(e.target.value)
                    }
                  />

                </div>

                <div className="login-field">

                  <label>
                    {t("Password")}
                  </label>

                  <input
                    type="password"
                    placeholder={t("Enter password")}
                    value={adminPassword}
                    onChange={(e) =>
                      setAdminPassword(e.target.value)
                    }
                  />

                </div>

                <button
                  className="primary-button"
                  onClick={adminLogin}
                >
                  {t("Login as Admin")}
                </button>

                <div className="demo-otp">

                  <div>
                    Demo Admin ID:{" "}
                    <strong>ADMIN001</strong>
                  </div>

                  <div>
                    Password:{" "}
                    <strong>admin123</strong>
                  </div>

                </div>
              </>
            )}

              {loginRole === "buyer" && (
                <div
                  style={{
                    marginTop: "20px",
                    paddingTop: "18px",
                    textAlign: "center",
                    borderTop: "1px solid #e5e7eb",
                  }}
                >
                  <span style={{ color: "#6b7280" }}>
                    {t("Don't have an account?")}{" "}
                  </span>

                  <button
                    type="button"
                    className="text-button"
                    onClick={() => {
                      setBuyerRegisterMode(true);
                      setOtpSent(false);
                      setLoginOtp("");
                    }}
                  >
                    {t("Register as a New Buyer →")}
                  </button>
                </div>
              )}
              </>
            )}

            <div className="login-info">
              🔒 This is a prototype login. Real authentication will be
              connected during backend integration.
            </div>

          </div>

        </main>
      )}

      {/* =========================================
          FARMER HOME
      ========================================= */}

      {screen === "home" && loggedInRole === "farmer" && (
        <main className="container">

          <div className="welcome-card">

            <div>

              <div className="eyebrow">
                {t("FARMER DASHBOARD")}
              </div>

              <h1>
                Welcome, {loginId || "Farmer"} 👨‍🌾
              </h1>

              <p>
                {t("Tell us about your crop to find the best selling option.")}
              </p>

            </div>

          </div>

          <div
            style={{
              marginBottom: "24px",
              padding: "18px 20px",
              borderRadius: "16px",
              background: "linear-gradient(135deg, #f0fdf4, #ecfeff)",
              border: "1px solid #bbf7d0",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: "16px",
              flexWrap: "wrap",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
              <div
                style={{
                  width: "52px",
                  height: "52px",
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  background: "#ffffff",
                  fontSize: "26px",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
                }}
              >
                🎙️
              </div>

              <div>
                <strong style={{ display: "block", fontSize: "17px" }}>
                  {t("AI Voice Assistant")}
                </strong>
                <span style={{ color: "#64748b", fontSize: "14px" }}>
                  {t("Get quick help with Nova Farm features and procurement.")}
                </span>
              </div>
            </div>

            <button
              type="button"
              className="primary-button"
              onClick={() => setShowVoiceAssistant(true)}
              style={{ margin: 0, whiteSpace: "nowrap" }}
            >
              🎙️ {t("Ask Assistant")}
            </button>
          </div>

          {farmerToken && (
            <div className="live-token-card">
              <div className="live-token-header">
                <div>
                  <div className="eyebrow">{t("LIVE TOKEN STATUS")}</div>
                  <h2>🎫 {farmerToken.id}</h2>
                </div>
                <span className="live-badge">{t("● LIVE")}</span>
              </div>

              <p className="live-token-subtitle">
                {t("Your procurement journey is updated in real time.")}
              </p>

              <div className="live-status-main">
                <span className="live-status-dot"></span>
                <div>
                  <strong>{t(getTokenStatusLabel(farmerToken.status))}</strong>
                  <span>
                    {t("Farmers ahead")}: {getQueueAhead(farmerToken)}
                  </span>
                </div>
              </div>

              <div className="live-timeline">
                {[
                  "Token Booked",
                  "Entry Completed",
                  "Procurement Started",
                  "Quality Check",
                  "Weighing",
                  "Procurement Completed",
                    "Payment Processing",
                   "Payment Completed",
                ].map((step, index) => {
                  const history = farmerToken.history || [];
                  const reached = index === 0 || history.some((item) => item.status === step);
                  const event = history.find((item) => item.status === step);

                  return (
                    <div className={`live-timeline-step ${reached ? "done" : ""}`} key={step}>
                      <span>{reached ? "✓" : index + 1}</span>
                      <div>
                        <strong>{t(step)}</strong>
                        {event && (
                          <small>
                            {new Date(event.time).toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </small>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="live-token-footer">
                <span>
                  {t("Last updated")}: {new Date(
                    farmerToken.updatedAt || farmerToken.createdAt
                  ).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                </span>
                <span>📍 {farmerToken.centre}</span>
              </div>
            </div>
          )}

          <div className="card">

            <h2>
              {t("🌾 Crop Details")}
            </h2>

            <CropCards
              value={crop}
              onChange={setCrop}
            />

            <div className="login-field">

              <label>
                {t("Expected Quantity (Quintal)")}
              </label>

              <input
                type="number"
                placeholder={t("Example: 50")}
                value={quantity}
                onChange={(e) =>
                  setQuantity(e.target.value)
                }
              />

            </div>

            <button
              className="primary-button"
              onClick={goToCompare}
            >
              {t("Compare Selling Options →")}
            </button>

          </div>

          <div className="info-card">

            <strong>
              {t("💡 Nova Farm")}
            </strong>

            <p>
              Government MSP aur verified private buyer demand ko compare
              karke farmer ko better option choose karne mein help karta hai.
            </p>

          </div>

        </main>
      )}

      {/* =========================================
          COMPARISON
      ========================================= */}

      {screen === "compare" && loggedInRole === "farmer" && (
        <main className="container">

          <button
            className="back-button"
            onClick={() => setScreen("home")}
          >
            {t("← Back")}
          </button>

          <div className="welcome-card">

            <div>

              <div className="eyebrow">
                {t("SELLING OPTIONS")}
              </div>

              <h1>
                {crop} • {quantity} Quintal
              </h1>

              <p>
                {t("Compare government procurement with verified market demand.")}
              </p>

            </div>

          </div>

          <div className="comparison">

            {/* GOVERNMENT */}

            <div className="option-card government">

              <div className="option-header">

                <span className="option-icon">
                  🏛️
                </span>

                <div>

                  <h2>
                    {t("Government MSP")}
                  </h2>

                  <span>
                    {t("Procurement Centre")}
                  </span>

                </div>

              </div>

              <div className="price">
                ₹{governmentRate.toLocaleString()}
                <span>{t("/quintal")}</span>
              </div>

              <div className="total">

                <span>
                  {t("Estimated Value")}
                </span>

                <strong>
                  ₹{(
                    governmentRate *
                    Number(quantity || 0)
                  ).toLocaleString()}
                </strong>

              </div>

              <div className="profit">
                {t("✔ MSP price protected")}
              </div>

              <div className="warning">
                {t("⚠️ Token / queue required")}
              </div>

              <button
                className="primary-button"
                onClick={selectGovernment}
              >
                {t("Find Procurement Centre")}
              </button>

            </div>

            {/* MARKET */}

            <div className="option-card market">

              <div className="option-header">

                <span className="option-icon">
                  🏢
                </span>

                <div>

                  <h2>
                    {t("Verified Market")}
                  </h2>

                  <span>
                    {t("Private Buyer Demand")}
                  </span>

                </div>

              </div>

              <div className="verified">
                {t("✓ Verified Buyers")}
              </div>

              <div className="price">
                ₹{marketRate.toLocaleString()}
                <span>{t("/quintal")}</span>
              </div>

              <div className="total">

                <span>
                  {t("Estimated Value")}
                </span>

                <strong>
                  ₹{(
                    marketRate *
                    Number(quantity || 0)
                  ).toLocaleString()}
                </strong>

              </div>

              <div className="profit">
                + ₹{(
                  (marketRate - governmentRate) *
                  Number(quantity || 0)
                ).toLocaleString()} possible upside
              </div>

              <button
                className="secondary-button"
                onClick={() => setScreen("market")}
              >
                {t("View Buyer Demand")}
              </button>

            </div>

          </div>

        </main>
      )}

      {/* =========================================
          PROCUREMENT CENTRES
      ========================================= */}

      {screen === "centres" && loggedInRole === "farmer" && (
        <main className="container">

          <button
            className="back-button"
            onClick={() => setScreen("compare")}
          >
            {t("← Back")}
          </button>

          <div className="welcome-card">

            <div>

              <div className="eyebrow">
                {t("PROCUREMENT CENTRES")}
              </div>

              <h1>
                {t("Choose a nearby centre")}
              </h1>

              <p>
                {t("Select a centre based on distance and current queue.")}
              </p>

            </div>

          </div>

          <div className="centre-list">

            {centres.map((centre) => (
              <div
                className="centre-card"
                key={centre.name}
              >

                <div className="centre-header">

                  <div>

                    <h2>
                      {centre.name}
                    </h2>

                    <p>
                      📍 {centre.distance}
                    </p>

                  </div>

                  <span
                    className={`status ${
                      centre.status === "Available"
                        ? "available"
                        : "busy"
                    }`}
                  >
                    {t(centre.status)}
                  </span>

                </div>

                <div className="stats">

                  <div>
                    <strong>
                      {centre.waiting}
                    </strong>
                    <span>
                      {t("Waiting")}
                    </span>
                  </div>

                  <div>
                    <strong>
                      {centre.processing}
                    </strong>
                    <span>
                      {t("Processing")}
                    </span>
                  </div>

                  <div>
                    <strong>
                      {centre.waitTime}
                    </strong>
                    <span>
                      {t("Est. Wait")}
                    </span>
                  </div>

                  <div>
                    <strong>
                      {centre.capacity}%
                    </strong>
                    <span>
                      {t("Capacity")}
                    </span>
                  </div>

                </div>

                <button
                  className="primary-button"
                  onClick={() => generateToken(centre)}
                >
                  {t("Book Token")}
                </button>

              </div>
            ))}

          </div>

        </main>
      )}

      {/* =========================================
          TOKEN
      ========================================= */}

      {screen === "token" && loggedInRole === "farmer" && (
        <main className="container">

          <div className="token-card">

            <div className="success-icon">
              ✓
            </div>

            <div className="eyebrow">
              {t("TOKEN GENERATED")}
            </div>

            <h1>
              {t("Your procurement token is ready")}
            </h1>

            <div className="token-number">

              {farmerToken?.id || tokens[tokens.length - 1]?.id}

            </div>

            <div className="token-details">

              <div>
                <span>{t("Farmer")}</span>
                <strong>
                  {loginId || "Demo Farmer"}
                </strong>
              </div>

              <div>
                <span>{t("Crop")}</span>
                <strong>
                  {crop}
                </strong>
              </div>

              <div>
                <span>{t("Quantity")}</span>
                <strong>
                  {quantity} Quintal
                </strong>
              </div>

              <div>
                <span>{t("Centre")}</span>
                <strong>
                  {selectedCentre?.name}
                </strong>
              </div>

              <div>
                <span>{t("Status")}</span>
                <strong>
                  {t("Waiting")}
                </strong>
              </div>

            </div>

            {farmerToken && (
              <div className="live-token-mini">
                <strong>{t("Live update")}</strong>
                <span>{t("Farmers ahead")}: {getQueueAhead(farmerToken)}</span>
                <span>
                  {t("Last updated")}: {new Date(
                    farmerToken.updatedAt || farmerToken.createdAt
                  ).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                </span>
              </div>
            )}

            <div className="queue-box">

              <strong>
                {t("⏱ Estimated waiting time")}
              </strong>

              <p>
                {selectedCentre?.waitTime}
              </p>

            </div>

            <button
              className="primary-button"
              onClick={() => setScreen("home")}
            >
              {t("Back to Farmer Dashboard")}
            </button>

          </div>

        </main>
      )}

      {/* =========================================
          MARKET / BUYER DEMAND FOR FARMER
      ========================================= */}

      {screen === "market" && loggedInRole === "farmer" && (
        <main className="container">

          <button
            className="back-button"
            onClick={() => setScreen("compare")}
          >
            {t("← Back")}
          </button>

          <div className="welcome-card">

            <div>

              <div className="eyebrow">
                {t("VERIFIED BUYER DEMAND")}
              </div>

              <h1>
                {t("Available buyers")}
              </h1>

              <p>
                {t("These buyers have active crop requirements.")}
              </p>

            </div>

          </div>

          <div className="buyer-list">

            {demands
              .filter((demand) => demand.status === "Active")
              .map((demand) => (
                <div
                  className="buyer-card"
                  key={demand.id}
                >

                  <div className="buyer-header">

                    <div>

                      <h2>
                        {demand.buyer}
                      </h2>

                      <span className="verified">
                        {t("✓ Verified Buyer")}
                      </span>

                    </div>

                    <div className="buyer-rate">
                      ₹{demand.rate}/q
                    </div>

                  </div>

                  <div className="buyer-info">

                    <span>
                      🌾 {demand.crop}
                    </span>

                    <span>
                      📦 {demand.quantity} Quintal
                    </span>

                    <span>
                      📍 {demand.location}
                    </span>

                    <span>
                      ⏳ {demand.expires}
                    </span>

                  </div>

                  <button
                    className="primary-button"
                    onClick={() =>
                      alert(
                        t("Connection request sent to {buyer}").replace("{buyer}", demand.buyer)
                      )
                    }
                  >
                    {t("Connect with Buyer")}
                  </button>

                </div>
              ))}
          </div>

        </main>
      )}
      {/* =========================================
          PROCUREMENT OFFICER
      ========================================= */}

      {screen === "officer" && loggedInRole === "officer" && (
        <main className="container dashboard">

          <div className="dashboard-heading">

            <div>

              <div className="eyebrow">
                {t("PROCUREMENT MANAGEMENT")}
              </div>

              <h1>
                {t("Officer Dashboard")}
              </h1>

              <p>
                {t("Manage procurement centre token queue.")}
              </p>

              {officerCentre && (
                <p>
                  <strong>
                    {officerCentre.centreName}
                  </strong>
                </p>
              )}

            </div>

            <span className="live-badge">
              {t("● LIVE")}
            </span>

          </div>


          {/* =========================================
              CENTRE-SPECIFIC TOKENS
          ========================================= */}

          <div className="dashboard-stats">

            <div className="stat-card">

              <span>
                {t("Waiting")}
              </span>

              <strong>
                {
                  tokens.filter(
                    (token) =>
                      token.centre === officerCentre?.centreName &&
                      token.status === "Waiting"
                  ).length
                }
              </strong>

            </div>


            <div className="stat-card">

              <span>
                {t("Processing")}
              </span>

              <strong>
                {
                  tokens.filter(
                    (token) =>
                      token.centre === officerCentre?.centreName &&
                      token.status === "Processing"
                  ).length
                }
              </strong>

            </div>


            <div className="stat-card">

              <span>
                {t("Completed")}
              </span>

              <strong>
                {
                  tokens.filter(
                    (token) =>
                      token.centre === officerCentre?.centreName &&
                      token.status === "Completed"
                  ).length
                }
              </strong>

            </div>


            <div className="stat-card">

              <span>
                {t("Centre Capacity")}
              </span>

              <strong>
                72%
              </strong>

            </div>

          </div>


          {/* =========================================
              TOKEN QUEUE
          ========================================= */}

          <div className="dashboard-card">

            <div className="section-header">

              <div>

                <h2>
                  {t("🎫 Token Queue")}
                </h2>

                <p>
                  {officerCentre?.centreName ||
                    "Procurement Centre"}
                </p>

              </div>


              <button
                className="small-button"
                onClick={() =>
                  alert(t("Queue refreshed"))
                }
              >
                {t("Refresh")}
              </button>

            </div>


            <div className="table-wrapper">

              <table>

                <thead>

                  <tr>
                    <th>{t("Token")}</th>
                    <th>{t("Farmer")}</th>
                    <th>{t("Crop")}</th>
                    <th>{t("Quantity")}</th>
                    <th>{t("Status")}</th>
                    <th>{t("Action")}</th>
                  </tr>

                </thead>


                <tbody>

                 {tokens
                   .filter(
                    (token) =>
                       token.centre === officerCentre?.centreName &&
                        token.status !== "Payment Completed"
                        )
                       .map((token) => (

                      <tr key={token.id}>

                        <td>
                          <strong>
                            {token.id}
                          </strong>
                        </td>


                        <td>
                          {token.farmer}
                        </td>


                        <td>
                          {token.crop}
                        </td>


                        <td>
                          {token.quantity} q
                        </td>


                        <td>

                          <span
                            className={`table-status ${token.status.toLowerCase()}`}
                          >
                            {t(token.status)}
                          </span>

                        </td>


                        <td>

                        {token.status !== "Payment Completed" && (
                         <button
                          className="action-button"
                          onClick={() =>
                         updateTokenStatus(token.id)
                        }
                        >
                         {t(
                          getNextOfficerAction(
                          token.status
                            )
                          )}
                          </button>
                         )}

                        </td>

                      </tr>

                    ))}


                  {tokens.filter(
                   (token) =>
                     token.centre === officerCentre?.centreName &&
                     token.status !== "Payment Completed"
                    ).length === 0 && (

                    <tr>

                      <td
                        colSpan="6"
                        style={{
                          textAlign: "center",
                          padding: "30px"
                        }}
                      >
                        {t("No tokens available for this centre.")}
                      </td>

                    </tr>

                  )}

                </tbody>

              </table>

            </div>

          </div>


          {/* =========================================
              CENTRE OPERATIONS
          ========================================= */}

          <div className="dashboard-card">

            <div className="section-header">

              <div>

                <h2>
                  {t("📊 Centre Operations")}
                </h2>

              </div>

            </div>


            <div className="progress-list">

              <div className="progress-item">

                <div>

                  <span>
                    {t("Daily Capacity")}
                  </span>

                  <strong>
                    72%
                  </strong>

                </div>


                <div className="progress">

                  <div
                    style={{
                      width: "72%"
                    }}
                  ></div>

                </div>

              </div>


              <div className="progress-item">

                <div>

                  <span>
                    {t("Queue Load")}
                  </span>

                  <strong>
                    38%
                  </strong>

                </div>


                <div className="progress">

                  <div
                    style={{
                      width: "38%"
                    }}
                  ></div>

                </div>

              </div>

            </div>

          </div>

        </main>
      )}
          
      {/* =========================================
          BUYER DASHBOARD
      ========================================= */}

      {screen === "buyer" && loggedInRole === "buyer" && (
        <main className="container dashboard">

          <div className="dashboard-heading">

            <div>

              <div className="eyebrow">
                {t("VERIFIED BUYER")}
              </div>

              <h1>
                {t("Buyer Dashboard")}
              </h1>

              <p>
                {t("Create demand and connect with farmers.")}
              </p>

            </div>

            <span className="live-badge">
              {t("✓ VERIFIED")}
            </span>

          </div>

          <div className="dashboard-stats">

            <div className="stat-card">

              <span>
                {t("Active Demands")}
              </span>

              <strong>
                {
                  demands.filter(
                    (d) => d.status === "Active"
                  ).length
                }
              </strong>

            </div>

            <div className="stat-card">

              <span>
                {t("Total Required")}
              </span>

              <strong>
                {demands
                  .filter(
                    (d) => d.status === "Active"
                  )
                  .reduce(
                    (sum, d) => sum + d.quantity,
                    0
                  )}{" "}
                q
              </strong>

            </div>

            <div className="stat-card">

              <span>
                {t("Avg. Rate")}
              </span>

              <strong>
                ₹
                {demands.length
                  ? Math.round(
                      demands.reduce(
                        (sum, d) => sum + d.rate,
                        0
                      ) / demands.length
                    )
                  : 0}
              </strong>

            </div>

          </div>

          <div className="dashboard-card">

            <div className="section-header">

              <div>

                <h2>
                  {t("➕ Create New Demand")}
                </h2>

                <p>
                  {t("Tell farmers what crop you need.")}
                </p>

              </div>

            </div>

            <div className="form-grid">

              <CropCards
                value={buyerCrop}
                onChange={setBuyerCrop}
              />

              <div className="login-field">

                <label>
                  {t("Required Quantity (Quintal)")}
                </label>

                <input
                  type="number"
                  placeholder={t("Example: 100")}
                  value={buyerQuantity}
                  onChange={(e) =>
                    setBuyerQuantity(e.target.value)
                  }
                />

              </div>

              <div className="login-field">

                <label>
                  {t("Offered Rate / Quintal")}
                </label>

                <input
                  type="number"
                  placeholder={t("Example: 2700")}
                  value={buyerRate}
                  onChange={(e) =>
                    setBuyerRate(e.target.value)
                  }
                />

              </div>

              <div className="login-field">

                <label>
                  {t("Location")}
                </label>

                <input
                  type="text"
                  placeholder={t("Example: Lucknow")}
                  value={buyerLocation}
                  onChange={(e) =>
                    setBuyerLocation(e.target.value)
                  }
                />

              </div>

            </div>

            <button
              className="primary-button"
              onClick={createDemand}
            >
              {t("Publish Demand")}
            </button>

          </div>

          <div className="dashboard-card">

            <div className="section-header">

              <div>

                <h2>
                  {t("📋 Active Demands")}
                </h2>

                <p>
                  {t("Your current crop requirements.")}
                </p>

              </div>

            </div>

            <div className="demand-list">

              {demands
                .filter(
                  (d) => d.status === "Active"
                )
                .map((demand) => (
                  <div
                    className="demand-row"
                    key={demand.id}
                  >

                    <div>

                      <strong>
                        {demand.crop}
                      </strong>

                      <span>
                        {demand.quantity} q • ₹
                        {demand.rate}/q
                      </span>

                    </div>

                    <div>

                      <span>
                        📍 {demand.location}
                      </span>

                    </div>

                    <button
                      className="danger-button"
                      onClick={() =>
                        removeDemand(demand.id)
                      }
                    >
                      {t("Remove")}
                    </button>

                  </div>
                ))}

            </div>

          </div>

        </main>
      )}

      {/* =========================================
          ADMIN DASHBOARD
      ========================================= */}

      {screen === "admin" && loggedInRole === "admin" && (
        <main className="container dashboard">

          <div className="dashboard-heading">

            <div>

              <div className="eyebrow">
                {t("PLATFORM ADMINISTRATION")}
              </div>

              <h1>
                {t("Admin Dashboard")}
              </h1>

              <p>
                {t("Monitor Nova Farm users and operations.")}
              </p>

            </div>

            <span className="live-badge">
              {t("● SYSTEM ONLINE")}
            </span>

          </div>

          <div className="dashboard-stats">

            <div className="stat-card">

              <span>
                {t("Registered Farmers")}
              </span>

              <strong>
                1,248
              </strong>

            </div>

            <div className="stat-card">

              <span>
                {t("Verified Buyers")}
              </span>

              <strong>
                86
              </strong>

            </div>

            <div className="stat-card">

              <span>
                {t("Procurement Centres")}
              </span>

              <strong>
                32
              </strong>

            </div>

            <div className="stat-card">

              <span>
                {t("Pending Verification")}
              </span>

              <strong>
                7
              </strong>

            </div>

          </div>

          <div className="admin-grid">

            <div className="admin-mini-card">

              <span>
                🌾
              </span>

              <h3>
                {t("Farmers")}
              </h3>

              <strong>
                1,248
              </strong>

              <p>
                {t("Registered users")}
              </p>

            </div>

            <div className="admin-mini-card">

              <span>
                🏢
              </span>

              <h3>
                {t("Buyers")}
              </h3>

              <strong>
                86
              </strong>

              <p>
                {t("Verified businesses")}
              </p>

            </div>

            <div className="admin-mini-card">

              <span>
                🏛️
              </span>

              <h3>
                {t("Centres")}
              </h3>

              <strong>
                32
              </strong>

              <p>
                {t("Active procurement centres")}
              </p>

            </div>

            <div className="admin-mini-card">

              <span>
                🎫
              </span>

              <h3>
                {t("Tokens Today")}
              </h3>

              <strong>
                384
              </strong>

              <p>
                {t("Generated today")}
              </p>

            </div>

          </div>

          <div className="dashboard-card">

            <div className="section-header">

              <div>

                <h2>
                  {t("🔎 Buyer Verification")}
                </h2>

                <p>
                  {t("Pending business verification requests.")}
                </p>

              </div>

            </div>

            <div className="verification-list">

              <div className="verification-row">

                <div>

                  <strong>
                    Agro Bharat Pvt Ltd
                  </strong>

                  <span>
                    GST: 09ABCDE1234F1Z5
                  </span>

                </div>

                <span className="pending">
                  {t("Pending")}
                </span>

                <button
                  className="action-button"
                  onClick={() =>
                    alert(
                      "Buyer verification approved"
                    )
                  }
                >
                  {t("Review")}
                </button>

              </div>

              <div className="verification-row">

                <div>

                  <strong>
                    Lucknow Grain Traders
                  </strong>

                  <span>
                    GST: 09XYZAB5678K1Z2
                  </span>

                </div>

                <span className="pending">
                  {t("Pending")}
                </span>

                <button
                  className="action-button"
                  onClick={() =>
                    alert(
                      "Buyer verification approved"
                    )
                  }
                >
                  {t("Review")}
                </button>

              </div>

            </div>

          </div>

          <div className="dashboard-card">

            <div className="section-header">

              <div>
                <h2>
                  {t("📈 Platform Overview")}
                </h2>
              </div>

            </div>

            <div className="progress-list">

              <div className="progress-item">

                <div>

                  <span>
                    {t("Farmer Registration")}
                  </span>

                  <strong>
                    82%
                  </strong>

                </div>

                <div className="progress">

                  <div
                    style={{
                      width: "82%",
                    }}
                  ></div>

                </div>

              </div>

              <div className="progress-item">

                <div>

                  <span>
                    {t("Buyer Verification")}
                  </span>

                  <strong>
                    64%
                  </strong>

                </div>

                <div className="progress">

                  <div
                    style={{
                      width: "64%",
                    }}
                  ></div>

                </div>

              </div>

              <div className="progress-item">

                <div>

                  <span>
                    {t("Centre Digitisation")}
                  </span>

                  <strong>
                    91%
                  </strong>

                </div>

                <div className="progress">

                  <div
                    style={{
                      width: "91%",
                    }}
                  ></div>

                </div>

              </div>

            </div>

          </div>

        </main>
      )}

      {showVoiceAssistant && loggedInRole === "farmer" && (
        <div
          onClick={() => setShowVoiceAssistant(false)}
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(15, 23, 42, 0.55)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "20px",
            zIndex: 1000,
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              width: "100%",
              maxWidth: "420px",
              background: "#ffffff",
              borderRadius: "22px",
              padding: "28px",
              textAlign: "center",
              boxShadow: "0 20px 50px rgba(0,0,0,0.2)",
            }}
          >
            <div style={{ fontSize: "52px", marginBottom: "10px" }}>
              🎙️
            </div>

            <div className="eyebrow">
              {t("Voice Assistant")}
            </div>

            <h2 style={{ margin: "8px 0 10px" }}>
              {t("AI Voice Assistant")}
            </h2>

            <p style={{ color: "#64748b", marginBottom: "24px" }}>
              {t("Voice assistance will be available soon.")}
            </p>

            <button
              type="button"
              className="primary-button"
              style={{
                width: "100%",
                marginBottom: "10px",
                opacity: 0.9,
              }}
              onClick={() => {}}
            >
              🎤 {t("Tap to Speak")}
            </button>

            <div
              style={{
                display: "inline-block",
                padding: "6px 12px",
                borderRadius: "999px",
                background: "#f1f5f9",
                color: "#64748b",
                fontSize: "12px",
                marginBottom: "18px",
              }}
            >
              {t("Demo Feature")}
            </div>

            <button
              type="button"
              className="text-button"
              onClick={() => setShowVoiceAssistant(false)}
            >
              {t("Close")}
            </button>
          </div>
        </div>
      )}

      {/* =========================================
          FOOTER
      ========================================= */}

      <footer>

        <p>
          {t("© 2026 Nova Farm • Smart Agriculture Procurement Platform")}
        </p>

      </footer>

    </div>
  );
}

export default App;