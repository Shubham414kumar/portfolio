import { useState } from "react";
import {
  FileText, Shield, BookOpen, Wrench, ExternalLink, Clock, Tag,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useScrollAnimation } from "@/hooks/use-scroll-animation";

/* ------------------------------------------------------------------ */
/*  Write-up data                                                       */
/* ------------------------------------------------------------------ */
type BlogCategory = "CTF Write-up" | "Vulnerability Research" | "Security Guide" | "Tool Review";

interface WriteUp {
  title: string;
  category: BlogCategory;
  date: string;
  readTime: string;
  excerpt: string;
  tags: string[];
  link?: string;
  icon: typeof FileText;
}

const writeups: WriteUp[] = [
  {
    title: "Exploiting IDOR in a Fintech Dashboard — Full Chain PoC",
    category: "Vulnerability Research",
    date: "Jul 2025",
    readTime: "8 min",
    excerpt:
      "Discovered and responsibly disclosed an Insecure Direct Object Reference vulnerability that exposed sensitive financial records. Walk-through of recon, exploitation, and patch verification.",
    tags: ["OWASP", "IDOR", "Burp Suite", "Responsible Disclosure"],
    icon: Shield,
  },
  {
    title: "HackTheBox: Pentesting the 'Fortress' Machine",
    category: "CTF Write-up",
    date: "Jun 2025",
    readTime: "12 min",
    excerpt:
      "Step-by-step write-up of an HTB medium-difficulty box — from initial Nmap enumeration through SQL injection, privilege escalation via misconfigured SUID binaries to root.",
    tags: ["HackTheBox", "SQLi", "PrivEsc", "Linux"],
    icon: FileText,
  },
  {
    title: "Building a Home SOC Lab with Wazuh + ELK on $0 Budget",
    category: "Security Guide",
    date: "May 2025",
    readTime: "15 min",
    excerpt:
      "Complete guide to setting up a production-grade SIEM lab at home using Wazuh, Elasticsearch, Logstash and Kibana — with detection rules mapped to MITRE ATT&CK.",
    tags: ["SIEM", "Wazuh", "ELK", "MITRE ATT&CK"],
    icon: BookOpen,
  },
  {
    title: "Nuclei vs. Nikto vs. ZAP — Which Scanner Wins for VAPT?",
    category: "Tool Review",
    date: "Apr 2025",
    readTime: "10 min",
    excerpt:
      "Head-to-head comparison of three popular vulnerability scanners across speed, accuracy, false-positive rates and reporting. Real-world test results on 5 target apps.",
    tags: ["Nuclei", "Nikto", "OWASP ZAP", "Comparison"],
    icon: Wrench,
  },
  {
    title: "Bypassing WAF Rules with Encoding Tricks — A Red Team Perspective",
    category: "Vulnerability Research",
    date: "Mar 2025",
    readTime: "7 min",
    excerpt:
      "Techniques I used during an engagement to bypass ModSecurity and Cloudflare WAF rules using double URL encoding, Unicode normalization and chunked transfer abuse.",
    tags: ["WAF Bypass", "Red Team", "Encoding", "Web Security"],
    icon: Shield,
  },
  {
    title: "TryHackMe: OWASP Top 10 Path — Key Takeaways",
    category: "CTF Write-up",
    date: "Feb 2025",
    readTime: "9 min",
    excerpt:
      "Notes and key learnings from completing the TryHackMe OWASP Top 10 learning path — including XSS, SSRF, insecure deserialization and broken access control labs.",
    tags: ["TryHackMe", "OWASP", "XSS", "SSRF"],
    icon: FileText,
  },
];

const categories: Array<"All" | BlogCategory> = [
  "All",
  "CTF Write-up",
  "Vulnerability Research",
  "Security Guide",
  "Tool Review",
];

const categoryIcons: Record<BlogCategory, typeof FileText> = {
  "CTF Write-up": FileText,
  "Vulnerability Research": Shield,
  "Security Guide": BookOpen,
  "Tool Review": Wrench,
};

/* ------------------------------------------------------------------ */
/*  Component                                                           */
/* ------------------------------------------------------------------ */
export function BlogWriteups() {
  const [filter, setFilter] = useState<"All" | BlogCategory>("All");
  const { ref, isVisible } = useScrollAnimation({ threshold: 0.08 });

  const filtered =
    filter === "All" ? writeups : writeups.filter((w) => w.category === filter);

  return (
    <section
      id="blog"
      ref={ref}
      className={`py-24 border-t border-border/60 transition-all duration-700 ${
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
      }`}
    >
      <div className="mx-auto max-w-7xl px-6">
        <div className="max-w-2xl">
          <p className="font-mono text-xs text-primary uppercase tracking-widest">
            // blog & write-ups
          </p>
          <h2 className="mt-3 text-3xl md:text-4xl font-bold">
            Security research & write-ups
          </h2>
          <p className="mt-3 text-muted-foreground">
            CTF solutions, vulnerability disclosures, tool reviews and security
            guides — sharing what I learn on the offensive side.
          </p>
        </div>

        {/* Filters */}
        <div className="mt-8 flex flex-wrap gap-2">
          {categories.map((c) => {
            const count =
              c === "All"
                ? writeups.length
                : writeups.filter((w) => w.category === c).length;
            const isActive = filter === c;
            return (
              <button
                key={c}
                onClick={() => setFilter(c)}
                className={`px-4 py-1.5 rounded-full text-sm font-medium border transition-colors ${
                  isActive
                    ? "bg-gradient-red text-primary-foreground border-transparent shadow-red"
                    : "bg-card text-muted-foreground border-border hover:text-foreground hover:border-primary/40"
                }`}
              >
                {c}{" "}
                <span className="font-mono text-xs opacity-70">({count})</span>
              </button>
            );
          })}
        </div>

        {/* Cards */}
        <div className="mt-10 grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((w, i) => {
            const Icon = w.icon;
            return (
              <article
                key={w.title}
                className="group rounded-2xl border border-border bg-gradient-card p-6 hover:border-primary/50 transition-all duration-300 shadow-card hover:shadow-glow flex flex-col"
                style={{ animationDelay: `${i * 80}ms` }}
              >
                {/* Header */}
                <div className="flex items-center gap-2 flex-wrap">
                  <Badge className="bg-primary/10 text-primary border border-primary/30 hover:bg-primary/15">
                    {w.category}
                  </Badge>
                  <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
                    <Clock className="h-3 w-3" />
                    {w.readTime}
                  </span>
                </div>

                {/* Title */}
                <h3 className="mt-3 font-semibold text-lg leading-tight group-hover:text-primary transition-colors flex items-start gap-2">
                  <Icon className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                  {w.title}
                </h3>

                {/* Excerpt */}
                <p className="mt-3 text-sm text-muted-foreground leading-relaxed flex-1">
                  {w.excerpt}
                </p>

                {/* Tags */}
                <div className="mt-4 flex flex-wrap gap-1.5">
                  {w.tags.map((tag) => (
                    <span
                      key={tag}
                      className="font-mono text-[10px] px-2 py-0.5 rounded-md bg-secondary text-foreground/70 border border-border"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                {/* Footer */}
                <div className="mt-4 pt-3 border-t border-border/60 flex items-center justify-between">
                  <span className="text-xs text-muted-foreground flex items-center gap-1">
                    <Tag className="h-3 w-3" />
                    {w.date}
                  </span>
                  <span className="text-xs text-primary font-medium flex items-center gap-1 group-hover:underline cursor-pointer">
                    Read More <ExternalLink className="h-3 w-3" />
                  </span>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
