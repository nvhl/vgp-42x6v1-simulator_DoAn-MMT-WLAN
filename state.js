/* ==========================================================================
   state.js — Router State Engine, Factory/Family Presets, TV1–TV6 Scene Presets,
   Live Clock, Wi-Fi Schedule Evaluator, DHCP & Parental Control Engine
   ========================================================================== */

(function () {
  const STORAGE_KEY = "vgp42x6v1_sim_state_v1";
  const SNAPSHOT_KEY = "vgp42x6v1_prereset_snap_v1";
  const BACKUP_KEY = "vgp42x6v1_last_backup_v1";

  function nowRouterDate(stateObj) {
    const st = stateObj || window.SimState;
    const offsetMs = ((st && st.admin && st.admin.clockOffsetSec) || 0) * 1000;
    return new Date(Date.now() + offsetMs);
  }

  function formatDateTime(d) {
    const pad = (n) => String(n).padStart(2, "0");
    return (
      d.getFullYear() +
      "-" +
      pad(d.getMonth() + 1) +
      "-" +
      pad(d.getDate()) +
      " " +
      pad(d.getHours()) +
      ":" +
      pad(d.getMinutes()) +
      ":" +
      pad(d.getSeconds())
    );
  }

  function getDayCode(d) {
    const names = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    return names[d.getDay()];
  }

  // Base Factory Default Configuration (After Hard Reset / Soft Factory Reset)
  function createFactoryConfig() {
    return {
      device: {
        name: "ONT_VTGR2239D5BC",
        model: "vGP-42X6V1",
        partNumber: "GTDB3MG4X6F9400",
        hwVersion: "VGP42X6M001",
        firmware: "V1302250508",
        gponSN: "VTGR2239D5BC",
        macLan: "24:0B:2B:39:D5:BC",
        macWan: "24:0B:2B:39:D5:BD",
        uptimeSec: 145,
        cpuLoad: 38,
        ramUsage: 42,
        fiberFault: false,
        wpsBlinkUntil: 0
      },
      admin: {
        username: "admin",
        password: "VTGR2239D5BC",
        allowLan: true,
        allowWan: false,
        sessionTimeoutMin: 5,
        httpPort: 80,
        httpsPort: 443,
        ntpEnabled: true,
        timezone: "(GMT+07:00) Bangkok, Hanoi, Jakarta",
        ntp1: "pool.ntp.org",
        ntp2: "2.vn.pool.ntp.org",
        clockOffsetSec: 0
      },
      wanList: [
        {
          id: "1_INTERNET_R_VID_35",
          omciLocked: true,
          mode: "Route",
          ipVersion: "IPv4/IPv6",
          connType: "PPPoE",
          pppoeUser: "ftth_viettel_demo",
          pppoePass: "DemoISP2026@",
          mtu: 1492,
          nat: true,
          igmpProxy: false,
          vlanMode: "TAG",
          vlanId: 35,
          pbit: 0,
          status: "Đã kết nối",
          wanIp: "27.68.142.95",
          wanGateway: "27.68.142.1",
          dns1: "116.97.90.124",
          dns2: "116.97.90.127",
          wanIpv6: "2402:800:63a1:1200::1045/64",
          bindings: ["LAN1", "LAN2", "LAN3", "LAN4", "SSID1", "SSID2", "SSIDAC1"]
        },
        {
          id: "7_TR069_R_VID_2501",
          omciLocked: true,
          mode: "Route",
          ipVersion: "IPv4",
          connType: "DHCP",
          pppoeUser: "",
          pppoePass: "",
          mtu: 1500,
          nat: false,
          igmpProxy: false,
          vlanMode: "TAG",
          vlanId: 2501,
          pbit: 7,
          status: "Đã kết nối",
          wanIp: "10.215.48.19",
          wanGateway: "10.215.48.1",
          dns1: "10.215.0.10",
          dns2: "",
          wanIpv6: "N/A",
          bindings: []
        }
      ],
      lan: {
        ip: "192.168.1.1",
        mask: "255.255.255.0",
        dhcpEnabled: true,
        dhcpStart: "192.168.1.2",
        dhcpEnd: "192.168.1.252",
        leaseMin: 1440,
        randomIp: false,
        dnsMode: "Proxy",
        staticDns1: "8.8.8.8",
        staticDns2: "8.8.4.4",
        ipv6Slaac: true,
        ipv6Dhcp: true,
        ipv6Prefix: "2402:800:63a1:1200::/64",
        staticLeases: []
      },
      bandSteering: false,
      wifi24: {
        enabled: true,
        mode: "802.11b/g/n/ax",
        country: "VIETNAM",
        channel: "Auto",
        autoCurrentChannel: 9,
        bandwidth: "20/40 MHz",
        guardInterval: "Auto",
        txPower: "100%",
        maxSta: 45,
        dtim: 1,
        beacon: 100,
        rts: 2347,
        frag: 2346,
        wmm: true,
        wpsEnabled: true,
        wpsMode: "PBC",
        wpsPin: "49281735",
        selectedIdx: 1,
        showAdvanced: false,
        ssids: [
          { idx: 1, enabled: true, ssid: "VIETTEL_39D5BC", hidden: false, auth: "WPA2-PSK", enc: "AES", key: "123456a@" },
          { idx: 2, enabled: false, ssid: "VIETTEL_39D5BC_2", hidden: false, auth: "WPA2-PSK", enc: "AES", key: "123456a@" },
          { idx: 3, enabled: false, ssid: "VIETTEL_39D5BC_3", hidden: false, auth: "WPA2-PSK", enc: "AES", key: "123456a@" },
          { idx: 4, enabled: false, ssid: "VIETTEL_39D5BC_4", hidden: false, auth: "WPA2-PSK", enc: "AES", key: "123456a@" }
        ]
      },
      wifi5: {
        enabled: true,
        mode: "802.11a/n/ac/ax",
        country: "VIETNAM",
        channel: "Auto",
        autoCurrentChannel: 36,
        bandwidth: "20/40/80/160 MHz",
        txPower: "100%",
        maxSta: 45,
        dtim: 1,
        beacon: 100,
        rts: 2347,
        wmm: true,
        wpsEnabled: true,
        wpsMode: "PBC",
        wpsPin: "49281735",
        selectedIdx: 1,
        showAdvanced: false,
        ssids: [
          { idx: 1, enabled: true, ssid: "VIETTEL_39D5BC_5G", hidden: false, auth: "WPA2-PSK", enc: "AES", key: "123456a@" },
          { idx: 2, enabled: false, ssid: "VIETTEL_39D5BC_5G_2", hidden: false, auth: "WPA2-PSK", enc: "AES", key: "123456a@" },
          { idx: 3, enabled: false, ssid: "VIETTEL_39D5BC_5G_3", hidden: false, auth: "WPA2-PSK", enc: "AES", key: "123456a@" }
        ]
      },
      mesh: {
        enabled: true,
        role: "Controller",
        steering: true,
        backhaulStatus: "Sẵn sàng (Controller Active)",
        roamRssi: -70,
        band5To24Rssi: -82,
        band24To5Rssi: -65,
        chanUtil24: 80,
        chanUtil5: 85,
        showAdvancedPage: false,
        demoAgentConnected: false
      },
      security: {
        spiEnabled: true,
        spiLevel: "Trung bình",
        parentalRules: []
      },
      apps: {
        dmz: {
          enabled: false,
          wan: "1_INTERNET_R_VID_35",
          hostIp: ""
        },
        portForwarding: [],
        sessionLimit: {
          enabled: true,
          systemMax: 16384,
          defaultPerIp: 8000,
          rules: []
        },
        staticRoutes: [],
        ddns: {
          enabled: false,
          provider: "DynDNS.org",
          mode: "Tự động",
          hostname: "",
          username: "",
          password: ""
        },
        wifiSchedules: [
          {
            id: 1,
            name: "Tat_WiFi_Dem",
            days: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
            start: "01:00",
            end: "05:00",
            enabled: false
          }
        ]
      },
      tools: {
        mirroring: {
          enabled: false,
          direction: "Ingress & Egress (Cả thu và phát)",
          destPort: "LAN2"
        },
        logs: [
          "[SYSTEM] Booting Viettel High Tech vGP-42X6V1 Firmware V1302250508...",
          "[GPON] OLT ZTE detected. Optical Rx Power -21.14 dBm (Class B+ OK).",
          "[OMCI] Auto-provisioned WAN 1_INTERNET_R_VID_35 (VLAN 35, PPPoE, MTU 1492).",
          "[PPP] PPPoE session established. WAN IP: 27.68.142.95.",
          "[WLAN] Wi-Fi 6 Dual-Band AX3000 initialized (MT7916)."
        ]
      },
      simDevices: {
        laptopObs: {
          name: "Laptop-OBS-Admin",
          connMode: "LAN1", // 'LAN1' or 'WIFI'
          mac: "dc:f5:05:88:11:20",
          ip: "192.168.1.3",
          wifiSsid: "VIETTEL_39D5BC"
        },
        phone: {
          name: "Smartphone-Test",
          wifiOn: true,
          connected: true,
          band: "2.4G",
          ssid: "VIETTEL_39D5BC",
          mac: "a4:83:e7:12:34:56",
          ip: "192.168.1.2",
          rssi: -46,
          lastUrl: "fit.hcmus.edu.vn",
          lastBrowserResult: null
        },
        laptopAux: {
          name: "Laptop-Phu",
          connected: false,
          band: "2.4G",
          ssid: "",
          mac: "b8:27:eb:45:90:11",
          ip: "192.168.1.12",
          rssi: -51
        },
        desktopVm: {
          name: "Desktop-VMware-Win10",
          connected: false,
          mac: "00:0c:29:6a:7b:8c",
          ip: "192.168.1.15"
        }
      },
      coach: {
        groupSsid: "24CLC01-N01",
        activeTv: 1,
        labTab: "coach" // 'coach' | 'phone' | 'hw'
      }
    };
  }

  // Family State Before Reset (Scene 1 start: Wi-Fi "LongGiang" with safe demo password)
  function createFamilyPreResetConfig(groupSsid) {
    const st = createFactoryConfig();
    st.device.uptimeSec = 439210; // ~5 days uptime before reset
    st.bandSteering = true;
    st.wifi24.ssids[0].ssid = "LongGiang";
    st.wifi24.ssids[0].key = "GiaDinhDemo2026@";
    st.wifi5.ssids[0].ssid = "LongGiang";
    st.wifi5.ssids[0].key = "GiaDinhDemo2026@";
    st.simDevices.phone.ssid = "LongGiang";
    st.simDevices.phone.band = "5G";
    st.simDevices.phone.connected = true;
    st.simDevices.laptopObs.wifiSsid = "LongGiang";
    if (groupSsid) st.coach.groupSsid = groupSsid;
    st.tools.logs.push("[WLAN] Family Wi-Fi 'LongGiang' active (Band Steering ON).");
    return st;
  }

  function loadInitialState() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed && parsed.device && parsed.wifi24 && parsed.wifi5) {
          return parsed;
        }
      }
    } catch (e) {
      // ignore corrupted storage
    }
    const init = createFamilyPreResetConfig("24CLC01-N01");
    // Save pre-reset backup snapshot automatically so TV6 can always test restore
    try {
      localStorage.setItem(BACKUP_KEY, JSON.stringify(init));
    } catch (e) {}
    return init;
  }

  window.SimState = loadInitialState();

  function saveState() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(window.SimState));
    } catch (e) {}
  }

  function addLog(msg) {
    const ts = formatDateTime(nowRouterDate());
    window.SimState.tools.logs.unshift("[" + ts + "] " + msg);
    if (window.SimState.tools.logs.length > 120) {
      window.SimState.tools.logs.length = 120;
    }
    saveState();
  }

  // Evaluate whether Wi-Fi is currently turned OFF by Wi-Fi Scheduling
  function isWifiScheduledOff() {
    const schedules = window.SimState.apps.wifiSchedules || [];
    const now = nowRouterDate();
    const dayCode = getDayCode(now);
    const curMin = now.getHours() * 60 + now.getMinutes();

    for (const r of schedules) {
      if (!r.enabled) continue;
      if (!r.days || !r.days.includes(dayCode)) continue;
      const [sh, sm] = (r.start || "00:00").split(":").map(Number);
      const [eh, em] = (r.end || "00:00").split(":").map(Number);
      const startM = sh * 60 + sm;
      const endM = eh * 60 + em;
      if (startM <= endM) {
        if (curMin >= startM && curMin < endM) return r;
      } else {
        // Overnight schedule e.g. 23:00 -> 05:00
        if (curMin >= startM || curMin < endM) return r;
      }
    }
    return null;
  }

  // Get all currently broadcast Wi-Fi networks
  function getActiveBroadcastSsids() {
    const st = window.SimState;
    if (isWifiScheduledOff()) return [];
    const list = [];

    if (st.bandSteering) {
      if (st.wifi24.enabled && st.wifi24.ssids[0].enabled) {
        const s = st.wifi24.ssids[0];
        list.push({
          band: "2.4G + 5G (Gộp băng)",
          actualBand: "5G",
          ssid: s.ssid,
          hidden: s.hidden,
          auth: s.auth,
          key: s.key,
          channel: "Auto (Smart)",
          bw: st.wifi5.bandwidth,
          speedMbps: 1201
        });
      }
    } else {
      if (st.wifi24.enabled) {
        for (const s of st.wifi24.ssids) {
          if (s.enabled && s.ssid) {
            const bw24 = st.wifi24.bandwidth === "40 MHz" ? 287 : 144;
            list.push({
              band: "2.4G",
              actualBand: "2.4G",
              ssid: s.ssid,
              hidden: s.hidden,
              auth: s.auth,
              key: s.key,
              channel: st.wifi24.channel === "Auto" ? "Auto (Ch " + st.wifi24.autoCurrentChannel + ")" : "Kênh " + st.wifi24.channel,
              bw: st.wifi24.bandwidth,
              speedMbps: st.wifi24.mode.includes("ax") ? bw24 : 72
            });
          }
        }
      }
      if (st.wifi5.enabled) {
        for (const s of st.wifi5.ssids) {
          if (s.enabled && s.ssid) {
            let spd = 866;
            if (st.wifi5.mode.includes("ax")) {
              if (st.wifi5.bandwidth.includes("160")) spd = 2402;
              else if (st.wifi5.bandwidth.includes("80")) spd = 1201;
              else if (st.wifi5.bandwidth.includes("40")) spd = 574;
              else spd = 287;
            }
            list.push({
              band: "5G",
              actualBand: "5G",
              ssid: s.ssid,
              hidden: s.hidden,
              auth: s.auth,
              key: s.key,
              channel: st.wifi5.channel === "Auto" ? "Auto (Ch " + st.wifi5.autoCurrentChannel + ")" : "Kênh " + st.wifi5.channel,
              bw: st.wifi5.bandwidth,
              speedMbps: spd
            });
          }
        }
      }
    }
    return list;
  }

  // Compute DHCP IP assignment for a MAC address
  function allocateDhcpIpForMac(mac, currentIp) {
    const lan = window.SimState.lan;
    const normMac = (mac || "").toLowerCase().trim();
    // 1. Check Static DHCP Lease table first!
    for (const item of lan.staticLeases) {
      if (item.mac.toLowerCase().trim() === normMac) {
        return item.ip;
      }
    }
    if (!lan.dhcpEnabled) {
      return "169.254.48.12 (Không có DHCP)";
    }
    const prefix = lan.ip.split(".").slice(0, 3).join(".");
    const startOctet = parseInt((lan.dhcpStart || "192.168.1.2").split(".")[3], 10) || 2;
    const endOctet = parseInt((lan.dhcpEnd || "192.168.1.252").split(".")[3], 10) || 252;

    if (lan.randomIp) {
      const rnd = Math.floor(Math.random() * Math.max(1, endOctet - startOctet + 1)) + startOctet;
      return prefix + "." + rnd;
    }

    // Check if currentIp is still valid inside pool and not reserved by someone else
    if (currentIp && currentIp.startsWith(prefix + ".")) {
      const oct = parseInt(currentIp.split(".")[3], 10);
      const reservedByAnyone = lan.staticLeases.some((s) => s.ip === currentIp);
      if (oct >= startOctet && oct <= endOctet && !reservedByAnyone) {
        return currentIp;
      }
    }
    return prefix + "." + startOctet;
  }

  // Reconcile connected Wi-Fi clients whenever Wi-Fi / Schedule / Reset changes
  function reconcileClients() {
    const st = window.SimState;
    const activeNets = getActiveBroadcastSsids();
    const phone = st.simDevices.phone;

    if (!phone.wifiOn) {
      phone.connected = false;
    } else if (phone.connected) {
      const stillExists = activeNets.find((n) => n.ssid === phone.ssid);
      if (!stillExists) {
        phone.connected = false;
      } else {
        phone.band = stillExists.actualBand;
      }
    }

    const aux = st.simDevices.laptopAux;
    if (aux.connected) {
      const match = activeNets.find((n) => n.ssid === aux.ssid);
      if (!match) aux.connected = false;
      else aux.band = match.actualBand;
    }
    saveState();
  }

  // Evaluate Internet access for a given client MAC & target URL (Parental Control + WAN + Fiber)
  function checkClientUrlAccess(mac, rawUrl) {
    const st = window.SimState;
    const phone = st.simDevices.phone;
    if (!phone.wifiOn || !phone.connected) {
      return { ok: false, reason: "Thiết bị chưa kết nối vào mạng Wi-Fi nào!" };
    }
    if (String(phone.ip).includes("169.254")) {
      return { ok: false, reason: "Không nhận được địa chỉ IP (DHCP Server đang Tắt)!" };
    }
    if (st.device.fiberFault) {
      return { ok: false, reason: "Mất tín hiệu quang (Đèn LOS chớp đỏ - Đứt/gập cáp quang)!" };
    }
    const wanInternet = st.wanList.find((w) => w.id.includes("INTERNET"));
    if (!wanInternet || wanInternet.mode === "Bridge") {
      return { ok: false, reason: "Cổng WAN đang ở chế độ Bridge (Modem không quay PPPoE/NAT)!" };
    }

    let domain = (rawUrl || "").trim().toLowerCase();
    domain = domain.replace(/^https?:\/\//, "").split("/")[0];
    if (!domain) domain = "google.com";

    const normMac = (mac || "").toLowerCase().trim();
    const now = nowRouterDate();
    const dayCode = getDayCode(now);
    const curMin = now.getHours() * 60 + now.getMinutes();

    for (const rule of st.security.parentalRules) {
      if (!rule.enabled) continue;
      if (rule.mac.toLowerCase().trim() !== normMac) continue;

      if (rule.policy === "Deny") {
        return {
          ok: false,
          reason: "BỊ CHẶN BỞI ROUTER: Luật Kiểm soát con cái '" + rule.name + "' (Chế độ Deny / MAC Blacklist chặn 24/7)."
        };
      }

      if (rule.policy === "Allow") {
        // Must match at least one active schedule window
        let inSchedule = false;
        for (const sch of rule.schedules || []) {
          if (!sch.enabled) continue;
          if (!sch.days || !sch.days.includes(dayCode)) continue;
          const [sh, sm] = (sch.start || "00:00").split(":").map(Number);
          const [eh, em] = (sch.end || "23:59").split(":").map(Number);
          const sM = sh * 60 + sm;
          const eM = eh * 60 + em;
          if (sM <= eM ? curMin >= sM && curMin <= eM : curMin >= sM || curMin <= eM) {
            inSchedule = true;
            break;
          }
        }
        if (!inSchedule) {
          return {
            ok: false,
            reason:
              "BỊ CHẶN NGOÀI GIỜ: Luật '" +
              rule.name +
              "' (Allow) chỉ cho phép truy cập trong khung giờ đã cấp phép!"
          };
        }
        // Check Block URL
        if (rule.blockUrl) {
          const blockedList = rule.blockUrl
            .toLowerCase()
            .split(/[,;\s]+/)
            .map((x) => x.trim())
            .filter(Boolean);
          for (const b of blockedList) {
            if (domain === b || domain.endsWith("." + b) || domain.includes(b)) {
              return {
                ok: false,
                reason:
                  "BỊ KHÓA TÊN MIỀN (Block URL): Trang '" +
                  domain +
                  "' nằm trong danh sách cấm của luật '" +
                  rule.name +
                  "'!"
              };
            }
          }
        }
      }
    }

    return {
      ok: true,
      domain: domain,
      reason: "Truy cập thành công https://" + domain + " (200 OK - Độ trễ ~14ms qua WAN PPPoE VLAN 35)."
    };
  }

  // Perform Factory Reset (saves pre-reset snapshot for Undo button #3!)
  function performFactoryReset(sourceLabel) {
    const prevGroup = (window.SimState.coach && window.SimState.coach.groupSsid) || "24CLC01-N01";
    const prevTv = (window.SimState.coach && window.SimState.coach.activeTv) || 1;
    const prevConnMode = window.SimState.simDevices.laptopObs.connMode;

    try {
      localStorage.setItem(SNAPSHOT_KEY, JSON.stringify(window.SimState));
    } catch (e) {}

    const fresh = createFactoryConfig();
    fresh.coach.groupSsid = prevGroup;
    fresh.coach.activeTv = prevTv;
    fresh.simDevices.laptopObs.connMode = prevConnMode;
    // Phone loses old 'LongGiang' Wi-Fi until user connects to VIETTEL_39D5BC (just like real reset!)
    fresh.simDevices.phone.connected = false;
    fresh.simDevices.phone.ssid = "";

    window.SimState = fresh;
    addLog("[RESET] Khôi phục cài đặt gốc xuất xưởng (" + sourceLabel + "). Sóng mặc định: VIETTEL_39D5BC.");
    saveState();
  }

  // Load Scene Preset for TV1..TV6 so any of the 6 teammates can rehearse their exact part immediately!
  function loadTvScenePreset(tvNumber) {
    const grp = (window.SimState.coach && window.SimState.coach.groupSsid) || "24CLC01-N01";
    let st;

    if (tvNumber === 1) {
      // TV1: Starts before Reset with family Wi-Fi "LongGiang"
      st = createFamilyPreResetConfig(grp);
      try {
        localStorage.setItem(BACKUP_KEY, JSON.stringify(st));
      } catch (e) {}
    } else if (tvNumber === 2) {
      // TV2: Right after Hard Reset -> VIETTEL_39D5BC, phone connected dynamically at 192.168.1.2
      st = createFactoryConfig();
      st.coach.groupSsid = grp;
      st.simDevices.phone.connected = true;
      st.simDevices.phone.ssid = "VIETTEL_39D5BC";
      st.simDevices.phone.band = "2.4G";
      st.simDevices.phone.ip = "192.168.1.2";
    } else if (tvNumber === 3) {
      // TV3: TV2 finished DHCP pool .10-.200 + Static IP .150; Band Steering currently ON or ready to uncheck
      st = createFactoryConfig();
      st.coach.groupSsid = grp;
      st.lan.dhcpStart = "192.168.1.10";
      st.lan.dhcpEnd = "192.168.1.200";
      st.lan.staticLeases = [{ ip: "192.168.1.150", mac: "a4:83:e7:12:34:56" }];
      st.simDevices.phone.connected = true;
      st.simDevices.phone.ssid = "VIETTEL_39D5BC";
      st.simDevices.phone.ip = "192.168.1.150";
      st.bandSteering = false;
    } else if (tvNumber === 4) {
      // TV4: TV3 finished 2.4GHz (<SSID_NHOM> + <SSID_NHOM>_Guest), now TV4 configures 5GHz 160MHz + Mesh + 3 devices
      st = createFactoryConfig();
      st.coach.groupSsid = grp;
      st.lan.dhcpStart = "192.168.1.10";
      st.lan.dhcpEnd = "192.168.1.200";
      st.lan.staticLeases = [{ ip: "192.168.1.150", mac: "a4:83:e7:12:34:56" }];
      st.wifi24.channel = "6";
      st.wifi24.bandwidth = "20 MHz";
      st.wifi24.maxSta = 20;
      st.wifi24.ssids[0] = { idx: 1, enabled: true, ssid: grp, hidden: false, auth: "WPA2-PSK/WPA3-SAE", enc: "AES", key: "NhomWLAN2026@" };
      st.wifi24.ssids[1] = { idx: 2, enabled: true, ssid: grp + "_Guest", hidden: false, auth: "WPA2-PSK", enc: "AES", key: "Khach12345@" };
      st.simDevices.phone.connected = true;
      st.simDevices.phone.band = "2.4G";
      st.simDevices.phone.ssid = grp;
      st.simDevices.phone.ip = "192.168.1.150";
      st.simDevices.laptopAux.connected = true;
      st.simDevices.laptopAux.band = "2.4G";
      st.simDevices.laptopAux.ssid = grp;
      st.simDevices.laptopAux.ip = "192.168.1.12";
      st.simDevices.desktopVm.connected = true;
      st.simDevices.desktopVm.ip = "192.168.1.15";
    } else if (tvNumber === 5) {
      // TV5: 2.4G + 5G configured, Phone on <SSID_NHOM>_5G, Parental Control empty ready for Before -> Deny -> Allow demo
      st = createFactoryConfig();
      st.coach.groupSsid = grp;
      st.lan.dhcpStart = "192.168.1.10";
      st.lan.dhcpEnd = "192.168.1.200";
      st.lan.staticLeases = [{ ip: "192.168.1.150", mac: "a4:83:e7:12:34:56" }];
      st.wifi24.channel = "6";
      st.wifi24.bandwidth = "20 MHz";
      st.wifi24.ssids[0] = { idx: 1, enabled: true, ssid: grp, hidden: false, auth: "WPA2-PSK/WPA3-SAE", enc: "AES", key: "NhomWLAN2026@" };
      st.wifi24.ssids[1] = { idx: 2, enabled: true, ssid: grp + "_Guest", hidden: false, auth: "WPA2-PSK", enc: "AES", key: "Khach12345@" };
      st.wifi5.ssids[0] = { idx: 1, enabled: true, ssid: grp + "_5G", hidden: false, auth: "WPA2-PSK/WPA3-SAE", enc: "AES", key: "NhomWLAN2026@" };
      st.simDevices.phone.connected = true;
      st.simDevices.phone.band = "5G";
      st.simDevices.phone.ssid = grp + "_5G";
      st.simDevices.phone.ip = "192.168.1.150";
      st.security.parentalRules = [];
    } else {
      // TV6: Ready for NTP, Wi-Fi Scheduling, Port Forwarding, DMZ, Diagnostics, and Restore back to LongGiang
      st = createFactoryConfig();
      st.coach.groupSsid = grp;
      st.lan.dhcpStart = "192.168.1.10";
      st.lan.dhcpEnd = "192.168.1.200";
      st.lan.staticLeases = [{ ip: "192.168.1.150", mac: "a4:83:e7:12:34:56" }];
      st.wifi24.channel = "6";
      st.wifi24.bandwidth = "20 MHz";
      st.wifi24.ssids[0] = { idx: 1, enabled: true, ssid: grp, hidden: false, auth: "WPA2-PSK/WPA3-SAE", enc: "AES", key: "NhomWLAN2026@" };
      st.wifi5.ssids[0] = { idx: 1, enabled: true, ssid: grp + "_5G", hidden: false, auth: "WPA2-PSK/WPA3-SAE", enc: "AES", key: "NhomWLAN2026@" };
      st.security.spiEnabled = true;
      st.security.spiLevel = "Cao";
      st.simDevices.phone.connected = true;
      st.simDevices.phone.band = "5G";
      st.simDevices.phone.ssid = grp + "_5G";
      st.simDevices.phone.ip = "192.168.1.150";
      // Ensure pre-reset family backup exists in storage for TV6's grand finale restore!
      const fam = createFamilyPreResetConfig(grp);
      try {
        localStorage.setItem(BACKUP_KEY, JSON.stringify(fam));
      } catch (e) {}
    }

    st.coach.activeTv = tvNumber;
    window.SimState = st;
    addLog("[SIMULATOR] Đã nạp trạng thái chuẩn bị cho Phân cảnh Thành viên " + tvNumber + " (TV" + tvNumber + ").");
    saveState();
  }

  window.SimEngine = {
    STORAGE_KEY,
    SNAPSHOT_KEY,
    BACKUP_KEY,
    nowRouterDate,
    formatDateTime,
    getDayCode,
    createFactoryConfig,
    createFamilyPreResetConfig,
    saveState,
    addLog,
    isWifiScheduledOff,
    getActiveBroadcastSsids,
    allocateDhcpIpForMac,
    reconcileClients,
    checkClientUrlAccess,
    performFactoryReset,
    loadTvScenePreset
  };
})();
