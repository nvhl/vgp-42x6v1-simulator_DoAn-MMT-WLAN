/* ==========================================================================
   pages-overview-net.js — Renderers & Handlers for Overview (4 pages) & Mạng (2 pages)
   Matches Real VHT ONT Firmware V1302250508 HTML Structure, Headers, Legends & Controls
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
  // 1. Cài đặt nhanh (/cgi-bin/home.asp)
  //    Headers: ['Wi-Fi', 'WAN PPPoE', 'Thay đổi mật khẩu']
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
                      <th>Kiểu xác thực</th>
                      <td>
                        <select class="vht-select" id="qs-24-auth">
                          ${authOptions.map((a) => `<option value="${a}" ${s24.auth === a ? "selected" : ""}>${a}</option>`).join("")}
                        </select>
                      </td>
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
                      <th>Kiểu xác thực</th>
                      <td>
                        <select class="vht-select" id="qs-5-auth">
                          ${authOptions.map((a) => `<option value="${a}" ${s5.auth === a ? "selected" : ""}>${a}</option>`).join("")}
                        </select>
                      </td>
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
                  ${switchHtml("qs-band-steering", st.bandSteering)}
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
          const a24 = document.getElementById("qs-24-auth").value;
          const s5 = document.getElementById("qs-5-ssid").value.trim();
          const k5 = document.getElementById("qs-5-key").value;
          const a5 = document.getElementById("qs-5-auth").value;
          if (!s24 || !s5) return alert("Tên Wi-Fi không được để trống!");
          if ((a24 !== "OPEN" && k24.length < 8) || (a5 !== "OPEN" && k5.length < 8)) {
            return alert("Mật khẩu Wi-Fi phải có ít nhất 8 ký tự!");
          }
          st.wifi24.ssids[0].ssid = s24;
          st.wifi24.ssids[0].key = k24;
          st.wifi24.ssids[0].auth = a24;
          st.wifi5.ssids[0].ssid = s5;
          st.wifi5.ssids[0].key = k5;
          st.wifi5.ssids[0].auth = a5;
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
  // 2. Thông tin thiết bị (/cgi-bin/deviceinfo.asp)
  //    Exact 7 Widgets: 'Thông tin cơ bản', 'Thông tin thiết bị', 'LAN', 'TR069', 'TMS', 'WAN', 'Thông tin PON'
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
      const ponState = dev.fiberFault ? "Kết nối thất bại (O1)" : "Kết nối thành công (O5)";
      const netState = dev.fiberFault ? "Kết nối thất bại" : "Kết nối thành công";
      const lan1Up = st.simDevices.laptopObs.connMode === "LAN1";
      const lan2Up = st.simDevices.desktopVm.connected;

      return `
        <!-- Widget 1: Thông tin cơ bản (2 Columns: Thông tin PON & Thông tin kết nối Internet) -->
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
                    <td><span class="${dev.fiberFault ? "badge-err" : "badge-ok"}">${dev.fiberFault ? "Lỗi" : esc(wan0.wanIp)}</span></td>
                  </tr>
                  <tr>
                    <th>Địa chỉ IPv6</th>
                    <td>
                      <div class="${dev.fiberFault ? "badge-err" : "badge-ok"}" style="max-width:230px;overflow-x:auto;white-space:nowrap;padding-bottom:3px;">
                        ${dev.fiberFault ? "Lỗi" : esc(wan0.wanIpv6)}
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

        <!-- 2-Column Layout matching col-xl-6 Left & col-xl-6 Right in deviceinfo.asp -->
        <div class="vht-grid-2col">
          <!-- LEFT COLUMN: Thông tin thiết bị, LAN, TR069, TMS -->
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
              </div>
            </div>

            <div class="sec-heading">LAN</div>
            <div class="vht-card">
              <div class="vht-card-body">
                <div class="sub-heading" style="margin-top:0;">Trạng thái cổng Ethernet</div>
                <table class="simple-table table-bordered-radius" style="width:100%;margin-bottom:14px;">
                  <thead>
                    <tr>
                      <th>LAN1</th>
                      <th>LAN2</th>
                      <th>LAN3</th>
                      <th>LAN4</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>${lan1Up ? "Kết nối" : "Ngắt kết nối"}</td>
                      <td>${lan2Up ? "Kết nối" : "Ngắt kết nối"}</td>
                      <td>Ngắt kết nối</td>
                      <td>Ngắt kết nối</td>
                    </tr>
                    <tr>
                      <td>${lan1Up ? "1000Mbps - Full" : "N/A"}</td>
                      <td>${lan2Up ? "1000Mbps - Full" : "N/A"}</td>
                      <td>N/A</td>
                      <td>N/A</td>
                    </tr>
                  </tbody>
                </table>

                <div class="sub-heading">IPv4</div>
                <table class="form-table">
                  <tr><th>Địa chỉ</th><td>${esc(st.lan.ip)}</td></tr>
                  <tr><th>Mặt nạ mạng con</th><td>${esc(st.lan.mask)}</td></tr>
                  <tr><th>Máy chủ DHCP</th><td>${st.lan.dhcpEnabled ? "Bật" : "Tắt"}</td></tr>
                </table>

                <div class="sub-heading">IPv6</div>
                <table class="form-table">
                  <tr><th>Địa chỉ Link Local</th><td>fe80::1/64</td></tr>
                  <tr>
                    <th>Địa chỉ Global</th>
                    <td>
                      <div style="max-width:230px;overflow-x:auto;white-space:nowrap;padding-bottom:3px;">
                        2402:800:638a:b6ea:260b:2bff:fe39:d5bc/64
                      </div>
                    </td>
                  </tr>
                  <tr><th>Máy chủ DHCPv6</th><td>Bật</td></tr>
                </table>
              </div>
            </div>

            <div class="sec-heading">TR069</div>
            <div class="vht-card">
              <div class="vht-card-body">
                <table class="form-table">
                  <tr><th>Trạng thái TR069</th><td>Đã nhận thông tin từ ACS</td></tr>
                  <tr><th>Địa chỉ IP giao diện TR069</th><td>10.215.142.88</td></tr>
                </table>
              </div>
            </div>

            <div class="sec-heading">TMS</div>
            <div class="vht-card">
              <div class="vht-card-body">
                <table class="form-table">
                  <tr><th>Trạng thái TMS</th><td>Đã kết nối</td></tr>
                </table>
              </div>
            </div>
          </div>

          <!-- RIGHT COLUMN: WAN, Thông tin PON -->
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
                  <tr><th>DNS phụ</th><td>${esc(wan.dns2 || "")}</td></tr>
                </table>

                <div class="sub-heading">IPv6</div>
                <table class="form-table">
                  <tr><th>Trạng thái</th><td>${wan.ipVersion.includes("IPv6") && !dev.fiberFault ? "Kết nối" : "Ngắt kết nối"}</td></tr>
                  <tr>
                    <th>Địa chỉ IP</th>
                    <td>
                      <div style="max-width:230px;overflow-x:auto;white-space:nowrap;padding-bottom:3px;">
                        ${esc(wan.wanIpv6)}
                      </div>
                    </td>
                  </tr>
                  <tr><th>Độ dài prefix</th><td>64</td></tr>
                  <tr><th>Gateway mặc định</th><td>fe80::1</td></tr>
                  <tr><th>DNS chính</th><td>2402:800:20ff:1111::1</td></tr>
                  <tr><th>DNS phụ</th><td>2402:800:20ff:2222::1</td></tr>
                  <tr><th>Prefix Delegation</th><td>2402:800:638a:b6ea::/64</td></tr>
                </table>
              </div>
            </div>

            <div class="sec-heading">Thông tin PON</div>
            <div class="vht-card">
              <div class="vht-card-body">
                <div class="sub-heading" style="margin-top:0;">GPON</div>
                <table class="form-table">
                  <tr><th>Phiên bản thiết bị</th><td>${esc(dev.hwVersion || "VGP42X6M001")}</td></tr>
                  <tr><th>Trạng thái kết nối</th><td>${dev.fiberFault ? "Ngắt kết nối (O1)" : "Kết nối (O5)"}</td></tr>
                  <tr><th>Loại OLT</th><td>ZTE</td></tr>
                  <tr><th>Loại module quang</th><td>B+</td></tr>
                </table>

                <div class="sub-heading">Transceiver</div>
                <table class="form-table">
                  <tr><th>Công suất thu</th><td>${rxPower}</td></tr>
                  <tr><th>Công suất phát</th><td>${txPower}</td></tr>
                  <tr><th>Dòng phân cực phát</th><td>11.4 mA</td></tr>
                  <tr><th>Điện áp</th><td>3.29 V</td></tr>
                  <tr><th>Nhiệt độ</th><td>54.8 °C</td></tr>
                </table>
              </div>
            </div>
          </div>
        </div>

        <div class="btn-row center">
          <button type="button" class="btn-vht pill-lg" id="devinfo-btn-reload">TẢI LẠI</button>
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
      const reloadBtn = document.getElementById("devinfo-btn-reload");
      if (reloadBtn) {
        reloadBtn.addEventListener("click", function () {
          window.RouterApp.showToast("Đã tải lại thông tin thiết bị!");
          window.RouterApp.renderCurrentPage();
        });
      }
    }
  };

  // --------------------------------------------------------------------------
  // 3. Thiết bị đang kết nối (/cgi-bin/sta-users.asp)
  //    Headers: ['Thiết bị đang kết nối', 'Wi-Fi 2.4GHz', 'Wi-Fi 5GHz']
  // --------------------------------------------------------------------------
  window.RouterPages["sta-users"] = {
    title: "Thiết bị đang kết nối",
    group: "Tổng quan",
    cgi: "/cgi-bin/sta-users.asp",
    render: function () {
      const st = window.SimState;
      const schedOff = window.SimEngine.isWifiScheduledOff();
      const nets = window.SimEngine.getActiveBroadcastSsids();

      function isMacStatic(mac) {
        return (st.lan.staticLeases || []).some((item) => item.mac.toLowerCase() === String(mac).toLowerCase());
      }

      // Table 1 in real sta-users.asp shows all DHCP/LAN clients with columns: Thiết bị | Địa chỉ IP | Địa chỉ MAC | Trạng thái
      const allDhcpClients = [];
      if (st.simDevices.laptopObs.connMode === "LAN1") {
        allDhcpClients.push({
          name: st.simDevices.laptopObs.name,
          ip: st.simDevices.laptopObs.ip,
          mac: st.simDevices.laptopObs.mac.toUpperCase()
        });
      }
      if (st.simDevices.desktopVm.connected) {
        allDhcpClients.push({
          name: st.simDevices.desktopVm.name,
          ip: window.SimEngine.allocateDhcpIpForMac(st.simDevices.desktopVm.mac, st.simDevices.desktopVm.ip),
          mac: st.simDevices.desktopVm.mac.toUpperCase()
        });
      }
      if (st.simDevices.phone.wifiOn && st.simDevices.phone.connected && !schedOff) {
        allDhcpClients.push({
          name: st.simDevices.phone.name,
          ip: st.simDevices.phone.ip,
          mac: st.simDevices.phone.mac.toUpperCase()
        });
      }
      if (st.simDevices.laptopAux.connected && !schedOff) {
        allDhcpClients.push({
          name: st.simDevices.laptopAux.name,
          ip: st.simDevices.laptopAux.ip,
          mac: st.simDevices.laptopAux.mac.toUpperCase()
        });
      }

      const wifi24Clients = [];
      const wifi5Clients = [];

      function pushWifiClient(devObj, defaultRssi) {
        if (!devObj || !devObj.connected || schedOff) return;
        const net = nets.find((n) => n.ssid === devObj.ssid);
        if (!net) return;
        const entry = {
          ssid: devObj.ssid,
          mac: devObj.mac.toUpperCase(),
          ip: devObj.ip,
          rssi: devObj.rssi || defaultRssi,
          speed: net.speedMbps
        };
        if (net.actualBand === "5G") wifi5Clients.push(entry);
        else wifi24Clients.push(entry);
      }

      if (st.simDevices.laptopObs.connMode === "WIFI") {
        pushWifiClient(
          {
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
        <div class="vht-card">
          <div class="vht-card-body" style="padding:0;">
            <table class="data-table">
              <thead>
                <tr>
                  <th>Thiết bị</th>
                  <th>Địa chỉ IP</th>
                  <th>Địa chỉ MAC</th>
                  <th>Trạng thái</th>
                </tr>
              </thead>
              <tbody>
                ${
                  allDhcpClients.length === 0
                    ? `<tr><td colspan="4" class="empty-row">Không có thiết bị kết nối.</td></tr>`
                    : allDhcpClients
                        .map((c) => {
                          const stText = isMacStatic(c.mac)
                            ? "Cấp phát tĩnh bởi DHCP"
                            : "Thời gian giữ còn lại:<br/>0 ngày 23 giờ 52 phút 18 giây";
                          return `
                  <tr>
                    <td>${esc(c.name)}</td>
                    <td>${esc(c.ip)}</td>
                    <td>${esc(c.mac)}</td>
                    <td>${stText}</td>
                  </tr>`;
                        })
                        .join("")
                }
              </tbody>
            </table>
          </div>
        </div>

        <div class="sec-heading">Wi-Fi 2.4GHz</div>
        <div class="vht-card">
          <div class="vht-card-body" style="padding:0;">
            <table class="data-table">
              <thead>
                <tr>
                  <th>STT</th>
                  <th>SSID</th>
                  <th>MAC</th>
                  <th>IP</th>
                  <th>RSSI (dBm)</th>
                  <th>Tốc độ (Mbps)</th>
                </tr>
              </thead>
              <tbody>
                ${
                  wifi24Clients.length === 0
                    ? `<tr><td colspan="6" class="empty-row">Chưa có thiết bị kết nối ở băng tần 2.4GHz.</td></tr>`
                    : wifi24Clients
                        .map(
                          (c, idx) => `
                  <tr>
                    <td>${idx + 1}</td>
                    <td>${esc(c.ssid)}</td>
                    <td>${esc(c.mac)}</td>
                    <td>${esc(c.ip)}</td>
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

        <div class="sec-heading">Wi-Fi 5GHz</div>
        <div class="vht-card">
          <div class="vht-card-body" style="padding:0;">
            <table class="data-table">
              <thead>
                <tr>
                  <th>STT</th>
                  <th>SSID</th>
                  <th>MAC</th>
                  <th>IP</th>
                  <th>RSSI (dBm)</th>
                  <th>Tốc độ (Mbps)</th>
                </tr>
              </thead>
              <tbody>
                ${
                  wifi5Clients.length === 0
                    ? `<tr><td colspan="6" class="empty-row">Chưa có thiết bị kết nối ở băng tần 5GHz.</td></tr>`
                    : wifi5Clients
                        .map(
                          (c, idx) => `
                  <tr>
                    <td>${idx + 1}</td>
                    <td>${esc(c.ssid)}</td>
                    <td>${esc(c.mac)}</td>
                    <td>${esc(c.ip)}</td>
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

        <div class="btn-row center">
          <button type="button" class="btn-vht pill-lg" id="sta-btn-reload">TẢI LẠI</button>
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
  //    Standalone page (ul-tab commented out in firmware), Legend: Runtime Topology
  // --------------------------------------------------------------------------
  window.RouterPages["wifi-mesh-topology"] = {
    title: "",
    group: "Tổng quan",
    cgi: "/cgi-bin/wifi-mesh-topology.asp",
    showTable: true,
    selectedNode: "controller",
    openSections: { overview: true, apcap: false, bhinfo: false, clinfo: true },
    render: function () {
      const st = window.SimState;
      const clients = [];
      if (st.simDevices.laptopObs.connMode === "LAN1") {
        clients.push({
          name: st.simDevices.laptopObs.name,
          medium: "Ethernet",
          mac: st.simDevices.laptopObs.mac,
          ip: st.simDevices.laptopObs.ip,
          speed: "1000",
          rssi: "-",
          dl: "-",
          ul: "-"
        });
      }
      if (st.simDevices.desktopVm.connected) {
        clients.push({
          name: st.simDevices.desktopVm.name,
          medium: "Ethernet",
          mac: st.simDevices.desktopVm.mac,
          ip: st.simDevices.desktopVm.ip,
          speed: "1000",
          rssi: "-",
          dl: "-",
          ul: "-"
        });
      }
      if (st.simDevices.phone.wifiOn && st.simDevices.phone.connected && !window.SimEngine.isWifiScheduledOff()) {
        clients.push({
          name: st.simDevices.phone.name,
          medium: st.simDevices.phone.band === "5GHz" ? "5G" : "2.4G",
          mac: st.simDevices.phone.mac,
          ip: st.simDevices.phone.ip,
          speed: String(st.simDevices.phone.speed || 780),
          rssi: String(st.simDevices.phone.rssi || -57),
          dl: "12",
          ul: "4"
        });
      }
      if (st.simDevices.laptopAux.connected && !window.SimEngine.isWifiScheduledOff()) {
        clients.push({
          name: st.simDevices.laptopAux.name,
          medium: st.simDevices.laptopAux.band === "5GHz" ? "5G" : "2.4G",
          mac: st.simDevices.laptopAux.mac,
          ip: st.simDevices.laptopAux.ip,
          speed: String(st.simDevices.laptopAux.speed || 305),
          rssi: String(st.simDevices.laptopAux.rssi || -68),
          dl: "8",
          ul: "2"
        });
      }

      const isAgentSel = this.selectedNode === "agent" && st.mesh.demoAgentConnected;
      const nodeTitle = isAgentSel ? "Agent - 32X6V1 (24:0b:2b:01:c9:e4)" : "Controller - 42X6V1 (" + st.device.macLan.toLowerCase() + ")";

      return `
        <div class="vht-card">
          <div class="vht-card-body">
            <legend class="vht-legend" style="margin-top:0;">Runtime Topology</legend>

            <div class="topo-canvas" style="min-height:240px;margin:10px 0 16px;">
              <div class="topo-node" id="topo-node-ctrl" style="cursor:pointer;border:2px solid ${!isAgentSel ? "#ee0033" : "#cbd5e1"};">
                <div style="font-size:13px;font-weight:700;color:#1f2937;">Controller - 42X6V1</div>
                <div style="font-size:12px;color:#475569;margin-top:3px;">${esc(st.device.macLan.toLowerCase())}</div>
              </div>

              <div style="display:${st.mesh.demoAgentConnected ? "flex" : "none"};flex-direction:column;align-items:center;">
                <div style="font-size:11.5px;color:#16a34a;font-weight:700;margin:4px 0;">│ 5G (RSSI: -61 dBm)</div>
                <div class="topo-node agent" id="topo-node-agent" style="cursor:pointer;border:2px solid ${isAgentSel ? "#ee0033" : "#cbd5e1"};">
                  <div style="font-size:13px;font-weight:700;color:#1f2937;">Agent - 32X6V1</div>
                  <div style="font-size:12px;color:#475569;margin-top:3px;">24:0b:2b:01:c9:e4</div>
                </div>
              </div>

              <div class="topo-children" style="margin-top:14px;">
                ${
                  clients.length === 0
                    ? `<div class="field-hint">Chưa có thiết bị kết nối.</div>`
                    : clients
                        .map(
                          (c) => `
                  <div class="topo-client">
                    <div style="font-weight:700;color:#0f172a;">${esc(c.name)}</div>
                    <div style="color:#16a34a;font-weight:600;margin-top:2px;">${esc(c.medium)} (${esc(c.speed)} Mbps)</div>
                    <div style="color:#64748b;margin-top:2px;">${esc(c.mac)} | IP: ${esc(c.ip)}</div>
                  </div>`
                        )
                        .join("")
                }
              </div>
            </div>

            <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:10px;margin-bottom:14px;">
              <div style="display:flex;gap:8px;">
                <button type="button" class="btn-vht secondary small" id="topo-reset-view">↻ Reset View</button>
                <button type="button" class="btn-vht secondary small" id="topo-close-table">${this.showTable ? "✕ Close Table" : "☰ Open Table"}</button>
              </div>
              <div style="display:flex;gap:8px;">
                <button type="button" class="btn-vht small" id="topo-save">Save Topo</button>
                <button type="button" class="btn-vht secondary small" id="topo-clear">Clear Topo</button>
              </div>
            </div>

            ${
              this.showTable
                ? `
              <div id="info_box" style="margin-top:14px;border:1px solid #e2e8f0;border-radius:12px;overflow:hidden;">
                <div style="font-weight:700;font-size:15px;padding:12px 16px;background:#f8fafc;border-bottom:1px solid #e2e8f0;">
                  ${esc(nodeTitle)}
                </div>

                <!-- 1. Overview -->
                <div style="border-bottom:1px solid #e2e8f0;">
                  <div class="topo-acc-hdr" data-sec="overview" style="padding:10px 16px;font-weight:700;color:#0284c7;cursor:pointer;display:flex;justify-content:space-between;">
                    <span>Overview</span><span>⌄</span>
                  </div>
                  ${
                    this.openSections.overview
                      ? `
                  <table class="data-table" style="border-top:1px solid #e2e8f0;">
                    <tbody>
                      <tr><td style="text-align:left;width:220px;">Serial Number</td><td style="text-align:left;">${isAgentSel ? "VTGRB201C9E4" : esc(st.device.serial)}</td></tr>
                      <tr><td style="text-align:left;">Firmware Version</td><td style="text-align:left;">${isAgentSel ? "V1.6.6_VN" : esc(st.device.firmware)}</td></tr>
                      <tr><td style="text-align:left;">Product class</td><td style="text-align:left;">${isAgentSel ? "vAP-32X6V1" : esc(st.device.model)}</td></tr>
                      <tr><td style="text-align:left;">Device name</td><td style="text-align:left;">${isAgentSel ? "vthomeap6" : esc(st.device.name)}</td></tr>
                    </tbody>
                  </table>`
                      : ""
                  }
                </div>

                <!-- 2. AP Capabality -->
                <div style="border-bottom:1px solid #e2e8f0;">
                  <div class="topo-acc-hdr" data-sec="apcap" style="padding:10px 16px;font-weight:700;color:#0284c7;cursor:pointer;display:flex;justify-content:space-between;">
                    <span>AP Capabality</span><span>⌄</span>
                  </div>
                  ${
                    this.openSections.apcap
                      ? `
                  <table class="data-table" style="border-top:1px solid #e2e8f0;">
                    <tbody>
                      <tr><td style="text-align:left;width:220px;">LAN IP Address</td><td style="text-align:left;" colspan="2">${isAgentSel ? "192.168.1.222" : esc(st.lan.ip)}</td></tr>
                      <tr><td style="text-align:left;font-weight:700;">Radio 0 (5GHz)</td><td style="text-align:left;" colspan="2">Channel: ${esc(st.wifi5.currentChannel || 153)} | SSID: ${esc(st.wifi5.ssids[0].ssid)}</td></tr>
                      <tr><td style="text-align:left;font-weight:700;">Radio 1 (2.4GHz)</td><td style="text-align:left;" colspan="2">Channel: ${esc(st.wifi24.currentChannel || 12)} | SSID: ${esc(st.wifi24.ssids[0].ssid)}</td></tr>
                    </tbody>
                  </table>`
                      : ""
                  }
                </div>

                <!-- 3. Backhaul Information -->
                <div style="border-bottom:1px solid #e2e8f0;">
                  <div class="topo-acc-hdr" data-sec="bhinfo" style="padding:10px 16px;font-weight:700;color:#0284c7;cursor:pointer;display:flex;justify-content:space-between;">
                    <span>Backhaul Information</span><span>⌄</span>
                  </div>
                  ${
                    this.openSections.bhinfo
                      ? `
                  <table class="data-table" style="border-top:1px solid #e2e8f0;">
                    <tbody>
                      ${
                        isAgentSel
                          ? `
                        <tr><td style="text-align:left;width:220px;">Distance from controller</td><td style="text-align:left;">1</td></tr>
                        <tr><td style="text-align:left;">Upstream Device</td><td style="text-align:left;">${esc(st.device.macLan.toLowerCase())}</td></tr>
                        <tr><td style="text-align:left;">Bachkhaul Type</td><td style="text-align:left;">5G</td></tr>
                        <tr><td style="text-align:left;">PhyRate</td><td style="text-align:left;">648 Mbps</td></tr>
                        <tr><td style="text-align:left;">RSSI</td><td style="text-align:left;">-61 dBm</td></tr>`
                          : `<tr><td colspan="2" class="empty-row">Thiết bị hiện tại đóng vai trò Controller (Distance from controller: 0).</td></tr>`
                      }
                    </tbody>
                  </table>`
                      : ""
                  }
                </div>

                <!-- 4. Clients List -->
                <div>
                  <div class="topo-acc-hdr" data-sec="clinfo" style="padding:10px 16px;font-weight:700;color:#0284c7;cursor:pointer;display:flex;justify-content:space-between;">
                    <span>Clients List</span><span>⌄</span>
                  </div>
                  ${
                    this.openSections.clinfo
                      ? `
                  <table class="data-table" style="border-top:1px solid #e2e8f0;">
                    <thead>
                      <tr>
                        <th>MAC Address</th>
                        <th>Band/Interace</th>
                        <th>Link speed (Mbps)</th>
                        <th>RSSI (dBm)</th>
                        <th>Last Downlink (KB)</th>
                        <th>Last Uplink (KB)</th>
                        <th>IP</th>
                      </tr>
                    </thead>
                    <tbody>
                      ${clients
                        .map(
                          (c) => `
                        <tr>
                          <td>${esc(c.mac.toLowerCase())}</td>
                          <td>${esc(c.medium)}</td>
                          <td>${esc(c.speed)}</td>
                          <td>${esc(c.rssi)}</td>
                          <td>${esc(c.dl)}</td>
                          <td>${esc(c.ul)}</td>
                          <td>${esc(c.ip)}</td>
                        </tr>`
                        )
                        .join("")}
                    </tbody>
                  </table>`
                      : ""
                  }
                </div>
              </div>`
                : ""
            }
          </div>
        </div>
      `;
    },
    bind: function () {
      const self = this;
      const ctrlNode = document.getElementById("topo-node-ctrl");
      if (ctrlNode) {
        ctrlNode.addEventListener("click", function () {
          self.selectedNode = "controller";
          self.showTable = true;
          window.RouterApp.renderCurrentPage();
        });
      }
      const agentNode = document.getElementById("topo-node-agent");
      if (agentNode) {
        agentNode.addEventListener("click", function () {
          self.selectedNode = "agent";
          self.showTable = true;
          window.RouterApp.renderCurrentPage();
        });
      }
      document.querySelectorAll(".topo-acc-hdr").forEach(function (hdr) {
        hdr.addEventListener("click", function () {
          const sec = hdr.getAttribute("data-sec");
          self.openSections[sec] = !self.openSections[sec];
          window.RouterApp.renderCurrentPage();
        });
      });
      document.getElementById("topo-reset-view").addEventListener("click", function () {
        self.selectedNode = "controller";
        window.RouterApp.renderCurrentPage();
      });
      document.getElementById("topo-close-table").addEventListener("click", function () {
        self.showTable = !self.showTable;
        window.RouterApp.renderCurrentPage();
      });
      document.getElementById("topo-save").addEventListener("click", function () {
        window.SimState.mesh.demoAgentConnected = true;
        window.SimEngine.saveState();
        window.RouterApp.showToast("Đã lưu thông tin Runtime Topology!");
        window.RouterApp.renderCurrentPage();
      });
      document.getElementById("topo-clear").addEventListener("click", function () {
        window.SimState.mesh.demoAgentConnected = false;
        self.selectedNode = "controller";
        window.SimEngine.saveState();
        window.RouterApp.renderCurrentPage();
      });
    }
  };

  // --------------------------------------------------------------------------
  // 5. Mạng -> Thiết lập WAN (/cgi-bin/net-wan.asp)
  //    Headers: ['Thiết lập WAN', 'Tùy chọn WAN Route']
  //    Legends: ['Chung', 'Tùy chọn IP', 'Tùy chọn VLAN', 'Tùy chọn IPv4', 'Tùy chọn PPPoE', 'Tùy chọn IPv6', 'Tùy chọn Port Binding']
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
      const services = ["INTERNET", "TR069", "TR069_INTERNET", "IPTV", "VOIP", "OTHER"];

      return `
        <!-- Widget 1: Thiết lập WAN -->
        <div class="vht-card">
          <div class="vht-card-body">
            <table class="form-table">
              <tr>
                <th>Tên kết nối</th>
                <td>
                  <div style="display:flex;align-items:center;gap:8px;flex-wrap:wrap;">
                    <select class="vht-select" id="wan-select-conn">
                      ${st.wanList
                        .map((item, i) => `<option value="${i}" ${i === idx ? "selected" : ""}>${esc(item.id)}</option>`)
                        .join("")}
                    </select>
                    <button type="button" class="btn-vht secondary small" id="wan-btn-add">THÊM</button>
                    <button type="button" class="btn-vht secondary small" id="wan-btn-remove">XÓA</button>
                  </div>
                </td>
              </tr>
            </table>
          </div>
        </div>

        <!-- Widget 2: Tùy chọn WAN Route -->
        <div class="sec-heading">Tùy chọn WAN Route</div>
        <div class="vht-card">
          <div class="vht-card-body">
            <div class="sub-heading" style="margin-top:0;">Chung</div>
            <table class="form-table">
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
                <th>Kích hoạt</th>
                <td>${switchHtml("wan-enable", w.enabled !== false)}</td>
              </tr>
              <tr>
                <th>Dịch vụ</th>
                <td>
                  <select class="vht-select" id="wan-service">
                    ${services.map((s) => `<option value="${s}" ${w.service === s ? "selected" : ""}>${s}</option>`).join("")}
                  </select>
                </td>
              </tr>
            </table>

            <div id="wan-route-sections" style="display:${w.mode === "Bridge" ? "none" : "block"};">
              <div class="sub-heading">Tùy chọn IP</div>
              <table class="form-table">
                <tr>
                  <th>Phiên bản IP</th>
                  <td>
                    <div class="check-grid">
                      ${["IPv4", "IPv6", "IPv4/IPv6"]
                        .map(
                          (ver) => `
                        <label class="check-item">
                          <input type="radio" name="wan-ipver" value="${ver}" ${w.ipVersion === ver ? "checked" : ""} />
                          ${ver}
                        </label>`
                        )
                        .join("")}
                    </div>
                  </td>
                </tr>
                <tr>
                  <th style="vertical-align:top;">Chế độ kết nối</th>
                  <td>
                    <div style="display:flex;flex-direction:column;gap:8px;">
                      <label class="check-item">
                        <input type="radio" name="wan-conntype" value="DHCP" ${w.connType === "DHCP" ? "checked" : ""} />
                        <strong style="min-width:65px;">DHCP</strong>
                        <span class="field-hint">Nhận IP tự động từ nhà mạng.</span>
                      </label>
                      <label class="check-item">
                        <input type="radio" name="wan-conntype" value="Static" ${w.connType === "Static" ? "checked" : ""} />
                        <strong style="min-width:65px;">Static</strong>
                        <span class="field-hint">Nhập IP tĩnh từ nhà mạng.</span>
                      </label>
                      <label class="check-item">
                        <input type="radio" name="wan-conntype" value="PPPoE" ${w.connType === "PPPoE" ? "checked" : ""} />
                        <strong style="min-width:65px;">PPPoE</strong>
                        <span class="field-hint">Xin hãy chọn nếu nhà mạng sử dụng PPPoE</span>
                      </label>
                      <label class="check-item">
                        <input type="radio" name="wan-conntype" value="PPPoA" ${w.connType === "PPPoA" ? "checked" : ""} />
                        <strong style="min-width:65px;">PPPoA</strong>
                        <span class="field-hint">Xin hãy chọn nếu nhà mạng sử dụng PPPoA</span>
                      </label>
                      <label class="check-item">
                        <input type="radio" name="wan-conntype" value="IPoA" ${w.connType === "IPoA" ? "checked" : ""} />
                        <strong style="min-width:65px;">IPoA</strong>
                        <span class="field-hint">Xin hãy chọn nếu nhà mạng sử dụng IPoA.</span>
                      </label>
                    </div>
                  </td>
                </tr>
                <tr>
                  <th>MTU</th>
                  <td>
                    <input type="number" class="vht-input short" id="wan-mtu" value="${w.mtu}" />
                    <span class="field-hint">[1-1500]</span>
                  </td>
                </tr>
                <tr>
                  <th>Kích hoạt IGMP Proxy</th>
                  <td>${switchHtml("wan-igmp", w.igmpProxy)}</td>
                </tr>
                <tr>
                  <th>Kích hoạt NAT</th>
                  <td>${switchHtml("wan-nat", w.nat)}</td>
                </tr>
                <tr>
                  <th>Route mặc định IPv4</th>
                  <td>${switchHtml("wan-defroute", w.service === "INTERNET")}</td>
                </tr>
              </table>
            </div>

            <div class="sub-heading">Tùy chọn VLAN</div>
            <table class="form-table">
              <tr>
                <th>Chế độ VLAN</th>
                <td>
                  <select class="vht-select" id="wan-vlan-mode">
                    <option value="TAG" ${w.vlanMode === "TAG" ? "selected" : ""}>TAG</option>
                    <option value="UNTAG" ${w.vlanMode === "UNTAG" ? "selected" : ""}>UNTAG</option>
                  </select>
                </td>
              </tr>
              <tr>
                <th>VLAN ID</th>
                <td>
                  <input type="number" class="vht-input short" id="wan-vlan-id" value="${w.vlanId}" />
                  <span class="field-hint">[1-4094]</span>
                </td>
              </tr>
              <tr>
                <th>802.1p</th>
                <td>
                  <input type="number" class="vht-input short" id="wan-pbit" value="${w.pbit}" />
                  <span class="field-hint">[0-7]</span>
                </td>
              </tr>
              <tr>
                <th>Multicast VLAN ID</th>
                <td>
                  <input type="number" class="vht-input short" id="wan-mvid" value="${w.multicastVid || ""}" placeholder="" />
                  <span class="field-hint">[1-4094]</span>
                </td>
              </tr>
            </table>

            <div id="wan-pppoe-section" style="display:${w.mode === "Route" && w.connType === "PPPoE" ? "block" : "none"};">
              <div class="sub-heading">Tùy chọn PPPoE</div>
              <table class="form-table">
                <tr>
                  <th>Tài khoản PPPoE</th>
                  <td><input type="text" class="vht-input" id="wan-user" value="${esc(w.pppoeUser)}" /></td>
                </tr>
                <tr>
                  <th>Mật khẩu PPPoE</th>
                  <td>${pwdInputHtml("wan-pass", w.pppoePass)}</td>
                </tr>
                <tr>
                  <th>Tên máy chủ</th>
                  <td><input type="text" class="vht-input" id="wan-srvname" value="" /></td>
                </tr>
                <tr>
                  <th>Chế độ quay số</th>
                  <td>
                    <select class="vht-select" id="wan-dialmode">
                      <option value="Auto" selected>Tự động kết nối</option>
                    </select>
                  </td>
                </tr>
                <tr>
                  <th>Kích hoạt chế độ PPPoE Router Bridge</th>
                  <td>${switchHtml("wan-pppbi", false)}</td>
                </tr>
              </table>
            </div>

            <div id="wan-ipv6-section" style="display:${w.mode === "Route" && w.ipVersion.includes("IPv6") ? "block" : "none"};">
              <div class="sub-heading">Tùy chọn IPv6</div>
              <table class="form-table">
                <tr>
                  <th>Kiểu lấy thông tin WAN IPv6</th>
                  <td>
                    <select class="vht-select" id="wan-ipv6-mode">
                      <option value="DHCP">DHCP</option>
                      <option value="SLAAC">SLAAC</option>
                      <option value="Static">Static</option>
                    </select>
                  </td>
                </tr>
                <tr>
                  <th>Kích hoạt PD</th>
                  <td>${switchHtml("wan-pd-en", true)}</td>
                </tr>
                <tr>
                  <th>Chế độ Tiền tố</th>
                  <td>
                    <div class="check-grid">
                      <label class="check-item"><input type="radio" name="wan-pd-mode" value="Auto" checked /> Auto</label>
                      <label class="check-item"><input type="radio" name="wan-pd-mode" value="Manual" /> Manual</label>
                    </div>
                  </td>
                </tr>
              </table>
            </div>

            <div class="sub-heading">Tùy chọn Port Binding</div>
            <table class="form-table">
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
          </div>
        </div>

        <div class="btn-row center">
          <button class="btn-vht pill-lg" id="wan-btn-apply">ÁP DỤNG</button>
        </div>
      `;
    },
    bind: function () {
      bindPwdEyes();
      const self = this;

      document.getElementById("wan-select-conn").addEventListener("change", function (e) {
        self.selectedWanIdx = parseInt(e.target.value, 10) || 0;
        window.RouterApp.renderCurrentPage();
      });

      document.getElementById("wan-btn-add").addEventListener("click", function () {
        const nextNum = window.SimState.wanList.length + 1;
        window.SimState.wanList.push({
          id: nextNum + "_OTHER_B_VID_100",
          mode: "Bridge",
          service: "OTHER",
          enabled: true,
          ipVersion: "IPv4",
          connType: "DHCP",
          pppoeUser: "",
          pppoePass: "",
          mtu: 1500,
          nat: false,
          igmpProxy: false,
          vlanMode: "TAG",
          vlanId: 100,
          pbit: 0,
          wanIp: "0.0.0.0",
          wanGateway: "0.0.0.0",
          dns1: "",
          dns2: "",
          wanIpv6: "---",
          bindings: []
        });
        self.selectedWanIdx = window.SimState.wanList.length - 1;
        window.SimEngine.saveState();
        window.RouterApp.renderCurrentPage();
      });

      const rmBtn = document.getElementById("wan-btn-remove");
      if (rmBtn) {
        rmBtn.addEventListener("click", function () {
          if (self.selectedWanIdx <= 1) {
            return alert("Không nên xóa giao diện WAN mặc định của nhà mạng!");
          }
          window.SimState.wanList.splice(self.selectedWanIdx, 1);
          self.selectedWanIdx = 0;
          window.SimEngine.saveState();
          window.RouterApp.renderCurrentPage();
        });
      }

      const modeEl = document.getElementById("wan-mode");
      const mtuEl = document.getElementById("wan-mtu");

      function getSelectedRadio(name, fallback) {
        const el = document.querySelector(`input[name="${name}"]:checked`);
        return el ? el.value : fallback;
      }

      function syncVisibility() {
        const isRoute = modeEl.value === "Route";
        const connType = getSelectedRadio("wan-conntype", "PPPoE");
        const ipVer = getSelectedRadio("wan-ipver", "IPv4/IPv6");
        document.getElementById("wan-route-sections").style.display = isRoute ? "block" : "none";
        document.getElementById("wan-pppoe-section").style.display = isRoute && connType === "PPPoE" ? "block" : "none";
        document.getElementById("wan-ipv6-section").style.display = isRoute && ipVer.includes("IPv6") ? "block" : "none";
      }

      modeEl.addEventListener("change", syncVisibility);
      document.querySelectorAll('input[name="wan-conntype"]').forEach(function (rad) {
        rad.addEventListener("change", function () {
          if (rad.value === "PPPoE") mtuEl.value = 1492;
          else if (rad.value === "DHCP" || rad.value === "Static") mtuEl.value = 1500;
          syncVisibility();
        });
      });
      document.querySelectorAll('input[name="wan-ipver"]').forEach(function (rad) {
        rad.addEventListener("change", syncVisibility);
      });

      document.getElementById("wan-btn-apply").addEventListener("click", function () {
        const w = window.SimState.wanList[self.selectedWanIdx];
        w.mode = modeEl.value;
        w.enabled = document.getElementById("wan-enable").checked;
        w.service = document.getElementById("wan-service").value;
        w.ipVersion = getSelectedRadio("wan-ipver", "IPv4/IPv6");
        w.connType = getSelectedRadio("wan-conntype", "PPPoE");
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
  //    Headers: ['Địa chỉ IPv4', 'Địa chỉ IPv6']
  //    Legends: ['Địa chỉ IPv4', 'DHCP', 'Cấp phát IP tĩnh', 'Cấu hình Router Advertisement (RA)', 'LAN']
  // --------------------------------------------------------------------------
  window.RouterPages["net-lan"] = {
    title: "Địa chỉ IPv4",
    group: "Mạng",
    cgi: "/cgi-bin/net-lan.asp",
    render: function () {
      const lan = window.SimState.lan;

      return `
        <!-- Widget 1: Địa chỉ IPv4 -->
        <div class="vht-card">
          <div class="vht-card-body">
            <div class="sub-heading" style="margin-top:0;">Địa chỉ IPv4</div>
            <table class="form-table">
              <tr>
                <th>Địa chỉ IP</th>
                <td><input type="text" class="vht-input" id="lan-ip" value="${esc(lan.ip)}" /></td>
              </tr>
              <tr>
                <th>Mặt nạ mạng con</th>
                <td><input type="text" class="vht-input" id="lan-mask" value="${esc(lan.mask)}" /></td>
              </tr>
            </table>

            <div class="sub-heading">DHCP</div>
            <table class="form-table">
              <tr>
                <th>DHCP Server</th>
                <td>${switchHtml("lan-dhcp-enable", lan.dhcpEnabled)}</td>
              </tr>
              <tr>
                <th>Dải DHCP</th>
                <td>
                  <input type="text" class="vht-input med" id="lan-dhcp-start" value="${esc(lan.dhcpStart)}" />
                  &nbsp;-&nbsp;
                  <input type="text" class="vht-input med" id="lan-dhcp-end" value="${esc(lan.dhcpEnd)}" />
                </td>
              </tr>
              <tr>
                <th>Thời hạn DHCP Server</th>
                <td>
                  <input type="number" class="vht-input short" id="lan-lease" value="${lan.leaseMin}" />
                  <span class="field-hint">[1 - 3600 min]</span>
                </td>
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
              <tr>
                <th>Cấp phát IP ngẫu nhiên</th>
                <td>${switchHtml("lan-random", lan.randomIp)}</td>
              </tr>
              <tr id="lan-dns1-row" style="display:${lan.dnsMode === "Static" ? "" : "none"};">
                <th>DNS chính</th>
                <td><input type="text" class="vht-input" id="lan-dns1" value="${esc(lan.staticDns1)}" /></td>
              </tr>
              <tr id="lan-dns2-row" style="display:${lan.dnsMode === "Static" ? "" : "none"};">
                <th>DNS phụ</th>
                <td><input type="text" class="vht-input" id="lan-dns2" value="${esc(lan.staticDns2)}" /></td>
              </tr>
            </table>

            <div class="sub-heading">Cấp phát IP tĩnh</div>
            <table class="form-table">
              <tr>
                <th style="vertical-align:top;">Bảng cấp phát IP tĩnh</th>
                <td>
                  <table class="simple-table table-bordered-radius" style="width:100%;max-width:540px;margin-bottom:10px;">
                    <thead>
                      <tr>
                        <th>IP</th>
                        <th>MAC</th>
                        <th>Thao Tác</th>
                      </tr>
                    </thead>
                    <tbody>
                      ${
                        lan.staticLeases.length === 0
                          ? `<tr><td colspan="3" class="empty-row">Chưa có thiết bị nào trong bảng cấp phát IP tĩnh.</td></tr>`
                          : lan.staticLeases
                              .map(
                                (item, i) => `
                        <tr>
                          <td>${esc(item.ip)}</td>
                          <td>${esc(item.mac)}</td>
                          <td>
                            <button type="button" class="btn-vht danger small static-del-btn" data-idx="${i}">Xóa</button>
                          </td>
                        </tr>`
                              )
                              .join("")
                      }
                      <tr>
                        <td><input type="text" class="vht-input med" id="static-ip-in" placeholder="192.168.1.150" style="width:155px;" /></td>
                        <td><input type="text" class="vht-input med" id="static-mac-in" placeholder="a4:83:e7:12:34:56" style="width:165px;" /></td>
                        <td>
                          <button type="button" class="btn-vht secondary small" id="static-btn-add">THÊM</button>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </td>
              </tr>
            </table>
          </div>
        </div>

        <!-- Widget 2: Địa chỉ IPv6 -->
        <div class="sec-heading">Địa chỉ IPv6</div>
        <div class="vht-card">
          <div class="vht-card-body">
            <div class="vht-grid-2col">
              <div>
                <div class="sub-heading" style="margin-top:0;">Cấu hình Router Advertisement (RA)</div>
                <table class="form-table">
                  <tr>
                    <th>SLAAC</th>
                    <td>${switchHtml("lan-slaac-en", true)}</td>
                  </tr>
                  <tr>
                    <th>Chế độ Router Advertisement</th>
                    <td>
                      <select class="vht-select" id="lan-ra-mode">
                        <option value="Auto" selected>Auto</option>
                        <option value="Manual">Manual</option>
                      </select>
                    </td>
                  </tr>
                  <tr>
                    <th>Nguồn Tiền tố</th>
                    <td>
                      <select class="vht-select">
                        <option selected>WAN (1_INTERNET_R_VID_35)</option>
                      </select>
                    </td>
                  </tr>
                  <tr>
                    <th>Cờ RA</th>
                    <td>
                      <div class="check-grid">
                        <label class="check-item"><input type="checkbox" checked /> Kích hoạt cờ Managed</label>
                        <label class="check-item"><input type="checkbox" checked /> Kích hoạt cờ Other</label>
                      </div>
                    </td>
                  </tr>
                </table>
              </div>

              <div>
                <div class="sub-heading" style="margin-top:0;">LAN</div>
                <table class="form-table">
                  <tr>
                    <th>Máy chủ DHCPv6</th>
                    <td>${switchHtml("lan-dhcpv6-en", true)}</td>
                  </tr>
                  <tr>
                    <th>Chế độ cấu hình</th>
                    <td>
                      <select class="vht-select">
                        <option value="Auto" selected>Auto</option>
                        <option value="Manual">Manual</option>
                      </select>
                    </td>
                  </tr>
                  <tr>
                    <th>Nguồn Máy chủ DNS</th>
                    <td>
                      <select class="vht-select">
                        <option selected> Kết nối WAN </option>
                        <option> Cố định </option>
                      </select>
                    </td>
                  </tr>
                </table>
              </div>
            </div>
          </div>
        </div>

        <div class="btn-row center">
          <button class="btn-vht pill-lg" id="lan-btn-apply">ÁP DỤNG</button>
        </div>
      `;
    },
    bind: function () {
      const dnsModeEl = document.getElementById("lan-dns-mode");
      dnsModeEl.addEventListener("change", function () {
        const showStatic = dnsModeEl.value === "Static";
        document.getElementById("lan-dns1-row").style.display = showStatic ? "" : "none";
        document.getElementById("lan-dns2-row").style.display = showStatic ? "" : "none";
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
          return alert("Thời hạn DHCP Server phải từ 1 đến 3600 phút!");
        }
        lan.leaseMin = lease;
        lan.randomIp = document.getElementById("lan-random").checked;
        lan.dnsMode = dnsModeEl.value;
        lan.staticDns1 = document.getElementById("lan-dns1").value.trim();
        lan.staticDns2 = document.getElementById("lan-dns2").value.trim();

        window.SimEngine.addLog("[LAN] Cập nhật DHCP (" + (lan.dhcpEnabled ? "Bật: " + lan.dhcpStart + " -> " + lan.dhcpEnd : "Tắt") + ").");
        window.RouterApp.applyWithFeedback("Đã lưu cấu hình Thiết lập LAN!");
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
