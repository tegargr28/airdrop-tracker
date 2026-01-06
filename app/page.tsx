'use client';

import React, { useState, useEffect } from 'react';
import { Trash2, Plus, ExternalLink, Award, TrendingUp, Users, Calendar } from 'lucide-react';

/* ===================== TYPES ===================== */
type Category = 'DeFi' | 'NFT' | 'Gaming' | 'Social' | 'Infrastructure';


interface Airdrop {
  id: string;
  name: string;
  category: Category;
  status: string;
  reward: string;
  deadline: string;
  url: string;
  createdAt: string;
}

/* ===================== CONSTANTS ===================== */
const categoryColors: Record<Category, {
  bg: string;
  text: string;
  border: string;
}> = {
  DeFi: { bg: '#1e3a8a', text: '#93c5fd', border: '#3b82f6' },
  NFT: { bg: '#581c87', text: '#e9d5ff', border: '#a855f7' },
  Gaming: { bg: '#14532d', text: '#86efac', border: '#22c55e' },
  Social: { bg: '#7c2d12', text: '#fdba74', border: '#f97316' },
  Infrastructure: { bg: '#1e293b', text: '#94a3b8', border: '#64748b' }
};




export default function BaseAirdropTracker() {
  const [data, setData] = useState<Airdrop[]>([]);

  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    category: 'DeFi',
    status: 'Active',
    reward: '',
    deadline: '',
    url: ''
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    try {
      const saved = localStorage.getItem('airdrops');
      if (saved) {
        setData(JSON.parse(saved));
      }
    } catch (error) {
      console.log('Loading data:', error);
    }
  };

  const addAirdrop = () => {
    if (!formData.name) return;
    
    try {
      const id = `airdrop-${Date.now()}`;
      const newItem: Airdrop = {
        id,
        createdAt: new Date().toISOString(),
        name: formData.name,
        category: formData.category,
        status: formData.status,
        reward: formData.reward,
        deadline: formData.deadline,
        url: formData.url
      };

setData([...data, newItem]);

      localStorage.setItem('airdrops', JSON.stringify(updatedData));
      setFormData({ name: '', category: 'DeFi', status: 'Active', reward: '', deadline: '', url: '' });
      setShowForm(false);
    } catch (error) {
      console.error('Error adding:', error);
    }
  };

  const deleteAirdrop = (id: string) => {

    try {
      const updatedData = data.filter(item => item.id !== id);
      setData(updatedData);
      localStorage.setItem('airdrops', JSON.stringify(updatedData));
    } catch (error) {
      console.error('Error deleting:', error);
    }
  };

  const clearAllData = () => {
    if (!confirm('Delete all airdrops?')) return;
    try {
      setData([]);
      localStorage.removeItem('airdrops');
    } catch (error) {
      console.error('Error clearing:', error);
    }
  };

  const stats = {
    total: data.length,
    active: data.filter(d => d.status === 'Active').length,
    completed: data.filter(d => d.status === 'Completed').length
  };

  const categoryColors = {
    DeFi: { bg: '#1e3a8a', text: '#93c5fd', border: '#3b82f6' },
    NFT: { bg: '#581c87', text: '#e9d5ff', border: '#a855f7' },
    Gaming: { bg: '#14532d', text: '#86efac', border: '#22c55e' },
    Social: { bg: '#7c2d12', text: '#fdba74', border: '#f97316' },
    Infrastructure: { bg: '#1e293b', text: '#94a3b8', border: '#64748b' }
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(to bottom, #000000 0%, #0a0a0a 100%)',
      color: '#ffffff',
      padding: '24px'
    }}>
      <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
        
        {/* Header */}
        <div style={{ marginBottom: '48px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '24px' }}>
            <div style={{ flex: 1, minWidth: '300px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                <div style={{
                  width: '48px',
                  height: '48px',
                  background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
                  borderRadius: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '24px'
                }}>
                  🔵
                </div>
                <h1 style={{
                  fontSize: '36px',
                  fontWeight: '800',
                  background: 'linear-gradient(135deg, #60a5fa 0%, #3b82f6 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  margin: 0
                }}>
                  Base Airdrop Tracker
                </h1>
              </div>

              <p style={{ color: '#9ca3af', fontSize: '15px', marginBottom: '16px', lineHeight: '1.6' }}>
                Track Web3 opportunities and Base ecosystem campaigns with ease
              </p>

              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '16px' }}>
                <span style={{
                  background: 'rgba(59, 130, 246, 0.1)',
                  color: '#60a5fa',
                  padding: '6px 12px',
                  borderRadius: '6px',
                  fontSize: '12px',
                  fontWeight: 600,
                  border: '1px solid rgba(59, 130, 246, 0.2)'
                }}>
                  Base Ecosystem
                </span>
                <span style={{
                  background: 'rgba(168, 85, 247, 0.1)',
                  color: '#c084fc',
                  padding: '6px 12px',
                  borderRadius: '6px',
                  fontSize: '12px',
                  fontWeight: 600,
                  border: '1px solid rgba(168, 85, 247, 0.2)'
                }}>
                  Web3 Frontend
                </span>
                <span style={{
                  background: 'rgba(34, 197, 94, 0.1)',
                  color: '#4ade80',
                  padding: '6px 12px',
                  borderRadius: '6px',
                  fontSize: '12px',
                  fontWeight: 600,
                  border: '1px solid rgba(34, 197, 94, 0.2)'
                }}>
                  Open Source
                </span>
              </div>

              <p style={{ color: '#6b7280', fontSize: '13px', margin: 0 }}>
                Built by <span style={{ color: '#3b82f6', fontWeight: 600 }}>Jhontaslim</span> for Top Base Builders: January
              </p>
            </div>

            {/* Stats Cards */}
            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
              <div style={{
                background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.1) 0%, rgba(29, 78, 216, 0.05) 100%)',
                border: '1px solid rgba(59, 130, 246, 0.2)',
                borderRadius: '12px',
                padding: '16px 20px',
                minWidth: '120px'
              }}>
                <div style={{ fontSize: '24px', fontWeight: '700', color: '#60a5fa', marginBottom: '4px' }}>
                  {stats.total}
                </div>
                <div style={{ fontSize: '12px', color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  Total
                </div>
              </div>

              <div style={{
                background: 'linear-gradient(135deg, rgba(34, 197, 94, 0.1) 0%, rgba(22, 163, 74, 0.05) 100%)',
                border: '1px solid rgba(34, 197, 94, 0.2)',
                borderRadius: '12px',
                padding: '16px 20px',
                minWidth: '120px'
              }}>
                <div style={{ fontSize: '24px', fontWeight: '700', color: '#4ade80', marginBottom: '4px' }}>
                  {stats.active}
                </div>
                <div style={{ fontSize: '12px', color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  Active
                </div>
              </div>

              <div style={{
                background: 'linear-gradient(135deg, rgba(148, 163, 184, 0.1) 0%, rgba(100, 116, 139, 0.05) 100%)',
                border: '1px solid rgba(148, 163, 184, 0.2)',
                borderRadius: '12px',
                padding: '16px 20px',
                minWidth: '120px'
              }}>
                <div style={{ fontSize: '24px', fontWeight: '700', color: '#94a3b8', marginBottom: '4px' }}>
                  {stats.completed}
                </div>
                <div style={{ fontSize: '12px', color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  Completed
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div style={{ display: 'flex', gap: '12px', marginBottom: '32px', flexWrap: 'wrap' }}>
          <button
            onClick={() => setShowForm(!showForm)}
            style={{
              background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
              color: '#ffffff',
              border: 'none',
              borderRadius: '10px',
              padding: '12px 24px',
              fontSize: '14px',
              fontWeight: '600',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              boxShadow: '0 4px 12px rgba(59, 130, 246, 0.3)',
              transition: 'all 0.2s'
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 6px 16px rgba(59, 130, 246, 0.4)';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 4px 12px rgba(59, 130, 246, 0.3)';
            }}
          >
            <Plus size={18} />
            Add Airdrop
          </button>

          {data.length > 0 && (
            <button
              onClick={clearAllData}
              style={{
                background: 'rgba(239, 68, 68, 0.1)',
                color: '#f87171',
                border: '1px solid rgba(239, 68, 68, 0.3)',
                borderRadius: '10px',
                padding: '12px 24px',
                fontSize: '14px',
                fontWeight: '600',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                transition: 'all 0.2s'
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.background = 'rgba(239, 68, 68, 0.15)';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.background = 'rgba(239, 68, 68, 0.1)';
              }}
            >
              <Trash2 size={18} />
              Clear All
            </button>
          )}
        </div>

        {/* Add Form */}
        {showForm && (
          <div style={{
            background: 'rgba(23, 23, 23, 0.6)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(64, 64, 64, 0.5)',
            borderRadius: '16px',
            padding: '24px',
            marginBottom: '32px'
          }}>
            <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '20px', color: '#e5e5e5' }}>
              Add New Airdrop
            </h3>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '6px', fontSize: '13px', color: '#a1a1aa', fontWeight: '500' }}>
                  Project Name *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g., BaseSwap"
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    borderRadius: '8px',
                    fontSize: '14px'
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '6px', fontSize: '13px', color: '#a1a1aa', fontWeight: '500' }}>
                  Category
                </label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    borderRadius: '8px',
                    fontSize: '14px'
                  }}
                >
                  <option>DeFi</option>
                  <option>NFT</option>
                  <option>Gaming</option>
                  <option>Social</option>
                  <option>Infrastructure</option>
                </select>
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '6px', fontSize: '13px', color: '#a1a1aa', fontWeight: '500' }}>
                  Status
                </label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    borderRadius: '8px',
                    fontSize: '14px'
                  }}
                >
                  <option>Active</option>
                  <option>Upcoming</option>
                  <option>Completed</option>
                </select>
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '6px', fontSize: '13px', color: '#a1a1aa', fontWeight: '500' }}>
                  Estimated Reward
                </label>
                <input
                  type="text"
                  value={formData.reward}
                  onChange={(e) => setFormData({ ...formData, reward: e.target.value })}
                  placeholder="e.g., $100-500"
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    borderRadius: '8px',
                    fontSize: '14px'
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '6px', fontSize: '13px', color: '#a1a1aa', fontWeight: '500' }}>
                  Deadline
                </label>
                <input
                  type="date"
                  value={formData.deadline}
                  onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    borderRadius: '8px',
                    fontSize: '14px'
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '6px', fontSize: '13px', color: '#a1a1aa', fontWeight: '500' }}>
                  URL
                </label>
                <input
                  type="url"
                  value={formData.url}
                  onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                  placeholder="https://..."
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    borderRadius: '8px',
                    fontSize: '14px'
                  }}
                />
              </div>
            </div>

            <div style={{ display: 'flex', gap: '12px', marginTop: '20px' }}>
              <button
                onClick={addAirdrop}
                style={{
                  background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: '8px',
                  padding: '10px 20px',
                  fontSize: '14px',
                  fontWeight: '600',
                  cursor: 'pointer'
                }}
              >
                Save Airdrop
              </button>
              <button
                onClick={() => setShowForm(false)}
                style={{
                  background: 'rgba(64, 64, 64, 0.5)',
                  color: '#e5e5e5',
                  border: '1px solid rgba(115, 115, 115, 0.3)',
                  borderRadius: '8px',
                  padding: '10px 20px',
                  fontSize: '14px',
                  fontWeight: '600',
                  cursor: 'pointer'
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* Airdrops Grid */}
        {data.length === 0 ? (
          <div style={{
            textAlign: 'center',
            padding: '80px 20px',
            background: 'rgba(23, 23, 23, 0.4)',
            border: '2px dashed rgba(64, 64, 64, 0.5)',
            borderRadius: '16px'
          }}>
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>🎯</div>
            <h3 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '8px', color: '#e5e5e5' }}>
              No airdrops yet
            </h3>
            <p style={{ color: '#737373', fontSize: '14px' }}>
              Click "Add Airdrop" to start tracking opportunities
            </p>
          </div>
        ) : (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))',
            gap: '20px'
          }}>
            {data.map((item) => {
              const colors = categoryColors[item.category] || categoryColors.DeFi;
              return (
                <div
                  key={item.id}
                  style={{
                    background: 'linear-gradient(135deg, rgba(23, 23, 23, 0.8) 0%, rgba(15, 15, 15, 0.8) 100%)',
                    backdropFilter: 'blur(10px)',
                    border: `1px solid ${colors.border}20`,
                    borderRadius: '16px',
                    padding: '20px',
                    position: 'relative',
                    overflow: 'hidden',
                    transition: 'all 0.3s'
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.transform = 'translateY(-4px)';
                    e.currentTarget.style.borderColor = `${colors.border}40`;
                    e.currentTarget.style.boxShadow = `0 8px 24px ${colors.border}20`;
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.borderColor = `${colors.border}20`;
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                >
                  {/* Top gradient accent */}
                  <div style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    height: '3px',
                    background: `linear-gradient(90deg, ${colors.border} 0%, transparent 100%)`
                  }} />

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                    <div style={{ flex: 1 }}>
                      <h3 style={{ fontSize: '18px', fontWeight: '700', marginBottom: '8px', color: '#ffffff' }}>
                        {item.name}
                      </h3>
                      
                      <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                        <span style={{
                          background: colors.bg,
                          color: colors.text,
                          padding: '4px 10px',
                          borderRadius: '6px',
                          fontSize: '11px',
                          fontWeight: '600',
                          border: `1px solid ${colors.border}30`
                        }}>
                          {item.category}
                        </span>
                        
                        <span style={{
                          background: item.status === 'Active' ? 'rgba(34, 197, 94, 0.1)' : 
                                     item.status === 'Upcoming' ? 'rgba(59, 130, 246, 0.1)' : 
                                     'rgba(148, 163, 184, 0.1)',
                          color: item.status === 'Active' ? '#4ade80' : 
                                item.status === 'Upcoming' ? '#60a5fa' : 
                                '#94a3b8',
                          padding: '4px 10px',
                          borderRadius: '6px',
                          fontSize: '11px',
                          fontWeight: '600',
                          border: `1px solid ${item.status === 'Active' ? 'rgba(34, 197, 94, 0.3)' : 
                                                item.status === 'Upcoming' ? 'rgba(59, 130, 246, 0.3)' : 
                                                'rgba(148, 163, 184, 0.3)'}`
                        }}>
                          {item.status}
                        </span>
                      </div>
                    </div>

                    <button
                      onClick={() => deleteAirdrop(item.id)}
                      style={{
                        background: 'rgba(239, 68, 68, 0.1)',
                        color: '#f87171',
                        border: '1px solid rgba(239, 68, 68, 0.2)',
                        borderRadius: '8px',
                        padding: '8px',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        transition: 'all 0.2s'
                      }}
                      onMouseOver={(e) => {
                        e.currentTarget.style.background = 'rgba(239, 68, 68, 0.2)';
                      }}
                      onMouseOut={(e) => {
                        e.currentTarget.style.background = 'rgba(239, 68, 68, 0.1)';
                      }}
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '16px' }}>
                    {item.reward && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <Award size={16} style={{ color: '#fbbf24' }} />
                        <span style={{ fontSize: '13px', color: '#d4d4d8' }}>{item.reward}</span>
                      </div>
                    )}
                    
                    {item.deadline && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <Calendar size={16} style={{ color: '#94a3b8' }} />
                        <span style={{ fontSize: '13px', color: '#d4d4d8' }}>
                          {new Date(item.deadline).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                        </span>
                      </div>
                    )}

                    {item.url && (
                      <a
                        href={item.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '8px',
                          color: '#60a5fa',
                          textDecoration: 'none',
                          fontSize: '13px',
                          fontWeight: '500',
                          marginTop: '4px',
                          transition: 'color 0.2s'
                        }}
                        onMouseOver={(e) => e.currentTarget.style.color = '#93c5fd'}
                        onMouseOut={(e) => e.currentTarget.style.color = '#60a5fa'}
                      >
                        <ExternalLink size={16} />
                        Visit Project
                      </a>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Footer */}
        <div style={{
          marginTop: '64px',
          paddingTop: '24px',
          borderTop: '1px solid rgba(64, 64, 64, 0.3)',
          textAlign: 'center',
          color: '#737373',
          fontSize: '13px'
        }}>
          <p>
            Built with 💙 by <span style={{ color: '#3b82f6', fontWeight: '600' }}>Jhontaslim</span>
            {' • '}
            <span style={{ color: '#9ca3af' }}>Top Base Builders: January 2025</span>
          </p>
        </div>
      </div>
    </div>
  );
}