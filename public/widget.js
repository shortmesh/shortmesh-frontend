const PLATFORM_REGISTRY = {
  wa: {
    label: "WhatsApp",
    icon: "WhatsApp.svg",
  },
  telegram: {
    label: "Telegram",
    icon: "Logo.svg",
  },
  signal: {
    label: "Signal",
    icon: "Signal-Logo.svg",
  },
};

(function () {
  let widgetConfig = {
    identifier: null,
    endpoints: {
      platforms: null,
      sendOtp: null,
      verifyOtp: null,
    },
    onSuccess: function () {},
    onError: function () {},
  };

  function createWidget(config = {}) {
    widgetConfig.identifier = config.identifier || null;
    widgetConfig.endpoints = config.endpoints || {};
    widgetConfig.onSuccess = config.onSuccess || function () {};
    widgetConfig.onError = config.onError || function () {};

    if (!widgetConfig.endpoints.platforms) {
      console.error("ShortMesh: platforms endpoint is required");
      return;
    }

    if (!widgetConfig.identifier) {
      console.error("ShortMesh: phoneNumber is required");
      return;
    }

    if (!widgetConfig.endpoints.sendOtp || !widgetConfig.endpoints.verifyOtp) {
      console.error("ShortMesh: sendOtp and verifyOtp endpoints are required");
      return;
    }

    const overlay = document.createElement("div");
    overlay.id = "shortmesh-overlay";

    overlay.innerHTML = `
      <div class="shortmesh-modal">
        <div class="shortmesh-close">&times;</div>
        <div id="shortmesh-content"></div>
      </div>
    `;

    document.body.appendChild(overlay);

    const content = overlay.querySelector("#shortmesh-content");
    const closeBtn = overlay.querySelector(".shortmesh-close");

    closeBtn.onclick = () => overlay.remove();

    /* ---------------- SEND OTP ---------------- */

    async function sendOtp(platform) {
      const payload = {
        identifier: widgetConfig.identifier,
        platform,
      };

      const response = await fetch(widgetConfig.endpoints.sendOtp, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error("Failed to send OTP");
      }

      return response.json();
    }

    /* ---------------- VERIFY OTP ---------------- */

    async function verifyOtp(code, platform) {
      const payload = {
        identifier: widgetConfig.identifier,
        code,
        platform,
      };

      const response = await fetch(widgetConfig.endpoints.verifyOtp, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error("Invalid OTP");
      }

      return response.json();
    }

    /* ---------------- RESEND OTP ---------------- */

    async function resendOtp(platform) {
      return sendOtp(platform);
    }

    /* ---------------- EXTRACT EXPIRY SECONDS ---------------- */

    function extractExpirySeconds(otpResponse) {
      if (otpResponse?.expiresIn) return otpResponse.expiresIn;
      if (otpResponse?.expiry) return otpResponse.expiry;
      if (otpResponse?.ttl) return otpResponse.ttl;
      return 30; // default fallback
    }

    async function fetchPlatforms() {
      const response = await fetch(widgetConfig.endpoints.platforms);

      if (!response.ok) {
        throw new Error("Failed to fetch platforms");
      }

      return response.json();
    }

    /* ---------------- UI SCREENS ---------------- */

    async function renderSelect() {
      let platformsFromAPI = [];

      try {
        platformsFromAPI = await fetchPlatforms();
      } catch (err) {
        widgetConfig.onError(err);
        content.innerHTML =
          "<p>Failed to load platforms. Contact support for assistance.</p>";
        return;
      }

      console.log("ShortMesh: Platforms from API:", platformsFromAPI);
      console.log(
        "ShortMesh: Supported platforms:",
        Object.keys(PLATFORM_REGISTRY),
      );

      const supportedPlatformsArray = platformsFromAPI.filter(
        (p) => PLATFORM_REGISTRY[p.platform],
      );

      if (supportedPlatformsArray.length === 0) {
        const apiIds = platformsFromAPI.map((p) => p.platform).join(", ");
        console.error(
          "ShortMesh: No matching platforms found. API returned:",
          apiIds,
        );
        content.innerHTML = `
    <h2>Verify your account</h2>
    <p>No available verification methods. Contact support for assistance.</p>
    <div class="shortmesh-footer">Powered by Shortmesh</div>
  `;
        return;
      }

      const supportedPlatforms = supportedPlatformsArray
        .map((p) => {
          const registry = PLATFORM_REGISTRY[p.platform];

          return `
      <div class="shortmesh-platform" data-platform="${p.platform}">
        <span class="icon">
          <img style="width: 26px; height: 26px; margin: auto;" 
               src="${registry.icon}" 
               alt="${registry.label}" />
        </span>
        ${registry.label}
      </div>
    `;
        })
        .join("");
      content.innerHTML = `
  <h2>Verify your account</h2>
  <p>Select where you'd like to receive your code.</p>

  <div class="shortmesh-platform-list">
    ${supportedPlatforms}
  </div>

  <div class="shortmesh-buttons">
    <button class="btn secondary">Cancel</button>
    <button class="btn primary" disabled>Continue</button>
  </div>

  <div class="shortmesh-footer">Powered by Shortmesh</div>
`;

      let selected = null;
      const platforms = content.querySelectorAll(".shortmesh-platform");
      const continueBtn = content.querySelector(".primary");

      platforms.forEach((el) => {
        el.onclick = () => {
          platforms.forEach((p) => p.classList.remove("active"));
          el.classList.add("active");
          selected = el.dataset.platform;
          continueBtn.disabled = false;
        };
      });

      content.querySelector(".secondary").onclick = () => overlay.remove();

      continueBtn.onclick = async () => {
        if (!selected) return;

        continueBtn.disabled = true;

        try {
          const otpResponse = await sendOtp(selected);
          renderOTP(selected, otpResponse);
        } catch (err) {
          widgetConfig.onError(err);
          continueBtn.disabled = false;
        }
      };
    }

    function renderOTP(platform, otpResponse) {
      const expirySeconds = extractExpirySeconds(otpResponse);

      content.innerHTML = `
        <h2>Enter verification code</h2>
        <p>sent via <strong>${platform}</strong></p>

        <div class="shortmesh-otp">
          ${Array(6)
            .fill(0)
            .map(
              (_, i) =>
                `<input type="text" maxlength="1" class="otp-box" id="otp-${i}" />`,
            )
            .join("")}
        </div>

        <div class="shortmesh-resend">
          <span class="resend-text">Didn't receive a code? <a href="#" class="resend-link disabled">Resend</a></span>
          <span class="resend-timer">Available in <strong>${expirySeconds}s</strong></span>
        </div>

        <div class="shortmesh-buttons">
          <button class="btn secondary">Go back</button>
          <button class="btn primary">Continue</button>
        </div>

        <div class="shortmesh-footer">Powered by Shortmesh</div>
      `;

      const inputs = content.querySelectorAll(".otp-box");
      const verifyBtn = content.querySelector(".primary");
      const resendLink = content.querySelector(".resend-link");
      const resendTimer = content.querySelector(".resend-timer");

      let timeLeft = expirySeconds;
      let currentCountdown = null;

      const startCountdown = () => {
        if (currentCountdown) clearInterval(currentCountdown);
        
        currentCountdown = setInterval(() => {
          timeLeft--;
          if (timeLeft > 0) {
            resendTimer.innerHTML = `Available in <strong>${timeLeft}s</strong>`;
          } else {
            clearInterval(currentCountdown);
            resendTimer.style.display = "none";
            resendLink.classList.remove("disabled");
          }
        }, 1000);
      };

      startCountdown();

      resendLink.onclick = async (e) => {
        e.preventDefault();
        if (resendLink.classList.contains("disabled")) return;

        resendLink.classList.add("disabled");
        resendTimer.style.display = "inline";

        try {
          const newOtpResponse = await resendOtp(platform);
          timeLeft = extractExpirySeconds(newOtpResponse);
          resendTimer.innerHTML = `Available in <strong>${timeLeft}s</strong>`;
          startCountdown();
        } catch (err) {
          widgetConfig.onError(err);
        }
      };

      inputs.forEach((input, index) => {
        input.addEventListener("input", (e) => {
          if (!/^[0-9]$/.test(e.target.value)) {
            e.target.value = "";
            return;
          }
          if (index < inputs.length - 1) {
            inputs[index + 1].focus();
          }
        });
      });

      content.querySelector(".secondary").onclick = renderSelect;

      verifyBtn.onclick = async () => {
        const code = Array.from(inputs)
          .map((i) => i.value)
          .join("");

        if (code.length !== 6) return;

        verifyBtn.disabled = true;
        renderLoading();

        try {
          const result = await verifyOtp(code, platform);
          renderSuccess();
          widgetConfig.onSuccess(result);
        } catch (err) {
          widgetConfig.onError(err);
          const newOtpResponse = await sendOtp(platform);
          renderOTP(platform, newOtpResponse);
        }
      };
    }

    function renderLoading() {
      content.innerHTML = `
        <h2>Verifying...</h2>
        <p>Checking your code</p>
        <div class="shortmesh-spinner"></div>
        <div class="shortmesh-footer">Powered by Shortmesh</div>
      `;
    }

    function renderSuccess() {
      content.innerHTML = `
        <h2>Verified Successfully</h2>
        <div class="shortmesh-check">✓</div>
        <div class="shortmesh-footer">Powered by Shortmesh</div>
      `;
    }

    renderSelect();
  }

  function injectStyles() {
    const style = document.createElement("style");
    style.innerHTML = `
      #shortmesh-overlay {
        position: fixed;
        inset: 0;
        background: rgba(0,0,0,0.25);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 9999;
        font-family: Inter, sans-serif;
        padding: 16px;
      }

      .shortmesh-modal {
        background: #f3f3f3;
        width: 100%;
        max-width: 360px;
        border-radius: 16px;
        padding: 28px;
        box-shadow: 0 8px 30px rgba(0,0,0,0.15);
        text-align: center;
        position: relative;
        max-height: 90vh;
        overflow-y: auto;
      }

      @media (max-width: 480px) {
        .shortmesh-modal {
          padding: 20px;
          border-radius: 12px;
        }
      }

      .shortmesh-close {
        position: absolute;
        right: 18px;
        top: 14px;
        cursor: pointer;
        font-size: 18px;
      }

      h2 {
        margin-bottom: 8px;
        font-size: 24px;
      }

      @media (max-width: 480px) {
        h2 {
          font-size: 20px;
        }
      }

      p {
        font-size: 14px;
        color: #555;
        margin-bottom: 20px;
      }

      @media (max-width: 480px) {
        p {
          font-size: 13px;
        }
      }

      .shortmesh-platform-list {
        display: flex;
        flex-direction: column;
        gap: 12px;
        margin-bottom: 24px;
      }

      .shortmesh-platform {
        padding: 14px;
        border-radius: 10px;
        background: #fff;
        border: 1px solid #ddd;
        cursor: pointer;
        display: flex;
        align-items: center;
        gap: 12px;
      }

      .shortmesh-platform.active {
        border: 2px solid #4b5bdc;
      }

      .icon {
        font-size: 20px;
      }

      .shortmesh-buttons {
        display: flex;
        gap: 12px;
      }

      .btn {
        flex: 1;
        padding: 10px;
        border-radius: 8px;
        border: none;
        cursor: pointer;
        font-size: 14px;
      }

      .btn.primary {
        background: #4b5bdc;
        color: white;
      }

      .btn.primary:disabled {
        opacity: 0.5;
        cursor: not-allowed;
      }

      .btn.secondary {
        background: #e6e6e6;
      }

      .shortmesh-otp {
        display: flex;
        justify-content: center;
        gap: 10px;
        margin-bottom: 24px;
      }

      @media (max-width: 380px) {
        .shortmesh-otp {
          gap: 6px;
        }
      }

      .otp-box {
        width: 42px;
        height: 48px;
        text-align: center;
        font-size: 18px;
        border-radius: 8px;
        border: 1px solid #ccc;
      }

      @media (max-width: 380px) {
        .otp-box {
          width: 36px;
          height: 42px;
          font-size: 16px;
        }
      }

      .shortmesh-check {
        font-size: 48px;
        margin: 24px 0;
      }

      .shortmesh-footer {
        font-size: 12px;
        color: #777;
        margin-top: 16px;
      }

      .shortmesh-resend {
        font-size: 13px;
        color: #555;
        margin-bottom: 20px;
        text-align: center;
      }

      @media (max-width: 480px) {
        .shortmesh-resend {
          font-size: 12px;
        }
      }

      .resend-link {
        color: #4b5bdc;
        text-decoration: none;
        cursor: pointer;
        font-weight: 500;
      }

      .resend-link:hover:not(.disabled) {
        text-decoration: underline;
      }

      .resend-link.disabled {
        color: #999;
        cursor: not-allowed;
        pointer-events: none;
      }

      .resend-timer {
        display: inline;
        color: #777;
      }

      .shortmesh-spinner {
        width: 48px;
        height: 48px;
        border: 4px solid #f3f3f3;
        border-top: 4px solid #4b5bdc;
        border-radius: 50%;
        animation: spin 1s linear infinite;
        margin: 24px auto;
      }

      @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
      }
    `;
    document.head.appendChild(style);
  }

  injectStyles();

  window.ShortMeshWidget = {
    open: createWidget,
  };
})();
