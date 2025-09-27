import React, { useState, useEffect } from 'react';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  ChevronLeft, 
  ChevronRight, 
  Calendar as CalendarIcon,
  Flame,
  TrendingUp,
  BarChart3,
  Sparkles
} from 'lucide-react';
import { cn } from '@/lib/utils';

// Types for journal entries and calendar data
interface JournalEntry {
  id: string;
  date: string;
  journalText: string;
  azureAnalysis: {
    sentiment: 'positive' | 'negative' | 'neutral';
    confidenceScores: {
      positive: number;
      neutral: number;
      negative: number;
    };
  };
  athenaResponse: string;
  timestamp: Date;
}

interface CalendarEntry {
  date: Date;
  entries: JournalEntry[];
  sentiment: 'positive' | 'negative' | 'neutral';
  entryCount: number;
}

// Mock data - in real app this would come from your database
const mockJournalEntries: JournalEntry[] = [
  {
    id: '1',
    date: '2024-01-15',
    journalText: "Today I led my first team meeting. I felt nervous initially, but gained confidence as we discussed the project roadmap. The team seemed engaged and asked thoughtful questions.",
    azureAnalysis: {
      sentiment: 'positive',
      confidenceScores: { positive: 0.82, neutral: 0.15, negative: 0.03 }
    },
    athenaResponse: "Wise seeker, your courage in leadership shines like dawn breaking over Mount Olympus...",
    timestamp: new Date('2024-01-15T10:30:00')
  },
  {
    id: '2',
    date: '2024-01-14',
    journalText: "Had a challenging conversation with a difficult client today. They were unhappy with our deliverables and raised their voice. I managed to stay calm and professional, but it was draining.",
    azureAnalysis: {
      sentiment: 'neutral',
      confidenceScores: { positive: 0.25, neutral: 0.55, negative: 0.20 }
    },
    athenaResponse: "Noble soul, in the crucible of conflict you have forged wisdom...",
    timestamp: new Date('2024-01-14T16:45:00')
  },
  {
    id: '3',
    date: '2024-01-13',
    journalText: "Completed a major project milestone today. The team worked incredibly well together and we delivered ahead of schedule. Feeling proud of what we accomplished.",
    azureAnalysis: {
      sentiment: 'positive',
      confidenceScores: { positive: 0.91, neutral: 0.08, negative: 0.01 }
    },
    athenaResponse: "Magnificent! Your collaborative spirit has borne fruit worthy of the gods...",
    timestamp: new Date('2024-01-13T17:20:00')
  },
  {
    id: '4',
    date: '2024-01-12',
    journalText: "Struggled with self-doubt today. Made a mistake in my presentation and felt like I let the team down. Need to work on my confidence.",
    azureAnalysis: {
      sentiment: 'negative',
      confidenceScores: { positive: 0.15, neutral: 0.30, negative: 0.55 }
    },
    athenaResponse: "Even the mightiest oak must bend in the storm to grow stronger...",
    timestamp: new Date('2024-01-12T14:15:00')
  },
  {
    id: '5',
    date: '2024-01-11',
    journalText: "Attended a networking event today. Met some interesting people and learned about new opportunities in the industry. Feeling optimistic about future prospects.",
    azureAnalysis: {
      sentiment: 'positive',
      confidenceScores: { positive: 0.78, neutral: 0.18, negative: 0.04 }
    },
    athenaResponse: "The seeds of opportunity you plant today will bloom into tomorrow's success...",
    timestamp: new Date('2024-01-11T19:30:00')
  }
];

const JournalCalendar: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [calendarData, setCalendarData] = useState<CalendarEntry[]>([]);
  const [currentStreak, setCurrentStreak] = useState(0);
  const [longestStreak, setLongestStreak] = useState(0);
  const [totalEntries, setTotalEntries] = useState(0);
  const [sentimentStats, setSentimentStats] = useState({
    positive: 0,
    neutral: 0,
    negative: 0
  });

  // Process journal entries into calendar data
  useEffect(() => {
    const processedData: CalendarEntry[] = [];
    const dateMap = new Map<string, JournalEntry[]>();

    // Group entries by date
    mockJournalEntries.forEach(entry => {
      const dateKey = entry.date;
      if (!dateMap.has(dateKey)) {
        dateMap.set(dateKey, []);
      }
      dateMap.get(dateKey)!.push(entry);
    });

    // Create calendar entries
    dateMap.forEach((entries, dateKey) => {
      const date = new Date(dateKey);
      const dominantSentiment = getDominantSentiment(entries);
      
      processedData.push({
        date,
        entries,
        sentiment: dominantSentiment,
        entryCount: entries.length
      });
    });

    setCalendarData(processedData);
    
    // Calculate statistics
    calculateStats(processedData);
    calculateStreaks(processedData);
  }, []);

  const getDominantSentiment = (entries: JournalEntry[]): 'positive' | 'negative' | 'neutral' => {
    const sentimentCounts = { positive: 0, negative: 0, neutral: 0 };
    
    entries.forEach(entry => {
      sentimentCounts[entry.azureAnalysis.sentiment]++;
    });

    return Object.entries(sentimentCounts).reduce((a, b) => 
      sentimentCounts[a[0] as keyof typeof sentimentCounts] > sentimentCounts[b[0] as keyof typeof sentimentCounts] ? a : b
    )[0] as 'positive' | 'negative' | 'neutral';
  };

  const calculateStats = (data: CalendarEntry[]) => {
    let positive = 0, neutral = 0, negative = 0;
    
    data.forEach(entry => {
      switch (entry.sentiment) {
        case 'positive': positive++; break;
        case 'neutral': neutral++; break;
        case 'negative': negative++; break;
      }
    });

    setSentimentStats({ positive, neutral, negative });
    setTotalEntries(data.reduce((sum, entry) => sum + entry.entryCount, 0));
  };

  const calculateStreaks = (data: CalendarEntry[]) => {
    // Sort entries by date
    const sortedEntries = [...data].sort((a, b) => a.date.getTime() - b.date.getTime());
    
    let currentStreakCount = 0;
    let longestStreakCount = 0;
    let tempStreak = 0;
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    // Calculate current streak (consecutive days from today backwards)
    for (let i = 0; i < 30; i++) {
      const checkDate = new Date(today);
      checkDate.setDate(today.getDate() - i);
      
      const hasEntry = sortedEntries.some(entry => 
        entry.date.toDateString() === checkDate.toDateString()
      );
      
      if (hasEntry) {
        if (i === 0 || currentStreakCount > 0) {
          currentStreakCount++;
        }
      } else {
        if (i > 0) break; // Only break if not checking today
      }
    }
    
    // Calculate longest streak
    sortedEntries.forEach((entry, index) => {
      if (index === 0 || 
          entry.date.getTime() - sortedEntries[index - 1].date.getTime() === 24 * 60 * 60 * 1000) {
        tempStreak++;
      } else {
        longestStreakCount = Math.max(longestStreakCount, tempStreak);
        tempStreak = 1;
      }
    });
    longestStreakCount = Math.max(longestStreakCount, tempStreak);
    
    setCurrentStreak(currentStreakCount);
    setLongestStreak(longestStreakCount);
  };

  const getSentimentColor = (sentiment: 'positive' | 'negative' | 'neutral') => {
    switch (sentiment) {
      case 'positive': return 'bg-green-500';
      case 'negative': return 'bg-red-500';
      case 'neutral': return 'bg-blue-500';
      default: return 'bg-gray-500';
    }
  };

  const getSentimentTextColor = (sentiment: 'positive' | 'negative' | 'neutral') => {
    switch (sentiment) {
      case 'positive': return 'text-green-700';
      case 'negative': return 'text-red-700';
      case 'neutral': return 'text-blue-700';
      default: return 'text-gray-700';
    }
  };

  const getEntriesForDate = (date: Date): JournalEntry[] => {
    const dateKey = date.toISOString().split('T')[0];
    return mockJournalEntries.filter(entry => entry.date === dateKey);
  };

  const selectedEntries = selectedDate ? getEntriesForDate(selectedDate) : [];

  return (
    <div className="space-y-6">
      {/* Statistics Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="temple-column">
          <CardContent className="p-4 text-center">
            <div className="flex items-center justify-center mb-2">
              <Flame className="h-6 w-6 text-divine-gold" />
            </div>
            <div className="text-2xl font-bold wisdom-text">{currentStreak}</div>
            <div className="text-sm text-muted-foreground">Current Streak</div>
          </CardContent>
        </Card>

        <Card className="temple-column">
          <CardContent className="p-4 text-center">
            <div className="flex items-center justify-center mb-2">
              <TrendingUp className="h-6 w-6 text-divine-gold" />
            </div>
            <div className="text-2xl font-bold wisdom-text">{longestStreak}</div>
            <div className="text-sm text-muted-foreground">Longest Streak</div>
          </CardContent>
        </Card>

        <Card className="temple-column">
          <CardContent className="p-4 text-center">
            <div className="flex items-center justify-center mb-2">
              <CalendarIcon className="h-6 w-6 text-divine-gold" />
            </div>
            <div className="text-2xl font-bold wisdom-text">{totalEntries}</div>
            <div className="text-sm text-muted-foreground">Total Entries</div>
          </CardContent>
        </Card>

        <Card className="temple-column">
          <CardContent className="p-4 text-center">
            <div className="flex items-center justify-center mb-2">
              <BarChart3 className="h-6 w-6 text-divine-gold" />
            </div>
            <div className="text-2xl font-bold wisdom-text">
              {Math.round((sentimentStats.positive / (sentimentStats.positive + sentimentStats.neutral + sentimentStats.negative)) * 100) || 0}%
            </div>
            <div className="text-sm text-muted-foreground">Positive Rate</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Calendar */}
        <Card className="temple-column">
          <CardHeader>
            <CardTitle className="font-athena text-2xl wisdom-text flex items-center gap-2">
              <CalendarIcon className="text-divine-gold" />
              Sacred Calendar
            </CardTitle>
            <p className="text-muted-foreground">
              Track your journey of wisdom and growth
            </p>
          </CardHeader>
          
          <CardContent>
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={setSelectedDate}
              className="rounded-md border-0"
              classNames={{
                months: "flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0",
                month: "space-y-4",
                caption: "flex justify-center pt-1 relative items-center",
                caption_label: "text-sm font-medium font-athena wisdom-text",
                nav: "space-x-1 flex items-center",
                nav_button: cn(
                  "h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100 border border-divine-gold/30 hover:border-divine-gold rounded-md"
                ),
                nav_button_previous: "absolute left-1",
                nav_button_next: "absolute right-1",
                table: "w-full border-collapse space-y-1",
                head_row: "flex",
                head_cell: "text-muted-foreground rounded-md w-9 font-normal text-[0.8rem] font-athena",
                row: "flex w-full mt-2",
                cell: "h-9 w-9 text-center text-sm p-0 relative [&:has([aria-selected].day-range-end)]:rounded-r-md [&:has([aria-selected].day-outside)]:bg-accent/50 [&:has([aria-selected])]:bg-accent first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20",
                day: cn(
                  "h-9 w-9 p-0 font-normal aria-selected:opacity-100 rounded-md relative hover:bg-accent hover:text-accent-foreground"
                ),
                day_selected: "bg-wisdom-blue text-white hover:bg-wisdom-blue hover:text-white focus:bg-wisdom-blue focus:text-white",
                day_today: "bg-divine-gold/20 text-wisdom-blue font-bold",
                day_outside: "day-outside text-muted-foreground opacity-50 aria-selected:bg-accent/50 aria-selected:text-muted-foreground aria-selected:opacity-30",
                day_disabled: "text-muted-foreground opacity-50",
                day_range_middle: "aria-selected:bg-accent aria-selected:text-accent-foreground",
                day_hidden: "invisible",
              }}
              components={{
                Day: ({ date, displayMonth }) => {
                  const dateKey = date.toISOString().split('T')[0];
                  const dayEntries = mockJournalEntries.filter(entry => entry.date === dateKey);
                  
                  if (dayEntries.length === 0) {
                    return <span>{date.getDate()}</span>;
                  }

                  const dominantSentiment = getDominantSentiment(dayEntries);
                  
                  return (
                    <div className="relative h-full w-full flex items-center justify-center">
                      <span className="relative z-10">{date.getDate()}</span>
                      <div 
                        className={cn(
                          "absolute inset-0 rounded-md opacity-20",
                          getSentimentColor(dominantSentiment)
                        )}
                      />
                      {dayEntries.length > 1 && (
                        <div className="absolute -top-1 -right-1 w-3 h-3 bg-divine-gold rounded-full text-xs flex items-center justify-center text-white font-bold">
                          {dayEntries.length}
                        </div>
                      )}
                    </div>
                  );
                }
              }}
            />

            {/* Legend */}
            <div className="mt-6 space-y-2">
              <p className="text-sm font-medium wisdom-text">Legend:</p>
              <div className="flex flex-wrap gap-4 text-xs">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-green-500 rounded opacity-20"></div>
                  <span>Positive</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-blue-500 rounded opacity-20"></div>
                  <span>Neutral</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-red-500 rounded opacity-20"></div>
                  <span>Negative</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-divine-gold rounded opacity-20"></div>
                  <span>Today</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Selected Date Details */}
        <Card className="temple-column">
          <CardHeader>
            <CardTitle className="font-athena text-2xl wisdom-text flex items-center gap-2">
              <Sparkles className="text-divine-gold" />
              {selectedDate ? selectedDate.toLocaleDateString('en-US', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              }) : 'Select a Date'}
            </CardTitle>
            <p className="text-muted-foreground">
              {selectedEntries.length > 0 
                ? `${selectedEntries.length} entr${selectedEntries.length === 1 ? 'y' : 'ies'} found`
                : 'No entries for this date'
              }
            </p>
          </CardHeader>
          
          <CardContent className="p-0">
            <ScrollArea className="h-[400px] px-6">
              {selectedEntries.length > 0 ? (
                <div className="space-y-4">
                  {selectedEntries.map((entry) => (
                    <div key={entry.id} className="space-y-3 border-l-4 border-divine-gold pl-4">
                      {/* Sentiment Badge */}
                      <Badge className={cn(
                        "text-xs",
                        entry.azureAnalysis.sentiment === 'positive' && "bg-green-100 text-green-800",
                        entry.azureAnalysis.sentiment === 'negative' && "bg-red-100 text-red-800",
                        entry.azureAnalysis.sentiment === 'neutral' && "bg-blue-100 text-blue-800"
                      )}>
                        {entry.azureAnalysis.sentiment} ({Math.round(entry.azureAnalysis.confidenceScores[entry.azureAnalysis.sentiment] * 100)}%)
                      </Badge>

                      {/* Journal Text */}
                      <div className="bg-muted/50 p-3 rounded-lg">
                        <p className="text-sm font-medium text-muted-foreground mb-1">
                          Your Reflection:
                        </p>
                        <p className="text-sm">{entry.journalText}</p>
                      </div>

                      {/* Athena's Response */}
                      <div className="prophecy-reveal p-4 rounded-lg">
                        <p className="text-sm font-medium divine-text mb-2 flex items-center gap-1">
                          <Sparkles size={16} />
                          Athena's Prophecy:
                        </p>
                        <p className="text-sm font-medium wisdom-text leading-relaxed">
                          {entry.athenaResponse}
                        </p>
                      </div>

                      {/* Timestamp */}
                      <p className="text-xs text-muted-foreground">
                        {entry.timestamp.toLocaleTimeString('en-US', {
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <div className="text-4xl mb-4">📜</div>
                  <p className="text-muted-foreground">
                    No journal entries for this date. 
                    <br />
                    Begin your reflection journey!
                  </p>
                </div>
              )}
            </ScrollArea>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default JournalCalendar;
