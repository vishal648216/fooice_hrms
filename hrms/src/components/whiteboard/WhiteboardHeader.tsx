'use client';

import React, { useState } from 'react';
import { WhiteboardDocument, WhiteboardCollaborator } from '@/lib/whiteboard-data';
import { 
  ChevronDown, 
  Plus, 
  Share2, 
  Download, 
  ZoomIn, 
  ZoomOut, 
  RotateCcw, 
  LayoutTemplate, 
  Users, 
  Check, 
  Copy, 
  FileCode, 
  Image as ImageIcon,
  Sparkles,
  FolderOpen
} from 'lucide-react';

interface WhiteboardHeaderProps {
  currentBoard: WhiteboardDocument;
  allBoards: WhiteboardDocument[];
  collaborators: WhiteboardCollaborator[];
  zoom: number;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onResetZoom: () => void;
  onSelectBoard: (boardId: string) => void;
  onCreateNewBoard: () => void;
  onLoadTemplate: (templateType: 'MICROSERVICES' | 'CHECKOUT_FLOW' | 'BLANK') => void;
  onExport: (format: 'PNG' | 'SVG' | 'JSON') => void;
  onRenameTitle: (newTitle: string) => void;
}

export const WhiteboardHeader: React.FC<WhiteboardHeaderProps> = ({
  currentBoard,
  allBoards,
  collaborators,
  zoom,
  onZoomIn,
  onZoomOut,
  onResetZoom,
  onSelectBoard,
  onCreateNewBoard,
  onLoadTemplate,
  onExport,
  onRenameTitle,
}) => {
  const [isBoardsMenuOpen, setIsBoardsMenuOpen] = useState(false);
  const [isTemplatesMenuOpen, setIsTemplatesMenuOpen] = useState(false);
  const [isExportMenuOpen, setIsExportMenuOpen] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [titleInput, setTitleInput] = useState(currentBoard.title);
  const [copiedLink, setCopiedLink] = useState(false);

  const handleTitleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (titleInput.trim()) {
      onRenameTitle(titleInput);
    }
    setIsEditingTitle(false);
  };

  const handleCopyShareLink = () => {
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  return (
    <>
      <div className="h-14 px-4 border-b border-slate-200 dark:border-slate-800 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md flex items-center justify-between gap-3 select-none transition-colors">
        
        {/* Left Section: Board Switcher & Title */}
        <div className="flex items-center gap-3">
          
          {/* Boards Dropdown */}
          <div className="relative">
            <button
              onClick={() => {
                setIsBoardsMenuOpen(!isBoardsMenuOpen);
                setIsTemplatesMenuOpen(false);
                setIsExportMenuOpen(false);
              }}
              className="flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-bold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 transition"
            >
              <FolderOpen className="w-3.5 h-3.5 text-indigo-500" />
              <span>Boards</span>
              <ChevronDown className="w-3 h-3 text-slate-400" />
            </button>

            {isBoardsMenuOpen && (
              <div className="absolute top-10 left-0 w-72 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl p-2 z-50 text-xs space-y-1 animate-in fade-in zoom-in-95 duration-100">
                <div className="px-2 py-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  Select Workspace Board
                </div>
                {allBoards.map((b) => (
                  <button
                    key={b.id}
                    onClick={() => {
                      onSelectBoard(b.id);
                      setTitleInput(b.title);
                      setIsBoardsMenuOpen(false);
                    }}
                    className={`w-full flex items-center justify-between px-2.5 py-2 rounded-xl text-left transition ${
                      b.id === currentBoard.id
                        ? 'bg-indigo-50 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300 font-bold'
                        : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                    }`}
                  >
                    <div className="truncate">
                      <div className="truncate font-semibold">{b.title}</div>
                      <div className="text-[10px] text-slate-400">Edited {b.lastEditedTime} by {b.lastEditedBy}</div>
                    </div>
                    {b.id === currentBoard.id && <Check className="w-3.5 h-3.5 text-indigo-600 shrink-0 ml-2" />}
                  </button>
                ))}

                <div className="pt-1.5 border-t border-slate-100 dark:border-slate-800">
                  <button
                    onClick={() => {
                      onCreateNewBoard();
                      setIsBoardsMenuOpen(false);
                    }}
                    className="w-full flex items-center gap-2 px-2.5 py-2 rounded-xl text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-950/60 font-bold transition"
                  >
                    <Plus className="w-3.5 h-3.5" /> Create New Board
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Editable Title */}
          {isEditingTitle ? (
            <form onSubmit={handleTitleSubmit} className="flex items-center gap-1">
              <input
                type="text"
                value={titleInput}
                onChange={(e) => setTitleInput(e.target.value)}
                autoFocus
                onBlur={handleTitleSubmit}
                className="px-2.5 py-1 rounded-lg text-xs font-bold border border-indigo-500 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none"
              />
            </form>
          ) : (
            <button
              onClick={() => setIsEditingTitle(true)}
              title="Click to rename board"
              className="text-xs font-bold text-slate-900 dark:text-white hover:text-indigo-600 dark:hover:text-indigo-400 transition truncate max-w-xs md:max-w-md"
            >
              {currentBoard.title}
            </button>
          )}

          {/* Templates Selector */}
          <div className="relative hidden sm:block">
            <button
              onClick={() => {
                setIsTemplatesMenuOpen(!isTemplatesMenuOpen);
                setIsBoardsMenuOpen(false);
                setIsExportMenuOpen(false);
              }}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
            >
              <LayoutTemplate className="w-3.5 h-3.5" />
              <span>Templates</span>
              <ChevronDown className="w-3 h-3 text-slate-400" />
            </button>

            {isTemplatesMenuOpen && (
              <div className="absolute top-9 left-0 w-64 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl p-2 z-50 text-xs space-y-1 animate-in fade-in zoom-in-95 duration-100">
                <div className="px-2 py-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  Insert Architecture Template
                </div>
                <button
                  onClick={() => {
                    onLoadTemplate('MICROSERVICES');
                    setIsTemplatesMenuOpen(false);
                  }}
                  className="w-full flex items-start gap-2.5 p-2 rounded-xl text-left hover:bg-slate-100 dark:hover:bg-slate-800 transition text-slate-700 dark:text-slate-200"
                >
                  <Sparkles className="w-4 h-4 text-indigo-500 shrink-0 mt-0.5" />
                  <div>
                    <div className="font-bold">Microservices System</div>
                    <div className="text-[10px] text-slate-400">Gateway, Auth, DB Cluster, Redis, Notes</div>
                  </div>
                </button>
                <button
                  onClick={() => {
                    onLoadTemplate('CHECKOUT_FLOW');
                    setIsTemplatesMenuOpen(false);
                  }}
                  className="w-full flex items-start gap-2.5 p-2 rounded-xl text-left hover:bg-slate-100 dark:hover:bg-slate-800 transition text-slate-700 dark:text-slate-200"
                >
                  <Sparkles className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  <div>
                    <div className="font-bold">Checkout Flowchart</div>
                    <div className="text-[10px] text-slate-400">Decision nodes, FX converter, Webhooks</div>
                  </div>
                </button>
                <button
                  onClick={() => {
                    onLoadTemplate('BLANK');
                    setIsTemplatesMenuOpen(false);
                  }}
                  className="w-full p-2 rounded-xl text-left hover:bg-slate-100 dark:hover:bg-slate-800 transition text-slate-500"
                >
                  Clear to Blank Canvas
                </button>
              </div>
            )}
          </div>

        </div>

        {/* Right Section: Collaborators, Zoom, Export, Share */}
        <div className="flex items-center gap-2 sm:gap-3">
          
          {/* Live Collaborators Presence */}
          <div className="flex items-center -space-x-1.5 pl-2">
            {collaborators.map((c) => (
              <div
                key={c.id}
                title={`${c.name} (${c.role}) - Live on canvas`}
                className="relative group cursor-pointer"
              >
                <img
                  src={c.avatar}
                  alt={c.name}
                  className="w-7 h-7 rounded-full object-cover ring-2 ring-white dark:ring-slate-900 shadow-sm"
                />
                <span
                  className="absolute bottom-0 right-0 w-2 h-2 rounded-full ring-1 ring-white dark:ring-slate-900"
                  style={{ backgroundColor: c.color }}
                />
              </div>
            ))}
            <div className="w-7 h-7 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-[10px] font-bold flex items-center justify-center ring-2 ring-white dark:ring-slate-900 shadow-sm">
              +{collaborators.length}
            </div>
          </div>

          <div className="w-[1px] h-5 bg-slate-200 dark:bg-slate-800 hidden sm:block" />

          {/* Zoom Controls */}
          <div className="hidden md:flex items-center gap-0.5 bg-slate-100 dark:bg-slate-800/80 rounded-xl p-1 text-slate-700 dark:text-slate-300">
            <button
              onClick={onZoomOut}
              title="Zoom Out (Ctrl -)"
              className="p-1 rounded-lg hover:bg-white dark:hover:bg-slate-700 transition"
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={onResetZoom}
              title="Reset Zoom to 100%"
              className="px-1.5 py-0.5 text-[10px] font-mono font-bold hover:bg-white dark:hover:bg-slate-700 rounded transition"
            >
              {Math.round(zoom * 100)}%
            </button>
            <button
              onClick={onZoomIn}
              title="Zoom In (Ctrl +)"
              className="p-1 rounded-lg hover:bg-white dark:hover:bg-slate-700 transition"
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Export Dropdown */}
          <div className="relative">
            <button
              onClick={() => {
                setIsExportMenuOpen(!isExportMenuOpen);
                setIsBoardsMenuOpen(false);
                setIsTemplatesMenuOpen(false);
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition"
            >
              <Download className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Export</span>
              <ChevronDown className="w-3 h-3 text-slate-400" />
            </button>

            {isExportMenuOpen && (
              <div className="absolute top-10 right-0 w-48 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl p-1.5 z-50 text-xs space-y-1 animate-in fade-in zoom-in-95 duration-100">
                <button
                  onClick={() => {
                    onExport('PNG');
                    setIsExportMenuOpen(false);
                  }}
                  className="w-full flex items-center gap-2 px-2.5 py-2 rounded-xl text-left hover:bg-slate-100 dark:hover:bg-slate-800 transition text-slate-700 dark:text-slate-200"
                >
                  <ImageIcon className="w-3.5 h-3.5 text-indigo-500" /> Export as PNG
                </button>
                <button
                  onClick={() => {
                    onExport('SVG');
                    setIsExportMenuOpen(false);
                  }}
                  className="w-full flex items-center gap-2 px-2.5 py-2 rounded-xl text-left hover:bg-slate-100 dark:hover:bg-slate-800 transition text-slate-700 dark:text-slate-200"
                >
                  <FileCode className="w-3.5 h-3.5 text-emerald-500" /> Export as SVG Vector
                </button>
                <button
                  onClick={() => {
                    onExport('JSON');
                    setIsExportMenuOpen(false);
                  }}
                  className="w-full flex items-center gap-2 px-2.5 py-2 rounded-xl text-left hover:bg-slate-100 dark:hover:bg-slate-800 transition text-slate-700 dark:text-slate-200"
                >
                  <FileCode className="w-3.5 h-3.5 text-amber-500" /> Save JSON Board Data
                </button>
              </div>
            )}
          </div>

          {/* Share Board Button */}
          <button
            onClick={() => setIsShareModalOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm shadow-indigo-600/30 transition"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Share</span>
          </button>

        </div>

      </div>

      {/* Share Modal */}
      {isShareModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
          <div className="w-full max-w-md rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl p-6 space-y-4 animate-in fade-in zoom-in-95 duration-150 text-slate-900 dark:text-slate-100">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 font-bold text-sm">
                <Share2 className="w-4 h-4" />
                <span>Share Collaborative Board</span>
              </div>
              <button
                onClick={() => setIsShareModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-white text-xs font-bold"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-slate-500 dark:text-slate-400">
              Anyone with this encrypted link in Apex Global Technologies can view and edit diagram vectors in real-time.
            </p>

            <div className="flex items-center gap-2 p-2 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs">
              <input
                type="text"
                readOnly
                value={`https://officeos.apextech.io/board/shared/${currentBoard.id}?token=jwt_live_sync`}
                className="w-full bg-transparent text-slate-700 dark:text-slate-300 font-mono text-[11px] focus:outline-none"
              />
              <button
                onClick={handleCopyShareLink}
                className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shrink-0 flex items-center gap-1"
              >
                {copiedLink ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                {copiedLink ? 'Copied' : 'Copy'}
              </button>
            </div>

            <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
              <span className="text-slate-400">Access Role Permission:</span>
              <span className="font-bold text-emerald-600 dark:text-emerald-400">
                Full Collaborative Edit (RBAC)
              </span>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
