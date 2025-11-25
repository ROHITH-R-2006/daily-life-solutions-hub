"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Phone, MapPin, Search, MessageSquare, Send, AlertCircle, Hospital, ShieldAlert, Wrench, Users } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function ConnectPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: ""
  })
  const [formSubmitted, setFormSubmitted] = useState(false)

  const emergencyContacts = [
    { name: "Emergency Services", number: "911", description: "Police, Fire, Medical emergencies", icon: AlertCircle, color: "text-red-500" },
    { name: "Poison Control", number: "1-800-222-1222", description: "24/7 poison emergency hotline", icon: Hospital, color: "text-orange-500" },
    { name: "Suicide Prevention", number: "988", description: "24/7 crisis counseling", icon: ShieldAlert, color: "text-blue-500" },
    { name: "Domestic Violence", number: "1-800-799-7233", description: "National domestic violence hotline", icon: Phone, color: "text-purple-500" },
  ]

  const localServices = [
    { 
      id: 1,
      name: "City Medical Center",
      category: "Healthcare",
      description: "Full-service hospital with emergency care",
      address: "123 Medical Drive",
      phone: "(555) 123-4567",
      hours: "24/7"
    },
    {
      id: 2,
      name: "Community Library",
      category: "Education",
      description: "Public library with free resources and programs",
      address: "456 Book Street",
      phone: "(555) 234-5678",
      hours: "Mon-Sat 9AM-8PM"
    },
    {
      id: 3,
      name: "Downtown Auto Repair",
      category: "Automotive",
      description: "Trusted auto repair and maintenance",
      address: "789 Mechanic Lane",
      phone: "(555) 345-6789",
      hours: "Mon-Fri 8AM-6PM"
    },
    {
      id: 4,
      name: "Family Dental Care",
      category: "Healthcare",
      description: "General and cosmetic dentistry",
      address: "321 Smile Avenue",
      phone: "(555) 456-7890",
      hours: "Mon-Fri 8AM-5PM"
    },
    {
      id: 5,
      name: "City Recreation Center",
      category: "Recreation",
      description: "Fitness classes, pool, and sports facilities",
      address: "654 Fitness Road",
      phone: "(555) 567-8901",
      hours: "Daily 6AM-10PM"
    },
    {
      id: 6,
      name: "Legal Aid Society",
      category: "Legal",
      description: "Free legal assistance for qualifying residents",
      address: "987 Justice Boulevard",
      phone: "(555) 678-9012",
      hours: "Mon-Fri 9AM-5PM"
    },
  ]

  const communityPosts = [
    {
      id: 1,
      author: "Sarah Johnson",
      title: "Community Garden Volunteers Needed",
      content: "We're looking for volunteers to help maintain our community garden this spring. All skill levels welcome!",
      category: "Volunteer",
      timestamp: "2 hours ago"
    },
    {
      id: 2,
      author: "Mike Peterson",
      title: "Free Tutoring Services Available",
      content: "Offering free math and science tutoring for middle school students. Sessions available on weekends.",
      category: "Education",
      timestamp: "5 hours ago"
    },
    {
      id: 3,
      author: "Community Center",
      title: "Weekly Fitness Classes Starting",
      content: "Join us for yoga, pilates, and cardio classes every Monday, Wednesday, and Friday at 6 PM.",
      category: "Health",
      timestamp: "1 day ago"
    },
    {
      id: 4,
      author: "Local Food Bank",
      title: "Food Drive This Weekend",
      content: "Help us collect non-perishable food items for families in need. Drop-off at City Hall Saturday 9 AM-5 PM.",
      category: "Community",
      timestamp: "2 days ago"
    },
  ]

  const categories = ["all", "Healthcare", "Education", "Automotive", "Recreation", "Legal"]

  const filteredServices = localServices.filter(service => {
    const matchesSearch = service.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         service.description.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = selectedCategory === "all" || service.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Simulate form submission
    setFormSubmitted(true)
    setTimeout(() => {
      setFormSubmitted(false)
      setFormData({ name: "", email: "", subject: "", message: "" })
    }, 3000)
  }

  return (
    <div className="flex-1 bg-muted/30">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Connect</h1>
          <p className="text-muted-foreground">Find services, connect with your community, and get help</p>
        </div>

        <Tabs defaultValue="emergency" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 lg:w-auto lg:inline-grid">
            <TabsTrigger value="emergency">Emergency</TabsTrigger>
            <TabsTrigger value="services">Services</TabsTrigger>
            <TabsTrigger value="community">Community</TabsTrigger>
            <TabsTrigger value="contact">Contact</TabsTrigger>
          </TabsList>

          {/* Emergency Contacts */}
          <TabsContent value="emergency">
            <div className="space-y-6">
              <Card className="border-destructive/50 bg-destructive/5">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <AlertCircle className="w-5 h-5 text-destructive" />
                    Emergency Contacts
                  </CardTitle>
                  <CardDescription>
                    Important numbers for urgent situations - Save these contacts
                  </CardDescription>
                </CardHeader>
              </Card>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {emergencyContacts.map((contact, index) => (
                  <Card key={index} className="hover:shadow-lg transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex items-start gap-4">
                        <div className={`p-3 rounded-lg bg-muted ${contact.color}`}>
                          <contact.icon className="w-6 h-6" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-lg mb-1">{contact.name}</h3>
                          <a href={`tel:${contact.number}`} className="text-2xl font-bold text-primary hover:underline block mb-2">
                            {contact.number}
                          </a>
                          <p className="text-sm text-muted-foreground">{contact.description}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>Important Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-start gap-2">
                    <AlertCircle className="w-5 h-5 text-orange-500 flex-shrink-0 mt-0.5" />
                    <p className="text-sm">Always call 911 first in life-threatening emergencies</p>
                  </div>
                  <div className="flex items-start gap-2">
                    <AlertCircle className="w-5 h-5 text-orange-500 flex-shrink-0 mt-0.5" />
                    <p className="text-sm">Save these numbers in your phone for quick access</p>
                  </div>
                  <div className="flex items-start gap-2">
                    <AlertCircle className="w-5 h-5 text-orange-500 flex-shrink-0 mt-0.5" />
                    <p className="text-sm">Keep a list of your medications and allergies handy</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Local Services */}
          <TabsContent value="services">
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MapPin className="w-5 h-5" />
                    Local Services Directory
                  </CardTitle>
                  <CardDescription>Find essential services in your area</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex flex-col sm:flex-row gap-2">
                    <div className="relative flex-1">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input
                        placeholder="Search services..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                    <select
                      value={selectedCategory}
                      onChange={(e) => setSelectedCategory(e.target.value)}
                      className="px-4 py-2 border rounded-md bg-background"
                    >
                      {categories.map((cat) => (
                        <option key={cat} value={cat}>
                          {cat === "all" ? "All Categories" : cat}
                        </option>
                      ))}
                    </select>
                  </div>
                </CardContent>
              </Card>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredServices.length === 0 ? (
                  <div className="col-span-2">
                    <Card>
                      <CardContent className="p-8 text-center text-muted-foreground">
                        No services found matching your search
                      </CardContent>
                    </Card>
                  </div>
                ) : (
                  filteredServices.map((service) => (
                    <Card key={service.id} className="hover:shadow-lg transition-shadow">
                      <CardHeader>
                        <div className="flex justify-between items-start">
                          <CardTitle className="text-lg">{service.name}</CardTitle>
                          <Badge>{service.category}</Badge>
                        </div>
                        <CardDescription>{service.description}</CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-2">
                        <div className="flex items-start gap-2 text-sm">
                          <MapPin className="w-4 h-4 text-muted-foreground flex-shrink-0 mt-0.5" />
                          <span>{service.address}</span>
                        </div>
                        <div className="flex items-start gap-2 text-sm">
                          <Phone className="w-4 h-4 text-muted-foreground flex-shrink-0 mt-0.5" />
                          <a href={`tel:${service.phone}`} className="text-primary hover:underline">
                            {service.phone}
                          </a>
                        </div>
                        <div className="flex items-start gap-2 text-sm">
                          <span className="text-muted-foreground">Hours:</span>
                          <span>{service.hours}</span>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                )}
              </div>
            </div>
          </TabsContent>

          {/* Community Board */}
          <TabsContent value="community">
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="w-5 h-5" />
                    Community Board
                  </CardTitle>
                  <CardDescription>
                    Connect with neighbors, find local events, and community resources
                  </CardDescription>
                </CardHeader>
              </Card>

              <div className="space-y-4">
                {communityPosts.map((post) => (
                  <Card key={post.id} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h3 className="font-semibold text-lg mb-1">{post.title}</h3>
                          <p className="text-sm text-muted-foreground">
                            Posted by {post.author} • {post.timestamp}
                          </p>
                        </div>
                        <Badge variant="secondary">{post.category}</Badge>
                      </div>
                      <p className="text-muted-foreground mb-4">{post.content}</p>
                      <Button variant="outline" size="sm">
                        <MessageSquare className="w-4 h-4 mr-2" />
                        Contact
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>

              <Card className="bg-primary/5 border-primary/20">
                <CardContent className="p-6 text-center">
                  <h3 className="font-semibold mb-2">Want to post to the community board?</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Share events, services, or connect with your neighbors
                  </p>
                  <Button>Create a Post</Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Contact Form */}
          <TabsContent value="contact">
            <div className="max-w-2xl mx-auto space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Send className="w-5 h-5" />
                    Contact Us
                  </CardTitle>
                  <CardDescription>
                    Have questions or need assistance? Send us a message
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {formSubmitted ? (
                    <div className="py-12 text-center space-y-4">
                      <div className="w-16 h-16 bg-green-500/10 rounded-full flex items-center justify-center mx-auto">
                        <svg className="w-8 h-8 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <h3 className="text-xl font-semibold">Message Sent!</h3>
                      <p className="text-muted-foreground">
                        Thank you for contacting us. We'll get back to you soon.
                      </p>
                    </div>
                  ) : (
                    <form onSubmit={handleFormSubmit} className="space-y-4">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <label className="text-sm font-medium">Name *</label>
                          <Input
                            required
                            placeholder="Your name"
                            value={formData.name}
                            onChange={(e) => setFormData({...formData, name: e.target.value})}
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-medium">Email *</label>
                          <Input
                            required
                            type="email"
                            placeholder="your@email.com"
                            value={formData.email}
                            onChange={(e) => setFormData({...formData, email: e.target.value})}
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm font-medium">Subject *</label>
                        <Input
                          required
                          placeholder="What is this regarding?"
                          value={formData.subject}
                          onChange={(e) => setFormData({...formData, subject: e.target.value})}
                        />
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm font-medium">Message *</label>
                        <Textarea
                          required
                          placeholder="Tell us how we can help..."
                          value={formData.message}
                          onChange={(e) => setFormData({...formData, message: e.target.value})}
                          rows={6}
                        />
                      </div>

                      <Button type="submit" className="w-full" size="lg">
                        <Send className="w-4 h-4 mr-2" />
                        Send Message
                      </Button>
                    </form>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Other Ways to Reach Us</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center gap-3">
                    <Phone className="w-5 h-5 text-muted-foreground" />
                    <div>
                      <p className="font-medium">Phone</p>
                      <p className="text-sm text-muted-foreground">(555) 123-4567</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <MapPin className="w-5 h-5 text-muted-foreground" />
                    <div>
                      <p className="font-medium">Address</p>
                      <p className="text-sm text-muted-foreground">123 Main Street, Suite 100</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <MessageSquare className="w-5 h-5 text-muted-foreground" />
                    <div>
                      <p className="font-medium">Email</p>
                      <p className="text-sm text-muted-foreground">support@personalhub.com</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
