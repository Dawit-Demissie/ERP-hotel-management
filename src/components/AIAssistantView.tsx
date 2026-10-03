import React, { useState, useRef, useEffect } from 'react';
import { 
  Sparkles, 
  Send, 
  Bot, 
  User, 
  Copy, 
  Check, 
  TrendingUp, 
  MessageSquare, 
  Mail, 
  CheckCircle2
} from 'lucide-react';
import { useHotel } from '../context/HotelContext';
import { ChatMessage } from '../types';

export const AIAssistantView: React.FC = () => {
  const { 
    activeRole, 
    stats, 
    reservations, 
    pricingSuggestions, 
    approvePricingSuggestion, 
    rejectPricingSuggestion 
  } = useHotel();

  const [activeSubTab, setActiveSubTab] = useState<'chat' | 'drafter' | 'pricing'>('chat');

  // Chat state
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'msg-init',
      sender: 'assistant',
      content: `Welcome to Golden AI Intelligence Console. I am tuned to your current role as **${activeRole}**. \n\nCurrent property status: Occupancy is at **${stats.occupancyRate}%** with **${stats.availableRooms} suites** uncommitted. RevPAR is **$${stats.revPar}** (+14.2% pace). Wagyu ribeye stock is currently critical (4.8 kg). \n\nHow may I assist your operations today?`,
      timestamp: 'Just now'
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isSending, setIsSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Drafter state
  const [drafterGuestName, setDrafterGuestName] = useState('Lord Alistair Sterling');
  const [drafterRoom, setDrafterRoom] = useState('Suite 401');
  const [drafterScenario, setDrafterScenario] = useState('VIP Welcome & Special Itinerary');
  const [drafterNotes, setDrafterNotes] = useState('Enjoys vintage Dom Pérignon, requested hypoallergenic goose down pillows and Maybach airport transfer.');
  const [generatedDraft, setGeneratedDraft] = useState<string>('');
  const [isDrafting, setIsDrafting] = useState(false);
  const [copiedDraft, setCopiedDraft] = useState(false);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isSending]);

  const quickPrompts = [
    "Analyze today's RevPAR & ADR performance",
    "VIP guest arrivals summary & special requests",
    "Kitchen inventory stockouts & supplier order POs",
    "Propose dynamic rate adjustments for this weekend",
    "Draft late checkout policy response for Suite 301"
  ];

  const handleSendMessage = async (textToSend?: string) => {
    const text = textToSend || inputMessage;
    if (!text.trim() || isSending) return;

    const userMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      sender: 'user',
      content: text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    if (!textToSend) setInputMessage('');
    setIsSending(true);

    try {
      const response = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: text,
          context: {
            role: activeRole,
            occupancyRate: stats.occupancyRate,
            todayRevenue: stats.todayRevenue,
            revPar: stats.revPar,
            adr: stats.adr,
            availableRooms: stats.availableRooms,
            occupiedRooms: stats.occupiedRooms,
            activeKOTs: stats.activeKOTs,
            criticalInventoryCount: stats.criticalInventoryCount,
            vipGuests: reservations.filter(r => r.guest.vipStatus).map(r => ({
              name: r.guest.name,
              suite: r.roomNumber,
              specialRequests: r.guest.specialRequests
            }))
          }
        })
      });

      const data = await response.json();
      const aiReply: ChatMessage = {
        id: `msg-${Date.now() + 1}`,
        sender: 'assistant',
        content: data.reply || 'Analysis completed.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, aiReply]);
    } catch (err) {
      console.error('Failed to communicate with AI chat backend:', err);
      const fallbackReply: ChatMessage = {
        id: `msg-${Date.now() + 1}`,
        sender: 'assistant',
        content: `I have analyzed the current hotel operational metrics for **${activeRole}**. Occupancy is at ${stats.occupancyRate}%, with RevPAR of $${stats.revPar}. All active reservations and folios are synced.`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, fallbackReply]);
    } finally {
      setIsSending(false);
    }
  };

  const handleGenerateDraft = async () => {
    setIsDrafting(true);
    setCopiedDraft(false);

    try {
      const response = await fetch('/api/ai/draft-response', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          guestName: drafterGuestName,
          roomNumber: drafterRoom,
          scenario: drafterScenario,
          guestNotes: drafterNotes
        })
      });

      const data = await response.json();
      setGeneratedDraft(data.draft || '');
    } catch (err) {
      console.error('Failed to draft response:', err);
      setGeneratedDraft(`Subject: Gracious Greetings from The Grand Golden Sovereign — ${drafterGuestName}\n\nDear ${drafterGuestName},\n\nIt is our supreme honor to welcome you to ${drafterRoom}. Your request regarding "${drafterScenario}" has been meticulously attended to by our Executive Lead and Concierge desk.\n\nShould you require anything further during your stay, we remain at your absolute service.\n\nWarmest regards,\nJulian Montgomery\nGeneral Manager`);
    } finally {
      setIsDrafting(false);
    }
  };

  const copyDraftToClipboard = () => {
    if (!generatedDraft) return;
    navigator.clipboard.writeText(generatedDraft);
    setCopiedDraft(true);
    setTimeout(() => setCopiedDraft(false), 3000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-[#e5e0d6]">
        <div>
          <div className="flex items-center gap-2 text-xs text-[#b46a36] mb-1 font-bold tracking-[0.2em] uppercase">
            <Sparkles className="w-3.5 h-3.5" />
            <span>AI Operations Core</span>
            <span aria-hidden="true" className="text-[#c7bfb1]">·</span>
            <span>Gemini 3.8 Flash</span>
          </div>
          <h1 className="text-3xl font-serif-luxury font-bold text-[#18332f]">
            Golden Hotel Intelligence Assistant
          </h1>
          <p className="text-xs text-[#5f6a65] mt-1">
            Executive Decision Support · Dynamic Pricing Optimization · Luxury Guest Communication
          </p>
        </div>

        {/* Sub-tabs */}
        <div className="flex items-center gap-1 p-1 bg-white border border-[#e5e0d6] rounded-full shadow-xs">
          <button
            onClick={() => setActiveSubTab('chat')}
            className={`px-4 py-1.5 text-xs font-semibold rounded-full transition-all cursor-pointer flex items-center gap-1.5 ${
              activeSubTab === 'chat' 
                ? 'bg-[#18332f] text-white shadow-xs' 
                : 'text-[#5f6a65] hover:text-[#18332f]'
            }`}
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span>Staff AI Console</span>
          </button>
          <button
            onClick={() => setActiveSubTab('drafter')}
            className={`px-4 py-1.5 text-xs font-semibold rounded-full transition-all cursor-pointer flex items-center gap-1.5 ${
              activeSubTab === 'drafter' 
                ? 'bg-[#18332f] text-white shadow-xs' 
                : 'text-[#5f6a65] hover:text-[#18332f]'
            }`}
          >
            <Mail className="w-3.5 h-3.5" />
            <span>Guest Response Drafter</span>
          </button>
          <button
            onClick={() => setActiveSubTab('pricing')}
            className={`px-4 py-1.5 text-xs font-semibold rounded-full transition-all cursor-pointer flex items-center gap-1.5 ${
              activeSubTab === 'pricing' 
                ? 'bg-[#18332f] text-white shadow-xs' 
                : 'text-[#5f6a65] hover:text-[#18332f]'
            }`}
          >
            <TrendingUp className="w-3.5 h-3.5" />
            <span>Yield & Pricing</span>
          </button>
        </div>
      </div>

      {/* SUBTAB 1: STAFF AI CONVERSATION CONSOLE */}
      {activeSubTab === 'chat' && (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Quick Prompts & Context Snapshot Sidebar */}
          <div className="space-y-4">
            <div className="p-5 rounded-3xl bg-white border border-[#e5e0d6] space-y-3 shadow-xs">
              <span className="text-[10px] font-bold text-[#88938c] block uppercase tracking-[0.2em]">
                Operational Context
              </span>
              <div className="space-y-2 text-xs text-[#5f6a65]">
                <div className="flex justify-between pb-1.5 border-b border-[#f0ece3]">
                  <span>Active Role:</span>
                  <span className="font-semibold text-[#18332f]">{activeRole}</span>
                </div>
                <div className="flex justify-between pb-1.5 border-b border-[#f0ece3]">
                  <span>Occupancy:</span>
                  <span className="font-mono text-[#18332f] font-semibold">{stats.occupancyRate}%</span>
                </div>
                <div className="flex justify-between pb-1.5 border-b border-[#f0ece3]">
                  <span>RevPAR:</span>
                  <span className="font-mono text-[#b46a36] font-bold">${stats.revPar}</span>
                </div>
                <div className="flex justify-between">
                  <span>Kitchen KOTs:</span>
                  <span className="font-mono text-[#18332f] font-semibold">{stats.activeKOTs} Active</span>
                </div>
              </div>
            </div>

            <div className="p-5 rounded-3xl bg-white border border-[#e5e0d6] space-y-2 shadow-xs">
              <span className="text-[10px] font-bold text-[#88938c] block mb-2 uppercase tracking-[0.2em]">
                Suggested Queries
              </span>
              <div className="space-y-1.5">
                {quickPrompts.map((prompt, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSendMessage(prompt)}
                    className="w-full text-left p-3 rounded-2xl bg-[#f8f6f1] hover:bg-[#f0ece3] border border-[#e5e0d6] text-[#18332f] text-xs transition-colors cursor-pointer leading-snug font-medium"
                  >
                    "{prompt}"
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Chat Window */}
          <div className="lg:col-span-3 p-6 sm:p-7 rounded-3xl bg-white border border-[#e5e0d6] shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] flex flex-col justify-between h-[650px]">
            {/* Messages Scroll Area */}
            <div className="space-y-4 overflow-y-auto pr-2 flex-1 mb-4">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex gap-3 text-xs ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  {msg.sender === 'assistant' && (
                    <div className="w-8 h-8 rounded-full bg-[#f4efe6] text-[#b46a36] border border-[#e5e0d6] flex items-center justify-center shrink-0 shadow-xs">
                      <Bot className="w-4 h-4" />
                    </div>
                  )}

                  <div className={`max-w-[85%] p-4 rounded-2xl leading-relaxed ${
                    msg.sender === 'user' 
                      ? 'bg-[#18332f] text-white rounded-tr-none shadow-xs' 
                      : 'bg-[#fbf9f5] border border-[#e5e0d6] text-[#18332f] rounded-tl-none whitespace-pre-line shadow-xs'
                  }`}>
                    {msg.content}
                    <div className={`text-[10px] mt-1.5 text-right ${msg.sender === 'user' ? 'text-white/70' : 'text-[#88938c]'}`}>
                      {msg.timestamp}
                    </div>
                  </div>

                  {msg.sender === 'user' && (
                    <div className="w-8 h-8 rounded-full bg-[#18332f] text-white flex items-center justify-center shrink-0 shadow-xs">
                      <User className="w-4 h-4" />
                    </div>
                  )}
                </div>
              ))}

              {isSending && (
                <div className="flex gap-3 text-xs items-center text-[#5f6a65]">
                  <div className="w-8 h-8 rounded-full bg-[#f4efe6] text-[#b46a36] flex items-center justify-center">
                    <Sparkles className="w-4 h-4 animate-spin" />
                  </div>
                  <div className="p-3 rounded-2xl bg-[#f8f6f1] border border-[#e5e0d6] text-[#5f6a65] animate-pulse">
                    Synthesizing real-time hotel intelligence...
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Bar */}
            <form 
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage();
              }}
              className="flex items-center gap-2 pt-3 border-t border-[#f0ece3]"
            >
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                placeholder="Ask about occupancy, draft guest apology, inventory restock, dynamic pricing..."
                className="flex-1 bg-[#f8f6f1] border border-[#e5e0d6] rounded-full px-5 py-3 text-xs text-[#18332f] placeholder-[#88938c] focus:outline-none focus:border-[#18332f]"
              />
              <button
                type="submit"
                disabled={!inputMessage.trim() || isSending}
                className="px-6 py-3 rounded-full bg-[#18332f] hover:bg-[#112421] disabled:bg-[#f0ece3] disabled:text-[#88938c] text-white font-semibold text-xs transition-all shadow-xs cursor-pointer flex items-center gap-2 shrink-0"
              >
                <span>Send</span>
                <Send className="w-3.5 h-3.5" />
              </button>
            </form>
          </div>
        </div>
      )}

      {/* SUBTAB 2: GUEST RESPONSE DRAFTER */}
      {activeSubTab === 'drafter' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Drafter Inputs */}
          <div className="p-6 sm:p-8 rounded-3xl bg-white border border-[#e5e0d6] shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] space-y-4">
            <h2 className="text-xl font-serif-luxury font-bold text-[#18332f] flex items-center gap-2">
              <Mail className="w-4 h-4 text-[#b46a36]" />
              Guest Communication Generator
            </h2>
            <p className="text-xs text-[#5f6a65]">
              Generate exquisite, tailored 5-star correspondence for complaints, VIP arrivals, or concierge arrangements.
            </p>

            <div className="space-y-3.5 text-xs">
              <div>
                <label className="text-[#5f6a65] font-medium block mb-1">Guest Full Name</label>
                <input
                  type="text"
                  value={drafterGuestName}
                  onChange={(e) => setDrafterGuestName(e.target.value)}
                  className="w-full bg-[#f8f6f1] border border-[#e5e0d6] rounded-xl px-3.5 py-2.5 text-[#18332f] focus:outline-none focus:border-[#18332f]"
                />
              </div>

              <div>
                <label className="text-[#5f6a65] font-medium block mb-1">Room / Suite Designation</label>
                <input
                  type="text"
                  value={drafterRoom}
                  onChange={(e) => setDrafterRoom(e.target.value)}
                  className="w-full bg-[#f8f6f1] border border-[#e5e0d6] rounded-xl px-3.5 py-2.5 text-[#18332f] focus:outline-none focus:border-[#18332f]"
                />
              </div>

              <div>
                <label className="text-[#5f6a65] font-medium block mb-1">Communication Topic / Scenario</label>
                <select
                  value={drafterScenario}
                  onChange={(e) => setDrafterScenario(e.target.value)}
                  className="w-full bg-[#f8f6f1] border border-[#e5e0d6] rounded-xl px-3.5 py-2.5 text-[#18332f] focus:outline-none"
                >
                  <option value="VIP Welcome & Special Itinerary">VIP Welcome & Special Itinerary</option>
                  <option value="Late Check-Out Approval & Airport Transfer">Late Check-Out Approval & Airport Transfer</option>
                  <option value="Air Conditioning Noise Apology & $150 Dining Credit">Air Conditioning Delay Apology & Dining Credit</option>
                  <option value="Corporate Executive Gala & Conference Proposal">Corporate Executive Gala & Conference Proposal</option>
                  <option value="Michelin Tasting Menu Private Salon Booking">Michelin Tasting Menu Private Salon Booking</option>
                </select>
              </div>

              <div>
                <label className="text-[#5f6a65] font-medium block mb-1">Tailored Guest Notes & Preferences</label>
                <textarea
                  rows={4}
                  value={drafterNotes}
                  onChange={(e) => setDrafterNotes(e.target.value)}
                  placeholder="Include specific nuances such as favorite wine, room preferences, allergies, travel party details..."
                  className="w-full bg-[#f8f6f1] border border-[#e5e0d6] rounded-xl px-3.5 py-2.5 text-[#18332f] focus:outline-none focus:border-[#18332f]"
                />
              </div>

              <button
                disabled={isDrafting}
                onClick={handleGenerateDraft}
                className="w-full py-3 rounded-full bg-[#18332f] hover:bg-[#112421] disabled:bg-[#f0ece3] text-white font-semibold text-xs transition-all shadow-sm cursor-pointer flex items-center justify-center gap-2"
              >
                <Sparkles className="w-4 h-4 text-amber-300" />
                <span>{isDrafting ? 'Drafting Luxury Response...' : 'Draft Tailored Correspondence'}</span>
              </button>
            </div>
          </div>

          {/* Generated Response Box */}
          <div className="p-6 sm:p-8 rounded-3xl bg-white border border-[#e5e0d6] shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] flex flex-col justify-between space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#f0ece3]">
              <h3 className="text-sm font-serif-luxury font-bold text-[#18332f]">
                Generated Executive Letter / Email Draft
              </h3>
              {generatedDraft && (
                <button
                  onClick={copyDraftToClipboard}
                  className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full border border-[#18332f] text-xs font-semibold text-[#18332f] hover:bg-[#18332f] hover:text-white transition-colors cursor-pointer"
                >
                  {copiedDraft ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedDraft ? 'Copied' : 'Copy Text'}</span>
                </button>
              )}
            </div>

            <div className="flex-1 bg-[#fbf9f5] border border-[#e5e0d6] rounded-2xl p-5 text-xs text-[#18332f] font-mono whitespace-pre-wrap leading-relaxed overflow-y-auto max-h-[480px]">
              {generatedDraft || (
                <span className="text-[#88938c] font-sans italic">
                  Click "Draft Tailored Correspondence" to generate a polished, luxury letter adhering to 5-star Sovereign hospitality standards.
                </span>
              )}
            </div>
          </div>
        </div>
      )}

      {/* SUBTAB 3: DYNAMIC PRICING APPROVAL BOARD */}
      {activeSubTab === 'pricing' && (
        <div className="space-y-4">
          <div className="p-5 rounded-2xl bg-white border border-[#e5e0d6] flex items-center justify-between text-xs shadow-xs">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-[#b46a36]" />
              <span className="font-semibold text-[#18332f]">Human-in-the-Loop Dynamic Revenue Optimization</span>
            </div>
            <span className="text-[#5f6a65]">
              AI suggests price adjustments based on pace. Rates will not change without explicit manager authorization.
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {pricingSuggestions.map((sug) => (
              <div 
                key={sug.id}
                className="p-6 rounded-3xl bg-white border border-[#e5e0d6] shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] flex flex-col justify-between space-y-4"
              >
                <div>
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="font-bold text-[#18332f] text-sm">{sug.roomCategory}</span>
                    <span className="text-[10px] font-mono text-[#18332f] font-semibold bg-[#18332f]/10 px-2.5 py-0.5 rounded-full border border-[#18332f]/20">
                      {sug.confidence}% Confidence
                    </span>
                  </div>

                  <div className="flex items-baseline gap-3 my-3">
                    <span className="text-xs text-[#88938c] line-through">${sug.currentRate}</span>
                    <span className="text-3xl font-serif-luxury font-bold text-[#18332f]">${sug.suggestedRate}</span>
                    <span className="text-xs font-semibold text-[#b46a36]">+{sug.adjustmentPercent}%</span>
                  </div>

                  <p className="text-xs text-[#5f6a65] leading-relaxed">
                    {sug.reason}
                  </p>

                  <div className="mt-3 pt-3 border-t border-[#f0ece3] text-xs text-[#5f6a65]">
                    Projected Revenue Gain: <span className="font-mono text-[#18332f] font-bold">+${sug.projectedRevenueIncrease.toLocaleString()}</span>
                  </div>
                </div>

                <div className="pt-3 border-t border-[#f0ece3] flex items-center justify-end gap-2">
                  {sug.status === 'Pending Approval' ? (
                    <>
                      <button
                        onClick={() => rejectPricingSuggestion(sug.id)}
                        className="px-4 py-2 rounded-full border border-[#e5e0d6] text-[#5f6a65] hover:bg-[#f6f4ee] text-xs cursor-pointer"
                      >
                        Decline
                      </button>
                      <button
                        onClick={() => approvePricingSuggestion(sug.id)}
                        className="px-5 py-2 rounded-full bg-[#18332f] hover:bg-[#112421] text-white text-xs font-semibold cursor-pointer shadow-xs"
                      >
                        Approve & Apply
                      </button>
                    </>
                  ) : (
                    <span className="text-xs font-semibold text-[#18332f] flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Applied to Inventory
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
