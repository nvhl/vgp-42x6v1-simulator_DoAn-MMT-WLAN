/* ==========================================================================
   lab.js — Single Consolidated Helper Panel (Hidden completely on F9):
   1. TV1–TV6 Guided Rehearsal Coach + Context Quick-Fill Actions
   2. Virtual Test Smartphone (Wi-Fi Scanner, DHCP IP Renew, Mini Browser) & VMware
   3. Interactive Virtual Hardware vGP-42X6V1 (Live LEDs, Fiber LOS, Hard Reset, Sticker)
   ========================================================================== */

(function () {
  function esc(s) {
    return String(s == null ? "" : s)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  const TV_SCENES = {
    1: {
      name: "TV1 — Phần cứng, Sao lưu & Reset cứng",
      startPage: "tools-config",
      steps: [
        {
          html: "Mở tab <strong>📟 Phần cứng</strong> bên trên: Tập chỉ tem mặt đáy (<code>192.168.1.1</code>, <code>admin</code> / <code>VTGR2239D5BC</code>, sóng gốc <code>VIETTEL_39D5BC</code>), cổng quang <code>PON SC/APC xanh lá</code>, 4 cổng <code>LAN 1Gbps</code>, nút <code>WPS</code>, lỗ <code>Reset</code> &amp; cặp đèn <code>PON / LOS</code>."
        },
        {
          page: "net-wan",
          html: "Lướt <span class='step-jump'>Mạng → Thiết lập WAN</span> (3 giây): Ghi nhận <code>VLAN ID = 35</code> &amp; tài khoản PPPoE."
        },
        {
          page: "tools-config",
          html: "Vào <span class='step-jump'>Bảo dưỡng → Cấu hình</span>: Giải thích <strong>4 nút thao tác</strong> và bấm <strong>SAO LƯU</strong> tải file cấu hình gia đình (<code>LongGiang</code>) về máy."
        },
        {
          html: "Qua tab <strong>📟 Phần cứng</strong> bấm <strong>📌 Chọc lỗ Reset cứng</strong> → Qua tab <strong>📱 ĐT &amp; VMware</strong> chứng minh sóng <code>LongGiang</code> biến mất, xuất hiện sóng gốc <code>VIETTEL_39D5BC</code> (mật khẩu <code>123456a@</code>)!"
        }
      ]
    },
    2: {
      name: "TV2 — Thông tin thiết bị, WAN (OMCI) & LAN / IP Tĩnh",
      startPage: "deviceinfo",
      steps: [
        {
          page: "deviceinfo",
          html: "Mở <span class='step-jump'>Thông tin thiết bị</span>: Giải thích <strong>Thông tin PON</strong> (Công suất thu <code>-21.1 dBm</code> xanh), <strong>Thông tin kết nối Internet</strong>, % <strong>Tải CPU / RAM</strong>, và thẻ <strong>WAN</strong>."
        },
        {
          page: "net-wan",
          html: "Mở <span class='step-jump'>Mạng → Thiết lập WAN</span>: Giải thích vì sao Reset xong vẫn có mạng nhờ <strong>OMCI</strong>; phân tích <code>Route vs Bridge</code>, <code>IPv4/IPv6</code>, <code>PPPoE (MTU 1492) vs DHCP vs Static</code>, <code>VLAN 35</code>."
        },
        {
          page: "sta-users",
          html: "<strong>Minh chứng Trước:</strong> Mở <span class='step-jump'>Thiết bị đang kết nối</span> xem Điện thoại đang nhận IP động <code>192.168.1.2</code>."
        },
        {
          page: "net-lan",
          html: "Mở <span class='step-jump'>Mạng → Thiết lập LAN</span>: Sửa dải DHCP thành <code>.10 → .200</code>; ở <strong>Bảng cấp phát IP tĩnh</strong> gán cứng <code>192.168.1.150</code> + MAC điện thoại → Bấm <strong>THÊM</strong> → Sang tab <strong>📱 ĐT</strong> tắt/bật lại Wi-Fi thấy nhận đúng <code>192.168.1.150</code>!"
        }
      ]
    },
    3: {
      name: "TV3 — Cài đặt nhanh (Band Steering) & Wi-Fi 2.4GHz / Multi-SSID",
      startPage: "home",
      steps: [
        {
          page: "home",
          html: "Mở <span class='step-jump'>Cài đặt nhanh</span>: Phân tích công tắc <strong>Chuyển băng tự động (Band Steering)</strong> Bật vs Tắt. Đảm bảo để <strong>TẮT</strong> rồi bấm Áp dụng."
        },
        {
          page: "wifi",
          html: "Mở <span class='step-jump'>Wi-Fi → Thiết lập Wi-Fi 2.4GHz</span>: Chọn <code>802.11b/g/n/ax</code>, đổi <code>Kênh</code> sang <strong>Kênh 6</strong> (1-6-11 không chồng lấn), <code>Băng thông = 20 MHz</code>. Bấm nút <strong>NÂNG CAO</strong> giải thích <code>Công suất phát 100%</code> &amp; sửa <code>Số thiết bị</code> từ 45 → <strong>20</strong>."
        },
        {
          page: "wifi",
          html: "Tại <code>Số thứ tự = 1 (SSID1)</code>: Đặt tên đúng mã nhóm, chọn <strong>WPA2-PSK/WPA3-SAE</strong> + <strong>AES</strong> → <strong>ÁP DỤNG</strong>."
        },
        {
          page: "wifi",
          html: "Đổi <code>Số thứ tự = 2 (SSID2)</code> (Multi-SSID Mạng khách): Tích <strong>Kích hoạt SSID2</strong>, đặt tên <code>&lt;SSID_NHOM&gt;_Guest</code> → <strong>ÁP DỤNG</strong>. Mở tab <strong>📱 ĐT</strong> thấy cả 2 sóng xuất hiện!"
        }
      ]
    },
    4: {
      name: "TV4 — Wi-Fi 5GHz (160 MHz), EasyMesh, Đa thiết bị & Ad-hoc",
      startPage: "wifi-11ac",
      steps: [
        {
          page: "wifi-11ac",
          html: "Mở <span class='step-jump'>Wi-Fi → Thiết lập Wi-Fi 5GHz</span>: Chọn <code>802.11a/n/ac/ax</code>, phân tích ưu thế băng thông <strong>160 MHz</strong> (2402 Mbps gấp đôi Wi-Fi 5 80MHz). Đặt <code>SSIDAC1 = &lt;SSID_NHOM&gt;_5G</code> → <strong>ÁP DỤNG</strong>."
        },
        {
          page: "wifi-mesh",
          html: "Mở <span class='step-jump'>Wi-Fi → Wi-Fi Mesh</span>: Phân tích <code>Controller vs Agent</code>, so sánh EasyMesh với Repeater cũ, rồi bấm xem <span class='step-jump' data-jump='wifi-mesh-topology'>Topology hiện tại</span>."
        },
        {
          page: "sta-users",
          html: "Mở <span class='step-jump'>Thiết bị đang kết nối</span>: Chiếu đủ 3 loại thiết bị (Smartphone 5GHz, Laptop phụ, Desktop VMware Bridged), so sánh cột <strong>RSSI (dBm)</strong> &amp; <strong>Tốc độ (Mbps)</strong>."
        },
        {
          html: "Qua tab <strong>📱 ĐT &amp; VMware</strong> bấm chạy thử lệnh <code>ping</code> kiểm chứng cả 2 mô hình <strong>Infrastructure</strong> và ngang hàng <strong>Ad-hoc</strong> (<code>192.168.50.1 ↔ 192.168.50.2</code>)."
        }
      ]
    },
    5: {
      name: "TV5 — Tường lửa SPI & Kiểm soát con cái (Deny vs Allow)",
      startPage: "fw-spi",
      steps: [
        {
          page: "fw-spi",
          html: "Mở <span class='step-jump'>An ninh → Tường lửa</span>: Giải thích cơ chế kiểm tra trạng thái gói tin <strong>SPI</strong>, phân tích 3 mức (<code>Thấp / Trung bình / Cao</code>), chọn <strong>Cao</strong> → <strong>ÁP DỤNG</strong>."
        },
        {
          page: "fw-parentalcontrol",
          html: "Mở <span class='step-jump'>An ninh → Kiểm soát con cái</span>: <strong>Trước khi chặn</strong> mở tab <strong>📱 ĐT</strong> lướt thử <code>fit.hcmus.edu.vn</code> thấy vào bình thường."
        },
        {
          page: "fw-parentalcontrol",
          html: "<strong>Test Deny (Blacklist):</strong> Bấm <strong>THÊM</strong>, nhập MAC điện thoại bằng <strong>dấu hai chấm <code>:</code></strong> (tránh bẫy dấu <code>-</code>!), chọn <code>Access Policy = Deny</code> → <strong>ÁP DỤNG</strong>. Mở <strong>📱 ĐT</strong> thấy bị cắt sạch Internet 24/7!"
        },
        {
          page: "fw-parentalcontrol",
          html: "<strong>Test Allow (Theo giờ + Chặn Web):</strong> Bấm <strong>✏️ Chỉnh sửa</strong>, đổi sang <code>Allow</code>, gõ <code>Block URL = dantri.com.vn</code>, chọn Thứ/Giờ rồi <strong>BẮT BUỘC bấm dấu [+] xanh</strong> → <strong>ÁP DỤNG</strong>. Mở <strong>📱 ĐT</strong> thấy vào lại được <code>fit.hcmus.edu.vn</code> nhưng bị khóa cứng <code>dantri.com.vn</code>! (Xong nhớ XÓA luật)."
        }
      ]
    },
    6: {
      name: "TV6 — Ứng dụng (Lập lịch, NAT/DMZ) & Bảo dưỡng / Khôi phục gốc",
      startPage: "tools-time",
      steps: [
        {
          page: "tools-time",
          html: "Mở <span class='step-jump'>Bảo dưỡng → Giờ hệ thống</span> kiểm tra đồng bộ NTP <code>GMT+07:00</code> → Sang <span class='step-jump' data-jump='apps-wifischeduling'>Ứng dụng → Lập lịch Wi-Fi</span> đặt tắt sóng ở phút kế tiếp (dùng nút <strong>⏩ Tua +1 phút</strong> ở khung bên dưới để xem đèn WLAN tắt &amp; sóng ngắt ngay!)."
        },
        {
          page: "apps-portforwarding",
          html: "Mở <span class='step-jump'>Ứng dụng → Port Forwarding</span>: Bấm <strong>THÊM</strong> tạo luật <code>TCP</code> cổng ngoài <code>8080 → 192.168.1.150:80</code>. Sau đó mở <span class='step-jump' data-jump='apps-dmz'>DMZ</span> đặt cạnh để so sánh, và lướt nhanh <span class='step-jump' data-jump='apps-sslim'>Giới hạn phiên (16384)</span>, <span class='step-jump' data-jump='apps-route'>Định tuyến tĩnh</span>, <span class='step-jump' data-jump='apps-ddns'>DDNS</span>."
        },
        {
          page: "tools-diagnostic",
          html: "Mở <span class='step-jump'>Bảo dưỡng → Chẩn đoán mạng</span>: Chạy thử cả <strong>Ping</strong> và <strong>Traceroute</strong> tới <code>8.8.8.8</code>. Điểm nhanh <span class='step-jump' data-jump='tools-admin'>Quản trị</span>, <span class='step-jump' data-jump='tools-wan2lan'>Uplink Mirroring</span>, <span class='step-jump' data-jump='tools-firmware'>Firmware</span>, <span class='step-jump' data-jump='tools-log'>Bản ghi</span>, <span class='step-jump' data-jump='tools-reboot'>Khởi động lại</span>."
        },
        {
          page: "tools-config",
          html: "<strong>Kết màn trọn vẹn:</strong> Mở <span class='step-jump'>Bảo dưỡng → Cấu hình</span>, chọn file backup đã lưu ở Cảnh 1 bấm <strong>KHÔI PHỤC</strong> → Sóng gia đình <code>LongGiang</code> sống lại 100%!"
        }
      ]
    }
  };

  window.LabUI = {
    showSticker: false,
    vmPingLog: "",
    render: function () {
      const container = document.getElementById("lab-drawer-body");
      if (!container) return;
      const st = window.SimState;
      const tab = (st.coach && st.coach.labTab) || "coach";

      document.querySelectorAll(".lab-tab").forEach(function (btn) {
        btn.classList.toggle("active", btn.getAttribute("data-tab") === tab);
      });

      if (tab === "coach") {
        container.innerHTML = this.renderCoachTab();
        this.bindCoachTab();
      } else if (tab === "phone") {
        container.innerHTML = this.renderPhoneTab();
        this.bindPhoneTab();
      } else {
        container.innerHTML = this.renderHardwareTab();
        this.bindHardwareTab();
      }
    },

    renderCoachTab: function () {
      const st = window.SimState;
      const tv = st.coach.activeTv || 1;
      const scene = TV_SCENES[tv];

      return `
        <div class="lab-section">
          <div class="lab-sec-title">
            <span>🏷️ Mã SSID Nhóm &amp; Công Cụ Điền Nhanh</span>
          </div>
          <div style="display:flex;gap:6px;margin-bottom:8px;">
            <input type="text" id="lab-group-ssid" value="${esc(st.coach.groupSsid)}"
              style="flex:1;padding:6px 9px;border-radius:5px;border:1px solid #475569;background:#0f172a;color:#fff;font-size:12.5px;"
              placeholder="Ví dụ: 24CLC01-N05" />
            <button type="button" class="btn-vht small" id="lab-save-group">Lưu mã</button>
          </div>
          <div style="display:grid;grid-template-columns:1fr 1fr;gap:5px;">
            <button type="button" class="lab-btn ghost" id="lab-q-fill-ssid" style="margin:0;padding:5px 6px;font-size:11px;">⚡ Điền SSID Nhóm</button>
            <button type="button" class="lab-btn ghost" id="lab-q-fill-mac" style="margin:0;padding:5px 6px;font-size:11px;">📱 Điền MAC ĐT chuẩn ':'</button>
            <button type="button" class="lab-btn ghost" id="lab-q-fill-badmac" style="margin:0;padding:5px 6px;font-size:11px;">⚠️ Thử MAC dấu '-' (Bẫy)</button>
            <button type="button" class="lab-btn ghost" id="lab-q-nextmin" style="margin:0;padding:5px 6px;font-size:11px;">⏰ Đặt lịch phút kế</button>
            <button type="button" class="lab-btn ghost" id="lab-q-plus1m" style="margin:0;padding:5px 6px;font-size:11px;">⏩ Tua giờ Router +1p</button>
            <button type="button" class="lab-btn ghost" id="lab-q-restore-mem" style="margin:0;padding:5px 6px;font-size:11px;">♻️ Khôi phục nhanh Gốc</button>
          </div>
        </div>

        <div class="lab-section">
          <div class="lab-sec-title">
            <span>🎬 Chọn Thành Viên Để Luyện Tập (TV1 → TV6)</span>
          </div>
          <div class="tv-grid">
            ${[1, 2, 3, 4, 5, 6]
              .map((n) => `<button type="button" class="tv-btn ${n === tv ? "active" : ""}" data-tv="${n}">TV${n}</button>`)
              .join("")}
          </div>
          <div style="font-weight:700;font-size:13px;color:#f8fafc;margin-bottom:6px;">${esc(scene.name)}</div>
          <button type="button" class="lab-btn" id="lab-load-preset">
            ⚡ Nạp sẵn trạng thái đầu cảnh TV${tv} &amp; Mở trang
          </button>

          <ul class="step-list">
            ${scene.steps
              .map(
                (s, i) => `
              <li class="step-item" ${s.page ? `data-step-page="${s.page}"` : ""}>
                <strong style="color:#38bdf8;">Bước ${tv}.${i + 1}:</strong> ${s.html}
              </li>`
              )
              .join("")}
          </ul>
        </div>

        <div class="lab-section">
          <div class="lab-sec-title"><span>🔄 Đặt lại toàn bộ Mô phỏng</span></div>
          <button type="button" class="lab-btn ghost" id="lab-reset-family">
            🏠 Đưa về trạng thái Gia đình ban đầu ('LongGiang' trước Reset)
          </button>
        </div>
      `;
    },

    bindCoachTab: function () {
      const self = this;
      document.getElementById("lab-save-group").addEventListener("click", function () {
        const val = document.getElementById("lab-group-ssid").value.trim() || "24CLC01-N01";
        window.SimState.coach.groupSsid = val;
        window.SimEngine.saveState();
        window.RouterApp.showToast("Đã cập nhật mã SSID nhóm: " + val);
        window.RouterApp.renderCurrentPage();
        self.render();
      });

      document.getElementById("lab-q-fill-ssid").addEventListener("click", function () {
        const g = window.SimState.coach.groupSsid || "24CLC01-N01";
        const inp24 = document.getElementById("w24-ssid-name");
        const inp5 = document.getElementById("w5-ssid-name");
        const inpHome24 = document.getElementById("qs-ssid-24");
        if (inp24) {
          const idx = window.SimState.wifi24.selectedIdx || 1;
          inp24.value = idx === 1 ? g : g + "_Guest";
          const enSw = document.getElementById("w24-ssid-enable");
          if (enSw) enSw.checked = true;
          window.RouterApp.showToast("Đã điền SSID 2.4GHz: " + inp24.value);
        } else if (inp5) {
          const idx = window.SimState.wifi5.selectedIdx || 1;
          inp5.value = idx === 1 ? g + "_5G" : g + "_5G_" + idx;
          const enSw = document.getElementById("w5-ssid-enable");
          if (enSw) enSw.checked = true;
          window.RouterApp.showToast("Đã điền SSID 5GHz: " + inp5.value);
        } else if (inpHome24) {
          inpHome24.value = g;
          const inpHome5 = document.getElementById("qs-ssid-5");
          if (inpHome5) inpHome5.value = g + "_5G";
          window.RouterApp.showToast("Đã điền SSID Nhóm tại trang Cài đặt nhanh!");
        } else {
          window.RouterApp.showToast("Hãy mở trang Thiết lập Wi-Fi 2.4GHz, 5GHz hoặc Cài đặt nhanh trước!");
        }
      });

      document.getElementById("lab-q-fill-mac").addEventListener("click", function () {
        const mac = window.SimState.simDevices.phone.mac;
        const lanMac = document.getElementById("static-mac-in");
        const pcMac = document.getElementById("pc-f-mac");
        if (lanMac) {
          lanMac.value = mac;
          const lanIp = document.getElementById("static-ip-in");
          if (lanIp && !lanIp.value) lanIp.value = "192.168.1.150";
          window.RouterApp.showToast("Đã điền MAC chuẩn ':' (" + mac + ") vào Bảng cấp phát IP tĩnh!");
        } else if (pcMac) {
          pcMac.value = mac;
          window.RouterApp.showToast("Đã điền MAC chuẩn ':' (" + mac + ") vào Kiểm soát con cái!");
        } else {
          if (navigator.clipboard) navigator.clipboard.writeText(mac);
          window.RouterApp.showToast("Đã copy MAC Điện thoại: " + mac + " (Mở Thiết lập LAN hoặc Kiểm soát con cái để điền tự động)");
        }
      });

      document.getElementById("lab-q-fill-badmac").addEventListener("click", function () {
        const badMac = window.SimState.simDevices.phone.mac.replace(/:/g, "-");
        const pcMac = document.getElementById("pc-f-mac");
        const lanMac = document.getElementById("static-mac-in");
        if (pcMac) {
          pcMac.value = badMac;
          window.RouterApp.showToast("Đã điền MAC dấu gạch ngang (" + badMac + "). Bấm ÁP DỤNG để xem cảnh báo lỗi Firmware!");
        } else if (lanMac) {
          lanMac.value = badMac;
          window.RouterApp.showToast("Đã điền MAC dấu gạch ngang (" + badMac + "). Bấm THÊM để xem cảnh báo lỗi!");
        } else {
          window.RouterApp.showToast("Hãy mở Kiểm soát con cái (bấm THÊM) hoặc Thiết lập LAN trước!");
        }
      });

      document.getElementById("lab-q-nextmin").addEventListener("click", function () {
        const startIn = document.getElementById("wsch-start");
        const endIn = document.getElementById("wsch-end");
        const enIn = document.getElementById("wsch-en");
        if (!startIn || !endIn) {
          window.RouterApp.ensureLoggedIn();
          window.RouterApp.navigate("apps-wifischeduling");
        }
        setTimeout(function () {
          const now = window.SimEngine.nowRouterDate();
          const pad = function (n) {
            return String(n).padStart(2, "0");
          };
          const d1 = new Date(now.getTime() + 60000);
          const d2 = new Date(now.getTime() + 6 * 60000);
          const sEl = document.getElementById("wsch-start");
          const eEl = document.getElementById("wsch-end");
          const enEl = document.getElementById("wsch-en");
          if (sEl && eEl) {
            sEl.value = pad(d1.getHours()) + ":" + pad(d1.getMinutes());
            eEl.value = pad(d2.getHours()) + ":" + pad(d2.getMinutes());
            if (enEl) enEl.checked = true;
            document.querySelectorAll(".wsch-day").forEach(function (c) {
              c.checked = true;
            });
            window.RouterApp.showToast("Đã điền giờ tắt Wi-Fi ở phút kế tiếp (" + sEl.value + " -> " + eEl.value + "). Bấm ÁP DỤNG rồi bấm '⏩ Tua giờ Router +1p'!");
          }
        }, 50);
      });

      document.getElementById("lab-q-plus1m").addEventListener("click", function () {
        window.SimState.admin.clockOffsetSec = (window.SimState.admin.clockOffsetSec || 0) + 60;
        window.SimEngine.reconcileClients();
        window.SimEngine.saveState();
        window.RouterApp.showToast("Đã tua nhanh đồng hồ Router +1 phút!");
        window.RouterApp.renderCurrentPage();
        self.render();
      });

      document.getElementById("lab-q-restore-mem").addEventListener("click", function () {
        const raw = localStorage.getItem(window.SimEngine.BACKUP_KEY);
        const fam = raw ? JSON.parse(raw) : window.SimEngine.createFamilyPreResetConfig(window.SimState.coach.groupSsid);
        window.RouterApp.runRebootSimulation("Đang nạp lại file cấu hình & khởi động lại thiết bị...", function () {
          window.SimState = fam;
          window.SimEngine.addLog("[CONFIG] Đã KHÔI PHỤC thành công cấu hình gốc gia đình (SSID: " + fam.wifi24.ssids[0].ssid + ").");
          window.SimEngine.saveState();
          window.RouterApp.renderAll();
          window.RouterApp.showToast("Khôi phục thành công! Sóng '" + fam.wifi24.ssids[0].ssid + "' đã hoạt động trở lại.");
        });
      });

      document.querySelectorAll(".tv-btn").forEach(function (b) {
        b.addEventListener("click", function () {
          window.SimState.coach.activeTv = parseInt(b.getAttribute("data-tv"), 10);
          window.SimEngine.saveState();
          self.render();
        });
      });

      document.getElementById("lab-load-preset").addEventListener("click", function () {
        const tv = window.SimState.coach.activeTv || 1;
        window.SimEngine.loadTvScenePreset(tv);
        const startPage = TV_SCENES[tv].startPage;
        window.RouterApp.ensureLoggedIn();
        window.RouterApp.navigate(startPage);
        window.RouterApp.showToast("Đã nạp sẵn môi trường đầu phân cảnh cho TV" + tv + "!");
        self.render();
      });

      document.querySelectorAll(".step-item").forEach(function (li) {
        const defaultPage = li.getAttribute("data-step-page");
        li.querySelectorAll(".step-jump").forEach(function (sp) {
          sp.addEventListener("click", function (ev) {
            ev.stopPropagation();
            const target = sp.getAttribute("data-jump") || defaultPage;
            if (target) {
              window.RouterApp.ensureLoggedIn();
              window.RouterApp.navigate(target);
            }
          });
        });
      });

      document.getElementById("lab-reset-family").addEventListener("click", function () {
        window.SimEngine.loadTvScenePreset(1);
        window.RouterApp.renderAll();
        window.RouterApp.showToast("Đã khôi phục bài tập về trạng thái gia đình ban đầu (LongGiang)!");
      });
    },

    renderPhoneTab: function () {
      const st = window.SimState;
      const phone = st.simDevices.phone;
      const allNets = window.SimEngine.getActiveBroadcastSsids();
      const visibleNets = allNets.filter((n) => !n.hidden);
      const schedOff = window.SimEngine.isWifiScheduledOff();
      const curNet = allNets.find((n) => n.ssid === phone.ssid);

      return `
        <div class="lab-section">
          <div class="lab-sec-title">
            <span>📱 Điện Thoại Thử Nghiệm (Góc ĐT 2)</span>
            <label style="font-size:11.5px;color:#e2e8f0;cursor:pointer;">
              <input type="checkbox" id="ph-wifi-toggle" ${phone.wifiOn ? "checked" : ""} /> Wi-Fi ${phone.wifiOn ? "Bật" : "Tắt"}
            </label>
          </div>

          <div class="phone-frame">
            <div class="phone-statusbar">
              <span>Viettel 4G/Wi-Fi</span>
              <span>MAC: <code>${esc(phone.mac)}</code></span>
            </div>

            ${
              !phone.wifiOn
                ? `<div style="text-align:center;padding:14px;color:#94a3b8;font-size:12px;">Wi-Fi trên điện thoại đang Tắt. Bật lại ở góc trên để quét sóng &amp; nhận lại IP DHCP!</div>`
                : `
              <div style="font-size:11.5px;color:#94a3b8;margin-bottom:6px;display:flex;justify-content:space-between;">
                <span>Danh sách mạng Wi-Fi (${visibleNets.length}):</span>
                <span style="color:#38bdf8;cursor:pointer;" id="ph-reconnect-dhcp">🔄 Tắt/Bật nhận lại IP</span>
              </div>

              ${
                schedOff
                  ? `<div style="background:#451a03;border:1px solid #d97706;color:#fde68a;padding:8px;border-radius:6px;font-size:11.5px;margin-bottom:8px;">
                      ⏰ Bộ phát sóng Wi-Fi trên Router đang TẮT theo <strong>Lập lịch Wi-Fi (${esc(schedOff.start)}–${esc(schedOff.end)})</strong>!
                    </div>`
                  : visibleNets.length === 0
                  ? `<div style="color:#94a3b8;font-size:12px;padding:8px;">Không có mạng Wi-Fi nào đang quảng bá.</div>`
                  : visibleNets
                      .map((n) => {
                        const isConn = phone.connected && phone.ssid === n.ssid;
                        return `
                      <div class="wifi-scan-item ${isConn ? "connected" : ""}">
                        <div>
                          <div style="font-weight:700;color:#f8fafc;">📶 ${esc(n.ssid)}</div>
                          <div style="font-size:10.5px;color:#94a3b8;">${esc(n.band)} • ${esc(n.bw)} • ${esc(n.auth)}</div>
                        </div>
                        ${
                          isConn
                            ? `<span style="color:#4ade80;font-size:11px;font-weight:700;">✓ Đã kết nối</span>`
                            : `<button type="button" class="btn-vht small ph-conn-btn" data-ssid="${esc(n.ssid)}">Kết nối</button>`
                        }
                      </div>`;
                      })
                      .join("")
              }

              ${
                phone.connected && curNet
                  ? `
                <div style="background:#0f172a;border:1px solid #334155;border-radius:6px;padding:8px;margin-top:8px;font-size:11.5px;line-height:1.5;">
                  <div><strong>Mạng đang bắt:</strong> <span style="color:#4ade80;">${esc(phone.ssid)}</span> (${esc(curNet.band)})</div>
                  <div><strong>Địa chỉ IP nhận được:</strong> <code style="color:#38bdf8;font-weight:700;">${esc(phone.ip)}</code></div>
                  <div><strong>Tốc độ liên kết / RSSI:</strong> ${curNet.speedMbps} Mbps (${phone.rssi} dBm)</div>
                </div>`
                  : ""
              }

              <div class="phone-browser-box">
                <div style="font-weight:700;margin-bottom:6px;color:#1e293b;">🌐 Trình duyệt Điện thoại (Test Chặn MAC / URL)</div>
                <div style="display:flex;gap:4px;margin-bottom:6px;">
                  <input type="text" id="ph-url-in" value="${esc(phone.lastUrl || "fit.hcmus.edu.vn")}"
                    style="flex:1;padding:5px 7px;border:1px solid #cbd5e1;border-radius:4px;font-size:12px;" />
                  <button type="button" class="btn-vht small" id="ph-go-url">Mở Web</button>
                </div>
                <div style="display:flex;gap:4px;flex-wrap:wrap;margin-bottom:6px;">
                  <button type="button" class="btn-icon ph-qurl" data-u="fit.hcmus.edu.vn">fit.hcmus.edu.vn</button>
                  <button type="button" class="btn-icon ph-qurl" data-u="google.com">google.com</button>
                  <button type="button" class="btn-icon ph-qurl" data-u="dantri.com.vn">dantri.com.vn</button>
                </div>
                ${
                  phone.lastBrowserResult
                    ? `<div style="padding:7px 9px;border-radius:5px;font-size:11.5px;font-weight:600;background:${
                        phone.lastBrowserResult.ok ? "#dcfce7" : "#fee2e2"
                      };color:${phone.lastBrowserResult.ok ? "#166534" : "#991b1b"};">
                        ${phone.lastBrowserResult.ok ? "✅ " : "🚫 "}${esc(phone.lastBrowserResult.reason)}
                      </div>`
                    : `<div style="color:#64748b;font-size:11px;">Bấm chọn 1 trang web ở trên để kiểm tra kết nối Internet thực tế từ Điện thoại.</div>`
                }
              </div>
            `
            }
          </div>
        </div>

        <div class="lab-section">
          <div class="lab-sec-title"><span>🖥️ Đa Thiết Bị (VMware Bridged) &amp; Mạng Ad-hoc (TV4)</span></div>
          <label class="check-item" style="margin-bottom:6px;color:#e2e8f0;">
            <input type="checkbox" id="sim-aux-laptop" ${st.simDevices.laptopAux.connected ? "checked" : ""} />
            Kết nối thêm <strong>Laptop phụ</strong> vào Wi-Fi (${esc(st.wifi24.ssids[0].ssid)})
          </label>
          <label class="check-item" style="margin-bottom:8px;color:#e2e8f0;">
            <input type="checkbox" id="sim-vm-desktop" ${st.simDevices.desktopVm.connected ? "checked" : ""} />
            Bật <strong>Máy ảo Desktop (VMware Bridged)</strong> nhận IP cùng lớp <code>192.168.1.x</code>
          </label>
          <div style="display:flex;gap:6px;">
            <button type="button" class="lab-btn" id="sim-ping-infra" style="margin-top:0;">Ping Infrastructure</button>
            <button type="button" class="lab-btn ghost" id="sim-ping-adhoc" style="margin-top:0;">Ping Ad-hoc (.50.2)</button>
          </div>
          ${
            this.vmPingLog
              ? `<pre style="margin-top:8px;background:#020617;color:#a7f3d0;padding:8px;border-radius:5px;font-size:11px;white-space:pre-wrap;">${esc(
                  this.vmPingLog
                )}</pre>`
              : ""
          }
        </div>
      `;
    },

    bindPhoneTab: function () {
      const self = this;
      const st = window.SimState;
      const phone = st.simDevices.phone;

      document.getElementById("ph-wifi-toggle").addEventListener("change", function (e) {
        phone.wifiOn = e.target.checked;
        if (phone.wifiOn) {
          const nets = window.SimEngine.getActiveBroadcastSsids();
          const match = nets.find((n) => n.ssid === phone.ssid) || nets.find((n) => !n.hidden);
          if (match) {
            phone.connected = true;
            phone.ssid = match.ssid;
            phone.band = match.actualBand;
            phone.ip = window.SimEngine.allocateDhcpIpForMac(phone.mac, null);
          }
        } else {
          phone.connected = false;
        }
        window.SimEngine.saveState();
        window.RouterApp.renderCurrentPage();
        self.render();
      });

      const reconBtn = document.getElementById("ph-reconnect-dhcp");
      if (reconBtn) {
        reconBtn.addEventListener("click", function () {
          if (phone.connected) {
            phone.ip = window.SimEngine.allocateDhcpIpForMac(phone.mac, null);
            window.SimEngine.saveState();
            window.RouterApp.showToast("Điện thoại đã kết nối lại Wi-Fi & nhận IP: " + phone.ip);
            window.RouterApp.renderCurrentPage();
            self.render();
          }
        });
      }

      document.querySelectorAll(".ph-conn-btn").forEach(function (btn) {
        btn.addEventListener("click", function () {
          const ssid = btn.getAttribute("data-ssid");
          const nets = window.SimEngine.getActiveBroadcastSsids();
          const target = nets.find((n) => n.ssid === ssid);
          if (!target) return;
          if (target.auth !== "OPEN") {
            const entered = prompt(
              "Nhập mật khẩu Wi-Fi cho mạng '" + ssid + "' (Gợi ý kịch bản: " + target.key + "):",
              target.key
            );
            if (entered === null) return;
            if (entered !== target.key) {
              return alert("Sai mật khẩu Wi-Fi! Không thể kết nối.");
            }
          }
          phone.connected = true;
          phone.ssid = target.ssid;
          phone.band = target.actualBand;
          phone.ip = window.SimEngine.allocateDhcpIpForMac(phone.mac, null);
          phone.lastBrowserResult = null;
          window.SimEngine.addLog("[WLAN CLIENT] Smartphone-Test (" + phone.mac + ") đã kết nối vào '" + ssid + "', nhận IP " + phone.ip + ".");
          window.RouterApp.renderCurrentPage();
          self.render();
        });
      });

      function testUrl(u) {
        phone.lastUrl = u;
        phone.lastBrowserResult = window.SimEngine.checkClientUrlAccess(phone.mac, u);
        window.SimEngine.saveState();
        self.render();
      }

      const goBtn = document.getElementById("ph-go-url");
      if (goBtn) {
        goBtn.addEventListener("click", function () {
          testUrl(document.getElementById("ph-url-in").value);
        });
      }
      document.querySelectorAll(".ph-qurl").forEach(function (b) {
        b.addEventListener("click", function () {
          testUrl(b.getAttribute("data-u"));
        });
      });

      document.getElementById("sim-aux-laptop").addEventListener("change", function (e) {
        const aux = st.simDevices.laptopAux;
        aux.connected = e.target.checked;
        if (aux.connected) {
          aux.ssid = st.wifi24.ssids[0].ssid;
          aux.ip = window.SimEngine.allocateDhcpIpForMac(aux.mac, "192.168.1.12");
        }
        window.SimEngine.saveState();
        window.RouterApp.renderCurrentPage();
      });

      document.getElementById("sim-vm-desktop").addEventListener("change", function (e) {
        st.simDevices.desktopVm.connected = e.target.checked;
        window.SimEngine.saveState();
        window.RouterApp.renderCurrentPage();
      });

      document.getElementById("sim-ping-infra").addEventListener("click", function () {
        if (!phone.connected) {
          self.vmPingLog = "C:\\Users\\VMware-Desktop> ping " + phone.ip + "\nRequest timed out (Điện thoại chưa bắt Wi-Fi!).";
        } else {
          self.vmPingLog =
            "C:\\Users\\VMware-Desktop> ipconfig\n   IPv4 Address. . . : 192.168.1.15 (DHCP via Router 192.168.1.1)\n\n" +
            "C:\\Users\\VMware-Desktop> ping " +
            phone.ip +
            "\nReply from " +
            phone.ip +
            ": bytes=32 time=3ms TTL=64\nReply from " +
            phone.ip +
            ": bytes=32 time=2ms TTL=64\nPing thành công 100% qua Router (Mô hình Infrastructure)!";
        }
        self.render();
      });

      document.getElementById("sim-ping-adhoc").addEventListener("click", function () {
        self.vmPingLog =
          "[Mô hình Ad-hoc Peer-to-Peer không qua Router — Không Default Gateway]\n" +
          "Máy 1: 192.168.50.1 / 255.255.255.0  <===>  Máy 2: 192.168.50.2 / 255.255.255.0\n\n" +
          "C:\\AdHoc-PC1> ping 192.168.50.2\nReply from 192.168.50.2: bytes=32 time=1ms TTL=128\nReply from 192.168.50.2: bytes=32 time=1ms TTL=128\nChia sẻ SMB \\\\192.168.50.2\\Share thành công (0% loss)!";
        self.render();
      });
    },

    renderHardwareTab: function () {
      const st = window.SimState;
      const dev = st.device;
      const schedOff = window.SimEngine.isWifiScheduledOff();
      const w24On = st.wifi24.enabled && !schedOff;
      const w5On = st.wifi5.enabled && !schedOff;
      const wpsBlinking = dev.wpsBlinkUntil && Date.now() < dev.wpsBlinkUntil;
      const lan1Up = st.simDevices.laptopObs.connMode === "LAN1";
      const lan2Up = st.simDevices.desktopVm.connected;

      return `
        <div class="lab-section">
          <div class="lab-sec-title"><span>📟 Mô Phỏng Phần Cứng Viettel vGP-42X6V1 (Góc ĐT 1)</span></div>
          <div class="hw-router-box">
            <div style="display:flex;justify-content:space-between;align-items:center;">
              <strong style="color:#ee0033;">VHT vGP-42X6V1 (AX3000 GPON)</strong>
              <span style="font-size:11px;color:#475569;">Đèn LED mặt trước</span>
            </div>

            <div class="led-strip">
              <div class="led-item" title="Nguồn điện 12V-1A ổn định"><div class="led-bulb green"></div><span>Power</span></div>
              <div class="led-item" title="Đồng bộ quang OLT Viettel"><div class="led-bulb ${dev.fiberFault ? "" : "green"}"></div><span>PON</span></div>
              <div class="led-item" title="Loss of Signal: Bình thường phải TẮT; Chớp đỏ = đứt/gập cáp quang"><div class="led-bulb ${dev.fiberFault ? "red" : ""}"></div><span>LOS</span></div>
              <div class="led-item" title="Sóng Wi-Fi 2.4GHz"><div class="led-bulb ${w24On ? "blink-green" : ""}"></div><span>2.4G</span></div>
              <div class="led-item" title="Sóng Wi-Fi 5GHz"><div class="led-bulb ${w5On ? "blink-green" : ""}"></div><span>5G</span></div>
              <div class="led-item" title="Chớp xanh khi mở ghép nối WPS / EasyMesh"><div class="led-bulb ${wpsBlinking ? "blink-green" : ""}"></div><span>WPS</span></div>
              <div class="led-item"><div class="led-bulb ${lan1Up ? "blink-green" : ""}"></div><span>LAN1</span></div>
              <div class="led-item"><div class="led-bulb ${lan2Up ? "blink-green" : ""}"></div><span>LAN2</span></div>
              <div class="led-item"><div class="led-bulb"></div><span>LAN3</span></div>
              <div class="led-item"><div class="led-bulb"></div><span>LAN4</span></div>
            </div>

            <div style="font-size:11.5px;font-weight:700;margin-top:10px;color:#334155;">Cổng kết nối &amp; Nút bấm vật lý mặt sau:</div>
            <div class="hw-ports-row">
              <span class="port-chip pon" title="Cổng cáp quang GPON chuẩn SC/APC đầu màu xanh lá">PON (SC/APC Xanh lá)</span>
              <span class="port-chip lan">LAN1 (1G)</span>
              <span class="port-chip lan">LAN2 (1G)</span>
              <span class="port-chip lan">LAN3 (1G)</span>
              <span class="port-chip lan">LAN4 (1G)</span>
            </div>

            <div style="display:flex;flex-direction:column;gap:6px;margin-top:10px;">
              <button type="button" class="btn-vht danger small" id="hw-btn-hard-reset">
                📌 Chọc giữ lỗ RESET cứng (10–15 giây → Về mặc định tem đáy)
              </button>
              <button type="button" class="btn-vht outline small" id="hw-btn-wps">
                🔘 Nhấn nút WPS vật lý (Mở ghép nối nhanh / Mesh 2 phút)
              </button>
              <button type="button" class="btn-vht secondary small" id="hw-btn-flip">
                ${this.showSticker ? "🔼 Úp lại mặt trên" : "🔄 Lật mặt đáy xem Tem thông số gốc nhà sản xuất"}
              </button>
            </div>

            ${
              this.showSticker
                ? `
              <div class="sticker-label">
                <strong>VIETTEL HIGH TECH — GPON ONT Wi-Fi 6</strong><br/>
                Model: <strong>vGP-42X6V1</strong> &nbsp;|&nbsp; Nguồn: <strong>12V ⎓ 1.0A</strong><br/>
                IP Quản trị mặc định: <strong>https://192.168.1.1</strong><br/>
                Username: <strong>admin</strong> &nbsp;|&nbsp; Password: <strong>VTGR2239D5BC</strong><br/>
                GPON S/N: <strong>VTGR2239D5BC</strong> &nbsp;|&nbsp; MAC: <strong>24:0B:2B:39:D5:BC</strong><br/>
                SSID gốc xuất xưởng: <strong>VIETTEL_39D5BC</strong><br/>
                Mật khẩu Wi-Fi gốc: <strong>123456a@</strong>
              </div>`
                : ""
            }
          </div>
        </div>

        <div class="lab-section">
          <div class="lab-sec-title"><span>🧪 Giả Lập Tình Huống Thực Tế &amp; Bẫy Kỹ Thuật</span></div>
          <label class="check-item" style="margin-bottom:8px;color:#e2e8f0;">
            <input type="checkbox" id="hw-lan1-cable" ${lan1Up ? "checked" : ""} />
            <strong>Cắm dây cáp mạng LAN1 vào Laptop OBS</strong>
          </label>
          <label class="check-item" style="color:#fca5a5;">
            <input type="checkbox" id="hw-fiber-fault" ${dev.fiberFault ? "checked" : ""} />
            <strong>Giả lập gập/lỏng đầu dây cáp quang xanh lá (LOS đỏ)</strong>
          </label>
        </div>
      `;
    },

    bindHardwareTab: function () {
      const self = this;
      const st = window.SimState;

      document.getElementById("hw-btn-flip").addEventListener("click", function () {
        self.showSticker = !self.showSticker;
        self.render();
      });

      document.getElementById("hw-btn-wps").addEventListener("click", function () {
        st.device.wpsBlinkUntil = Date.now() + 120000;
        window.SimEngine.addLog("[HARDWARE] Nhấn nút WPS vật lý trên thân máy (Mở phiên PBC 2 phút).");
        window.RouterApp.showToast("Đèn WPS trên mặt trước Router đang chớp xanh (Phiên ghép nối 2 phút)!");
        self.render();
      });

      document.getElementById("hw-btn-hard-reset").addEventListener("click", function () {
        if (
          !confirm(
            "Mô phỏng thao tác dùng que chọc SIM nhấn giữ lỗ Reset chìm 10–15 giây?\n\n(Mạng cũ sẽ bị xóa sạch và quay về đúng tên sóng trên tem đáy: VIETTEL_39D5BC / mật khẩu: 123456a@)"
          )
        ) {
          return;
        }
        window.RouterApp.runRebootSimulation(
          "Đang giữ nút Reset cứng 15s... Dàn đèn LED chớp tắt & khởi động lại về mặc định tem đáy...",
          function () {
            const wasWifiLaptop = st.simDevices.laptopObs.connMode === "WIFI";
            window.SimEngine.performFactoryReset("Chọc nút Reset cứng vật lý 15 giây");
            if (wasWifiLaptop) {
              window.RouterApp.logout(
                "Laptop của bạn đang bắt Wi-Fi thay vì cắm dây LAN1, nên khi Reset cứng làm mất sóng cũ, phiên kết nối 192.168.1.1 đã bị ngắt!"
              );
            }
            window.RouterApp.renderAll();
            window.RouterApp.showToast("Reset cứng hoàn tất! Sóng mặc định 'VIETTEL_39D5BC' đã phát sóng.");
          }
        );
      });

      document.getElementById("hw-lan1-cable").addEventListener("change", function (e) {
        st.simDevices.laptopObs.connMode = e.target.checked ? "LAN1" : "WIFI";
        st.simDevices.laptopObs.wifiSsid = st.wifi24.ssids[0].ssid;
        window.SimEngine.saveState();
        window.RouterApp.renderCurrentPage();
        self.render();
      });

      document.getElementById("hw-fiber-fault").addEventListener("change", function (e) {
        st.device.fiberFault = e.target.checked;
        window.SimEngine.addLog(
          e.target.checked
            ? "[GPON ALARM] LOS (Loss of Signal)! Suy hao quang -31.85 dBm vượt ngưỡng -27 dBm!"
            : "[GPON] Tín hiệu cáp quang phục hồi ổn định (-21.14 dBm, O5 Associated)."
        );
        window.RouterApp.renderCurrentPage();
        self.render();
      });
    }
  };
})();
