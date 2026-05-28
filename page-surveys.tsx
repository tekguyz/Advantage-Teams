'use client';

import React, { useState } from 'react';
import { 
  CheckCircle2, 
  XOctagon, 
  HelpCircle, 
  Smartphone, 
  Edit3, 
  Check, 
  Clock, 
  AlertTriangle, 
  RefreshCw,
  Info,
  Server
} from 'lucide-react';

interface SurveyRecord {
  phone: string;
  agentExt: string;
  durationSec: number;
  status: 'Sent' | 'Skipped: Under 2 Minutes' | 'Skipped: Daily Cap Hit';
  explanation: string;
}

interface ExtensionMap {
  extension: string;
  mappedName: string;
  zohoUserId: string;
}

export default function PageSurveys() {
  // 1. MASTER SURVEY LOGS STATE
  const [surveys, setSurveys] = useState<SurveyRecord[]>([
    {
      phone: '+1 (555) 019-2834',
      agentExt: '102',
      durationSec: 345,
      status: 'Sent',
      explanation: 'Exceeded 2-Minute Minimum Filter. Standard survey dispatched.'
    },
    {
      phone: '+1 (555) 014-4921',
      agentExt: '101',
      durationSec: 42,
      status: 'Skipped: Under 2 Minutes',
      explanation: 'Filtered out automatically due to the 2-Minute Minimum Filter.'
    },
    {
      phone: '+1 (555) 017-8833',
      agentExt: '104',
      durationSec: 180,
      status: 'Skipped: Daily Cap Hit',
      explanation: 'Suppressed due to the Daily Message Cap rule.'
    }
  ]);

  // 2. EXTENSION MAPPING MATRIX STATE
  const [mappings, setMappings] = useState<ExtensionMap[]>([
    { extension: '101', mappedName: 'Sarah Jenkins', zohoUserId: 'US-101' },
    { extension: '102', mappedName: 'Marcus Vance', zohoUserId: 'US-102' },
    { extension: '103', mappedName: 'Elena Rostova', zohoUserId: 'US-103' },
    { extension: '104', mappedName: 'David Kim', zohoUserId: 'US-104' }
  ]);

  const [savingExt, setSavingExt] = useState<string | null>(null);
  const [feedbackMsg, setFeedbackMsg] = useState<string | null>(null);

  // Draft editing states
  const [draftName, setDraftName] = useState<Record<string, string>>({});
  const [draftZoho, setDraftZoho] = useState<Record<string, string>>({});

  const handleEditChange = (ext: string, field: 'name' | 'zoho', val: string) => {
    if (field === 'name') {
      setDraftName(prev => ({ ...prev, [ext]: val }));
    } else {
      setDraftZoho(prev => ({ ...prev, [ext]: val }));
    }
  };

  const handleSaveMapping = (ext: string) => {
    setSavingExt(ext);
    setFeedbackMsg(null);
    
    setTimeout(() => {
      setMappings(prev => prev.map(m => {
        if (m.extension === ext) {
          return {
            ...m,
            mappedName: draftName[ext] !== undefined ? draftName[ext] : m.mappedName,
            zohoUserId: draftZoho[ext] !== undefined ? draftZoho[ext] : m.zohoUserId
          };
        }
        return m;
      }));
      setSavingExt(null);
      setFeedbackMsg(`Successfully configured device extension ${ext} mapping settings.`);
      setTimeout(() => setFeedbackMsg(null), 3500);
    }, 600);
  };

  return (
    <div id="surveys-page-container" className="flex flex-col gap-5 text-left font-sans">
      
      {/* MODULE HEADER BAR */}
      <div id="survey-title-block" className="pb-2 border-b border-[#dfe1e6]">
        <h2 className="text-[18px] font-bold text-[#172b4d] tracking-tight m-0">
          Survey Control & Mapping Workspace
        </h2>
        <p className="text-[12px] text-[#5e6c84] mt-0.5 leading-relaxed">
          Operational control bridge to audit automatic dial-duration minimum filters and resolve physical 3CX device maps.
        </p>
      </div>

      {/* FEEDBACK BANNERS */}
      {feedbackMsg && (
        <div id="alert-banner-success" className="p-3 bg-[#e3fcef] border border-[#abf5d1] text-[#006644] rounded-[4px] text-[11px] font-semibold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-[#36b37e] shrink-0" />
          <div className="flex-1">{feedbackMsg}</div>
        </div>
      )}

      {/* TWO PANEL GRID: 60% Left / 40% Right */}
      <div id="survey-workspace-split" className="grid grid-cols-1 xl:grid-cols-12 gap-5 items-start">
        
        {/* LEFT PANEL: SURVEY DELIVERY LOG (60%) */}
        <div className="xl:col-span-7 flex flex-col gap-4">
          <div className="border border-[#dfe1e6] rounded-[4px] overflow-hidden bg-white">
            <div className="bg-[#fafbfc] px-4 py-3 border-b border-[#dfe1e6]">
              <h3 className="text-[12.5px] font-bold text-[#172b4d] uppercase tracking-wider m-0">
                Survey Delivery Log
              </h3>
              <p className="text-[11px] text-[#5e6c84] m-0.5">
                Comprehensive tracking register mapping raw dial events to dispatch outcomes.
              </p>
            </div>

            <div className="divide-y divide-[#dfe1e6]">
              {surveys.map((survey, index) => (
                <div 
                  key={index} 
                  className="p-4 hover:bg-[#f4f5f7]/20 transition-colors flex flex-col md:flex-row md:items-center justify-between gap-3 text-[11px]"
                >
                  <div className="flex flex-col gap-1 max-w-[420px]">
                    <div className="flex items-center gap-2">
                      <Smartphone className="w-3.5 h-3.5 text-[#5e6c84]" />
                      <span className="font-bold text-[#172b4d]">{survey.phone}</span>
                      <span className="text-[9.5px] text-[#5e6c84] bg-[#f4f5f7] px-1.5 py-0.5 rounded-[3px] border border-[#dfe1e6]">
                        Ext: {survey.agentExt}
                      </span>
                    </div>
                    <div className="text-[#5e6c84] font-medium leading-relaxed mt-0.5">
                      {survey.explanation}
                    </div>
                    <div className="font-mono text-[9px] text-[#5e6c84] mt-1 flex items-center gap-1">
                      <Clock className="w-3 h-3 text-[#5e6c84]" />
                      Monitored Call Duration: <span className="font-bold text-[#172b4d]">{survey.durationSec} seconds</span>
                    </div>
                  </div>

                  {/* Operational Status Tag Styling */}
                  <div className="shrink-0 self-start md:self-auto">
                    <span className={`inline-flex h-5 px-2.5 rounded-[4px] font-bold text-[9.5px] tracking-wide uppercase items-center justify-center ${
                      survey.status === 'Sent' 
                        ? 'bg-[#e3fcef] text-[#006644] border border-[#abf5d1]' 
                        : 'bg-[#ffebe6] text-[#bf2600] border border-[#ffbdad]'
                    }`}>
                      {survey.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="p-3 bg-[#deebff]/20 border border-[#deebff] rounded-[4px] text-[11px] text-[#0747a6] flex items-start gap-2.5">
            <span className="text-[13px] shrink-0 mt-0.5">ℹ️</span>
            <div className="leading-relaxed">
              <strong>Minimum Filter Enforcement Alert:</strong> Inbound call durations are checked at the dialer gateway root. Standard dispatches are bypassed for events failing to meet the active <strong>2-Minute Minimum Filter</strong>.
            </div>
          </div>
        </div>

        {/* RIGHT PANEL: EXTENSION MAPPING MATRIX (40%) */}
        <div className="xl:col-span-5 flex flex-col gap-4">
          <div className="border border-[#dfe1e6] rounded-[4px] overflow-hidden bg-white">
            <div className="bg-[#fafbfc] px-4 py-3 border-b border-[#dfe1e6]">
              <h3 className="text-[12.5px] font-bold text-[#172b4d] uppercase tracking-wider m-0">
                Extension Mapping Matrix
              </h3>
              <p className="text-[11px] text-[#5e6c84] m-0.5">
                Dynamic configuration tool binding 3CX workstations to Zoho profile credentials.
              </p>
            </div>

            <div className="p-4 flex flex-col gap-4">
              {mappings.map((map) => {
                const currentName = draftName[map.extension] !== undefined ? draftName[map.extension] : map.mappedName;
                const currentZoho = draftZoho[map.extension] !== undefined ? draftZoho[map.extension] : map.zohoUserId;
                const isModified = map.mappedName !== currentName || map.zohoUserId !== currentZoho;

                return (
                  <div 
                    key={map.extension} 
                    className="p-3 border border-[#dfe1e6] rounded-[4px] hover:border-[#a5adba] bg-[#fafbfc] transition-all flex flex-col gap-2.5"
                  >
                    <div className="flex items-center justify-between border-b border-[#dfe1e6]/60 pb-1.5">
                      <span className="font-bold text-[11px] text-[#172b4d] flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#0052cc]" />
                        3CX Extension {map.extension}
                      </span>
                      <span className="text-[9px] font-mono text-[#5e6c84]">ACTIVE MAPPING</span>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="text-[9px] text-[#5e6c84] font-bold uppercase block mb-1">Representative Name</label>
                        <input
                          type="text"
                          value={currentName}
                          onChange={(e) => handleEditChange(map.extension, 'name', e.target.value)}
                          className="w-full h-[26px] border border-[#dfe1e6] hover:border-[#a5adba] focus:border-[#0052cc] focus:outline-hidden text-[11px] px-2 rounded-[3px] bg-white text-[#172b4d] select-text"
                        />
                      </div>
                      <div>
                        <label className="text-[9px] text-[#5e6c84] font-bold uppercase block mb-1">Zoho Profile ID</label>
                        <input
                          type="text"
                          value={currentZoho}
                          onChange={(e) => handleEditChange(map.extension, 'zoho', e.target.value)}
                          className="w-full h-[26px] border border-[#dfe1e6] hover:border-[#a5adba] focus:border-[#0052cc] focus:outline-hidden text-[11px] px-2 rounded-[3px] bg-white text-[#172b4d] select-text"
                        />
                      </div>
                    </div>

                    {isModified && (
                      <div className="flex justify-end pt-1">
                        <button
                          onClick={() => handleSaveMapping(map.extension)}
                          disabled={savingExt === map.extension}
                          className="h-[24px] px-3 bg-[#0052cc] hover:bg-[#0747a6] text-white rounded-[3px] font-bold text-[9.5px] transition-all flex items-center gap-1 cursor-pointer"
                        >
                          {savingExt === map.extension ? (
                            <>
                              <RefreshCw className="w-2.5 h-2.5 animate-spin" />
                              Saving...
                            </>
                          ) : (
                            <>
                              <Check className="w-2.5 h-2.5" />
                              Save Workstation Config
                            </>
                          )}
                        </button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}
export { PageSurveys as pageSurveys };
