import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import {
  Shield, Terminal, Code2, Bug, Lock, Eye, Server, Cpu,
  Github, Linkedin, Mail, ExternalLink, ChevronRight, Menu, X,
  Radar, KeyRound, ShieldCheck, Network, Award, GraduationCap, MapPin, Phone, BookOpen, Briefcase,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ThemeToggle } from "@/components/theme-toggle";
import { ContactForm } from "@/components/contact-form";
import { Testimonials } from "@/components/testimonials";
import { initAnalytics, track } from "@/lib/analytics";
import heroImage from "@/assets/hero-shubham.jpg";
import { CinematicOps, MatrixRain } from "@/components/cinematic-ops";
import { HackerTerminal } from "@/components/hacker-terminal";
import { BlogWriteups } from "@/components/blog-writeups";
import { BackToTop } from "@/components/back-to-top";
import { AnimatedCounter } from "@/components/animated-counter";
import { useScrollAnimation } from "@/hooks/use-scroll-animation";

const SOCIALS = {
  github: "https://github.com/Shubham414kumar",
  linkedin: "https://www.linkedin.com/in/shubham-kumar-6086b32a8",
  email: "mailto:shubhammrdm394@gmail.com",
  resume: "/resume.pdf",
};

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Shubham — Cybersecurity Engineer & Pentester" },
      { name: "description", content: "Portfolio of Shubham — Penetration Tester, VAPT specialist, SOC Analyst and Software Engineer." },
      { property: "og:title", content: "Shubham — Cybersecurity Engineer & Pentester" },
      { property: "og:description", content: "VAPT · SOC Analytics · Offensive Security · Software Engineering." },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "/" },
    ],
    links: [
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      { rel: "stylesheet", href: "https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;600;700&family=Inter:wght@400;500;600&family=JetBrains+Mono:wght@400;500&display=swap" },
    ],
  }),
  component: Portfolio,
});

const nav = [
  { label: "Home", href: "#home" },
  { label: "About", href: "#about" },
  { label: "Skills", href: "#skills" },
  { label: "Projects", href: "#projects" },
  { label: "Blog", href: "#blog" },
  { label: "Experience", href: "#experience" },
  { label: "Contact", href: "#contact" },
];

function Portfolio() {
  const [open, setOpen] = useState(false);
  const [typed, setTyped] = useState("");
  const roles = ["Penetration Tester", "SOC Analyst", "VAPT Specialist", "Software Engineer", "Ethical Hacking Trainer"];
  const [roleIdx, setRoleIdx] = useState(0);
  const [filter, setFilter] = useState<FilterCategory>("All");
  const [activeProject, setActiveProject] = useState<Project | null>(null);

  // Scroll animation refs for each section
  const aboutAnim = useScrollAnimation({ threshold: 0.1 });
  const skillsAnim = useScrollAnimation({ threshold: 0.08 });
  const projectsAnim = useScrollAnimation({ threshold: 0.08 });
  const certsAnim = useScrollAnimation({ threshold: 0.08 });
  const eduAnim = useScrollAnimation({ threshold: 0.1 });
  const expAnim = useScrollAnimation({ threshold: 0.08 });
  const contactAnim = useScrollAnimation({ threshold: 0.1 });

  useEffect(() => {
    const cleanup = initAnalytics();
    return cleanup;
  }, []);


  useEffect(() => {
    const current = roles[roleIdx];
    let i = 0;
    setTyped("");
    const t = setInterval(() => {
      i++;
      setTyped(current.slice(0, i));
      if (i >= current.length) {
        clearInterval(t);
        setTimeout(() => setRoleIdx((r) => (r + 1) % roles.length), 1800);
      }
    }, 70);
    return () => clearInterval(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [roleIdx]);

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* NAV */}
      <header className="fixed top-0 inset-x-0 z-50 backdrop-blur-md bg-background/70 border-b border-border/60">
        <div className="mx-auto max-w-7xl px-6 h-16 flex items-center justify-between">
          <a href="#home" className="flex items-center gap-2 font-display font-bold text-lg">
            <Shield className="h-5 w-5 text-primary" />
            <span>Shubham<span className="text-primary">.</span></span>
          </a>
          <nav className="hidden md:flex items-center gap-8 text-sm">
            {nav.map((n) => (
              <a key={n.href} href={n.href} className="text-muted-foreground hover:text-foreground transition-colors">
                {n.label}
              </a>
            ))}
          </nav>
          <div className="hidden md:flex items-center gap-2">
            <a href={SOCIALS.github} target="_blank" rel="noreferrer" aria-label="GitHub"
              className="h-9 w-9 grid place-items-center rounded-md border border-border text-muted-foreground hover:text-primary hover:border-primary/50 transition-colors">
              <Github className="h-4 w-4" />
            </a>
            <a href={SOCIALS.linkedin} target="_blank" rel="noreferrer" aria-label="LinkedIn"
              className="h-9 w-9 grid place-items-center rounded-md border border-border text-muted-foreground hover:text-primary hover:border-primary/50 transition-colors">
              <Linkedin className="h-4 w-4" />
            </a>
            <a href={SOCIALS.email} aria-label="Email"
              className="h-9 w-9 grid place-items-center rounded-md border border-border text-muted-foreground hover:text-primary hover:border-primary/50 transition-colors">
              <Mail className="h-4 w-4" />
            </a>
            <ThemeToggle />
            <Button asChild size="sm" className="bg-gradient-red text-primary-foreground shadow-red hover:opacity-90 ml-1">
              <a href="#contact">Hire Me</a>
            </Button>
          </div>
          <div className="md:hidden flex items-center gap-2">
            <ThemeToggle />
            <button className="text-foreground" onClick={() => setOpen((o) => !o)} aria-label="menu">
              {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
        {open && (
          <div className="md:hidden border-t border-border/60 bg-background/95">
            <div className="px-6 py-4 flex flex-col gap-4">
              {nav.map((n) => (
                <a key={n.href} href={n.href} onClick={() => setOpen(false)} className="text-sm text-muted-foreground hover:text-foreground">
                  {n.label}
                </a>
              ))}
              <Button asChild size="sm" className="bg-gradient-red text-primary-foreground">
                <a href="#contact">Hire Me</a>
              </Button>
            </div>
          </div>
        )}
      </header>

      {/* HERO */}
      <section id="home" className="relative pt-16 overflow-hidden">
        <div className="absolute inset-0 -z-10">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-background to-background" />
          <MatrixRain className="absolute inset-0 w-full h-full" opacity={0.22} />
          <div className="absolute inset-0 opacity-[0.06]" style={{
            backgroundImage: "linear-gradient(var(--color-foreground) 1px, transparent 1px), linear-gradient(90deg, var(--color-foreground) 1px, transparent 1px)",
            backgroundSize: "48px 48px",
          }} />
        </div>
        <div className="mx-auto max-w-7xl px-6 py-20 md:py-28 grid md:grid-cols-2 gap-12 items-center">
          <div>
            <Badge className="bg-primary/10 text-primary border border-primary/30 hover:bg-primary/15">
              <span className="mr-2 h-2 w-2 rounded-full bg-primary animate-pulse inline-block" />
              Available for engagements
            </Badge>
            <h1 className="mt-6 text-4xl md:text-6xl font-bold leading-[1.05]">
              Hi, I'm <span className="text-gradient-red">Shubham</span>
              <br />
              <span className="font-mono text-2xl md:text-3xl text-foreground/90">
                {typed}
                <span className="animate-blink text-primary">_</span>
              </span>
            </h1>
            <p className="mt-6 text-base md:text-lg text-muted-foreground max-w-xl">
              I break systems so attackers can't. Cybersecurity engineer specialising in
              Penetration Testing, VAPT and SOC Analytics — with a software engineering
              backbone that ships secure, scalable applications.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button asChild size="lg" className="bg-gradient-red text-primary-foreground shadow-red hover:opacity-90">
                <a href="#projects">View My Work <ChevronRight className="ml-1 h-4 w-4" /></a>
              </Button>
              <Button asChild size="lg" variant="outline" className="border-border">
                <a href="#contact">Contact Me</a>
              </Button>
              <Button asChild size="lg" variant="ghost" className="text-muted-foreground hover:text-foreground">
                <a href={SOCIALS.resume} download>Download Resume</a>
              </Button>
            </div>
            <div className="mt-8 flex items-center gap-4 text-muted-foreground">
              <a href={SOCIALS.github} target="_blank" rel="noreferrer" aria-label="GitHub" className="hover:text-primary transition-colors"><Github className="h-5 w-5" /></a>
              <a href={SOCIALS.linkedin} target="_blank" rel="noreferrer" aria-label="LinkedIn" className="hover:text-primary transition-colors"><Linkedin className="h-5 w-5" /></a>
              <a href={SOCIALS.email} aria-label="Email" className="hover:text-primary transition-colors"><Mail className="h-5 w-5" /></a>
            </div>
          </div>
          <div className="relative animate-float">
            <div className="absolute -inset-8 bg-gradient-red rounded-[2rem] blur-[60px] opacity-30 animate-pulse-glow" />
            <div className="relative rounded-3xl overflow-hidden border border-primary/30 shadow-glow bg-card">
              {/* Terminal window chrome */}
              <div className="absolute top-0 inset-x-0 h-7 bg-card/90 border-b border-border backdrop-blur flex items-center px-3 gap-1.5 z-20">
                <span className="h-2.5 w-2.5 rounded-full bg-red-500/80" />
                <span className="h-2.5 w-2.5 rounded-full bg-amber-500/80" />
                <span className="h-2.5 w-2.5 rounded-full bg-emerald-500/80" />
                <span className="ml-auto font-mono text-[10px] text-muted-foreground">root@kali:~# portfolio.sh</span>
              </div>
              <img src={heroImage} alt="Shubham — cybersecurity engineer" width={1280} height={960} className="w-full h-full object-cover pt-7" />
              {/* Corner brackets */}
              <div className="absolute top-7 left-0 w-5 h-5 border-t-2 border-l-2 border-primary/70 z-10" />
              <div className="absolute top-7 right-0 w-5 h-5 border-t-2 border-r-2 border-primary/70 z-10" />
              <div className="absolute bottom-0 left-0 w-5 h-5 border-b-2 border-l-2 border-primary/70 z-10" />
              <div className="absolute bottom-0 right-0 w-5 h-5 border-b-2 border-r-2 border-primary/70 z-10" />
              <div className="absolute inset-0 bg-gradient-to-t from-background/70 via-transparent to-transparent pointer-events-none" />
              <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute inset-x-0 h-20 bg-gradient-to-b from-primary/20 to-transparent animate-scan" />
              </div>
              {/* CRT subtle scanline overlay */}
              <div className="absolute inset-0 pointer-events-none opacity-[0.03]" style={{
                backgroundImage: "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,0.1) 2px, rgba(255,255,255,0.1) 4px)"
              }} />
              <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between font-mono text-xs z-10">
                <span className="px-2 py-1 rounded bg-background/80 border border-border flex items-center gap-1.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  $ whoami
                </span>
                <span className="px-2 py-1 rounded bg-primary/20 text-primary border border-primary/40 animate-flicker">SECURE</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CINEMATIC LIVE OPS */}
      <CinematicOps />

      {/* INTERACTIVE TERMINAL */}
      <HackerTerminal />

      {/* ABOUT */}
      <section
        id="about"
        ref={aboutAnim.ref}
        className={`py-24 border-t border-border/60 transition-all duration-700 ${aboutAnim.isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
      >
        <div className="mx-auto max-w-7xl px-6 grid md:grid-cols-3 gap-10">
          <div>
            <p className="font-mono text-xs text-primary uppercase tracking-widest">// about</p>
            <h2 className="mt-3 text-3xl md:text-4xl font-bold">Offense informs defense.</h2>
          </div>
          <div className="md:col-span-2 space-y-4 text-muted-foreground text-base md:text-lg leading-relaxed">
            <p>
              I'm Shubham — a B.Tech Computer Science student at Bihar Engineering University
              and a cybersecurity practitioner who moves between the red and blue teams. I run
              penetration tests, vulnerability assessments (VAPT) and SOC analytics, and I've
              trained under The DROP Organization, PhysicsWallah's Ethical Hacking Bootcamp,
              Cisco Networking Academy and Deloitte's Cyber Job Simulation.
            </p>
            <p>
              I also teach cybersecurity — breaking down offensive security, OWASP Top 10 and
              incident response for students and workshop cohorts — because the fastest way to
              harden the internet is to grow more defenders.
            </p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4">
              <AnimatedCounter end={15} label="Vulnerabilities Found" />
              <AnimatedCounter end={50} label="Trainees Mentored" />
              <AnimatedCounter end={5} label="Certifications" />
              <AnimatedCounter end={3} label="Internships" />
            </div>
            <div className="flex flex-wrap gap-4 pt-2 text-sm text-muted-foreground">
              <span className="inline-flex items-center gap-1.5"><MapPin className="h-4 w-4 text-primary" /> Begusarai, Bihar, India</span>
              <span className="inline-flex items-center gap-1.5"><Phone className="h-4 w-4 text-primary" /> +91 9576433648</span>
              <span className="inline-flex items-center gap-1.5"><Mail className="h-4 w-4 text-primary" /> shubhammrdm394@gmail.com</span>
            </div>
          </div>
        </div>
      </section>

      {/* SKILLS */}
      <section
        id="skills"
        ref={skillsAnim.ref}
        className={`py-24 border-t border-border/60 transition-all duration-700 ${skillsAnim.isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
      >
        <div className="mx-auto max-w-7xl px-6">
          <div className="max-w-2xl">
            <p className="font-mono text-xs text-primary uppercase tracking-widest">// skills</p>
            <h2 className="mt-3 text-3xl md:text-4xl font-bold">Arsenal & expertise</h2>
            <p className="mt-3 text-muted-foreground">The tools, tactics and stacks I use across offensive security, defence and engineering.</p>
          </div>
          <div className="mt-12 grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {skillGroups.map((g) => (
              <div key={g.title} className="rounded-2xl border border-border bg-gradient-card p-6 hover:border-primary/50 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-lg bg-primary/10 border border-primary/30 flex items-center justify-center text-primary">
                    <g.icon className="h-5 w-5" />
                  </div>
                  <h3 className="font-semibold">{g.title}</h3>
                </div>
                <div className="mt-5 space-y-3">
                  {g.items.map((it) => (
                    <div key={it.name}>
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-foreground/80">{it.name}</span>
                        <span className="text-muted-foreground font-mono">{it.level}%</span>
                      </div>
                      <div className="h-1.5 rounded-full bg-secondary overflow-hidden">
                        <div className="h-full bg-gradient-red rounded-full" style={{ width: `${it.level}%` }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PROJECTS */}
      <section
        id="projects"
        ref={projectsAnim.ref}
        className={`py-24 border-t border-border/60 transition-all duration-700 ${projectsAnim.isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
      >
        <div className="mx-auto max-w-7xl px-6">
          <div className="max-w-2xl">
            <p className="font-mono text-xs text-primary uppercase tracking-widest">// projects</p>
            <h2 className="mt-3 text-3xl md:text-4xl font-bold">Work that speaks for itself</h2>
            <p className="mt-3 text-muted-foreground">Selected engagements and open-source tools across security research and engineering.</p>
          </div>
          <div className="mt-8 flex flex-wrap gap-2">
            {projectCategories.map((c) => {
              const count = c === "All" ? projects.length : projects.filter((p) => p.category === c).length;
              const isActive = filter === c;
              return (
                <button
                  key={c}
                  onClick={() => {
                    setFilter(c);
                    track("filter_projects", { category: c });
                  }}
                  className={`px-4 py-1.5 rounded-full text-sm font-medium border transition-colors ${
                    isActive
                      ? "bg-gradient-red text-primary-foreground border-transparent shadow-red"
                      : "bg-card text-muted-foreground border-border hover:text-foreground hover:border-primary/40"
                  }`}
                >
                  {c} <span className="font-mono text-xs opacity-70">({count})</span>
                </button>
              );
            })}
          </div>

          <div className="mt-10 space-y-6">
            {projects
              .filter((p) => filter === "All" || p.category === filter)
              .map((p) => (
                <article
                  key={p.title}
                  className="group rounded-2xl border border-border bg-gradient-card p-6 md:p-8 hover:border-primary/50 transition-colors shadow-card cursor-pointer"
                  onClick={() => {
                    setActiveProject(p);
                    track("open_project", { project: p.title });
                  }}
                >
                  <div className="flex items-start justify-between gap-4 flex-wrap">
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <Badge className="bg-primary/10 text-primary border border-primary/30 hover:bg-primary/15">
                          {p.tag}
                        </Badge>
                        <Badge variant="outline" className="border-border text-muted-foreground">
                          {p.category}
                        </Badge>
                      </div>
                      <h3 className="mt-3 text-xl md:text-2xl font-bold flex items-center gap-2">
                        <p.icon className="h-5 w-5 text-primary" />
                        {p.title}
                      </h3>
                    </div>
                    <div className="flex gap-2" onClick={(e) => e.stopPropagation()}>
                      <Button asChild size="sm" variant="outline" className="border-border">
                        <a
                          href="#"
                          onClick={() => track("project_code_click", { project: p.title })}
                        >
                          <Github className="h-4 w-4 mr-1" /> Code
                        </a>
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => {
                          setActiveProject(p);
                          track("open_project", { project: p.title, source: "details_btn" });
                        }}
                      >
                        <ExternalLink className="h-4 w-4 mr-1" /> Details
                      </Button>
                    </div>
                  </div>
                  <p className="mt-4 text-muted-foreground max-w-3xl">{p.description}</p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {p.stack.map((s) => (
                      <span
                        key={s}
                        className="font-mono text-xs px-2.5 py-1 rounded-md bg-secondary text-foreground/80 border border-border"
                      >
                        {s}
                      </span>
                    ))}
                  </div>
                </article>
              ))}
          </div>
        </div>
      </section>

      {/* CERTIFICATIONS */}
      <section
        id="certifications"
        ref={certsAnim.ref}
        className={`py-24 border-t border-border/60 transition-all duration-700 ${certsAnim.isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
      >
        <div className="mx-auto max-w-7xl px-6">
          <div className="max-w-2xl">
            <p className="font-mono text-xs text-primary uppercase tracking-widest">// certifications</p>
            <h2 className="mt-3 text-3xl md:text-4xl font-bold">Certifications & training</h2>
            <p className="mt-3 text-muted-foreground">Formal training and industry certifications backing the hands-on work.</p>
          </div>
          <div className="mt-12 grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {certifications.map((c) => (
              <div key={c.title} className="rounded-2xl border border-border bg-gradient-card p-6 hover:border-primary/50 transition-colors">
                <div className="flex items-start gap-3">
                  <div className="h-10 w-10 rounded-lg bg-primary/10 border border-primary/30 flex items-center justify-center text-primary flex-shrink-0">
                    <Award className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-semibold leading-tight">{c.title}</h3>
                    <p className="text-xs text-muted-foreground mt-1">{c.issuer}</p>
                  </div>
                </div>
                <p className="mt-4 text-sm text-muted-foreground">{c.desc}</p>
                <div className="mt-4 flex items-center gap-2 flex-wrap">
                  <Badge className="bg-primary/10 text-primary border border-primary/30 hover:bg-primary/15">{c.year}</Badge>
                  {c.tag && <Badge variant="outline" className="border-border text-muted-foreground">{c.tag}</Badge>}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* EDUCATION */}
      <section
        id="education"
        ref={eduAnim.ref}
        className={`py-24 border-t border-border/60 transition-all duration-700 ${eduAnim.isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
      >
        <div className="mx-auto max-w-7xl px-6 grid md:grid-cols-3 gap-10">
          <div>
            <p className="font-mono text-xs text-primary uppercase tracking-widest">// education</p>
            <h2 className="mt-3 text-3xl md:text-4xl font-bold">Academics & teaching</h2>
            <p className="mt-3 text-muted-foreground">Learning and passing it on — I also teach cybersecurity to students and bootcamp cohorts.</p>
          </div>
          <div className="md:col-span-2 space-y-5">
            <div className="rounded-2xl border border-border bg-gradient-card p-6">
              <div className="flex items-start gap-3">
                <div className="h-10 w-10 rounded-lg bg-primary/10 border border-primary/30 flex items-center justify-center text-primary flex-shrink-0">
                  <GraduationCap className="h-5 w-5" />
                </div>
                <div>
                  <Badge className="bg-primary/10 text-primary border border-primary/30">Sept 2023 — Aug 2027</Badge>
                  <h3 className="mt-2 font-semibold">B.Tech in Computer Science · GPA 7.5</h3>
                  <p className="text-sm text-muted-foreground mt-1">Bihar Engineering University (BEU), Patna, Bihar</p>
                  <p className="text-sm text-muted-foreground mt-3">
                    Coursework: Network Security, Web Application Development, Data Structures,
                    Algorithms, Database Management.
                  </p>
                </div>
              </div>
            </div>
            <div className="rounded-2xl border border-border bg-gradient-card p-6">
              <div className="flex items-start gap-3">
                <div className="h-10 w-10 rounded-lg bg-primary/10 border border-primary/30 flex items-center justify-center text-primary flex-shrink-0">
                  <BookOpen className="h-5 w-5" />
                </div>
                <div>
                  <Badge className="bg-primary/10 text-primary border border-primary/30">2024 — Present</Badge>
                  <h3 className="mt-2 font-semibold">Ethical Hacking Trainer & Mentor</h3>
                  <p className="text-sm text-muted-foreground mt-1">Workshops, bootcamps & peer training</p>
                  <p className="text-sm text-muted-foreground mt-3">
                    Delivered security-awareness training and hands-on ethical hacking sessions
                    for 50+ learners — covering OWASP Top 10, phishing detection, network defence
                    and secure coding.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Testimonials />



      {/* EXPERIENCE */}
      <section
        id="experience"
        ref={expAnim.ref}
        className={`py-24 border-t border-border/60 transition-all duration-700 ${expAnim.isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
      >
        <div className="mx-auto max-w-7xl px-6">
          <div className="max-w-2xl">
            <p className="font-mono text-xs text-primary uppercase tracking-widest">// timeline</p>
            <h2 className="mt-3 text-3xl md:text-4xl font-bold">Experience & journey</h2>
          </div>
          <div className="mt-12 relative">
            <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-px bg-border" />
            <div className="space-y-10">
              {timeline.map((t, i) => (
                <div key={t.title} className={`relative md:grid md:grid-cols-2 md:gap-10 ${i % 2 ? "md:[&>*:first-child]:col-start-2" : ""}`}>
                  <div className={`${i % 2 ? "md:text-left" : "md:text-right"} pl-12 md:pl-0`}>
                    <div className="absolute left-4 md:left-1/2 -translate-x-1/2 mt-2 h-3 w-3 rounded-full bg-primary shadow-red" />
                    <div className="rounded-xl border border-border bg-gradient-card p-5">
                      <Badge className="bg-primary/10 text-primary border border-primary/30">{t.year}</Badge>
                      <h3 className="mt-3 font-semibold">{t.title}</h3>
                      <p className="text-sm text-muted-foreground mt-1">{t.org}</p>
                      <p className="text-sm text-muted-foreground mt-3">{t.desc}</p>
                    </div>
                  </div>
                  <div />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* BLOG / WRITE-UPS */}
      <BlogWriteups />

      {/* CONTACT */}
      <section
        id="contact"
        ref={contactAnim.ref}
        className={`py-24 border-t border-border/60 transition-all duration-700 ${contactAnim.isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
      >
        <div className="mx-auto max-w-4xl px-6 text-center">
          <p className="font-mono text-xs text-primary uppercase tracking-widest">// contact</p>
          <h2 className="mt-3 text-3xl md:text-5xl font-bold">Let's secure something together.</h2>
          <p className="mt-4 text-muted-foreground max-w-xl mx-auto">
            Need a pentest, a VAPT audit, SOC support or a secure-by-default build?
            Drop a message — I reply within a business day.
          </p>
          <div className="mt-8 flex flex-wrap gap-3 justify-center">
            <Button asChild size="lg" className="bg-gradient-red text-primary-foreground shadow-red hover:opacity-90">
              <a href={SOCIALS.email}><Mail className="h-4 w-4 mr-2" /> shubhammrdm394@gmail.com</a>
            </Button>
            <Button asChild size="lg" variant="outline" className="border-border">
              <a href={SOCIALS.linkedin} target="_blank" rel="noreferrer"><Linkedin className="h-4 w-4 mr-2" /> LinkedIn</a>
            </Button>
            <Button asChild size="lg" variant="outline" className="border-border">
              <a href={SOCIALS.github} target="_blank" rel="noreferrer"><Github className="h-4 w-4 mr-2" /> GitHub</a>
            </Button>
            <Button asChild size="lg" variant="outline" className="border-border">
              <a href={SOCIALS.resume} download><ExternalLink className="h-4 w-4 mr-2" /> Download Resume</a>
            </Button>
          </div>
          <ContactForm />
        </div>
      </section>

      <footer className="border-t border-border/60 py-10">
        <div className="mx-auto max-w-7xl px-6 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
          <p>© {new Date().getFullYear()} Shubham — Built with precision.</p>
          <div className="flex items-center gap-3">
            <a href={SOCIALS.github} target="_blank" rel="noreferrer" aria-label="GitHub"
              className="h-9 w-9 grid place-items-center rounded-md border border-border hover:text-primary hover:border-primary/50 transition-colors">
              <Github className="h-4 w-4" />
            </a>
            <a href={SOCIALS.linkedin} target="_blank" rel="noreferrer" aria-label="LinkedIn"
              className="h-9 w-9 grid place-items-center rounded-md border border-border hover:text-primary hover:border-primary/50 transition-colors">
              <Linkedin className="h-4 w-4" />
            </a>
            <a href={SOCIALS.email} aria-label="Email"
              className="h-9 w-9 grid place-items-center rounded-md border border-border hover:text-primary hover:border-primary/50 transition-colors">
              <Mail className="h-4 w-4" />
            </a>
          </div>
          <p className="font-mono text-xs">// stay paranoid, stay secure</p>
        </div>
      </footer>

      <Dialog open={!!activeProject} onOpenChange={(o) => !o && setActiveProject(null)}>
        <DialogContent className="max-w-2xl bg-card border-border">
          {activeProject && (
            <>
              <DialogHeader>
                <div className="flex items-center gap-2 flex-wrap">
                  <Badge className="bg-primary/10 text-primary border border-primary/30">{activeProject.tag}</Badge>
                  <Badge variant="outline" className="border-border text-muted-foreground">{activeProject.category}</Badge>
                </div>
                <DialogTitle className="mt-3 text-2xl font-bold flex items-center gap-2">
                  <activeProject.icon className="h-6 w-6 text-primary" />
                  {activeProject.title}
                </DialogTitle>
                <DialogDescription className="text-muted-foreground leading-relaxed pt-2">
                  {activeProject.description}
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-5 mt-2">
                <div>
                  <p className="font-mono text-xs text-primary uppercase tracking-widest mb-3">// tech stack</p>
                  <div className="flex flex-wrap gap-2">
                    {activeProject.stack.map((s) => (
                      <span key={s} className="font-mono text-xs px-2.5 py-1 rounded-md bg-secondary text-foreground/80 border border-border">
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="font-mono text-xs text-primary uppercase tracking-widest mb-3">// key highlights</p>
                  <ul className="space-y-2">
                    {activeProject.highlights.map((h) => (
                      <li key={h} className="flex gap-3 text-sm text-foreground/90">
                        <ChevronRight className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
                        <span>{h}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="flex gap-2 pt-2">
                  <Button asChild size="sm" variant="outline" className="border-border">
                    <a href="#" target="_blank" rel="noreferrer">
                      <Github className="h-4 w-4 mr-1" /> View Code
                    </a>
                  </Button>
                  <Button asChild size="sm" className="bg-gradient-red text-primary-foreground">
                    <a href="#contact" onClick={() => setActiveProject(null)}>
                      Discuss this work
                    </a>
                  </Button>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* BACK TO TOP */}
      <BackToTop />
    </div>
  );
}

const skillGroups = [
  {
    title: "Offensive Security",
    icon: Bug,
    items: [
      { name: "Web App Pentesting (OWASP)", level: 92 },
      { name: "Network Pentesting", level: 88 },
      { name: "Burp Suite / Nmap / Metasploit", level: 90 },
    ],
  },
  {
    title: "VAPT",
    icon: Radar,
    items: [
      { name: "Vulnerability Assessment", level: 90 },
      { name: "Nessus / OpenVAS", level: 85 },
      { name: "Reporting & Remediation", level: 88 },
    ],
  },
  {
    title: "SOC Analytics",
    icon: Eye,
    items: [
      { name: "SIEM (Splunk / ELK / Wazuh)", level: 86 },
      { name: "Incident Response", level: 84 },
      { name: "Threat Hunting", level: 82 },
    ],
  },
  {
    title: "Software Engineering",
    icon: Code2,
    items: [
      { name: "Python / Node.js / TypeScript", level: 90 },
      { name: "React / Next.js", level: 85 },
      { name: "REST APIs & Microservices", level: 82 },
    ],
  },
  {
    title: "Cloud & Infra",
    icon: Server,
    items: [
      { name: "AWS / Docker / Linux", level: 82 },
      { name: "Cloud Security", level: 78 },
      { name: "CI/CD Hardening", level: 76 },
    ],
  },
  {
    title: "Concepts",
    icon: Cpu,
    items: [
      { name: "Cryptography", level: 80 },
      { name: "Networking / TCP-IP", level: 88 },
      { name: "Secure SDLC", level: 84 },
    ],
  },
];

type ProjectCategory = "Pentesting" | "VAPT" | "SOC Analytics" | "Software";

type Project = {
  title: string;
  tag: string;
  category: ProjectCategory;
  icon: typeof Terminal;
  description: string;
  stack: string[];
  highlights: string[];
};

const projects: Project[] = [
  {
    title: "RedRecon",
    tag: "OFFENSIVE TOOLING",
    category: "Pentesting",
    icon: Terminal,
    description:
      "An automated reconnaissance framework for pentesters that chains subdomain enumeration, port scanning, tech fingerprinting and vulnerability probing into a single reportable pipeline.",
    stack: ["Python", "Nmap", "Amass", "Nuclei", "Docker"],
    highlights: [
      "Cuts external recon time from days to ~20 minutes on a /16 scope",
      "Auto-generates client-ready markdown + PDF reports",
      "Discovered 12+ real-world critical exposures in engagements",
    ],
  },
  {
    title: "SIEM-Lite",
    tag: "SOC / DEFENSE",
    category: "SOC Analytics",
    icon: ShieldCheck,
    description:
      "Lightweight SIEM built on the ELK stack with custom detection rules for MITRE ATT&CK techniques, real-time alerting and a triage dashboard for small SOC teams.",
    stack: ["Elasticsearch", "Logstash", "Kibana", "Wazuh", "Python"],
    highlights: [
      "60+ MITRE ATT&CK-mapped detection rules out of the box",
      "Reduced mean-time-to-detect from hours to minutes for SMB SOCs",
      "Playbook-driven alerts with auto-enrichment from OSINT feeds",
    ],
  },
  {
    title: "VaultKey",
    tag: "SECURE SOFTWARE",
    category: "Software",
    icon: KeyRound,
    description:
      "Zero-knowledge password & secret manager with end-to-end encryption, WebAuthn login, audit trails and team-based sharing built for engineering teams.",
    stack: ["Next.js", "TypeScript", "PostgreSQL", "Argon2", "WebAuthn"],
    highlights: [
      "Client-side Argon2id key derivation — server never sees plaintext",
      "WebAuthn + hardware key support for passwordless login",
      "SOC 2-ready audit trails with tamper-evident hash chaining",
    ],
  },
  {
    title: "PhishNet",
    tag: "THREAT INTEL",
    category: "VAPT",
    icon: Network,
    description:
      "A phishing-domain intelligence platform that ingests certificate transparency logs, scores lookalike domains and pushes takedown-ready evidence to SOC analysts.",
    stack: ["Node.js", "Redis", "MongoDB", "React", "Puppeteer"],
    highlights: [
      "Real-time ingestion of CT logs (~200k certs/hour)",
      "ML-scored lookalike detection with < 2% false positives",
      "One-click takedown packages for major registrars",
    ],
  },
  {
    title: "ADAudit-X",
    tag: "INTERNAL PENTEST",
    category: "Pentesting",
    icon: Lock,
    description:
      "Active Directory attack-path visualiser combining BloodHound data with post-exploitation checks, focused on privilege escalation and lateral movement paths.",
    stack: ["PowerShell", "Python", "Neo4j", "BloodHound"],
    highlights: [
      "Automated Tier 0 asset discovery and shortest-path attack graphs",
      "Detects Kerberoastable and unconstrained delegation misconfigs",
      "Generates prioritised remediation tickets per attack path",
    ],
  },
  {
    title: "WebVAPT Toolkit",
    tag: "OWASP TOP 10",
    category: "VAPT",
    icon: Bug,
    description:
      "Modular web-app VAPT toolkit covering OWASP Top 10 with authenticated scanning, session-aware crawling and evidence capture for client reports.",
    stack: ["Python", "Burp API", "Playwright", "SQLMap"],
    highlights: [
      "Session-aware crawler handles SPA + multi-step auth flows",
      "Automated evidence bundling (HTTP req/resp, screenshots)",
      "CVSS scoring + client-ready reports in one command",
    ],
  },
];

const projectCategories = ["All", "Pentesting", "VAPT", "SOC Analytics", "Software"] as const;
type FilterCategory = (typeof projectCategories)[number];

const timeline = [
  { year: "2025 — Present", title: "Ethical Hacking Trainer & Freelance Pentester", org: "Independent · Workshops & Consulting", desc: "Training ethical hacking, OWASP Top 10 and SOC fundamentals to 50+ students while delivering VAPT engagements for SMB clients." },
  { year: "Feb 2025 — May 2025", title: "Cybersecurity Student (Intern)", org: "The DROP Organization · Begusarai, Bihar", desc: "Ran penetration tests and vulnerability assessments on simulated networks using Wireshark, Nmap and Metasploit — documented 15+ critical vulnerabilities and delivered security-awareness training to 50+ participants." },
  { year: "July 2024", title: "Cybersecurity Workshop Participant", org: "DROP Organization · West Bengal", desc: "Intensive workshops on network defence, digital forensics and real-world threat analysis — hands-on reconnaissance, scanning, exploitation and post-exploitation in controlled labs." },
  { year: "2026", title: "Ethical Hacking Bootcamp", org: "PhysicsWallah (PW)", desc: "Completed PW's ethical hacking bootcamp covering reconnaissance, exploitation, web app pentesting and reporting." },
  { year: "Sept 2023 — Present", title: "B.Tech — Computer Science", org: "Bihar Engineering University (BEU), Patna", desc: "GPA 7.5 · Coursework in Network Security, Web Application Development, DSA, DBMS." },
];

const certifications = [
  {
    title: "Ethical Hacking Bootcamp",
    issuer: "PhysicsWallah (PW)",
    year: "2026",
    tag: "Offensive Security",
    desc: "Intensive hands-on bootcamp on penetration testing, reconnaissance, exploitation and reporting.",
  },
  {
    title: "Cisco Networking Course",
    issuer: "Cisco Networking Academy",
    year: "2026",
    tag: "Networking",
    desc: "Networking fundamentals — TCP/IP, routing, switching and network security foundations.",
  },
  {
    title: "CC2 Certification",
    issuer: "Cisco",
    year: "2026",
    tag: "Cybersecurity",
    desc: "Cybersecurity essentials — threats, vulnerabilities, defence-in-depth and incident response basics.",
  },
  {
    title: "Cyber Security Job Simulation",
    issuer: "Deloitte (Forage)",
    year: "2025",
    tag: "SOC / IR",
    desc: "Virtual job simulation covering log analysis, incident triage and client communication as a Deloitte cyber analyst.",
  },
  {
    title: "DCSC Certification",
    issuer: "The DROP Organization",
    year: "2025",
    tag: "VAPT",
    desc: "DROP Cyber Security Course — penetration testing, VAPT methodology, incident response and security-awareness delivery.",
  },
  {
    title: "Ethical Hacking Training",
    issuer: "The DROP Organization",
    year: "2024 — 2025",
    tag: "Pentesting",
    desc: "Comprehensive training in penetration testing, vulnerability assessment and incident response with lab engagements.",
  },
];

const _icons = [Lock, Briefcase]; // keep tree-shake happy
void _icons;

