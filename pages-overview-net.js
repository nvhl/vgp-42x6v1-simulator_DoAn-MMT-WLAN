/* ==========================================================================
   pages-overview-net.js — Renderers & Handlers for Overview (4 pages) & Mạng (2 pages)
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

  function formatUptime(sec) {
    const d = Math.floor(sec / 86400);
    const h = Math.floor((sec % 86400) / 3600);
    const m = Math.floor((sec % 3600) / 60);
    const s = sec % 60;
    return d + " ngày " + h + " giờ " + m + " phút " + s + " giây";
  }

  // --------------------------------------------------------------------------
  // 1. Cài đặt nhanh (/cgi-bin/home.asp)
  // --------------------------------------------------------------------------
  window.RouterPages["home"] = {
    title: "Cài đặt nhanh",
    group: "Tổng quan",
    cgi: "/cgi-bin/home.asp",
    render: function () {
      const st = window.SimState;
      const wan = st.wanList[0];
      const s24 = st.wifi24.ssids[0];
      const s5 = st.wifi5.ssids[0];

      return `
        <div class="vht-notice">
          Trang <strong>Cài đặt nhanh</strong> gom các thông số thiết yếu nhất (Tài khoản Internet, Gộp băng tần <strong>Chuyển băng tự động / Band Steering</strong>, Tên &amp; Mật khẩu Wi-Fi và Mật khẩu quản trị).
        </div>

        <div class="vht-card">
          <div class="vht-card-header">Cài đặt chuyển băng tự động (Band Steering)</div>
          <div class="vht-card-body">
            <table class="form-table">
              <tr>
                <th>Chuyển băng tự động:</th>
                <td>
                  <label class="check-item">
                    <input type="checkbox" id="qs-band-steering" ${st.bandSteering ? "checked" : ""} />
                    <strong>Kích hoạt (Gộp chung tên &amp; mật khẩu Wi-Fi 2.4GHz và 5GHz)</strong>
                  </label>
                  <div class="field-hint" style="margin-left:0;margin-top:4px;">
                    Khi <strong>Bật</strong>: Router phát chung 1 tên Wi-Fi duy nhất và tự điều hướng thiết bị giữa 5GHz (ở gần) và 2.4GHz (ở xa). Khi <strong>Tắt</strong>: Tách riêng 2 tên mạng 2.4GHz và 5GHz độc lập.
                  </div>
                </td>
              </tr>
            </table>
          </div>
        </div>

        <div class="vht-card" id="qs-wifi-merged" style="display:${st.bandSteering ? "block" : "none"};">
          <div class="vht-card-header">Cài đặt Wi-Fi Chung (2.4GHz &amp; 5GHz Smart Connect)</div>
          <div class="vht-card-body">
            <table class="form-table">
              <tr>
                <th>Tên mạng Wi-Fi (SSID):</th>
                <td><input type="text" class="vht-input" id="qs-merged-ssid" value="${esc(s24.ssid)}" /></td>
              </tr>
              <tr>
                <th>Kiểu bảo mật:</th>
                <td>
                  <select class="vht-select" id="qs-merged-auth">
                    <option value="WPA2-PSK" ${s24.auth === "WPA2-PSK" ? "selected" : ""}>WPA2-PSK</option>
                    <option value="WPA2-PSK/WPA3-SAE" ${s24.auth === "WPA2-PSK/WPA3-SAE" ? "selected" : ""}>WPA2-PSK/WPA3-SAE</option>
                    <option value="WPA3-SAE" ${s24.auth === "WPA3-SAE" ? "selected" : ""}>WPA3-SAE</option>
                  </select>
                </td>
              </tr>
              <tr>
                <th>Mật khẩu Wi-Fi:</th>
                <td>
                  <input type="text" class="vht-input" id="qs-merged-key" value="${esc(s24.key)}" />
                  <span class="field-hint">(8 – 63 ký tự)</span>
                </td>
              </tr>
            </table>
          </div>
        </div>

        <div id="qs-wifi-split" style="display:${st.bandSteering ? "none" : "block"};">
          <div class="vht-card">
            <div class="vht-card-header">Cài đặt nhanh Wi-Fi 2.4GHz (SSID1)</div>
            <div class="vht-card-body">
              <table class="form-table">
                <tr>
                  <th>Tên Wi-Fi 2.4GHz (SSID1):</th>
                  <td><input type="text" class="vht-input" id="qs-24-ssid" value="${esc(s24.ssid)}" /></td>
                </tr>
                <tr>
                  <th>Mật khẩu Wi-Fi 2.4GHz:</th>
                  <td><input type="text" class="vht-input" id="qs-24-key" value="${esc(s24.key)}" /></td>
                </tr>
              </table>
            </div>
          </div>

          <div class="vht-card">
            <div class="vht-card-header">Cài đặt nhanh Wi-Fi 5GHz (SSIDAC1)</div>
            <div class="vht-card-body">
              <table class="form-table">
                <tr>
                  <th>Tên Wi-Fi 5GHz (SSIDAC1):</th>
                  <td><input type="text" class="vht-input" id="qs-5-ssid" value="${esc(s5.ssid)}" /></td>
                </tr>
                <tr>
                  <th>Mật khẩu Wi-Fi 5GHz:</th>
                  <td><input type="text" class="vht-input" id="qs-5-key" value="${esc(s5.key)}" /></td>
                </tr>
              </table>
            </div>
          </div>
        </div>

        <div class="vht-card">
          <div class="vht-card-header">Tài khoản đường truyền Internet (WAN PPPoE) &amp; Quản trị nhanh</div>
          <div class="vht-card-body">
            <table class="form-table">
              <tr>
                <th>Tài khoản PPPoE (ISP):</th>
                <td>
                  <input type="text" class="vht-input" id="qs-pppoe-user" value="${esc(wan.pppoeUser)}" />
                  <span class="field-hint">Đồng bộ OMCI (VLAN ${wan.vlanId})</span>
                </td>
              </tr>
              <tr>
                <th>Mật khẩu PPPoE:</th>
                <td><input type="password" class="vht-input" id="qs-pppoe-pass" value="${esc(wan.pppoePass)}" /></td>
              </tr>
              <tr>
                <th>Đổi mật khẩu quản trị (admin):</th>
                <td>
                  <input type="password" class="vht-input" id="qs-admin-newpass" placeholder="Để trống nếu không đổi" />
                  <span class="field-hint">Tối thiểu 8 ký tự (Hoa, thường, số, ký tự đặc biệt)</span>
                </td>
              </tr>
            </table>
            <div class="btn-row">
              <button class="btn-vht" id="qs-btn-apply">ÁP DỤNG</button>
            </div>
          </div>
        </div>
      `;
    },
    bind: function () {
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
          if (!ssid) return alert("Tên mạng Wi-Fi (SSID) không được để trống!");
          if (key.length < 8) return alert("Mật khẩu Wi-Fi phải từ 8 đến 63 ký tự!");
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
          // If user just turned OFF band steering and 5GHz still had identical name, suggest/keep user value
          st.wifi24.ssids[0].ssid = s24;
          st.wifi24.ssids[0].key = k24;
          st.wifi5.ssids[0].ssid = s5;
          st.wifi5.ssids[0].key = k5;
        }

        st.wanList[0].pppoeUser = document.getElementById("qs-pppoe-user").value.trim();
        st.wanList[0].pppoePass = document.getElementById("qs-pppoe-pass").value;

        const newAdminPass = document.getElementById("qs-admin-newpass").value;
        if (newAdminPass) {
          const strong = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/;
          if (!strong.test(newAdminPass)) {
            return alert("Mật khẩu quản trị mới phải tối thiểu 8 ký tự, bao gồm chữ hoa, chữ thường, chữ số và ký tự đặc biệt!");
          }
          st.admin.password = newAdminPass;
        }

        window.SimEngine.reconcileClients();
        window.SimEngine.addLog(
          "[QUICK SETUP] Cập nhật Cài đặt nhanh (Chuyển băng tự động: " + (st.bandSteering ? "Bật" : "Tắt") + ")."
        );
        window.RouterApp.applyWithFeedback("Đã lưu Cài đặt nhanh thành công!", oldSsid !== st.wifi24.ssids[0].ssid);
      });
    }
  };

  // --------------------------------------------------------------------------
  // 2. Thông tin thiết bị (/cgi-bin/deviceinfo.asp)
  // --------------------------------------------------------------------------
  window.RouterPages["deviceinfo"] = {
    title: "Thông tin thiết bị",
    group: "Tổng quan",
    cgi: "/cgi-bin/deviceinfo.asp",
    render: function () {
      const st = window.SimState;
      const dev = st.device;
      const wan0 = st.wanList[0];
      const wan1 = st.wanList[1];
      const rxPower = dev.fiberFault ? "-31.85 dBm (Suy hao vượt ngưỡng -27 dBm!)" : "-21.14 dBm (Tín hiệu tốt: -8 ~ -27 dBm)";
      const txPower = dev.fiberFault ? "-40.00 dBm (Mất đồng bộ quang)" : "+2.35 dBm (Bình thường)";
      const ponState = dev.fiberFault ? "O1 / LOS (Mất tín hiệu ánh sáng!)" : "O5 (Đã đồng bộ - Associated)";
      const lan1Connected = st.simDevices.laptopObs.connMode === "LAN1";
      const lan2Connected = st.simDevices.desktopVm.connected;

      return `
        <div class="vht-card">
          <div class="vht-card-header">
            <span>1. Thông tin chung &amp; Tài nguyên hệ thống</span>
            <span class="badge-pill gray">Chỉ đọc (Read-only)</span>
          </div>
          <div class="vht-card-body">
            <table class="form-table">
              <tr><th>Tên thiết bị:</th><td><strong>${esc(dev.name)}</strong></td></tr>
              <tr><th>Mã Model / Nhà sản xuất:</th><td><strong>${esc(dev.model)}</strong> — VHT (Viettel High Tech) | P/N: ${esc(dev.partNumber)} | HW: ${esc(dev.hwVersion)}</td></tr>
              <tr><th>Phiên bản Firmware:</th><td><strong>${esc(dev.firmware)}</strong></td></tr>
              <tr><th>GPON Serial Number:</th><td><code>${esc(dev.gponSN)}</code></td></tr>
              <tr><th>Địa chỉ MAC (LAN / WAN):</th><td><code>${esc(dev.macLan)}</code> / <code>${esc(dev.macWan)}</code></td></tr>
              <tr><th>Thời gian hoạt động (Uptime):</th><td id="devinfo-uptime">${formatUptime(dev.uptimeSec)}</td></tr>
              <tr>
                <th>Tải CPU:</th>
                <td>
                  <div class="meter-wrap">
                    <div class="meter-bar"><div class="meter-fill ${dev.cpuLoad > 85 ? "high" : ""}" style="width:${dev.cpuLoad}%;"></div></div>
                    <strong>${dev.cpuLoad}%</strong>
                  </div>
                </td>
              </tr>
              <tr>
                <th>Bộ nhớ đã dùng (RAM):</th>
                <td>
                  <div class="meter-wrap">
                    <div class="meter-bar"><div class="meter-fill ${dev.ramUsage > 85 ? "high" : ""}" style="width:${dev.ramUsage}%;"></div></div>
                    <strong>${dev.ramUsage}%</strong>
                  </div>
                </td>
              </tr>
            </table>
          </div>
        </div>

        <div class="vht-card">
          <div class="vht-card-header">2. Trạng thái cổng Ethernet (LAN1 – LAN4) &amp; Địa chỉ mạng LAN</div>
          <div class="vht-card-body">
            <table class="data-table" style="margin-bottom:12px;">
              <thead>
                <tr>
                  <th>Cổng vật lý</th>
                  <th>Trạng thái kết nối</th>
                  <th>Tốc độ thương lượng</th>
                  <th>Chế độ Duplex</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td><strong>LAN 1</strong></td>
                  <td>${lan1Connected ? '<span class="badge-pill green">Đã kết nối (Up)</span>' : '<span class="badge-pill gray">Không kết nối (Down)</span>'}</td>
                  <td>${lan1Connected ? "1000 Mbps (1 Gbps)" : "---"}</td>
                  <td>${lan1Connected ? "Full Duplex" : "---"}</td>
                </tr>
                <tr>
                  <td><strong>LAN 2</strong></td>
                  <td>${lan2Connected ? '<span class="badge-pill green">Đã kết nối (Up - VMware Bridged)</span>' : '<span class="badge-pill gray">Không kết nối (Down)</span>'}</td>
                  <td>${lan2Connected ? "1000 Mbps (1 Gbps)" : "---"}</td>
                  <td>${lan2Connected ? "Full Duplex" : "---"}</td>
                </tr>
                <tr>
                  <td><strong>LAN 3</strong></td>
                  <td><span class="badge-pill gray">Không kết nối (Down)</span></td>
                  <td>---</td>
                  <td>---</td>
                </tr>
                <tr>
                  <td><strong>LAN 4</strong></td>
                  <td><span class="badge-pill gray">Không kết nối (Down)</span></td>
                  <td>---</td>
                  <td>---</td>
                </tr>
              </tbody>
            </table>
            <table class="form-table">
              <tr><th>Địa chỉ LAN IPv4 / Subnet Mask:</th><td><code>${esc(st.lan.ip)}</code> / <code>${esc(st.lan.mask)}</code> (DHCP Server: <strong>${st.lan.dhcpEnabled ? "Bật" : "Tắt"}</strong>)</td></tr>
              <tr><th>Địa chỉ LAN IPv6 (Link-Local):</th><td><code>fe80::260b:2bff:fe39:d5bc/64</code></td></tr>
              <tr><th>Địa chỉ LAN IPv6 (Global):</th><td><code>2402:800:63a1:1200::1/64</code></td></tr>
            </table>
          </div>
        </div>

        <div class="vht-card">
          <div class="vht-card-header">3. Thông tin PON / GPON &amp; Module quang Transceiver</div>
          <div class="vht-card-body">
            <table class="form-table">
              <tr><th>Trạng thái đăng ký PON:</th><td><span class="${dev.fiberFault ? "badge-err" : "badge-ok"}">${ponState}</span></td></tr>
              <tr><th>Loại tổng đài phía nhà mạng (OLT):</th><td><strong>OLT ZTE (ZTEG)</strong></td></tr>
              <tr><th>Chuẩn Module quang:</th><td><strong>GPON Class B+ (SC/APC)</strong></td></tr>
              <tr>
                <th>Công suất thu quang (Rx Power):</th>
                <td><span class="${dev.fiberFault ? "badge-err" : "badge-ok"}">${rxPower}</span></td>
              </tr>
              <tr>
                <th>Công suất phát quang (Tx Power):</th>
                <td><span class="${dev.fiberFault ? "badge-err" : "badge-ok"}">${txPower}</span></td>
              </tr>
              <tr><th>Nhiệt độ chip quang (Transceiver Temp):</th><td>54.8 °C</td></tr>
              <tr><th>Điện áp cung cấp nội / Dòng phân cực Laser:</th><td>3290 mV (3.29 V) &nbsp;|&nbsp; 11.4 mA <span class="field-hint">(Thông số linh kiện laser phục vụ kỹ thuật viên ISP)</span></td></tr>
            </table>
          </div>
        </div>

        <div class="vht-card">
          <div class="vht-card-header">4. Trạng thái WAN IPv4/IPv6 &amp; Quản lý từ xa TR-069 / TMS</div>
          <div class="vht-card-body">
            <table class="data-table" style="margin-bottom:12px;">
              <thead>
                <tr>
                  <th>Tên giao diện WAN</th>
                  <th>Chế độ / Giao thức</th>
                  <th>VLAN ID</th>
                  <th>Trạng thái</th>
                  <th>Địa chỉ IPv4 / DNS</th>
                  <th>Địa chỉ IPv6</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td><strong>${esc(wan0.id)}</strong></td>
                  <td>${esc(wan0.mode)} / ${esc(wan0.connType)}</td>
                  <td>${wan0.vlanId}</td>
                  <td>${dev.fiberFault ? '<span class="badge-pill red">Mất kết nối</span>' : '<span class="badge-pill green">' + esc(wan0.status) + "</span>"}</td>
                  <td>${dev.fiberFault ? "0.0.0.0" : esc(wan0.wanIp)} <br/><small>DNS: ${esc(wan0.dns1)}, ${esc(wan0.dns2)}</small></td>
                  <td><small>${dev.fiberFault ? "---" : esc(wan0.wanIpv6)}</small></td>
                </tr>
                ${
                  wan1
                    ? `<tr>
                  <td><strong>${esc(wan1.id)}</strong></td>
                  <td>${esc(wan1.mode)} / ${esc(wan1.connType)}</td>
                  <td>${wan1.vlanId}</td>
                  <td>${dev.fiberFault ? '<span class="badge-pill red">Mất kết nối</span>' : '<span class="badge-pill green">Đã kết nối</span>'}</td>
                  <td>${dev.fiberFault ? "0.0.0.0" : esc(wan1.wanIp)}</td>
                  <td>N/A</td>
                </tr>`
                    : ""
                }
              </tbody>
            </table>
            <table class="form-table">
              <tr>
                <th>Trạng thái TR-069 / TMS:</th>
                <td><span class="badge-ok">Đã đồng bộ ACS Viettel TMS</span> — Cho phép tổng đài hỗ trợ chẩn đoán &amp; cấu hình từ xa qua VLAN 2501.</td>
              </tr>
            </table>
          </div>
        </div>
      `;
    },
    bind: function () {}
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
          name: st.simDevices.laptopObs.name + " (Máy đang cấu hình)",
          port: "LAN1",
          mac: st.simDevices.laptopObs.mac,
          ip: st.simDevices.laptopObs.ip,
          speed: "1000 Mbps"
        });
      }
      if (st.simDevices.desktopVm.connected) {
        lanClients.push({
          name: st.simDevices.desktopVm.name + " (VMware Bridged)",
          port: "LAN2 (Bridged)",
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
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px;">
          <div class="field-hint" style="margin:0;">
            Hiển thị danh sách thời gian thực các thiết bị trong mạng <strong>Infrastructure</strong> (cổng dây LAN, sóng Wi-Fi 2.4GHz và Wi-Fi 5GHz).
          </div>
          <button class="btn-vht small" id="sta-btn-reload">TẢI LẠI</button>
        </div>

        ${
          schedOff
            ? `<div class="vht-notice warn"><strong>Lập lịch Wi-Fi đang kích hoạt (${esc(schedOff.name)}: ${schedOff.start} – ${schedOff.end}):</strong> Toàn bộ sóng Wi-Fi 2.4GHz &amp; 5GHz hiện đang tạm ngắt theo lịch hẹn!</div>`
            : ""
        }

        <div class="vht-card">
          <div class="vht-card-header">1. Thiết bị kết nối qua cổng dây Ethernet (LAN1 – LAN4)</div>
          <div class="vht-card-body">
            <table class="data-table">
              <thead>
                <tr>
                  <th>STT</th>
                  <th>Tên thiết bị (Hostname)</th>
                  <th>Cổng</th>
                  <th>Địa chỉ MAC</th>
                  <th>Địa chỉ IP</th>
                  <th>Tốc độ liên kết</th>
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
                    <td><code>${esc(c.mac)}</code> <button class="btn-icon copy-mac-btn" data-mac="${esc(c.mac)}" title="Copy MAC">📋 Copy</button></td>
                    <td><strong>${esc(c.ip)}</strong></td>
                    <td><span class="badge-pill green">${esc(c.speed)}</span></td>
                  </tr>`
                        )
                        .join("")
                }
              </tbody>
            </table>
          </div>
        </div>

        <div class="vht-card">
          <div class="vht-card-header">2. Thiết bị đang kết nối Wi-Fi 2.4GHz (${esc(st.wifi24.mode)} | ${esc(st.wifi24.bandwidth)})</div>
          <div class="vht-card-body">
            <table class="data-table">
              <thead>
                <tr>
                  <th>STT</th>
                  <th>Tên thiết bị</th>
                  <th>SSID</th>
                  <th>Địa chỉ MAC</th>
                  <th>Địa chỉ IP</th>
                  <th>Cường độ sóng RSSI (dBm)</th>
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
                    <td><code>${esc(c.mac)}</code> <button class="btn-icon copy-mac-btn" data-mac="${esc(c.mac)}">📋 Copy</button></td>
                    <td><strong>${esc(c.ip)}</strong></td>
                    <td>${esc(c.rssi)}</td>
                    <td><span class="badge-pill gray">${esc(c.speed)}</span></td>
                  </tr>`
                        )
                        .join("")
                }
              </tbody>
            </table>
          </div>
        </div>

        <div class="vht-card">
          <div class="vht-card-header">3. Thiết bị đang kết nối Wi-Fi 5GHz (${esc(st.wifi5.mode)} | ${esc(st.wifi5.bandwidth)})</div>
          <div class="vht-card-body">
            <table class="data-table">
              <thead>
                <tr>
                  <th>STT</th>
                  <th>Tên thiết bị</th>
                  <th>SSID</th>
                  <th>Địa chỉ MAC</th>
                  <th>Địa chỉ IP</th>
                  <th>Cường độ sóng RSSI (dBm)</th>
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
                    <td><code>${esc(c.mac)}</code> <button class="btn-icon copy-mac-btn" data-mac="${esc(c.mac)}">📋 Copy</button></td>
                    <td><strong>${esc(c.ip)}</strong></td>
                    <td><span class="badge-ok">${esc(c.rssi)}</span></td>
                    <td><span class="badge-pill green">${esc(c.speed)}</span></td>
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
        // Refresh DHCP lease calculation on reload
        const p = window.SimState.simDevices.phone;
        if (p.connected) {
          p.ip = window.SimEngine.allocateDhcpIpForMac(p.mac, p.ip);
        }
        window.SimEngine.saveState();
        window.RouterApp.showToast("Đã tải lại danh sách thiết bị đang kết nối!");
        window.RouterApp.renderCurrentPage();
        window.LabUI.render();
      });

      document.querySelectorAll(".copy-mac-btn").forEach(function (btn) {
        btn.addEventListener("click", function () {
          const mac = btn.getAttribute("data-mac");
          if (navigator.clipboard) navigator.clipboard.writeText(mac);
          window.RouterApp.showToast("Đã copy địa chỉ MAC: " + mac);
        });
      });
    }
  };

  // --------------------------------------------------------------------------
  // 4. Topology hiện tại (/cgi-bin/wifi-mesh-topology.asp)
  // --------------------------------------------------------------------------
  window.RouterPages["wifi-mesh-topology"] = {
    title: "Topology hiện tại (Runtime EasyMesh Topology)",
    group: "Tổng quan",
    cgi: "/cgi-bin/wifi-mesh-topology.asp",
    render: function () {
      const st = window.SimState;
      const clients = [];
      if (st.simDevices.laptopObs.connMode === "LAN1") {
        clients.push({ name: st.simDevices.laptopObs.name, link: "Cáp LAN1 (1000 Mbps)", ip: st.simDevices.laptopObs.ip });
      }
      if (st.simDevices.desktopVm.connected) {
        clients.push({ name: st.simDevices.desktopVm.name, link: "LAN Bridged (1000 Mbps)", ip: st.simDevices.desktopVm.ip });
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
            <span>Sơ đồ cây mạng trực quan (EasyMesh Runtime Topology)</span>
            <div>
              <button class="btn-vht outline small" id="topo-toggle-agent">
                ${st.mesh.demoAgentConnected ? "Ẩn Node Mesh Vệ Tinh mẫu" : "+ Giả lập thêm 1 Node Mesh Agent (Tầng 2)"}
              </button>
              <button class="btn-vht small" id="topo-refresh">LÀM MỚI SƠ ĐỒ</button>
            </div>
          </div>
          <div class="vht-card-body">
            <div class="topo-canvas">
              <div class="topo-node">
                <div style="font-size:11px;color:#ee0033;font-weight:800;">EASYMESH ${esc(st.mesh.role.toUpperCase())}</div>
                <div style="font-size:15px;font-weight:800;margin:3px 0;">Viettel ${esc(st.device.model)}</div>
                <div style="font-size:12px;color:#475569;">IP: ${esc(st.lan.ip)} | MAC: ${esc(st.device.macLan)}</div>
                <div style="font-size:11.5px;color:#16a34a;margin-top:3px;font-weight:700;">PON O5 (-21.14 dBm) • WAN VLAN 35</div>
              </div>

              <div style="color:#64748b;font-size:12px;font-weight:700;">▼ Các thiết bị kết nối trực tiếp (${clients.length} thiết bị) ▼</div>

              <div class="topo-children">
                ${
                  clients.length === 0
                    ? `<div class="field-hint">Chưa có thiết bị khách nào đang kết nối.</div>`
                    : clients
                        .map(
                          (c) => `
                  <div class="topo-client">
                    <div style="font-weight:700;color:#0f172a;">💻 ${esc(c.name)}</div>
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
                <div style="color:#2563eb;font-size:12px;font-weight:700;">▼ Liên kết Backhaul 5GHz (802.11ax -61 dBm | Chung SSID Roaming) ▼</div>
                <div class="topo-node agent">
                  <div style="font-size:11px;color:#2563eb;font-weight:800;">EASYMESH AGENT (VỆ TINH TẦNG 2)</div>
                  <div style="font-size:14px;font-weight:800;margin:3px 0;">Home Wi-Fi Viettel H196A</div>
                  <div style="font-size:12px;color:#475569;">IP: 192.168.1.250 | MAC: 24:0B:2B:88:41:10</div>
                  <div style="font-size:11.5px;color:#2563eb;margin-top:3px;">1 thiết bị đang bám: SmartTV-Tang2 (5GHz -49 dBm)</div>
                </div>
              `
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
        window.RouterApp.showToast("Đã cập nhật sơ đồ cây EasyMesh Topology!");
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
        <div class="vht-notice">
          <strong>Thông báo OMCI từ tổng đài quang (OLT ZTE):</strong> Giao diện <code>1_INTERNET_R_VID_35</code> và <code>7_TR069_R_VID_2501</code> được nhà mạng Viettel tự động đẩy cấu hình xuống qua giao thức quản lý cáp quang <strong>OMCI</strong> ngay cả sau khi Reset cứng!
        </div>

        <div class="vht-card">
          <div class="vht-card-header">Cấu hình kết nối WAN</div>
          <div class="vht-card-body">
            <table class="form-table">
              <tr>
                <th>Tên kết nối WAN:</th>
                <td>
                  <select class="vht-select" id="wan-select-conn">
                    ${st.wanList
                      .map((item, i) => `<option value="${i}" ${i === idx ? "selected" : ""}>${esc(item.id)}</option>`)
                      .join("")}
                  </select>
                </td>
              </tr>
              <tr>
                <th>Chế độ (Mode):</th>
                <td>
                  <select class="vht-select" id="wan-mode">
                    <option value="Route" ${w.mode === "Route" ? "selected" : ""}>Route (Định tuyến &amp; Cấp phát NAT)</option>
                    <option value="Bridge" ${w.mode === "Bridge" ? "selected" : ""}>Bridge (Cầu nối quang sang Router ngoài)</option>
                  </select>
                </td>
              </tr>
              <tr>
                <th>Phiên bản IP:</th>
                <td>
                  <select class="vht-select" id="wan-ipver">
                    <option value="IPv4" ${w.ipVersion === "IPv4" ? "selected" : ""}>IPv4</option>
                    <option value="IPv6" ${w.ipVersion === "IPv6" ? "selected" : ""}>IPv6</option>
                    <option value="IPv4/IPv6" ${w.ipVersion === "IPv4/IPv6" ? "selected" : ""}>IPv4/IPv6 (Dual-Stack)</option>
                  </select>
                </td>
              </tr>
              <tr id="wan-row-conntype" style="display:${w.mode === "Bridge" ? "none" : ""};">
                <th>Chế độ kết nối:</th>
                <td>
                  <select class="vht-select" id="wan-conntype">
                    <option value="PPPoE" ${w.connType === "PPPoE" ? "selected" : ""}>PPPoE (Xác thực tài khoản ISP)</option>
                    <option value="DHCP" ${w.connType === "DHCP" ? "selected" : ""}>DHCP (Nhận IP WAN tự động)</option>
                    <option value="Static" ${w.connType === "Static" ? "selected" : ""}>Static (Gán IP WAN tĩnh)</option>
                    <option value="PPPoA" ${w.connType === "PPPoA" ? "selected" : ""}>PPPoA (Cáp đồng ADSL cũ)</option>
                    <option value="IPoA" ${w.connType === "IPoA" ? "selected" : ""}>IPoA (Cáp đồng ADSL cũ)</option>
                  </select>
                </td>
              </tr>
              <tr class="wan-pppoe-only" style="display:${w.mode === "Route" && w.connType === "PPPoE" ? "" : "none"};">
                <th>Tài khoản PPPoE:</th>
                <td><input type="text" class="vht-input" id="wan-user" value="${esc(w.pppoeUser)}" /></td>
              </tr>
              <tr class="wan-pppoe-only" style="display:${w.mode === "Route" && w.connType === "PPPoE" ? "" : "none"};">
                <th>Mật khẩu PPPoE:</th>
                <td><input type="password" class="vht-input" id="wan-pass" value="${esc(w.pppoePass)}" /></td>
              </tr>
              <tr>
                <th>Kích thước gói tối đa (MTU):</th>
                <td>
                  <input type="number" class="vht-input short" id="wan-mtu" value="${w.mtu}" />
                  <span class="field-hint">bytes (Chuẩn PPPoE = <strong>1492</strong> do trừ 8 byte PPPoE header; Ethernet DHCP/Static = 1500)</span>
                </td>
              </tr>
              <tr>
                <th>Cơ chế NAT &amp; IGMP Proxy:</th>
                <td>
                  <div class="check-grid">
                    <label class="check-item"><input type="checkbox" id="wan-nat" ${w.nat ? "checked" : ""} /> Kích hoạt NAT</label>
                    <label class="check-item"><input type="checkbox" id="wan-igmp" ${w.igmpProxy ? "checked" : ""} /> Kích hoạt IGMP Proxy (IPTV)</label>
                  </div>
                </td>
              </tr>
              <tr>
                <th>Tùy chọn VLAN:</th>
                <td>
                  <select class="vht-select" id="wan-vlan-mode" style="min-width:120px;width:130px;">
                    <option value="TAG" ${w.vlanMode === "TAG" ? "selected" : ""}>TAG</option>
                    <option value="UNTAG" ${w.vlanMode === "UNTAG" ? "selected" : ""}>UNTAG</option>
                  </select>
                  &nbsp; VLAN ID:
                  <input type="number" class="vht-input short" id="wan-vlan-id" value="${w.vlanId}" />
                  &nbsp; 802.1p:
                  <input type="number" class="vht-input short" id="wan-pbit" value="${w.pbit}" style="width:70px;min-width:70px;" />
                </td>
              </tr>
              <tr>
                <th>Port Binding (Ánh xạ cổng):</th>
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
            <div class="btn-row">
              <button class="btn-vht" id="wan-btn-apply">ÁP DỤNG</button>
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
          <div class="vht-card-header">1. Cấu hình IPv4 LAN &amp; Máy chủ cấp phát IP động (DHCP Server)</div>
          <div class="vht-card-body">
            <table class="form-table">
              <tr>
                <th>Địa chỉ IP (Default Gateway):</th>
                <td><input type="text" class="vht-input med" id="lan-ip" value="${esc(lan.ip)}" /></td>
              </tr>
              <tr>
                <th>Mặt nạ mạng con (Subnet Mask):</th>
                <td><input type="text" class="vht-input med" id="lan-mask" value="${esc(lan.mask)}" /> <span class="field-hint">(/24 — Tối đa 254 host)</span></td>
              </tr>
              <tr>
                <th>DHCP Server:</th>
                <td>
                  <label class="check-item">
                    <input type="checkbox" id="lan-dhcp-enable" ${lan.dhcpEnabled ? "checked" : ""} />
                    <strong>Bật DHCP Server</strong> (Tự động cấp phát IP cho thiết bị tham gia mạng)
                  </label>
                </td>
              </tr>
              <tr>
                <th>Dải cấp phát DHCP (DHCP Pool):</th>
                <td>
                  Từ <input type="text" class="vht-input med" id="lan-dhcp-start" value="${esc(lan.dhcpStart)}" />
                  đến <input type="text" class="vht-input med" id="lan-dhcp-end" value="${esc(lan.dhcpEnd)}" />
                </td>
              </tr>
              <tr>
                <th>Thời hạn thuê IP (Lease Time):</th>
                <td>
                  <input type="number" class="vht-input short" id="lan-lease" value="${lan.leaseMin}" />
                  <span class="field-hint">phút (1 – 3600 phút; mặc định 1440 phút = 24 giờ)</span>
                </td>
              </tr>
              <tr>
                <th>Cấp phát IP ngẫu nhiên:</th>
                <td>
                  <label class="check-item">
                    <input type="checkbox" id="lan-random" ${lan.randomIp ? "checked" : ""} />
                    Phát số IP ngẫu nhiên trong dải thay vì cấp tuần tự
                  </label>
                </td>
              </tr>
              <tr>
                <th>Chế độ DNS:</th>
                <td>
                  <select class="vht-select" id="lan-dns-mode">
                    <option value="Proxy" ${lan.dnsMode === "Proxy" ? "selected" : ""}>Proxy (Chuyển tiếp theo DNS cổng WAN nhà mạng)</option>
                    <option value="Static" ${lan.dnsMode === "Static" ? "selected" : ""}>Static (Chỉ định máy chủ DNS cố định)</option>
                  </select>
                </td>
              </tr>
              <tr id="lan-dns-static-row" style="display:${lan.dnsMode === "Static" ? "" : "none"};">
                <th>DNS Chính / DNS Phụ:</th>
                <td>
                  <input type="text" class="vht-input med" id="lan-dns1" value="${esc(lan.staticDns1)}" placeholder="8.8.8.8" />
                  &nbsp;
                  <input type="text" class="vht-input med" id="lan-dns2" value="${esc(lan.staticDns2)}" placeholder="8.8.4.4" />
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
            <span>2. Bảng cấp phát IP tĩnh theo địa chỉ MAC (Tối đa 8 thiết bị)</span>
            <span class="badge-pill gray">${lan.staticLeases.length} / 8 thiết bị</span>
          </div>
          <div class="vht-card-body">
            <table class="form-table" style="margin-bottom:10px;">
              <tr>
                <th>Địa chỉ IP muốn gán cứng:</th>
                <td>
                  <input type="text" class="vht-input med" id="static-ip-in" placeholder="192.168.1.150" />
                  <span class="field-hint">Ví dụ: <code>192.168.1.150</code></span>
                </td>
              </tr>
              <tr>
                <th>Địa chỉ vật lý MAC:</th>
                <td>
                  <input type="text" class="vht-input med" id="static-mac-in" placeholder="a4:83:e7:12:34:56" />
                  <button type="button" class="btn-icon" id="static-fill-phone" title="Điền nhanh MAC của Điện thoại thử nghiệm">
                    📱 Điền nhanh MAC Điện thoại (${esc(phone.mac)})
                  </button>
                </td>
              </tr>
            </table>
            <div class="btn-row" style="margin-bottom:14px;">
              <button class="btn-vht" id="static-btn-add">THÊM &amp; ÁP DỤNG</button>
            </div>

            <table class="data-table">
              <thead>
                <tr>
                  <th>STT</th>
                  <th>Địa chỉ IP cố định</th>
                  <th>Địa chỉ MAC thiết bị</th>
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
          <div class="vht-card-header">3. Cấu hình IPv6 LAN (SLAAC / Router Advertisement &amp; DHCPv6)</div>
          <div class="vht-card-body">
            <table class="form-table">
              <tr>
                <th>Cấp phát địa chỉ IPv6 nội bộ:</th>
                <td>
                  <div class="check-grid">
                    <label class="check-item"><input type="checkbox" checked disabled /> Kích hoạt SLAAC (Router Advertisement)</label>
                    <label class="check-item"><input type="checkbox" checked disabled /> Kích hoạt DHCPv6 Server</label>
                  </div>
                </td>
              </tr>
              <tr>
                <th>Cờ RA (Managed / Other / EUI-64):</th>
                <td><span class="field-hint" style="margin:0;">Đồng bộ tự động từ Prefix Delegation cổng WAN nhà mạng (${esc(lan.ipv6Prefix)}) — Khuyến nghị giữ mặc định.</span></td>
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
          return alert("Thời hạn thuê IP (Lease Time) phải nằm trong khoảng từ 1 đến 3600 phút!");
        }
        lan.leaseMin = lease;
        lan.randomIp = document.getElementById("lan-random").checked;
        lan.dnsMode = dnsModeEl.value;
        lan.staticDns1 = document.getElementById("lan-dns1").value.trim();
        lan.staticDns2 = document.getElementById("lan-dns2").value.trim();

        window.SimEngine.addLog(
          "[LAN] Cập nhật DHCP (" + (lan.dhcpEnabled ? "Bật: " + lan.dhcpStart + " -> " + lan.dhcpEnd : "Tắt") + ")."
        );
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

        if (!ipRegex.test(ip)) {
          return alert("Địa chỉ IP không hợp lệ! Ví dụ hợp lệ: 192.168.1.150");
        }
        if (!macColonRegex.test(mac)) {
          return alert("Địa chỉ MAC không hợp lệ! Vui lòng nhập định dạng xx:xx:xx:xx:xx:xx (ngăn cách bằng dấu hai chấm ':').");
        }
        const dup = lan.staticLeases.find((x) => x.ip === ip || x.mac.toLowerCase() === mac.toLowerCase());
        if (dup) {
          return alert("Địa chỉ IP hoặc địa chỉ MAC này đã tồn tại trong bảng cấp phát tĩnh!");
        }

        lan.staticLeases.push({ ip: ip, mac: mac.toLowerCase() });
        window.SimEngine.addLog("[DHCP STATIC] Đã khóa cứng IP " + ip + " cho địa chỉ MAC " + mac.toLowerCase() + ".");
        window.RouterApp.applyWithFeedback(
          "Đã thêm cấp phát IP tĩnh " + ip + "! Hãy tắt/bật lại Wi-Fi trên Điện thoại mô phỏng để nhận IP mới."
        );
      });

      document.querySelectorAll(".static-del-btn").forEach(function (btn) {
        btn.addEventListener("click", function () {
          const i = parseInt(btn.getAttribute("data-idx"), 10);
          const removed = window.SimState.lan.staticLeases.splice(i, 1)[0];
          if (removed) {
            window.SimEngine.addLog("[DHCP STATIC] Đã xóa gán IP tĩnh " + removed.ip + " (" + removed.mac + ").");
          }
          window.SimEngine.saveState();
          window.RouterApp.renderCurrentPage();
          window.LabUI.render();
        });
      });
    }
  };
})();
