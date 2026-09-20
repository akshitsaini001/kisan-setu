import { useEffect, useRef, useState } from "react";
import { Capacitor } from "@capacitor/core";
import { LocalNotifications } from "@capacitor/local-notifications";
import "./App.css";
import "./language-toggle.css";
import { supabase } from "./supabaseClient";

import { translationsHi } from "./constants/translation";
import { initialDemands, initialTokens } from "./constants/initialData";

import Header from "./components/common/Header";
import VoiceAssistantModal from "./components/common/VoiceAssistantModal";
import RoleSelection from "./components/auth/RoleSelection";
import LoginForm from "./components/auth/LoginForm";

import FarmerDashboard from "./components/farmer/FarmerDashboard";
import SellingOptionsCompare from "./components/farmer/SellingOptionsCompare";
import ProcurementCentres from "./components/farmer/ProcurementCentres";
import TokenSuccess from "./components/farmer/TokenSuccess";
import BuyerMarketList from "./components/farmer/BuyerMarketList";
import { FarmerTokenHistory } from "./components/farmer/FarmerTokenHistory";

import BuyerDashboard from "./components/buyer/BuyerDashboard";
import OfficerDashboard from "./components/officer/OfficerDashboard";
import AdminDashboard from "./components/admin/AdminDashboard";

const governmentRate = 2585;

export default function App() {
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

  const t = (text) => (language === "en" ? text : translationsHi[text] || text);

  /* =========================================
     SCREEN & NAVIGATION
  ========================================= */
  const [screen, setScreen] = useState("roles");

  /* =========================================
     NOTIFICATIONS
  ========================================= */
  const [notifications, setNotifications] = useState(() => {
    try {
      const saved = localStorage.getItem("novaFarmNotifications");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [showNotifications, setShowNotifications] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [showLanguageMenu, setShowLanguageMenu] = useState(false);
  const [showVoiceAssistant, setShowVoiceAssistant] = useState(false);

  useEffect(() => {
    localStorage.setItem("novaFarmNotifications", JSON.stringify(notifications));
  }, [notifications]);

  useEffect(() => {
    const requestNotificationPermission = async () => {
      if (!Capacitor.isNativePlatform()) return;
      try {
        const permissions = await LocalNotifications.checkPermissions();
        if (permissions.display !== "granted") {
          await LocalNotifications.requestPermissions();
        }
      } catch (error) {
        console.error("Local notification permission error:", error);
      }
    };
    requestNotificationPermission();
  }, []);

  const addNotification = (title, message, tokenId, type = "status") => {
    setNotifications((prev) => {
      const alreadyExists = prev.some(
        (n) => n.tokenId === tokenId && n.type === type
      );
      if (alreadyExists) return prev;

      const notificationId = Date.now();
      const newNotification = {
        id: notificationId,
        title,
        message,
        tokenId,
        type,
        time: new Date().toISOString(),
        read: false,
      };

      if (Capacitor.isNativePlatform()) {
        LocalNotifications.schedule({
          notifications: [
            {
              id: notificationId,
              title: `Nova Farm • ${title}`,
              body: message,
              schedule: { at: new Date(Date.now() + 300) },
              extra: { tokenId, type },
            },
          ],
        }).catch((err) => console.error("Local notification error:", err));
      }

      return [newNotification, ...prev].slice(0, 50);
    });
  };

  const unreadNotificationCount = notifications.filter((n) => !n.read).length;
  const markAllNotificationsRead = () =>
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  const markNotificationRead = (id) =>
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );

  /* =========================================
     SHARED STATE (TOKENS & DEMANDS)
  ========================================= */
  const [crop, setCrop] = useState("");
  const [quantity, setQuantity] = useState("");
  const [selectedCentre, setSelectedCentre] = useState(null);
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

  /* =========================================
     AUTH STATE
  ========================================= */
  const [loginRole, setLoginRole] = useState("");
  const [loggedInRole, setLoggedInRole] = useState(
    () => sessionStorage.getItem("kisanSetuLoggedInRole") || ""
  );
  const [loginId, setLoginId] = useState(
    () => sessionStorage.getItem("kisanSetuLoginId") || ""
  );
  const loginIdRef = useRef("");
  useEffect(() => {
    loginIdRef.current = loginId;
  }, [loginId]);

  const [loginMobile, setLoginMobile] = useState(
    () => sessionStorage.getItem("kisanSetuLoginMobile") || ""
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

  useEffect(() => {
    const savedRole = sessionStorage.getItem("kisanSetuLoggedInRole");
    if (savedRole) {
      setLoggedInRole(savedRole);
      setLoginRole(savedRole);
      if (savedRole === "farmer") setScreen("home");
      else if (savedRole === "buyer") setScreen("buyer");
      else if (savedRole === "officer") setScreen("officer");
      else if (savedRole === "admin") setScreen("admin");
    }
  }, []);

  /* =========================================
     SUPABASE TOKEN REALTIME & FETCH
  ========================================= */
  useEffect(() => {
    const channel = supabase
      .channel("kisan-setu-token-updates")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "tokens" },
        (payload) => {
          const newTokenData = payload.new;
          const newToken = {
            id: newTokenData.token_id,
            farmer: newTokenData.farmer,
            crop: newTokenData.crop,
            quantity: Number(newTokenData.quantity),
            actualQuantity: newTokenData.actual_quantity,
            rate: newTokenData.rate,
            totalAmount: newTokenData.total_amount,
            centre: newTokenData.centre,
            status: newTokenData.status,
            createdAt: newTokenData.created_at,
            updatedAt: newTokenData.updated_at,
            history: [],
          };
          setTokens((prev) =>
            prev.some((t) => t.id === newToken.id) ? prev : [...prev, newToken]
          );
        }
      )
      .on(
        "postgres_changes",
        { event: "UPDATE", schema: "public", table: "tokens" },
        (payload) => {
          const updatedToken = payload.new;
          const currentFarmerId = loginIdRef.current || "Demo Farmer";
          const isCurrentFarmer = updatedToken.farmer === currentFarmerId;

          const notificationMap = {
            "Entry Completed": { title: "Entry Completed", message: "Your token entry has been completed." },
            Processing: { title: "Procurement Started", message: "Procurement has started for your token." },
            "Quality Check": { title: "Quality Check", message: "Quality check has started for your crop." },
            Weighing: { title: "Weighing", message: "Weighing has started for your crop." },
            Completed: { title: "Procurement Completed", message: "Procurement completed successfully." },
            "Payment Processing": { title: "Payment Processing", message: "Your payment is being processed." },
            "Payment Completed": { title: "Payment Completed", message: "Your payment has been completed." },
          };

          const notif = notificationMap[updatedToken.status];
          if (isCurrentFarmer && notif) {
            addNotification(notif.title, notif.message, updatedToken.token_id, updatedToken.status);
          }

          setTokens((prev) =>
            prev.map((t) =>
              t.id !== updatedToken.token_id
                ? t
                : {
                    ...t,
                    status: updatedToken.status,
                    updatedAt: updatedToken.updated_at,
                    actualQuantity: updatedToken.actual_quantity ?? t.actualQuantity,
                    rate: updatedToken.rate ?? t.rate,
                    totalAmount: updatedToken.total_amount ?? t.totalAmount,
                  }
            )
          );
        }
      )
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "token_history" },
        async (payload) => {
          const newHistory = payload.new;
          const { data: tokenData } = await supabase
            .from("tokens")
            .select("token_id")
            .eq("id", newHistory.token_id)
            .single();

          if (!tokenData) return;

          setTokens((prev) =>
            prev.map((token) => {
              if (token.id !== tokenData.token_id) return token;
              const alreadyExists = (token.history || []).some(
                (item) => item.status === newHistory.status && item.time === newHistory.event_time
              );
              if (alreadyExists) return token;
              return {
                ...token,
                history: [
                  ...(token.history || []),
                  { id: newHistory.id, status: newHistory.status, time: newHistory.event_time },
                ],
              };
            })
          );
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  useEffect(() => {
    const loadTokensFromSupabase = async () => {
      try {
        const { data, error } = await supabase
          .from("tokens")
          .select(`
            id, token_id, farmer, crop, quantity, actual_quantity, rate, total_amount, centre_id, centre, status, created_at, updated_at,
            token_history (id, status, event_time)
          `)
          .order("created_at", { ascending: true });

        if (error) return;

        const backendTokens = (data || []).map((token) => ({
          id: token.token_id,
          farmer: token.farmer,
          crop: token.crop,
          quantity: token.quantity,
          actualQuantity: token.actual_quantity,
          rate: token.rate,
          totalAmount: token.total_amount,
          centre: token.centre,
          status: token.status,
          createdAt: token.created_at,
          updatedAt: token.updated_at,
          history: (token.token_history || [])
            .sort((a, b) => new Date(a.event_time) - new Date(b.event_time))
            .map((item) => ({ id: item.id, status: item.status, time: item.event_time })),
        }));

        // Supabase is authoritative after a successful fetch. This also
        // clears stale browser-cached tokens that were deleted remotely.
        setTokens(backendTokens);
      } catch (err) {
        console.error("Token load failed:", err);
      }
    };
    loadTokensFromSupabase();
  }, []);

  /* =========================================
     AUTH HANDLERS
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
    if (!loginId.trim()) return alert(t("Please enter your ID."));
    if (!/^\d{10}$/.test(loginMobile)) return alert(t("Please enter a valid 10-digit mobile number."));
    setOtpSent(true);
    alert(t("Demo OTP: 123456"));
  };

  const verifyLoginOtp = async () => {
    if (loginOtp !== "123456") return alert(t("Invalid OTP. Use Demo OTP: 123456"));

    if (loginRole !== "officer") {
      setLoggedInRole(loginRole);
      sessionStorage.setItem("kisanSetuLoggedInRole", loginRole);
      sessionStorage.setItem("kisanSetuLoginId", loginId.trim());
      sessionStorage.setItem("kisanSetuLoginMobile", loginMobile);
      if (loginRole === "farmer") setScreen("home");
      else if (loginRole === "buyer") setScreen("buyer");
      return;
    }

    try {
      const { data: officer, error } = await supabase
        .from("profiles")
        .select(`id, name, login_id, centre_id, procurement_centres (id, name)`)
        .eq("login_id", loginId.trim())
        .eq("role", "officer")
        .single();

      if (error || !officer || !officer.centre_id || !officer.procurement_centres) {
        return alert("Officer ID nahi mila ya centre assigned nahi hai.");
      }

      setLoggedInRole("officer");
      sessionStorage.setItem("kisanSetuLoggedInRole", "officer");
      sessionStorage.setItem("kisanSetuLoginId", loginId.trim());
      sessionStorage.setItem("kisanSetuLoginMobile", loginMobile);

      const centreInfo = {
        officerId: officer.id,
        loginId: officer.login_id,
        centreId: officer.centre_id,
        centreName: officer.procurement_centres.name,
      };
      setOfficerCentre(centreInfo);
      sessionStorage.setItem("kisanSetuOfficerCentre", JSON.stringify(centreInfo));
      setScreen("officer");
    } catch {
      alert("Officer login ke time problem aa gayi.");
    }
  };

  const adminLogin = () => {
    if (loginId !== "ADMIN001" || adminPassword !== "admin123") {
      return alert(t("Invalid Admin ID or password.\n\nDemo:\nID: ADMIN001\nPassword: admin123"));
    }
    setLoggedInRole("admin");
    sessionStorage.setItem("kisanSetuLoggedInRole", "admin");
    sessionStorage.setItem("kisanSetuLoginId", loginId.trim());
    setScreen("admin");
  };

  const logout = () => {
    sessionStorage.clear();
    setLoggedInRole("");
    setLoginRole("");
    setOfficerCentre(null);
    resetLoginFields();
    setScreen("roles");
  };

  /* =========================================
     FARMER FLOW
  ========================================= */
  const goToCompare = () => {
    if (!crop) return alert(t("Please select a crop."));
    if (!quantity || Number(quantity) <= 0) return alert(t("Please enter a valid quantity."));
    setScreen("compare");
  };

  const generateToken = async (centre) => {
    setSelectedCentre(centre);
    try {
      const now = new Date().toISOString();
      const { data: latestToken } = await supabase
        .from("tokens")
        .select("token_id")
        .order("token_id", { ascending: false })
        .limit(1)
        .maybeSingle();

      let nextTokenNumber = 45;
      if (latestToken?.token_id) {
        const lastNumber = parseInt(latestToken.token_id.replace("KIS-", ""), 10);
        if (!Number.isNaN(lastNumber)) nextTokenNumber = lastNumber + 1;
      }
      const tokenNumber = `KIS-${String(nextTokenNumber).padStart(3, "0")}`;

      const { data: centreData, error: centreError } = await supabase
        .from("procurement_centres")
        .select("id, name")
        .eq("name", centre.name)
        .single();

      if (centreError) return alert("Centre database connect nahi hua.");

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

      if (tokenError) return alert("Token save nahi ho paya.");

      await supabase.from("token_history").insert([
        { token_id: newTokenData.id, status: "Token Booked", event_time: now },
      ]);

      const newToken = {
        id: newTokenData.token_id,
        farmer: newTokenData.farmer,
        crop: newTokenData.crop,
        quantity: newTokenData.quantity,
        centre: newTokenData.centre,
        status: newTokenData.status,
        createdAt: newTokenData.created_at,
        updatedAt: newTokenData.updated_at,
        history: [{ status: "Token Booked", time: now }],
      };

      setTokens((prev) => (prev.some((t) => t.id === newToken.id) ? prev : [...prev, newToken]));
      setScreen("token");
    } catch {
      alert("Something went wrong booking token.");
    }
  };

  /* =========================================
     OFFICER WORKFLOW
  ========================================= */
  const updateTokenStatus = async (tokenId, actualQuantity, totalAmount) => {
    const statusFlow = {
      Waiting: { next: "Entry Completed", history: "Entry Completed" },
      "Entry Completed": { next: "Processing", history: "Procurement Started" },
      Processing: { next: "Quality Check", history: "Quality Check" },
      "Quality Check": { next: "Weighing", history: "Weighing" },
      Weighing: { next: "Completed", history: "Procurement Completed" },
      Completed: { next: "Payment Processing", history: "Payment Processing" },
      "Payment Processing": { next: "Payment Completed", history: "Payment Completed" },
    };

    const currentToken = tokens.find((t) => t.id === tokenId);
    if (!currentToken || !statusFlow[currentToken.status]) return;
    const transition = statusFlow[currentToken.status];
    const now = new Date().toISOString();

    try {
      const measurement = transition.next === "Completed"
        ? Number(actualQuantity)
        : null;
      const payout = transition.next === "Payment Processing"
        ? Number(totalAmount)
        : null;

      if (transition.next === "Completed" && (!Number.isFinite(measurement) || measurement <= 0)) {
        return alert(t("Enter a valid verified weight."));
      }

      if (transition.next === "Payment Processing" && (!Number.isFinite(payout) || payout <= 0)) {
        return alert(t("Invalid payout amount."));
      }

      const { data: updatedToken, error: tokenError } = await supabase
        .from("tokens")
        .update({
          status: transition.next,
          updated_at: now,
          ...(transition.next === "Completed"
            ? { actual_quantity: measurement, rate: governmentRate }
            : {}),
          ...(transition.next === "Payment Processing"
            ? { total_amount: payout }
            : {}),
        })
        .eq("token_id", tokenId)
        .select()
        .maybeSingle();

      if (tokenError) {
        console.error("Token status update failed:", tokenError);
        const missingMeasurementColumn =
          tokenError.code === "PGRST204" ||
          tokenError.message?.includes("actual_quantity") ||
          tokenError.message?.includes("schema cache");

        if (missingMeasurementColumn) {
          return alert(
            "Verified weight fields are not available in Supabase yet. Run the migration in supabase/migrations/20260920_add_verified_token_measurements.sql, then retry."
          );
        }

        return alert(
          `Token status update failed: ${tokenError.message || "Unknown database error."}`
        );
      }

      if (!updatedToken) {
        console.error("Token update returned no row", { tokenId });
        return alert(
          `Token ${tokenId} was not updated. Check that it exists in Supabase and that the officer has permission to update tokens.`
        );
      }

      await supabase.from("token_history").insert([
        { token_id: updatedToken.id, status: transition.history, event_time: now },
      ]);

      setTokens((prev) =>
        prev.map((t) =>
          t.id !== tokenId
            ? t
            : {
                ...t,
                status: transition.next,
                updatedAt: now,
                ...(transition.next === "Completed"
                  ? { actualQuantity: measurement, rate: governmentRate }
                  : {}),
                ...(transition.next === "Payment Processing"
                  ? { totalAmount: payout }
                  : {}),
                history: [...(t.history || []), { status: transition.history, time: now }],
              }
        )
      );
    } catch {
      alert("Error updating status.");
    }
  };

  /* =========================================
     BUYER FLOW STATE
  ========================================= */
  const [buyerCrop, setBuyerCrop] = useState("");
  const [buyerQuantity, setBuyerQuantity] = useState("");
  const [buyerRate, setBuyerRate] = useState("");
  const [buyerLocation, setBuyerLocation] = useState("");
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
      return alert(t("Please fill all registration details."));
    }
    alert(`${t("Registration submitted successfully.")}\n\n${t("Your application is now pending Admin verification.")}`);
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

  const createDemand = () => {
    if (!buyerCrop || !buyerQuantity || !buyerRate || !buyerLocation) {
      return alert(t("Please fill all demand details."));
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

  /* =========================================
     HELPER METHODS
  ========================================= */
  const farmerToken = [...tokens].reverse().find((t) => t.farmer === (loginId || "Demo Farmer"));

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
        !["Completed", "Payment Processing", "Payment Completed"].includes(item.status)
    );
    const index = activeAtCentre.findIndex((item) => item.id === token.id);
    return index >= 0 ? index : 0;
  };

  const getRoleName = () => {
    if (loggedInRole === "farmer") return t("Farmer");
    if (loggedInRole === "officer") return t("Procurement Officer");
    if (loggedInRole === "buyer") return t("Verified Buyer");
    if (loggedInRole === "admin") return t("Admin");
    return "";
  };

  return (
    <div className="app">
      <Header
        loggedInRole={loggedInRole}
        getRoleName={getRoleName}
        unreadNotificationCount={unreadNotificationCount}
        showNotifications={showNotifications}
        setShowNotifications={setShowNotifications}
        notifications={notifications}
        markAllNotificationsRead={markAllNotificationsRead}
        markNotificationRead={markNotificationRead}
        showMenu={showMenu}
        setShowMenu={setShowMenu}
        showLanguageMenu={showLanguageMenu}
        setShowLanguageMenu={setShowLanguageMenu}
        language={language}
        changeLanguage={changeLanguage}
        logout={logout}
        setScreen={setScreen}
        screen={screen}
        t={t}
      />

      {screen === "roles" && (
        <RoleSelection
          onSelectRole={chooseRole}
          language={language}
          changeLanguage={changeLanguage}
          t={t}
        />
      )}

      {screen === "login" && (
        <LoginForm
          loginRole={loginRole}
          loginId={loginId}
          setLoginId={setLoginId}
          loginMobile={loginMobile}
          setLoginMobile={setLoginMobile}
          loginOtp={loginOtp}
          setLoginOtp={setLoginOtp}
          otpSent={otpSent}
          setOtpSent={setOtpSent}
          adminPassword={adminPassword}
          setAdminPassword={setAdminPassword}
          sendLoginOtp={sendLoginOtp}
          verifyLoginOtp={verifyLoginOtp}
          adminLogin={adminLogin}
          buyerRegisterMode={buyerRegisterMode}
          setBuyerRegisterMode={setBuyerRegisterMode}
          buyerRegistrationProps={{
            buyerName, setBuyerName,
            buyerBusiness, setBuyerBusiness,
            loginMobile, setLoginMobile,
            buyerEmail, setBuyerEmail,
            buyerBusinessType, setBuyerBusinessType,
            buyerGstin, setBuyerGstin,
            buyerPan, setBuyerPan,
            buyerAddress, setBuyerAddress,
            onSubmit: submitBuyerRegistration,
            onCancel: () => setBuyerRegisterMode(false),
          }}
          onBack={() => {
            resetLoginFields();
            setScreen("roles");
          }}
          language={language}
          changeLanguage={changeLanguage}
          t={t}
        />
      )}

      {screen === "home" && loggedInRole === "farmer" && (
        <FarmerDashboard
          loginId={loginId}
          crop={crop}
          setCrop={setCrop}
          quantity={quantity}
          setQuantity={setQuantity}
          goToCompare={goToCompare}
          farmerToken={farmerToken}
          getQueueAhead={getQueueAhead}
          getTokenStatusLabel={getTokenStatusLabel}
          setShowVoiceAssistant={setShowVoiceAssistant}
          t={t}
        />
      )}

      {screen === "compare" && loggedInRole === "farmer" && (
        <SellingOptionsCompare
          crop={crop}
          quantity={quantity}
          governmentRate={2585}
          marketRate={2700}
          onSelectGovernment={() => setScreen("centres")}
          onSelectMarket={() => setScreen("market")}
          onBack={() => setScreen("home")}
          t={t}
        />
      )}

      {screen === "centres" && loggedInRole === "farmer" && (
        <ProcurementCentres
          onGenerateToken={generateToken}
          onBack={() => setScreen("compare")}
          t={t}
        />
      )}

      {screen === "token" && loggedInRole === "farmer" && (
        <TokenSuccess
          farmerToken={farmerToken}
          latestToken={tokens[tokens.length - 1]}
          loginId={loginId}
          crop={crop}
          quantity={quantity}
          selectedCentre={selectedCentre}
          getQueueAhead={getQueueAhead}
          onBack={() => setScreen("home")}
          t={t}
        />
      )}

      {screen === "market" && loggedInRole === "farmer" && (
        <BuyerMarketList
          demands={demands}
          onBack={() => setScreen("compare")}
          t={t}
        />
      )}

      {screen === "token-history" && loggedInRole === "farmer" && (
        <FarmerTokenHistory
          loginId={loginId || "Demo Farmer"}
          tokens={tokens}
          setScreen={setScreen}
          t={t}
        />
      )}

      {screen === "officer" && loggedInRole === "officer" && (
        <OfficerDashboard
          tokens={tokens}
          officerCentre={officerCentre}
          onUpdateStatus={updateTokenStatus}
          getNextOfficerAction={getNextOfficerAction}
          t={t}
        />
      )}

      {screen === "buyer" && loggedInRole === "buyer" && (
        <BuyerDashboard
          demands={demands}
          onCreateDemand={createDemand}
          onRemoveDemand={(id) => setDemands((prev) => prev.filter((d) => d.id !== id))}
          formState={{
            buyerCrop, setBuyerCrop,
            buyerQuantity, setBuyerQuantity,
            buyerRate, setBuyerRate,
            buyerLocation, setBuyerLocation,
          }}
          t={t}
        />
      )}

      {screen === "admin" && loggedInRole === "admin" && <AdminDashboard t={t} />}

      {showVoiceAssistant && loggedInRole === "farmer" && (
        <VoiceAssistantModal onClose={() => setShowVoiceAssistant(false)} t={t} />
      )}

      <footer>
        <p>{t("© 2026 Nova Farm • Smart Agriculture Procurement Platform")}</p>
      </footer>
    </div>
  );
}