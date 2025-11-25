import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle2, LayoutDashboard, Wrench, Link2, Calendar, StickyNote, Bookmark, Timer, Calculator } from "lucide-react"

export default function Home() {
  const features = [
    {
      icon: LayoutDashboard,
      title: "Task Management",
      description: "Organize your tasks, set priorities, and track your daily progress with our intuitive task manager.",
    },
    {
      icon: Calendar,
      title: "Daily Planner",
      description: "Plan your day efficiently with our integrated calendar and scheduling tools.",
    },
    {
      icon: StickyNote,
      title: "Quick Notes",
      description: "Capture ideas instantly with our quick note-taking feature that's always at your fingertips.",
    },
    {
      icon: Bookmark,
      title: "Resource Hub",
      description: "Save and organize your important links, documents, and resources in one place.",
    },
    {
      icon: Wrench,
      title: "Productivity Tools",
      description: "Access calculators, timers, converters, and other utilities to boost your productivity.",
    },
    {
      icon: Link2,
      title: "Service Connections",
      description: "Connect with local services, emergency contacts, and community resources easily.",
    },
  ]

  const benefits = [
    "Centralized personal management",
    "Boost daily productivity",
    "Stay organized effortlessly",
    "Access tools anywhere, anytime",
    "Connect with essential services",
    "Track habits and goals",
  ]

  return (
    <div className="flex-1">
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-primary/5 to-background py-20 md:py-32">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
              Your All-in-One
              <span className="block text-primary mt-2">Personal Management Solution</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Streamline your life with PersonalHub. Manage tasks, access productivity tools, and connect with essential services—all from one unified platform.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/dashboard">
                <Button size="lg" className="w-full sm:w-auto">
                  Get Started
                </Button>
              </Link>
              <Link href="/tools">
                <Button size="lg" variant="outline" className="w-full sm:w-auto">
                  Explore Tools
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 md:py-32">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold mb-4">Everything You Need</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Powerful features designed to help you manage your personal life efficiently
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                    <feature.icon className="w-6 h-6 text-primary" />
                  </div>
                  <CardTitle>{feature.title}</CardTitle>
                  <CardDescription>{feature.description}</CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 md:py-32 bg-muted/50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-5xl font-bold mb-4">Why Choose PersonalHub?</h2>
              <p className="text-xl text-muted-foreground">
                A unified platform that brings together all your personal management needs
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {benefits.map((benefit, index) => (
                <div key={index} className="flex items-start space-x-3">
                  <CheckCircle2 className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
                  <span className="text-lg">{benefit}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 md:py-32">
        <div className="container mx-auto px-4">
          <Card className="max-w-4xl mx-auto border-primary/50 bg-gradient-to-br from-primary/5 to-primary/10">
            <CardContent className="p-8 md:p-12 text-center space-y-6">
              <h2 className="text-3xl md:text-4xl font-bold">Ready to Get Organized?</h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Start managing your personal life more effectively today. All features are available right now.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/dashboard">
                  <Button size="lg" className="w-full sm:w-auto">
                    Go to Dashboard
                  </Button>
                </Link>
                <Link href="/connect">
                  <Button size="lg" variant="outline" className="w-full sm:w-auto">
                    Connect Services
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  )
}