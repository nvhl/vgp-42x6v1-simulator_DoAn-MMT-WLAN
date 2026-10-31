/* ==========================================================================
   pages-wifi-sec.js — Renderers & Handlers for Wi-Fi (3 pages) & An ninh (2 pages)
   Matches Real VHT ONT Firmware V1302250508 HTML Structure, Sub-tabs, Switches & Traps
   ========================================================================== */

(function () {
  window.RouterPages = window.RouterPages || {};

  function esc(s) {
    return String(s == null ? "" : s)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function pwdInputHtml(id, val, placeholder) {
    return `
      <div class="pwd-wrap">
        <input type="password" class="vht-input" id="${id}" value="${esc(val)}" ${placeholder ? `placeholder="${esc(placeholder)}"` : ""} />
        <button type="button" class="pwd-eye" data-target="${id}" title="Hiện/Ẩn mật khẩu">👁</button>
      </div>
    `;
  }

  function switchHtml(id, checked, extraAttr) {
    return `
      <label class="vht-switch">
        <input type="checkbox" id="${id}" ${checked ? "checked" : ""} ${extraAttr || ""} />
        <span class="vht-slider"></span>
      </label>
    `;
  }

  function bindPwdEyes(root) {
    (root || document).querySelectorAll(".pwd-eye").forEach(function (btn) {
      btn.addEventListener("click", function () {
        const inp = document.getElementById(btn.getAttribute("data-target"));
        if (!inp) return;
        inp.type = inp.type === "password" ? "text" : "password";
      });
    });
  }

  // --------------------------------------------------------------------------
  // 7. Wi-Fi -> Thiết lập Wi-Fi 2.4GHz (/cgi-bin/wifi.asp)
  //    Headers: ['Thiết lập điểm truy cập', 'Thiết lập SSID']
  // --------------------------------------------------------------------------
  window.RouterPages["wifi"] = {
    title: "Thiết lập điểm truy cập",
    group: "Wi-Fi",
    cgi: "/cgi-bin/wifi.asp",
    render: function () {
      const st = window.SimState;
      const w = st.wifi24;
      const curIdx = w.selectedIdx || 1;
      const curSsidObj = w.ssids.find((x) => x.idx === curIdx) || w.ssids[0];
      const channels = ["Auto", "1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12", "13"];
      const modes = [
        "802.11b",
        "802.11g",
        "802.11n",
        "802.11b/g",
        "802.11g/n",
        "802.11b/g/n",
        "802.11b/g/n/ax"
      ];
      const auths = [
        "OPEN",
        "WEP",
        "WPA-PSK",
        "WPA2-PSK",
        "WPA-PSK/WPA2-PSK",
        "WPA3-SAE",
        "WPA2-PSK/WPA3-SAE"
      ];
      const curChanVal = w.channel === "Auto" ? w.autoCurrentChannel : w.channel;
      const wpsActive = st.device.wpsBlinkUntil && Date.now() < st.device.wpsBlinkUntil;

      return `
        <!-- Widget 1: Thiết lập điểm truy cập -->
        <div class="vht-card">
          <div class="vht-card-body">
            <table class="form-table">
              <tr>
                <th>Kích hoạt WiFi</th>
                <td>
                  <div style="display:flex;align-items:center;gap:18px;">
                    ${switchHtml("w24-enable", w.enabled)}
                    <a href="javascript:void(0)" id="w24-link-sched" style="color:#007bff;font-weight:500;">Lập lịch Wi-Fi</a>
                  </div>
                </td>
              </tr>
              <tr>
                <th>Chế độ</th>
                <td>
                  <select class="vht-select" id="w24-mode">
                    ${modes.map((m) => `<option value="${m}" ${w.mode === m ? "selected" : ""}>${m}</option>`).join("")}
                  </select>
                </td>
              </tr>
              <tr>
                <th>Kênh</th>
                <td>
                  <select class="vht-select" id="w24-channel">
                    ${channels.map((c) => `<option value="${c}" ${String(w.channel) === c ? "selected" : ""}>${c}</option>`).join("")}
                  </select>
                </td>
              </tr>
              <tr>
                <th>Kênh hiện tại</th>
                <td><strong>${esc(curChanVal)}</strong></td>
              </tr>
              <tr>
                <th>Băng thông</th>
                <td>
                  <select class="vht-select" id="w24-bw">
                    <option value="20 MHz" ${w.bandwidth === "20 MHz" ? "selected" : ""}>20MHz</option>
                    <option value="40 MHz" ${w.bandwidth === "40 MHz" ? "selected" : ""}>40MHz</option>
                    <option value="20/40 MHz" ${w.bandwidth === "20/40 MHz" ? "selected" : ""}>20/40MHz</option>
                  </select>
                </td>
              </tr>
              <tr>
                <th>Khoảng bảo vệ</th>
                <td>
                  <select class="vht-select" id="w24-gi">
                    <option value="Auto" ${w.guardInterval === "Auto" ? "selected" : ""}>Auto</option>
                    <option value="Short" ${w.guardInterval === "Short" ? "selected" : ""}>Short</option>
                    <option value="Long" ${w.guardInterval === "Long" ? "selected" : ""}>Long</option>
                  </select>
                </td>
              </tr>
            </table>

            <!-- Advanced RF rows toggled by NÂNG CAO button -->
            <table class="form-table" id="w24-adv-box" style="display:${w.showAdvanced ? "table" : "none"};">
              <tr>
                <th>Công suất phát</th>
                <td>
                  <select class="vht-select" id="w24-txpower">
                    ${["100%", "75%", "50%", "25%"].map((p) => `<option value="${p}" ${w.txPower === p ? "selected" : ""}>${p}</option>`).join("")}
                  </select>
                </td>
              </tr>
              <tr>
                <th>Chu kì DTIM</th>
                <td><input type="number" class="vht-input" id="w24-dtim" value="${w.dtim}" /></td>
              </tr>
              <tr>
                <th>Chu kì gửi Beacon</th>
                <td><input type="number" class="vht-input" id="w24-beacon" value="${w.beacon}" /></td>
              </tr>
              <tr>
                <th>Ngưỡng RTS/CTS</th>
                <td><input type="number" class="vht-input" id="w24-rts" value="${w.rts}" /></td>
              </tr>
              <tr>
                <th>Ngưỡng phân mảnh</th>
                <td><input type="number" class="vht-input" id="w24-frag" value="${w.frag}" /></td>
              </tr>
            </table>
          </div>
        </div>

        <!-- Widget 2: Thiết lập SSID -->
        <div class="sec-heading">Thiết lập SSID</div>
        <div class="vht-card">
          <div class="vht-card-body">
            <table class="form-table">
              <tr>
                <th>Số thứ tự</th>
                <td>
                  <select class="vht-select" id="w24-ssid-idx">
                    ${w.ssids.map((s) => `<option value="${s.idx}" ${s.idx === curIdx ? "selected" : ""}>${s.idx}</option>`).join("")}
                  </select>
                </td>
              </tr>
              <tr>
                <th>Kích hoạt SSID</th>
                <td>${switchHtml("w24-ssid-enable", curSsidObj.enabled)}</td>
              </tr>
              <tr>
                <th>SSID</th>
                <td><input type="text" class="vht-input" id="w24-ssid-name" value="${esc(curSsidObj.ssid)}" /></td>
              </tr>
              <tr>
                <th>Ẩn SSID</th>
                <td>${switchHtml("w24-ssid-hidden", curSsidObj.hidden)}</td>
              </tr>
              <tr>
                <th>Số thiết bị kết nối</th>
                <td>
                  <input type="number" class="vht-input" id="w24-maxsta" value="${w.maxSta}" min="1" max="45" />
                  <div class="field-hint" style="margin-left:0;margin-top:4px;">(Phạm vi: 1~45)</div>
                </td>
              </tr>
              <tr>
                <th>WMM Kích hoạt</th>
                <td>${switchHtml("w24-wmm", w.wmm)}</td>
              </tr>
              <tr>
                <th>Kiểu xác thực</th>
                <td>
                  <select class="vht-select" id="w24-ssid-auth">
                    ${auths.map((a) => `<option value="${a}" ${curSsidObj.auth === a ? "selected" : ""}>${a}</option>`).join("")}
                  </select>
                </td>
              </tr>
              <tr id="w24-key-row" style="display:${curSsidObj.auth === "OPEN" ? "none" : ""};">
                <th style="vertical-align:top;">Mật khẩu</th>
                <td>
                  ${pwdInputHtml("w24-ssid-key", curSsidObj.key)}
                  <div class="field-hint" style="margin-left:0;margin-top:4px;">(8~63kí tự hoặc chuỗi 64 số hex)</div>
                </td>
              </tr>
              <tr id="w24-rekey-row" style="display:${curSsidObj.auth === "OPEN" ? "none" : ""};">
                <th>Chu kì làm mới khóa</th>
                <td><input type="number" class="vht-input" id="w24-rekey" value="3600" /></td>
              </tr>
              <tr id="w24-enc-row" style="display:${curSsidObj.auth === "OPEN" ? "none" : ""};">
                <th>Mã hóa</th>
                <td>
                  <select class="vht-select" id="w24-ssid-enc">
                    <option value="AES" ${curSsidObj.enc === "AES" ? "selected" : ""}>AES</option>
                    <option value="TKIP" ${curSsidObj.enc === "TKIP" ? "selected" : ""}>TKIP</option>
                    <option value="TKIP+AES" ${curSsidObj.enc === "TKIP+AES" ? "selected" : ""}>TKIP+AES</option>
                  </select>
                </td>
              </tr>
              <tr>
                <th>Kích hoạt WPS</th>
                <td>${switchHtml("w24-wps-en", w.wpsEnabled)}</td>
              </tr>
              <tr>
                <th>WPS Chế độ</th>
                <td>
                  <select class="vht-select" id="w24-wps-mode">
                    <option value="PBC" ${w.wpsMode === "PBC" ? "selected" : ""}>PBC</option>
                    <option value="PIN" ${w.wpsMode === "PIN" ? "selected" : ""}>PIN</option>
                  </select>
                </td>
              </tr>
              <tr>
                <th>Trạng thái WPS</th>
                <td><strong>${wpsActive ? "In Progress (PBC)" : "Idle"}</strong></td>
              </tr>
            </table>
          </div>
        </div>

        <div class="btn-row center">
          <button type="button" class="btn-vht secondary" id="w24-btn-adv">NÂNG CAO</button>
          <button type="button" class="btn-vht" id="w24-btn-apply">ÁP DỤNG</button>
        </div>
      `;
    },
    bind: function () {
      bindPwdEyes();
      const st = window.SimState;
      const w = st.wifi24;

      document.getElementById("w24-link-sched").addEventListener("click", function () {
        window.RouterApp.navigate("apps-wifischeduling");
      });

      document.getElementById("w24-btn-adv").addEventListener("click", function () {
        w.showAdvanced = !w.showAdvanced;
        window.SimEngine.saveState();
        window.RouterApp.renderCurrentPage();
      });

      document.getElementById("w24-ssid-idx").addEventListener("change", function (e) {
        w.selectedIdx = parseInt(e.target.value, 10) || 1;
        window.SimEngine.saveState();
        window.RouterApp.renderCurrentPage();
      });

      const authEl = document.getElementById("w24-ssid-auth");
      authEl.addEventListener("change", function () {
        const isOpen = authEl.value === "OPEN";
        document.getElementById("w24-enc-row").style.display = isOpen ? "none" : "";
        document.getElementById("w24-key-row").style.display = isOpen ? "none" : "";
        document.getElementById("w24-rekey-row").style.display = isOpen ? "none" : "";
      });

      document.getElementById("w24-btn-apply").addEventListener("click", function () {
        const idx = w.selectedIdx || 1;
        const target = w.ssids.find((x) => x.idx === idx);
        const oldPrimarySsid = w.ssids[0].ssid;

        const maxSta = parseInt(document.getElementById("w24-maxsta").value, 10);
        if (isNaN(maxSta) || maxSta < 1 || maxSta > 45) {
          return alert("Số thiết bị kết nối phải nằm trong phạm vi 1~45!");
        }
        const ssidName = document.getElementById("w24-ssid-name").value.trim();
        const auth = authEl.value;
        const key = document.getElementById("w24-ssid-key").value;

        if (!ssidName) return alert("SSID không được để trống!");
        if (auth !== "OPEN" && key.length < 8) {
          return alert("Mật khẩu Wi-Fi phải từ 8 đến 63 ký tự!");
        }

        w.enabled = document.getElementById("w24-enable").checked;
        w.mode = document.getElementById("w24-mode").value;
        w.channel = document.getElementById("w24-channel").value;
        w.bandwidth = document.getElementById("w24-bw").value;
        w.guardInterval = document.getElementById("w24-gi").value;
        w.txPower = document.getElementById("w24-txpower").value;
        w.maxSta = maxSta;
        w.dtim = parseInt(document.getElementById("w24-dtim").value, 10) || 1;
        w.beacon = parseInt(document.getElementById("w24-beacon").value, 10) || 100;
        w.rts = parseInt(document.getElementById("w24-rts").value, 10) || 2347;
        w.frag = parseInt(document.getElementById("w24-frag").value, 10) || 2346;
        w.wmm = document.getElementById("w24-wmm").checked;
        w.wpsEnabled = document.getElementById("w24-wps-en").checked;
        w.wpsMode = document.getElementById("w24-wps-mode").value;

        target.enabled = document.getElementById("w24-ssid-enable").checked;
        target.ssid = ssidName;
        target.hidden = document.getElementById("w24-ssid-hidden").checked;
        target.auth = auth;
        target.enc = document.getElementById("w24-ssid-enc").value;
        target.key = key;

        if (st.bandSteering && idx === 1) {
          st.wifi5.ssids[0].ssid = ssidName;
          st.wifi5.ssids[0].key = key;
          st.wifi5.ssids[0].auth = auth;
        }

        window.SimEngine.reconcileClients();
        window.SimEngine.addLog(
          "[WIFI 2.4G] Đã lưu SSID" + idx + "='" + ssidName + "' (" + (target.enabled ? "Bật" : "Tắt") + ", Kênh " + w.channel + ", " + w.bandwidth + ", " + auth + ")."
        );
        window.RouterApp.applyWithFeedback(
          "Đã áp dụng cấu hình Thiết lập Wi-Fi 2.4GHz (SSID" + idx + ": " + ssidName + ")!",
          oldPrimarySsid !== w.ssids[0].ssid
        );
      });
    }
  };

  // --------------------------------------------------------------------------
  // 8. Wi-Fi -> Thiết lập Wi-Fi 5GHz (/cgi-bin/wifi-11ac.asp)
  //    Headers: ['Thiết lập điểm truy cập', 'Thiết lập SSID']
  // --------------------------------------------------------------------------
  window.RouterPages["wifi-11ac"] = {
    title: "Thiết lập điểm truy cập",
    group: "Wi-Fi",
    cgi: "/cgi-bin/wifi-11ac.asp",
    render: function () {
      const st = window.SimState;
      const w = st.wifi5;
      const curIdx = w.selectedIdx || 1;
      const curSsidObj = w.ssids.find((x) => x.idx === curIdx) || w.ssids[0];
      const channels = ["Auto", "36", "40", "44", "48", "52", "56", "60", "64", "149", "153", "157", "161"];
      const modes = ["802.11a", "802.11a/n", "802.11a/n/ac", "802.11a/n/ac/ax"];
      const bws = ["20 MHz", "40 MHz", "80 MHz", "160 MHz", "20/40/80/160 MHz"];
      const auths = ["OPEN", "WPA2-PSK", "WPA3-SAE", "WPA2-PSK/WPA3-SAE"];
      const curChanVal = w.channel === "Auto" ? w.autoCurrentChannel : w.channel;
      const wpsActive = st.device.wpsBlinkUntil && Date.now() < st.device.wpsBlinkUntil;

      return `
        <!-- Widget 1: Thiết lập điểm truy cập -->
        <div class="vht-card">
          <div class="vht-card-body">
            <table class="form-table">
              <tr>
                <th>Kích hoạt WiFi</th>
                <td>
                  <div style="display:flex;align-items:center;gap:18px;">
                    ${switchHtml("w5-enable", w.enabled)}
                    <a href="javascript:void(0)" id="w5-link-sched" style="color:#007bff;font-weight:500;">Lập lịch Wi-Fi</a>
                  </div>
                </td>
              </tr>
              <tr>
                <th>Chế độ</th>
                <td>
                  <select class="vht-select" id="w5-mode">
                    ${modes.map((m) => `<option value="${m}" ${w.mode === m ? "selected" : ""}>${m}</option>`).join("")}
                  </select>
                </td>
              </tr>
              <tr>
                <th>Kênh</th>
                <td>
                  <select class="vht-select" id="w5-channel">
                    ${channels.map((c) => `<option value="${c}" ${String(w.channel) === c ? "selected" : ""}>${c}</option>`).join("")}
                  </select>
                </td>
              </tr>
              <tr>
                <th>Kênh hiện tại</th>
                <td><strong>${esc(curChanVal)}</strong></td>
              </tr>
              <tr>
                <th>Băng thông</th>
                <td>
                  <select class="vht-select" id="w5-bw">
                    ${bws.map((b) => `<option value="${b}" ${w.bandwidth === b ? "selected" : ""}>${b}</option>`).join("")}
                  </select>
                </td>
              </tr>
              <tr>
                <th>VHT Khoảng bảo vệ</th>
                <td>
                  <select class="vht-select" id="w5-gi">
                    <option value="Auto" selected>Auto</option>
                    <option value="Short">Short</option>
                    <option value="Long">Long</option>
                  </select>
                </td>
              </tr>
            </table>

            <table class="form-table" id="w5-adv-box" style="display:${w.showAdvanced ? "table" : "none"};">
              <tr>
                <th>Công suất phát</th>
                <td>
                  <select class="vht-select" id="w5-txpower">
                    ${["100%", "75%", "50%", "25%"].map((p) => `<option value="${p}" ${w.txPower === p ? "selected" : ""}>${p}</option>`).join("")}
                  </select>
                </td>
              </tr>
              <tr>
                <th>Chu kì DTIM</th>
                <td><input type="number" class="vht-input" id="w5-dtim" value="${w.dtim}" /></td>
              </tr>
              <tr>
                <th>Chu kì gửi Beacon</th>
                <td><input type="number" class="vht-input" id="w5-beacon" value="${w.beacon}" /></td>
              </tr>
              <tr>
                <th>Ngưỡng RTS/CTS</th>
                <td><input type="number" class="vht-input" id="w5-rts" value="${w.rts}" /></td>
              </tr>
              <tr>
                <th>Ngưỡng phân mảnh</th>
                <td><input type="number" class="vht-input" id="w5-frag" value="2346" /></td>
              </tr>
            </table>
          </div>
        </div>

        <!-- Widget 2: Thiết lập SSID -->
        <div class="sec-heading">Thiết lập SSID</div>
        <div class="vht-card">
          <div class="vht-card-body">
            <table class="form-table">
              <tr>
                <th>Số thứ tự</th>
                <td>
                  <select class="vht-select" id="w5-ssid-idx">
                    ${w.ssids.map((s) => `<option value="${s.idx}" ${s.idx === curIdx ? "selected" : ""}>${s.idx}</option>`).join("")}
                  </select>
                </td>
              </tr>
              <tr>
                <th>Kích hoạt SSID</th>
                <td>${switchHtml("w5-ssid-enable", curSsidObj.enabled)}</td>
              </tr>
              <tr>
                <th>SSID</th>
                <td><input type="text" class="vht-input" id="w5-ssid-name" value="${esc(curSsidObj.ssid)}" /></td>
              </tr>
              <tr>
                <th>Ẩn SSID</th>
                <td>${switchHtml("w5-ssid-hidden", curSsidObj.hidden)}</td>
              </tr>
              <tr>
                <th>Số thiết bị kết nối</th>
                <td>
                  <input type="number" class="vht-input" id="w5-maxsta" value="${w.maxSta}" min="1" max="45" />
                  <div class="field-hint" style="margin-left:0;margin-top:4px;">(Phạm vi: 1~45)</div>
                </td>
              </tr>
              <tr>
                <th>WMM Kích hoạt</th>
                <td>${switchHtml("w5-wmm", w.wmm)}</td>
              </tr>
              <tr>
                <th>Kiểu xác thực</th>
                <td>
                  <select class="vht-select" id="w5-ssid-auth">
                    ${auths.map((a) => `<option value="${a}" ${curSsidObj.auth === a ? "selected" : ""}>${a}</option>`).join("")}
                  </select>
                </td>
              </tr>
              <tr id="w5-key-row" style="display:${curSsidObj.auth === "OPEN" ? "none" : ""};">
                <th style="vertical-align:top;">Mật khẩu</th>
                <td>
                  ${pwdInputHtml("w5-ssid-key", curSsidObj.key)}
                  <div class="field-hint" style="margin-left:0;margin-top:4px;">(8~63kí tự hoặc chuỗi 64 số hex)</div>
                </td>
              </tr>
              <tr id="w5-rekey-row" style="display:${curSsidObj.auth === "OPEN" ? "none" : ""};">
                <th>Chu kì làm mới khóa</th>
                <td><input type="number" class="vht-input" id="w5-rekey" value="3600" /></td>
              </tr>
              <tr id="w5-enc-row" style="display:${curSsidObj.auth === "OPEN" ? "none" : ""};">
                <th>Mã hóa</th>
                <td>
                  <select class="vht-select" id="w5-ssid-enc">
                    <option value="AES" selected>AES</option>
                    <option value="TKIP+AES">TKIP+AES</option>
                  </select>
                </td>
              </tr>
              <tr>
                <th>Kích hoạt WPS</th>
                <td>${switchHtml("w5-wps-en", true)}</td>
              </tr>
              <tr>
                <th>WPS Chế độ</th>
                <td>
                  <select class="vht-select" id="w5-wps-mode">
                    <option value="PBC" selected>PBC</option>
                    <option value="PIN">PIN</option>
                  </select>
                </td>
              </tr>
              <tr>
                <th>Trạng thái WPS</th>
                <td><strong>${wpsActive ? "In Progress (PBC)" : "Idle"}</strong></td>
              </tr>
            </table>
          </div>
        </div>

        <div class="btn-row center">
          <button type="button" class="btn-vht secondary" id="w5-btn-adv">NÂNG CAO</button>
          <button type="button" class="btn-vht" id="w5-btn-apply">ÁP DỤNG</button>
        </div>
      `;
    },
    bind: function () {
      bindPwdEyes();
      const st = window.SimState;
      const w = st.wifi5;

      document.getElementById("w5-link-sched").addEventListener("click", function () {
        window.RouterApp.navigate("apps-wifischeduling");
      });

      document.getElementById("w5-btn-adv").addEventListener("click", function () {
        w.showAdvanced = !w.showAdvanced;
        window.SimEngine.saveState();
        window.RouterApp.renderCurrentPage();
      });

      document.getElementById("w5-ssid-idx").addEventListener("change", function (e) {
        w.selectedIdx = parseInt(e.target.value, 10) || 1;
        window.SimEngine.saveState();
        window.RouterApp.renderCurrentPage();
      });

      const authEl = document.getElementById("w5-ssid-auth");
      authEl.addEventListener("change", function () {
        const isOpen = authEl.value === "OPEN";
        document.getElementById("w5-enc-row").style.display = isOpen ? "none" : "";
        document.getElementById("w5-key-row").style.display = isOpen ? "none" : "";
        document.getElementById("w5-rekey-row").style.display = isOpen ? "none" : "";
      });

      document.getElementById("w5-btn-apply").addEventListener("click", function () {
        const idx = w.selectedIdx || 1;
        const target = w.ssids.find((x) => x.idx === idx);
        const ssidName = document.getElementById("w5-ssid-name").value.trim();
        const auth = authEl.value;
        const key = document.getElementById("w5-ssid-key").value;
        const maxSta = parseInt(document.getElementById("w5-maxsta").value, 10);

        if (isNaN(maxSta) || maxSta < 1 || maxSta > 45) {
          return alert("Số thiết bị kết nối phải nằm trong phạm vi 1~45!");
        }
        if (!ssidName) return alert("SSID không được để trống!");
        if (auth !== "OPEN" && key.length < 8) return alert("Mật khẩu Wi-Fi phải từ 8 ký tự trở lên!");

        w.enabled = document.getElementById("w5-enable").checked;
        w.mode = document.getElementById("w5-mode").value;
        w.channel = document.getElementById("w5-channel").value;
        w.bandwidth = document.getElementById("w5-bw").value;
        w.txPower = document.getElementById("w5-txpower").value;
        w.maxSta = maxSta;
        w.dtim = parseInt(document.getElementById("w5-dtim").value, 10) || 1;
        w.beacon = parseInt(document.getElementById("w5-beacon").value, 10) || 100;
        w.wmm = document.getElementById("w5-wmm").checked;

        target.enabled = document.getElementById("w5-ssid-enable").checked;
        target.ssid = ssidName;
        target.hidden = document.getElementById("w5-ssid-hidden").checked;
        target.auth = auth;
        target.key = key;

        window.SimEngine.reconcileClients();
        window.SimEngine.addLog(
          "[WIFI 5G] Đã lưu SSIDAC" + idx + "='" + ssidName + "' (Băng thông: " + w.bandwidth + ", " + auth + ")."
        );
        window.RouterApp.applyWithFeedback("Đã áp dụng cấu hình Thiết lập Wi-Fi 5GHz (" + ssidName + ")!");
      });
    }
  };

  // --------------------------------------------------------------------------
  // 9. Wi-Fi -> Wi-Fi Mesh (/cgi-bin/wifi-mesh.asp & wifi-mesh-advanced.asp)
  //    Sub-tabs: Cơ bản | Nâng cao | Trạng thái
  // --------------------------------------------------------------------------
  window.RouterPages["wifi-mesh"] = {
    title: "",
    group: "Wi-Fi",
    cgi: "/cgi-bin/wifi-mesh.asp",
    render: function () {
      const m = window.SimState.mesh;
      const isAdv = !!m.showAdvancedPage;
      this.cgi = isAdv ? "/cgi-bin/wifi-mesh-advanced.asp" : "/cgi-bin/wifi-mesh.asp";

      return `
        <div class="vht-subtabs">
          <span class="vht-subtab ${!isAdv ? "active" : ""}" id="mesh-tab-basic">Cơ bản</span>
          <span class="vht-subtab ${isAdv ? "active" : ""}" id="mesh-tab-adv">Nâng cao</span>
          <span class="vht-subtab" id="mesh-tab-topo">Trạng thái</span>
        </div>

        ${
          !isAdv
            ? `
          <div class="vht-card">
            <div class="vht-card-body">
              <table class="form-table">
                <tr>
                  <th>EasyMesh</th>
                  <td>${switchHtml("mesh-enable", m.enabled)}</td>
                </tr>
                <tr>
                  <th>Đặt vai trò thiết bị là</th>
                  <td>
                    <select class="vht-select" id="mesh-role">
                      <option value="Controller" ${m.role === "Controller" ? "selected" : ""}>Controller</option>
                      <option value="Agent" ${m.role === "Agent" ? "selected" : ""}>Agent</option>
                    </select>
                  </td>
                </tr>
                <tr>
                  <th>Vai trò thiết bị hiện tại</th>
                  <td><strong>${esc(m.role)}</strong></td>
                </tr>
                <tr>
                  <th>Trạng thái kết nối backhaul</th>
                  <td><strong>${m.demoAgentConnected ? "Đã kết nối" : "Ngắt kết nối"}</strong></td>
                </tr>
                <tr>
                  <th>Steering</th>
                  <td>${switchHtml("mesh-steering", m.steering)}</td>
                </tr>
                <tr>
                  <th>Đặt lại cài đặt EasyMesh về mặc định</th>
                  <td>
                    <button type="button" class="btn-vht outline small" id="mesh-reset-def">Đặt lại</button>
                  </td>
                </tr>
                <tr>
                  <th style="vertical-align:top;">EasyMesh On-boarding</th>
                  <td>
                    <button type="button" class="btn-vht outline small" id="mesh-onboarding">Kích hoạt Wi-Fi On-boarding</button>
                    <div class="field-hint" style="margin-left:0;margin-top:4px;font-style:italic;">(Wi-Fi sẽ tự động chọn băng tần backhaul)</div>
                  </td>
                </tr>
              </table>

              <div class="btn-row center">
                <button type="button" class="btn-vht" id="mesh-btn-apply">ÁP DỤNG</button>
              </div>
            </div>
          </div>`
            : `
          <div class="vht-card">
            <div class="vht-card-body">
              <div class="sub-heading" style="margin-top:0;">Chuyển vùng</div>
              <table class="form-table">
                <tr>
                  <th>Ngưỡng AP chuyển vùng RSSI</th>
                  <td>
                    <input type="number" class="vht-input short" id="mesh-roam" value="${m.roamRssi}" />
                    <span class="field-hint">[-90 đến 0] (dBm)</span>
                  </td>
                </tr>
              </table>

              <div class="sub-heading">Chuyển băng tần</div>
              <table class="form-table">
                <tr>
                  <th>Chế độ chuyển băng tần</th>
                  <td>${switchHtml("mesh-band-steer", true)}</td>
                </tr>
                <tr>
                  <th>Ngưỡng RSSI chuyển băng tần từ 5G xuống 2.4G</th>
                  <td>
                    <input type="number" class="vht-input short" id="mesh-5to24" value="${m.band5To24Rssi}" />
                    <span class="field-hint">[-91 đến -50] (dBm)</span>
                  </td>
                </tr>
                <tr>
                  <th>Ngưỡng RSSI chuyển băng tần từ 2.4G lên 5G</th>
                  <td>
                    <input type="number" class="vht-input short" id="mesh-24to5" value="${m.band24To5Rssi}" />
                    <span class="field-hint">[-91 đến -50] (dBm)</span>
                  </td>
                </tr>
              </table>

              <div class="sub-heading">Cân bằng tải</div>
              <table class="form-table">
                <tr>
                  <th>Độ hữu dụng của kênh 2.4G</th>
                  <td>
                    <input type="number" class="vht-input short" id="mesh-cu24" value="${m.chanUtil24}" />
                    <span class="field-hint">(0~100%)</span>
                  </td>
                </tr>
                <tr>
                  <th>Độ hữu dụng của kênh 5G</th>
                  <td>
                    <input type="number" class="vht-input short" id="mesh-cu5" value="${m.chanUtil5}" />
                    <span class="field-hint">(0~100%)</span>
                  </td>
                </tr>
              </table>

              <div class="btn-row center">
                <button type="button" class="btn-vht" id="mesh-adv-apply">ÁP DỤNG</button>
              </div>
            </div>
          </div>`
        }
      `;
    },
    bind: function () {
      const m = window.SimState.mesh;

      document.getElementById("mesh-tab-basic").addEventListener("click", function () {
        m.showAdvancedPage = false;
        window.SimEngine.saveState();
        window.RouterApp.renderCurrentPage();
      });

      document.getElementById("mesh-tab-adv").addEventListener("click", function () {
        m.showAdvancedPage = true;
        window.SimEngine.saveState();
        window.RouterApp.renderCurrentPage();
      });

      document.getElementById("mesh-tab-topo").addEventListener("click", function () {
        window.RouterApp.navigate("wifi-mesh-topology");
      });

      if (!m.showAdvancedPage) {
        document.getElementById("mesh-reset-def").addEventListener("click", function () {
          m.enabled = true;
          m.role = "Controller";
          m.steering = true;
          window.SimEngine.saveState();
          window.RouterApp.showToast("Đã đặt lại cài đặt EasyMesh về mặc định!");
          window.RouterApp.renderCurrentPage();
        });

        document.getElementById("mesh-onboarding").addEventListener("click", function () {
          window.SimState.device.wpsBlinkUntil = Date.now() + 120000;
          m.demoAgentConnected = true;
          window.SimEngine.addLog("[EASYMESH] Kích hoạt Wi-Fi On-boarding — Đã ghép nối Node Agent.");
          window.RouterApp.showToast("Đã kích hoạt Wi-Fi On-boarding (Đèn WPS chớp xanh)!");
          window.RouterApp.renderCurrentPage();
          window.LabUI.render();
        });

        document.getElementById("mesh-btn-apply").addEventListener("click", function () {
          m.enabled = document.getElementById("mesh-enable").checked;
          m.role = document.getElementById("mesh-role").value;
          m.steering = document.getElementById("mesh-steering").checked;
          window.SimEngine.addLog("[EASYMESH] Cập nhật vai trò: " + m.role + " (EasyMesh: " + (m.enabled ? "Bật" : "Tắt") + ").");
          window.RouterApp.applyWithFeedback("Đã lưu cấu hình Wi-Fi Mesh!");
        });
      } else {
        document.getElementById("mesh-adv-apply").addEventListener("click", function () {
          m.roamRssi = parseInt(document.getElementById("mesh-roam").value, 10) || -70;
          m.band5To24Rssi = parseInt(document.getElementById("mesh-5to24").value, 10) || -82;
          m.band24To5Rssi = parseInt(document.getElementById("mesh-24to5").value, 10) || -65;
          m.chanUtil24 = parseInt(document.getElementById("mesh-cu24").value, 10) || 80;
          m.chanUtil5 = parseInt(document.getElementById("mesh-cu5").value, 10) || 80;
          window.SimEngine.addLog("[EASYMESH ADV] Cập nhật ngưỡng RSSI chuyển vùng & chuyển băng tần.");
          window.RouterApp.applyWithFeedback("Đã lưu cấu hình Wi-Fi Mesh Nâng cao!");
        });
      }
    }
  };

  // --------------------------------------------------------------------------
  // 10. An ninh -> Tường lửa (/cgi-bin/fw-spi.asp)
  //     Header: ['Tường lửa']
  // --------------------------------------------------------------------------
  window.RouterPages["fw-spi"] = {
    title: "Tường lửa",
    group: "An ninh",
    cgi: "/cgi-bin/fw-spi.asp",
    render: function () {
      const sec = window.SimState.security;
      return `
        <div class="vht-card">
          <div class="vht-card-body">
            <table class="form-table">
              <tr>
                <th>Kích hoạt</th>
                <td>${switchHtml("spi-enable", sec.spiEnabled)}</td>
              </tr>
              <tr>
                <th>Mức độ bảo vệ</th>
                <td>
                  <select class="vht-select" id="spi-level">
                    <option value="Thấp" ${sec.spiLevel === "Thấp" ? "selected" : ""}>Thấp</option>
                    <option value="Trung bình" ${sec.spiLevel === "Trung bình" ? "selected" : ""}>Trung bình</option>
                    <option value="Cao" ${sec.spiLevel === "Cao" ? "selected" : ""}>Cao</option>
                  </select>
                </td>
              </tr>
            </table>
            <div class="btn-row center">
              <button type="button" class="btn-vht" id="spi-btn-apply">ÁP DỤNG</button>
            </div>
          </div>
        </div>
      `;
    },
    bind: function () {
      document.getElementById("spi-btn-apply").addEventListener("click", function () {
        const sec = window.SimState.security;
        sec.spiEnabled = document.getElementById("spi-enable").checked;
        sec.spiLevel = document.getElementById("spi-level").value;
        window.SimEngine.addLog(
          "[FIREWALL] Tường lửa: " + (sec.spiEnabled ? "Kích hoạt" : "Tắt") + " — Mức độ bảo vệ: " + sec.spiLevel + "."
        );
        window.RouterApp.applyWithFeedback("Đã áp dụng cấu hình Tường lửa (Mức: " + sec.spiLevel + ")!");
      });
    }
  };

  // --------------------------------------------------------------------------
  // 11. An ninh -> Kiểm soát con cái (/cgi-bin/fw-parentalcontrol.asp)
  //     Header: ['Kiểm soát con cái']
  //     REPRODUCES EXACT FIRMWARE V1302250508 JAVASCRIPT TRAPS #1 & #2!
  // --------------------------------------------------------------------------
  window.RouterPages["fw-parentalcontrol"] = {
    title: "Kiểm soát con cái",
    group: "An ninh",
    cgi: "/cgi-bin/fw-parentalcontrol.asp",
    editorOpen: false,
    editingId: null,
    draft: null,
    openNewDraft: function () {
      this.editorOpen = true;
      this.editingId = null;
      this.draft = {
        name: "Chan_Dien_Thoai",
        enabled: true,
        mac: "",
        policy: "Allow",
        blockUrl: "",
        schedules: []
      };
    },
    openEditDraft: function (rule) {
      this.editorOpen = true;
      this.editingId = rule.id;
      this.draft = JSON.parse(JSON.stringify(rule));
    },
    render: function () {
      const rules = window.SimState.security.parentalRules;
      const d = this.draft;
      const allDays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

      return `
        <div class="vht-card">
          <div class="vht-card-body">
            <table class="simple-table table-bordered-radius" style="width:100%;">
              <thead>
                <tr>
                  <th style="width:42px;"><input type="checkbox" id="pc-chk-all" /></th>
                  <th>Tên luật</th>
                  <th>Địa chỉ MAC</th>
                  <th>Quyền truy cập</th>
                  <th>URL</th>
                  <th>Lịch trình</th>
                  <th>Trạng thái</th>
                  <th>Chỉnh sửa</th>
                </tr>
              </thead>
              <tbody>
                ${
                  rules.length === 0
                    ? `<tr><td>&nbsp;</td><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr>`
                    : rules
                        .map(
                          (r) => `
                  <tr>
                    <td><input type="checkbox" class="pc-row-chk" value="${r.id}" /></td>
                    <td>${esc(r.name)}</td>
                    <td>${esc(r.mac)}</td>
                    <td>${esc(r.policy)}</td>
                    <td>${r.policy === "Allow" ? esc(r.blockUrl || "None") : "N/A"}</td>
                    <td>${r.policy === "Allow" ? (r.schedules || []).length : 0}</td>
                    <td>${r.enabled ? "Enabled" : "Disabled"}</td>
                    <td>
                      <button type="button" class="btn-icon pc-edit-btn" data-id="${r.id}" title="Edit">✏️</button>
                    </td>
                  </tr>`
                        )
                        .join("")
                }
              </tbody>
            </table>

            ${
              this.editorOpen && d
                ? `
              <div style="margin-top:20px;padding-top:16px;border-top:1px solid #e2e8f0;">
                <table class="form-table">
                  <tr>
                    <th>Name</th>
                    <td><input type="text" class="vht-input" id="pc-f-name" value="${esc(d.name)}" /></td>
                  </tr>
                  <tr>
                    <th>Enable</th>
                    <td>${switchHtml("pc-f-enable", d.enabled)}</td>
                  </tr>
                  <tr>
                    <th>MAC Address</th>
                    <td>
                      <input type="text" class="vht-input" id="pc-f-mac" value="${esc(d.mac)}" placeholder="a4:83:e7:12:34:56" />
                    </td>
                  </tr>
                  <tr id="pc-url-row" style="display:${d.policy === "Allow" ? "" : "none"};">
                    <th>Block URL</th>
                    <td>
                      <input type="text" class="vht-input" id="pc-f-url" value="${esc(d.blockUrl)}" placeholder="dantri.com.vn" />
                    </td>
                  </tr>
                  <tr>
                    <th>Access Policy</th>
                    <td>
                      <select class="vht-select" id="pc-f-policy">
                        <option value="Allow" ${d.policy === "Allow" ? "selected" : ""}>Allow</option>
                        <option value="Deny" ${d.policy === "Deny" ? "selected" : ""}>Deny</option>
                      </select>
                    </td>
                  </tr>
                </table>

                <div id="pc-allow-extra" style="display:${d.policy === "Allow" ? "block" : "none"};margin-top:14px;">
                  <div style="margin-bottom:8px;color:#4b5563;font-size:13px;">Schedules</div>
                  <table class="simple-table table-bordered-radius" style="width:100%;">
                    <thead>
                      <tr>
                        <th style="width:85px;">Số thứ tự</th>
                        <th>Ngày</th>
                        <th>Thời gian bắt đầu</th>
                        <th>Thời gian kết thúc</th>
                        <th>Kích hoạt</th>
                        <th style="width:80px;">Thao Tác</th>
                      </tr>
                    </thead>
                    <tbody>
                      ${(d.schedules || [])
                        .map(
                          (s, si) => `
                        <tr>
                          <td>${si + 1}</td>
                          <td>${esc(s.days.join(", "))}</td>
                          <td>${esc(s.start)}</td>
                          <td>${esc(s.end)}</td>
                          <td>${s.enabled ? "Yes" : "No"}</td>
                          <td>
                            <button type="button" class="btn-icon pc-sch-del" data-sidx="${si}" style="color:#a30000;font-weight:800;">✖</button>
                          </td>
                        </tr>`
                        )
                        .join("")}
                      <tr>
                        <td></td>
                        <td>
                          <div class="check-grid" style="justify-content:center;">
                            ${allDays
                              .map((day) => `<label class="check-item"><input type="checkbox" class="pc-sch-day" value="${day}" checked /> ${day}</label>`)
                              .join("")}
                          </div>
                        </td>
                        <td><input type="text" class="vht-input short" id="pc-sch-start" value="07:00" placeholder="hh:mm" style="width:80px;text-align:center;" /></td>
                        <td><input type="text" class="vht-input short" id="pc-sch-end" value="23:00" placeholder="hh:mm" style="width:80px;text-align:center;" /></td>
                        <td>${switchHtml("pc-sch-en", true)}</td>
                        <td>
                          <button type="button" class="btn-plus" id="pc-sch-add" title="Thêm lịch trình">+</button>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <div class="btn-row center">
                  <button type="button" class="btn-vht" id="pc-btn-save">ÁP DỤNG</button>
                  <button type="button" class="btn-vht secondary" id="pc-editor-cancel">HỦY</button>
                </div>
              </div>`
                : ""
            }

            <div class="btn-row" style="justify-content:flex-end;margin-top:16px;">
              <button type="button" class="btn-vht" id="pc-btn-new">THÊM</button>
              <button type="button" class="btn-vht" id="pc-btn-del-selected">XÓA</button>
            </div>
          </div>
        </div>
      `;
    },
    bind: function () {
      const self = this;
      const rules = window.SimState.security.parentalRules;

      document.getElementById("pc-btn-new").addEventListener("click", function () {
        if (rules.length >= 10) return alert("Tối đa 10 luật");
        self.openNewDraft();
        window.RouterApp.renderCurrentPage();
      });

      const chkAll = document.getElementById("pc-chk-all");
      if (chkAll) {
        chkAll.addEventListener("change", function () {
          document.querySelectorAll(".pc-row-chk").forEach((c) => (c.checked = chkAll.checked));
        });
      }

      document.getElementById("pc-btn-del-selected").addEventListener("click", function () {
        const ids = Array.from(document.querySelectorAll(".pc-row-chk:checked")).map((c) => c.value);
        if (ids.length === 0) return alert("Vui lòng tích chọn ít nhất 1 luật để xóa!");
        window.SimState.security.parentalRules = rules.filter((r) => !ids.includes(String(r.id)));
        self.editorOpen = false;
        window.SimEngine.addLog("[PARENTAL CONTROL] Đã xóa " + ids.length + " luật kiểm soát truy cập.");
        window.RouterApp.applyWithFeedback("Đã xóa luật đã chọn!");
      });

      document.querySelectorAll(".pc-edit-btn").forEach(function (btn) {
        btn.addEventListener("click", function () {
          const id = btn.getAttribute("data-id");
          const found = rules.find((r) => String(r.id) === String(id));
          if (found) {
            self.openEditDraft(found);
            window.RouterApp.renderCurrentPage();
          }
        });
      });

      if (!self.editorOpen || !self.draft) return;

      function syncDraftInputs() {
        self.draft.enabled = document.getElementById("pc-f-enable").checked;
        self.draft.name = document.getElementById("pc-f-name").value.trim();
        self.draft.mac = document.getElementById("pc-f-mac").value.trim();
        self.draft.policy = document.getElementById("pc-f-policy").value;
        const urlEl = document.getElementById("pc-f-url");
        if (urlEl) self.draft.blockUrl = urlEl.value.trim();
      }

      document.getElementById("pc-editor-cancel").addEventListener("click", function () {
        self.editorOpen = false;
        window.RouterApp.renderCurrentPage();
      });

      document.getElementById("pc-f-policy").addEventListener("change", function () {
        syncDraftInputs();
        window.RouterApp.renderCurrentPage();
      });

      const addSchBtn = document.getElementById("pc-sch-add");
      if (addSchBtn) {
        addSchBtn.addEventListener("click", function () {
          syncDraftInputs();
          const days = Array.from(document.querySelectorAll(".pc-sch-day:checked")).map((c) => c.value);
          if (days.length === 0) return alert("Day cannot be empty!");
          const start = document.getElementById("pc-sch-start").value.trim() || "07:00";
          const end = document.getElementById("pc-sch-end").value.trim() || "23:00";
          const en = document.getElementById("pc-sch-en").checked;
          self.draft.schedules.push({ days: days, start: start, end: end, enabled: en });
          window.RouterApp.renderCurrentPage();
        });
      }

      document.querySelectorAll(".pc-sch-del").forEach(function (btn) {
        btn.addEventListener("click", function () {
          syncDraftInputs();
          const si = parseInt(btn.getAttribute("data-sidx"), 10);
          self.draft.schedules.splice(si, 1);
          window.RouterApp.renderCurrentPage();
        });
      });

      document.getElementById("pc-btn-save").addEventListener("click", function () {
        syncDraftInputs();
        const d = self.draft;
        if (!d.name) return alert("Name không được để trống!");

        // FIRMWARE V1302250508 TRAP #1: Strict colon-separated 17-char MAC check (doMACcheck in fw-parentalcontrol.asp)
        const macColonRegex = /^([0-9A-Fa-f]{2}:){5}[0-9A-Fa-f]{2}$/;
        if (!macColonRegex.test(d.mac)) {
          return alert("Địa chỉ MAC không hợp lệ");
        }

        // FIRMWARE V1302250508 TRAP #2: Allow requires >=1 row pushed via [+] into Schedules, and valid domain URL
        if (d.policy === "Allow") {
          if (!d.schedules || d.schedules.length === 0) {
            return alert("Lịch trình không được để rỗng!");
          }
          if (d.blockUrl && d.blockUrl !== "None" && /^https?:\/\//i.test(d.blockUrl)) {
            return alert("Địa chỉ URL không hợp lệ");
          }
        }

        d.mac = d.mac.toLowerCase();
        if (self.editingId) {
          const idx = rules.findIndex((r) => String(r.id) === String(self.editingId));
          if (idx !== -1) rules[idx] = d;
        } else {
          d.id = Date.now();
          rules.push(d);
        }

        self.editorOpen = false;
        window.SimEngine.addLog(
          "[PARENTAL CONTROL] Đã áp dụng luật '" +
            d.name +
            "' cho MAC " +
            d.mac +
            " (Policy: " +
            d.policy +
            (d.policy === "Allow" && d.blockUrl ? ", Block URL: " + d.blockUrl : "") +
            ")."
        );
        window.RouterApp.applyWithFeedback("Đã lưu luật Kiểm soát con cái (" + d.policy + ")!");
      });
    }
  };
})();
