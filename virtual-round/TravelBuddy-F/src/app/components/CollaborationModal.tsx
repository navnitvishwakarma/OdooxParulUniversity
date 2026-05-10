import { useState } from 'react';
import { toast } from 'sonner';
import { Users, X, Copy, Check, Link, Mail } from 'lucide-react';
import { GlassCard } from './GlassCard';

interface Props { tripId: string; tripName: string; onClose: () => void; }

const FAKE_COLLABORATORS = [
  { name: 'You (Owner)', email: 'you@example.com', avatar: 'Y', color: '#4F46E5', status: 'online' },
  { name: 'Sarah Chen', email: 'sarah@example.com', avatar: 'S', color: '#06B6D4', status: 'online' },
  { name: 'Mike Ross', email: 'mike@example.com', avatar: 'M', color: '#F97316', status: 'away' },
];

export function CollaborationModal({ tripId, tripName, onClose }: Props) {
  const [copied, setCopied] = useState(false);
  const [email, setEmail] = useState('');
  const shareUrl = `${window.location.origin}/trip/${tripId}/view`;

  const copyLink = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    toast.success('Link copied!');
    setTimeout(() => setCopied(false), 2000);
  };

  const invite = () => {
    if (!email.trim()) return;
    toast.success(`Invitation sent to ${email}`);
    setEmail('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(8px)' }}>
      <GlassCard className="w-full max-w-md p-6 relative">
        <button onClick={onClose} className="absolute top-4 right-4 p-2 hover:bg-white/10 rounded-lg"><X className="w-5 h-5" /></button>
        <h2 className="text-xl font-bold mb-1 flex items-center gap-2"><Users className="w-5 h-5 text-primary" /> Collaborate</h2>
        <p className="text-sm text-muted-foreground mb-5">Invite others to plan <span className="text-foreground font-medium">"{tripName}"</span> together</p>

        <div className="mb-5">
          <p className="text-xs text-muted-foreground mb-2 font-medium">SHARE LINK</p>
          <div className="flex gap-2">
            <div className="flex-1 flex items-center gap-2 bg-input-background border border-border rounded-xl px-3 py-2.5 text-sm overflow-hidden">
              <Link className="w-4 h-4 text-muted-foreground shrink-0" />
              <span className="truncate text-muted-foreground text-xs">{shareUrl}</span>
            </div>
            <button onClick={copyLink} className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-medium transition-all ${copied ? 'bg-green-500/20 text-green-400 border border-green-500/30' : 'bg-primary/20 text-primary border border-primary/30 hover:bg-primary/30'}`}>
              {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              {copied ? 'Copied!' : 'Copy'}
            </button>
          </div>
        </div>

        <div className="mb-5">
          <p className="text-xs text-muted-foreground mb-2 font-medium">INVITE BY EMAIL</p>
          <div className="flex gap-2">
            <div className="flex-1 flex items-center gap-2 bg-input-background border border-border rounded-xl px-3 py-2.5">
              <Mail className="w-4 h-4 text-muted-foreground" />
              <input value={email} onChange={e => setEmail(e.target.value)} onKeyDown={e => e.key === 'Enter' && invite()} placeholder="friend@example.com" className="flex-1 bg-transparent text-sm focus:outline-none" />
            </div>
            <button onClick={invite} className="px-4 py-2 bg-gradient-to-r from-primary to-secondary rounded-xl text-white text-sm font-medium hover:opacity-90 transition-all">Invite</button>
          </div>
        </div>

        <div>
          <p className="text-xs text-muted-foreground mb-3 font-medium">CURRENTLY COLLABORATING</p>
          <div className="space-y-2">
            {FAKE_COLLABORATORS.map((c, i) => (
              <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-border/50">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <div className="w-9 h-9 rounded-full flex items-center justify-center text-white text-sm font-bold" style={{ background: c.color }}>{c.avatar}</div>
                    <div className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-background ${c.status === 'online' ? 'bg-green-500' : 'bg-yellow-500'}`} />
                  </div>
                  <div>
                    <p className="text-sm font-medium">{c.name}</p>
                    <p className="text-xs text-muted-foreground">{c.email}</p>
                  </div>
                </div>
                <span className={`text-xs px-2 py-0.5 rounded-full ${c.status === 'online' ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-400'}`}>{c.status}</span>
              </div>
            ))}
          </div>
        </div>
      </GlassCard>
    </div>
  );
}
