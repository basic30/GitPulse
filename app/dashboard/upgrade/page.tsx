"use client"

import { motion } from "framer-motion"
import { Check, Sparkles, Zap, ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { useRouter } from "next/navigation"

const features = [
  "Unlimited repository analysis",
  "Advanced AI code suggestions",
  "Automated weekly health reports",
  "Priority support queue",
  "Custom deletion plans",
]

export default function UpgradePage() {
  const router = useRouter()

  return (
    <div className="flex flex-col gap-8 max-w-4xl mx-auto py-8">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" onClick={() => router.push("/dashboard")} className="h-10 w-10">
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold sm:text-3xl">Upgrade to Pro</h1>
          <p className="mt-1 text-muted-foreground">Unlock the full power of GitPulse AI</p>
        </div>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="grid gap-8 md:grid-cols-2 mt-4"
      >
        {/* Current Plan */}
        <Card className="flex flex-col">
          <CardHeader>
            <CardTitle className="text-xl">Free Plan</CardTitle>
            <CardDescription>Your current subscription</CardDescription>
          </CardHeader>
          <CardContent className="flex-1 space-y-4">
            <div className="text-4xl font-bold">$0<span className="text-lg font-normal text-muted-foreground">/mo</span></div>
            <ul className="space-y-2 mt-4 text-sm text-muted-foreground">
              <li className="flex items-center gap-2"><Check className="h-4 w-4 text-green-500" /> Basic repo analysis</li>
              <li className="flex items-center gap-2"><Check className="h-4 w-4 text-green-500" /> Up to 3 repos/month</li>
              <li className="flex items-center gap-2"><Check className="h-4 w-4 text-green-500" /> Standard AI models</li>
            </ul>
          </CardContent>
          <CardFooter>
            <Button variant="outline" className="w-full" disabled>Current Plan</Button>
          </CardFooter>
        </Card>

        {/* Pro Plan */}
        <Card className="flex flex-col border-primary shadow-lg shadow-primary/10 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary to-primary/50" />
          <CardHeader>
            <CardTitle className="text-xl flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-primary" />
              Pro Plan
            </CardTitle>
            <CardDescription>For serious developers</CardDescription>
          </CardHeader>
          <CardContent className="flex-1 space-y-4">
            <div className="text-4xl font-bold">$12<span className="text-lg font-normal text-muted-foreground">/mo</span></div>
            <ul className="space-y-2 mt-4 text-sm">
              {features.map((feature, i) => (
                <li key={i} className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-primary" />
                  {feature}
                </li>
              ))}
            </ul>
          </CardContent>
          <CardFooter>
            <Button className="w-full gap-2" onClick={() => alert("Stripe/Payment Gateway integration goes here!")}>
              <Zap className="h-4 w-4" />
              Upgrade Now
            </Button>
          </CardFooter>
        </Card>
      </motion.div>
    </div>
  )
}