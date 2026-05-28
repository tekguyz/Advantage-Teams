// view-surveys.tsx
// Pure UI presentation component for the split-pane "Survey Control & Mapping" workspace.
'use client';

import React from 'react';
import { 
  CheckCircle2, 
  Smartphone, 
  Check, 
  Clock, 
  RefreshCw, 
  AlertCircle 
} from 'lucide-react';
import { SurveyLog, ExtensionMap } from './types-matrix';

interface ViewSurveysProps {
  surveys: SurveyLog[];
  mappings: ExtensionMap[];
  draftName: Record<string, string>;
  draftZoho: Record<string, string>;
  saveErrors: Record<string, string>;
  savingExt: string | null;
  successBanner: string | null;
  handleModifyDraft: (ext: string, field: 'name' | 'zoho', val: string) => void;
  commitExtensionMapping: (ext: string) => void;
}

export function ViewSurveys({
  surveys,
  mappings,
  draftName,
  draftZoho,
  saveErrors,
  savingExt,
  successBanner,
  handleModifyDraft,
  commitExtensionMapping,
}: ViewSurveysProps) {
  return (
    <div id="surveys-page-container" className="flex flex-col gap-5 text-left font-sans">
      
      {/* HEADER BLOCK */}
      <div id="survey-title-block" className="pb-2 border-b border-[#dfe1e6]">
        <h2 className="text-[18px] font-bold text-[#172b4d] tracking-tight m-0">
          Survey Control & Mapping Workspace
        </h2>
        <p className="text-[12px] text-[#5e6c84] mt-0.5 leading-relaxed">
          Operational panel auditing active call routing filters and resolving workstation physical hardware mapping settings.
        </p>
      </div>

      {/* FEEDBACK BANNER SUCCESS NOTIFICATION */}
      {successBanner && (
        <div id="alert-banner-success" className="p-3 bg-[#e3fcef] border border-[#abf5d1] text-[#006644] rounded-[4px] text-[11px] font-semibold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-[#36b37e] shrink-0" />
          <div className="flex-1">{successBanner}</div>
        </div>
      )}

      {/* TWO PANEL SPLIT GRID: 60% Left / 40% Right */}
      <div id="survey-workspace-split" className="grid grid-cols-1 xl:grid-cols-12 gap-5 items-start">
        
        {/* LEFT PANEL: SURVEY DELIVERY LOG (60%) */}
        <div className="xl:col-span-7 flex flex-col gap-4">
          <div className="border border-[#dfe1e6]  rounded-[4px] overflow-hidden bg-white">
            <div className="bg-[#fafbfc] px-4 py-3 border-b border-[#dfe1e6]">
              <h3 className="text-[12.5px] font-bold text-[#172b4d] uppercase tracking-wider m-0">
                Survey Delivery Log
              </h3>
              <p className="text-[11px] text-[#5e6c84] m-0.5">
                Central dispatcher register mapping caller durations directly to final client delivery states.
              </p>
            </div>

            <div className="divide-y divide-[#dfe1e6]">
              {surveys.map((survey) => (
                <div 
                  key={survey.id} 
                  className="p-4 hover:bg-[#f4f5f7]/20 transition-colors flex flex-col md:flex-row md:items-center justify-between gap-3 text-[11px]"
                >
                  <div className="flex flex-col gap-1 max-w-[420px]">
                    <div className="flex items-center gap-2">
                      <Smartphone className="w-3.5 h-3.5 text-[#5e6c84]" />
                      <span className="font-bold text-[#172b4d]">{survey.phone}</span>
                      <span className="text-[9.5px] text-[#5e6c84] bg-[#f4f5f7] px-1.5 py-0.5 rounded-[3px] border border-[#dfe1e6] font-mono">
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

                  {/* Batch delivery condition status tags */}
                  <div className="shrink-0 self-start md:self-auto">
                    <span className={`inline-flex h-5 px-2.5 rounded-[4px] font-bold text-[9px] tracking-wide uppercase items-center justify-center ${
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
              <strong>Minimum Filter Enforcement Alert:</strong> Core calls routing are verified automatically. Automated dispatches are immediately bypassed for call events failing to satisfy the active <strong>2-Minute Minimum Filter</strong> or exceeding the <strong>Daily Message Cap</strong> thresholds.
            </div>
          </div>
        </div>

        {/* RIGHT PANEL: EXTENSION MAPPING MATRIX (40%) */}
        <div className="xl:col-span-5 flex flex-col gap-4">
          <div className="border border-[#dfe1e6]  rounded-[4px] overflow-hidden bg-white">
            <div className="bg-[#fafbfc] px-4 py-3 border-b border-[#dfe1e6]">
              <h3 className="text-[12.5px] font-bold text-[#172b4d] uppercase tracking-wider m-0">
                Extension Mapping Matrix
              </h3>
              <p className="text-[11px] text-[#5e6c84] m-0.5">
                Manage live physical workstation settings by mapping Extensions to Zoho Account profiles.
              </p>
            </div>

            <div className="p-4 flex flex-col gap-4">
              {mappings.map((map) => {
                const currentName = draftName[map.extension] !== undefined ? draftName[map.extension] : map.mappedName;
                const currentZoho = draftZoho[map.extension] !== undefined ? draftZoho[map.extension] : map.zohoUserId;
                const isModified = map.mappedName !== currentName || map.zohoUserId !== currentZoho;
                const hasError = saveErrors[map.extension];

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
                          onChange={(e) => handleModifyDraft(map.extension, 'name', e.target.value)}
                          className="w-full h-[26px] border border-[#dfe1e6] hover:border-[#a5adba] focus:border-[#0052cc] focus:outline-hidden text-[11px] px-2 rounded-[3px] bg-white text-[#172b4d] select-text"
                        />
                      </div>
                      <div>
                        <label className="text-[9px] text-[#5e6c84] font-bold uppercase block mb-1">Zoho Profile ID</label>
                        <input
                          type="text"
                          value={currentZoho}
                          onChange={(e) => handleModifyDraft(map.extension, 'zoho', e.target.value)}
                          className="w-full h-[26px] border border-[#dfe1e6] hover:border-[#a5adba] focus:border-[#0052cc] focus:outline-hidden text-[11px] px-2 rounded-[3px] bg-white text-[#172b4d] select-text"
                        />
                      </div>
                    </div>

                    {/* Run-time Error Validation Warning Feedback */}
                    {hasError && (
                      <div className="flex items-center gap-1.5 text-[#bf2600] text-[9.5px] mt-1 font-semibold leading-none">
                        <AlertCircle className="w-3 h-3 text-[#ff5630]" />
                        <span>{hasError}</span>
                      </div>
                    )}

                    {isModified && (
                      <div className="flex justify-end pt-1">
                        <button
                          onClick={() => commitExtensionMapping(map.extension)}
                          disabled={savingExt === map.extension}
                          className="h-[24px] px-3 bg-[#0052cc] hover:bg-[#0747a6] text-white rounded-[3px] font-bold text-[9.5px] transition-all flex items-center gap-1 cursor-pointer disabled:bg-slate-100 disabled:text-[#a5adba] disabled:cursor-not-allowed"
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
export default ViewSurveys;
