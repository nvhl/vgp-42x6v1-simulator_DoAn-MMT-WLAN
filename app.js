/* ==========================================================================
   app.js — Main Router Shell Controller, Sidebar Accordion, Login, Idle Timeout,
   Reboot Progress Modal, Live 1s Clock/Schedule Ticker & OBS Fullscreen Mode
   ========================================================================== */

(function () {
  const NAV_GROUPS = [
    {
      id: "grp-net",
      title: "🌐 Mạng",
      items: [
        { key: "net-wan", label: "Thiết lập WAN" },
        { key: "net-lan", label: "Thiết lập LAN" }
      ]
    },
    {
      id: "grp-wifi",
      title: "📶 Wi-Fi",
      items: [
        { key: "wifi", label: "Thiết lập Wi-Fi 2.4GHz" },
        { key: "wifi-11ac", label: "Thiết lập Wi-Fi 5GHz" },
        { key: "wifi-mesh", label: "Wi-Fi Mesh" }
      ]
    },
    {
      id: "grp-sec",
      title: "🛡️ An ninh",
      items: [
        { key: "fw-spi", label: "Tường lửa" },
        { key: "fw-parentalcontrol", label: "Kiểm soát con cái" }
      ]
    },
    {
      id: "grp-apps",
      title: "🧩 Ứng dụng",
      items: [
        { key: "apps-dmz", label: "DMZ" },
        { key: "apps-portforwarding", label: "Port Forwarding" },
        { key: "apps-sslim", label: "Giới hạn phiên kết nối" },
        { key: "apps-route", label: "Định tuyến tĩnh" },
        { key: "apps-ddns", label: "DNS động (DDNS)" },
        { key: "apps-wifischeduling", label: "Lập lịch Wi-Fi" }
      ]
    },
    {
      id: "grp-tools",
      title: "🔧 Bảo dưỡng",
      items: [
        { key: "tools-admin", label: "Quản trị" },
        { key: "tools-wan2lan", label: "Uplink Mirroring" },
        { key: "tools-time", label: "Giờ hệ thống" },
        { key: "tools-firmware", label: "Firmware" },
        { key: "tools-config", label: "Cấu hình" },
        { key: "tools-diagnostic", label: "Chẩn đoán mạng" },
        { key: "tools-log", label: "Bản ghi hệ thống" },
        { key: "tools-reboot", label: "Khởi động lại" }
      ]
    }
  ];

  const TOP_ITEMS = [
    { key: "home", label: "⚡ Cài đặt nhanh" },
    { key: "deviceinfo", label: "📊 Thông tin thiết bị" },
    { key: "sta-users", label: "💻 Thiết bị đang kết nối" },
    { key: "wifi-mesh-topology", label: "🌳 Topology hiện tại" }
  ];

  window.RouterApp = {
    loggedIn: false,
    currentPage: "home",
    openGroups: { "grp-net": true, "grp-wifi": true, "grp-sec": false, "grp-apps": false, "grp-tools": true },
    idleRemainingSec: 300,
    lastScheduleState: false,
    toastTimer: null,

    init: function () {
      this.bindLoginEvents();
      this.bindTopBarEvents();
      this.resetIdleTimer();
      this.lastScheduleState = !!window.SimEngine.isWifiScheduledOff();
      this.renderAll();

      // Reset idle timeout on user activity inside router viewport
      const self = this;
      document.querySelector(".router-viewport").addEventListener("click", function () {
        self.resetIdleTimer();
      });
      document.querySelector(".router-viewport").addEventListener("keydown", function () {
        self.resetIdleTimer();
      });

      // Global shortcut F9 for clean OBS preview mode
      document.addEventListener("keydown", function (e) {
        if (e.key === "F9") {
          e.preventDefault();
          self.toggleObsFullscreen();
        }
      });

      // 1-second live ticker (Uptime, System Time, Idle Timeout, Wi-Fi Schedule Trigger)
      setInterval(function () {
        self.tickOneSecond();
      }, 1000);
    },

    resetIdleTimer: function () {
      const min = window.SimState.admin.sessionTimeoutMin;
      this.idleRemainingSec = min > 0 ? Math.round(min * 60) : 999999;
    },

    ensureLoggedIn: function () {
      if (!this.loggedIn) {
        this.loggedIn = true;
        this.resetIdleTimer();
        this.renderShellVisibility();
      }
    },

    logout: function (optionalAlert) {
      this.loggedIn = false;
      this.renderShellVisibility();
      this.updateUrlBar("/cgi-bin/login.asp");
      if (optionalAlert) alert(optionalAlert);
    },

    bindLoginEvents: function () {
      const self = this;
      document.getElementById("btn-quick-fill-login").addEventListener("click", function () {
        document.getElementById("login-user").value = window.SimState.admin.username;
        document.getElementById("login-pass").value = window.SimState.admin.password;
        document.getElementById("login-err").style.display = "none";
      });

      document.getElementById("login-form").addEventListener("submit", function (e) {
        e.preventDefault();
        const u = document.getElementById("login-user").value.trim();
        const p = document.getElementById("login-pass").value;
        if (u === window.SimState.admin.username && p === window.SimState.admin.password) {
          document.getElementById("login-err").style.display = "none";
          self.loggedIn = true;
          self.resetIdleTimer();
          window.SimEngine.addLog("[AUTH] Đăng nhập Web Admin thành công từ LAN (" + u + ").");
          self.renderAll();
        } else {
          const err = document.getElementById("login-err");
          err.textContent = "Sai tên đăng nhập hoặc mật khẩu! (Mật khẩu hiện tại: " + window.SimState.admin.password + ")";
          err.style.display = "block";
        }
      });

      document.getElementById("btn-logout").addEventListener("click", function () {
        window.SimEngine.addLog("[AUTH] Người quản trị đã đăng xuất.");
        self.logout();
      });
    },

    bindTopBarEvents: function () {
      const self = this;
      document.getElementById("btn-toggle-lab").addEventListener("click", function () {
        const drawer = document.getElementById("lab-drawer");
        drawer.classList.toggle("collapsed");
      });

      document.getElementById("btn-obs-mode").addEventListener("click", function () {
        self.toggleObsFullscreen();
      });

      document.getElementById("btn-exit-obs").addEventListener("click", function () {
        self.toggleObsFullscreen(false);
      });

      document.querySelectorAll(".lab-tab").forEach(function (tabBtn) {
        tabBtn.addEventListener("click", function () {
          window.SimState.coach.labTab = tabBtn.getAttribute("data-tab");
          window.SimEngine.saveState();
          window.LabUI.render();
        });
      });
    },

    toggleObsFullscreen: function (forceState) {
      if (typeof forceState === "boolean") {
        document.body.classList.toggle("obs-fullscreen", forceState);
      } else {
        document.body.classList.toggle("obs-fullscreen");
      }
    },

    updateUrlBar: function (cgiPath) {
      const el = document.getElementById("sim-cgi-url");
      if (el) el.textContent = "https://192.168.1.1" + cgiPath;
    },

    navigate: function (pageKey) {
      if (!window.RouterPages[pageKey]) pageKey = "home";
      this.currentPage = pageKey;
      // Auto-expand parent group in sidebar
      for (const g of NAV_GROUPS) {
        if (g.items.some((it) => it.key === pageKey)) {
          this.openGroups[g.id] = true;
        }
      }
      this.renderSidebar();
      this.renderCurrentPage();
    },

    renderShellVisibility: function () {
      document.getElementById("login-view").style.display = this.loggedIn ? "none" : "flex";
      document.getElementById("admin-shell-view").style.display = this.loggedIn ? "flex" : "none";
      if (!this.loggedIn) {
        this.updateUrlBar("/cgi-bin/login.asp");
      }
    },

    renderTopStatusChips: function () {
      const st = window.SimState;
      const fault = st.device.fiberFault;
      const schedOff = window.SimEngine.isWifiScheduledOff();
      const topInfo = document.getElementById("topbar-live-chips");
      if (!topInfo) return;

      topInfo.innerHTML = `
        <span class="vht-status-chip">
          <span class="${fault ? "dot-offline" : "dot-online"}"></span>
          PON: ${fault ? "LOS Đỏ" : "O5 (-21.14 dBm)"}
        </span>
        <span class="vht-status-chip">
          <span class="${schedOff || !st.wifi24.enabled ? "dot-offline" : "dot-online"}"></span>
          SSID: ${st.wifi24.ssids[0].ssid}
        </span>
      `;
    },

    renderSidebar: function () {
      const sb = document.getElementById("vht-sidebar");
      if (!sb) return;
      const cur = this.currentPage;

      let html = TOP_ITEMS.map(
        (it) => `<div class="nav-top-item ${cur === it.key ? "active" : ""}" data-nav="${it.key}">${it.label}</div>`
      ).join("");

      for (const g of NAV_GROUPS) {
        const isOpen = !!this.openGroups[g.id];
        html += `
          <div class="nav-group ${isOpen ? "open" : ""}" data-grp="${g.id}">
            <div class="nav-group-header" data-grp-toggle="${g.id}">
              <span class="nav-group-title">${g.title}</span>
              <span class="nav-caret">▶</span>
            </div>
            <div class="nav-sub-list">
              ${g.items
                .map(
                  (sub) =>
                    `<div class="nav-sub-item ${cur === sub.key ? "active" : ""}" data-nav="${sub.key}"><span>${sub.label}</span></div>`
                )
                .join("")}
            </div>
          </div>
        `;
      }

      sb.innerHTML = html;

      const self = this;
      sb.querySelectorAll("[data-nav]").forEach(function (el) {
        el.addEventListener("click", function () {
          self.navigate(el.getAttribute("data-nav"));
        });
      });

      sb.querySelectorAll("[data-grp-toggle]").forEach(function (hdr) {
        hdr.addEventListener("click", function () {
          const gid = hdr.getAttribute("data-grp-toggle");
          self.openGroups[gid] = !self.openGroups[gid];
          self.renderSidebar();
        });
      });
    },

    renderCurrentPage: function () {
      this.renderTopStatusChips();
      if (!this.loggedIn) return;
      const pageDef = window.RouterPages[this.currentPage] || window.RouterPages["home"];
      this.updateUrlBar(pageDef.cgi);

      const main = document.getElementById("vht-main-content");
      main.innerHTML = `
        <div class="page-breadcrumb">
          <span>${pageDef.group} &nbsp;/&nbsp; <strong>${pageDef.title}</strong></span>
          <span class="cgi-tag">${pageDef.cgi}</span>
        </div>
        <div class="page-title">
          <span>${pageDef.title}</span>
        </div>
        <div id="cgi-page-inner">${pageDef.render()}</div>
      `;

      if (typeof pageDef.bind === "function") {
        pageDef.bind();
      }
    },

    renderAll: function () {
      this.renderShellVisibility();
      this.renderSidebar();
      this.renderCurrentPage();
      window.LabUI.render();
    },

    showToast: function (msg) {
      const el = document.getElementById("sim-toast");
      el.textContent = "✓ " + msg;
      el.style.display = "block";
      clearTimeout(this.toastTimer);
      this.toastTimer = setTimeout(function () {
        el.style.display = "none";
      }, 3400);
    },

    applyWithFeedback: function (msg, wifiPrimarySsidChanged) {
      window.SimEngine.saveState();
      this.renderCurrentPage();
      window.LabUI.render();
      this.showToast(msg);

      // Firmware Trap #4 Warning if Laptop OBS was connected over Wi-Fi instead of LAN1 cable!
      if (wifiPrimarySsidChanged && window.SimState.simDevices.laptopObs.connMode === "WIFI") {
        setTimeout(function () {
          alert(
            "⚠️ [Mô phỏng Bẫy kỹ thuật số 4]:\n\nLaptop của bạn đang kết nối với Router qua sóng Wi-Fi thay vì cắm dây cáp mạng LAN1! Khi bạn đổi Tên Wi-Fi (SSID) hoặc mật khẩu, Laptop sẽ bị văng khỏi sóng Wi-Fi cũ và trang 192.168.1.1 sẽ xoay vòng mất kết nối.\n\n👉 Khi quay thật trên OBS, hãy cắm 1 sợi cáp LAN vào cổng LAN1 để chuyển trang mượt 100%!"
          );
        }, 120);
      }
    },

    runRebootSimulation: function (caption, onComplete) {
      const modal = document.getElementById("reboot-overlay");
      const text = document.getElementById("reboot-caption");
      const fill = document.getElementById("reboot-bar-fill");
      text.textContent = caption;
      fill.style.width = "0%";
      modal.style.display = "flex";

      let pct = 0;
      const timer = setInterval(function () {
        pct += 20;
        fill.style.width = Math.min(100, pct) + "%";
        if (pct >= 100) {
          clearInterval(timer);
          setTimeout(function () {
            modal.style.display = "none";
            if (typeof onComplete === "function") onComplete();
          }, 220);
        }
      }, 180);
    },

    tickOneSecond: function () {
      const st = window.SimState;
      st.device.uptimeSec = (st.device.uptimeSec || 0) + 1;

      // Update Uptime text live if on deviceinfo
      const upEl = document.getElementById("devinfo-uptime");
      if (upEl) {
        const sec = st.device.uptimeSec;
        const d = Math.floor(sec / 86400);
        const h = Math.floor((sec % 86400) / 3600);
        const m = Math.floor((sec % 3600) / 60);
        const s = sec % 60;
        upEl.textContent = d + " ngày " + h + " giờ " + m + " phút " + s + " giây";
      }

      // Update live clocks if visible
      const now = window.SimEngine.nowRouterDate();
      const nowStr = window.SimEngine.formatDateTime(now);
      const tClock = document.getElementById("tools-live-clock");
      if (tClock) tClock.textContent = nowStr;
      const wClock = document.getElementById("wsch-live-clock");
      if (wClock) wClock.textContent = nowStr + " (" + window.SimEngine.getDayCode(now) + ")";

      // Check Wi-Fi Schedule transition!
      const curSchedOff = !!window.SimEngine.isWifiScheduledOff();
      if (curSchedOff !== this.lastScheduleState) {
        this.lastScheduleState = curSchedOff;
        window.SimEngine.reconcileClients();
        this.renderTopStatusChips();
        if (this.currentPage === "apps-wifischeduling" || this.currentPage === "sta-users") {
          this.renderCurrentPage();
        }
        window.LabUI.render();
        this.showToast(
          curSchedOff
            ? "⏰ Đến giờ hẹn Lập lịch Wi-Fi: Đèn WLAN đã tắt & sóng Wi-Fi tự động ngắt!"
            : "⏰ Hết khung giờ tắt: Sóng Wi-Fi đã tự động phát trở lại!"
        );
      }

      // Update Idle Session Countdown (Trap #3: 5 minutes = 300s)
      const badge = document.getElementById("sim-session-timer");
      if (this.loggedIn && st.admin.sessionTimeoutMin > 0) {
        this.idleRemainingSec = Math.max(0, this.idleRemainingSec - 1);
        const mm = String(Math.floor(this.idleRemainingSec / 60)).padStart(2, "0");
        const ss = String(this.idleRemainingSec % 60).padStart(2, "0");
        if (badge) badge.textContent = "Timeout: " + mm + ":" + ss;
        if (this.idleRemainingSec === 0) {
          this.logout(
            "⏱️ [Bẫy kỹ thuật số 3 — Hết phiên 5 phút (300s)]:\n\nBạn đứng thuyết minh quá " +
              st.admin.sessionTimeoutMin +
              " phút mà không bấm chuột nên Firmware V1302250508 đã tự động đăng xuất về màn hình đăng nhập!"
          );
        }
      } else if (badge) {
        badge.textContent = this.loggedIn ? "Timeout: ∞" : "Chưa đăng nhập";
      }
    }
  };

  document.addEventListener("DOMContentLoaded", function () {
    window.RouterApp.init();
  });
})();
