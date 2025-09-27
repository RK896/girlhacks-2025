import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Link } from "react-router-dom";
import { LogOut, Scroll, Sparkles, Clock, Calendar, BookOpen } from "lucide-react";
import JournalCalendar from "@/components/JournalCalendar";
import SpeechRecorder from "@/components/SpeechRecorder";
import SpeechRecorderAzure from "@/components/SpeechRecorderAzure";
// Mock data for demonstration
const mockEntries = [
  {
    id: 1,
    timestamp: new Date("2024-01-15T10:30:00"),
    journalText: "Today I led my first team meeting. I felt nervous initially, but gained confidence as we discussed the project roadmap. The team seemed engaged and asked thoughtful questions.",
    azureAnalysis: {
      sentiment: "positive",
      confidenceScores: { positive: 0.82, neutral: 0.15, negative: 0.03 }
    },
    athenaResponse: "Wise seeker, your courage in leadership shines like dawn breaking over Mount Olympus. The nervous energy you felt was not weakness, but the sacred fire of responsibility igniting within you. As Athena guided warriors into battle, let this first victory in leadership be the foundation stone of your growing authority. The engagement of your team is a mirror reflecting your authentic presence - nurture this gift, for great leaders are born not from perfection, but from the wisdom to grow through each challenge."
  },
  {
    id: 2,
    timestamp: new Date("2024-01-14T16:45:00"),
    journalText: "Had a challenging conversation with a difficult client today. They were unhappy with our deliverables and raised their voice. I managed to stay calm and professional, but it was draining.",
    azureAnalysis: {
      sentiment: "neutral",
      confidenceScores: { positive: 0.25, neutral: 0.55, negative: 0.20 }
    },
    athenaResponse: "Noble soul, in the crucible of conflict you have forged wisdom. Like the olive branch I gifted to Athens, your calm professionalism in the storm shows divine restraint. The client's anger was not truly aimed at you, but at their own frustrations seeking a target. Your ability to remain centered while drained shows the strength of both warrior and diplomat. Remember: even Zeus must weather storms to appreciate the clear sky. This trial has strengthened your professional armor."
  }
];

const Dashboard = () => {
  const [journalText, setJournalText] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [entries] = useState(mockEntries);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!journalText.trim()) {
      alert("Please enter your journal reflection");
      return;
    }
    
    setIsSubmitting(true);
    
    // TODO: Implement full AI flow when backend is connected:
    // 1. Azure AI sentiment analysis
    // 2. Gemini API for Athena's prophecy
    // 3. Save to database
    
    console.log("Journal submission:", journalText);

    // Simulate processing
    setTimeout(() => {
      setIsSubmitting(false);
      setJournalText("");
      alert("Journal entry submitted! (Backend integration pending)");
    }, 2000);
  };

  const handleSpeechTranscription = (transcribedText: string) => {
    setJournalText(prev => prev + (prev ? ' ' : '') + transcribedText);
  };

  const handleLogout = () => {
    // TODO: Implement logout when Firebase Auth is connected
    alert("Logout functionality requires Supabase authentication");
  };

  const getSentimentColor = (sentiment: string) => {
    switch (sentiment) {
      case "positive": return "bg-green-100 text-green-800";
      case "negative": return "bg-red-100 text-red-800";
      default: return "bg-blue-100 text-blue-800";
    }
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long", 
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-stone-bg to-marble-white">
      {/* Header */}
      <header className="border-b-4 border-divine-gold bg-marble-white shadow-lg">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <Link to="/" className="inline-block">
                <h1 className="font-athena text-4xl font-bold wisdom-text">
                  🏛️ Athena's Journal
                </h1>
              </Link>
              <p className="divine-text font-athena text-lg">
                Your Sacred Archive of Wisdom
              </p>
            </div>
            <Button 
              variant="temple" 
              onClick={handleLogout}
              className="flex items-center gap-2"
            >
              <LogOut size={18} />
              Exit Oracle
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <Tabs defaultValue="journal" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 lg:w-[400px]">
            <TabsTrigger value="journal" className="flex items-center gap-2">
              <BookOpen className="h-4 w-4" />
              Journal
            </TabsTrigger>
            <TabsTrigger value="calendar" className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Calendar
            </TabsTrigger>
          </TabsList>

          <TabsContent value="journal" className="space-y-6">
            <div className="grid lg:grid-cols-2 gap-8">
              {/* Journal Entry Form - The Altar */}
              <div className="space-y-6">
                <Card className="temple-column">
                  <CardHeader>
                    <CardTitle className="font-athena text-2xl wisdom-text flex items-center gap-2">
                      <Scroll className="text-divine-gold" />
                      The Sacred Altar
                    </CardTitle>
                    <p className="text-muted-foreground">
                      Share your professional experiences and receive Athena's divine guidance
                    </p>
                  </CardHeader>
                  
                  <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-6">
                      <div className="space-y-2">
                        <label className="font-medium text-wisdom-blue font-athena text-lg">
                          Your Professional Reflection
                        </label>
                        <Textarea
                          value={journalText}
                          onChange={(e) => setJournalText(e.target.value)}
                          placeholder="Describe your professional experience today... What challenges did you face? What successes did you achieve? How did you grow?"
                          className="min-h-32 resize-none"
                          rows={6}
                        />
                      </div>

                      {/* Speech Recognition */}
                      <div className="space-y-2">
                        <label className="font-medium text-wisdom-blue font-athena text-lg">
                          🎤 Or Speak Your Thoughts   
                        </label>
                        <SpeechRecorderAzure 
                          onTranscription={handleSpeechTranscription}
                          disabled={isSubmitting}
                        />
                      </div>
                      
                      <Button 
                        type="submit" 
                        variant="oracle" 
                        size="lg" 
                        className="w-full text-lg py-6 flex items-center gap-2"
                        disabled={isSubmitting}
                      >
                        {isSubmitting ? (
                          <>
                            <Sparkles className="animate-spin" />
                            Consulting the Oracle...
                          </>
                        ) : (
                          <>
                            <Sparkles />
                            Seek Athena's Wisdom
                          </>
                        )}
                      </Button>
                    </form>

                    {/* Instructions */}
                    <div className="mt-6 p-4 prophecy-reveal rounded-lg">
                      <p className="text-sm">
                        <strong className="divine-text">How it works:</strong> Your reflection will be analyzed for emotional patterns, 
                        then transformed into personalized guidance from Athena, goddess of wisdom and strategic thinking.
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Wisdom Archive - History */}
              <div>
                <Card className="temple-column h-[600px]">
                  <CardHeader>
                    <CardTitle className="font-athena text-2xl wisdom-text flex items-center gap-2">
                      <Clock className="text-divine-gold" />
                      Recent Wisdom
                    </CardTitle>
                    <p className="text-muted-foreground">
                      Your latest journal entries and divine insights
                    </p>
                  </CardHeader>
                  
                  <CardContent className="p-0">
                    <ScrollArea className="h-[480px] px-6">
                      <div className="space-y-6">
                        {entries.slice(0, 3).map((entry) => (
                          <div key={entry.id} className="border-l-4 border-divine-gold pl-4 space-y-3">
                            {/* Timestamp and Sentiment */}
                            <div className="flex items-center justify-between">
                              <p className="text-sm text-muted-foreground font-medium">
                                {formatDate(entry.timestamp)}
                              </p>
                              <Badge className={getSentimentColor(entry.azureAnalysis.sentiment)}>
                                {entry.azureAnalysis.sentiment}
                              </Badge>
                            </div>

                            {/* Original Journal Text */}
                            <div className="bg-muted/50 p-3 rounded-lg">
                              <p className="text-sm font-medium text-muted-foreground mb-1">
                                Your Reflection:
                              </p>
                              <p className="text-sm">{entry.journalText}</p>
                            </div>

                            {/* Athena's Prophecy */}
                            <div className="prophecy-reveal p-4 rounded-lg">
                              <p className="text-sm font-medium divine-text mb-2 flex items-center gap-1">
                                <Sparkles size={16} />
                                Athena's Prophecy:
                              </p>
                              <p className="text-sm font-medium wisdom-text leading-relaxed">
                                {entry.athenaResponse}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </ScrollArea>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="calendar">
            <JournalCalendar />
          </TabsContent>
        </Tabs>

        {/* Supabase Integration Notice */}
        <div className="mt-8">
          <Card className="prophecy-reveal">
            <CardContent className="p-6 text-center">
              <h3 className="font-athena text-xl font-bold divine-text mb-2">
                🔮 Unlock Full Oracle Powers
              </h3>
              <p className="text-muted-foreground mb-4">
                Connect Supabase to enable AI sentiment analysis, personalized Athena prophecies, 
                and permanent storage of your wisdom archive.
              </p>
              <div className="flex flex-wrap gap-4 justify-center text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-divine-gold rounded-full"></div>
                  <span>Azure AI Sentiment Analysis</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-divine-gold rounded-full"></div>
                  <span>Gemini AI Prophecies</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-divine-gold rounded-full"></div>
                  <span>Persistent Data Storage</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;