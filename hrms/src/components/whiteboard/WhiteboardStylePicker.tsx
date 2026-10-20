'use client';

import React from 'react';
import { PRESET_COLORS, STICKY_COLORS, WhiteboardElement } from '@/lib/whiteboard-data';
import { 
  Palette, 
  PaintBucket, 
  Sliders, 
  Type, 
  Trash2, 
  Copy, 
  ArrowUpToLine, 
  ArrowDownToLine 
} from 'lucide-react';

interface WhiteboardStylePickerProps {
  selectedElement: WhiteboardElement | null;
  currentStrokeColor: string;
  currentFillColor: string;
  currentStrokeWidth: number;
  currentStrokeStyle: 'solid' | 'dashed' | 'dotted';
  currentOpacity: number;
  onUpdateStyle: (updates: Partial<WhiteboardElement>) => void;
  onDeleteSelected: () => void;
  onDuplicateSelected: () => void;
  onBringToFront: () => void;
  onSendToBack: () => void;
}

export const WhiteboardStylePicker: React.FC<WhiteboardStylePickerProps> = ({
  selectedElement,
  currentStrokeColor,
  currentFillColor,
  currentStrokeWidth,
  currentStrokeStyle,
  currentOpacity,
  onUpdateStyle,
  onDeleteSelected,
  onDuplicateSelected,
  onBringToFront,
  onSendToBack,
}) => {
  const isSticky = selectedElement?.type === 'sticky';

  return (
    <div className="absolute top-20 left-4 z-20 w-64 p-3.5 rounded-2xl bg-slate-900/95 dark:bg-slate-900/95 backdrop-blur-md border border-slate-800 shadow-2xl text-slate-200 text-xs space-y-3.5 select-none animate-in fade-in slide-in-from-left duration-150">
      
      {/* Header */}
      <div className="flex items-center justify-between pb-2 border-b border-slate-800">
        <span className="font-bold text-slate-100 flex items-center gap-1.5">
          <Palette className="w-3.5 h-3.5 text-indigo-400" />
          {selectedElement ? `Element Style (${selectedElement.type})` : 'Tool Defaults'}
        </span>
        {selectedElement && (
          <div className="flex items-center gap-1">
            <button
              onClick={onDuplicateSelected}
              title="Duplicate Element"
              className="p-1 rounded text-slate-400 hover:text-white hover:bg-slate-800"
            >
              <Copy className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={onDeleteSelected}
              title="Delete Element"
              className="p-1 rounded text-slate-400 hover:text-rose-400 hover:bg-rose-950/40"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </div>

      {/* Sticky Note Specific Color Palette */}
      {isSticky ? (
        <div className="space-y-1.5">
          <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
            Sticky Note Theme
          </label>
          <div className="grid grid-cols-5 gap-1.5">
            {STICKY_COLORS.map((col) => (
              <button
                key={col.name}
                onClick={() => onUpdateStyle({ fillColor: col.bg, strokeColor: col.border, textColor: col.text, stickyColor: col.bg })}
                className="w-full h-7 rounded-lg border-2 transition hover:scale-105"
                style={{ 
                  backgroundColor: col.bg, 
                  borderColor: selectedElement?.fillColor === col.bg ? '#6366f1' : 'transparent' 
                }}
                title={col.name}
              />
            ))}
          </div>
        </div>
      ) : (
        <>
          {/* Stroke Color */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center justify-between">
              <span>Stroke Color</span>
              <span className="w-3 h-3 rounded-full border border-slate-700" style={{ backgroundColor: selectedElement?.strokeColor || currentStrokeColor }} />
            </label>
            <div className="grid grid-cols-5 gap-1.5">
              {PRESET_COLORS.map((color) => {
                const isSelected = (selectedElement?.strokeColor || currentStrokeColor) === color.value;
                return (
                  <button
                    key={color.name}
                    onClick={() => onUpdateStyle({ strokeColor: color.value })}
                    className={`w-full h-6 rounded-lg transition-transform hover:scale-105 border ${
                      isSelected ? 'ring-2 ring-indigo-500 border-white' : 'border-slate-700'
                    }`}
                    style={{ backgroundColor: color.value }}
                    title={color.name}
                  />
                );
              })}
            </div>
          </div>

          {/* Fill Color */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center justify-between">
              <span>Fill Style</span>
              <PaintBucket className="w-3.5 h-3.5 text-slate-400" />
            </label>
            <div className="grid grid-cols-5 gap-1.5">
              <button
                onClick={() => onUpdateStyle({ fillColor: 'transparent' })}
                className="w-full h-6 rounded-lg border border-slate-700 flex items-center justify-center text-[10px] text-slate-400 hover:bg-slate-800"
                title="Transparent"
              >
                None
              </button>
              {PRESET_COLORS.slice(0, 4).map((color) => {
                const isSelected = (selectedElement?.fillColor || currentFillColor) === color.fill;
                return (
                  <button
                    key={`fill-${color.name}`}
                    onClick={() => onUpdateStyle({ fillColor: color.fill })}
                    className={`w-full h-6 rounded-lg transition-transform hover:scale-105 border ${
                      isSelected ? 'ring-2 ring-indigo-500 border-white' : 'border-slate-700'
                    }`}
                    style={{ backgroundColor: color.fill }}
                    title={`Tint ${color.name}`}
                  />
                );
              })}
            </div>
          </div>

          {/* Stroke Width & Stroke Style */}
          <div className="grid grid-cols-2 gap-2">
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Thickness</label>
              <div className="flex rounded-lg bg-slate-800/80 p-0.5 border border-slate-700">
                {[1, 2, 4].map((w) => (
                  <button
                    key={w}
                    onClick={() => onUpdateStyle({ strokeWidth: w })}
                    className={`flex-1 py-1 text-[11px] font-bold rounded transition ${
                      (selectedElement?.strokeWidth || currentStrokeWidth) === w
                        ? 'bg-indigo-600 text-white'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    {w === 1 ? 'Thin' : w === 2 ? 'Norm' : 'Bold'}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Style</label>
              <div className="flex rounded-lg bg-slate-800/80 p-0.5 border border-slate-700">
                {(['solid', 'dashed', 'dotted'] as const).map((style) => (
                  <button
                    key={style}
                    onClick={() => onUpdateStyle({ strokeStyle: style })}
                    className={`flex-1 py-1 text-[10px] font-bold rounded capitalize transition ${
                      (selectedElement?.strokeStyle || currentStrokeStyle) === style
                        ? 'bg-indigo-600 text-white'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    {style.substring(0, 3)}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </>
      )}

      {/* Layer Controls (if element selected) */}
      {selectedElement && (
        <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-[11px]">
          <span className="text-slate-400">Layering:</span>
          <div className="flex items-center gap-1.5">
            <button
              onClick={onBringToFront}
              className="flex items-center gap-1 px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 transition"
              title="Bring to Front"
            >
              <ArrowUpToLine className="w-3 h-3" /> Front
            </button>
            <button
              onClick={onSendToBack}
              className="flex items-center gap-1 px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 transition"
              title="Send to Back"
            >
              <ArrowDownToLine className="w-3 h-3" /> Back
            </button>
          </div>
        </div>
      )}

    </div>
  );
};
