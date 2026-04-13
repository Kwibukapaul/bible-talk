import { useEffect, useState } from 'react';
import { Mail, Trash2, UserCheck, UserX, Download } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { Subscriber } from '../../lib/types';

export function SubscriberManager() {
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    const { data } = await supabase.from('subscribers').select('*').order('created_at', { ascending: false });
    setSubscribers(data || []);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const handleDelete = async (id: string) => {
    if (!confirm('Remove this subscriber?')) return;
    await supabase.from('subscribers').delete().eq('id', id);
    load();
  };

  const toggleActive = async (sub: Subscriber) => {
    await supabase.from('subscribers').update({ active: !sub.active }).eq('id', sub.id);
    load();
  };

  const exportCsv = () => {
    const rows = subscribers.map((s) => `${s.name || ''},${s.email},${s.active ? 'active' : 'inactive'},${s.created_at}`);
    const csv = ['Name,Email,Status,Date', ...rows].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'subscribers.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  const active = subscribers.filter((s) => s.active).length;
  const inactive = subscribers.length - active;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold text-white">Subscribers</h2>
        <button onClick={exportCsv} className="flex items-center gap-2 px-4 py-2 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-400 text-sm hover:bg-amber-500/20 transition-colors">
          <Download size={15} /> Export CSV
        </button>
      </div>

      <div className="grid grid-cols-3 gap-4 mb-6">
        {[
          { label: 'Total', value: subscribers.length, color: 'text-amber-400' },
          { label: 'Active', value: active, color: 'text-emerald-400' },
          { label: 'Inactive', value: inactive, color: 'text-slate-400' },
        ].map(({ label, value, color }) => (
          <div key={label} className="glass-card rounded-xl p-4 text-center">
            <p className={`text-2xl font-bold ${color}`}>{value}</p>
            <p className="text-slate-400 text-xs mt-0.5">{label}</p>
          </div>
        ))}
      </div>

      {loading ? <div className="text-slate-400 text-sm py-8 text-center">Loading...</div> : subscribers.length === 0 ? (
        <div className="text-center py-16">
          <Mail size={32} className="text-amber-400/30 mx-auto mb-2" />
          <p className="text-slate-500 text-sm">No subscribers yet.</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full admin-table">
            <thead>
              <tr><th>Email</th><th>Name</th><th>Status</th><th>Date</th><th>Actions</th></tr>
            </thead>
            <tbody>
              {subscribers.map((sub) => (
                <tr key={sub.id}>
                  <td className="flex items-center gap-2"><Mail size={13} className="text-amber-400/50" />{sub.email}</td>
                  <td>{sub.name || '—'}</td>
                  <td><span className={`px-2 py-0.5 rounded text-xs ${sub.active ? 'bg-emerald-500/10 text-emerald-400' : 'bg-slate-500/10 text-slate-400'}`}>{sub.active ? 'Active' : 'Inactive'}</span></td>
                  <td className="whitespace-nowrap">{new Date(sub.created_at).toLocaleDateString()}</td>
                  <td>
                    <div className="flex items-center gap-1">
                      <button onClick={() => toggleActive(sub)} title={sub.active ? 'Deactivate' : 'Activate'} className={`p-1.5 rounded transition-colors ${sub.active ? 'text-slate-400 hover:text-amber-400 hover:bg-amber-400/10' : 'text-slate-400 hover:text-emerald-400 hover:bg-emerald-400/10'}`}>
                        {sub.active ? <UserX size={14} /> : <UserCheck size={14} />}
                      </button>
                      <button onClick={() => handleDelete(sub.id)} className="p-1.5 rounded text-slate-400 hover:text-rose-400 hover:bg-rose-400/10 transition-colors"><Trash2 size={14} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
