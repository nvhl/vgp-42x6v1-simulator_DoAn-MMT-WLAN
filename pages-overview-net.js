/* ==========================================================================
   pages-overview-net.js — Renderers & Handlers for Overview (4 pages) & Mạng (2 pages)
   Matches Real VHT ONT Layout (Two-column cards, Toggle switches, Eye password inputs)
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

  function formatHms(sec) {
    const pad = (n) => String(n).padStart(2, "0");
    const h = Math.floor(sec / 3600);
    const m = Math.floor((sec % 3600) / 60);
    const s = sec % 60;
    return pad(h) + ":" + pad(m) + ":" + pad(s);
  }

  function formatVnClock(d) {
    const pad = (n) => String(n).padStart(2, "0");
    return (
      pad(d.getHours()) +
      ":" +
      pad(d.getMinutes()) +
      " " +
      pad(d.getDate()) +
      "/" +
      pad(d.getMonth() + 1) +
      "/" +
      d.getFullYear() +
      " GMT+07:00"
    );
  }

  function pwdInputHtml(id, val, placeholder) {
    return `
      <div class="pwd-wrap">
        <input type="password" class="vht-input" id="${id}" value="${esc(val)}" ${placeholder ? `placeholder="${esc(placeholder)}"` : ""} />
        <button type="button" class="pwd-eye" data-target="${id}" title="Hiện/Ẩn mật khẩu">👁</button>
      </div>
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
  // 1. Cài đặt nhanh (/cgi-bin/home.asp) — Matches Image 2 Layout
  // --------------------------------------------------------------------------
  window.RouterPages["home"] = {
    title: "Wi-Fi",
    group: "Tổng quan",
    cgi: "/cgi-bin/home.asp",
    render: function () {
      const st = window.SimState;
      const wan = st.wanList[0];
      const s24 = st.wifi24.ssids[0];
      const s5 = st.wifi5.ssids[0];
      const authOptions = ["WPA2-PSK", "WPA2-PSK/WPA3-SAE", "WPA3-SAE", "OPEN"];

      return `
        <div class="vht-card">
          <div class="vht-card-body">
            <!-- Merged Dual-Band Block when Band Steering is ON -->
            <div id="qs-wifi-merged" style="display:${st.bandSteering ? "block" : "none"};">
              <div class="sub-heading" style="margin-top:0;">Thiết lập Wi-Fi hai băng tần</div>
              <table class="form-table">
                <tr>
                  <th>Tên mạng (SSID1)</th>
                  <td><input type="text" class="vht-input" id="qs-merged-ssid" value="${esc(s24.ssid)}" /></td>
                </tr>
                <tr>
                  <th>Kiểu xác thực</th>
                  <td>
                    <select class="vht-select" id="qs-merged-auth">
                      ${authOptions.map((a) => `<option value="${a}" ${s24.auth === a ? "selected" : ""}>${a}</option>`).join("")}
                    </select>
                  </td>
                </tr>
                <tr>
                  <th>Mật khẩu</th>
                  <td>${pwdInputHtml("qs-merged-key", s24.key)}</td>
                </tr>
              </table>
            </div>

            <!-- Split 2.4GHz & 5GHz Blocks when Band Steering is OFF -->
            <div id="qs-wifi-split" style="display:${st.bandSteering ? "none" : "block"};">
              <div class="vht-grid-2col">
                <div>
                  <div class="sub-heading" style="margin-top:0;">Thiết lập Wi-Fi 2.4GHz</div>
                  <table class="form-table">
                    <tr>
                      <th>Tên mạng (SSID1)</th>
                      <td><input type="text" class="vht-input" id="qs-24-ssid" value="${esc(s24.ssid)}" /></td>
                    </tr>
                    <tr>
                      <th>Mật khẩu</th>
                      <td>${pwdInputHtml("qs-24-key", s24.key)}</td>
                    </tr>
                  </table>
                </div>
                <div>
                  <div class="sub-heading" style="margin-top:0;">Thiết lập Wi-Fi 5GHz</div>
                  <table class="form-table">
                    <tr>
                      <th>Tên mạng (SSIDAC1)</th>
                      <td><input type="text" class="vht-input" id="qs-5-ssid" value="${esc(s5.ssid)}" /></td>
                    </tr>
                    <tr>
                      <th>Mật khẩu</th>
                      <td>${pwdInputHtml("qs-5-key", s5.key)}</td>
                    </tr>
                  </table>
                </div>
              </div>
            </div>

            <!-- Band Steering Toggle Switch -->
            <div class="sub-heading" style="margin-top:18px;">Cài đặt chuyển băng tự động</div>
            <table class="form-table">
              <tr>
                <th>Chuyển băng tự động</th>
                <td>
                  <label class="vht-switch">
                    <input type="checkbox" id="qs-band-steering" ${st.bandSteering ? "checked" : ""} />
                    <span class="vht-slider"></span>
                  </label>
                  <div style="font-style:italic;font-weight:400;color:#4b5563;font-size:12.5px;margin-top:8px;line-height:1.45;">
                    Khi bật chuyển băng tự động, Wi-Fi cả hai băng tần luôn luôn bật, đồng thời SSID, kiểu xác thực và mật khẩu của Wi-Fi 2.4GHz và 5GHz được đặt giống nhau.
                  </div>
                </td>
              </tr>
            </table>
          </div>
        </div>

        <!-- Bottom 2-Column Grid: WAN PPPoE & Thay đổi mật khẩu -->
        <div class="vht-grid-2col">
          <div>
            <div class="sec-heading">WAN PPPoE</div>
            <div class="vht-card">
              <div class="vht-card-body">
                <table class="form-table">
                  <tr>
                    <th>Tài khoản PPPoE</th>
                    <td><input type="text" class="vht-input" id="qs-pppoe-user" value="${esc(wan.pppoeUser)}" /></td>
                  </tr>
                  <tr>
                    <th>Mật khẩu PPPoE</th>
                    <td>${pwdInputHtml("qs-pppoe-pass", wan.pppoePass)}</td>
                  </tr>
                  <tr>
                    <th>VLAN</th>
                    <td>${wan.vlanId}</td>
                  </tr>
                  <tr>
                    <th style="vertical-align:top;">IP hiện tại</th>
                    <td>
                      <div>${esc(wan.wanIp)}</div>
                      <div style="max-width:240px;overflow-x:auto;white-space:nowrap;font-size:12px;padding-bottom:4px;margin-top:2px;">
                        ${esc(wan.wanIpv6)}
                      </div>
                    </td>
                  </tr>
                </table>
              </div>
            </div>
          </div>

          <div>
            <div class="sec-heading">Thay đổi mật khẩu</div>
            <div class="vht-card">
              <div class="vht-card-body">
                <table class="form-table">
                  <tr>
                    <th>Tên người dùng</th>
                    <td><strong>admin</strong></td>
                  </tr>
                  <tr>
                    <th>Mật khẩu hiện tại</th>
                    <td>${pwdInputHtml("qs-admin-oldpass", "")}</td>
                  </tr>
                  <tr>
                    <th>Mật khẩu mới</th>
                    <td>${pwdInputHtml("qs-admin-newpass", "")}</td>
                  </tr>
                  <tr>
                    <th>Xác nhận mật khẩu</th>
                    <td>${pwdInputHtml("qs-admin-cfpass", "")}</td>
                  </tr>
                </table>
              </div>
            </div>
          </div>
        </div>

        <div class="btn-row center">
          <button class="btn-vht pill-lg" id="qs-btn-apply">ÁP DỤNG</button>
        </div>
      `;
    },
    bind: function () {
      bindPwdEyes();
      const chk = document.getElementById("qs-band-steering");
      const mergedBox = document.getElementById("qs-wifi-merged");
      const splitBox = document.getElementById("qs-wifi-split");

      chk.addEventListener("change", function () {
        mergedBox.style.display = chk.checked ? "block" : "none";
        splitBox.style.display = chk.checked ? "none" : "block";
      });

      document.getElementById("qs-btn-apply").addEventListener("click", function () {
        const st = window.SimState;
        const oldSsid = st.wifi24.ssids[0].ssid;
        st.bandSteering = chk.checked;

        if (st.bandSteering) {
          const ssid = document.getElementById("qs-merged-ssid").value.trim();
          const key = document.getElementById("qs-merged-key").value;
          const auth = document.getElementById("qs-merged-auth").value;
          if (!ssid) return alert("Tên mạng (SSID1) không được để trống!");
          if (auth !== "OPEN" && key.length < 8) return alert("Mật khẩu Wi-Fi phải từ 8 đến 63 ký tự!");
          st.wifi24.ssids[0].ssid = ssid;
          st.wifi24.ssids[0].key = key;
          st.wifi24.ssids[0].auth = auth;
          st.wifi5.ssids[0].ssid = ssid;
          st.wifi5.ssids[0].key = key;
          st.wifi5.ssids[0].auth = auth;
        } else {
          const s24 = document.getElementById("qs-24-ssid").value.trim();
          const k24 = document.getElementById("qs-24-key").value;
          const s5 = document.getElementById("qs-5-ssid").value.trim();
          const k5 = document.getElementById("qs-5-key").value;
          if (!s24 || !s5) return alert("Tên Wi-Fi không được để trống!");
          if (k24.length < 8 || k5.length < 8) return alert("Mật khẩu Wi-Fi phải có ít nhất 8 ký tự!");
          st.wifi24.ssids[0].ssid = s24;
          st.wifi24.ssids[0].key = k24;
          st.wifi5.ssids[0].ssid = s5;
          st.wifi5.ssids[0].key = k5;
        }

        st.wanList[0].pppoeUser = document.getElementById("qs-pppoe-user").value.trim();
        st.wanList[0].pppoePass = document.getElementById("qs-pppoe-pass").value;

        const newAdminPass = document.getElementById("qs-admin-newpass").value;
        if (newAdminPass) {
          const cfPass = document.getElementById("qs-admin-cfpass").value;
          if (newAdminPass !== cfPass) return alert("Xác nhận mật khẩu không trùng khớp!");
          const strong = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/;
          if (!strong.test(newAdminPass)) {
            return alert("Mật khẩu quản trị mới phải tối thiểu 8 ký tự, gồm chữ hoa, thường, số và ký tự đặc biệt!");
          }
          st.admin.password = newAdminPass;
        }

        window.SimEngine.reconcileClients();
        window.SimEngine.addLog("[QUICK SETUP] Cập nhật Cài đặt nhanh (Chuyển băng tự động: " + (st.bandSteering ? "Bật" : "Tắt") + ").");
        window.RouterApp.applyWithFeedback("Đã lưu Cài đặt nhanh thành công!", oldSsid !== st.wifi24.ssids[0].ssid);
      });
    }
  };

  // --------------------------------------------------------------------------
  // 2. Thông tin thiết bị (/cgi-bin/deviceinfo.asp) — Matches Image 3 Layout
  // --------------------------------------------------------------------------
  window.RouterPages["deviceinfo"] = {
    title: "Thông tin cơ bản",
    group: "Tổng quan",
    cgi: "/cgi-bin/deviceinfo.asp",
    selectedWanIdx: 0,
    render: function () {
      const st = window.SimState;
      const dev = st.device;
      const wIdx = this.selectedWanIdx < st.wanList.length ? this.selectedWanIdx : 0;
      const wan = st.wanList[wIdx];
      const wan0 = st.wanList[0];

      const rxPower = dev.fiberFault ? "-31.8 dBm" : "-21.1 dBm";
      const txPower = dev.fiberFault ? "0.0 dBm" : "2.6 dBm";
      const ponState = dev.fiberFault ? "Mất tín hiệu quang (LOS)" : "Kết nối thành công (O5)";
      const netState = dev.fiberFault ? "Mất kết nối" : "Kết nối thành công";
      const lan1Connected = st.simDevices.laptopObs.connMode === "LAN1";
      const lan2Connected = st.simDevices.desktopVm.connected;

      return `
        <!-- Top Card: Thông tin cơ bản (2 Columns: Thông tin PON & Thông tin kết nối Internet) -->
        <div class="vht-card">
          <div class="vht-card-body">
            <div class="vht-grid-2col">
              <div>
                <div class="sub-heading" style="margin-top:0;">Thông tin PON</div>
                <table class="form-table">
                  <tr>
                    <th>Công suất thu</th>
                    <td><span class="${dev.fiberFault ? "badge-err" : "badge-ok"}">${rxPower}</span></td>
                  </tr>
                  <tr>
                    <th>Công suất phát</th>
                    <td><span class="${dev.fiberFault ? "badge-err" : "badge-ok"}">${txPower}</span></td>
                  </tr>
                  <tr>
                    <th>Trạng thái kết nối PON</th>
                    <td><span class="${dev.fiberFault ? "badge-err" : "badge-ok"}">${ponState}</span></td>
                  </tr>
                </table>
              </div>

              <div>
                <div class="sub-heading" style="margin-top:0;">Thông tin kết nối Internet</div>
                <table class="form-table">
                  <tr>
                    <th>Địa chỉ IPv4</th>
                    <td><span class="${dev.fiberFault ? "badge-err" : "badge-ok"}">${dev.fiberFault ? "0.0.0.0" : esc(wan0.wanIp)}</span></td>
                  </tr>
                  <tr>
                    <th>Địa chỉ IPv6</th>
                    <td>
                      <div class="${dev.fiberFault ? "badge-err" : "badge-ok"}" style="max-width:230px;overflow-x:auto;white-space:nowrap;padding-bottom:3px;">
                        ${dev.fiberFault ? "---" : esc(wan0.wanIpv6)}
                      </div>
                    </td>
                  </tr>
                  <tr>
                    <th>Trạng thái kết nối Internet</th>
                    <td><span class="${dev.fiberFault ? "badge-err" : "badge-ok"}">${netState}</span></td>
                  </tr>
                </table>
              </div>
            </div>
          </div>
        </div>

        <!-- Bottom 2-Column Grid: Thông tin thiết bị (Left) & WAN (Right) -->
        <div class="vht-grid-2col">
          <div>
            <div class="sec-heading">Thông tin thiết bị</div>
            <div class="vht-card">
              <div class="vht-card-body">
                <div class="sub-heading" style="margin-top:0;">Thông tin chung</div>
                <table class="form-table">
                  <tr><th>Tên thiết bị</th><td>${esc(dev.name)}</td></tr>
                  <tr><th>Tên mẫu</th><td>${esc(dev.model)}</td></tr>
                  <tr><th>Phiên bản Firmware</th><td>${esc(dev.firmware)}</td></tr>
                  <tr><th>Số serial GPON</th><td>${esc(dev.gponSN)}</td></tr>
                  <tr><th>Địa chỉ MAC</th><td>${esc(dev.macLan)}</td></tr>
                </table>

                <div class="sub-heading">Thông tin thời gian</div>
                <table class="form-table">
                  <tr><th>Giờ hệ thống</th><td id="devinfo-sysclock">${formatVnClock(window.SimEngine.nowRouterDate())}</td></tr>
                  <tr><th>Thời gian hoạt động của hệ thống</th><td id="devinfo-uptime">${formatHms(dev.uptimeSec)}</td></tr>
                </table>

                <div class="sub-heading">Thông tin tài nguyên</div>
                <table class="form-table">
                  <tr><th>Tải CPU</th><td>${dev.cpuLoad}%</td></tr>
                  <tr><th>Bộ nhớ đã dùng</th><td>${dev.ramUsage}%</td></tr>
                </table>

                <div class="sub-heading">Thông tin Module quang &amp; Cổng LAN</div>
                <table class="form-table">
                  <tr><th>Loại OLT / Module quang</th><td>OLT ZTE (Class B+ | Nhiệt độ 54.8 °C)</td></tr>
                  <tr><th>Cổng LAN1 – LAN4</th><td>LAN1: ${lan1Connected ? "1000M Up" : "Down"} | LAN2: ${lan2Connected ? "1000M Up" : "Down"} | LAN3–4: Down</td></tr>
                  <tr><th>Địa chỉ IPv4 LAN</th><td>${esc(st.lan.ip)} / ${esc(st.lan.mask)}</td></tr>
                  <tr><th>Trạng thái TR-069 / TMS</th><td>Đã kết nối ACS Viettel</td></tr>
                </table>
              </div>
            </div>
          </div>

          <div>
            <div class="sec-heading">WAN</div>
            <div class="vht-card">
              <div class="vht-card-body">
                <div style="margin-bottom:12px;">
                  <select class="vht-select" id="devinfo-wan-sel" style="width:100%;">
                    ${st.wanList
                      .map((w, i) => `<option value="${i}" ${i === wIdx ? "selected" : ""}>${esc(w.id)}</option>`)
                      .join("")}
                  </select>
                </div>

                <table class="form-table">
                  <tr><th>Loại kết nối</th><td>${esc(wan.connType)}</td></tr>
                  <tr><th>Địa chỉ MAC</th><td>${esc(dev.macWan)}</td></tr>
                  <tr><th>Thời gian chạy PPPoE</th><td>${formatHms(Math.max(60, dev.uptimeSec - 180))}</td></tr>
                </table>

                <div class="sub-heading">IPv4</div>
                <table class="form-table">
                  <tr><th>Trạng thái</th><td>${dev.fiberFault ? "Ngắt kết nối" : "Kết nối"}</td></tr>
                  <tr><th>Địa chỉ IP</th><td>${dev.fiberFault ? "0.0.0.0" : esc(wan.wanIp)}</td></tr>
                  <tr><th>Mặt nạ mạng con</th><td>255.255.255.255</td></tr>
                  <tr><th>Gateway mặc định</th><td>${esc(wan.wanGateway)}</td></tr>
                  <tr><th>DNS chính</th><td>${esc(wan.dns1)}</td></tr>
                  <tr><th>DNS phụ</th><td>${esc(wan.dns2 || "---")}</td></tr>
                </table>

                <div class="sub-heading">IPv6</div>
                <table class="form-table">
                  <tr><th>Trạng thái</th><td>${wan.ipVersion.includes("IPv6") && !dev.fiberFault ? "Kết nối" : "N/A"}</td></tr>
                  <tr><th>Địa chỉ IPv6</th><td><small>${esc(wan.wanIpv6)}</small></td></tr>
                </table>
              </div>
            </div>
          </div>
        </div>
      `;
    },
    bind: function () {
      const self = this;
      const sel = document.getElementById("devinfo-wan-sel");
      if (sel) {
        sel.addEventListener("change", function (e) {
          self.selectedWanIdx = parseInt(e.target.value, 10) || 0;
          window.RouterApp.renderCurrentPage();
        });
      }
    }
  };

  // --------------------------------------------------------------------------
  // 3. Thiết bị đang kết nối (/cgi-bin/sta-users.asp)
  // --------------------------------------------------------------------------
  window.RouterPages["sta-users"] = {
    title: "Thiết bị đang kết nối",
    group: "Tổng quan",
    cgi: "/cgi-bin/sta-users.asp",
    render: function () {
      const st = window.SimState;
      const schedOff = window.SimEngine.isWifiScheduledOff();
      const nets = window.SimEngine.getActiveBroadcastSsids();

      const lanClients = [];
      if (st.simDevices.laptopObs.connMode === "LAN1") {
        lanClients.push({
          name: st.simDevices.laptopObs.name,
          port: "LAN1",
          mac: st.simDevices.laptopObs.mac,
          ip: st.simDevices.laptopObs.ip,
          speed: "1000 Mbps"
        });
      }
      if (st.simDevices.desktopVm.connected) {
        lanClients.push({
          name: st.simDevices.desktopVm.name,
          port: "LAN2",
          mac: st.simDevices.desktopVm.mac,
          ip: window.SimEngine.allocateDhcpIpForMac(st.simDevices.desktopVm.mac, st.simDevices.desktopVm.ip),
          speed: "1000 Mbps"
        });
      }

      const wifi24Clients = [];
      const wifi5Clients = [];

      function pushWifiClient(devObj, defaultRssi) {
        if (!devObj || !devObj.connected || schedOff) return;
        const net = nets.find((n) => n.ssid === devObj.ssid);
        if (!net) return;
        const entry = {
          name: devObj.name,
          ssid: devObj.ssid,
          mac: devObj.mac,
          ip: devObj.ip,
          rssi: (devObj.rssi || defaultRssi) + " dBm",
          speed: net.speedMbps + " Mbps"
        };
        if (net.actualBand === "5G") wifi5Clients.push(entry);
        else wifi24Clients.push(entry);
      }

      if (st.simDevices.laptopObs.connMode === "WIFI") {
        pushWifiClient(
          {
            name: st.simDevices.laptopObs.name,
            connected: true,
            ssid: st.simDevices.laptopObs.wifiSsid,
            mac: st.simDevices.laptopObs.mac,
            ip: st.simDevices.laptopObs.ip,
            rssi: -40
          },
          -40
        );
      }
      if (st.simDevices.phone.wifiOn && st.simDevices.phone.connected) {
        pushWifiClient(st.simDevices.phone, -44);
      }
      if (st.simDevices.laptopAux.connected) {
        pushWifiClient(st.simDevices.laptopAux, -52);
      }

      return `
        <div style="display:flex;justify-content:flex-end;margin-bottom:10px;">
          <button class="btn-vht small" id="sta-btn-reload">TẢI LẠI</button>
        </div>

        <div class="vht-card">
          <div class="vht-card-header">Thiết bị kết nối cổng LAN (Ethernet)</div>
          <div class="vht-card-body">
            <table class="data-table">
              <thead>
                <tr>
                  <th>STT</th>
                  <th>Tên thiết bị</th>
                  <th>Cổng</th>
                  <th>Địa chỉ MAC</th>
                  <th>Địa chỉ IP</th>
                  <th>Tốc độ (Mbps)</th>
                </tr>
              </thead>
              <tbody>
                ${
                  lanClients.length === 0
                    ? `<tr><td colspan="6" class="empty-row">Không có thiết bị kết nối dây LAN.</td></tr>`
                    : lanClients
                        .map(
                          (c, idx) => `
                  <tr>
                    <td>${idx + 1}</td>
                    <td><strong>${esc(c.name)}</strong></td>
                    <td>${esc(c.port)}</td>
                    <td><code>${esc(c.mac)}</code></td>
                    <td><strong>${esc(c.ip)}</strong></td>
                    <td>${esc(c.speed)}</td>
                  </tr>`
                        )
                        .join("")
                }
              </tbody>
            </table>
          </div>
        </div>

        <div class="vht-card">
          <div class="vht-card-header">Thiết bị đang kết nối Wi-Fi 2.4GHz</div>
          <div class="vht-card-body">
            <table class="data-table">
              <thead>
                <tr>
                  <th>STT</th>
                  <th>Tên thiết bị</th>
                  <th>SSID</th>
                  <th>Địa chỉ MAC</th>
                  <th>Địa chỉ IP</th>
                  <th>RSSI (dBm)</th>
                  <th>Tốc độ (Mbps)</th>
                </tr>
              </thead>
              <tbody>
                ${
                  wifi24Clients.length === 0
                    ? `<tr><td colspan="7" class="empty-row">Chưa có thiết bị kết nối ở băng tần 2.4GHz.</td></tr>`
                    : wifi24Clients
                        .map(
                          (c, idx) => `
                  <tr>
                    <td>${idx + 1}</td>
                    <td><strong>${esc(c.name)}</strong></td>
                    <td>${esc(c.ssid)}</td>
                    <td><code>${esc(c.mac)}</code></td>
                    <td><strong>${esc(c.ip)}</strong></td>
                    <td>${esc(c.rssi)}</td>
                    <td>${esc(c.speed)}</td>
                  </tr>`
                        )
                        .join("")
                }
              </tbody>
            </table>
          </div>
        </div>

        <div class="vht-card">
          <div class="vht-card-header">Thiết bị đang kết nối Wi-Fi 5GHz</div>
          <div class="vht-card-body">
            <table class="data-table">
              <thead>
                <tr>
                  <th>STT</th>
                  <th>Tên thiết bị</th>
                  <th>SSID</th>
                  <th>Địa chỉ MAC</th>
                  <th>Địa chỉ IP</th>
                  <th>RSSI (dBm)</th>
                  <th>Tốc độ (Mbps)</th>
                </tr>
              </thead>
              <tbody>
                ${
                  wifi5Clients.length === 0
                    ? `<tr><td colspan="7" class="empty-row">Chưa có thiết bị kết nối ở băng tần 5GHz.</td></tr>`
                    : wifi5Clients
                        .map(
                          (c, idx) => `
                  <tr>
                    <td>${idx + 1}</td>
                    <td><strong>${esc(c.name)}</strong></td>
                    <td>${esc(c.ssid)}</td>
                    <td><code>${esc(c.mac)}</code></td>
                    <td><strong>${esc(c.ip)}</strong></td>
                    <td><span class="badge-ok">${esc(c.rssi)}</span></td>
                    <td><span class="badge-ok">${esc(c.speed)}</span></td>
                  </tr>`
                        )
                        .join("")
                }
              </tbody>
            </table>
          </div>
        </div>
      `;
    },
    bind: function () {
      document.getElementById("sta-btn-reload").addEventListener("click", function () {
        const p = window.SimState.simDevices.phone;
        if (p.connected) {
          p.ip = window.SimEngine.allocateDhcpIpForMac(p.mac, p.ip);
        }
        window.SimEngine.saveState();
        window.RouterApp.showToast("Đã tải lại danh sách thiết bị đang kết nối!");
        window.RouterApp.renderCurrentPage();
        window.LabUI.render();
      });
    }
  };

  // --------------------------------------------------------------------------
  // 4. Topology hiện tại (/cgi-bin/wifi-mesh-topology.asp)
  // --------------------------------------------------------------------------
  window.RouterPages["wifi-mesh-topology"] = {
    title: "Topology hiện tại",
    group: "Tổng quan",
    cgi: "/cgi-bin/wifi-mesh-topology.asp",
    render: function () {
      const st = window.SimState;
      const clients = [];
      if (st.simDevices.laptopObs.connMode === "LAN1") {
        clients.push({ name: st.simDevices.laptopObs.name, link: "LAN1 (1000 Mbps)", ip: st.simDevices.laptopObs.ip });
      }
      if (st.simDevices.desktopVm.connected) {
        clients.push({ name: st.simDevices.desktopVm.name, link: "LAN2 (1000 Mbps)", ip: st.simDevices.desktopVm.ip });
      }
      if (st.simDevices.phone.wifiOn && st.simDevices.phone.connected && !window.SimEngine.isWifiScheduledOff()) {
        clients.push({
          name: st.simDevices.phone.name,
          link: "Wi-Fi " + st.simDevices.phone.band + " (" + st.simDevices.phone.ssid + " | " + st.simDevices.phone.rssi + " dBm)",
          ip: st.simDevices.phone.ip
        });
      }
      if (st.simDevices.laptopAux.connected && !window.SimEngine.isWifiScheduledOff()) {
        clients.push({
          name: st.simDevices.laptopAux.name,
          link: "Wi-Fi " + st.simDevices.laptopAux.band + " (" + st.simDevices.laptopAux.ssid + " | " + st.simDevices.laptopAux.rssi + " dBm)",
          ip: st.simDevices.laptopAux.ip
        });
      }

      return `
        <div class="vht-card">
          <div class="vht-card-header">
            <span>Runtime Topology</span>
            <div>
              <button class="btn-vht outline small" id="topo-toggle-agent">
                ${st.mesh.demoAgentConnected ? "Ẩn Mesh Agent" : "+ Thêm Mesh Agent"}
              </button>
              <button class="btn-vht small" id="topo-refresh">LÀM MỚI</button>
            </div>
          </div>
          <div class="vht-card-body">
            <div class="topo-canvas">
              <div class="topo-node">
                <div style="font-size:11px;color:#ee0033;font-weight:800;">EASYMESH ${esc(st.mesh.role.toUpperCase())}</div>
                <div style="font-size:15px;font-weight:800;margin:3px 0;">${esc(st.device.model)}</div>
                <div style="font-size:12px;color:#475569;">IP: ${esc(st.lan.ip)} | MAC: ${esc(st.device.macLan)}</div>
              </div>

              <div class="topo-children">
                ${
                  clients.length === 0
                    ? `<div class="field-hint">Chưa có thiết bị kết nối.</div>`
                    : clients
                        .map(
                          (c) => `
                  <div class="topo-client">
                    <div style="font-weight:700;color:#0f172a;">${esc(c.name)}</div>
                    <div style="color:#16a34a;font-weight:600;margin-top:2px;">${esc(c.link)}</div>
                    <div style="color:#64748b;margin-top:2px;">IP: ${esc(c.ip)}</div>
                  </div>`
                        )
                        .join("")
                }
              </div>

              ${
                st.mesh.demoAgentConnected
                  ? `
                <div class="topo-node agent">
                  <div style="font-size:11px;color:#2563eb;font-weight:800;">EASYMESH AGENT</div>
                  <div style="font-size:14px;font-weight:800;margin:3px 0;">Home Wi-Fi H196A</div>
                  <div style="font-size:12px;color:#475569;">Backhaul 5GHz (-61 dBm) | IP: 192.168.1.250</div>
                </div>`
                  : ""
              }
            </div>
          </div>
        </div>
      `;
    },
    bind: function () {
      document.getElementById("topo-toggle-agent").addEventListener("click", function () {
        window.SimState.mesh.demoAgentConnected = !window.SimState.mesh.demoAgentConnected;
        window.SimEngine.saveState();
        window.RouterApp.renderCurrentPage();
      });
      document.getElementById("topo-refresh").addEventListener("click", function () {
        window.RouterApp.renderCurrentPage();
      });
    }
  };

  // --------------------------------------------------------------------------
  // 5. Mạng -> Thiết lập WAN (/cgi-bin/net-wan.asp)
  // --------------------------------------------------------------------------
  window.RouterPages["net-wan"] = {
    title: "Thiết lập WAN",
    group: "Mạng",
    cgi: "/cgi-bin/net-wan.asp",
    selectedWanIdx: 0,
    render: function () {
      const st = window.SimState;
      const idx = this.selectedWanIdx < st.wanList.length ? this.selectedWanIdx : 0;
      const w = st.wanList[idx];
      const allPorts = ["LAN1", "LAN2", "LAN3", "LAN4", "SSID1", "SSID2", "SSID3", "SSID4", "SSIDAC1", "SSIDAC2", "SSIDAC3"];

      return `
        <div class="vht-card">
          <div class="vht-card-header">
            <span>Giao diện WAN được cấu hình tự động qua OMCI</span>
          </div>
          <div class="vht-card-body">
            <table class="form-table">
              <tr>
                <th>Tên kết nối</th>
                <td>
                  <select class="vht-select" id="wan-select-conn">
                    ${st.wanList
                      .map((item, i) => `<option value="${i}" ${i === idx ? "selected" : ""}>${esc(item.id)}</option>`)
                      .join("")}
                  </select>
                </td>
              </tr>
              <tr>
                <th>Chế độ</th>
                <td>
                  <select class="vht-select" id="wan-mode">
                    <option value="Route" ${w.mode === "Route" ? "selected" : ""}>Route</option>
                    <option value="Bridge" ${w.mode === "Bridge" ? "selected" : ""}>Bridge</option>
                  </select>
                </td>
              </tr>
              <tr>
                <th>Phiên bản IP</th>
                <td>
                  <select class="vht-select" id="wan-ipver">
                    <option value="IPv4" ${w.ipVersion === "IPv4" ? "selected" : ""}>IPv4</option>
                    <option value="IPv6" ${w.ipVersion === "IPv6" ? "selected" : ""}>IPv6</option>
                    <option value="IPv4/IPv6" ${w.ipVersion === "IPv4/IPv6" ? "selected" : ""}>IPv4/IPv6</option>
                  </select>
                </td>
              </tr>
              <tr id="wan-row-conntype" style="display:${w.mode === "Bridge" ? "none" : ""};">
                <th>Chế độ kết nối</th>
                <td>
                  <select class="vht-select" id="wan-conntype">
                    <option value="PPPoE" ${w.connType === "PPPoE" ? "selected" : ""}>PPPoE</option>
                    <option value="DHCP" ${w.connType === "DHCP" ? "selected" : ""}>DHCP</option>
                    <option value="Static" ${w.connType === "Static" ? "selected" : ""}>Static</option>
                    <option value="PPPoA" ${w.connType === "PPPoA" ? "selected" : ""}>PPPoA</option>
                    <option value="IPoA" ${w.connType === "IPoA" ? "selected" : ""}>IPoA</option>
                  </select>
                </td>
              </tr>
              <tr class="wan-pppoe-only" style="display:${w.mode === "Route" && w.connType === "PPPoE" ? "" : "none"};">
                <th>Tài khoản PPPoE</th>
                <td><input type="text" class="vht-input" id="wan-user" value="${esc(w.pppoeUser)}" /></td>
              </tr>
              <tr class="wan-pppoe-only" style="display:${w.mode === "Route" && w.connType === "PPPoE" ? "" : "none"};">
                <th>Mật khẩu PPPoE</th>
                <td><input type="password" class="vht-input" id="wan-pass" value="${esc(w.pppoePass)}" /></td>
              </tr>
              <tr>
                <th>MTU</th>
                <td><input type="number" class="vht-input short" id="wan-mtu" value="${w.mtu}" /></td>
              </tr>
              <tr>
                <th>Tùy chọn NAT / IGMP</th>
                <td>
                  <div class="check-grid">
                    <label class="check-item"><input type="checkbox" id="wan-nat" ${w.nat ? "checked" : ""} /> NAT</label>
                    <label class="check-item"><input type="checkbox" id="wan-igmp" ${w.igmpProxy ? "checked" : ""} /> IGMP Proxy</label>
                  </div>
                </td>
              </tr>
              <tr>
                <th>Tùy chọn VLAN</th>
                <td>
                  <select class="vht-select" id="wan-vlan-mode" style="width:110px;">
                    <option value="TAG" ${w.vlanMode === "TAG" ? "selected" : ""}>TAG</option>
                    <option value="UNTAG" ${w.vlanMode === "UNTAG" ? "selected" : ""}>UNTAG</option>
                  </select>
                  &nbsp; VLAN ID:
                  <input type="number" class="vht-input short" id="wan-vlan-id" value="${w.vlanId}" />
                  &nbsp; 802.1p:
                  <input type="number" class="vht-input short" id="wan-pbit" value="${w.pbit}" style="width:70px;" />
                </td>
              </tr>
              <tr>
                <th>Port Binding</th>
                <td>
                  <div class="check-grid">
                    ${allPorts
                      .map(
                        (p) => `
                      <label class="check-item">
                        <input type="checkbox" class="wan-bind-chk" value="${p}" ${(w.bindings || []).includes(p) ? "checked" : ""} />
                        ${p}
                      </label>`
                      )
                      .join("")}
                  </div>
                </td>
              </tr>
            </table>
            <div class="btn-row center">
              <button class="btn-vht pill-lg" id="wan-btn-apply">ÁP DỤNG</button>
            </div>
          </div>
        </div>
      `;
    },
    bind: function () {
      const self = this;
      document.getElementById("wan-select-conn").addEventListener("change", function (e) {
        self.selectedWanIdx = parseInt(e.target.value, 10) || 0;
        window.RouterApp.renderCurrentPage();
      });

      const modeEl = document.getElementById("wan-mode");
      const typeEl = document.getElementById("wan-conntype");
      const mtuEl = document.getElementById("wan-mtu");

      function syncVisibility() {
        const isRoute = modeEl.value === "Route";
        document.getElementById("wan-row-conntype").style.display = isRoute ? "" : "none";
        const showPppoe = isRoute && typeEl.value === "PPPoE";
        document.querySelectorAll(".wan-pppoe-only").forEach((el) => {
          el.style.display = showPppoe ? "" : "none";
        });
      }

      modeEl.addEventListener("change", syncVisibility);
      typeEl.addEventListener("change", function () {
        if (typeEl.value === "PPPoE") mtuEl.value = 1492;
        else if (typeEl.value === "DHCP" || typeEl.value === "Static") mtuEl.value = 1500;
        syncVisibility();
      });

      document.getElementById("wan-btn-apply").addEventListener("click", function () {
        const w = window.SimState.wanList[self.selectedWanIdx];
        w.mode = modeEl.value;
        w.ipVersion = document.getElementById("wan-ipver").value;
        w.connType = typeEl.value;
        w.pppoeUser = document.getElementById("wan-user").value.trim();
        w.pppoePass = document.getElementById("wan-pass").value;
        w.mtu = parseInt(mtuEl.value, 10) || 1492;
        w.nat = document.getElementById("wan-nat").checked;
        w.igmpProxy = document.getElementById("wan-igmp").checked;
        w.vlanMode = document.getElementById("wan-vlan-mode").value;
        w.vlanId = parseInt(document.getElementById("wan-vlan-id").value, 10) || 35;
        w.pbit = parseInt(document.getElementById("wan-pbit").value, 10) || 0;
        w.bindings = Array.from(document.querySelectorAll(".wan-bind-chk:checked")).map((c) => c.value);

        window.SimEngine.addLog("[WAN] Cập nhật giao diện " + w.id + " (" + w.mode + ", " + w.connType + ", MTU " + w.mtu + ").");
        window.RouterApp.applyWithFeedback("Đã lưu thiết lập WAN (" + w.id + ")!");
      });
    }
  };

  // --------------------------------------------------------------------------
  // 6. Mạng -> Thiết lập LAN (/cgi-bin/net-lan.asp)
  // --------------------------------------------------------------------------
  window.RouterPages["net-lan"] = {
    title: "Thiết lập LAN",
    group: "Mạng",
    cgi: "/cgi-bin/net-lan.asp",
    render: function () {
      const lan = window.SimState.lan;
      const phone = window.SimState.simDevices.phone;

      return `
        <div class="vht-card">
          <div class="vht-card-header">Thiết lập IPv4 LAN &amp; DHCP Server</div>
          <div class="vht-card-body">
            <table class="form-table">
              <tr>
                <th>Địa chỉ IP</th>
                <td><input type="text" class="vht-input med" id="lan-ip" value="${esc(lan.ip)}" /></td>
              </tr>
              <tr>
                <th>Mặt nạ mạng con</th>
                <td><input type="text" class="vht-input med" id="lan-mask" value="${esc(lan.mask)}" /></td>
              </tr>
              <tr>
                <th>DHCP Server</th>
                <td>
                  <label class="check-item">
                    <input type="checkbox" id="lan-dhcp-enable" ${lan.dhcpEnabled ? "checked" : ""} /> Bật
                  </label>
                </td>
              </tr>
              <tr>
                <th>Dải DHCP</th>
                <td>
                  <input type="text" class="vht-input med" id="lan-dhcp-start" value="${esc(lan.dhcpStart)}" />
                  &nbsp;–&nbsp;
                  <input type="text" class="vht-input med" id="lan-dhcp-end" value="${esc(lan.dhcpEnd)}" />
                </td>
              </tr>
              <tr>
                <th>Thời hạn thuê</th>
                <td><input type="number" class="vht-input short" id="lan-lease" value="${lan.leaseMin}" /> phút</td>
              </tr>
              <tr>
                <th>Cấp phát IP ngẫu nhiên</th>
                <td><input type="checkbox" id="lan-random" ${lan.randomIp ? "checked" : ""} /></td>
              </tr>
              <tr>
                <th>Chế độ DNS</th>
                <td>
                  <select class="vht-select" id="lan-dns-mode">
                    <option value="Proxy" ${lan.dnsMode === "Proxy" ? "selected" : ""}>Proxy</option>
                    <option value="Static" ${lan.dnsMode === "Static" ? "selected" : ""}>Static</option>
                  </select>
                </td>
              </tr>
              <tr id="lan-dns-static-row" style="display:${lan.dnsMode === "Static" ? "" : "none"};">
                <th>DNS Chính / Phụ</th>
                <td>
                  <input type="text" class="vht-input med" id="lan-dns1" value="${esc(lan.staticDns1)}" />
                  &nbsp;
                  <input type="text" class="vht-input med" id="lan-dns2" value="${esc(lan.staticDns2)}" />
                </td>
              </tr>
            </table>
            <div class="btn-row">
              <button class="btn-vht" id="lan-btn-apply">ÁP DỤNG</button>
            </div>
          </div>
        </div>

        <div class="vht-card">
          <div class="vht-card-header">
            <span>Bảng cấp phát IP tĩnh</span>
            <span class="badge-pill gray">${lan.staticLeases.length} / 8</span>
          </div>
          <div class="vht-card-body">
            <table class="form-table" style="margin-bottom:10px;">
              <tr>
                <th>Địa chỉ IP</th>
                <td><input type="text" class="vht-input med" id="static-ip-in" placeholder="192.168.1.150" /></td>
              </tr>
              <tr>
                <th>Địa chỉ MAC</th>
                <td>
                  <input type="text" class="vht-input med" id="static-mac-in" placeholder="a4:83:e7:12:34:56" />
                  <button type="button" class="btn-icon" id="static-fill-phone">${esc(phone.mac)}</button>
                </td>
              </tr>
            </table>
            <div class="btn-row" style="margin-bottom:14px;">
              <button class="btn-vht" id="static-btn-add">THÊM</button>
            </div>

            <table class="data-table">
              <thead>
                <tr>
                  <th>STT</th>
                  <th>Địa chỉ IP</th>
                  <th>Địa chỉ MAC</th>
                  <th>Thao tác</th>
                </tr>
              </thead>
              <tbody>
                ${
                  lan.staticLeases.length === 0
                    ? `<tr><td colspan="4" class="empty-row">Chưa có thiết bị nào được gán IP tĩnh.</td></tr>`
                    : lan.staticLeases
                        .map(
                          (item, i) => `
                  <tr>
                    <td>${i + 1}</td>
                    <td><strong>${esc(item.ip)}</strong></td>
                    <td><code>${esc(item.mac)}</code></td>
                    <td><button class="btn-vht danger small static-del-btn" data-idx="${i}">XÓA</button></td>
                  </tr>`
                        )
                        .join("")
                }
              </tbody>
            </table>
          </div>
        </div>

        <div class="vht-card">
          <div class="vht-card-header">Cấu hình IPv6 LAN</div>
          <div class="vht-card-body">
            <table class="form-table">
              <tr>
                <th>SLAAC / DHCPv6</th>
                <td>
                  <div class="check-grid">
                    <label class="check-item"><input type="checkbox" checked disabled /> Router Advertisement (SLAAC)</label>
                    <label class="check-item"><input type="checkbox" checked disabled /> DHCPv6 Server</label>
                  </div>
                </td>
              </tr>
            </table>
          </div>
        </div>
      `;
    },
    bind: function () {
      const dnsModeEl = document.getElementById("lan-dns-mode");
      dnsModeEl.addEventListener("change", function () {
        document.getElementById("lan-dns-static-row").style.display = dnsModeEl.value === "Static" ? "" : "none";
      });

      document.getElementById("lan-btn-apply").addEventListener("click", function () {
        const lan = window.SimState.lan;
        lan.ip = document.getElementById("lan-ip").value.trim() || "192.168.1.1";
        lan.mask = document.getElementById("lan-mask").value.trim() || "255.255.255.0";
        lan.dhcpEnabled = document.getElementById("lan-dhcp-enable").checked;
        lan.dhcpStart = document.getElementById("lan-dhcp-start").value.trim();
        lan.dhcpEnd = document.getElementById("lan-dhcp-end").value.trim();
        const lease = parseInt(document.getElementById("lan-lease").value, 10);
        if (isNaN(lease) || lease < 1 || lease > 3600) {
          return alert("Thời hạn thuê IP phải từ 1 đến 3600 phút!");
        }
        lan.leaseMin = lease;
        lan.randomIp = document.getElementById("lan-random").checked;
        lan.dnsMode = dnsModeEl.value;
        lan.staticDns1 = document.getElementById("lan-dns1").value.trim();
        lan.staticDns2 = document.getElementById("lan-dns2").value.trim();

        window.SimEngine.addLog("[LAN] Cập nhật DHCP (" + (lan.dhcpEnabled ? "Bật: " + lan.dhcpStart + " -> " + lan.dhcpEnd : "Tắt") + ").");
        window.RouterApp.applyWithFeedback("Đã lưu cấu hình mạng LAN & DHCP!");
      });

      document.getElementById("static-fill-phone").addEventListener("click", function () {
        document.getElementById("static-mac-in").value = window.SimState.simDevices.phone.mac;
        if (!document.getElementById("static-ip-in").value) {
          document.getElementById("static-ip-in").value = "192.168.1.150";
        }
      });

      document.getElementById("static-btn-add").addEventListener("click", function () {
        const lan = window.SimState.lan;
        if (lan.staticLeases.length >= 8) {
          return alert("Bảng cấp phát IP tĩnh chỉ hỗ trợ tối đa 8 thiết bị!");
        }
        const ip = document.getElementById("static-ip-in").value.trim();
        const mac = document.getElementById("static-mac-in").value.trim();
        const ipRegex = /^(\d{1,3}\.){3}\d{1,3}$/;
        const macColonRegex = /^([0-9A-Fa-f]{2}:){5}[0-9A-Fa-f]{2}$/;

        if (!ipRegex.test(ip)) return alert("Địa chỉ IP không hợp lệ!");
        if (!macColonRegex.test(mac)) return alert("Địa chỉ MAC không hợp lệ! Định dạng chuẩn: xx:xx:xx:xx:xx:xx");
        const dup = lan.staticLeases.find((x) => x.ip === ip || x.mac.toLowerCase() === mac.toLowerCase());
        if (dup) return alert("Địa chỉ IP hoặc MAC này đã tồn tại!");

        lan.staticLeases.push({ ip: ip, mac: mac.toLowerCase() });
        window.SimEngine.addLog("[DHCP STATIC] Đã khóa cứng IP " + ip + " cho MAC " + mac.toLowerCase() + ".");
        window.RouterApp.applyWithFeedback("Đã thêm cấp phát IP tĩnh " + ip + "!");
      });

      document.querySelectorAll(".static-del-btn").forEach(function (btn) {
        btn.addEventListener("click", function () {
          const i = parseInt(btn.getAttribute("data-idx"), 10);
          window.SimState.lan.staticLeases.splice(i, 1);
          window.SimEngine.saveState();
          window.RouterApp.renderCurrentPage();
          window.LabUI.render();
        });
      });
    }
  };
})();
