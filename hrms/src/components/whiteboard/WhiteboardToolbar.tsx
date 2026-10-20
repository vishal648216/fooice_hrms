'use client';

import React from 'react';
import { ToolType } from '@/lib/whiteboard-data';
import { 
  MousePointer2, 
  Hand, 
  Square, 
  RectangleHorizontal, 
  Circle, 
  Diamond, 
  ArrowRight, 
  Minus, 
  Pencil, 
  Type, 
  StickyNote, 
  Eraser,
  Undo2,
  Redo2,
  Trash2
} from 'lucide-react';

interface WhiteboardToolbarProps {
  activeTool: ToolType;
  onSelectTool: (tool: ToolType) => void;
  canUndo: boolean;
  canRedo: boolean;
  onUndo: () => void;
  onRedo: () => void;
  onClear: () => void;
}

export const WhiteboardToolbar: React.FC<WhiteboardToolbarProps> = ({
  activeTool,
  onSelectTool,
  canUndo,
  canRedo,
  onUndo,
  onRedo,
  onClear,
}) => {
  const tools: { id: ToolType; label: string; icon: React.ReactNode; shortcut: string }[] = [
    { id: 'select', label: 'Select & Move (V)', icon: <MousePointer2 className="w-4 h-4" />, shortcut: 'V' },
    { id: 'pan', label: 'Hand / Pan (H)', icon: <Hand className="w-4 h-4" />, shortcut: 'H' },
    { id: 'rectangle', label: 'Rectangle (R)', icon: <Square className="w-4 h-4" />, shortcut: 'R' },
    { id: 'rounded-rect', label: 'Rounded Box (B)', icon: <RectangleHorizontal className="w-4 h-4" />, shortcut: 'B' },
    { id: 'diamond', label: 'Decision Diamond (D)', icon: <Diamond className="w-4 h-4" />, shortcut: 'D' },
    { id: 'ellipse', label: 'Ellipse / Circle (O)', icon: <Circle className="w-4 h-4" />, shortcut: 'O' },
    { id: 'arrow', label: 'Arrow Connector (A)', icon: <ArrowRight className="w-4 h-4" />, shortcut: 'A' },
    { id: 'line', label: 'Line (L)', icon: <Minus className="w-4 h-4" />, shortcut: 'L' },
    { id: 'pen', label: 'Freehand Draw (P)', icon: <Pencil className="w-4 h-4" />, shortcut: 'P' },
    { id: 'text', label: 'Text Box (T)', icon: <Type className="w-4 h-4" />, shortcut: 'T' },
    { id: 'sticky', label: 'Sticky Note (S)', icon: <StickyNote className="w-4 h-4" />, shortcut: 'S' },
    { id: 'eraser', label: 'Eraser (E)', icon: <Eraser className="w-4 h-4" />, shortcut: 'E' },
  ];

  return (
    <div className="absolute top-4 left-1/2 -translate-x-1/2 z-20 flex items-center gap-1.5 p-1.5 rounded-2xl bg-slate-900/90 dark:bg-slate-900/95 backdrop-blur-md border border-slate-800 shadow-2xl text-white select-none">
      
      {/* Tool Buttons */}
      <div className="flex items-center gap-1">
        {tools.map((t) => {
          const isActive = activeTool === t.id;
          return (
            <button
              key={t.id}
              onClick={() => onSelectTool(t.id)}
              title={`${t.label}`}
              className={`p-2 rounded-xl transition-all relative group flex items-center justify-center ${
                isActive
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/40 scale-105'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/80'
              }`}
            >
              {t.icon}
              <span className="sr-only">{t.label}</span>
              
              {/* Tooltip */}
              <span className="absolute -bottom-8 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity bg-slate-950 text-slate-200 text-[10px] font-medium px-2 py-0.5 rounded shadow-lg whitespace-nowrap z-30 border border-slate-800">
                {t.label}
              </span>
            </button>
          );
        })}
      </div>

      <div className="w-[1px] h-6 bg-slate-800 mx-1" />

      {/* Undo / Redo / Clear */}
      <div className="flex items-center gap-1">
        <button
          onClick={onUndo}
          disabled={!canUndo}
          title="Undo (Ctrl+Z)"
          className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800/80 disabled:opacity-30 disabled:cursor-not-allowed transition"
        >
          <Undo2 className="w-4 h-4" />
        </button>
        <button
          onClick={onRedo}
          disabled={!canRedo}
          title="Redo (Ctrl+Y)"
          className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800/80 disabled:opacity-30 disabled:cursor-not-allowed transition"
        >
          <Redo2 className="w-4 h-4" />
        </button>
        <button
          onClick={onClear}
          title="Clear Board Canvas"
          className="p-2 rounded-xl text-slate-400 hover:text-rose-400 hover:bg-rose-950/40 transition"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>

    </div>
  );
};
