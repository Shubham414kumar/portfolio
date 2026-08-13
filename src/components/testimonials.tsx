import { useState } from "react";
import { Quote, Star } from "lucide-react";

const testimonials = [
  {
    name: "Priya Sharma",
    role: "CTO",
    company: "FinEdge",
    quote:
      "Shubham's VAPT engagement uncovered a critical auth bypass we'd shipped for months. The report was surgical — root cause, PoC, and a working patch. Best pentester we've worked with.",
    rating: 5,
  },
  {
    name: "Marcus Weber",
    role: "Head of Security",
    company: "NovaCloud",
    quote:
      "Our SOC MTTR dropped from 4 hours to under 20 minutes after Shubham tuned our SIEM. He rewrote our detection rules to actually map to ATT&CK and killed the alert fatigue.",
    rating: 5,
  },
  {
    name: "Ananya Iyer",
    role: "Founder",
    company: "Kettle Labs",
    quote:
      "A rare mix — thinks like an attacker, ships like an engineer. He didn't just find our IDOR issues, he built the middleware to prevent an entire class of them.",
    rating: 5,
  },
  {
    name: "David Okafor",
    role: "VP Engineering",
    company: "Ledgerly",
    quote:
      "Delivered a full external pentest in 8 days with zero disruption. The exec summary was clear enough for our board and the technical appendix satisfied our SOC 2 auditors.",
    rating: 5,
  },
];

export function Testimonials() {
  const [active, setActive] = useState(0);
  const t = testimonials[active];

  return (
    <section id="testimonials" className="py-24 border-t border-border/60">
      <div className="mx-auto max-w-7xl px-6">
        <div className="max-w-2xl">
          <p className="font-mono text-xs text-primary uppercase tracking-widest">// testimonials</p>
          <h2 className="mt-3 text-3xl md:text-4xl font-bold">Trusted by teams under fire</h2>
          <p className="mt-3 text-muted-foreground">
            Outcomes from clients across fintech, SaaS and cloud infrastructure engagements.
          </p>
        </div>

        <div className="mt-12 grid lg:grid-cols-[1fr_320px] gap-8 items-start">
          <div className="rounded-2xl border border-border bg-gradient-card p-8 md:p-10 shadow-card relative overflow-hidden">
            <Quote className="absolute -top-2 -left-2 h-24 w-24 text-primary/10" />
            <div className="relative">
              <div className="flex gap-1">
                {Array.from({ length: t.rating }).map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-primary text-primary" />
                ))}
              </div>
              <blockquote className="mt-6 text-lg md:text-2xl font-medium leading-relaxed text-foreground/90">
                "{t.quote}"
              </blockquote>
              <div className="mt-8 flex items-center gap-4">
                <div className="h-12 w-12 rounded-full bg-gradient-red grid place-items-center font-display font-bold text-primary-foreground">
                  {t.name.split(" ").map((s) => s[0]).join("")}
                </div>
                <div>
                  <div className="font-semibold">{t.name}</div>
                  <div className="text-sm text-muted-foreground">
                    {t.role} · {t.company}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="grid gap-3">
            {testimonials.map((item, i) => (
              <button
                key={item.name}
                onClick={() => setActive(i)}
                className={`text-left rounded-xl border p-4 transition-colors ${
                  i === active
                    ? "border-primary/60 bg-primary/5"
                    : "border-border bg-card hover:border-primary/40"
                }`}
              >
                <div className="font-semibold text-sm">{item.name}</div>
                <div className="text-xs text-muted-foreground mt-0.5">
                  {item.role} · {item.company}
                </div>
                <p className="text-xs text-muted-foreground mt-2 line-clamp-2">"{item.quote}"</p>
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
