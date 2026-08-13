import { useState } from "react";
import { z } from "zod";
import { Loader2, Send } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

const schema = z.object({
  name: z.string().trim().min(1, "Name is required").max(100),
  email: z.string().trim().email("Invalid email").max(200),
  message: z.string().trim().min(5, "Message is too short").max(2000),
});

// Replace with your own email — FormSubmit will confirm it via email on first send.
const CONTACT_EMAIL = "shubhammrdm394@gmail.com";

export function ContactForm() {
  const [loading, setLoading] = useState(false);
  const [values, setValues] = useState({ name: "", email: "", message: "" });

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = schema.safeParse(values);
    if (!parsed.success) {
      toast.error(parsed.error.issues[0]?.message ?? "Invalid input");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`https://formsubmit.co/ajax/${encodeURIComponent(CONTACT_EMAIL)}`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({
          name: parsed.data.name,
          email: parsed.data.email,
          message: parsed.data.message,
          _subject: `Portfolio contact — ${parsed.data.name}`,
          _template: "table",
        }),
      });
      if (!res.ok) throw new Error("Send failed");
      toast.success("Message sent — I'll get back to you soon.");
      setValues({ name: "", email: "", message: "" });
    } catch {
      toast.error("Could not send message. Try emailing me directly.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={onSubmit} className="mt-10 grid gap-4 text-left max-w-2xl mx-auto">
      <div className="grid md:grid-cols-2 gap-4">
        <Input
          placeholder="Your name"
          value={values.name}
          onChange={(e) => setValues((v) => ({ ...v, name: e.target.value }))}
          disabled={loading}
          maxLength={100}
        />
        <Input
          type="email"
          placeholder="Your email"
          value={values.email}
          onChange={(e) => setValues((v) => ({ ...v, email: e.target.value }))}
          disabled={loading}
          maxLength={200}
        />
      </div>
      <Textarea
        placeholder="Tell me about your project, scope, or the systems you'd like tested…"
        rows={5}
        value={values.message}
        onChange={(e) => setValues((v) => ({ ...v, message: e.target.value }))}
        disabled={loading}
        maxLength={2000}
      />
      <Button
        type="submit"
        size="lg"
        disabled={loading}
        className="bg-gradient-red text-primary-foreground shadow-red hover:opacity-90"
      >
        {loading ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Send className="h-4 w-4 mr-2" />}
        {loading ? "Sending…" : "Send message"}
      </Button>
    </form>
  );
}
