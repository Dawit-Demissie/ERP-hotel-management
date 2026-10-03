import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

app.use(express.json());

// Initialize Google Gemini AI SDK if key available
let genAI: GoogleGenAI | null = null;
const apiKey = process.env.GEMINI_API_KEY;
if (apiKey) {
  try {
    genAI = new GoogleGenAI({ apiKey });
  } catch (err) {
    console.warn('Failed to initialize GoogleGenAI with key, using fallback:', err);
  }
}

// 1. AI Hotel Staff Chat Assistant
app.post('/api/ai/chat', async (req, res) => {
  const { message, history, context } = req.body;
  if (!message) {
    return res.status(400).json({ error: 'Message is required' });
  }

  const systemInstruction = `You are "Golden AI Intelligence", the elite hospitality operational AI assistant embedded within "Golden Hotel ERP — The Grand Golden Sovereign & Resort".
You assist the hotel management and staff across departments:
- General Manager (strategy, RevPAR, ADR, GOPPAR, yield management)
- Front Desk (VIP arrivals, guest requests, keycards, folios, room availability)
- Food & Beverage (restaurant tables, KOT status, chef inventory, room service)
- Housekeeping (cleaning priority, VIP room turn-downs, inspection)
- Finance (invoices, Chapa/card transactions, night audit, payroll)

Current Hotel Context:
- Property: The Grand Golden Sovereign (28 luxury suites, 4 floors)
- Occupancy: ~85% today
- Total Today Revenue: $42,850+
- RevPAR: $318.50 | ADR: $375.00
- Key VIP in-house: Lord Alistair Sterling (Presidential 401), Princess Amara (Garden Villa 101), Dr. Elena Rostova (Exec 301)
- Restaurant: Fine dining active, Wagyu inventory is low (4.8 kg remaining)

Maintain a sophisticated, concise, highly professional executive tone. When asked to draft emails or take actions, format them clearly with sections. Always provide clear, direct numbers and actionable advice.`;

  if (genAI) {
    try {
      const response = await genAI.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: [
          { role: 'user', parts: [{ text: `${systemInstruction}\n\nHotel Context Snapshot: ${JSON.stringify(context || {})}\n\nUser Question/Request: ${message}` }] }
        ],
        config: {
          temperature: 0.7,
        }
      });

      const reply = response.text || "I have analyzed the current hotel operational metrics. All departments are operating within optimal parameters.";
      return res.json({ reply });
    } catch (err: any) {
      console.error('Gemini API Error in /api/ai/chat:', err);
    }
  }

  // Graceful intelligent fallback
  let fallbackReply = `As Golden AI Hotel Assistant, I have reviewed your inquiry regarding "${message.slice(0, 45)}...".\n\n`;
  if (message.toLowerCase().includes('revpar') || message.toLowerCase().includes('revenue')) {
    fallbackReply += `Current RevPAR stands at $318.50 (+14.2% vs target). Today's gross booked revenue is $42,850 across rooms and F&B. Yield optimization is active on Floor 4 Penthouses with an 18% weekend surge recommended.`;
  } else if (message.toLowerCase().includes('vip') || message.toLowerCase().includes('guest')) {
    fallbackReply += `VIP guests currently on property:\n• Lord Alistair Sterling (Suite 401, Black Diamond VIP) - Requested Dom Pérignon 2012 on ice.\n• Princess Amara Al-Mansoor (Villa 101, Black Diamond VIP) - Security clearance approved, banquet scheduled.\n• Dr. Elena Rostova (Suite 301, Gold VIP) - Late check-out requested for tomorrow.`;
  } else if (message.toLowerCase().includes('food') || message.toLowerCase().includes('inventory') || message.toLowerCase().includes('kitchen')) {
    fallbackReply += `Kitchen Status Report:\n• A5 Miyazaki Wagyu Ribeye is critically low at 4.8 kg (below safety buffer of 8 kg).\n• Recommended action: Express delivery order PO-8892 ready for Chef Antoine Laurent's authorization.\n• Banquet dinner covers for Friday are 88% reserved.`;
  } else if (message.toLowerCase().includes('clean') || message.toLowerCase().includes('housekeeping')) {
    fallbackReply += `Housekeeping Dispatch:\n• 3 suites currently in 'Cleaning' status (Room 404, 204).\n• Room 404 has 'VIP Rush' assigned ahead of Ambassador Vance's 16:00 arrival.\n• Average turnover duration today: 34 minutes (optimal standard < 40m).`;
  } else {
    fallbackReply += `Operational summary verified. Occupancy is 85% with 23 occupied suites and 3 available for walk-in or high-rate direct booking. All front-office and F&B POS systems are synced in real time. Would you like me to run dynamic pricing adjustments or draft guest correspondence?`;
  }

  return res.json({ reply: fallbackReply });
});

// 2. AI Operational Daily Insights
app.post('/api/ai/operational-insights', async (req, res) => {
  const { occupancyRate, revPar, todayRevenue, adr, pendingCheckIns, activeRole } = req.body || {};

  if (genAI) {
    try {
      const prompt = `You are the executive AI hotel operations analyst for The Grand Sovereign Resort & Suites.
Today's hotel metrics: Occupancy ${occupancyRate || '85%'}, RevPAR $${revPar || '318.50'}, Today's Revenue $${todayRevenue || '42,850'}, ADR $${adr || '375.00'}, Pending Check-Ins: ${pendingCheckIns || '2 VIP'}.
Current staff role viewing the console: ${activeRole || 'General Manager'}.
Generate a comprehensive daily operational briefing.
Return a valid JSON object with:
1. "executiveSummary": a concise, authoritative 2-3 sentence executive briefing summarizing today's key performance metrics, pacing, and operational priorities.
2. "insights": an array of 4 distinct operational insight items with keys:
   - "id": string (e.g. "ins-gen-1")
   - "type": "Revenue" | "VIP" | "Kitchen" | "Staffing" | "Occupancy"
   - "title": string
   - "description": string
   - "severity": "Urgent" | "Warning" | "Info" | "Success"
   - "suggestedAction": string (a specific, high-leverage immediate action staff can execute now with 1 click)
   - "impactMetric": string (e.g. "+$9,200 incremental ADR", "Zero lobby queue", "+28% margin", "Guarantees dinner service")
   - "categoryBadge": string (e.g. "Yield Optimization", "VIP Experience", "Culinary Stock", "Housekeeping Dispatch")
   - "urgency": "Immediate Action Required" | "High Yield Opportunity" | "Operational Guard" | "Benchmark Stable"
Return ONLY valid JSON.`;
      
      const response = await genAI.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
        config: {
          temperature: 0.5,
          responseMimeType: 'application/json',
        }
      });

      const parsed = JSON.parse(response.text || '{}');
      if (parsed.insights && parsed.executiveSummary) {
        return res.json(parsed);
      }
      if (Array.isArray(parsed)) {
        return res.json({
          executiveSummary: "Today's occupancy is pacing strong at 85% with RevPAR up +14.2% above comp-set targets. Key priorities include Penthouse rate yield optimization, Wagyu ribeye stock replenishment, and VIP welcome escorts.",
          insights: parsed
        });
      }
    } catch (err) {
      console.error('Gemini API Error in /api/ai/operational-insights:', err);
    }
  }

  return res.json({
    executiveSummary: "Morning Executive Telemetry: Occupancy index is optimal at 85% with RevPAR pacing at $318.50 (+14.2% over comp-set). High-rate direct bookings are capturing 71% of demand. Critical attention is required on A5 Wagyu inventory replenishment and expedited sanitization for Suite 404 ahead of afternoon VIP arrivals.",
    insights: [
      {
        id: 'ins-gen-1',
        type: 'Revenue',
        title: 'Penthouse Rate Surge (+18.4%) Opportunity',
        description: 'International Sovereign Gala has compressed regional luxury suites. Floor 4 Royal Penthouse is currently priced at $950 against competitor ADR of $1,180.',
        severity: 'Warning',
        suggestedAction: 'Authorize +18.4% rate adjustment on Royal Penthouse to $1,125/night.',
        impactMetric: '+$5,250 net incremental ADR',
        categoryBadge: 'Yield Optimization',
        urgency: 'High Yield Opportunity',
        timestamp: 'Just now'
      },
      {
        id: 'ins-gen-2',
        type: 'VIP',
        title: 'Lord Sterling & Ambassador Vance Arrivals',
        description: 'Two Black Diamond VIPs arriving between 14:00 and 16:00. Room 401 requires 2012 Dom Pérignon on ice and hypoallergenic bedding verification.',
        severity: 'Urgent',
        suggestedAction: 'Dispatch Butler Concierge escort and pre-encode VIP keycards for Suites 401 and 404.',
        impactMetric: 'Zero lobby wait & 100% CSAT',
        categoryBadge: 'VIP Experience',
        urgency: 'Immediate Action Required',
        timestamp: '3 mins ago'
      },
      {
        id: 'ins-gen-3',
        type: 'Kitchen',
        title: 'A5 Miyazaki Wagyu Stock Buffer Critical',
        description: 'Current stock is 4.8 kg against weekend dinner reservation forecast of 14.5 kg. Supplier cut-off is 13:00 today.',
        severity: 'Urgent',
        suggestedAction: 'Approve PO-8892 for 15 kg Wagyu ribeye express delivery from Tokyo Prime Imports.',
        impactMetric: 'Secures $8,500 banquet revenue',
        categoryBadge: 'Culinary Stock',
        urgency: 'Immediate Action Required',
        timestamp: '8 mins ago'
      },
      {
        id: 'ins-gen-4',
        type: 'Staffing',
        title: 'Housekeeping Turn-down Fast-Track for Floor 4',
        description: 'Suite 404 departed at 11:15 with incoming VIP arrival at 14:30. Requires two housekeeping leads for accelerated sanitization.',
        severity: 'Success',
        suggestedAction: 'Reassign Beatriz Morales & 1 specialist to Suite 404 for VIP Rush turnover.',
        impactMetric: '30-min turnover standard',
        categoryBadge: 'Housekeeping Dispatch',
        urgency: 'Operational Guard',
        timestamp: '14 mins ago'
      }
    ]
  });
});

// 3. AI Dynamic Pricing Generator
app.post('/api/ai/dynamic-pricing', async (req, res) => {
  const { currentRates, occupancyRate } = req.body;

  if (genAI) {
    try {
      const prompt = `You are a luxury revenue management AI for a 5-star hotel. Current occupancy is ${occupancyRate || '85%'}.
Generate 3 dynamic pricing recommendations for room categories: Presidential Suite, Deluxe Ocean King, Classic Deluxe.
Return a valid JSON array of objects with keys: roomCategory, currentRate (number), suggestedRate (number), adjustmentPercent (number), reason (string), confidence (number 80-99), projectedRevenueIncrease (number). Return ONLY valid JSON.`;

      const response = await genAI.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
        config: {
          temperature: 0.5,
          responseMimeType: 'application/json',
        }
      });

      const parsed = JSON.parse(response.text || '[]');
      return res.json({ recommendations: parsed });
    } catch (err) {
      console.error('Gemini API Error in /api/ai/dynamic-pricing:', err);
    }
  }

  return res.json({
    recommendations: [
      {
        id: 'pr-gen-1',
        roomCategory: 'Presidential Suite',
        currentRate: 1250,
        suggestedRate: 1450,
        adjustmentPercent: 16.0,
        reason: 'Luxury comp set is 94% committed for the weekend. High willingness-to-pay detected among international business travelers.',
        confidence: 95,
        projectedRevenueIncrease: 4800
      },
      {
        id: 'pr-gen-2',
        roomCategory: 'Executive Suite',
        currentRate: 580,
        suggestedRate: 640,
        adjustmentPercent: 10.3,
        reason: 'Corporate travel index up 18%. 7 of 8 executive suites occupied.',
        confidence: 92,
        projectedRevenueIncrease: 2150
      },
      {
        id: 'pr-gen-3',
        roomCategory: 'Deluxe Ocean King',
        currentRate: 420,
        suggestedRate: 465,
        adjustmentPercent: 10.7,
        reason: 'Warm coastal weather forecast driving spontaneous weekend leisure bookings.',
        confidence: 89,
        projectedRevenueIncrease: 1800
      }
    ]
  });
});

// 4. AI Guest Communication & Response Drafter
app.post('/api/ai/draft-response', async (req, res) => {
  const { guestName, roomNumber, scenario, guestNotes } = req.body;

  if (genAI) {
    try {
      const prompt = `You are the Master Concierge & Guest Relations Director at The Grand Golden Sovereign Luxury Hotel.
Draft an exquisite, warm, and hyper-personalized guest communication letter/email for:
- Guest Name: ${guestName || 'Valued Guest'}
- Room Number: ${roomNumber || 'Suite'}
- Scenario/Topic: ${scenario || 'VIP Welcome & Special Itinerary'}
- Extra Details: ${guestNotes || 'Enjoys fine dining, late departure requested'}

Include:
- Subject Line
- Personalized Salutation
- Gracious recognition of their loyalty and specific request
- Curated luxury offer or solution
- Signature from the Executive Management Team`;

      const response = await genAI.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
        config: { temperature: 0.7 }
      });

      return res.json({ draft: response.text });
    } catch (err) {
      console.error('Gemini API Error in /api/ai/draft-response:', err);
    }
  }

  const draft = `Subject: Warmest Greetings from The Grand Golden Sovereign — ${guestName}

Dear ${guestName},

On behalf of our entire Executive Management and Concierge team, it is an absolute pleasure to welcome you to Suite ${roomNumber || '401'}.

Regarding your inquiry regarding ${scenario || 'your upcoming stay and tailored arrangements'}:
We have taken the liberty of pre-authorizing your preferences with our Front Office Lead and Executive Chef. Your suite has been refreshed according to your discerning standards, and your complimentary chilled vintage champagne is awaiting your arrival in the salon.

Should you require private chauffeur services, reservations at the Veranda dining room, or individualized itinerary planning, please touch 'Concierge' on your suite tablet or reach me directly at extension 100.

With our highest regards,

Julian Montgomery
General Manager
The Grand Golden Sovereign Hotel & Suites`;

  return res.json({ draft });
});

// Setup Vite or static files
async function startServer() {
  const isProd = process.env.NODE_ENV === 'production';

  if (!isProd) {
    const vite = await createViteServer({
      server: { middlewareMode: true, hmr: process.env.DISABLE_HMR !== 'true' },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Golden Hotel ERP full-stack server running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
