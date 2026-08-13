import { useState, useRef, useEffect, useCallback, type KeyboardEvent } from "react";
import { Terminal as TerminalIcon, ChevronRight } from "lucide-react";
import { useScrollAnimation } from "@/hooks/use-scroll-animation";

/* ------------------------------------------------------------------ */
/*  Command registry                                                    */
/* ------------------------------------------------------------------ */
const COMMANDS: Record<string, { output: string[]; color?: string }> = {
  help: {
    output: [
      "╔══════════════════════════════════════════════════╗",
      "║  Available Commands                              ║",
      "╠══════════════════════════════════════════════════╣",
      "║  whoami        → About Shubham                  ║",
      "║  skills        → Technical skillset             ║",
      "║  projects      → Featured projects              ║",
      "║  certs         → Certifications                 ║",
      "║  experience    → Work timeline                  ║",
      "║  contact       → Get in touch                   ║",
      "║  social        → Social links                   ║",
      "║  clear         → Clear terminal                 ║",
      "║  sudo hire-me  → 😏                             ║",
      "╚══════════════════════════════════════════════════╝",
    ],
  },
  whoami: {
    output: [
      "┌─ Identity ─────────────────────────────────────────┐",
      "│  Name      : Shubham                               │",
      "│  Role      : Cybersecurity Engineer & Pentester     │",
      "│  Location  : Begusarai, Bihar, India                │",
      "│  Education : B.Tech CS @ BEU, Patna (GPA 7.5)      │",
      "│  Focus     : Pentesting · VAPT · SOC Analytics      │",
      "│  Status    : Available for engagements 🟢           │",
      "└────────────────────────────────────────────────────┘",
      "",
      "  I break systems so attackers can't.",
      "  Cybersecurity engineer specialising in Penetration",
      "  Testing, VAPT and SOC Analytics — with a software",
      "  engineering backbone.",
    ],
  },
  skills: {
    output: [
      "┌─ Offensive Security ──────────────────────┐",
      "│  Web App Pentesting (OWASP)     ██████████ 92%  │",
      "│  Network Pentesting             █████████░ 88%  │",
      "│  Burp Suite / Nmap / Metasploit ██████████ 90%  │",
      "├─ VAPT ────────────────────────────────────┤",
      "│  Vulnerability Assessment       ██████████ 90%  │",
      "│  Nessus / OpenVAS               █████████░ 85%  │",
      "│  Reporting & Remediation        █████████░ 88%  │",
      "├─ SOC Analytics ───────────────────────────┤",
      "│  SIEM (Splunk / ELK / Wazuh)    █████████░ 86%  │",
      "│  Incident Response              ████████░░ 84%  │",
      "│  Threat Hunting                 ████████░░ 82%  │",
      "├─ Software Engineering ────────────────────┤",
      "│  Python / Node.js / TypeScript  ██████████ 90%  │",
      "│  React / Next.js                █████████░ 85%  │",
      "│  REST APIs & Microservices      ████████░░ 82%  │",
      "└───────────────────────────────────────────┘",
    ],
  },
  projects: {
    output: [
      "  [01]  RedRecon          → Automated recon framework for pentesters",
      "  [02]  SIEM-Lite         → Lightweight SIEM on ELK + Wazuh",
      "  [03]  VaultKey          → Zero-knowledge password manager",
      "  [04]  PhishNet          → Phishing domain intelligence platform",
      "  [05]  ADAudit-X         → AD attack-path visualiser",
      "  [06]  WebVAPT Toolkit   → Modular web-app VAPT toolkit",
      "",
      "  Type 'help' for more commands or scroll to Projects section ↓",
    ],
  },
  certs: {
    output: [
      "  🏅  Ethical Hacking Bootcamp       — PhysicsWallah (2026)",
      "  🏅  Cisco Networking Course         — Cisco Academy (2026)",
      "  🏅  CC2 Certification               — Cisco (2026)",
      "  🏅  Cyber Security Job Simulation   — Deloitte / Forage (2025)",
      "  🏅  DCSC Certification              — DROP Organization (2025)",
      "  🏅  Ethical Hacking Training        — DROP Organization (2024-25)",
    ],
  },
  experience: {
    output: [
      "  2025–Now   Ethical Hacking Trainer & Freelance Pentester",
      "             Independent · Workshops & Consulting",
      "",
      "  Feb–May 25 Cybersecurity Student (Intern)",
      "             The DROP Organization · Begusarai",
      "",
      "  July 2024  Cybersecurity Workshop Participant",
      "             DROP Organization · West Bengal",
      "",
      "  2023–Now   B.Tech Computer Science",
      "             Bihar Engineering University, Patna",
    ],
  },
  contact: {
    output: [
      "  ┌─ Contact Info ──────────────────────────────┐",
      "  │  📧  shubhammrdm394@gmail.com               │",
      "  │  📞  +91 9576433648                          │",
      "  │  📍  Begusarai, Bihar, India                 │",
      "  │                                              │",
      "  │  Scroll to the Contact section below ↓       │",
      "  │  or email me directly!                       │",
      "  └──────────────────────────────────────────────┘",
    ],
  },
  social: {
    output: [
      "  🔗  GitHub    → github.com/Shubham414kumar",
      "  🔗  LinkedIn  → linkedin.com/in/shubham-kumar-6086b32a8",
      "  📧  Email     → shubhammrdm394@gmail.com",
    ],
  },
  "sudo hire-me": {
    output: [
      "",
      "  ╔══════════════════════════════════════════╗",
      "  ║                                          ║",
      "  ║   ✅ Access Granted!                     ║",
      "  ║                                          ║",
      "  ║   Shubham is ready to work with you.     ║",
      "  ║   Scroll down to the Contact section     ║",
      "  ║   or drop an email!                      ║",
      "  ║                                          ║",
      "  ║   📧 shubhammrdm394@gmail.com            ║",
      "  ║                                          ║",
      "  ╚══════════════════════════════════════════╝",
      "",
    ],
    color: "text-emerald-400",
  },
  "sudo rm -rf /": {
    output: [
      "  ⚠️  Nice try, script kiddie. 😏",
      "  This terminal is sandboxed. No root for you.",
      "",
      "  Try 'sudo hire-me' instead!",
    ],
    color: "text-amber-400",
  },
  hack: {
    output: [
      "  🔓 That's literally my job.",
      "  But ethically, of course. 😉",
      "",
      "  Type 'projects' to see what I've built.",
    ],
    color: "text-primary",
  },
  ls: {
    output: [
      "  drwxr-xr-x  skills/",
      "  drwxr-xr-x  projects/",
      "  drwxr-xr-x  certifications/",
      "  -rw-r--r--  resume.pdf",
      "  -rw-r--r--  README.md",
    ],
  },
  pwd: {
    output: ["  /home/shubham/portfolio"],
  },
  cat: {
    output: [
      "  Usage: cat <filename>",
      "  Try 'whoami' or 'skills' instead.",
    ],
  },
  date: {
    output: [`  ${new Date().toString()}`],
  },
  neofetch: {
    output: [
      "         ██████████           shubham@portfolio",
      "       ██          ██         ─────────────────",
      "     ██   ████████   ██       OS: Kali Linux (just kidding 😉)",
      "    ██  ██        ██  ██      Host: Cybersecurity Portfolio v2.0",
      "    ██  ██  ████  ██  ██      Kernel: React + TanStack Start",
      "    ██  ██  ████  ██  ██      Shell: Interactive Hacker Terminal",
      "    ██  ██        ██  ██      Theme: Dark Cyber Red",
      "     ██   ████████   ██       Skills: Pentesting, VAPT, SOC",
      "       ██          ██         Status: Available for hire 🟢",
      "         ██████████",
    ],
    color: "text-primary",
  },
};

type HistoryEntry = {
  command: string;
  output: string[];
  color?: string;
};

/* ------------------------------------------------------------------ */
/*  Terminal Component                                                  */
/* ------------------------------------------------------------------ */
export function HackerTerminal() {
  const { ref: sectionRef, isVisible } = useScrollAnimation({ threshold: 0.1 });
  const [input, setInput] = useState("");
  const [history, setHistory] = useState<HistoryEntry[]>([
    {
      command: "",
      output: [
        "  ╔══════════════════════════════════════════════════╗",
        "  ║  Shubham's Interactive Terminal v2.0             ║",
        "  ║  Type 'help' to see available commands           ║",
        "  ╚══════════════════════════════════════════════════╝",
        "",
      ],
      color: "text-primary",
    },
  ]);
  const [cmdHistory, setCmdHistory] = useState<string[]>([]);
  const [cmdIndex, setCmdIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  // auto-scroll to bottom
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [history]);

  const execute = useCallback((cmd: string) => {
    const trimmed = cmd.trim().toLowerCase();

    if (trimmed === "clear") {
      setHistory([]);
      return;
    }

    const match = COMMANDS[trimmed];
    if (match) {
      setHistory((h) => [
        ...h,
        { command: cmd, output: match.output, color: match.color },
      ]);
    } else if (trimmed === "") {
      setHistory((h) => [...h, { command: "", output: [] }]);
    } else {
      setHistory((h) => [
        ...h,
        {
          command: cmd,
          output: [
            `  bash: ${trimmed}: command not found`,
            "  Type 'help' for available commands.",
          ],
          color: "text-amber-400",
        },
      ]);
    }

    if (trimmed) {
      setCmdHistory((prev) => [...prev, trimmed]);
    }
    setCmdIndex(-1);
  }, []);

  const handleKey = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      execute(input);
      setInput("");
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      if (cmdHistory.length === 0) return;
      const newIdx = cmdIndex === -1 ? cmdHistory.length - 1 : Math.max(0, cmdIndex - 1);
      setCmdIndex(newIdx);
      setInput(cmdHistory[newIdx]);
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      if (cmdIndex === -1) return;
      const newIdx = cmdIndex + 1;
      if (newIdx >= cmdHistory.length) {
        setCmdIndex(-1);
        setInput("");
      } else {
        setCmdIndex(newIdx);
        setInput(cmdHistory[newIdx]);
      }
    }
  };

  return (
    <section
      ref={sectionRef}
      className={`py-24 border-t border-border/60 transition-all duration-700 ${
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
      }`}
    >
      <div className="mx-auto max-w-4xl px-6">
        <div className="max-w-2xl">
          <p className="font-mono text-xs text-primary uppercase tracking-widest">
            // interactive terminal
          </p>
          <h2 className="mt-3 text-3xl md:text-4xl font-bold">
            Try it yourself
          </h2>
          <p className="mt-3 text-muted-foreground">
            Type commands below to explore my profile — just like a real
            terminal.
          </p>
        </div>

        {/* Terminal window */}
        <div className="mt-10 rounded-2xl border border-primary/30 bg-card overflow-hidden shadow-glow">
          {/* Chrome bar */}
          <div className="h-9 bg-card/90 border-b border-border backdrop-blur flex items-center px-4 gap-2">
            <span className="h-3 w-3 rounded-full bg-red-500/80" />
            <span className="h-3 w-3 rounded-full bg-amber-500/80" />
            <span className="h-3 w-3 rounded-full bg-emerald-500/80" />
            <span className="ml-auto font-mono text-[11px] text-muted-foreground flex items-center gap-1.5">
              <TerminalIcon className="h-3.5 w-3.5" />
              root@shubham:~$
            </span>
          </div>

          {/* Terminal body */}
          <div
            ref={scrollRef}
            className="p-4 md:p-6 h-[360px] overflow-y-auto font-mono text-sm leading-relaxed"
            onClick={() => inputRef.current?.focus()}
          >
            {history.map((entry, i) => (
              <div key={i} className="mb-3">
                {entry.command && (
                  <div className="flex items-center gap-2 text-foreground/80">
                    <span className="text-primary">$</span>
                    <span>{entry.command}</span>
                  </div>
                )}
                {entry.output.map((line, j) => (
                  <div
                    key={j}
                    className={`whitespace-pre ${entry.color || "text-foreground/70"}`}
                  >
                    {line}
                  </div>
                ))}
              </div>
            ))}

            {/* Input line */}
            <div className="flex items-center gap-2">
              <span className="text-primary">$</span>
              <div className="relative flex-1">
                <input
                  ref={inputRef}
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKey}
                  className="w-full bg-transparent outline-none text-foreground caret-primary font-mono text-sm"
                  autoFocus
                  spellCheck={false}
                  autoComplete="off"
                  aria-label="Terminal input"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Quick command buttons */}
        <div className="mt-4 flex flex-wrap gap-2">
          {["help", "whoami", "skills", "projects", "neofetch"].map((cmd) => (
            <button
              key={cmd}
              onClick={() => {
                execute(cmd);
                inputRef.current?.focus();
              }}
              className="font-mono text-xs px-3 py-1.5 rounded-lg border border-border bg-card text-muted-foreground hover:text-primary hover:border-primary/40 transition-colors"
            >
              <ChevronRight className="h-3 w-3 inline mr-1" />
              {cmd}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
