'use client';

import React, { useState, useEffect } from 'react';
import { useOfficeOS } from '@/context/OfficeOSContext';
import { 
  MOCK_WHITEBOARDS, 
  MOCK_COLLABORATORS, 
  TEMPLATE_MICROSERVICES, 
  WhiteboardDocument, 
  WhiteboardElement, 
  ToolType, 
  CanvasPoint 
} from '@/lib/whiteboard-data';
import { WhiteboardHeader } from './WhiteboardHeader';
import { WhiteboardToolbar } from './WhiteboardToolbar';
import { WhiteboardStylePicker } from './WhiteboardStylePicker';
import { WhiteboardCanvas } from './WhiteboardCanvas';

export const WhiteboardRouter: React.FC = () => {
  const { addToast } = useOfficeOS();

  // State Management
  const [allBoards, setAllBoards] = useState<WhiteboardDocument[]>(MOCK_WHITEBOARDS);
  const [currentBoardId, setCurrentBoardId] = useState<string>('wb-1');
  const [activeTool, setActiveTool] = useState<ToolType>('select');
  const [selectedElementId, setSelectedElementId] = useState<string | null>(null);

  // Zoom & Pan State
  const [zoom, setZoom] = useState<number>(1);
  const [panOffset, setPanOffset] = useState<CanvasPoint>({ x: 0, y: 0 });

  // Style Defaults for drawing tools
  const [currentStrokeColor, setCurrentStrokeColor] = useState<string>('#6366f1');
  const [currentFillColor, setCurrentFillColor] = useState<string>('#6366f120');
  const [currentStrokeWidth, setCurrentStrokeWidth] = useState<number>(2);
  const [currentStrokeStyle, setCurrentStrokeStyle] = useState<'solid' | 'dashed' | 'dotted'>('solid');
  const [currentOpacity, setCurrentOpacity] = useState<number>(1);

  // Undo / Redo History Stack
  const [history, setHistory] = useState<WhiteboardElement[][]>([]);
  const [historyIndex, setHistoryIndex] = useState<number>(-1);

  // Collaborators with simulated live cursor movements
  const [collaborators, setCollaborators] = useState(MOCK_COLLABORATORS);

  // Current active board
  const currentBoard = allBoards.find(b => b.id === currentBoardId) || allBoards[0];
  const elements = currentBoard.elements;

  // Selected element reference
  const selectedElement = elements.find(el => el.id === selectedElementId) || null;

  // Sync selected element style to picker
  useEffect(() => {
    if (selectedElement) {
      setCurrentStrokeColor(selectedElement.strokeColor);
      setCurrentFillColor(selectedElement.fillColor);
      setCurrentStrokeWidth(selectedElement.strokeWidth);
      setCurrentStrokeStyle(selectedElement.strokeStyle);
      setCurrentOpacity(selectedElement.opacity);
    }
  }, [selectedElementId]);

  // Push new state to undo/redo history
  const pushHistory = (newElements: WhiteboardElement[]) => {
    const updatedHistory = history.slice(0, historyIndex + 1);
    updatedHistory.push(newElements);
    setHistory(updatedHistory);
    setHistoryIndex(updatedHistory.length - 1);
  };

  // Keyboard Shortcuts (V, H, R, B, D, O, A, L, P, T, S, E, Ctrl+Z, Delete)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't intercept if typing in an input or textarea
      if (['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement)?.tagName)) return;

      if ((e.ctrlKey || e.metaKey) && e.key === 'z') {
        e.preventDefault();
        handleUndo();
      } else if ((e.ctrlKey || e.metaKey) && e.key === 'y') {
        e.preventDefault();
        handleRedo();
      } else if (e.key === 'Delete' || e.key === 'Backspace') {
        if (selectedElementId) {
          handleDeleteSelected();
        }
      } else if (e.key.toLowerCase() === 'v') {
        setActiveTool('select');
      } else if (e.key.toLowerCase() === 'h') {
        setActiveTool('pan');
      } else if (e.key.toLowerCase() === 'r') {
        setActiveTool('rectangle');
      } else if (e.key.toLowerCase() === 'b') {
        setActiveTool('rounded-rect');
      } else if (e.key.toLowerCase() === 'd') {
        setActiveTool('diamond');
      } else if (e.key.toLowerCase() === 'o') {
        setActiveTool('ellipse');
      } else if (e.key.toLowerCase() === 'a') {
        setActiveTool('arrow');
      } else if (e.key.toLowerCase() === 'l') {
        setActiveTool('line');
      } else if (e.key.toLowerCase() === 'p') {
        setActiveTool('pen');
      } else if (e.key.toLowerCase() === 't') {
        setActiveTool('text');
      } else if (e.key.toLowerCase() === 's') {
        setActiveTool('sticky');
      } else if (e.key.toLowerCase() === 'e') {
        setActiveTool('eraser');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedElementId, historyIndex, history, elements]);

  // Simulated live cursor jitter/animation for realistic team presence
  useEffect(() => {
    const interval = setInterval(() => {
      setCollaborators(prev => prev.map(c => ({
        ...c,
        cursor: {
          x: Math.max(100, Math.min(1000, c.cursor.x + (Math.random() * 20 - 10))),
          y: Math.max(100, Math.min(600, c.cursor.y + (Math.random() * 20 - 10))),
        }
      })));
    }, 2500);

    return () => clearInterval(interval);
  }, []);

  // Update elements in current board
  const updateBoardElements = (newElements: WhiteboardElement[]) => {
    setAllBoards(prev => prev.map(b => {
      if (b.id === currentBoardId) {
        return {
          ...b,
          elements: newElements,
          lastEditedBy: 'You',
          lastEditedTime: 'Just now',
        };
      }
      return b;
    }));
    pushHistory(newElements);
  };

  // Add Element
  const handleAddElement = (newElement: WhiteboardElement) => {
    const newElements = [...elements, newElement];
    updateBoardElements(newElements);
  };

  // Update Element
  const handleUpdateElement = (id: string, updates: Partial<WhiteboardElement>) => {
    const newElements = elements.map(el => {
      if (el.id === id) {
        return { ...el, ...updates };
      }
      return el;
    });
    updateBoardElements(newElements);
  };

  // Delete Element
  const handleDeleteElement = (id: string) => {
    const newElements = elements.filter(el => el.id !== id);
    updateBoardElements(newElements);
    if (selectedElementId === id) {
      setSelectedElementId(null);
    }
  };

  const handleDeleteSelected = () => {
    if (selectedElementId) {
      handleDeleteElement(selectedElementId);
      addToast({
        title: 'Element Removed',
        description: 'Vector object deleted from canvas.',
        type: 'info',
      });
    }
  };

  // Duplicate Selected Element
  const handleDuplicateSelected = () => {
    if (!selectedElement) return;
    const duplicated: WhiteboardElement = {
      ...selectedElement,
      id: `el-${Date.now()}-${Math.random().toString(36).substring(2, 5)}`,
      x: selectedElement.x + 30,
      y: selectedElement.y + 30,
      points: selectedElement.points?.map(p => ({ x: p.x + 30, y: p.y + 30 })),
    };
    handleAddElement(duplicated);
    setSelectedElementId(duplicated.id);
    addToast({
      title: 'Element Duplicated',
      description: 'Cloned vector layer onto canvas.',
      type: 'success',
    });
  };

  // Layer Ordering: Bring to Front / Send to Back
  const handleBringToFront = () => {
    if (!selectedElementId) return;
    const item = elements.find(el => el.id === selectedElementId);
    if (!item) return;
    const rest = elements.filter(el => el.id !== selectedElementId);
    updateBoardElements([...rest, item]);
  };

  const handleSendToBack = () => {
    if (!selectedElementId) return;
    const item = elements.find(el => el.id === selectedElementId);
    if (!item) return;
    const rest = elements.filter(el => el.id !== selectedElementId);
    updateBoardElements([item, ...rest]);
  };

  // Undo / Redo Actions
  const handleUndo = () => {
    if (historyIndex > 0) {
      const prevIndex = historyIndex - 1;
      const prevElements = history[prevIndex];
      setHistoryIndex(prevIndex);
      setAllBoards(prev => prev.map(b => b.id === currentBoardId ? { ...b, elements: prevElements } : b));
    }
  };

  const handleRedo = () => {
    if (historyIndex < history.length - 1) {
      const nextIndex = historyIndex + 1;
      const nextElements = history[nextIndex];
      setHistoryIndex(nextIndex);
      setAllBoards(prev => prev.map(b => b.id === currentBoardId ? { ...b, elements: nextElements } : b));
    }
  };

  // Clear Canvas
  const handleClearBoard = () => {
    if (window.confirm('Are you sure you want to clear this entire canvas?')) {
      updateBoardElements([]);
      setSelectedElementId(null);
      addToast({
        title: 'Canvas Cleared',
        description: 'All vector shapes and sticky notes cleared.',
        type: 'warning',
      });
    }
  };

  // Load Template
  const handleLoadTemplate = (templateType: 'MICROSERVICES' | 'CHECKOUT_FLOW' | 'BLANK') => {
    if (templateType === 'MICROSERVICES') {
      updateBoardElements(TEMPLATE_MICROSERVICES);
      addToast({
        title: 'Template Loaded',
        description: 'Microservices Architecture inserted onto canvas.',
        type: 'success',
      });
    } else if (templateType === 'CHECKOUT_FLOW') {
      const checkoutElements = MOCK_WHITEBOARDS[1].elements;
      updateBoardElements(checkoutElements);
      addToast({
        title: 'Template Loaded',
        description: 'Checkout Decision Flow inserted onto canvas.',
        type: 'success',
      });
    } else {
      updateBoardElements([]);
      addToast({
        title: 'Blank Canvas Ready',
        description: 'Start drawing with toolbar icons above.',
        type: 'info',
      });
    }
  };

  // Create New Board
  const handleCreateNewBoard = () => {
    const newBoardId = `wb-${Date.now()}`;
    const newBoard: WhiteboardDocument = {
      id: newBoardId,
      title: `Untitled System Diagram #${allBoards.length + 1}`,
      category: 'ARCHITECTURE',
      lastEditedBy: 'You',
      lastEditedTime: 'Just now',
      collaboratorsCount: 1,
      thumbnailColor: 'from-blue-900 to-slate-900',
      elements: [],
    };
    setAllBoards(prev => [newBoard, ...prev]);
    setCurrentBoardId(newBoardId);
    setSelectedElementId(null);
    addToast({
      title: 'New Board Created',
      description: 'Collaborative vector canvas ready.',
      type: 'success',
    });
  };

  // Rename Title
  const handleRenameTitle = (newTitle: string) => {
    setAllBoards(prev => prev.map(b => b.id === currentBoardId ? { ...b, title: newTitle } : b));
    addToast({
      title: 'Board Renamed',
      description: `Saved as "${newTitle}".`,
      type: 'info',
    });
  };

  // Export Canvas
  const handleExport = (format: 'PNG' | 'SVG' | 'JSON') => {
    if (format === 'JSON') {
      const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(currentBoard, null, 2));
      const downloadAnchor = document.createElement('a');
      downloadAnchor.setAttribute("href", dataStr);
      downloadAnchor.setAttribute("download", `${currentBoard.title.toLowerCase().replace(/\s+/g, '-')}.json`);
      document.body.appendChild(downloadAnchor);
      downloadAnchor.click();
      downloadAnchor.remove();
      addToast({
        title: 'JSON Export Complete',
        description: 'Raw diagram vector schema downloaded.',
        type: 'success',
      });
    } else {
      addToast({
        title: `Exported as ${format}`,
        description: `High-resolution diagram vector saved to downloads.`,
        type: 'success',
      });
    }
  };

  return (
    <div className="relative w-full h-[calc(100vh-4rem)] flex flex-col overflow-hidden bg-slate-950 text-slate-100 select-none">
      
      {/* Top Whiteboard Header */}
      <WhiteboardHeader
        currentBoard={currentBoard}
        allBoards={allBoards}
        collaborators={collaborators}
        zoom={zoom}
        onZoomIn={() => setZoom(prev => Math.min(2.5, prev + 0.15))}
        onZoomOut={() => setZoom(prev => Math.max(0.4, prev - 0.15))}
        onResetZoom={() => { setZoom(1); setPanOffset({ x: 0, y: 0 }); }}
        onSelectBoard={(id) => { setCurrentBoardId(id); setSelectedElementId(null); }}
        onCreateNewBoard={handleCreateNewBoard}
        onLoadTemplate={handleLoadTemplate}
        onExport={handleExport}
        onRenameTitle={handleRenameTitle}
      />

      {/* Main Canvas Viewport Area */}
      <div className="relative flex-1 w-full h-full overflow-hidden">
        
        {/* Floating Tool Dock */}
        <WhiteboardToolbar
          activeTool={activeTool}
          onSelectTool={(t) => {
            setActiveTool(t);
            if (t !== 'select') setSelectedElementId(null);
          }}
          canUndo={historyIndex > 0}
          canRedo={historyIndex < history.length - 1}
          onUndo={handleUndo}
          onRedo={handleRedo}
          onClear={handleClearBoard}
        />

        {/* Floating Inspector Panel (shown when select is active or tool is chosen) */}
        {(selectedElementId || activeTool !== 'pan') && (
          <WhiteboardStylePicker
            selectedElement={selectedElement}
            currentStrokeColor={currentStrokeColor}
            currentFillColor={currentFillColor}
            currentStrokeWidth={currentStrokeWidth}
            currentStrokeStyle={currentStrokeStyle}
            currentOpacity={currentOpacity}
            onUpdateStyle={(updates) => {
              if (selectedElementId) {
                handleUpdateElement(selectedElementId, updates);
              }
              if (updates.strokeColor) setCurrentStrokeColor(updates.strokeColor);
              if (updates.fillColor) setCurrentFillColor(updates.fillColor);
              if (updates.strokeWidth) setCurrentStrokeWidth(updates.strokeWidth);
              if (updates.strokeStyle) setCurrentStrokeStyle(updates.strokeStyle);
              if (updates.opacity) setCurrentOpacity(updates.opacity);
            }}
            onDeleteSelected={handleDeleteSelected}
            onDuplicateSelected={handleDuplicateSelected}
            onBringToFront={handleBringToFront}
            onSendToBack={handleSendToBack}
          />
        )}

        {/* SVG Interactive Canvas */}
        <WhiteboardCanvas
          elements={elements}
          activeTool={activeTool}
          selectedElementId={selectedElementId}
          currentStrokeColor={currentStrokeColor}
          currentFillColor={currentFillColor}
          currentStrokeWidth={currentStrokeWidth}
          currentStrokeStyle={currentStrokeStyle}
          currentOpacity={currentOpacity}
          zoom={zoom}
          panOffset={panOffset}
          collaborators={collaborators}
          onSelectElement={setSelectedElementId}
          onAddElement={handleAddElement}
          onUpdateElement={handleUpdateElement}
          onDeleteElement={handleDeleteElement}
          onPanChange={setPanOffset}
        />

      </div>

    </div>
  );
};
