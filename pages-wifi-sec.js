/* ==========================================================================
   pages-wifi-sec.js — Renderers & Handlers for Wi-Fi (3 pages) & An ninh (2 pages)
   Includes Exact Firmware V1302250508 Validation Traps for Practice!
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

  // --------------------------------------------------------------------------
  // 7. Wi-Fi -> Thiết lập Wi-Fi 2.4GHz (/cgi-bin/wifi.asp)
  // --------------------------------------------------------------------------
  window.RouterPages["wifi"] = {
    title: "Thiết lập Wi-Fi 2.4GHz",
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
        "WPA2-PSK/WPA3-SAE",
        "802.1X RADIUS"
      ];

      return `
        ${
          st.bandSteering
            ? `<div class="vht-notice warn"><strong>Lưu ý:</strong> Tính năng <strong>Chuyển băng tự động (Band Steering)</strong> đang Bật tại mục <em>Cài đặt nhanh</em>. Để đặt tên riêng cho 2.4GHz và 5GHz, hãy tắt Chuyển băng tự động ở trang Cài đặt nhanh.</div>`
            : ""
        }

        <div class="vht-card">
          <div class="vht-card-header">
            <span>1. Thông số sóng vô tuyến 2.4GHz</span>
            <button type="button" class="btn-vht secondary small" id="w24-btn-adv">
              ${w.showAdvanced ? "ẨN NÂNG CAO ▲" : "NÂNG CAO ▼"}
            </button>
          </div>
          <div class="vht-card-body">
            <table class="form-table">
              <tr>
                <th>Kích hoạt Wi-Fi 2.4GHz:</th>
                <td><label class="check-item"><input type="checkbox" id="w24-enable" ${w.enabled ? "checked" : ""} /> <strong>Bật bộ phát sóng 2.4GHz</strong></label></td>
              </tr>
              <tr>
                <th>Chế độ (Chuẩn phát sóng):</th>
                <td>
                  <select class="vht-select" id="w24-mode">
                    ${modes.map((m) => `<option value="${m}" ${w.mode === m ? "selected" : ""}>${m}${m.includes("ax") ? " (Wi-Fi 6)" : ""}</option>`).join("")}
                  </select>
                </td>
              </tr>
              <tr>
                <th>Quốc gia (Country):</th>
                <td>
                  <select class="vht-select" id="w24-country">
                    <option value="VIETNAM" selected>VIETNAM (Kênh 1 – 13)</option>
                  </select>
                </td>
              </tr>
              <tr>
                <th>Kênh (Channel):</th>
                <td>
                  <select class="vht-select" id="w24-channel">
                    ${channels
                      .map((c) => {
                        const label =
                          c === "Auto"
                            ? "Auto (Hiện tại: Kênh " + w.autoCurrentChannel + ")"
                            : c === "1" || c === "6" || c === "11"
                            ? "Kênh " + c + " (Không chồng lấn ★)"
                            : "Kênh " + c;
                        return `<option value="${c}" ${String(w.channel) === c ? "selected" : ""}>${label}</option>`;
                      })
                      .join("")}
                  </select>
                </td>
              </tr>
              <tr>
                <th>Băng thông kênh (Bandwidth):</th>
                <td>
                  <select class="vht-select" id="w24-bw">
                    <option value="20 MHz" ${w.bandwidth === "20 MHz" ? "selected" : ""}>20 MHz (Ổn định, chống nhiễu tối ưu)</option>
                    <option value="40 MHz" ${w.bandwidth === "40 MHz" ? "selected" : ""}>40 MHz</option>
                    <option value="20/40 MHz" ${w.bandwidth === "20/40 MHz" ? "selected" : ""}>20/40 MHz (Tự động co giãn)</option>
                  </select>
                </td>
              </tr>
              <tr>
                <th>Khoảng bảo vệ (Guard Interval):</th>
                <td>
                  <select class="vht-select" id="w24-gi">
                    <option value="Auto" ${w.guardInterval === "Auto" ? "selected" : ""}>Auto</option>
                    <option value="Short" ${w.guardInterval === "Short" ? "selected" : ""}>Short</option>
                    <option value="Long" ${w.guardInterval === "Long" ? "selected" : ""}>Long</option>
                  </select>
                </td>
              </tr>
            </table>

            <div id="w24-adv-box" style="display:${w.showAdvanced ? "block" : "none"};margin-top:12px;padding-top:12px;border-top:1px dashed #cbd5e1;">
              <div style="font-size:12px;font-weight:700;color:#ee0033;margin-bottom:8px;">⚙️ THÔNG SỐ NÂNG CAO (RF &amp; MAC LAYER)</div>
              <table class="form-table">
                <tr>
                  <th>Công suất phát (Tx Power):</th>
                  <td>
                    <select class="vht-select" id="w24-txpower">
                      ${["100%", "75%", "50%", "25%"].map((p) => `<option value="${p}" ${w.txPower === p ? "selected" : ""}>${p}</option>`).join("")}
                    </select>
                  </td>
                </tr>
                <tr>
                  <th>Số thiết bị kết nối tối đa:</th>
                  <td>
                    <input type="number" class="vht-input short" id="w24-maxsta" value="${w.maxSta}" min="1" max="45" />
                    <span class="field-hint">(Cho phép 1 – 45 máy trên mỗi SSID)</span>
                  </td>
                </tr>
                <tr>
                  <th>Chu kì DTIM / Beacon Interval:</th>
                  <td>
                    DTIM: <input type="number" class="vht-input short" id="w24-dtim" value="${w.dtim}" style="width:75px;min-width:75px;" />
                    &nbsp; Beacon: <input type="number" class="vht-input short" id="w24-beacon" value="${w.beacon}" style="width:85px;min-width:85px;" /> ms
                    <span class="field-hint">(Khuyến nghị giữ mặc định)</span>
                  </td>
                </tr>
                <tr>
                  <th>Ngưỡng RTS/CTS &amp; Phân mảnh:</th>
                  <td>
                    RTS/CTS: <input type="number" class="vht-input short" id="w24-rts" value="${w.rts}" style="width:85px;min-width:85px;" />
                    &nbsp; Fragmentation: <input type="number" class="vht-input short" id="w24-frag" value="${w.frag}" style="width:85px;min-width:85px;" />
                  </td>
                </tr>
                <tr>
                  <th>WMM (Wi-Fi Multimedia QoS):</th>
                  <td><label class="check-item"><input type="checkbox" id="w24-wmm" ${w.wmm ? "checked" : ""} /> Kích hoạt WMM</label></td>
                </tr>
              </table>
            </div>
          </div>
        </div>

        <div class="vht-card">
          <div class="vht-card-header">2. Định danh mạng (Multi-SSID 1..4) &amp; Bảo mật không dây</div>
          <div class="vht-card-body">
            <table class="form-table">
              <tr>
                <th>Số thứ tự (Multi-SSID):</th>
                <td>
                  <select class="vht-select" id="w24-ssid-idx">
                    ${w.ssids
                      .map(
                        (s) =>
                          `<option value="${s.idx}" ${s.idx === curIdx ? "selected" : ""}>${s.idx} (SSID${s.idx} — ${s.enabled ? "Đang Bật: " + esc(s.ssid) : "Đang Tắt"}${s.idx === 2 ? " / Mạng Khách" : ""})</option>`
                      )
                      .join("")}
                  </select>
                </td>
              </tr>
              <tr>
                <th>Kích hoạt SSID${curIdx}:</th>
                <td>
                  <label class="check-item">
                    <input type="checkbox" id="w24-ssid-enable" ${curSsidObj.enabled ? "checked" : ""} ${curIdx === 1 ? "" : ""} />
                    <strong>Kích hoạt phát sóng SSID${curIdx}</strong>
                  </label>
                </td>
              </tr>
              <tr>
                <th>Tên mạng Wi-Fi (SSID):</th>
                <td>
                  <input type="text" class="vht-input" id="w24-ssid-name" value="${esc(curSsidObj.ssid)}" />
                  <button type="button" class="btn-icon" id="w24-fill-group">
                    ⚡ Điền mã nhóm (${esc(curIdx === 1 ? st.coach.groupSsid : st.coach.groupSsid + "_Guest")})
                  </button>
                </td>
              </tr>
              <tr>
                <th>Ẩn SSID (Hidden Network):</th>
                <td>
                  <label class="check-item">
                    <input type="checkbox" id="w24-ssid-hidden" ${curSsidObj.hidden ? "checked" : ""} />
                    Ẩn tên mạng (Không quảng bá Beacon SSID ra ngoài)
                  </label>
                </td>
              </tr>
              <tr>
                <th>Kiểu xác thực (Authentication):</th>
                <td>
                  <select class="vht-select" id="w24-ssid-auth">
                    ${auths.map((a) => `<option value="${a}" ${curSsidObj.auth === a ? "selected" : ""}>${a}</option>`).join("")}
                  </select>
                </td>
              </tr>
              <tr id="w24-enc-row" style="display:${curSsidObj.auth === "OPEN" ? "none" : ""};">
                <th>Chuẩn mã hóa (Encryption):</th>
                <td>
                  <select class="vht-select" id="w24-ssid-enc">
                    <option value="AES" ${curSsidObj.enc === "AES" ? "selected" : ""}>AES (CCMP - Chuẩn tốc độ cao &amp; an toàn)</option>
                    <option value="TKIP" ${curSsidObj.enc === "TKIP" ? "selected" : ""}>TKIP (Chuẩn cũ, giới hạn tốc độ)</option>
                    <option value="TKIP+AES" ${curSsidObj.enc === "TKIP+AES" ? "selected" : ""}>TKIP+AES</option>
                  </select>
                </td>
              </tr>
              <tr id="w24-key-row" style="display:${curSsidObj.auth === "OPEN" ? "none" : ""};">
                <th>Mật khẩu Wi-Fi (Pre-Shared Key):</th>
                <td>
                  <input type="text" class="vht-input" id="w24-ssid-key" value="${esc(curSsidObj.key)}" />
                  <span class="field-hint">(8 – 63 ký tự)</span>
                </td>
              </tr>
            </table>
          </div>
        </div>

        <div class="vht-card">
          <div class="vht-card-header">3. Cấu hình WPS (Wi-Fi Protected Setup)</div>
          <div class="vht-card-body">
            <table class="form-table">
              <tr>
                <th>Kích hoạt WPS:</th>
                <td><label class="check-item"><input type="checkbox" id="w24-wps-en" ${w.wpsEnabled ? "checked" : ""} /> Bật WPS</label></td>
              </tr>
              <tr>
                <th>Chế độ WPS:</th>
                <td>
                  <select class="vht-select" id="w24-wps-mode">
                    <option value="PBC" ${w.wpsMode === "PBC" ? "selected" : ""}>PBC (Push Button Configuration - Nút bấm vật lý)</option>
                    <option value="PIN" ${w.wpsMode === "PIN" ? "selected" : ""}>PIN (Mã PIN 8 chữ số: ${esc(w.wpsPin)} - Nên tắt để an toàn)</option>
                  </select>
                  &nbsp;
                  <button type="button" class="btn-vht outline small" id="w24-wps-trigger">MỞ PHIÊN GHÉP NỐI WPS (2 PHÚT)</button>
                </td>
              </tr>
            </table>
            <div class="btn-row">
              <button class="btn-vht" id="w24-btn-apply">ÁP DỤNG</button>
            </div>
          </div>
        </div>
      `;
    },
    bind: function () {
      const st = window.SimState;
      const w = st.wifi24;

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

      document.getElementById("w24-fill-group").addEventListener("click", function () {
        const idx = w.selectedIdx || 1;
        const grp = st.coach.groupSsid || "24CLC01-N01";
        document.getElementById("w24-ssid-name").value = idx === 1 ? grp : idx === 2 ? grp + "_Guest" : grp + "_SSID" + idx;
        document.getElementById("w24-ssid-enable").checked = true;
      });

      const authEl = document.getElementById("w24-ssid-auth");
      authEl.addEventListener("change", function () {
        const isOpen = authEl.value === "OPEN";
        document.getElementById("w24-enc-row").style.display = isOpen ? "none" : "";
        document.getElementById("w24-key-row").style.display = isOpen ? "none" : "";
      });

      document.getElementById("w24-wps-trigger").addEventListener("click", function () {
        st.device.wpsBlinkUntil = Date.now() + 120000;
        window.SimEngine.addLog("[WPS] Đã mở cửa sổ ghép nối WPS PBC trong 2 phút (Đèn WPS nhấp nháy).");
        window.RouterApp.showToast("Đèn WPS đang nhấp nháy mở phiên ghép nối nhanh trong 2 phút!");
        window.LabUI.render();
      });

      document.getElementById("w24-btn-apply").addEventListener("click", function () {
        const idx = w.selectedIdx || 1;
        const target = w.ssids.find((x) => x.idx === idx);
        const oldPrimarySsid = w.ssids[0].ssid;

        const maxSta = parseInt(document.getElementById("w24-maxsta").value, 10);
        if (isNaN(maxSta) || maxSta < 1 || maxSta > 45) {
          return alert("Số thiết bị kết nối tối đa phải từ 1 đến 45!");
        }
        const ssidName = document.getElementById("w24-ssid-name").value.trim();
        const auth = authEl.value;
        const key = document.getElementById("w24-ssid-key").value;

        if (!ssidName) return alert("Tên mạng SSID không được để trống!");
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
          "Đã áp dụng cấu hình Wi-Fi 2.4GHz (SSID" + idx + ": " + ssidName + ")!",
          oldPrimarySsid !== w.ssids[0].ssid
        );
      });
    }
  };

  // --------------------------------------------------------------------------
  // 8. Wi-Fi -> Thiết lập Wi-Fi 5GHz (/cgi-bin/wifi-11ac.asp)
  // --------------------------------------------------------------------------
  window.RouterPages["wifi-11ac"] = {
    title: "Thiết lập Wi-Fi 5GHz",
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
      const auths = ["OPEN", "WPA2-PSK", "WPA3-SAE", "WPA2-PSK/WPA3-SAE", "802.1X RADIUS"];

      return `
        ${
          st.bandSteering
            ? `<div class="vht-notice warn"><strong>Lưu ý:</strong> <strong>Chuyển băng tự động (Band Steering)</strong> đang Bật nên SSIDAC1 tự đồng bộ theo băng tần 2.4GHz. Hãy tắt Chuyển băng tự động tại <em>Cài đặt nhanh</em> nếu muốn đặt tên <code>_5G</code> riêng.</div>`
            : ""
        }

        <div class="vht-card">
          <div class="vht-card-header">
            <span>1. Thông số sóng vô tuyến 5GHz (Wi-Fi 6 AX3000 — Hỗ trợ kênh siêu rộng 160 MHz)</span>
            <button type="button" class="btn-vht secondary small" id="w5-btn-adv">
              ${w.showAdvanced ? "ẨN NÂNG CAO ▲" : "NÂNG CAO ▼"}
            </button>
          </div>
          <div class="vht-card-body">
            <table class="form-table">
              <tr>
                <th>Kích hoạt Wi-Fi 5GHz:</th>
                <td><label class="check-item"><input type="checkbox" id="w5-enable" ${w.enabled ? "checked" : ""} /> <strong>Bật bộ phát sóng 5GHz</strong></label></td>
              </tr>
              <tr>
                <th>Chế độ (Chuẩn phát sóng):</th>
                <td>
                  <select class="vht-select" id="w5-mode">
                    ${modes.map((m) => `<option value="${m}" ${w.mode === m ? "selected" : ""}>${m}${m.includes("ax") ? " (Wi-Fi 6)" : m.includes("ac") ? " (Wi-Fi 5)" : ""}</option>`).join("")}
                  </select>
                </td>
              </tr>
              <tr>
                <th>Quốc gia:</th>
                <td><select class="vht-select"><option selected>VIETNAM</option></select></td>
              </tr>
              <tr>
                <th>Kênh (Channel 5GHz):</th>
                <td>
                  <select class="vht-select" id="w5-channel">
                    ${channels
                      .map((c) => `<option value="${c}" ${String(w.channel) === c ? "selected" : ""}>${c === "Auto" ? "Auto (Hiện tại: Kênh " + w.autoCurrentChannel + ")" : "Kênh " + c}</option>`)
                      .join("")}
                  </select>
                </td>
              </tr>
              <tr>
                <th>Băng thông kênh (VHT/HE Bandwidth):</th>
                <td>
                  <select class="vht-select" id="w5-bw">
                    ${bws
                      .map(
                        (b) =>
                          `<option value="${b}" ${w.bandwidth === b ? "selected" : ""}>${b}${b.includes("160") ? " (Tốc độ Wi-Fi 6 Gigabit 2402 Mbps ★)" : b === "80 MHz" ? " (Chuẩn Wi-Fi 5)" : ""}</option>`
                      )
                      .join("")}
                  </select>
                </td>
              </tr>
            </table>

            <div id="w5-adv-box" style="display:${w.showAdvanced ? "block" : "none"};margin-top:12px;padding-top:12px;border-top:1px dashed #cbd5e1;">
              <div style="font-size:12px;font-weight:700;color:#ee0033;margin-bottom:8px;">⚙️ THÔNG SỐ NÂNG CAO 5GHz</div>
              <table class="form-table">
                <tr>
                  <th>Công suất phát:</th>
                  <td>
                    <select class="vht-select" id="w5-txpower">
                      ${["100%", "75%", "50%", "25%"].map((p) => `<option value="${p}" ${w.txPower === p ? "selected" : ""}>${p}</option>`).join("")}
                    </select>
                  </td>
                </tr>
                <tr>
                  <th>Số thiết bị kết nối tối đa:</th>
                  <td><input type="number" class="vht-input short" id="w5-maxsta" value="${w.maxSta}" min="1" max="45" /> <span class="field-hint">(1 – 45 thiết bị)</span></td>
                </tr>
                <tr>
                  <th>Chu kì DTIM / Beacon / RTS:</th>
                  <td>
                    DTIM: <input type="number" class="vht-input short" id="w5-dtim" value="${w.dtim}" style="width:75px;min-width:75px;" />
                    &nbsp; Beacon: <input type="number" class="vht-input short" id="w5-beacon" value="${w.beacon}" style="width:85px;min-width:85px;" /> ms
                    &nbsp; WMM: <input type="checkbox" id="w5-wmm" ${w.wmm ? "checked" : ""} />
                  </td>
                </tr>
              </table>
            </div>
          </div>
        </div>

        <div class="vht-card">
          <div class="vht-card-header">2. Định danh mạng 5GHz (Multi-SSID: SSIDAC1..SSIDAC3) &amp; Bảo mật</div>
          <div class="vht-card-body">
            <table class="form-table">
              <tr>
                <th>Số thứ tự (5GHz SSID):</th>
                <td>
                  <select class="vht-select" id="w5-ssid-idx">
                    ${w.ssids
                      .map((s) => `<option value="${s.idx}" ${s.idx === curIdx ? "selected" : ""}>${s.idx} (SSIDAC${s.idx} — ${s.enabled ? "Đang Bật: " + esc(s.ssid) : "Đang Tắt"})</option>`)
                      .join("")}
                  </select>
                </td>
              </tr>
              <tr>
                <th>Kích hoạt SSIDAC${curIdx}:</th>
                <td><label class="check-item"><input type="checkbox" id="w5-ssid-enable" ${curSsidObj.enabled ? "checked" : ""} /> <strong>Kích hoạt phát sóng SSIDAC${curIdx}</strong></label></td>
              </tr>
              <tr>
                <th>Tên mạng Wi-Fi 5GHz (SSID):</th>
                <td>
                  <input type="text" class="vht-input" id="w5-ssid-name" value="${esc(curSsidObj.ssid)}" />
                  <button type="button" class="btn-icon" id="w5-fill-group">
                    ⚡ Điền mã nhóm (${esc(st.coach.groupSsid + "_5G")})
                  </button>
                </td>
              </tr>
              <tr>
                <th>Ẩn SSID:</th>
                <td><label class="check-item"><input type="checkbox" id="w5-ssid-hidden" ${curSsidObj.hidden ? "checked" : ""} /> Ẩn tên mạng 5GHz</label></td>
              </tr>
              <tr>
                <th>Kiểu xác thực:</th>
                <td>
                  <select class="vht-select" id="w5-ssid-auth">
                    ${auths.map((a) => `<option value="${a}" ${curSsidObj.auth === a ? "selected" : ""}>${a}</option>`).join("")}
                  </select>
                </td>
              </tr>
              <tr>
                <th>Mã hóa:</th>
                <td><select class="vht-select" id="w5-ssid-enc"><option value="AES" selected>AES</option></select></td>
              </tr>
              <tr>
                <th>Mật khẩu Wi-Fi:</th>
                <td><input type="text" class="vht-input" id="w5-ssid-key" value="${esc(curSsidObj.key)}" /></td>
              </tr>
            </table>
            <div class="btn-row">
              <button class="btn-vht" id="w5-btn-apply">ÁP DỤNG</button>
            </div>
          </div>
        </div>
      `;
    },
    bind: function () {
      const st = window.SimState;
      const w = st.wifi5;

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

      document.getElementById("w5-fill-group").addEventListener("click", function () {
        const grp = st.coach.groupSsid || "24CLC01-N01";
        const idx = w.selectedIdx || 1;
        document.getElementById("w5-ssid-name").value = idx === 1 ? grp + "_5G" : grp + "_5G_" + idx;
        document.getElementById("w5-ssid-enable").checked = true;
      });

      document.getElementById("w5-btn-apply").addEventListener("click", function () {
        const idx = w.selectedIdx || 1;
        const target = w.ssids.find((x) => x.idx === idx);
        const ssidName = document.getElementById("w5-ssid-name").value.trim();
        const auth = document.getElementById("w5-ssid-auth").value;
        const key = document.getElementById("w5-ssid-key").value;
        const maxSta = parseInt(document.getElementById("w5-maxsta").value, 10) || 45;

        if (!ssidName) return alert("Tên mạng Wi-Fi 5GHz không được để trống!");
        if (auth !== "OPEN" && key.length < 8) return alert("Mật khẩu Wi-Fi phải từ 8 ký tự trở lên!");

        w.enabled = document.getElementById("w5-enable").checked;
        w.mode = document.getElementById("w5-mode").value;
        w.channel = document.getElementById("w5-channel").value;
        w.bandwidth = document.getElementById("w5-bw").value;
        w.txPower = document.getElementById("w5-txpower").value;
        w.maxSta = Math.min(45, Math.max(1, maxSta));
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
        window.RouterApp.applyWithFeedback("Đã áp dụng cấu hình Wi-Fi 5GHz (" + ssidName + ")!");
      });
    }
  };

  // --------------------------------------------------------------------------
  // 9. Wi-Fi -> Wi-Fi Mesh (/cgi-bin/wifi-mesh.asp & wifi-mesh-advanced.asp)
  // --------------------------------------------------------------------------
  window.RouterPages["wifi-mesh"] = {
    title: "Wi-Fi Mesh (EasyMesh)",
    group: "Wi-Fi",
    cgi: "/cgi-bin/wifi-mesh.asp",
    render: function () {
      const m = window.SimState.mesh;
      return `
        <div class="vht-card">
          <div class="vht-card-header">
            <span>Cấu hình mạng lưới Wi-Fi EasyMesh</span>
            <div>
              <button type="button" class="btn-vht outline small" id="mesh-goto-topo">XEM SƠ ĐỒ TOPOLOGY HIỆN TẠI</button>
              <button type="button" class="btn-vht secondary small" id="mesh-toggle-adv">
                ${m.showAdvancedPage ? "ẨN THÔNG SỐ ROAMING NÂNG CAO" : "CẤU HÌNH MESH NÂNG CAO"}
              </button>
            </div>
          </div>
          <div class="vht-card-body">
            <table class="form-table">
              <tr>
                <th>Kích hoạt EasyMesh:</th>
                <td><label class="check-item"><input type="checkbox" id="mesh-enable" ${m.enabled ? "checked" : ""} /> <strong>Bật EasyMesh</strong></label></td>
              </tr>
              <tr>
                <th>Đặt vai trò thiết bị là:</th>
                <td>
                  <select class="vht-select" id="mesh-role">
                    <option value="Controller" ${m.role === "Controller" ? "selected" : ""}>Controller (Bộ điều khiển trung tâm - Router gốc cắm cáp quang)</option>
                    <option value="Agent" ${m.role === "Agent" ? "selected" : ""}>Agent (Nốt phát sóng vệ tinh đặt ở các tầng phụ)</option>
                  </select>
                </td>
              </tr>
              <tr>
                <th>Trạng thái kết nối Backhaul:</th>
                <td><span class="badge-ok">${esc(m.backhaulStatus)}</span></td>
              </tr>
              <tr>
                <th>Chuyển vùng thông minh (Mesh Steering):</th>
                <td><label class="check-item"><input type="checkbox" id="mesh-steering" ${m.steering ? "checked" : ""} /> Tự động chuyển vùng thiết bị mượt mà giữa các tầng (1 SSID duy nhất)</label></td>
              </tr>
              <tr>
                <th>Ghép nối nhanh Node phụ:</th>
                <td>
                  <button type="button" class="btn-vht outline small" id="mesh-onboarding">KÍCH HOẠT WI-FI ON-BOARDING (WPS MESH)</button>
                  <span class="field-hint">Mở phiên 2 phút để ghép nối cục Home Wi-Fi phụ</span>
                </td>
              </tr>
            </table>
            <div class="btn-row">
              <button class="btn-vht" id="mesh-btn-apply">ÁP DỤNG</button>
            </div>
          </div>
        </div>

        <div class="vht-card" style="display:${m.showAdvancedPage ? "block" : "none"};">
          <div class="vht-card-header">
            <span>Cấu hình ngưỡng chuyển vùng chuyên sâu</span>
            <span class="cgi-tag">/cgi-bin/wifi-mesh-advanced.asp</span>
          </div>
          <div class="vht-card-body">
            <table class="form-table">
              <tr>
                <th>Ngưỡng RSSI chuyển vùng (AP Roaming):</th>
                <td><input type="number" class="vht-input short" id="mesh-roam" value="${m.roamRssi}" /> dBm <span class="field-hint">(Mặc định -70 dBm)</span></td>
              </tr>
              <tr>
                <th>Ngưỡng chuyển băng 5GHz → 2.4GHz / 2.4GHz → 5GHz:</th>
                <td>
                  5G→2.4G: <input type="number" class="vht-input short" id="mesh-5to24" value="${m.band5To24Rssi}" /> dBm &nbsp;|&nbsp;
                  2.4G→5G: <input type="number" class="vht-input short" id="mesh-24to5" value="${m.band24To5Rssi}" /> dBm
                </td>
              </tr>
              <tr>
                <th>Ngưỡng cân bằng tải kênh (2.4G / 5G):</th>
                <td>${m.chanUtil24}% / ${m.chanUtil5}% <span class="field-hint">(Khuyến nghị giữ mặc định nhà sản xuất)</span></td>
              </tr>
            </table>
          </div>
        </div>
      `;
    },
    bind: function () {
      const m = window.SimState.mesh;
      document.getElementById("mesh-goto-topo").addEventListener("click", function () {
        window.RouterApp.navigate("wifi-mesh-topology");
      });
      document.getElementById("mesh-toggle-adv").addEventListener("click", function () {
        m.showAdvancedPage = !m.showAdvancedPage;
        window.SimEngine.saveState();
        window.RouterApp.renderCurrentPage();
      });
      document.getElementById("mesh-onboarding").addEventListener("click", function () {
        window.SimState.device.wpsBlinkUntil = Date.now() + 120000;
        m.demoAgentConnected = true;
        window.SimEngine.addLog("[EASYMESH] Kích hoạt Wi-Fi On-boarding — Đã ghép nối thử nghiệm 1 Node Agent vệ tinh.");
        window.RouterApp.showToast("Đã kích hoạt Wi-Fi On-boarding (Đèn WPS chớp xanh, sẵn sàng ghép Node Agent)!");
        window.LabUI.render();
      });
      document.getElementById("mesh-btn-apply").addEventListener("click", function () {
        m.enabled = document.getElementById("mesh-enable").checked;
        m.role = document.getElementById("mesh-role").value;
        m.steering = document.getElementById("mesh-steering").checked;
        m.roamRssi = parseInt(document.getElementById("mesh-roam").value, 10) || -70;
        m.band5To24Rssi = parseInt(document.getElementById("mesh-5to24").value, 10) || -82;
        m.band24To5Rssi = parseInt(document.getElementById("mesh-24to5").value, 10) || -65;
        m.backhaulStatus = m.enabled ? "Sẵn sàng (" + m.role + " Active)" : "Đã tắt EasyMesh";
        window.SimEngine.addLog("[EASYMESH] Cập nhật vai trò: " + m.role + " (EasyMesh: " + (m.enabled ? "Bật" : "Tắt") + ").");
        window.RouterApp.applyWithFeedback("Đã lưu cấu hình Wi-Fi EasyMesh!");
      });
    }
  };

  // --------------------------------------------------------------------------
  // 10. An ninh -> Tường lửa (/cgi-bin/fw-spi.asp)
  // --------------------------------------------------------------------------
  window.RouterPages["fw-spi"] = {
    title: "Tường lửa (SPI Firewall)",
    group: "An ninh",
    cgi: "/cgi-bin/fw-spi.asp",
    render: function () {
      const sec = window.SimState.security;
      return `
        <div class="vht-notice">
          <strong>Tường lửa SPI (Stateful Packet Inspection):</strong> Theo dõi trạng thái từng phiên kết nối đi ra từ mạng LAN; chỉ cho phép các gói tin phản hồi hợp lệ từ Internet đi vào và tự động chặn các gói tin lạ dò quét cổng / tấn công từ ngoài WAN.
        </div>

        <div class="vht-card">
          <div class="vht-card-header">Thiết lập Tường lửa kiểm tra trạng thái gói tin (SPI)</div>
          <div class="vht-card-body">
            <table class="form-table">
              <tr>
                <th>Tường lửa SPI:</th>
                <td>
                  <label class="check-item">
                    <input type="checkbox" id="spi-enable" ${sec.spiEnabled ? "checked" : ""} />
                    <strong>Kích hoạt</strong>
                  </label>
                </td>
              </tr>
              <tr>
                <th>Mức độ bảo vệ:</th>
                <td>
                  <select class="vht-select" id="spi-level">
                    <option value="Thấp" ${sec.spiLevel === "Thấp" ? "selected" : ""}>Thấp (Chỉ chặn gói tin lỗi/giả mạo cơ bản, độ mở tối đa)</option>
                    <option value="Trung bình" ${sec.spiLevel === "Trung bình" ? "selected" : ""}>Trung bình (Cân bằng bảo mật và tương thích ứng dụng)</option>
                    <option value="Cao" ${sec.spiLevel === "Cao" ? "selected" : ""}>Cao (Kiểm soát nghiêm ngặt kết nối từ WAN &amp; chống DoS cơ bản ★)</option>
                  </select>
                </td>
              </tr>
            </table>
            <div class="btn-row">
              <button class="btn-vht" id="spi-btn-apply">ÁP DỤNG</button>
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
          "[FIREWALL] Tường lửa SPI: " + (sec.spiEnabled ? "Kích hoạt" : "Tắt") + " — Mức độ bảo vệ: " + sec.spiLevel + "."
        );
        window.RouterApp.applyWithFeedback("Đã áp dụng cấu hình Tường lửa SPI (Mức: " + sec.spiLevel + ")!");
      });
    }
  };

  // --------------------------------------------------------------------------
  // 11. An ninh -> Kiểm soát con cái (/cgi-bin/fw-parentalcontrol.asp)
  //     REPRODUCES EXACT FIRMWARE V1302250508 JAVASCRIPT TRAPS #1 & #2!
  // --------------------------------------------------------------------------
  window.RouterPages["fw-parentalcontrol"] = {
    title: "Kiểm soát con cái (Lọc MAC Blacklist Deny & Lịch trình/URL Allow)",
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
        policy: "Deny",
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
      const phone = window.SimState.simDevices.phone;
      const d = this.draft;
      const allDays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

      return `
        <div class="vht-notice">
          Trên firmware VHT của dòng <code>vGP-42X6V1</code>, tính năng kiểm soát truy cập theo địa chỉ vật lý <strong>MAC</strong> (tối đa 10 luật) được tích hợp tại đây với 2 chính sách:
          <strong>Deny</strong> (Danh sách đen MAC Blacklist — cắt sạch Internet 24/7) và <strong>Allow</strong> (Chỉ cho phép vào Internet đúng khung giờ trong <em>Schedules</em> kèm chặn tên miền <em>Block URL</em>).
        </div>

        <div class="vht-card">
          <div class="vht-card-header">
            <span>Danh sách luật Kiểm soát truy cập (${rules.length} / 10 luật)</span>
            <div style="display:flex;gap:8px;">
              <button type="button" class="btn-vht small" id="pc-btn-new">THÊM</button>
              <button type="button" class="btn-vht danger small" id="pc-btn-del-selected">XÓA ĐÃ CHỌN</button>
            </div>
          </div>
          <div class="vht-card-body">
            <table class="data-table">
              <thead>
                <tr>
                  <th style="width:36px;"><input type="checkbox" id="pc-chk-all" /></th>
                  <th>STT</th>
                  <th>Name (Tên luật)</th>
                  <th>MAC Address</th>
                  <th>Access Policy</th>
                  <th>Block URL</th>
                  <th>Schedules (Khung giờ)</th>
                  <th>Trạng thái</th>
                  <th>Chỉnh sửa</th>
                </tr>
              </thead>
              <tbody>
                ${
                  rules.length === 0
                    ? `<tr><td colspan="9" class="empty-row">Bảng luật đang trống — Tất cả thiết bị trong mạng được truy cập Internet bình thường.</td></tr>`
                    : rules
                        .map(
                          (r, i) => `
                  <tr>
                    <td><input type="checkbox" class="pc-row-chk" value="${r.id}" /></td>
                    <td>${i + 1}</td>
                    <td><strong>${esc(r.name)}</strong></td>
                    <td><code>${esc(r.mac)}</code></td>
                    <td>${
                      r.policy === "Deny"
                        ? '<span class="badge-pill red">Deny (Chặn 24/7)</span>'
                        : '<span class="badge-pill green">Allow (Theo giờ &amp; Lọc URL)</span>'
                    }</td>
                    <td>${r.policy === "Allow" ? (r.blockUrl ? "<code>" + esc(r.blockUrl) + "</code>" : "<em>Không chặn</em>") : "---"}</td>
                    <td>${
                      r.policy === "Allow"
                        ? (r.schedules || [])
                            .map((s) => `${s.days.join(",")} (${s.start}–${s.end})`)
                            .join("<br/>")
                        : "---"
                    }</td>
                    <td>${r.enabled ? '<span class="badge-ok">Bật</span>' : '<span class="field-hint">Tắt</span>'}</td>
                    <td><button type="button" class="btn-icon pc-edit-btn" data-id="${r.id}" title="Chỉnh sửa luật">✏️ Chỉnh sửa</button></td>
                  </tr>`
                        )
                        .join("")
                }
              </tbody>
            </table>
          </div>
        </div>

        ${
          this.editorOpen && d
            ? `
        <div class="vht-card" style="border:2px solid #ee0033;">
          <div class="vht-card-header" style="background:#fff0f3;color:#ee0033;">
            <span>${this.editingId ? "✏️ Chỉnh sửa luật Kiểm soát truy cập" : "➕ Thêm luật Kiểm soát truy cập mới"}</span>
            <button type="button" class="btn-icon" id="pc-editor-cancel">✖ Đóng</button>
          </div>
          <div class="vht-card-body">
            <table class="form-table">
              <tr>
                <th>Enable (Kích hoạt luật):</th>
                <td><label class="check-item"><input type="checkbox" id="pc-f-enable" ${d.enabled ? "checked" : ""} /> <strong>Bật (Enable)</strong></label></td>
              </tr>
              <tr>
                <th>Name (Tên quy tắc):</th>
                <td><input type="text" class="vht-input" id="pc-f-name" value="${esc(d.name)}" placeholder="Chan_Dien_Thoai" /></td>
              </tr>
              <tr>
                <th>MAC Address:</th>
                <td>
                  <input type="text" class="vht-input med" id="pc-f-mac" value="${esc(d.mac)}" placeholder="a4:83:e7:12:34:56" />
                  <button type="button" class="btn-icon" id="pc-fill-colon">📱 Điền MAC ĐT chuẩn ':' (${esc(phone.mac)})</button>
                  <button type="button" class="btn-icon" id="pc-fill-hyphen" title="Test thử Bẫy kỹ thuật số 1: dấu gạch ngang kiểu Windows">⚠️ Thử gõ '-' (Test bẫy lỗi)</button>
                  <div class="field-hint" style="margin-left:0;margin-top:4px;">Bắt buộc 17 ký tự ngăn cách bằng dấu hai chấm <code>:</code> (ví dụ <code>a4:83:e7:12:34:56</code>).</div>
                </td>
              </tr>
              <tr>
                <th>Access Policy (Quyền truy cập):</th>
                <td>
                  <select class="vht-select" id="pc-f-policy">
                    <option value="Deny" ${d.policy === "Deny" ? "selected" : ""}>Deny (Từ chối — Danh sách đen MAC Blacklist cắt Internet 24/7)</option>
                    <option value="Allow" ${d.policy === "Allow" ? "selected" : ""}>Allow (Cho phép theo khung giờ Schedules &amp; khóa tên miền Block URL)</option>
                  </select>
                </td>
              </tr>
            </table>

            <div id="pc-allow-extra" style="display:${d.policy === "Allow" ? "block" : "none"};margin-top:14px;padding-top:14px;border-top:1px dashed #cbd5e1;">
              <table class="form-table" style="margin-bottom:12px;">
                <tr>
                  <th>Block URL (Tên miền muốn cấm):</th>
                  <td>
                    <input type="text" class="vht-input" id="pc-f-url" value="${esc(d.blockUrl)}" placeholder="dantri.com.vn" />
                    <span class="field-hint">Chỉ gõ tên miền (ví dụ <code>dantri.com.vn</code>), <strong>không</strong> gõ <code>https://</code>. Có thể để trống.</span>
                  </td>
                </tr>
              </table>

              <div style="font-weight:700;font-size:13px;margin-bottom:8px;color:#1e293b;">
                Bảng lịch trình cho phép truy cập (Schedules) — <span style="color:#ee0033;">Lưu ý: Chọn Thứ + Giờ rồi BẮT BUỘC bấm nút [+] ở cột Thao tác!</span>
              </div>

              <table class="data-table">
                <thead>
                  <tr>
                    <th>Chọn các Thứ trong tuần</th>
                    <th>Giờ bắt đầu</th>
                    <th>Giờ kết thúc</th>
                    <th>Kích hoạt</th>
                    <th style="width:70px;text-align:center;">Thao tác</th>
                  </tr>
                </thead>
                <tbody>
                  <tr style="background:#fffbeb;">
                    <td>
                      <div class="check-grid">
                        ${allDays
                          .map((day) => `<label class="check-item"><input type="checkbox" class="pc-sch-day" value="${day}" checked /> ${day}</label>`)
                          .join("")}
                      </div>
                    </td>
                    <td><input type="time" class="vht-input short" id="pc-sch-start" value="07:00" /></td>
                    <td><input type="time" class="vht-input short" id="pc-sch-end" value="23:00" /></td>
                    <td><label class="check-item"><input type="checkbox" id="pc-sch-en" checked /> Bật</label></td>
                    <td style="text-align:center;">
                      <button type="button" class="btn-plus" id="pc-sch-add" title="Bấm dấu + để đẩy lịch trình vào bảng">+</button>
                    </td>
                  </tr>
                  ${
                    (d.schedules || []).length === 0
                      ? `<tr><td colspan="5" class="empty-row">Chưa có dòng lịch trình nào trong bảng (Hãy bấm nút [+] màu xanh ở dòng trên để thêm!).</td></tr>`
                      : d.schedules
                          .map(
                            (s, si) => `
                    <tr>
                      <td><strong>${esc(s.days.join(", "))}</strong></td>
                      <td>${esc(s.start)}</td>
                      <td>${esc(s.end)}</td>
                      <td>${s.enabled ? '<span class="badge-ok">Kích hoạt</span>' : "Tắt"}</td>
                      <td style="text-align:center;"><button type="button" class="btn-vht danger small pc-sch-del" data-sidx="${si}">Xóa</button></td>
                    </tr>`
                          )
                          .join("")
                  }
                </tbody>
              </table>
            </div>

            <div class="btn-row">
              <button type="button" class="btn-vht" id="pc-btn-save">ÁP DỤNG</button>
            </div>
          </div>
        </div>
        `
            : ""
        }
      `;
    },
    bind: function () {
      const self = this;
      const rules = window.SimState.security.parentalRules;

      document.getElementById("pc-btn-new").addEventListener("click", function () {
        if (rules.length >= 10) return alert("Chỉ hỗ trợ tối đa 10 luật Kiểm soát con cái!");
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
        window.RouterApp.applyWithFeedback("Đã xóa luật đã chọn! Thiết bị có thể truy cập Internet bình thường trở lại.");
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

      document.getElementById("pc-fill-colon").addEventListener("click", function () {
        document.getElementById("pc-f-mac").value = window.SimState.simDevices.phone.mac;
      });

      document.getElementById("pc-fill-hyphen").addEventListener("click", function () {
        document.getElementById("pc-f-mac").value = window.SimState.simDevices.phone.mac.toUpperCase().replace(/:/g, "-");
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
          if (days.length === 0) return alert("Vui lòng tích chọn ít nhất 1 thứ trong tuần!");
          const start = document.getElementById("pc-sch-start").value || "07:00";
          const end = document.getElementById("pc-sch-end").value || "23:00";
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
        if (!d.name) return alert("Name (Tên luật) không được để trống!");

        // FIRMWARE V1302250508 TRAP #1: Strict colon-separated 17-char MAC check!
        const macColonRegex = /^([0-9A-Fa-f]{2}:){5}[0-9A-Fa-f]{2}$/;
        if (!macColonRegex.test(d.mac)) {
          return alert(
            "Địa chỉ MAC không hợp lệ!\n\n[Cảnh báo Firmware V1302250508]: Bắt buộc nhập đúng 17 ký tự ngăn cách bằng dấu hai chấm ':' (ví dụ a4:83:e7:12:34:56). Không dùng dấu gạch ngang '-'!"
          );
        }

        // FIRMWARE V1302250508 TRAP #2: Allow requires >=1 row pushed via [+] into Schedules, and no https:// in Block URL
        if (d.policy === "Allow") {
          if (/^https?:\/\//i.test(d.blockUrl)) {
            return alert(
              "Block URL không hợp lệ!\n\nChỉ nhập tên miền (ví dụ: dantri.com.vn), tuyệt đối không gõ tiền tố http:// hoặc https://."
            );
          }
          if (!d.schedules || d.schedules.length === 0) {
            return alert(
              "Lịch trình không được để trống!\n\n[Cảnh báo Firmware V1302250508]: Ở chế độ Allow, sau khi chọn Thứ và Giờ, bạn BẮT BUỘC phải bấm nút dấu cộng [+] ở cột Thao tác ngoài cùng bên phải để đẩy lịch vào bảng trước khi bấm ÁP DỤNG!"
            );
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
        window.RouterApp.applyWithFeedback(
          "Đã áp dụng luật Kiểm soát con cái (" + d.policy + ")! Hãy mở Trình duyệt trên Điện thoại mô phỏng bên phải để kiểm chứng Trước/Sau."
        );
      });
    }
  };
})();
