/* ==========================================================================
   pages-apps-tools.js — Renderers & Handlers for Ứng dụng (6 pages) & Bảo dưỡng (8 pages)
   Exact VHT Firmware V1302250508 layout & labels
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

  function swHtml(id, checked, extraAttr) {
    return `<label class="vht-switch"><input type="checkbox" id="${id}" ${checked ? "checked" : ""} ${extraAttr || ""} /><span class="vht-slider"></span></label>`;
  }

  function passHtml(id, val, placeholder) {
    return `
      <div class="vht-pass-wrap">
        <input type="password" class="vht-input" id="${id}" value="${esc(val)}" placeholder="${esc(placeholder || "")}" />
        <button type="button" class="vht-pass-eye" data-target="${id}" title="Hiện/Ẩn mật khẩu">👁</button>
      </div>
    `;
  }

  function bindPassEyes() {
    document.querySelectorAll(".vht-pass-eye").forEach(function (btn) {
      btn.addEventListener("click", function () {
        const inp = document.getElementById(btn.getAttribute("data-target"));
        if (!inp) return;
        inp.type = inp.type === "password" ? "text" : "password";
      });
    });
  }

  // --------------------------------------------------------------------------
  // 12. Ứng dụng -> DMZ (/cgi-bin/apps-dmz.asp)
  // --------------------------------------------------------------------------
  window.RouterPages["apps-dmz"] = {
    title: "Thiết lập DMZ",
    group: "Ứng dụng",
    cgi: "/cgi-bin/apps-dmz.asp",
    render: function () {
      const dmz = window.SimState.apps.dmz;
      return `
        <div class="vht-widget">
          <header class="vht-widget-title">Thiết lập DMZ</header>
          <div class="vht-card">
            <table class="form-table">
              <tr>
                <th>Tên giao diện WAN</th>
                <td>
                  <select class="vht-select" id="dmz-wan">
                    <option value="1_INTERNET_R_VID_35">1_INTERNET_R_VID_35</option>
                  </select>
                </td>
              </tr>
              <tr>
                <th>Kích hoạt</th>
                <td>${swHtml("dmz-en", dmz.enabled)}</td>
              </tr>
              <tr>
                <th>Địa chỉ LAN</th>
                <td>
                  <input type="text" class="vht-input" id="dmz-ip" value="${esc(dmz.hostIp)}" placeholder="0.0.0.0" />
                </td>
              </tr>
            </table>
            <div class="btn-row center" style="gap:14px;">
              <button type="button" class="btn-vht" id="dmz-btn-apply">ÁP DỤNG</button>
              <button type="button" class="btn-vht secondary" id="dmz-btn-cancel">HỦY</button>
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
      document.getElementById("dmz-btn-cancel").addEventListener("click", function () {
        window.RouterApp.renderCurrentPage();
      });
    }
  };

  // --------------------------------------------------------------------------
  // 13. Ứng dụng -> Port Forwarding (/cgi-bin/apps-portforwarding.asp)
  // --------------------------------------------------------------------------
  window.RouterPages["apps-portforwarding"] = {
    title: "Thiết lập Port Forwarding",
    group: "Ứng dụng",
    cgi: "/cgi-bin/apps-portforwarding.asp",
    showForm: false,
    editIndex: -1,
    render: function () {
      const list = window.SimState.apps.portForwarding;
      const editingItem = this.editIndex >= 0 && list[this.editIndex] ? list[this.editIndex] : null;
      return `
        <div class="vht-widget">
          <header class="vht-widget-title">Thiết lập Port Forwarding</header>
          <div class="vht-card">
            <table class="form-table" style="margin-bottom:14px;">
              <tr>
                <th>Tên giao diện WAN</th>
                <td><strong>1_INTERNET_R_VID_35</strong></td>
              </tr>
            </table>

            ${
              this.showForm
                ? `
            <div style="border-top:1px solid #f0f0f0;padding-top:16px;margin-bottom:18px;">
              <table class="form-table">
                <tr>
                  <th></th>
                  <td>
                    <div class="check-grid">
                      <label class="check-item"><input type="radio" name="pf-srv-mode" value="custom" checked /> Tùy biến</label>
                      <label class="check-item"><input type="radio" name="pf-srv-mode" value="preset" /> Chọn Ứng dụng</label>
                    </div>
                  </td>
                </tr>
                <tr id="pf-service-row" style="display:none;">
                  <th>Service Type</th>
                  <td>
                    <select class="vht-select" id="pf-preset">
                      <option value="">Chọn...</option>
                      <option value="Domain Name Server|TCP/UDP|53|53">Domain Name Server</option>
                      <option value="FTP Server|TCP|21|21">FTP Server</option>
                      <option value="IPSEC|UDP|500|500">IPSEC</option>
                      <option value="Mail POP3|TCP|110|110">Mail POP3</option>
                      <option value="Mail SMTP|TCP|25|25">Mail SMTP</option>
                      <option value="PPTP|TCP|1723|1723">PPTP</option>
                      <option value="Real Player 8 Plus|UDP|7070|7070">Real Player 8 Plus</option>
                      <option value="Secure Shell Server|TCP|22|22">Secure Shell Server</option>
                      <option value="SNMP|UDP|161|161">SNMP</option>
                      <option value="SNMP Trap|UDP|162|162">SNMP Trap</option>
                      <option value="Telnet Server|TCP|23|23">Telnet Server</option>
                      <option value="TFTP|UDP|69|69">TFTP</option>
                    </select>
                  </td>
                </tr>
                <tr>
                  <th>Giao thức</th>
                  <td>
                    <select class="vht-select" id="pf-proto">
                      <option value="TCP" ${editingItem && editingItem.proto === "TCP" ? "selected" : ""}>TCP</option>
                      <option value="UDP" ${editingItem && editingItem.proto === "UDP" ? "selected" : ""}>UDP</option>
                      <option value="TCP/UDP" ${editingItem && editingItem.proto === "TCP/UDP" ? "selected" : ""}>TCP/UDP</option>
                    </select>
                  </td>
                </tr>
                <tr>
                  <th>Tên Mapping</th>
                  <td><input type="text" class="vht-input" id="pf-name" value="${esc(editingItem ? editingItem.name : "Web_Server_LAN")}" /></td>
                </tr>
                <tr>
                  <th>IP trong</th>
                  <td><input type="text" class="vht-input" id="pf-ip" value="${esc(editingItem ? editingItem.internalIp : "192.168.1.150")}" /></td>
                </tr>
                <tr>
                  <th>Port trong</th>
                  <td><input type="text" class="vht-input" id="pf-inport" value="${esc(editingItem ? editingItem.internalPort : "80")}" /></td>
                </tr>
                <tr>
                  <th>Port ngoài</th>
                  <td><input type="text" class="vht-input" id="pf-extport" value="${esc(editingItem ? editingItem.externalPort : "8080")}" /></td>
                </tr>
              </table>
              <div class="btn-row center" style="gap:14px;">
                <button type="button" class="btn-vht" id="pf-btn-save">ÁP DỤNG</button>
                <button type="button" class="btn-vht secondary" id="pf-btn-cancel">HỦY</button>
              </div>
            </div>`
                : ""
            }

            <div class="table-bordered-radius">
              <table class="data-table">
                <thead>
                  <tr>
                    <th style="width:44px;"><input type="checkbox" id="pf-chk-all" /></th>
                    <th>Tên Mapping</th>
                    <th>Giao thức</th>
                    <th>IP trong</th>
                    <th>Port trong</th>
                    <th>Port ngoài</th>
                    <th>Trạng thái</th>
                    <th>Hiệu chỉnh</th>
                  </tr>
                </thead>
                <tbody>
                  ${
                    list.length === 0
                      ? `<tr><td colspan="8" class="empty-row">Chưa có luật Port Forwarding nào.</td></tr>`
                      : list
                          .map(
                            (item, idx) => `
                    <tr>
                      <td><input type="checkbox" class="pf-row-chk" data-idx="${idx}" /></td>
                      <td>${esc(item.name)}</td>
                      <td>${esc(item.proto)}</td>
                      <td>${esc(item.internalIp)}</td>
                      <td>${item.internalPort}</td>
                      <td>${item.externalPort}</td>
                      <td>
                        <label class="vht-switch">
                          <input type="checkbox" class="pf-row-en" data-idx="${idx}" ${item.enabled !== false ? "checked" : ""} />
                          <span class="vht-slider"></span>
                        </label>
                      </td>
                      <td><button type="button" class="btn-icon pf-edit" data-idx="${idx}" title="Hiệu chỉnh">✏️</button></td>
                    </tr>`
                          )
                          .join("")
                  }
                </tbody>
              </table>
            </div>

            <div class="btn-row" style="justify-content:flex-end;margin-top:16px;">
              <button type="button" class="btn-vht small" id="pf-btn-toggle-add">THÊM</button>
              <button type="button" class="btn-vht secondary small" id="pf-btn-del">XÓA</button>
            </div>
          </div>
        </div>
      `;
    },
    bind: function () {
      const self = this;
      const list = window.SimState.apps.portForwarding;

      document.getElementById("pf-btn-toggle-add").addEventListener("click", function () {
        self.editIndex = -1;
        self.showForm = true;
        window.RouterApp.renderCurrentPage();
      });

      const chkAll = document.getElementById("pf-chk-all");
      if (chkAll) {
        chkAll.addEventListener("change", function () {
          document.querySelectorAll(".pf-row-chk").forEach(function (c) {
            c.checked = chkAll.checked;
          });
        });
      }

      document.querySelectorAll(".pf-row-en").forEach(function (sw) {
        sw.addEventListener("change", function () {
          const i = parseInt(sw.getAttribute("data-idx"), 10);
          if (list[i]) {
            list[i].enabled = sw.checked;
            window.SimEngine.saveState();
          }
        });
      });

      document.querySelectorAll(".pf-edit").forEach(function (btn) {
        btn.addEventListener("click", function () {
          self.editIndex = parseInt(btn.getAttribute("data-idx"), 10);
          self.showForm = true;
          window.RouterApp.renderCurrentPage();
        });
      });

      document.getElementById("pf-btn-del").addEventListener("click", function () {
        const chks = Array.from(document.querySelectorAll(".pf-row-chk:checked")).map(function (c) {
          return parseInt(c.getAttribute("data-idx"), 10);
        });
        if (chks.length === 0) {
          return alert("Vui lòng tích chọn ít nhất 1 mục cần xóa!");
        }
        chks
          .sort(function (a, b) {
            return b - a;
          })
          .forEach(function (idx) {
            list.splice(idx, 1);
          });
        self.showForm = false;
        self.editIndex = -1;
        window.SimEngine.saveState();
        window.RouterApp.renderCurrentPage();
      });

      if (self.showForm) {
        const srvRow = document.getElementById("pf-service-row");
        const presetSel = document.getElementById("pf-preset");
        document.querySelectorAll('input[name="pf-srv-mode"]').forEach(function (rad) {
          rad.addEventListener("change", function () {
            srvRow.style.display = rad.value === "preset" && rad.checked ? "" : "none";
          });
        });

        presetSel.addEventListener("change", function () {
          if (!presetSel.value) return;
          const [nm, pr, inp, extp] = presetSel.value.split("|");
          document.getElementById("pf-name").value = nm;
          document.getElementById("pf-proto").value = pr;
          document.getElementById("pf-inport").value = inp;
          document.getElementById("pf-extport").value = extp;
        });

        document.getElementById("pf-btn-cancel").addEventListener("click", function () {
          self.showForm = false;
          self.editIndex = -1;
          window.RouterApp.renderCurrentPage();
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

          const obj = {
            id: Date.now(),
            name: name,
            proto: proto,
            internalIp: ip,
            internalPort: inPort,
            externalPort: extPort,
            enabled: true
          };

          if (self.editIndex >= 0 && list[self.editIndex]) {
            list[self.editIndex] = obj;
          } else {
            list.push(obj);
          }

          self.showForm = false;
          self.editIndex = -1;
          window.SimEngine.addLog(
            "[PORT FORWARDING] Mở cổng " + proto + " WAN:" + extPort + " -> " + ip + ":" + inPort + " (" + name + ")."
          );
          window.RouterApp.applyWithFeedback("Đã lưu luật Port Forwarding (" + name + ")!");
        });
      }
    }
  };

  // --------------------------------------------------------------------------
  // 14. Ứng dụng -> Giới hạn phiên kết nối (/cgi-bin/apps-sslim.asp)
  // --------------------------------------------------------------------------
  window.RouterPages["apps-sslim"] = {
    title: "Giới hạn phiên kết nối",
    group: "Ứng dụng",
    cgi: "/cgi-bin/apps-sslim.asp",
    render: function () {
      const sl = window.SimState.apps.sessionLimit;
      return `
        <div class="vht-widget">
          <header class="vht-widget-title">Giới hạn phiên kết nối</header>
          <div class="vht-card">
            <legend class="vht-legend">Giới hạn tổng số phiên</legend>
            <table class="form-table" style="margin-bottom:20px;">
              <tr>
                <th>Giao diện</th>
                <td><strong>1_INTERNET_R_VID_35</strong></td>
              </tr>
              <tr>
                <th>Tổng số phiên tối đa</th>
                <td>
                  <input type="text" class="vht-input short" id="sl-sysmax" value="${sl.systemMax || 16384}" />
                  <span class="field-hint">(8000-16384)</span>
                </td>
              </tr>
            </table>

            <legend class="vht-legend">Giới hạn cho từng người dùng</legend>
            <table class="form-table" style="margin-bottom:20px;">
              <tr>
                <th>Giới hạn cho từng người dùng</th>
                <td>${swHtml("sl-en", sl.enabled)}</td>
              </tr>
              <tr>
                <th>Giới hạn mặc định</th>
                <td><input type="text" class="vht-input short" id="sl-def" value="${sl.defaultPerIp}" /></td>
              </tr>
            </table>

            <legend class="vht-legend">Bảng giới hạn cho từng IP cụ thể</legend>
            <div class="table-bordered-radius" style="margin-bottom:14px;">
              <table class="data-table">
                <thead>
                  <tr>
                    <th>Địa chỉ IP</th>
                    <th>Giới hạn</th>
                    <th>Thao tác</th>
                  </tr>
                </thead>
                <tbody>
                  ${
                    sl.rules.length === 0
                      ? `<tr><td colspan="3" class="empty-row">Chưa có giới hạn riêng.</td></tr>`
                      : sl.rules
                          .map(
                            (r, i) => `
                    <tr>
                      <td>${esc(r.ip)}</td>
                      <td>${r.max}</td>
                      <td><button type="button" class="btn-icon sl-del" data-idx="${i}">🗑️</button></td>
                    </tr>`
                          )
                          .join("")
                  }
                  <tr>
                    <td><input type="text" class="vht-input" id="sl-ip" placeholder="192.168.1.50" style="max-width:220px;" /></td>
                    <td><input type="text" class="vht-input short" id="sl-max" placeholder="2000" /></td>
                    <td><button type="button" class="btn-vht small" id="sl-add">THÊM</button></td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div class="btn-row center">
              <button type="button" class="btn-vht" id="sl-apply">ÁP DỤNG</button>
            </div>
          </div>
        </div>
      `;
    },
    bind: function () {
      const sl = window.SimState.apps.sessionLimit;
      document.getElementById("sl-apply").addEventListener("click", function () {
        sl.systemMax = parseInt(document.getElementById("sl-sysmax").value, 10) || 16384;
        sl.enabled = document.getElementById("sl-en").checked;
        sl.defaultPerIp = parseInt(document.getElementById("sl-def").value, 10) || 4096;
        window.SimEngine.addLog("[SESSION LIMIT] Cập nhật giới hạn phiên mặc định: " + sl.defaultPerIp + "/IP.");
        window.RouterApp.applyWithFeedback("Đã lưu cấu hình Giới hạn phiên kết nối!");
      });
      document.getElementById("sl-add").addEventListener("click", function () {
        const ip = document.getElementById("sl-ip").value.trim();
        const mx = parseInt(document.getElementById("sl-max").value, 10);
        if (!ip || !mx) return alert("Vui lòng nhập đầy đủ Địa chỉ IP và Giới hạn!");
        sl.rules.push({ ip: ip, max: mx });
        window.SimEngine.saveState();
        window.RouterApp.renderCurrentPage();
      });
      document.querySelectorAll(".sl-del").forEach(function (b) {
        b.addEventListener("click", function () {
          sl.rules.splice(parseInt(b.getAttribute("data-idx"), 10), 1);
          window.SimEngine.saveState();
          window.RouterApp.renderCurrentPage();
        });
      });
    }
  };

  // --------------------------------------------------------------------------
  // 15. Ứng dụng -> Định tuyến tĩnh (/cgi-bin/apps-route.asp)
  // --------------------------------------------------------------------------
  window.RouterPages["apps-route"] = {
    title: "Định tuyến tĩnh",
    group: "Ứng dụng",
    cgi: "/cgi-bin/apps-route.asp",
    showForm: false,
    render: function () {
      const routes = window.SimState.apps.staticRoutes;
      return `
        <div class="vht-widget">
          <header class="vht-widget-title">Định tuyến tĩnh</header>
          <div class="vht-card">
            <legend class="vht-legend">Định tuyến tĩnh</legend>
            <div class="table-bordered-radius">
              <table class="data-table">
                <thead>
                  <tr>
                    <th style="width:44px;"><input type="checkbox" id="sr-chk-all" /></th>
                    <th>IP đích</th>
                    <th>Gateway</th>
                    <th>Mặt nạ mạng con</th>
                    <th>Giao diện mạng</th>
                  </tr>
                </thead>
                <tbody>
                  ${
                    routes.length === 0
                      ? `<tr><td colspan="5" class="empty-row">Chưa có tuyến định tuyến tĩnh nào.</td></tr>`
                      : routes
                          .map(
                            (r, i) => `
                    <tr>
                      <td><input type="checkbox" class="sr-row-chk" data-idx="${i}" /></td>
                      <td>${esc(r.destIp)}</td>
                      <td>${esc(r.gateway)}</td>
                      <td>${esc(r.mask)}</td>
                      <td>${esc(r.iface)}</td>
                    </tr>`
                          )
                          .join("")
                  }
                </tbody>
              </table>
            </div>

            <div class="btn-row" style="justify-content:flex-end;margin-top:16px;">
              <button type="button" class="btn-vht small" id="sr-btn-show-add">THÊM</button>
              <button type="button" class="btn-vht secondary small" id="sr-btn-del">XÓA</button>
            </div>

            ${
              this.showForm
                ? `
            <div style="border-top:1px solid #f0f0f0;margin-top:18px;padding-top:18px;">
              <legend class="vht-legend">Thêm mục mới</legend>
              <table class="form-table">
                <tr>
                  <th>Địa chỉ IP đích</th>
                  <td><input type="text" class="vht-input" id="sr-dest" placeholder="192.168.2.0" /></td>
                </tr>
                <tr>
                  <th>Mặt nạ mạng con</th>
                  <td><input type="text" class="vht-input" id="sr-mask" value="255.255.255.0" /></td>
                </tr>
                <tr>
                  <th><label class="check-item"><input type="checkbox" id="sr-use-gw" checked /> Sử dụng gateway</label></th>
                  <td><input type="text" class="vht-input" id="sr-gw" placeholder="192.168.1.254" /></td>
                </tr>
                <tr>
                  <th><label class="check-item"><input type="checkbox" id="sr-use-if" checked /> Sử dụng giao diện mạng</label></th>
                  <td>
                    <select class="vht-select" id="sr-iface">
                      <option value="1_INTERNET_R_VID_35">1_INTERNET_R_VID_35</option>
                      <option value="LAN">LAN</option>
                    </select>
                  </td>
                </tr>
              </table>
              <div class="btn-row center" style="gap:14px;">
                <button type="button" class="btn-vht" id="sr-add">ÁP DỤNG</button>
                <button type="button" class="btn-vht secondary" id="sr-cancel">HỦY</button>
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
      const routes = window.SimState.apps.staticRoutes;

      document.getElementById("sr-btn-show-add").addEventListener("click", function () {
        self.showForm = true;
        window.RouterApp.renderCurrentPage();
      });

      const chkAll = document.getElementById("sr-chk-all");
      if (chkAll) {
        chkAll.addEventListener("change", function () {
          document.querySelectorAll(".sr-row-chk").forEach(function (c) {
            c.checked = chkAll.checked;
          });
        });
      }

      document.getElementById("sr-btn-del").addEventListener("click", function () {
        const chks = Array.from(document.querySelectorAll(".sr-row-chk:checked")).map(function (c) {
          return parseInt(c.getAttribute("data-idx"), 10);
        });
        if (chks.length === 0) return alert("Vui lòng tích chọn tuyến cần xóa!");
        chks
          .sort(function (a, b) {
            return b - a;
          })
          .forEach(function (idx) {
            routes.splice(idx, 1);
          });
        window.SimEngine.saveState();
        window.RouterApp.renderCurrentPage();
      });

      if (self.showForm) {
        document.getElementById("sr-cancel").addEventListener("click", function () {
          self.showForm = false;
          window.RouterApp.renderCurrentPage();
        });
        document.getElementById("sr-add").addEventListener("click", function () {
          const dest = document.getElementById("sr-dest").value.trim();
          const mask = document.getElementById("sr-mask").value.trim();
          const gw = document.getElementById("sr-gw").value.trim() || "0.0.0.0";
          const iface = document.getElementById("sr-iface").value;
          if (!dest || !mask) return alert("Vui lòng nhập Địa chỉ IP đích và Mặt nạ mạng con!");
          routes.push({ destIp: dest, mask: mask, gateway: gw, iface: iface });
          self.showForm = false;
          window.SimEngine.addLog("[STATIC ROUTE] Thêm tuyến tĩnh tới " + dest + " qua Gateway " + gw + ".");
          window.RouterApp.applyWithFeedback("Đã thêm tuyến Định tuyến tĩnh!");
        });
      }
    }
  };

  // --------------------------------------------------------------------------
  // 16. Ứng dụng -> DNS động (DDNS) (/cgi-bin/apps-ddns.asp)
  // --------------------------------------------------------------------------
  window.RouterPages["apps-ddns"] = {
    title: "DNS động (DDNS)",
    group: "Ứng dụng",
    cgi: "/cgi-bin/apps-ddns.asp",
    render: function () {
      const d = window.SimState.apps.ddns;
      return `
        <div class="vht-widget">
          <header class="vht-widget-title">DNS động (DDNS)</header>
          <div class="vht-card">
            <table class="form-table">
              <tr>
                <th>Giao diện</th>
                <td>
                  <select class="vht-select" id="ddns-wan">
                    <option value="1_INTERNET_R_VID_35">1_INTERNET_R_VID_35</option>
                  </select>
                </td>
              </tr>
              <tr>
                <th>DNS động (DDNS)</th>
                <td>
                  <div class="check-grid">
                    <label class="check-item"><input type="radio" name="ddns-en" value="1" ${d.enabled ? "checked" : ""} /> Kích hoạt</label>
                    <label class="check-item"><input type="radio" name="ddns-en" value="0" ${!d.enabled ? "checked" : ""} /> Vô hiệu hóa</label>
                  </div>
                </td>
              </tr>
              <tr>
                <th>Chế độ dịch vụ</th>
                <td>
                  <div class="check-grid">
                    <label class="check-item"><input type="radio" name="ddns-mode" value="Tự động" ${d.mode !== "Thủ công" ? "checked" : ""} /> Tự động</label>
                    <label class="check-item"><input type="radio" name="ddns-mode" value="Thủ công" ${d.mode === "Thủ công" ? "checked" : ""} /> Thủ công</label>
                  </div>
                </td>
              </tr>
              <tr>
                <th>Nhà cung cấp dịch vụ</th>
                <td>
                  <select class="vht-select" id="ddns-prov">
                    <option value="dyndns.org" ${d.provider === "dyndns.org" || d.provider === "DynDNS.org" ? "selected" : ""}>dyndns.org</option>
                    <option value="no-ip.com" ${d.provider === "no-ip.com" || d.provider === "No-IP.com" ? "selected" : ""}>no-ip.com</option>
                  </select>
                </td>
              </tr>
              <tr>
                <th>Tên miền</th>
                <td><input type="text" class="vht-input" id="ddns-host" value="${esc(d.hostname)}" /></td>
              </tr>
              <tr>
                <th>Tên đăng nhập</th>
                <td><input type="text" class="vht-input" id="ddns-user" value="${esc(d.username)}" /></td>
              </tr>
              <tr>
                <th>Mật khẩu</th>
                <td>${passHtml("ddns-pass", d.password, "")}</td>
              </tr>
              <tr>
                <th>Hỗ trợ Wildcard</th>
                <td>
                  <div class="check-grid">
                    <label class="check-item"><input type="radio" name="ddns-wild" value="1" /> Có</label>
                    <label class="check-item"><input type="radio" name="ddns-wild" value="0" checked /> Không</label>
                  </div>
                </td>
              </tr>
              <tr>
                <th>Trạng thái</th>
                <td>${d.enabled && d.hostname ? '<span class="text-green">Đã kết nối</span>' : "Chưa cấu hình"}</td>
              </tr>
            </table>
            <div class="btn-row center">
              <button type="button" class="btn-vht" id="ddns-apply">ÁP DỤNG</button>
            </div>
          </div>
        </div>
      `;
    },
    bind: function () {
      bindPassEyes();
      document.getElementById("ddns-apply").addEventListener("click", function () {
        const d = window.SimState.apps.ddns;
        const enRad = document.querySelector('input[name="ddns-en"]:checked');
        const modeRad = document.querySelector('input[name="ddns-mode"]:checked');
        d.enabled = enRad ? enRad.value === "1" : false;
        d.mode = modeRad ? modeRad.value : "Tự động";
        d.provider = document.getElementById("ddns-prov").value;
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
    title: "Lập lịch Wi-Fi",
    group: "Ứng dụng",
    cgi: "/cgi-bin/apps-wifischeduling.asp",
    editIdx: 0,
    showEditor: true,
    render: function () {
      const schedules = window.SimState.apps.wifiSchedules;
      while (schedules.length < 4) {
        schedules.push({
          id: schedules.length + 1,
          name: "Rule" + (schedules.length + 1),
          enabled: false,
          start: "00:00",
          end: "00:00",
          days: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]
        });
      }
      const rule = schedules[this.editIdx] || schedules[0];
      const daysMap = [
        { code: "Sun", label: "CN" },
        { code: "Mon", label: "T2" },
        { code: "Tue", label: "T3" },
        { code: "Wed", label: "T4" },
        { code: "Thu", label: "T5" },
        { code: "Fri", label: "T6" },
        { code: "Sat", label: "T7" }
      ];

      function formatDaysVi(daysArr) {
        if (!daysArr || daysArr.length === 0) return "";
        if (daysArr.length === 7) return "Hằng ngày";
        return daysMap
          .filter(function (d) {
            return daysArr.includes(d.code);
          })
          .map(function (d) {
            return d.label;
          })
          .join(", ");
      }

      return `
        <div class="vht-widget">
          <header class="vht-widget-title">Lập lịch Wi-Fi</header>
          <div class="vht-card">
            <legend class="vht-legend">Danh sách lập lịch</legend>
            <div class="table-bordered-radius" style="margin-bottom:20px;">
              <table class="data-table">
                <thead>
                  <tr>
                    <th>Tên luật</th>
                    <th>Thời gian bắt đầu</th>
                    <th>Thời gian kết thúc</th>
                    <th>Lặp lại</th>
                    <th>Trạng thái</th>
                    <th>Thao Tác</th>
                  </tr>
                </thead>
                <tbody>
                  ${schedules
                    .map(
                      (r, idx) => `
                  <tr>
                    <td>${esc(r.name || "Rule" + (idx + 1))}</td>
                    <td>${esc(r.start)}</td>
                    <td>${esc(r.end)}</td>
                    <td>${esc(formatDaysVi(r.days))}</td>
                    <td>${r.enabled ? '<span class="text-green">Kích hoạt</span>' : "Vô hiệu hóa"}</td>
                    <td><button type="button" class="btn-icon wsch-edit-row" data-idx="${idx}" title="Sửa lịch">✏️</button></td>
                  </tr>`
                    )
                    .join("")}
                </tbody>
              </table>
            </div>

            ${
              this.showEditor
                ? `
            <div style="border-top:1px solid #f0f0f0;padding-top:18px;">
              <legend class="vht-legend">Sửa lịch</legend>
              <table class="form-table">
                <tr>
                  <th>Kích hoạt</th>
                  <td>${swHtml("wsch-en", rule.enabled)}</td>
                </tr>
                <tr>
                  <th>Tên luật</th>
                  <td><input type="text" class="vht-input" id="wsch-name" value="${esc(rule.name)}" /></td>
                </tr>
                <tr>
                  <th>Thời gian bắt đầu</th>
                  <td><input type="text" class="vht-input short" id="wsch-start" value="${esc(rule.start)}" placeholder="HH:MM" /></td>
                </tr>
                <tr>
                  <th>Thời gian kết thúc</th>
                  <td><input type="text" class="vht-input short" id="wsch-end" value="${esc(rule.end)}" placeholder="HH:MM" /></td>
                </tr>
                <tr>
                  <th>Lặp lại</th>
                  <td>
                    <div class="table-bordered-radius" style="max-width:460px;">
                      <table class="data-table">
                        <thead>
                          <tr>
                            ${daysMap.map((d) => `<th>${d.label}</th>`).join("")}
                          </tr>
                        </thead>
                        <tbody>
                          <tr>
                            ${daysMap
                              .map(
                                (d) =>
                                  `<td><input type="checkbox" class="wsch-day" value="${d.code}" ${(rule.days || []).includes(d.code) ? "checked" : ""} /></td>`
                              )
                              .join("")}
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </td>
                </tr>
              </table>
            </div>`
                : ""
            }

            <div class="btn-row center" style="gap:14px;">
              <button type="button" class="btn-vht" id="wsch-apply">ÁP DỤNG</button>
              <button type="button" class="btn-vht secondary" id="wsch-cancel">HỦY</button>
            </div>
          </div>
        </div>
      `;
    },
    bind: function () {
      const self = this;
      const schedules = window.SimState.apps.wifiSchedules;

      document.querySelectorAll(".wsch-edit-row").forEach(function (btn) {
        btn.addEventListener("click", function () {
          self.editIdx = parseInt(btn.getAttribute("data-idx"), 10);
          self.showEditor = true;
          window.RouterApp.renderCurrentPage();
        });
      });

      document.getElementById("wsch-cancel").addEventListener("click", function () {
        window.RouterApp.renderCurrentPage();
      });

      document.getElementById("wsch-apply").addEventListener("click", function () {
        const rule = schedules[self.editIdx] || schedules[0];
        const days = Array.from(document.querySelectorAll(".wsch-day:checked")).map(function (c) {
          return c.value;
        });
        if (days.length === 0) return alert("Vui lòng chọn ít nhất 1 ngày trong tuần!");
        rule.enabled = document.getElementById("wsch-en").checked;
        rule.name = document.getElementById("wsch-name").value.trim() || "Rule" + (self.editIdx + 1);
        rule.start = document.getElementById("wsch-start").value.trim() || "00:00";
        rule.end = document.getElementById("wsch-end").value.trim() || "00:00";
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
    title: "Quản trị",
    group: "Bảo dưỡng",
    cgi: "/cgi-bin/tools-admin.asp",
    render: function () {
      const adm = window.SimState.admin;
      const dev = window.SimState.device;
      return `
        <!-- Widget 1: Quản trị viên -->
        <div class="vht-widget">
          <header class="vht-widget-title">Quản trị viên</header>
          <div class="vht-card">
            <legend class="vht-legend">Tài khoản</legend>
            <table class="form-table">
              <tr>
                <th>Tên người dùng</th>
                <td><strong>admin</strong></td>
              </tr>
              <tr>
                <th>Mật khẩu hiện tại</th>
                <td>${passHtml("adm-old", "", "")}</td>
              </tr>
              <tr>
                <th>Mật khẩu mới</th>
                <td>
                  ${passHtml("adm-new", "", "")}
                  <div class="field-hint" style="margin-top:6px;">Mật khẩu phải dài từ 8 ký tự bao gồm chữ hoa, chữ thường, số và các ký tự đặc biệt</div>
                </td>
              </tr>
              <tr>
                <th>Xác nhận mật khẩu</th>
                <td>${passHtml("adm-confirm", "", "")}</td>
              </tr>
            </table>
            <div class="btn-row center">
              <button type="button" class="btn-vht" id="adm-pass-apply">ÁP DỤNG</button>
            </div>
          </div>
        </div>

        <!-- Widget 2: Quản lý truy nhập -->
        <div class="vht-widget">
          <header class="vht-widget-title">Quản lý truy nhập</header>
          <div class="vht-card">
            <legend class="vht-legend">Quản lý truy nhập</legend>
            <table class="form-table" style="margin-bottom:18px;">
              <tr>
                <th>Cho phép người quản trị truy nhập từ</th>
                <td>
                  <div class="check-grid">
                    <label class="check-item"><input type="checkbox" id="adm-wan" ${adm.allowWan ? "checked" : ""} /> WAN</label>
                    <label class="check-item"><input type="checkbox" id="adm-lan" ${adm.allowLan ? "checked" : ""} disabled /> LAN</label>
                  </div>
                </td>
              </tr>
              <tr>
                <th>Thời gian hết phiên</th>
                <td>
                  <select class="vht-select" id="adm-timeout">
                    <option value="2.5" ${adm.sessionTimeoutMin == 2.5 ? "selected" : ""}>2.5 phút</option>
                    <option value="5" ${adm.sessionTimeoutMin == 5 ? "selected" : ""}>5 phút</option>
                    <option value="10" ${adm.sessionTimeoutMin == 10 ? "selected" : ""}>10 phút</option>
                    <option value="20" ${adm.sessionTimeoutMin == 20 ? "selected" : ""}>20 phút</option>
                  </select>
                </td>
              </tr>
            </table>

            <legend class="vht-legend">Cấu hình port cho giao diện web</legend>
            <table class="form-table">
              <tr>
                <th>Port cho HTTP</th>
                <td><input type="text" class="vht-input short" id="adm-http" value="${adm.httpPort}" /></td>
              </tr>
              <tr>
                <th>Port cho HTTPS</th>
                <td><input type="text" class="vht-input short" id="adm-https" value="${adm.httpsPort}" /></td>
              </tr>
            </table>
            <div class="btn-row center">
              <button type="button" class="btn-vht" id="adm-apply">ÁP DỤNG</button>
            </div>
          </div>
        </div>

        <!-- Widget 3: Tên thiết bị -->
        <div class="vht-widget">
          <header class="vht-widget-title">Tên thiết bị</header>
          <div class="vht-card">
            <table class="form-table">
              <tr>
                <th>Tên thiết bị</th>
                <td><input type="text" class="vht-input" id="adm-devname" value="${esc(dev.name)}" /></td>
              </tr>
            </table>
            <div class="btn-row center">
              <button type="button" class="btn-vht" id="adm-devname-apply">ÁP DỤNG</button>
            </div>
          </div>
        </div>
      `;
    },
    bind: function () {
      bindPassEyes();
      const adm = window.SimState.admin;

      document.getElementById("adm-pass-apply").addEventListener("click", function () {
        const oldP = document.getElementById("adm-old").value;
        const newP = document.getElementById("adm-new").value;
        const cfP = document.getElementById("adm-confirm").value;
        if (!oldP && !newP && !cfP) return alert("Vui lòng nhập mật khẩu hiện tại và mật khẩu mới!");
        if (oldP !== adm.password) return alert("Mật khẩu hiện tại không chính xác!");
        if (newP !== cfP) return alert("Xác nhận mật khẩu không trùng khớp!");
        const strong = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/;
        if (!strong.test(newP)) {
          return alert("Mật khẩu phải dài từ 8 ký tự bao gồm chữ hoa, chữ thường, số và các ký tự đặc biệt!");
        }
        adm.password = newP;
        window.SimEngine.addLog("[ADMIN] Đã thay đổi mật khẩu quản trị viên (admin).");
        window.RouterApp.applyWithFeedback("Đã cập nhật mật khẩu quản trị viên!");
      });

      document.getElementById("adm-apply").addEventListener("click", function () {
        adm.allowWan = document.getElementById("adm-wan").checked;
        adm.sessionTimeoutMin = parseFloat(document.getElementById("adm-timeout").value);
        adm.httpPort = parseInt(document.getElementById("adm-http").value, 10) || 80;
        adm.httpsPort = parseInt(document.getElementById("adm-https").value, 10) || 443;

        window.RouterApp.resetIdleTimer();
        window.SimEngine.addLog(
          "[ADMIN] Cập nhật Quản lý truy nhập (WAN: " + (adm.allowWan ? "Bật" : "Tắt") + ", Timeout: " + adm.sessionTimeoutMin + " phút)."
        );
        window.RouterApp.applyWithFeedback("Đã lưu thiết lập Quản lý truy nhập!");
      });

      document.getElementById("adm-devname-apply").addEventListener("click", function () {
        window.SimState.device.name = document.getElementById("adm-devname").value.trim() || "ONT_VTGR2239D5BC";
        window.SimEngine.addLog("[ADMIN] Đổi tên thiết bị thành " + window.SimState.device.name + ".");
        window.RouterApp.applyWithFeedback("Đã lưu Tên thiết bị!");
      });
    }
  };

  // --------------------------------------------------------------------------
  // 19. Bảo dưỡng -> Uplink Mirroring (/cgi-bin/tools-wan2lan.asp)
  // --------------------------------------------------------------------------
  window.RouterPages["tools-wan2lan"] = {
    title: "Cài đặt Uplink Mirroring",
    group: "Bảo dưỡng",
    cgi: "/cgi-bin/tools-wan2lan.asp",
    render: function () {
      const mir = window.SimState.tools.mirroring;
      return `
        <div class="vht-widget">
          <header class="vht-widget-title">Cài đặt Uplink Mirroring</header>
          <div class="vht-card">
            <table class="form-table">
              <tr>
                <th>Kích hoạt</th>
                <td>${swHtml("mir-en", mir.enabled)}</td>
              </tr>
              <tr>
                <th>Mirrored Port</th>
                <td>
                  <div class="check-grid">
                    ${["LAN1", "LAN2", "LAN3", "LAN4"]
                      .map(
                        (p) =>
                          `<label class="check-item"><input type="checkbox" class="mir-port-chk" value="${p}" ${mir.destPort === p ? "checked" : ""} /> ${p}</label>`
                      )
                      .join("")}
                  </div>
                </td>
              </tr>
            </table>
            <div class="btn-row center">
              <button type="button" class="btn-vht" id="mir-apply">ÁP DỤNG</button>
            </div>
          </div>
        </div>
      `;
    },
    bind: function () {
      document.querySelectorAll(".mir-port-chk").forEach(function (chk) {
        chk.addEventListener("change", function () {
          if (chk.checked) {
            document.querySelectorAll(".mir-port-chk").forEach(function (other) {
              if (other !== chk) other.checked = false;
            });
          }
        });
      });

      document.getElementById("mir-apply").addEventListener("click", function () {
        const mir = window.SimState.tools.mirroring;
        mir.enabled = document.getElementById("mir-en").checked;
        const sel = document.querySelector(".mir-port-chk:checked");
        mir.destPort = sel ? sel.value : "LAN1";
        window.SimEngine.addLog("[MIRRORING] Uplink Mirroring: " + (mir.enabled ? "Bật -> " + mir.destPort : "Tắt") + ".");
        window.RouterApp.applyWithFeedback("Đã lưu cài đặt Uplink Mirroring!");
      });
    }
  };

  // --------------------------------------------------------------------------
  // 20. Bảo dưỡng -> Giờ hệ thống (/cgi-bin/tools-time.asp)
  // --------------------------------------------------------------------------
  window.RouterPages["tools-time"] = {
    title: "Giờ hệ thống",
    group: "Bảo dưỡng",
    cgi: "/cgi-bin/tools-time.asp",
    render: function () {
      const adm = window.SimState.admin;
      const nowStr = window.SimEngine.formatDateTime(window.SimEngine.nowRouterDate());
      return `
        <div class="vht-widget">
          <header class="vht-widget-title">Giờ hệ thống</header>
          <div class="vht-card">
            <table class="form-table">
              <tr>
                <th>Giờ hệ thống</th>
                <td><span id="tools-live-clock">${esc(nowStr)}</span></td>
              </tr>
              <tr>
                <th>Tự động đồng bộ với máy chủ NTP</th>
                <td>${swHtml("ntp-en", adm.ntpEnabled)}</td>
              </tr>
              <tr>
                <th>Chọn giao diện</th>
                <td>
                  <select class="vht-select" id="ntp-iface">
                    <option value="WAN">WAN</option>
                    <option value="LAN">LAN</option>
                  </select>
                </td>
              </tr>
              <tr>
                <th>Máy chủ SNTP chính</th>
                <td><input type="text" class="vht-input" id="ntp-s1" value="${esc(adm.ntp1)}" /></td>
              </tr>
              <tr>
                <th>Máy chủ SNTP phụ</th>
                <td><input type="text" class="vht-input" id="ntp-s2" value="${esc(adm.ntp2)}" /></td>
              </tr>
              <tr>
                <th>Múi giờ</th>
                <td>
                  <select class="vht-select" id="ntp-tz">
                    <option value="(GMT+07:00) Bangkok, Hanoi, Jakarta" selected>(GMT+07:00) Bangkok, Hanoi, Jakarta</option>
                    <option value="(GMT+00:00) Greenwich Mean Time: Dublin, Edinburgh, Lisbon, London">(GMT+00:00) Greenwich Mean Time: Dublin, Edinburgh, Lisbon, London</option>
                    <option value="(GMT+08:00) Beijing, Chongqing, Hong Kong, Urumqi">(GMT+08:00) Beijing, Chongqing, Hong Kong, Urumqi</option>
                  </select>
                </td>
              </tr>
            </table>
            <div class="btn-row center">
              <button type="button" class="btn-vht" id="ntp-apply">ÁP DỤNG</button>
            </div>
          </div>
        </div>
      `;
    },
    bind: function () {
      document.getElementById("ntp-apply").addEventListener("click", function () {
        const adm = window.SimState.admin;
        adm.ntpEnabled = document.getElementById("ntp-en").checked;
        adm.ntp1 = document.getElementById("ntp-s1").value.trim() || "pool.ntp.org";
        adm.ntp2 = document.getElementById("ntp-s2").value.trim() || "2.vn.pool.ntp.org";
        window.SimEngine.addLog("[NTP] Đồng bộ giờ thành công với " + adm.ntp1 + " (GMT+07:00).");
        window.RouterApp.applyWithFeedback("Đã lưu cấu hình Giờ hệ thống!");
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
        <div class="vht-widget">
          <header class="vht-widget-title">Nâng cấp Firmware</header>
          <div class="vht-card">
            <table class="form-table">
              <tr>
                <th>Phiên bản Firmware hiện tại</th>
                <td><strong>${esc(dev.firmware)}</strong></td>
              </tr>
              <tr>
                <th></th>
                <td><input type="file" id="fw-file" accept=".bin,.trx,.img" /></td>
              </tr>
            </table>
            <div class="btn-row center">
              <button type="button" class="btn-vht" id="fw-btn-upg">NÂNG CẤP</button>
            </div>
          </div>
        </div>
      `;
    },
    bind: function () {
      document.getElementById("fw-btn-upg").addEventListener("click", function () {
        const f = document.getElementById("fw-file");
        if (!f.files || f.files.length === 0) {
          return alert("Vui lòng chọn tập tin Firmware trước khi bấm NÂNG CẤP!");
        }
        alert("Phiên bản V1302250508 hiện đã là phiên bản mới nhất!");
      });
    }
  };

  // --------------------------------------------------------------------------
  // 22. Bảo dưỡng -> Cấu hình (/cgi-bin/tools-config.asp)
  // --------------------------------------------------------------------------
  window.RouterPages["tools-config"] = {
    title: "Cấu hình",
    group: "Bảo dưỡng",
    cgi: "/cgi-bin/tools-config.asp",
    render: function () {
      return `
        <!-- Widget 1: Sao lưu cấu hình -->
        <div class="vht-widget">
          <header class="vht-widget-title">Sao lưu cấu hình</header>
          <div class="vht-card">
            <div class="btn-row center" style="margin-top:6px;">
              <button type="button" class="btn-vht" id="cfg-btn-backup">SAO LƯU</button>
            </div>
          </div>
        </div>

        <!-- Widget 2: Khôi phục cấu hình -->
        <div class="vht-widget">
          <header class="vht-widget-title">Khôi phục cấu hình</header>
          <div class="vht-card">
            <p style="margin-bottom:14px;color:#2e2e2e;">Để khôi phục lại cấu hình đã sao lưu trước đó, chọn tập tin và bấm KHÔI PHỤC.</p>
            <div style="margin-bottom:14px;">
              <input type="file" id="cfg-file-input" accept=".cfg,.json,.xml" />
            </div>
            <div class="btn-row center">
              <button type="button" class="btn-vht" id="cfg-btn-restore-file">KHÔI PHỤC</button>
            </div>
          </div>
        </div>

        <!-- Widget 3: Khôi phục cài đặt gần nhất -->
        <div class="vht-widget">
          <header class="vht-widget-title">Khôi phục cài đặt gần nhất</header>
          <div class="vht-card">
            <p style="margin-bottom:14px;color:#2e2e2e;">Khôi phục lại cài đặt trước lần "Khôi phục mặc định" gần nhất.</p>
            <div class="btn-row center">
              <button type="button" class="btn-vht" id="cfg-btn-undo-reset">KHÔI PHỤC</button>
            </div>
          </div>
        </div>

        <!-- Widget 4: Khôi phục mặc định -->
        <div class="vht-widget">
          <header class="vht-widget-title">Khôi phục mặc định</header>
          <div class="vht-card">
            <div class="btn-row center" style="margin-top:6px;">
              <button type="button" class="btn-vht" id="cfg-btn-factory">KHÔI PHỤC HOÀN TOÀN</button>
            </div>
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
      });

      function applyRestoredObject(parsed, label) {
        if (!parsed || !parsed.wifi24 || !parsed.lan) {
          return alert("Tập tin cấu hình không hợp lệ!");
        }
        window.RouterApp.runRebootSimulation("Đang nạp lại file cấu hình & khởi động lại thiết bị...", function () {
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
          return alert("Vui lòng chọn tập tin cấu hình trước khi bấm KHÔI PHỤC!");
        }
        const reader = new FileReader();
        reader.onload = function (ev) {
          try {
            const parsed = JSON.parse(ev.target.result);
            applyRestoredObject(parsed, "file " + inp.files[0].name);
          } catch (err) {
            const fam = window.SimEngine.createFamilyPreResetConfig(window.SimState.coach.groupSsid);
            applyRestoredObject(fam, "tập tin romfile (" + inp.files[0].name + ")");
          }
        };
        reader.readAsText(inp.files[0]);
      });

      document.getElementById("cfg-btn-undo-reset").addEventListener("click", function () {
        const raw = localStorage.getItem(window.SimEngine.SNAPSHOT_KEY);
        if (!raw) {
          return alert("Chưa có bản ghi trước lần Khôi phục mặc định gần nhất!");
        }
        applyRestoredObject(JSON.parse(raw), "bản trước lần Khôi phục mặc định gần nhất");
      });

      document.getElementById("cfg-btn-factory").addEventListener("click", function () {
        if (!confirm("Bạn có chắc chắn muốn KHÔI PHỤC HOÀN TOÀN về cài đặt mặc định?")) return;
        window.RouterApp.runRebootSimulation("Đang xóa cấu hình & Khôi phục mặc định (VIETTEL_39D5BC)...", function () {
          window.SimEngine.performFactoryReset("Khôi phục mặc định trên Web UI");
          window.RouterApp.renderAll();
          window.RouterApp.showToast("Đã Khôi phục mặc định! Sóng Wi-Fi hiện tại: VIETTEL_39D5BC.");
        });
      });
    }
  };

  // --------------------------------------------------------------------------
  // 23. Bảo dưỡng -> Chẩn đoán mạng (/cgi-bin/tools-diagnostic.asp)
  // --------------------------------------------------------------------------
  window.RouterPages["tools-diagnostic"] = {
    title: "Chẩn đoán mạng",
    group: "Bảo dưỡng",
    cgi: "/cgi-bin/tools-diagnostic.asp",
    lastOutput: "",
    diagTool: "Ping",
    render: function () {
      const fault = window.SimState.device.fiberFault;
      const lanOk = window.SimState.simDevices.laptopObs.connMode === "LAN1";
      const okMark = `<span class="text-green" style="font-size:16px;">✔</span>`;
      const errMark = `<span class="text-red" style="font-size:16px;">✖</span>`;

      return `
        <div class="vht-widget">
          <header class="vht-widget-title">Chẩn đoán mạng</header>
          <div class="vht-card">
            <table class="form-table" style="margin-bottom:20px;">
              <tr>
                <th>Tên kết nối</th>
                <td>
                  <select class="vht-select" id="diag-wan">
                    <option value="1_INTERNET_R_VID_35">1_INTERNET_R_VID_35</option>
                  </select>
                </td>
              </tr>
              <tr>
                <th>Kiểm tra kết nối Ethernet LAN</th>
                <td>${lanOk ? okMark : errMark}</td>
              </tr>
              <tr>
                <th>Kiểm tra trạng thái MAC xPON</th>
                <td>${fault ? errMark : okMark}</td>
              </tr>
              <tr>
                <th>Kiểm tra trạng thái kết nối xPON</th>
                <td>${fault ? errMark : okMark}</td>
              </tr>
            </table>

            <legend class="vht-legend">Cấu hình</legend>
            <table class="form-table">
              <tr>
                <th>Công cụ chẩn đoán</th>
                <td>
                  <div class="check-grid">
                    <label class="check-item"><input type="radio" name="diag-tool" value="Ping" ${this.diagTool === "Ping" ? "checked" : ""} /> Ping</label>
                    <label class="check-item"><input type="radio" name="diag-tool" value="Traceroute" ${this.diagTool === "Traceroute" ? "checked" : ""} /> Traceroute</label>
                  </div>
                </td>
              </tr>
              <tr>
                <th>Địa chỉ IP/ Tên miền</th>
                <td><input type="text" class="vht-input" id="diag-target" value="8.8.8.8" /></td>
              </tr>
              ${
                this.diagTool === "Ping"
                  ? `
              <tr>
                <th>Số lần ping</th>
                <td><input type="text" class="vht-input short" id="diag-count" value="4" /> <span class="field-hint">(1-10)</span></td>
              </tr>
              <tr>
                <th>Kích thước gói ping</th>
                <td><input type="text" class="vht-input short" id="diag-size" value="56" /> <span class="field-hint">(4-1472 Bytes)</span></td>
              </tr>
              <tr>
                <th>Thời hạn gói ping</th>
                <td><input type="text" class="vht-input short" id="diag-timeout" value="1000" /> <span class="field-hint">(100-2000 Milliseconds)</span></td>
              </tr>`
                  : `
              <tr>
                <th>TTL tối đa</th>
                <td><input type="text" class="vht-input short" id="diag-ttl" value="30" /> <span class="field-hint">(2-30)</span></td>
              </tr>`
              }
              <tr>
                <th></th>
                <td><button type="button" class="btn-vht small" id="diag-run">Chẩn đoán</button></td>
              </tr>
            </table>

            <div class="diag-console" id="diag-console" style="margin-top:14px;">${esc(this.lastOutput)}</div>

            <div class="btn-row center" style="margin-top:18px;">
              <button type="button" class="btn-vht" id="diag-recheck">TẢI LẠI</button>
            </div>
          </div>
        </div>
      `;
    },
    bind: function () {
      const self = this;

      document.querySelectorAll('input[name="diag-tool"]').forEach(function (rad) {
        rad.addEventListener("change", function () {
          self.diagTool = rad.value;
          window.RouterApp.renderCurrentPage();
        });
      });

      document.getElementById("diag-recheck").addEventListener("click", function () {
        window.RouterApp.renderCurrentPage();
      });

      document.getElementById("diag-run").addEventListener("click", function () {
        const tool = self.diagTool;
        const host = document.getElementById("diag-target").value.trim() || "8.8.8.8";
        const con = document.getElementById("diag-console");

        if (window.SimState.device.fiberFault) {
          self.lastOutput = tool.toUpperCase() + " " + host + ": Network is unreachable";
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
                " 1  100.99.0.2  2.412 ms  2.185 ms  2.301 ms",
                " 2  171.255.64.145  3.890 ms  4.012 ms  3.954 ms",
                " 3  116.97.98.21  6.512 ms  6.440 ms  6.701 ms",
                " 4  203.190.170.42  11.840 ms 12.105 ms 11.930 ms",
                " 5  72.14.209.130  12.604 ms 12.711 ms 12.589 ms",
                " 6  " + resolvedIp + "  13.120 ms 12.980 ms 13.210 ms",
                "",
                "Trace complete."
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

        window.SimEngine.addLog("[DIAGNOSTIC] Đã chạy " + tool + " tới " + host + ".");
      });
    }
  };

  // --------------------------------------------------------------------------
  // 24. Bảo dưỡng -> Bản ghi hệ thống (/cgi-bin/tools-log.asp)
  // --------------------------------------------------------------------------
  window.RouterPages["tools-log"] = {
    title: "Bản ghi hệ thống",
    group: "Bảo dưỡng",
    cgi: "/cgi-bin/tools-log.asp",
    subTab: "general",
    detailEnabled: false,
    render: function () {
      const logs = window.SimState.tools.logs || [];
      const filtered =
        this.subTab === "pon"
          ? logs.filter((l) => /PON|GPON|OMCI|WAN|PPPoE/i.test(l))
          : this.subTab === "wifi"
          ? logs.filter((l) => /WIFI|SSID|MESH|2\.4G|5G/i.test(l))
          : logs;

      return `
        <div class="vht-subtabs">
          <button type="button" class="vht-subtab ${this.subTab === "general" ? "active" : ""}" data-tab="general">Bản ghi chung</button>
          <button type="button" class="vht-subtab ${this.subTab === "pon" ? "active" : ""}" data-tab="pon">Bản ghi PON</button>
          <button type="button" class="vht-subtab ${this.subTab === "wifi" ? "active" : ""}" data-tab="wifi">Bản ghi WiFi</button>
        </div>

        <div class="vht-widget">
          <div class="vht-card">
            <table class="form-table" style="margin-bottom:14px;">
              <tr>
                <th>Bản ghi chi tiết</th>
                <td style="display:flex;align-items:center;gap:18px;">
                  ${swHtml("log-detail-sw", this.detailEnabled)}
                  <button type="button" class="btn-vht small" id="log-detail-apply">ÁP DỤNG</button>
                </td>
              </tr>
            </table>

            <div class="diag-console" style="min-height:280px;">${esc((filtered.length ? filtered : logs).join("\n"))}</div>

            <div class="btn-row center" style="gap:14px;margin-top:18px;">
              <button type="button" class="btn-vht" id="log-reload">TẢI LẠI</button>
              <button type="button" class="btn-vht" id="log-download">TẢI XUỐNG</button>
            </div>
          </div>
        </div>
      `;
    },
    bind: function () {
      const self = this;
      document.querySelectorAll(".vht-subtab").forEach(function (tab) {
        tab.addEventListener("click", function () {
          self.subTab = tab.getAttribute("data-tab");
          window.RouterApp.renderCurrentPage();
        });
      });

      document.getElementById("log-detail-apply").addEventListener("click", function () {
        self.detailEnabled = document.getElementById("log-detail-sw").checked;
        window.RouterApp.applyWithFeedback("Đã lưu cấu hình Bản ghi chi tiết!");
      });

      document.getElementById("log-reload").addEventListener("click", function () {
        window.RouterApp.renderCurrentPage();
      });

      document.getElementById("log-download").addEventListener("click", function () {
        const txt = (window.SimState.tools.logs || []).join("\r\n");
        const blob = new Blob([txt], { type: "text/plain" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "syslog.txt";
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      });
    }
  };

  // --------------------------------------------------------------------------
  // 25. Bảo dưỡng -> Khởi động lại (/cgi-bin/tools-reboot.asp)
  // --------------------------------------------------------------------------
  window.RouterPages["tools-reboot"] = {
    title: "Khởi động lại",
    group: "Bảo dưỡng",
    cgi: "/cgi-bin/tools-reboot.asp",
    rebootSchedEn: false,
    render: function () {
      const days = ["CN", "T2", "T3", "T4", "T5", "T6", "T7"];
      return `
        <!-- Widget 1: Khởi động lại -->
        <div class="vht-widget">
          <header class="vht-widget-title">Khởi động lại</header>
          <div class="vht-card">
            <p style="margin-bottom:14px;color:#2e2e2e;">Bấm nút BẮT ĐẦU bên dưới để khởi động lại thiết bị.</p>
            <div class="btn-row center">
              <button type="button" class="btn-vht" id="btn-soft-reboot">BẮT ĐẦU</button>
            </div>
          </div>
        </div>

        <!-- Widget 2: Lập lịch khởi động lại -->
        <div class="vht-widget">
          <header class="vht-widget-title">Lập lịch khởi động lại</header>
          <div class="vht-card">
            <legend class="vht-legend">Sửa lịch</legend>
            <table class="form-table">
              <tr>
                <th>Kích hoạt</th>
                <td>${swHtml("rb-sched-en", this.rebootSchedEn)}</td>
              </tr>
              <tr>
                <th>Thời gian khởi động lại</th>
                <td><input type="text" class="vht-input short" id="rb-sched-time" value="03:00" /></td>
              </tr>
              <tr>
                <th>Định kỳ</th>
                <td>
                  <select class="vht-select" id="rb-sched-period">
                    <option value="weekly">Theo tuần</option>
                    <option value="monthly">Theo tháng</option>
                  </select>
                </td>
              </tr>
              <tr>
                <th>Ngày trong tuần</th>
                <td>
                  <div class="table-bordered-radius" style="max-width:460px;">
                    <table class="data-table">
                      <thead>
                        <tr>${days.map((d) => `<th>${d}</th>`).join("")}</tr>
                      </thead>
                      <tbody>
                        <tr>${days.map((d) => `<td><input type="checkbox" checked /></td>`).join("")}</tr>
                      </tbody>
                    </table>
                  </div>
                </td>
              </tr>
            </table>
            <div class="btn-row center">
              <button type="button" class="btn-vht" id="rb-sched-apply">ÁP DỤNG</button>
            </div>
          </div>
        </div>
      `;
    },
    bind: function () {
      const self = this;
      document.getElementById("btn-soft-reboot").addEventListener("click", function () {
        if (!confirm("Bạn có muốn khởi động lại thiết bị ngay bây giờ?")) return;
        window.RouterApp.runRebootSimulation("Đang khởi động lại thiết bị vGP-42X6V1...", function () {
          window.SimState.device.uptimeSec = 5;
          window.SimState.device.ramUsage = 39;
          window.SimEngine.addLog("[REBOOT] Thiết bị đã khởi động lại thành công.");
          window.SimEngine.saveState();
          window.RouterApp.renderAll();
          window.RouterApp.showToast("Thiết bị vGP-42X6V1 đã khởi động lại hoàn tất!");
        });
      });

      document.getElementById("rb-sched-apply").addEventListener("click", function () {
        self.rebootSchedEn = document.getElementById("rb-sched-en").checked;
        window.RouterApp.applyWithFeedback("Đã lưu Lập lịch khởi động lại!");
      });
    }
  };
})();
