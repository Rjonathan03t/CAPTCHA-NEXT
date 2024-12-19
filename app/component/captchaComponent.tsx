"use client"
import { useEffect, useState, useRef } from "react";

const CaptchaComponent = () => {
  const [isCaptchaLoaded, setIsCaptchaLoaded] = useState(false);
  const captchaContainerRef = useRef(null);

  useEffect(() => {
    const loadCaptchaScript = () => {
      const script = document.createElement("script");
      script.src=
        "https://2b17d9cec338.eu-west-3.captcha-sdk.awswaf.com/2b17d9cec338/jsapi.js";
      script.defer = true;
      document.body.appendChild(script);

      script.onload = () => {
        setIsCaptchaLoaded(true);
        console.log("AwsWafCaptcha script loaded successfully");
      };

      script.onerror = () => {
        console.error("Failed to load the AwsWafCaptcha script");
      };
    };

    loadCaptchaScript();
  }, []);

  const showCaptcha = () => {
    if (typeof window.AwsWafCaptcha === "undefined") {
      console.error("AwsWafCaptcha is not loaded.");
      return;
    }

    const apiKey = process.env.NEXT_PUBLIC_WAF_API_KEY;
    if (!apiKey) {
      console.error("API key is missing.");
      return;
    }

    window.AwsWafCaptcha.renderCaptcha(captchaContainerRef.current, {
      apiKey,
      onSuccess: (wafToken: any) => {
        console.log("Captcha successful! Token:", wafToken);
      },
      onError: (error: any) => {
        console.error("Captcha error:", error);
      },
    });
  };

  return (
    <div>
      <div ref={captchaContainerRef}></div>
      <button onClick={showCaptcha} disabled={!isCaptchaLoaded}>
        Show CAPTCHA
      </button>
    </div>
  );
};

export default CaptchaComponent;
