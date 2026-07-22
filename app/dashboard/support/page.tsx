import { LifeBuoy, Mail } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

export default function SupportPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Support</h1>
        <p className="mt-1 text-sm text-surface-400">
          Get help with your account
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Contact Support</CardTitle>
            <CardDescription>
              Send us a message and we&apos;ll get back to you within 24 hours
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="subject">Subject</Label>
                <Input id="subject" placeholder="How can we help?" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="message">Message</Label>
                <Textarea
                  id="message"
                  placeholder="Describe your issue..."
                  rows={5}
                />
              </div>
              <Button type="submit" fullWidth>
                Send Message
              </Button>
            </form>
          </CardContent>
        </Card>

        <div className="space-y-4">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand-500/10 ring-1 ring-brand-500/20">
                  <Mail className="h-5 w-5 text-brand-400" />
                </div>
                <div>
                  <h3 className="font-semibold text-white">Email Us</h3>
                  <p className="mt-1 text-sm text-surface-400">
                    support@twalletservices.com
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand-500/10 ring-1 ring-brand-500/20">
                  <LifeBuoy className="h-5 w-5 text-brand-400" />
                </div>
                <div>
                  <h3 className="font-semibold text-white">Help Center</h3>
                  <p className="mt-1 text-sm text-surface-400">
                    Browse FAQs and guides
                  </p>
                  <Button variant="link" size="sm" className="mt-2 px-0">
                    Visit Help Center
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
