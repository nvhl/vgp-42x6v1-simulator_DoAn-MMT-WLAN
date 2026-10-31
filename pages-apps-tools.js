/* ==========================================================================
   pages-apps-tools.js — Renderers & Handlers for Ứng dụng (6 pages) & Bảo dưỡng (8 pages)
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
  // 12. Ứng dụng -> DMZ (/cgi-bin/apps-dmz.asp)
  // --------------------------------------------------------------------------
  window.RouterPages["apps-dmz"] = {
    title: "DMZ (Demilitarized Zone)",
    group: "Ứng dụng",
    cgi: "/cgi-bin/apps-dmz.asp",
    render: function () {
      const dmz = window.SimState.apps.dmz;
      return `
        <div class="vht-notice warn">
          <strong>Cảnh báo bảo mật:</strong> Khác với <em>Port Forwarding</em> chỉ mở đúng cổng chỉ định, bật <strong>DMZ</strong> sẽ phơi bày toàn bộ <strong>65.535 cổng</strong> từ ngoài Internet đẩy thẳng vào máy chủ LAN được điền bên dưới. Với mạng gia đình, luôn khuyến nghị để <strong>Tắt</strong>.
        </div>

        <div class="vht-card">
          <div class="vht-card-header">Thiết lập máy chủ vùng phi quân sự (DMZ Host)</div>
          <div class="vht-card-body">
            <table class="form-table">
              <tr>
                <th>Kích hoạt DMZ:</th>
                <td><label class="check-item"><input type="checkbox" id="dmz-en" ${dmz.enabled ? "checked" : ""} /> <strong>Kích hoạt</strong></label></td>
              </tr>
              <tr>
                <th>Giao diện WAN:</th>
                <td><select class="vht-select" id="dmz-wan"><option value="1_INTERNET_R_VID_35">1_INTERNET_R_VID_35</option></select></td>
              </tr>
              <tr>
                <th>Địa chỉ LAN (DMZ Host IP):</th>
                <td>
                  <input type="text" class="vht-input med" id="dmz-ip" value="${esc(dmz.hostIp)}" placeholder="192.168.1.150" />
                </td>
              </tr>
            </table>
            <div class="btn-row">
              <button class="btn-vht" id="dmz-btn-apply">ÁP DỤNG</button>
            </div>
          </div>
        </div>
      `;
    },
    bind: function () {
      document.getElementById("dmz-btn-apply").addEventListener("click", function () {
        const dmz = window.SimState.apps.dmz;
        const en = document.getElementById("dmz-en").checked;
        const ip = document.getElementById("dmz-ip").value.trim();
        if (en && !/^(\d{1,3}\.){3}\d{1,3}$/.test(ip)) {
          return alert("Vui lòng nhập Địa chỉ LAN hợp lệ khi kích hoạt DMZ!");
        }
        dmz.enabled = en;
        dmz.hostIp = ip;
        window.SimEngine.addLog("[DMZ] Trạng thái DMZ: " + (en ? "Bật -> " + ip : "Tắt") + ".");
        window.RouterApp.applyWithFeedback("Đã lưu cấu hình DMZ!");
      });
    }
  };

  // --------------------------------------------------------------------------
  // 13. Ứng dụng -> Port Forwarding (/cgi-bin/apps-portforwarding.asp)
  // --------------------------------------------------------------------------
  window.RouterPages["apps-portforwarding"] = {
    title: "Port Forwarding (NAT Virtual Server)",
    group: "Ứng dụng",
    cgi: "/cgi-bin/apps-portforwarding.asp",
    showForm: false,
    render: function () {
      const list = window.SimState.apps.portForwarding;
      return `
        <div class="vht-notice">
          <strong>Port Forwarding:</strong> Mở có chọn lọc một cổng cụ thể từ ngoài Internet (WAN) ánh xạ qua NAT vào đúng một máy chủ nội bộ (Web Server, SSH, FTP, Camera IP, Game Server).
        </div>

        <div class="vht-card">
          <div class="vht-card-header">
            <span>Danh sách luật mở cổng Port Forwarding</span>
            <button type="button" class="btn-vht small" id="pf-btn-toggle-add">${this.showForm ? "ĐÓNG KHUNG THÊM" : "THÊM"}</button>
          </div>
          <div class="vht-card-body">
            ${
              this.showForm
                ? `
            <div style="background:#f8fafc;border:1px solid #cbd5e1;border-radius:6px;padding:14px;margin-bottom:16px;">
              <table class="form-table">
                <tr>
                  <th>Kiểu dịch vụ:</th>
                  <td>
                    <div class="check-grid">
                      <label class="check-item"><input type="radio" name="pf-srv-mode" value="custom" checked /> Tùy chỉnh</label>
                      <label class="check-item"><input type="radio" name="pf-srv-mode" value="preset" /> Chọn mẫu dịch vụ có sẵn:</label>
                      <select class="vht-select" id="pf-preset" disabled style="min-width:210px;">
                        <option value="Web_Server_LAN|TCP|80|8080">HTTP Web Server (Port 80)</option>
                        <option value="FTP_Server|TCP|21|2121">FTP Server (Port 21)</option>
                        <option value="Secure_Shell_SSH|TCP|22|2222">Secure Shell Server - SSH (Port 22)</option>
                        <option value="DNS_Server|TCP/UDP|53|53">Domain Name Server - DNS (Port 53)</option>
                        <option value="Game_UDP_Server|UDP|27015|27015">Game Voice/UDP Server (Port 27015)</option>
                      </select>
                    </div>
                  </td>
                </tr>
                <tr>
                  <th>Tên Mapping:</th>
                  <td><input type="text" class="vht-input" id="pf-name" value="Web_Server_LAN" /></td>
                </tr>
                <tr>
                  <th>Giao thức (Protocol):</th>
                  <td>
                    <select class="vht-select" id="pf-proto">
                      <option value="TCP">TCP (Tin cậy cao: Web HTTP/HTTPS, FTP, SSH)</option>
                      <option value="UDP">UDP (Thời gian thực, độ trễ thấp: Game, Video/VoIP)</option>
                      <option value="TCP/UDP">TCP/UDP (Cả hai giao thức)</option>
                    </select>
                  </td>
                </tr>
                <tr>
                  <th>Giao diện WAN:</th>
                  <td><select class="vht-select"><option>1_INTERNET_R_VID_35</option></select></td>
                </tr>
                <tr>
                  <th>IP trong (Internal LAN IP):</th>
                  <td><input type="text" class="vht-input med" id="pf-ip" value="192.168.1.150" /></td>
                </tr>
                <tr>
                  <th>Port trong (Internal Port):</th>
                  <td><input type="number" class="vht-input short" id="pf-inport" value="80" /></td>
                </tr>
                <tr>
                  <th>Port ngoài (External WAN Port):</th>
                  <td><input type="number" class="vht-input short" id="pf-extport" value="8080" /></td>
                </tr>
              </table>
              <div class="btn-row">
                <button type="button" class="btn-vht" id="pf-btn-save">LƯU &amp; ÁP DỤNG</button>
              </div>
            </div>`
                : ""
            }

            <table class="data-table">
              <thead>
                <tr>
                  <th>STT</th>
                  <th>Tên Mapping</th>
                  <th>Giao thức</th>
                  <th>Port ngoài (WAN)</th>
                  <th>IP trong (LAN)</th>
                  <th>Port trong</th>
                  <th>Trạng thái</th>
                  <th>Thao tác</th>
                </tr>
              </thead>
              <tbody>
                ${
                  list.length === 0
                    ? `<tr><td colspan="8" class="empty-row">Chưa có luật Port Forwarding nào. Bấm THÊM để tạo luật mới.</td></tr>`
                    : list
                        .map(
                          (item, idx) => `
                  <tr>
                    <td>${idx + 1}</td>
                    <td><strong>${esc(item.name)}</strong></td>
                    <td><span class="badge-pill gray">${esc(item.proto)}</span></td>
                    <td><strong>${item.externalPort}</strong></td>
                    <td><code>${esc(item.internalIp)}</code></td>
                    <td><strong>${item.internalPort}</strong></td>
                    <td><span class="badge-ok">Kích hoạt</span></td>
                    <td><button type="button" class="btn-vht danger small pf-del" data-idx="${idx}">XÓA</button></td>
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
      const self = this;
      document.getElementById("pf-btn-toggle-add").addEventListener("click", function () {
        self.showForm = !self.showForm;
        window.RouterApp.renderCurrentPage();
      });

      if (self.showForm) {
        const presetSel = document.getElementById("pf-preset");
        document.querySelectorAll('input[name="pf-srv-mode"]').forEach(function (rad) {
          rad.addEventListener("change", function () {
            presetSel.disabled = rad.value !== "preset" || !rad.checked;
            if (rad.value === "preset" && rad.checked) {
              presetSel.dispatchEvent(new Event("change"));
            }
          });
        });

        presetSel.addEventListener("change", function () {
          const [nm, pr, inp, extp] = presetSel.value.split("|");
          document.getElementById("pf-name").value = nm;
          document.getElementById("pf-proto").value = pr;
          document.getElementById("pf-inport").value = inp;
          document.getElementById("pf-extport").value = extp;
        });

        document.getElementById("pf-btn-save").addEventListener("click", function () {
          const name = document.getElementById("pf-name").value.trim();
          const proto = document.getElementById("pf-proto").value;
          const ip = document.getElementById("pf-ip").value.trim();
          const inPort = parseInt(document.getElementById("pf-inport").value, 10);
          const extPort = parseInt(document.getElementById("pf-extport").value, 10);

          if (!name) return alert("Tên Mapping không được để trống!");
          if (!/^(\d{1,3}\.){3}\d{1,3}$/.test(ip)) return alert("IP trong không hợp lệ!");
          if (!inPort || inPort < 1 || inPort > 65535 || !extPort || extPort < 1 || extPort > 65535) {
            return alert("Số hiệu cổng (Port) phải từ 1 đến 65535!");
          }

          window.SimState.apps.portForwarding.push({
            id: Date.now(),
            name: name,
            proto: proto,
            internalIp: ip,
            internalPort: inPort,
            externalPort: extPort,
            enabled: true
          });
          self.showForm = false;
          window.SimEngine.addLog(
            "[PORT FORWARDING] Mở cổng " + proto + " WAN:" + extPort + " -> " + ip + ":" + inPort + " (" + name + ")."
          );
          window.RouterApp.applyWithFeedback("Đã thêm luật Port Forwarding (" + name + ")!");
        });
      }

      document.querySelectorAll(".pf-del").forEach(function (btn) {
        btn.addEventListener("click", function () {
          const i = parseInt(btn.getAttribute("data-idx"), 10);
          window.SimState.apps.portForwarding.splice(i, 1);
          window.SimEngine.saveState();
          window.RouterApp.renderCurrentPage();
        });
      });
    }
  };

  // --------------------------------------------------------------------------
  // 14. Ứng dụng -> Giới hạn phiên kết nối (/cgi-bin/apps-sslim.asp)
  // --------------------------------------------------------------------------
  window.RouterPages["apps-sslim"] = {
    title: "Giới hạn phiên kết nối (NAT Session Limit)",
    group: "Ứng dụng",
    cgi: "/cgi-bin/apps-sslim.asp",
    render: function () {
      const sl = window.SimState.apps.sessionLimit;
      return `
        <div class="vht-card">
          <div class="vht-card-header">Giới hạn số lượng phiên kết nối đồng thời (Chống tràn bộ nhớ NAT do P2P/Torrent/Mã độc)</div>
          <div class="vht-card-body">
            <table class="form-table">
              <tr>
                <th>Tổng số phiên NAT tối đa toàn hệ thống:</th>
                <td><strong>${sl.systemMax}</strong> phiên <span class="field-hint">(Giới hạn phần cứng NAT Table)</span></td>
              </tr>
              <tr>
                <th>Kích hoạt giới hạn phiên mỗi IP:</th>
                <td><label class="check-item"><input type="checkbox" id="sl-en" ${sl.enabled ? "checked" : ""} /> <strong>Bật kiểm soát phiên</strong></label></td>
              </tr>
              <tr>
                <th>Số phiên tối đa mặc định mỗi người dùng:</th>
                <td><input type="number" class="vht-input short" id="sl-def" value="${sl.defaultPerIp}" /> phiên / máy</td>
              </tr>
            </table>
            <div class="btn-row" style="margin-bottom:16px;">
              <button class="btn-vht" id="sl-apply">ÁP DỤNG</button>
            </div>

            <div style="font-weight:700;margin-bottom:8px;">Bảng giới hạn phiên riêng cho từng địa chỉ IP LAN:</div>
            <div style="display:flex;gap:8px;margin-bottom:10px;align-items:center;flex-wrap:wrap;">
              <input type="text" class="vht-input med" id="sl-ip" placeholder="192.168.1.50" />
              <input type="number" class="vht-input short" id="sl-max" placeholder="2000" />
              <button type="button" class="btn-vht small" id="sl-add">THÊM</button>
            </div>
            <table class="data-table">
              <thead><tr><th>STT</th><th>Địa chỉ IP LAN</th><th>Số phiên tối đa</th><th>Thao tác</th></tr></thead>
              <tbody>
                ${
                  sl.rules.length === 0
                    ? `<tr><td colspan="4" class="empty-row">Chưa có giới hạn riêng (Mọi máy áp dụng mức mặc định ${sl.defaultPerIp} phiên).</td></tr>`
                    : sl.rules
                        .map(
                          (r, i) => `
                  <tr>
                    <td>${i + 1}</td>
                    <td><code>${esc(r.ip)}</code></td>
                    <td><strong>${r.max}</strong></td>
                    <td><button class="btn-vht danger small sl-del" data-idx="${i}">XÓA</button></td>
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
      const sl = window.SimState.apps.sessionLimit;
      document.getElementById("sl-apply").addEventListener("click", function () {
        sl.enabled = document.getElementById("sl-en").checked;
        sl.defaultPerIp = parseInt(document.getElementById("sl-def").value, 10) || 8000;
        window.SimEngine.addLog("[SESSION LIMIT] Cập nhật giới hạn phiên mặc định: " + sl.defaultPerIp + "/IP.");
        window.RouterApp.applyWithFeedback("Đã lưu cấu hình Giới hạn phiên kết nối!");
      });
      document.getElementById("sl-add").addEventListener("click", function () {
        const ip = document.getElementById("sl-ip").value.trim();
        const mx = parseInt(document.getElementById("sl-max").value, 10);
        if (!ip || !mx) return alert("Vui lòng nhập đầy đủ IP và số phiên tối đa!");
        sl.rules.push({ ip: ip, max: mx });
        window.SimEngine.saveState();
        window.RouterApp.renderCurrentPage();
      });
      document.querySelectorAll(".sl-del").forEach((b) =>
        b.addEventListener("click", function () {
          sl.rules.splice(parseInt(b.getAttribute("data-idx"), 10), 1);
          window.SimEngine.saveState();
          window.RouterApp.renderCurrentPage();
        })
      );
    }
  };

  // --------------------------------------------------------------------------
  // 15. Ứng dụng -> Định tuyến tĩnh (/cgi-bin/apps-route.asp)
  // --------------------------------------------------------------------------
  window.RouterPages["apps-route"] = {
    title: "Định tuyến tĩnh (Static Routing)",
    group: "Ứng dụng",
    cgi: "/cgi-bin/apps-route.asp",
    render: function () {
      const routes = window.SimState.apps.staticRoutes;
      return `
        <div class="vht-card">
          <div class="vht-card-header">Bảng Định tuyến tĩnh (Dẫn đường sang lớp mạng con / Router phụ nội bộ)</div>
          <div class="vht-card-body">
            <table class="form-table" style="margin-bottom:12px;">
              <tr><th>Địa chỉ IP mạng đích:</th><td><input type="text" class="vht-input med" id="sr-dest" placeholder="192.168.2.0" /></td></tr>
              <tr><th>Subnet Mask:</th><td><input type="text" class="vht-input med" id="sr-mask" value="255.255.255.0" /></td></tr>
              <tr><th>Gateway (Next-Hop IP):</th><td><input type="text" class="vht-input med" id="sr-gw" placeholder="192.168.1.254" /></td></tr>
              <tr>
                <th>Giao diện mạng:</th>
                <td>
                  <select class="vht-select" id="sr-iface">
                    <option value="LAN (br0)">LAN (br0)</option>
                    <option value="1_INTERNET_R_VID_35">1_INTERNET_R_VID_35</option>
                  </select>
                </td>
              </tr>
            </table>
            <div class="btn-row" style="margin-bottom:14px;">
              <button class="btn-vht" id="sr-add">THÊM TUYẾN ĐƯỜNG</button>
            </div>

            <table class="data-table">
              <thead><tr><th>STT</th><th>Mạng đích</th><th>Subnet Mask</th><th>Gateway</th><th>Giao diện</th><th>Thao tác</th></tr></thead>
              <tbody>
                ${
                  routes.length === 0
                    ? `<tr><td colspan="6" class="empty-row">Chưa có tuyến định tuyến tĩnh nào được khai báo.</td></tr>`
                    : routes
                        .map(
                          (r, i) => `
                  <tr>
                    <td>${i + 1}</td>
                    <td><code>${esc(r.destIp)}</code></td>
                    <td><code>${esc(r.mask)}</code></td>
                    <td><code>${esc(r.gateway)}</code></td>
                    <td>${esc(r.iface)}</td>
                    <td><button class="btn-vht danger small sr-del" data-idx="${i}">XÓA</button></td>
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
      const routes = window.SimState.apps.staticRoutes;
      document.getElementById("sr-add").addEventListener("click", function () {
        const dest = document.getElementById("sr-dest").value.trim();
        const mask = document.getElementById("sr-mask").value.trim();
        const gw = document.getElementById("sr-gw").value.trim();
        const iface = document.getElementById("sr-iface").value;
        if (!dest || !mask || !gw) return alert("Vui lòng nhập đầy đủ Mạng đích, Subnet Mask và Gateway!");
        routes.push({ destIp: dest, mask: mask, gateway: gw, iface: iface });
        window.SimEngine.addLog("[STATIC ROUTE] Thêm tuyến tĩnh tới " + dest + " qua Gateway " + gw + ".");
        window.RouterApp.applyWithFeedback("Đã thêm tuyến Định tuyến tĩnh!");
      });
      document.querySelectorAll(".sr-del").forEach((b) =>
        b.addEventListener("click", function () {
          routes.splice(parseInt(b.getAttribute("data-idx"), 10), 1);
          window.SimEngine.saveState();
          window.RouterApp.renderCurrentPage();
        })
      );
    }
  };

  // --------------------------------------------------------------------------
  // 16. Ứng dụng -> DNS động (DDNS) (/cgi-bin/apps-ddns.asp)
  // --------------------------------------------------------------------------
  window.RouterPages["apps-ddns"] = {
    title: "DNS động (Dynamic DNS - DDNS)",
    group: "Ứng dụng",
    cgi: "/cgi-bin/apps-ddns.asp",
    render: function () {
      const d = window.SimState.apps.ddns;
      return `
        <div class="vht-card">
          <div class="vht-card-header">Đồng bộ địa chỉ IP WAN động với tên miền cố định (DynDNS / No-IP)</div>
          <div class="vht-card-body">
            <table class="form-table">
              <tr><th>Kích hoạt DDNS:</th><td><label class="check-item"><input type="checkbox" id="ddns-en" ${d.enabled ? "checked" : ""} /> <strong>Bật DDNS</strong></label></td></tr>
              <tr>
                <th>Nhà cung cấp dịch vụ:</th>
                <td>
                  <select class="vht-select" id="ddns-prov">
                    <option value="DynDNS.org" ${d.provider === "DynDNS.org" ? "selected" : ""}>DynDNS.org</option>
                    <option value="No-IP.com" ${d.provider === "No-IP.com" ? "selected" : ""}>No-IP.com</option>
                  </select>
                </td>
              </tr>
              <tr>
                <th>Chế độ cập nhật:</th>
                <td>
                  <select class="vht-select" id="ddns-mode">
                    <option value="Tự động" ${d.mode === "Tự động" ? "selected" : ""}>Tự động (Khi IP WAN PPPoE thay đổi)</option>
                    <option value="Thủ công" ${d.mode === "Thủ công" ? "selected" : ""}>Thủ công</option>
                  </select>
                </td>
              </tr>
              <tr><th>Tên miền (Hostname):</th><td><input type="text" class="vht-input" id="ddns-host" value="${esc(d.hostname)}" placeholder="nha-cua-em.dyndns.org" /></td></tr>
              <tr><th>Tài khoản:</th><td><input type="text" class="vht-input" id="ddns-user" value="${esc(d.username)}" /></td></tr>
              <tr><th>Mật khẩu:</th><td><input type="password" class="vht-input" id="ddns-pass" value="${esc(d.password)}" /></td></tr>
            </table>
            <div class="btn-row">
              <button class="btn-vht" id="ddns-apply">ÁP DỤNG</button>
            </div>
          </div>
        </div>
      `;
    },
    bind: function () {
      document.getElementById("ddns-apply").addEventListener("click", function () {
        const d = window.SimState.apps.ddns;
        d.enabled = document.getElementById("ddns-en").checked;
        d.provider = document.getElementById("ddns-prov").value;
        d.mode = document.getElementById("ddns-mode").value;
        d.hostname = document.getElementById("ddns-host").value.trim();
        d.username = document.getElementById("ddns-user").value.trim();
        d.password = document.getElementById("ddns-pass").value;
        window.SimEngine.addLog("[DDNS] Cập nhật cấu hình DDNS (" + (d.enabled ? "Bật: " + d.hostname : "Tắt") + ").");
        window.RouterApp.applyWithFeedback("Đã lưu cấu hình DNS động (DDNS)!");
      });
    }
  };

  // --------------------------------------------------------------------------
  // 17. Ứng dụng -> Lập lịch Wi-Fi (/cgi-bin/apps-wifischeduling.asp)
  // --------------------------------------------------------------------------
  window.RouterPages["apps-wifischeduling"] = {
    title: "Lập lịch Wi-Fi (Wi-Fi Auto Off/On Schedule)",
    group: "Ứng dụng",
    cgi: "/cgi-bin/apps-wifischeduling.asp",
    render: function () {
      const now = window.SimEngine.nowRouterDate();
      const pad = (n) => String(n).padStart(2, "0");
      const nowStr = window.SimEngine.formatDateTime(now) + " (" + window.SimEngine.getDayCode(now) + ")";
      const rule = window.SimState.apps.wifiSchedules[0];
      const activeOff = window.SimEngine.isWifiScheduledOff();
      const daysMap = [
        { code: "Sun", label: "CN (Sun)" },
        { code: "Mon", label: "T2 (Mon)" },
        { code: "Tue", label: "T3 (Tue)" },
        { code: "Wed", label: "T4 (Wed)" },
        { code: "Thu", label: "T5 (Thu)" },
        { code: "Fri", label: "T6 (Fri)" },
        { code: "Sat", label: "T7 (Sat)" }
      ];

      // Pre-compute next minute suggestion for TV6 practice
      const nextMinDate = new Date(now.getTime() + 60000);
      const endMinDate = new Date(now.getTime() + 6 * 60000);
      const nextStartHint = pad(nextMinDate.getHours()) + ":" + pad(nextMinDate.getMinutes());
      const nextEndHint = pad(endMinDate.getHours()) + ":" + pad(endMinDate.getMinutes());

      return `
        <div class="vht-notice ${activeOff ? "warn" : ""}">
          <strong>Giờ hệ thống Router hiện tại:</strong> <code id="wsch-live-clock">${esc(nowStr)}</code>
          &nbsp;|&nbsp;
          <strong>Trạng thái bộ phát sóng:</strong>
          ${
            activeOff
              ? `<span class="badge-err">🔴 ĐANG TẮT SÓNG WI-FI THEO LỊCH HẸN (${esc(activeOff.name)}: ${activeOff.start} – ${activeOff.end})!</span>`
              : `<span class="badge-ok">🟢 Đang phát sóng bình thường</span>`
          }
        </div>

        <div class="vht-card">
          <div class="vht-card-header">
            <span>Thiết lập khung giờ tự động TẮT toàn bộ sóng Wi-Fi</span>
            <div style="display:flex;gap:6px;">
              <button type="button" class="btn-vht outline small" id="wsch-fill-nextmin">
                ⚡ Đặt hẹn tắt ở phút kế tiếp (${nextStartHint} – ${nextEndHint})
              </button>
              <button type="button" class="btn-vht secondary small" id="wsch-jump-1min" title="Tua nhanh đồng hồ Router thêm 1 phút để test ngay không cần chờ 60 giây!">
                ⏩ Tua đồng hồ Router +1 Phút
              </button>
            </div>
          </div>
          <div class="vht-card-body">
            <table class="form-table">
              <tr>
                <th>Kích hoạt lịch tắt Wi-Fi:</th>
                <td><label class="check-item"><input type="checkbox" id="wsch-en" ${rule.enabled ? "checked" : ""} /> <strong>Kích hoạt (Bật hẹn giờ)</strong></label></td>
              </tr>
              <tr>
                <th>Tên lịch trình:</th>
                <td><input type="text" class="vht-input" id="wsch-name" value="${esc(rule.name)}" /></td>
              </tr>
              <tr>
                <th>Thời gian bắt đầu tắt sóng:</th>
                <td><input type="time" class="vht-input short" id="wsch-start" value="${esc(rule.start)}" /></td>
              </tr>
              <tr>
                <th>Thời gian bật sóng trở lại:</th>
                <td><input type="time" class="vht-input short" id="wsch-end" value="${esc(rule.end)}" /></td>
              </tr>
              <tr>
                <th>Các ngày áp dụng trong tuần:</th>
                <td>
                  <div class="check-grid">
                    ${daysMap
                      .map(
                        (d) =>
                          `<label class="check-item"><input type="checkbox" class="wsch-day" value="${d.code}" ${(rule.days || []).includes(d.code) ? "checked" : ""} /> ${d.label}</label>`
                      )
                      .join("")}
                  </div>
                </td>
              </tr>
            </table>
            <div class="btn-row">
              <button class="btn-vht" id="wsch-apply">ÁP DỤNG</button>
            </div>
          </div>
        </div>
      `;
    },
    bind: function () {
      const rule = window.SimState.apps.wifiSchedules[0];

      document.getElementById("wsch-fill-nextmin").addEventListener("click", function () {
        const now = window.SimEngine.nowRouterDate();
        const pad = (n) => String(n).padStart(2, "0");
        const d1 = new Date(now.getTime() + 60000);
        const d2 = new Date(now.getTime() + 6 * 60000);
        document.getElementById("wsch-start").value = pad(d1.getHours()) + ":" + pad(d1.getMinutes());
        document.getElementById("wsch-end").value = pad(d2.getHours()) + ":" + pad(d2.getMinutes());
        document.getElementById("wsch-en").checked = true;
        document.querySelectorAll(".wsch-day").forEach((c) => (c.checked = true));
      });

      document.getElementById("wsch-jump-1min").addEventListener("click", function () {
        window.SimState.admin.clockOffsetSec = (window.SimState.admin.clockOffsetSec || 0) + 60;
        window.SimEngine.reconcileClients();
        window.SimEngine.saveState();
        window.RouterApp.showToast("Đã tua nhanh đồng hồ Router thêm +1 phút để kiểm thử Lập lịch Wi-Fi!");
        window.RouterApp.renderCurrentPage();
        window.LabUI.render();
      });

      document.getElementById("wsch-apply").addEventListener("click", function () {
        const days = Array.from(document.querySelectorAll(".wsch-day:checked")).map((c) => c.value);
        if (days.length === 0) return alert("Vui lòng chọn ít nhất 1 ngày trong tuần!");
        rule.enabled = document.getElementById("wsch-en").checked;
        rule.name = document.getElementById("wsch-name").value.trim() || "Tat_WiFi_Dem";
        rule.start = document.getElementById("wsch-start").value || "01:00";
        rule.end = document.getElementById("wsch-end").value || "05:00";
        rule.days = days;

        window.SimEngine.reconcileClients();
        window.SimEngine.addLog(
          "[WIFI SCHEDULE] Lịch '" + rule.name + "' (" + rule.start + " -> " + rule.end + "): " + (rule.enabled ? "Bật" : "Tắt") + "."
        );
        window.RouterApp.applyWithFeedback("Đã lưu Lập lịch Wi-Fi!");
      });
    }
  };

  // --------------------------------------------------------------------------
  // 18. Bảo dưỡng -> Quản trị (/cgi-bin/tools-admin.asp)
  // --------------------------------------------------------------------------
  window.RouterPages["tools-admin"] = {
    title: "Quản trị hệ thống (Administration & Access Control)",
    group: "Bảo dưỡng",
    cgi: "/cgi-bin/tools-admin.asp",
    render: function () {
      const adm = window.SimState.admin;
      const dev = window.SimState.device;
      return `
        <div class="vht-card">
          <div class="vht-card-header">1. Đổi mật khẩu tài khoản quản trị (admin)</div>
          <div class="vht-card-body">
            <table class="form-table">
              <tr><th>Tài khoản:</th><td><strong>admin</strong></td></tr>
              <tr><th>Mật khẩu cũ:</th><td><input type="password" class="vht-input" id="adm-old" placeholder="Nhập mật khẩu hiện tại" /></td></tr>
              <tr>
                <th>Mật khẩu mới:</th>
                <td>
                  <input type="password" class="vht-input" id="adm-new" placeholder="Tối thiểu 8 ký tự (Hoa, thường, số, ký tự đặc biệt)" />
                </td>
              </tr>
              <tr><th>Xác nhận mật khẩu mới:</th><td><input type="password" class="vht-input" id="adm-confirm" /></td></tr>
            </table>
          </div>
        </div>

        <div class="vht-card">
          <div class="vht-card-header">2. Phân quyền truy cập trang Quản trị &amp; Thời gian hết phiên</div>
          <div class="vht-card-body">
            <table class="form-table">
              <tr>
                <th>Tên thiết bị (System Hostname):</th>
                <td><input type="text" class="vht-input" id="adm-devname" value="${esc(dev.name)}" /></td>
              </tr>
              <tr>
                <th>Cho phép người quản trị truy nhập từ:</th>
                <td>
                  <div class="check-grid">
                    <label class="check-item"><input type="checkbox" id="adm-lan" ${adm.allowLan ? "checked" : ""} disabled /> <strong>LAN (Mạng nội bộ trong nhà — An toàn)</strong></label>
                    <label class="check-item"><input type="checkbox" id="adm-wan" ${adm.allowWan ? "checked" : ""} /> <span style="color:#dc2626;font-weight:600;">WAN (Ngoài Internet — Khuyến nghị TẮT để chống dò mật khẩu!)</span></label>
                  </div>
                </td>
              </tr>
              <tr>
                <th>Thời gian hết phiên (Session Timeout):</th>
                <td>
                  <select class="vht-select" id="adm-timeout">
                    <option value="2.5" ${adm.sessionTimeoutMin == 2.5 ? "selected" : ""}>2.5 phút</option>
                    <option value="5" ${adm.sessionTimeoutMin == 5 ? "selected" : ""}>5 phút (Mặc định = 300s — Lưu ý tránh tự đăng xuất khi đứng giảng!)</option>
                    <option value="10" ${adm.sessionTimeoutMin == 10 ? "selected" : ""}>10 phút</option>
                    <option value="20" ${adm.sessionTimeoutMin == 20 ? "selected" : ""}>20 phút</option>
                    <option value="0" ${adm.sessionTimeoutMin == 0 ? "selected" : ""}>Không giới hạn</option>
                  </select>
                </td>
              </tr>
              <tr>
                <th>Cổng dịch vụ Web UI:</th>
                <td>
                  HTTP Port: <input type="number" class="vht-input short" id="adm-http" value="${adm.httpPort}" />
                  &nbsp;|&nbsp;
                  HTTPS Port: <input type="number" class="vht-input short" id="adm-https" value="${adm.httpsPort}" />
                </td>
              </tr>
            </table>
            <div class="btn-row">
              <button class="btn-vht" id="adm-apply">ÁP DỤNG</button>
            </div>
          </div>
        </div>
      `;
    },
    bind: function () {
      document.getElementById("adm-apply").addEventListener("click", function () {
        const adm = window.SimState.admin;
        const oldP = document.getElementById("adm-old").value;
        const newP = document.getElementById("adm-new").value;
        const cfP = document.getElementById("adm-confirm").value;

        if (newP || cfP) {
          if (oldP !== adm.password) return alert("Mật khẩu cũ không chính xác!");
          if (newP !== cfP) return alert("Xác nhận mật khẩu mới không trùng khớp!");
          const strong = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/;
          if (!strong.test(newP)) {
            return alert("Mật khẩu quản trị phải có ít nhất 8 ký tự gồm chữ HOA, chữ thường, chữ số và ký tự đặc biệt!");
          }
          adm.password = newP;
        }

        window.SimState.device.name = document.getElementById("adm-devname").value.trim() || "ONT_VTGR2239D5BC";
        adm.allowWan = document.getElementById("adm-wan").checked;
        adm.sessionTimeoutMin = parseFloat(document.getElementById("adm-timeout").value);
        adm.httpPort = parseInt(document.getElementById("adm-http").value, 10) || 80;
        adm.httpsPort = parseInt(document.getElementById("adm-https").value, 10) || 443;

        window.RouterApp.resetIdleTimer();
        window.SimEngine.addLog(
          "[ADMIN] Cập nhật Quản trị (Truy cập WAN: " + (adm.allowWan ? "Bật" : "Khóa") + ", Timeout: " + (adm.sessionTimeoutMin || "Không giới hạn") + " phút)."
        );
        window.RouterApp.applyWithFeedback("Đã lưu thiết lập Quản trị hệ thống!");
      });
    }
  };

  // --------------------------------------------------------------------------
  // 19. Bảo dưỡng -> Uplink Mirroring (/cgi-bin/tools-wan2lan.asp)
  // --------------------------------------------------------------------------
  window.RouterPages["tools-wan2lan"] = {
    title: "Uplink Mirroring (Port Mirroring cho Wireshark)",
    group: "Bảo dưỡng",
    cgi: "/cgi-bin/tools-wan2lan.asp",
    render: function () {
      const mir = window.SimState.tools.mirroring;
      return `
        <div class="vht-notice">
          <strong>Uplink Mirroring:</strong> Sao chép luồng gói tin đi qua cổng quang Uplink (PON/WAN) ra một cổng vật lý <code>LAN1 – LAN4</code> để kỹ thuật viên hoặc sinh viên cắm Laptop bắt gói tin phân tích bằng phần mềm <strong>Wireshark</strong>.
        </div>
        <div class="vht-card">
          <div class="vht-card-header">Cấu hình sao chép gói tin cổng quang xuống cổng LAN</div>
          <div class="vht-card-body">
            <table class="form-table">
              <tr><th>Kích hoạt Uplink Mirroring:</th><td><label class="check-item"><input type="checkbox" id="mir-en" ${mir.enabled ? "checked" : ""} /> <strong>Bật sao chép luồng gói tin</strong></label></td></tr>
              <tr>
                <th>Hướng bắt gói (Direction):</th>
                <td>
                  <select class="vht-select" id="mir-dir">
                    <option value="Ingress & Egress (Cả thu và phát)">Ingress &amp; Egress (Cả hai chiều thu và phát)</option>
                    <option value="Ingress (Chiều thu từ WAN)">Ingress (Chỉ chiều thu từ WAN)</option>
                    <option value="Egress (Chiều phát ra WAN)">Egress (Chỉ chiều phát ra WAN)</option>
                  </select>
                </td>
              </tr>
              <tr>
                <th>Cổng LAN đích (Mirror Destination Port):</th>
                <td>
                  <select class="vht-select" id="mir-port">
                    ${["LAN1", "LAN2", "LAN3", "LAN4"].map((p) => `<option value="${p}" ${mir.destPort === p ? "selected" : ""}>${p}</option>`).join("")}
                  </select>
                </td>
              </tr>
            </table>
            <div class="btn-row"><button class="btn-vht" id="mir-apply">ÁP DỤNG</button></div>
          </div>
        </div>
      `;
    },
    bind: function () {
      document.getElementById("mir-apply").addEventListener("click", function () {
        const mir = window.SimState.tools.mirroring;
        mir.enabled = document.getElementById("mir-en").checked;
        mir.direction = document.getElementById("mir-dir").value;
        mir.destPort = document.getElementById("mir-port").value;
        window.SimEngine.addLog("[MIRRORING] Uplink Mirroring: " + (mir.enabled ? "Bật -> " + mir.destPort : "Tắt") + ".");
        window.RouterApp.applyWithFeedback("Đã lưu cấu hình Uplink Mirroring!");
      });
    }
  };

  // --------------------------------------------------------------------------
  // 20. Bảo dưỡng -> Giờ hệ thống (/cgi-bin/tools-time.asp)
  // --------------------------------------------------------------------------
  window.RouterPages["tools-time"] = {
    title: "Giờ hệ thống (NTP / SNTP Time Synchronization)",
    group: "Bảo dưỡng",
    cgi: "/cgi-bin/tools-time.asp",
    render: function () {
      const adm = window.SimState.admin;
      const nowStr = window.SimEngine.formatDateTime(window.SimEngine.nowRouterDate());
      return `
        <div class="vht-card">
          <div class="vht-card-header">
            <span>Đồng bộ thời gian thực qua máy chủ chuẩn quốc tế NTP</span>
            <div>
              <button type="button" class="btn-vht secondary small" id="ntp-plus1m">⏩ Tua thử +1 Phút</button>
              <button type="button" class="btn-vht outline small" id="ntp-reset-real">🔄 Khớp lại giờ máy tính</button>
            </div>
          </div>
          <div class="vht-card-body">
            <table class="form-table">
              <tr>
                <th>Giờ hệ thống hiện tại:</th>
                <td><strong id="tools-live-clock" style="font-size:14.5px;color:#16a34a;">${esc(nowStr)}</strong></td>
              </tr>
              <tr>
                <th>Tự động đồng bộ NTP:</th>
                <td><label class="check-item"><input type="checkbox" id="ntp-en" ${adm.ntpEnabled ? "checked" : ""} /> <strong>Tự động đồng bộ thời gian với NTP Server qua Internet</strong></label></td>
              </tr>
              <tr>
                <th>Múi giờ (Time Zone):</th>
                <td>
                  <select class="vht-select" id="ntp-tz">
                    <option value="(GMT+07:00) Bangkok, Hanoi, Jakarta" selected>(GMT+07:00) Bangkok, Hanoi, Jakarta</option>
                    <option value="(GMT+00:00) UTC">(GMT+00:00) UTC</option>
                    <option value="(GMT+08:00) Singapore, Taipei">(GMT+08:00) Singapore, Taipei</option>
                  </select>
                </td>
              </tr>
              <tr><th>Máy chủ NTP 1 (Primary):</th><td><input type="text" class="vht-input" id="ntp-s1" value="${esc(adm.ntp1)}" /></td></tr>
              <tr><th>Máy chủ NTP 2 (Secondary):</th><td><input type="text" class="vht-input" id="ntp-s2" value="${esc(adm.ntp2)}" /></td></tr>
            </table>
            <div class="btn-row">
              <button class="btn-vht" id="ntp-apply">ÁP DỤNG &amp; ĐỒNG BỘ NGAY</button>
            </div>
          </div>
        </div>
      `;
    },
    bind: function () {
      document.getElementById("ntp-plus1m").addEventListener("click", function () {
        window.SimState.admin.clockOffsetSec = (window.SimState.admin.clockOffsetSec || 0) + 60;
        window.SimEngine.reconcileClients();
        window.SimEngine.saveState();
        window.RouterApp.renderCurrentPage();
        window.LabUI.render();
      });
      document.getElementById("ntp-reset-real").addEventListener("click", function () {
        window.SimState.admin.clockOffsetSec = 0;
        window.SimEngine.reconcileClients();
        window.SimEngine.saveState();
        window.RouterApp.showToast("Đã đồng bộ lại đúng giờ thực tế trên máy tính!");
        window.RouterApp.renderCurrentPage();
        window.LabUI.render();
      });
      document.getElementById("ntp-apply").addEventListener("click", function () {
        const adm = window.SimState.admin;
        adm.ntpEnabled = document.getElementById("ntp-en").checked;
        adm.ntp1 = document.getElementById("ntp-s1").value.trim() || "pool.ntp.org";
        adm.ntp2 = document.getElementById("ntp-s2").value.trim() || "2.vn.pool.ntp.org";
        window.SimEngine.addLog("[NTP] Đồng bộ giờ thành công với " + adm.ntp1 + " (GMT+07:00).");
        window.RouterApp.applyWithFeedback("Đã đồng bộ giờ hệ thống qua NTP (" + adm.ntp1 + ")!");
      });
    }
  };

  // --------------------------------------------------------------------------
  // 21. Bảo dưỡng -> Firmware (/cgi-bin/tools-firmware.asp)
  // --------------------------------------------------------------------------
  window.RouterPages["tools-firmware"] = {
    title: "Nâng cấp Firmware",
    group: "Bảo dưỡng",
    cgi: "/cgi-bin/tools-firmware.asp",
    render: function () {
      const dev = window.SimState.device;
      return `
        <div class="vht-card">
          <div class="vht-card-header">Kiểm tra &amp; Cập nhật phần mềm hệ thống (Firmware Upgrade)</div>
          <div class="vht-card-body">
            <table class="form-table">
              <tr><th>Mã thiết bị (Model):</th><td><strong>${esc(dev.model)}</strong></td></tr>
              <tr><th>Phiên bản Phần cứng:</th><td>${esc(dev.hwVersion)}</td></tr>
              <tr><th>Phiên bản Firmware hiện tại:</th><td><span class="badge-pill green">${esc(dev.firmware)}</span></td></tr>
              <tr>
                <th>Tập tin Firmware mới:</th>
                <td><input type="file" id="fw-file" accept=".bin,.trx,.img" /></td>
              </tr>
            </table>
            <div class="btn-row">
              <button class="btn-vht" id="fw-btn-upg">NÂNG CẤP FIRMWARE</button>
            </div>
          </div>
        </div>
      `;
    },
    bind: function () {
      document.getElementById("fw-btn-upg").addEventListener("click", function () {
        const f = document.getElementById("fw-file");
        if (!f.files || f.files.length === 0) {
          return alert("Vui lòng chọn tập tin Firmware (.bin / .img) từ nhà sản xuất VHT trước khi bấm Nâng cấp!");
        }
        alert("Bản mô phỏng: Phiên bản V1302250508 hiện đã là bản chuẩn mới nhất cho kỳ thực hành!");
      });
    }
  };

  // --------------------------------------------------------------------------
  // 22. Bảo dưỡng -> Cấu hình (/cgi-bin/tools-config.asp)
  //     ALL 4 EXACT OPTIONS FOR TV1 (SAO LƯU) & TV6 (KHÔI PHỤC)!
  // --------------------------------------------------------------------------
  window.RouterPages["tools-config"] = {
    title: "Quản lý Cấu hình (Sao lưu & Khôi phục — 4 Tùy chọn)",
    group: "Bảo dưỡng",
    cgi: "/cgi-bin/tools-config.asp",
    render: function () {
      const hasBackupInMem = !!localStorage.getItem(window.SimEngine.BACKUP_KEY);
      const hasPreResetSnap = !!localStorage.getItem(window.SimEngine.SNAPSHOT_KEY);

      return `
        <div class="vht-notice">
          Trang <strong>Bảo dưỡng → Cấu hình</strong> cung cấp đầy đủ <strong>4 nút thao tác</strong> đặc trưng trên Firmware <code>V1302250508</code> của <code>vGP-42X6V1</code> (Sao lưu ra file, Khôi phục từ file, Hoàn tác trước lần Reset gần nhất, và Reset mềm về mặc định xuất xưởng).
        </div>

        <div class="vht-card">
          <div class="vht-card-header">1. Sao lưu cấu hình hiện tại ra máy tính</div>
          <div class="vht-card-body">
            <p style="margin-bottom:10px;color:#334155;">
              Xuất toàn bộ cài đặt hiện tại của gia đình (Tên Wi-Fi <code>${esc(window.SimState.wifi24.ssids[0].ssid)}</code>, mật khẩu, WAN, DHCP, luật bảo mật...) thành tập tin lưu về máy tính trước khi bấm Reset cứng.
            </p>
            <button type="button" class="btn-vht" id="cfg-btn-backup">SAO LƯU</button>
          </div>
        </div>

        <div class="vht-card">
          <div class="vht-card-header">2. Khôi phục cấu hình từ tập tin đã sao lưu</div>
          <div class="vht-card-body">
            <table class="form-table">
              <tr>
                <th>Chọn tập tin cấu hình (.cfg / .json):</th>
                <td><input type="file" id="cfg-file-input" accept=".cfg,.json,.xml" /></td>
              </tr>
            </table>
            <div class="btn-row">
              <button type="button" class="btn-vht" id="cfg-btn-restore-file">KHÔI PHỤC (TỪ TẬP TIN)</button>
              ${
                hasBackupInMem
                  ? `<button type="button" class="btn-vht outline" id="cfg-btn-restore-mem" title="Tiện ích mô phỏng: Nạp nhanh ngay bản Sao lưu gia đình LongGiang không cần tìm file trên ổ đĩa">⚡ Nạp nhanh bản Sao lưu gốc 'LongGiang'</button>`
                  : ""
              }
            </div>
          </div>
        </div>

        <div class="vht-card">
          <div class="vht-card-header">3. Khôi phục về bản lưu tự động ngay trước lần Khôi phục mặc định gần nhất</div>
          <div class="vht-card-body">
            <p style="margin-bottom:10px;color:#334155;">
              Tính năng cứu hộ thông minh của Firmware Viettel: Giúp <strong>Hoàn tác (Undo)</strong> nếu người dùng lỡ tay bấm Reset nhầm mà chưa kịp tải file sao lưu về máy.
              ${hasPreResetSnap ? '<span class="badge-pill green">Đang có bản chụp tự động trước lần Reset</span>' : '<span class="badge-pill gray">Chưa có lịch sử Reset trước đó</span>'}
            </p>
            <button type="button" class="btn-vht secondary" id="cfg-btn-undo-reset">KHÔI PHỤC (BẢN TRƯỚC LẦN RESET GẦN NHẤT)</button>
          </div>
        </div>

        <div class="vht-card">
          <div class="vht-card-header">4. Khôi phục hoàn toàn về mặc định nhà sản xuất (Reset mềm)</div>
          <div class="vht-card-body">
            <p style="margin-bottom:10px;color:#991b1b;">
              Xóa sạch mọi cấu hình người dùng và đưa thiết bị trở về đúng thông số in trên tem mặt đáy (SSID: <code>VIETTEL_39D5BC</code> / Pass: <code>123456a@</code>, Admin: <code>admin</code> / <code>VTGR2239D5BC</code>; riêng WAN <code>1_INTERNET_R_VID_35</code> tự đồng bộ lại qua OMCI).
            </p>
            <button type="button" class="btn-vht danger" id="cfg-btn-factory">KHÔI PHỤC HOÀN TOÀN</button>
          </div>
        </div>
      `;
    },
    bind: function () {
      document.getElementById("cfg-btn-backup").addEventListener("click", function () {
        const snapshotStr = JSON.stringify(window.SimState, null, 2);
        try {
          localStorage.setItem(window.SimEngine.BACKUP_KEY, snapshotStr);
        } catch (e) {}

        const blob = new Blob([snapshotStr], { type: "application/octet-stream" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "romfile_vGP-42X6V1_backup.cfg";
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);

        window.SimEngine.addLog("[CONFIG] Đã xuất file SAO LƯU cấu hình (romfile_vGP-42X6V1_backup.cfg).");
        window.RouterApp.showToast("Đã tải file sao lưu 'romfile_vGP-42X6V1_backup.cfg' về máy tính!");
        window.RouterApp.renderCurrentPage();
      });

      function applyRestoredObject(parsed, label) {
        if (!parsed || !parsed.wifi24 || !parsed.lan) {
          return alert("Tập tin cấu hình không đúng định dạng bản sao lưu mô phỏng vGP-42X6V1!");
        }
        window.RouterApp.runRebootSimulation("Đang nạp lại file cấu hình & khởi động lại dịch vụ mạng...", function () {
          window.SimState = parsed;
          window.SimEngine.addLog("[CONFIG] Đã KHÔI PHỤC thành công cấu hình từ " + label + " (SSID: " + parsed.wifi24.ssids[0].ssid + ").");
          window.SimEngine.saveState();
          window.RouterApp.renderAll();
          window.RouterApp.showToast("Khôi phục thành công! Sóng '" + parsed.wifi24.ssids[0].ssid + "' đã hoạt động trở lại.");
        });
      }

      document.getElementById("cfg-btn-restore-file").addEventListener("click", function () {
        const inp = document.getElementById("cfg-file-input");
        if (!inp.files || inp.files.length === 0) {
          return alert("Vui lòng bấm 'Chọn tập tin' và trỏ tới file .cfg đã sao lưu ở Phân cảnh 1!");
        }
        const reader = new FileReader();
        reader.onload = function (ev) {
          try {
            const parsed = JSON.parse(ev.target.result);
            applyRestoredObject(parsed, "file " + inp.files[0].name);
          } catch (err) {
            // If user picked the real binary/encrypted router romfile.cfg from workspace, gracefully restore family LongGiang config!
            const fam = window.SimEngine.createFamilyPreResetConfig(window.SimState.coach.groupSsid);
            applyRestoredObject(fam, "tập tin romfile gốc gia đình (" + inp.files[0].name + ")");
          }
        };
        reader.readAsText(inp.files[0]);
      });

      const memBtn = document.getElementById("cfg-btn-restore-mem");
      if (memBtn) {
        memBtn.addEventListener("click", function () {
          const raw = localStorage.getItem(window.SimEngine.BACKUP_KEY);
          if (!raw) return alert("Chưa có bản sao lưu trong bộ nhớ!");
          applyRestoredObject(JSON.parse(raw), "bản Sao lưu gốc gia đình");
        });
      }

      document.getElementById("cfg-btn-undo-reset").addEventListener("click", function () {
        const raw = localStorage.getItem(window.SimEngine.SNAPSHOT_KEY);
        if (!raw) {
          return alert("Chưa có bản ghi nào trước lần Reset mặc định! (Tính năng này dùng sau khi bạn đã từng bấm Reset ít nhất 1 lần).");
        }
        applyRestoredObject(JSON.parse(raw), "bản tự động lưu trước lần Reset gần nhất");
      });

      document.getElementById("cfg-btn-factory").addEventListener("click", function () {
        if (!confirm("Bạn có chắc chắn muốn KHÔI PHỤC HOÀN TOÀN về cài đặt gốc nhà sản xuất (Reset mềm)?")) return;
        window.RouterApp.runRebootSimulation("Đang xóa cấu hình & Khôi phục mặc định xuất xưởng (VIETTEL_39D5BC)...", function () {
          window.SimEngine.performFactoryReset("Reset mềm trên Web UI");
          window.RouterApp.renderAll();
          window.RouterApp.showToast("Đã Reset về mặc định xuất xưởng! Sóng Wi-Fi hiện tại: VIETTEL_39D5BC.");
        });
      });
    }
  };

  // --------------------------------------------------------------------------
  // 23. Bảo dưỡng -> Chẩn đoán mạng (/cgi-bin/tools-diagnostic.asp)
  // --------------------------------------------------------------------------
  window.RouterPages["tools-diagnostic"] = {
    title: "Chẩn đoán mạng (Auto Check, Ping & Traceroute)",
    group: "Bảo dưỡng",
    cgi: "/cgi-bin/tools-diagnostic.asp",
    lastOutput: "Sẵn sàng. Chọn công cụ Ping hoặc Traceroute, nhập địa chỉ đích (ví dụ 8.8.8.8 hoặc fit.hcmus.edu.vn) rồi bấm CHẨN ĐOÁN.",
    render: function () {
      const fault = window.SimState.device.fiberFault;
      const lanOk = window.SimState.simDevices.laptopObs.connMode === "LAN1";

      return `
        <div class="vht-card">
          <div class="vht-card-header">
            <span>1. Kiểm tra tự động 4 tầng kết nối hệ thống</span>
            <button type="button" class="btn-vht small" id="diag-recheck">KIỂM TRA LẠI</button>
          </div>
          <div class="vht-card-body">
            <table class="data-table">
              <thead><tr><th>Hạng mục kiểm tra</th><th>Kết quả</th></tr></thead>
              <tbody>
                <tr>
                  <td>Kiểm tra kết nối cổng Ethernet LAN</td>
                  <td>${lanOk ? '<span class="badge-pill green">PASS (LAN1 Up 1000 Mbps)</span>' : '<span class="badge-pill gray">WARN (Không cắm dây LAN1)</span>'}</td>
                </tr>
                <tr>
                  <td>Kiểm tra đồng bộ MAC xPON</td>
                  <td>${fault ? '<span class="badge-pill red">FAIL (LOS)</span>' : '<span class="badge-pill green">PASS</span>'}</td>
                </tr>
                <tr>
                  <td>Kiểm tra kết nối quang xPON &amp; OMCI (O5)</td>
                  <td>${fault ? '<span class="badge-pill red">FAIL (Mất tín hiệu ánh sáng)</span>' : '<span class="badge-pill green">PASS (O5 Associated)</span>'}</td>
                </tr>
                <tr>
                  <td>Kiểm tra kết nối máy chủ DNS nhà mạng (116.97.90.124)</td>
                  <td>${fault ? '<span class="badge-pill red">FAIL</span>' : '<span class="badge-pill green">PASS</span>'}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div class="vht-card">
          <div class="vht-card-header">2. Công cụ Chẩn đoán Ping &amp; Traceroute trực tiếp trên Router</div>
          <div class="vht-card-body">
            <table class="form-table">
              <tr>
                <th>Công cụ chẩn đoán:</th>
                <td>
                  <div class="check-grid">
                    <label class="check-item"><input type="radio" name="diag-tool" value="Ping" checked /> <strong>Ping</strong> (Đo độ trễ khứ hồi ms &amp; tỷ lệ mất gói %)</label>
                    <label class="check-item"><input type="radio" name="diag-tool" value="Traceroute" /> <strong>Traceroute</strong> (Liệt kê chi tiết từng trạm Router trung gian / từng Hop)</label>
                  </div>
                </td>
              </tr>
              <tr>
                <th>Giao diện nguồn WAN:</th>
                <td><select class="vht-select"><option>1_INTERNET_R_VID_35 (27.68.142.95)</option></select></td>
              </tr>
              <tr>
                <th>Địa chỉ IP / Tên miền đích:</th>
                <td>
                  <input type="text" class="vht-input" id="diag-target" value="8.8.8.8" />
                  <button type="button" class="btn-icon diag-quick" data-host="8.8.8.8">8.8.8.8</button>
                  <button type="button" class="btn-icon diag-quick" data-host="google.com">google.com</button>
                  <button type="button" class="btn-icon diag-quick" data-host="fit.hcmus.edu.vn">fit.hcmus.edu.vn</button>
                </td>
              </tr>
            </table>
            <div class="btn-row">
              <button type="button" class="btn-vht" id="diag-run">CHẨN ĐOÁN</button>
            </div>
            <div class="diag-console" id="diag-console">${esc(this.lastOutput)}</div>
          </div>
        </div>
      `;
    },
    bind: function () {
      const self = this;
      document.getElementById("diag-recheck").addEventListener("click", function () {
        window.RouterApp.showToast("Đã chạy kiểm tra nhanh 4 tầng kết nối!");
        window.RouterApp.renderCurrentPage();
      });

      document.querySelectorAll(".diag-quick").forEach(function (b) {
        b.addEventListener("click", function () {
          document.getElementById("diag-target").value = b.getAttribute("data-host");
        });
      });

      document.getElementById("diag-run").addEventListener("click", function () {
        const tool = document.querySelector('input[name="diag-tool"]:checked').value;
        const host = document.getElementById("diag-target").value.trim() || "8.8.8.8";
        const con = document.getElementById("diag-console");

        if (window.SimState.device.fiberFault) {
          self.lastOutput = tool.toUpperCase() + " " + host + ": Network is unreachable (Cáp quang đang báo lỗi LOS đỏ!)";
          con.textContent = self.lastOutput;
          return;
        }

        const resolvedIp =
          host === "8.8.8.8"
            ? "8.8.8.8"
            : host.includes("hcmus")
            ? "14.161.22.174"
            : host.includes("google")
            ? "142.250.199.46"
            : "104.18.25.81";

        con.textContent = "Đang thực thi " + tool + " tới " + host + " (" + resolvedIp + ")...\n";
        const lines =
          tool === "Ping"
            ? [
                "PING " + host + " (" + resolvedIp + "): 56 data bytes",
                "64 bytes from " + resolvedIp + ": seq=0 ttl=117 time=12.4 ms",
                "64 bytes from " + resolvedIp + ": seq=1 ttl=117 time=13.1 ms",
                "64 bytes from " + resolvedIp + ": seq=2 ttl=117 time=12.8 ms",
                "64 bytes from " + resolvedIp + ": seq=3 ttl=117 time=13.6 ms",
                "",
                "--- " + host + " ping statistics ---",
                "4 packets transmitted, 4 packets received, 0% packet loss",
                "round-trip min/avg/max = 12.4/12.97/13.6 ms"
              ]
            : [
                "traceroute to " + host + " (" + resolvedIp + "), 30 hops max, 38 byte packets",
                " 1  27.68.142.1 (Trạm BRAS/OLT Viettel Khu vực TP.HCM)  2.412 ms  2.185 ms  2.301 ms",
                " 2  171.255.64.145 (Viettel Metro Core HCM)             3.890 ms  4.012 ms  3.954 ms",
                " 3  116.97.98.21 (Viettel Backbone Router)              6.512 ms  6.440 ms  6.701 ms",
                " 4  203.190.170.42 (Tuyến kết nối Quốc tế Viettel IXP) 11.840 ms 12.105 ms 11.930 ms",
                " 5  72.14.209.130 (Peer Edge Gateway)                  12.604 ms 12.711 ms 12.589 ms",
                " 6  " + resolvedIp + " (" + host + ")                  13.120 ms 12.980 ms 13.210 ms",
                "",
                "Chẩn đoán Traceroute hoàn tất (Đường truyền thông suốt qua 6 chặng / Hops)."
              ];

        let idx = 0;
        const timer = setInterval(function () {
          if (idx < lines.length) {
            con.textContent += lines[idx] + "\n";
            con.scrollTop = con.scrollHeight;
            idx++;
          } else {
            clearInterval(timer);
            self.lastOutput = con.textContent;
          }
        }, 160);

        window.SimEngine.addLog("[DIAGNOSTIC] Đã chạy " + tool + " tới " + host + " (0% loss).");
      });
    }
  };

  // --------------------------------------------------------------------------
  // 24. Bảo dưỡng -> Bản ghi hệ thống (/cgi-bin/tools-log.asp)
  // --------------------------------------------------------------------------
  window.RouterPages["tools-log"] = {
    title: "Bản ghi hệ thống (System Log)",
    group: "Bảo dưỡng",
    cgi: "/cgi-bin/tools-log.asp",
    render: function () {
      const logs = window.SimState.tools.logs || [];
      return `
        <div class="vht-card">
          <div class="vht-card-header">
            <span>Nhật ký sự kiện hoạt động của Router (${logs.length} dòng)</span>
            <div style="display:flex;gap:8px;">
              <button type="button" class="btn-vht small" id="log-download">TẢI XUỐNG SYSLOG</button>
              <button type="button" class="btn-vht secondary small" id="log-clear">XÓA BẢN GHI</button>
            </div>
          </div>
          <div class="vht-card-body">
            <div class="diag-console" style="min-height:300px;color:#e2e8f0;">${esc(logs.join("\n"))}</div>
          </div>
        </div>
      `;
    },
    bind: function () {
      document.getElementById("log-download").addEventListener("click", function () {
        const txt = (window.SimState.tools.logs || []).join("\r\n");
        const blob = new Blob([txt], { type: "text/plain" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "vGP-42X6V1_syslog.txt";
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      });
      document.getElementById("log-clear").addEventListener("click", function () {
        window.SimState.tools.logs = [];
        window.SimEngine.addLog("[SYSLOG] Đã xóa trống nhật ký hệ thống.");
        window.RouterApp.renderCurrentPage();
      });
    }
  };

  // --------------------------------------------------------------------------
  // 25. Bảo dưỡng -> Khởi động lại (/cgi-bin/tools-reboot.asp)
  // --------------------------------------------------------------------------
  window.RouterPages["tools-reboot"] = {
    title: "Khởi động lại thiết bị (Soft Reboot)",
    group: "Bảo dưỡng",
    cgi: "/cgi-bin/tools-reboot.asp",
    render: function () {
      return `
        <div class="vht-card">
          <div class="vht-card-header">Khởi động lại mềm (Soft Reboot)</div>
          <div class="vht-card-body">
            <p style="margin-bottom:14px;color:#334155;">
              Khởi động lại hệ điều hành của Router để giải phóng bộ nhớ RAM và làm mới phiên kết nối quang GPON mà <strong>không</strong> làm mất các cài đặt đã lưu.
            </p>
            <button type="button" class="btn-vht" id="btn-soft-reboot">KHỞI ĐỘNG LẠI</button>
          </div>
        </div>
      `;
    },
    bind: function () {
      document.getElementById("btn-soft-reboot").addEventListener("click", function () {
        if (!confirm("Bạn có muốn khởi động lại Router vGP-42X6V1 ngay bây giờ?")) return;
        window.RouterApp.runRebootSimulation("Đang khởi động lại thiết bị vGP-42X6V1 (Giữ nguyên cấu hình đã lưu)...", function () {
          window.SimState.device.uptimeSec = 5;
          window.SimState.device.ramUsage = 39;
          window.SimEngine.addLog("[REBOOT] Thiết bị đã khởi động lại mềm thành công.");
          window.SimEngine.saveState();
          window.RouterApp.renderAll();
          window.RouterApp.showToast("Thiết bị vGP-42X6V1 đã khởi động lại hoàn tất!");
        });
      });
    }
  };
})();
