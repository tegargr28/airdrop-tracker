"use client";

import { useState, useEffect } from "react";
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth, signInWithPopup, GoogleAuthProvider, signOut, onAuthStateChanged } from 'firebase/auth';
import { 
  collection, 
  addDoc, 
  getDocs, 
  updateDoc, 
  deleteDoc, 
  doc,
  query,
  orderBy,
  where
} from "firebase/firestore";

// Firebase CONFIG
const firebaseConfig = {
  apiKey: "AIzaSyAiaWp1r2JYm5jGZdEbkzXR5Cs4_f5SR-0",
  authDomain: "airdrop-trackertgr.firebaseapp.com",
  projectId: "airdrop-trackertgr",
  storageBucket: "airdrop-trackertgr.firebasestorage.app",
  messagingSenderId: "898934999910",
  appId: "1:898934999910:web:ab2a530165bf206aaa96a7"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

type Airdrop = {
  id: string;
  name: string;
  status: string;
  task: string;
  deadline: string;
  note: string;
  reward: string;
  createdAt: number;
  userId: string;
};

export default function Page() {
  const [user, setUser] = useState<any>(null);
  const [authLoading, setAuthLoading] = useState(true);
  
  const [form, setForm] = useState({
    name: "",
    status: "On Going",
    task: "",
    deadline: "",
    note: "",
    reward: "",
  });

  const [data, setData] = useState<Airdrop[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check authentication state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setAuthLoading(false);
      if (currentUser) {
        loadData(currentUser.uid);
      } else {
        setData([]);
        setIsLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  const handleGoogleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      setUser(result.user);
      await loadData(result.user.uid);
    } catch (error) {
      console.error('Login error:', error);
      alert('Gagal login. Coba lagi.');
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      setUser(null);
      setData([]);
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const loadData = async (userId: string) => {
    try {
      setIsLoading(true);
      const q = query(
        collection(db, "airdrops"), 
        where("userId", "==", userId),
        orderBy("createdAt", "desc")
      );
      const querySnapshot = await getDocs(q);
      const airdrops: Airdrop[] = [];
      querySnapshot.forEach((docSnapshot) => {
        airdrops.push({ id: docSnapshot.id, ...docSnapshot.data() } as Airdrop);
      });
      setData(airdrops);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const addAirdrop = async () => {
    if (!form.name.trim() || !user) return;

    try {
      const newAirdrop = {
        name: form.name,
        status: form.status,
        task: form.task,
        deadline: form.deadline,
        note: form.note,
        reward: form.reward,
        createdAt: Date.now(),
        userId: user.uid
      };

      await addDoc(collection(db, "airdrops"), newAirdrop);
      await loadData(user.uid);

      setForm({
        name: "",
        status: "On Going",
        task: "",
        deadline: "",
        note: "",
        reward: "",
      });
    } catch (error) {
      console.error('Error adding airdrop:', error);
      alert('Error: ' + error);
    }
  };

  const updateStatus = async (id: string, newStatus: string) => {
    try {
      await updateDoc(doc(db, "airdrops", id), { status: newStatus });
      if (user) await loadData(user.uid);
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

  const updateReward = async (id: string, newReward: string) => {
    try {
      await updateDoc(doc(db, "airdrops", id), { reward: newReward });
      if (user) await loadData(user.uid);
      setEditingId(null);
    } catch (error) {
      console.error('Error updating reward:', error);
    }
  };

  const deleteAirdrop = async (id: string) => {
    if (confirm('Yakin ingin menghapus airdrop ini?')) {
      try {
        await deleteDoc(doc(db, "airdrops", id));
        if (user) await loadData(user.uid);
      } catch (error) {
        console.error('Error deleting airdrop:', error);
      }
    }
  };

  const clearAllData = async () => {
    if (confirm('Yakin ingin menghapus SEMUA data?')) {
      try {
        const deletePromises = data.map(item => deleteDoc(doc(db, "airdrops", item.id)));
        await Promise.all(deletePromises);
        if (user) await loadData(user.uid);
      } catch (error) {
        console.error('Error clearing data:', error);
      }
    }
  };

  const totalReward = data.reduce((sum, item) => {
    const amount = parseFloat(item.reward.replace(/[^0-9.-]/g, ''));
    return sum + (isNaN(amount) ? 0 : amount);
  }, 0);

  // Login screen
  if (authLoading) {
    return (
      <div style={{
        minHeight: '100vh',
        backgroundColor: '#000000',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#ffffff'
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>⏳</div>
          <div>Loading...</div>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div style={{
        minHeight: '100vh',
        backgroundColor: '#000000',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#ffffff',
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
      }}>
        <div style={{ textAlign: 'center', maxWidth: '400px', padding: '24px' }}>
          <h1 style={{ 
            fontSize: '42px', 
            fontWeight: '700',
            marginBottom: '16px',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            display: 'inline-block'
          }}>
            🎈 Airdrop Tracker
          </h1>
          <p style={{ color: '#888888', marginBottom: '32px', fontSize: '15px' }}>
            Track airdrop Anda dengan aman. Data pribadi Anda terlindungi.
          </p>
          
          <button
            onClick={handleGoogleLogin}
            style={{
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: '#ffffff',
              border: 'none',
              borderRadius: '12px',
              padding: '16px 32px',
              fontSize: '16px',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.2s',
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              margin: '0 auto'
            }}
            onMouseOver={(e) => e.currentTarget.style.opacity = '0.9'}
            onMouseOut={(e) => e.currentTarget.style.opacity = '1'}
          >
            <span style={{ fontSize: '20px' }}>🔐</span>
            Login dengan Google
          </button>

          <p style={{ color: '#555555', marginTop: '24px', fontSize: '13px' }}>
            Setiap user memiliki data pribadi yang terpisah dan aman
          </p>
        </div>
      </div>
    );
  }

  // Main app (when logged in)
  if (isLoading) {
    return (
      <div style={{
        minHeight: '100vh',
        backgroundColor: '#000000',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#ffffff'
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>⏳</div>
          <div>Loading data Anda...</div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ 
      minHeight: '100vh', 
      backgroundColor: '#000000',
      color: '#ffffff',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
    }}>
      <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '40px 24px' }}>
        
        <div style={{ marginBottom: '48px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <h1 style={{ 
              fontSize: '42px', 
              fontWeight: '700',
              marginBottom: '8px',
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              display: 'inline-block'
            }}>
              🎈 CherryHijau_ Airdrop Tracker 
            </h1>
            <p style={{ color: '#888888', fontSize: '14px' }}>
              👋 Hi, {user.displayName} • 🔒 Data pribadi Anda
            </p>
          </div>
          
          <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
            {data.length > 0 && (
              <button
                onClick={clearAllData}
                style={{
                  backgroundColor: '#7f1d1d',
                  color: '#fca5a5',
                  border: 'none',
                  borderRadius: '8px',
                  padding: '10px 20px',
                  fontSize: '14px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
              >
                🗑️ Hapus Semua
              </button>
            )}
            <button
              onClick={handleLogout}
              style={{
                backgroundColor: '#1a1a1a',
                color: '#888888',
                border: '1px solid #2a2a2a',
                borderRadius: '8px',
                padding: '10px 20px',
                fontSize: '14px',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.backgroundColor = '#2a2a2a';
                e.currentTarget.style.color = '#ffffff';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.backgroundColor = '#1a1a1a';
                e.currentTarget.style.color = '#888888';
              }}
            >
              🚪 Logout
            </button>
          </div>
        </div>

        <div style={{
          backgroundColor: '#0a0a0a',
          border: '1px solid #1a1a1a',
          borderRadius: '16px',
          padding: '32px',
          marginBottom: '32px',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.3)'
        }}>
          <h2 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '24px', color: '#ffffff' }}>
            ✨ Tambah Airdrop Baru
          </h2>

          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
            gap: '16px',
            marginBottom: '16px'
          }}>
            <input
              placeholder="Nama Project"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              style={{
                backgroundColor: '#141414',
                color: '#ffffff',
                border: '1px solid #2a2a2a',
                borderRadius: '10px',
                padding: '14px 16px',
                fontSize: '15px',
                outline: 'none',
              }}
              onFocus={(e) => e.target.style.borderColor = '#667eea'}
              onBlur={(e) => e.target.style.borderColor = '#2a2a2a'}
            />

            <select
              value={form.status}
              onChange={(e) => setForm({ ...form, status: e.target.value })}
              style={{
                backgroundColor: '#141414',
                color: '#ffffff',
                border: '1px solid #2a2a2a',
                borderRadius: '10px',
                padding: '14px 16px',
                fontSize: '15px',
                outline: 'none',
                cursor: 'pointer'
              }}
            >
              <option style={{ backgroundColor: '#141414' }}>On Going</option>
              <option style={{ backgroundColor: '#141414' }}>Done</option>
              <option style={{ backgroundColor: '#141414' }}>Dropped</option>
            </select>

            <input
              placeholder="Task"
              value={form.task}
              onChange={(e) => setForm({ ...form, task: e.target.value })}
              style={{
                backgroundColor: '#141414',
                color: '#ffffff',
                border: '1px solid #2a2a2a',
                borderRadius: '10px',
                padding: '14px 16px',
                fontSize: '15px',
                outline: 'none'
              }}
              onFocus={(e) => e.target.style.borderColor = '#667eea'}
              onBlur={(e) => e.target.style.borderColor = '#2a2a2a'}
            />

            <input
              placeholder="Deadline"
              value={form.deadline}
              onChange={(e) => setForm({ ...form, deadline: e.target.value })}
              style={{
                backgroundColor: '#141414',
                color: '#ffffff',
                border: '1px solid #2a2a2a',
                borderRadius: '10px',
                padding: '14px 16px',
                fontSize: '15px',
                outline: 'none'
              }}
              onFocus={(e) => e.target.style.borderColor = '#667eea'}
              onBlur={(e) => e.target.style.borderColor = '#2a2a2a'}
            />

            <input
              placeholder="Reward (500 USDT)"
              value={form.reward}
              onChange={(e) => setForm({ ...form, reward: e.target.value })}
              style={{
                backgroundColor: '#141414',
                color: '#ffffff',
                border: '1px solid #2a2a2a',
                borderRadius: '10px',
                padding: '14px 16px',
                fontSize: '15px',
                outline: 'none'
              }}
              onFocus={(e) => e.target.style.borderColor = '#667eea'}
              onBlur={(e) => e.target.style.borderColor = '#2a2a2a'}
            />
          </div>

          <textarea
            placeholder="Catatan tambahan..."
            value={form.note}
            onChange={(e) => setForm({ ...form, note: e.target.value })}
            rows={2}
            style={{
              width: '100%',
              backgroundColor: '#141414',
              color: '#ffffff',
              border: '1px solid #2a2a2a',
              borderRadius: '10px',
              padding: '14px 16px',
              fontSize: '15px',
              outline: 'none',
              resize: 'vertical',
              marginBottom: '16px',
              fontFamily: 'inherit'
            }}
            onFocus={(e) => e.target.style.borderColor = '#667eea'}
            onBlur={(e) => e.target.style.borderColor = '#2a2a2a'}
          />

          <button
            onClick={addAirdrop}
            style={{
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: '#ffffff',
              border: 'none',
              borderRadius: '10px',
              padding: '14px 32px',
              fontSize: '15px',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.2s',
              width: '100%'
            }}
            onMouseOver={(e) => e.currentTarget.style.opacity = '0.9'}
            onMouseOut={(e) => e.currentTarget.style.opacity = '1'}
          >
            ➕ Tambah Airdrop
          </button>
        </div>

        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '16px',
          marginBottom: '32px'
        }}>
          <div style={{
            backgroundColor: '#0a0a0a',
            border: '1px solid #1a1a1a',
            borderRadius: '12px',
            padding: '20px',
          }}>
            <div style={{ color: '#888888', fontSize: '13px', marginBottom: '4px' }}>Total Airdrop</div>
            <div style={{ fontSize: '32px', fontWeight: '700' }}>{data.length}</div>
          </div>
          <div style={{
            backgroundColor: '#0a0a0a',
            border: '1px solid #1a1a1a',
            borderRadius: '12px',
            padding: '20px',
          }}>
            <div style={{ color: '#888888', fontSize: '13px', marginBottom: '4px' }}>On Going</div>
            <div style={{ fontSize: '32px', fontWeight: '700', color: '#3b82f6' }}>
              {data.filter(d => d.status === 'On Going').length}
            </div>
          </div>
          <div style={{
            backgroundColor: '#0a0a0a',
            border: '1px solid #1a1a1a',
            borderRadius: '12px',
            padding: '20px',
          }}>
            <div style={{ color: '#888888', fontSize: '13px', marginBottom: '4px' }}>Done</div>
            <div style={{ fontSize: '32px', fontWeight: '700', color: '#10b981' }}>
              {data.filter(d => d.status === 'Done').length}
            </div>
          </div>
          <div style={{
            backgroundColor: '#0a0a0a',
            border: '1px solid #1a1a1a',
            borderRadius: '12px',
            padding: '20px',
          }}>
            <div style={{ color: '#888888', fontSize: '13px', marginBottom: '4px' }}>💰 Total Reward</div>
            <div style={{ fontSize: '28px', fontWeight: '700', color: '#fbbf24' }}>
              {totalReward > 0 ? `$${totalReward.toFixed(2)}` : '-'}
            </div>
          </div>
        </div>

        <div style={{
          backgroundColor: '#0a0a0a',
          border: '1px solid #1a1a1a',
          borderRadius: '16px',
          overflow: 'hidden'
        }}>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '900px' }}>
              <thead>
                <tr style={{ backgroundColor: '#141414' }}>
                  <th style={{ padding: '16px', textAlign: 'left', fontSize: '13px', fontWeight: '600', color: '#888888', textTransform: 'uppercase' }}>Nama</th>
                  <th style={{ padding: '16px', textAlign: 'left', fontSize: '13px', fontWeight: '600', color: '#888888', textTransform: 'uppercase' }}>Status</th>
                  <th style={{ padding: '16px', textAlign: 'left', fontSize: '13px', fontWeight: '600', color: '#888888', textTransform: 'uppercase' }}>Task</th>
                  <th style={{ padding: '16px', textAlign: 'left', fontSize: '13px', fontWeight: '600', color: '#888888', textTransform: 'uppercase' }}>Deadline</th>
                  <th style={{ padding: '16px', textAlign: 'left', fontSize: '13px', fontWeight: '600', color: '#888888', textTransform: 'uppercase' }}>💰 Reward</th>
                  <th style={{ padding: '16px', textAlign: 'left', fontSize: '13px', fontWeight: '600', color: '#888888', textTransform: 'uppercase' }}>Catatan</th>
                  <th style={{ padding: '16px', textAlign: 'center', fontSize: '13px', fontWeight: '600', color: '#888888', textTransform: 'uppercase' }}>Aksi</th>
                </tr>
              </thead>
              <tbody>
                {data.map((item) => (
                  <tr
                    key={item.id}
                    style={{
                      borderTop: '1px solid #1a1a1a',
                      transition: 'background-color 0.2s'
                    }}
                    onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#141414'}
                    onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                  >
                    <td style={{ padding: '16px', fontWeight: '600', fontSize: '15px' }}>{item.name}</td>
                    <td style={{ padding: '16px' }}>
                      <select
                        value={item.status}
                        onChange={(e) => updateStatus(item.id, e.target.value)}
                        style={{
                          padding: '6px 12px',
                          borderRadius: '20px',
                          fontSize: '13px',
                          fontWeight: '600',
                          backgroundColor: item.status === 'On Going' ? '#1e3a8a' : item.status === 'Done' ? '#065f46' : '#7f1d1d',
                          color: item.status === 'On Going' ? '#93c5fd' : item.status === 'Done' ? '#6ee7b7' : '#fca5a5',
                          border: 'none',
                          cursor: 'pointer',
                          outline: 'none'
                        }}
                      >
                        <option value="On Going" style={{ backgroundColor: '#141414' }}>On Going</option>
                        <option value="Done" style={{ backgroundColor: '#141414' }}>Done</option>
                        <option value="Dropped" style={{ backgroundColor: '#141414' }}>Dropped</option>
                      </select>
                    </td>
                    <td style={{ padding: '16px', color: '#cccccc' }}>{item.task}</td>
                    <td style={{ padding: '16px', color: '#cccccc' }}>{item.deadline}</td>
                    <td style={{ padding: '16px' }}>
                      {editingId === item.id ? (
                        <input
                          autoFocus
                          defaultValue={item.reward}
                          onBlur={(e) => updateReward(item.id, e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              updateReward(item.id, e.currentTarget.value);
                            }
                          }}
                          style={{
                            backgroundColor: '#141414',
                            color: '#fbbf24',
                            border: '1px solid #667eea',
                            borderRadius: '6px',
                            padding: '6px 10px',
                            fontSize: '14px',
                            width: '120px',
                            outline: 'none'
                          }}
                        />
                      ) : (
                        <div
                          onClick={() => setEditingId(item.id)}
                          style={{
                            color: item.reward ? '#fbbf24' : '#555555',
                            fontWeight: '600',
                            cursor: 'pointer',
                            fontSize: '14px'
                          }}
                        >
                          {item.reward || 'Klik untuk isi'}
                        </div>
                      )}
                    </td>
                    <td style={{ padding: '16px', color: '#888888', fontSize: '14px', maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.note}</td>
                    <td style={{ padding: '16px', textAlign: 'center' }}>
                      <button
                        onClick={() => deleteAirdrop(item.id)}
                        style={{
                          backgroundColor: 'transparent',
                          color: '#888888',
                          border: 'none',
                          borderRadius: '6px',
                          padding: '6px 12px',
                          fontSize: '18px',
                          cursor: 'pointer',
                          transition: 'all 0.2s'
                        }}
                        onMouseOver={(e) => {
                          e.currentTarget.style.backgroundColor = '#7f1d1d';
                          e.currentTarget.style.color = '#fca5a5';
                        }}
                        onMouseOut={(e) => {
                          e.currentTarget.style.backgroundColor = 'transparent';
                          e.currentTarget.style.color = '#888888';
                        }}
                      >
                        🗑️
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {data.length === 0 && (
          <div style={{ textAlign: 'center', padding: '60px 20px', color: '#555555' }}>
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>🔭</div>
            <div style={{ fontSize: '18px', fontWeight: '600', marginBottom: '8px' }}>Belum ada airdrop</div>
            <div style={{ fontSize: '14px' }}>Tambahkan airdrop pertama Anda di form di atas</div>
          </div>
        )}

      </div>
    </div>
  );
}