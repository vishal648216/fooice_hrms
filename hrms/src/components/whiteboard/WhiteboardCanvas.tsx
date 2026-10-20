'use client';

import React, { useState, useRef, useEffect } from 'react';
import { 
  WhiteboardElement, 
  WhiteboardCollaborator, 
  ToolType, 
  CanvasPoint 
} from '@/lib/whiteboard-data';
import { Pin } from 'lucide-react';

interface WhiteboardCanvasProps {
  elements: WhiteboardElement[];
  activeTool: ToolType;
  selectedElementId: string | null;
  currentStrokeColor: string;
  currentFillColor: string;
  currentStrokeWidth: number;
  currentStrokeStyle: 'solid' | 'dashed' | 'dotted';
  currentOpacity: number;
  zoom: number;
  panOffset: CanvasPoint;
  collaborators: WhiteboardCollaborator[];
  onSelectElement: (id: string | null) => void;
  onAddElement: (element: WhiteboardElement) => void;
  onUpdateElement: (id: string, updates: Partial<WhiteboardElement>) => void;
  onDeleteElement: (id: string) => void;
  onPanChange: (offset: CanvasPoint) => void;
}

export const WhiteboardCanvas: React.FC<WhiteboardCanvasProps> = ({
  elements,
  activeTool,
  selectedElementId,
  currentStrokeColor,
  currentFillColor,
  currentStrokeWidth,
  currentStrokeStyle,
  currentOpacity,
  zoom,
  panOffset,
  collaborators,
  onSelectElement,
  onAddElement,
  onUpdateElement,
  onDeleteElement,
  onPanChange,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [isPanning, setIsPanning] = useState(false);
  const [isDraggingElement, setIsDraggingElement] = useState(false);
  const [dragStartPoint, setDragStartPoint] = useState<CanvasPoint>({ x: 0, y: 0 });
  const [elementStartPos, setElementStartPos] = useState<CanvasPoint>({ x: 0, y: 0 });
  const [currentDrawingElement, setCurrentDrawingElement] = useState<WhiteboardElement | null>(null);
  const [editingTextElementId, setEditingTextElementId] = useState<string | null>(null);
  const [inlineTextValue, setInlineTextValue] = useState('');

  // Transform screen coords to canvas SVG coords taking pan and zoom into account
  const getCanvasCoords = (e: React.MouseEvent): CanvasPoint => {
    if (!containerRef.current) return { x: 0, y: 0 };
    const rect = containerRef.current.getBoundingClientRect();
    const screenX = e.clientX - rect.left;
    const screenY = e.clientY - rect.top;
    return {
      x: (screenX - panOffset.x) / zoom,
      y: (screenY - panOffset.y) / zoom,
    };
  };

  // Mouse Down Event
  const handleMouseDown = (e: React.MouseEvent) => {
    // If double clicking to edit text, ignore canvas mousedown
    if (editingTextElementId) return;

    const coords = getCanvasCoords(e);

    // Pan Tool or Middle Click
    if (activeTool === 'pan' || e.button === 1) {
      setIsPanning(true);
      setDragStartPoint({ x: e.clientX - panOffset.x, y: e.clientY - panOffset.y });
      return;
    }

    // Select Tool: Click on canvas to deselect
    if (activeTool === 'select') {
      onSelectElement(null);
      return;
    }

    // Eraser Tool
    if (activeTool === 'eraser') {
      return;
    }

    // Start drawing a new element
    setIsDrawing(true);
    setDragStartPoint(coords);

    const newId = `el-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;

    if (activeTool === 'pen') {
      const newEl: WhiteboardElement = {
        id: newId,
        type: 'pen',
        x: coords.x,
        y: coords.y,
        width: 0,
        height: 0,
        strokeColor: currentStrokeColor,
        fillColor: 'transparent',
        strokeWidth: currentStrokeWidth,
        strokeStyle: currentStrokeStyle,
        opacity: currentOpacity,
        points: [{ x: coords.x, y: coords.y }],
      };
      setCurrentDrawingElement(newEl);
    } else if (activeTool === 'sticky') {
      const newEl: WhiteboardElement = {
        id: newId,
        type: 'sticky',
        x: coords.x,
        y: coords.y,
        width: 180,
        height: 120,
        strokeColor: '#facc15',
        fillColor: '#fef08a',
        strokeWidth: 1,
        strokeStyle: 'solid',
        opacity: 1,
        stickyColor: '#fef08a',
        text: 'New Idea Note...\nClick to edit text',
        fontSize: 12,
        textColor: '#713f12',
        author: 'You',
      };
      onAddElement(newEl);
      onSelectElement(newId);
      setIsDrawing(false);
    } else if (activeTool === 'text') {
      const newEl: WhiteboardElement = {
        id: newId,
        type: 'text',
        x: coords.x,
        y: coords.y,
        width: 160,
        height: 40,
        strokeColor: 'transparent',
        fillColor: 'transparent',
        strokeWidth: 1,
        strokeStyle: 'solid',
        opacity: 1,
        text: 'Heading Text',
        fontSize: 16,
        textColor: currentStrokeColor === '#ffffff' ? '#ffffff' : '#6366f1',
      };
      onAddElement(newEl);
      onSelectElement(newId);
      setEditingTextElementId(newId);
      setInlineTextValue('Heading Text');
      setIsDrawing(false);
    } else {
      // Shapes: rectangle, rounded-rect, ellipse, diamond, arrow, line
      const newEl: WhiteboardElement = {
        id: newId,
        type: activeTool,
        x: coords.x,
        y: coords.y,
        width: 0,
        height: 0,
        strokeColor: currentStrokeColor,
        fillColor: currentFillColor,
        strokeWidth: currentStrokeWidth,
        strokeStyle: currentStrokeStyle,
        opacity: currentOpacity,
        text: activeTool === 'arrow' || activeTool === 'line' ? undefined : 'Process Node',
        fontSize: 12,
        textColor: '#ffffff',
        arrowHead: activeTool === 'arrow' ? 'end' : undefined,
        points: activeTool === 'arrow' || activeTool === 'line' 
          ? [{ x: coords.x, y: coords.y }, { x: coords.x, y: coords.y }]
          : undefined,
      };
      setCurrentDrawingElement(newEl);
    }
  };

  // Mouse Move Event
  const handleMouseMove = (e: React.MouseEvent) => {
    if (isPanning) {
      onPanChange({
        x: e.clientX - dragStartPoint.x,
        y: e.clientY - dragStartPoint.y,
      });
      return;
    }

    if (isDraggingElement && selectedElementId) {
      const coords = getCanvasCoords(e);
      const dx = coords.x - dragStartPoint.x;
      const dy = coords.y - dragStartPoint.y;

      const selectedEl = elements.find(el => el.id === selectedElementId);
      if (selectedEl) {
        if (selectedEl.points && (selectedEl.type === 'arrow' || selectedEl.type === 'line' || selectedEl.type === 'pen')) {
          const shiftedPoints = selectedEl.points.map(pt => ({
            x: pt.x + (coords.x - dragStartPoint.x),
            y: pt.y + (coords.y - dragStartPoint.y)
          }));
          onUpdateElement(selectedElementId, {
            x: elementStartPos.x + dx,
            y: elementStartPos.y + dy,
            points: shiftedPoints,
          });
        } else {
          onUpdateElement(selectedElementId, {
            x: Math.round(elementStartPos.x + dx),
            y: Math.round(elementStartPos.y + dy),
          });
        }
      }
      return;
    }

    if (isDrawing && currentDrawingElement) {
      const coords = getCanvasCoords(e);

      if (currentDrawingElement.type === 'pen') {
        setCurrentDrawingElement(prev => {
          if (!prev) return null;
          return {
            ...prev,
            points: [...(prev.points || []), coords],
          };
        });
      } else if (currentDrawingElement.type === 'arrow' || currentDrawingElement.type === 'line') {
        const start = { x: currentDrawingElement.x, y: currentDrawingElement.y };
        setCurrentDrawingElement(prev => {
          if (!prev) return null;
          return {
            ...prev,
            width: coords.x - start.x,
            height: coords.y - start.y,
            points: [start, coords],
          };
        });
      } else {
        const x = Math.min(dragStartPoint.x, coords.x);
        const y = Math.min(dragStartPoint.y, coords.y);
        const width = Math.abs(coords.x - dragStartPoint.x);
        const height = Math.abs(coords.y - dragStartPoint.y);

        setCurrentDrawingElement(prev => {
          if (!prev) return null;
          return {
            ...prev,
            x,
            y,
            width,
            height,
          };
        });
      }
    }
  };

  // Mouse Up Event
  const handleMouseUp = () => {
    if (isPanning) {
      setIsPanning(false);
      return;
    }

    if (isDraggingElement) {
      setIsDraggingElement(false);
      return;
    }

    if (isDrawing && currentDrawingElement) {
      // Validate minimum size for shapes
      if (
        currentDrawingElement.type === 'pen' || 
        currentDrawingElement.type === 'arrow' || 
        currentDrawingElement.type === 'line' ||
        (currentDrawingElement.width > 20 && currentDrawingElement.height > 20)
      ) {
        onAddElement(currentDrawingElement);
        onSelectElement(currentDrawingElement.id);
      }
      setIsDrawing(false);
      setCurrentDrawingElement(null);
    }
  };

  // Element Click / Drag Handlers
  const handleElementMouseDown = (e: React.MouseEvent, element: WhiteboardElement) => {
    e.stopPropagation();

    if (activeTool === 'eraser') {
      onDeleteElement(element.id);
      return;
    }

    if (activeTool === 'select') {
      onSelectElement(element.id);
      setIsDraggingElement(true);
      const coords = getCanvasCoords(e);
      setDragStartPoint(coords);
      setElementStartPos({ x: element.x, y: element.y });
    }
  };

  // Double Click Element to edit its text
  const handleElementDoubleClick = (e: React.MouseEvent, element: WhiteboardElement) => {
    e.stopPropagation();
    setEditingTextElementId(element.id);
    setInlineTextValue(element.text || '');
  };

  const handleSaveInlineText = () => {
    if (editingTextElementId) {
      onUpdateElement(editingTextElementId, { text: inlineTextValue });
      setEditingTextElementId(null);
    }
  };

  // Render SVG Shape
  const renderShape = (el: WhiteboardElement, isSelected: boolean) => {
    const strokeDash = el.strokeStyle === 'dashed' ? '6,6' : el.strokeStyle === 'dotted' ? '2,4' : undefined;

    switch (el.type) {
      case 'rectangle':
        return (
          <g key={el.id} className="cursor-move group">
            <rect
              x={el.x}
              y={el.y}
              width={el.width}
              height={el.height}
              rx={6}
              fill={el.fillColor}
              stroke={el.strokeColor}
              strokeWidth={el.strokeWidth}
              strokeDasharray={strokeDash}
              opacity={el.opacity}
              className="transition-all"
            />
            {el.text && (
              <text
                x={el.x + el.width / 2}
                y={el.y + el.height / 2}
                fill={el.textColor || '#ffffff'}
                fontSize={el.fontSize || 12}
                textAnchor="middle"
                dominantBaseline="middle"
                className="font-sans font-semibold pointer-events-none select-none"
              >
                {el.text.split('\n').map((line, i, arr) => (
                  <tspan
                    key={i}
                    x={el.x + el.width / 2}
                    dy={i === 0 ? -(arr.length - 1) * 7 : 14}
                  >
                    {line}
                  </tspan>
                ))}
              </text>
            )}
          </g>
        );

      case 'rounded-rect':
        return (
          <g key={el.id} className="cursor-move group">
            <rect
              x={el.x}
              y={el.y}
              width={el.width}
              height={el.height}
              rx={18}
              fill={el.fillColor}
              stroke={el.strokeColor}
              strokeWidth={el.strokeWidth}
              strokeDasharray={strokeDash}
              opacity={el.opacity}
            />
            {el.text && (
              <text
                x={el.x + el.width / 2}
                y={el.y + el.height / 2}
                fill={el.textColor || '#ffffff'}
                fontSize={el.fontSize || 12}
                textAnchor="middle"
                dominantBaseline="middle"
                className="font-sans font-semibold pointer-events-none select-none"
              >
                {el.text.split('\n').map((line, i, arr) => (
                  <tspan
                    key={i}
                    x={el.x + el.width / 2}
                    dy={i === 0 ? -(arr.length - 1) * 7 : 14}
                  >
                    {line}
                  </tspan>
                ))}
              </text>
            )}
          </g>
        );

      case 'ellipse':
        return (
          <g key={el.id} className="cursor-move group">
            <ellipse
              cx={el.x + el.width / 2}
              cy={el.y + el.height / 2}
              rx={Math.max(10, el.width / 2)}
              ry={Math.max(10, el.height / 2)}
              fill={el.fillColor}
              stroke={el.strokeColor}
              strokeWidth={el.strokeWidth}
              strokeDasharray={strokeDash}
              opacity={el.opacity}
            />
            {el.text && (
              <text
                x={el.x + el.width / 2}
                y={el.y + el.height / 2}
                fill={el.textColor || '#ffffff'}
                fontSize={el.fontSize || 12}
                textAnchor="middle"
                dominantBaseline="middle"
                className="font-sans font-semibold pointer-events-none select-none"
              >
                {el.text.split('\n').map((line, i, arr) => (
                  <tspan
                    key={i}
                    x={el.x + el.width / 2}
                    dy={i === 0 ? -(arr.length - 1) * 7 : 14}
                  >
                    {line}
                  </tspan>
                ))}
              </text>
            )}
          </g>
        );

      case 'diamond': {
        const cx = el.x + el.width / 2;
        const cy = el.y + el.height / 2;
        const pointsStr = `${cx},${el.y} ${el.x + el.width},${cy} ${cx},${el.y + el.height} ${el.x},${cy}`;
        return (
          <g key={el.id} className="cursor-move group">
            <polygon
              points={pointsStr}
              fill={el.fillColor}
              stroke={el.strokeColor}
              strokeWidth={el.strokeWidth}
              strokeDasharray={strokeDash}
              opacity={el.opacity}
            />
            {el.text && (
              <text
                x={cx}
                y={cy}
                fill={el.textColor || '#ffffff'}
                fontSize={el.fontSize || 11}
                textAnchor="middle"
                dominantBaseline="middle"
                className="font-sans font-semibold pointer-events-none select-none"
              >
                {el.text.split('\n').map((line, i, arr) => (
                  <tspan
                    key={i}
                    x={cx}
                    dy={i === 0 ? -(arr.length - 1) * 7 : 14}
                  >
                    {line}
                  </tspan>
                ))}
              </text>
            )}
          </g>
        );
      }

      case 'arrow':
      case 'line': {
        if (!el.points || el.points.length < 2) return null;
        const p1 = el.points[0];
        const p2 = el.points[el.points.length - 1];

        // Arrow head angle calculation
        const angle = Math.atan2(p2.y - p1.y, p2.x - p1.x);
        const headLength = 12;
        const arrowP1 = {
          x: p2.x - headLength * Math.cos(angle - Math.PI / 6),
          y: p2.y - headLength * Math.sin(angle - Math.PI / 6),
        };
        const arrowP2 = {
          x: p2.x - headLength * Math.cos(angle + Math.PI / 6),
          y: p2.y - headLength * Math.sin(angle + Math.PI / 6),
        };

        return (
          <g key={el.id} className="cursor-move group">
            <line
              x1={p1.x}
              y1={p1.y}
              x2={p2.x}
              y2={p2.y}
              stroke={el.strokeColor}
              strokeWidth={el.strokeWidth}
              strokeDasharray={strokeDash}
              strokeLinecap="round"
              opacity={el.opacity}
            />
            {el.type === 'arrow' && (
              <polygon
                points={`${p2.x},${p2.y} ${arrowP1.x},${arrowP1.y} ${arrowP2.x},${arrowP2.y}`}
                fill={el.strokeColor}
              />
            )}
          </g>
        );
      }

      case 'pen': {
        if (!el.points || el.points.length < 2) return null;
        const pathData = el.points.reduce((acc, pt, i) => {
          return i === 0 ? `M ${pt.x} ${pt.y}` : `${acc} L ${pt.x} ${pt.y}`;
        }, '');

        return (
          <g key={el.id} className="cursor-move">
            <path
              d={pathData}
              fill="none"
              stroke={el.strokeColor}
              strokeWidth={el.strokeWidth}
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeDasharray={strokeDash}
              opacity={el.opacity}
            />
          </g>
        );
      }

      case 'text':
        return (
          <g key={el.id} className="cursor-move">
            <text
              x={el.x}
              y={el.y + 20}
              fill={el.textColor || el.strokeColor || '#ffffff'}
              fontSize={el.fontSize || 16}
              className="font-sans font-bold select-none"
            >
              {el.text || 'Type something...'}
            </text>
          </g>
        );

      case 'sticky':
        return (
          <g key={el.id} className="cursor-move">
            {/* Drop shadow */}
            <rect
              x={el.x + 4}
              y={el.y + 4}
              width={el.width}
              height={el.height}
              rx={6}
              fill="#00000030"
            />
            {/* Sticky Body */}
            <rect
              x={el.x}
              y={el.y}
              width={el.width}
              height={el.height}
              rx={6}
              fill={el.fillColor || '#fef08a'}
              stroke={el.strokeColor || '#facc15'}
              strokeWidth={el.strokeWidth || 1}
            />
            {/* Sticky Pin Top Tag */}
            <circle cx={el.x + el.width / 2} cy={el.y + 10} r={4} fill="#e11d48" />
            
            {/* Note text */}
            <foreignObject x={el.x + 10} y={el.y + 20} width={el.width - 20} height={el.height - 35}>
              <div 
                style={{ color: el.textColor || '#713f12', fontSize: `${el.fontSize || 11}px` }}
                className="font-sans font-medium leading-tight h-full overflow-hidden"
              >
                {el.text}
                {el.author && (
                  <div className="mt-1 text-[9px] font-bold opacity-75">
                    — {el.author}
                  </div>
                )}
              </div>
            </foreignObject>
          </g>
        );

      default:
        return null;
    }
  };

  return (
    <div
      ref={containerRef}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      className={`relative w-full h-full overflow-hidden bg-slate-950 select-none ${
        activeTool === 'pan' ? 'cursor-grab active:cursor-grabbing' : activeTool === 'select' ? 'cursor-default' : 'cursor-crosshair'
      }`}
      style={{
        backgroundImage: `radial-gradient(#334155 1px, transparent 1px)`,
        backgroundSize: `${24 * zoom}px ${24 * zoom}px`,
        backgroundPosition: `${panOffset.x}px ${panOffset.y}px`,
      }}
    >
      {/* SVG Canvas Layer */}
      <svg
        className="w-full h-full pointer-events-none"
        style={{
          transform: `translate(${panOffset.x}px, ${panOffset.y}px) scale(${zoom})`,
          transformOrigin: '0 0',
        }}
      >
        <defs>
          <filter id="shadow" x="-10%" y="-10%" width="120%" height="120%">
            <feDropShadow dx="0" dy="4" stdDeviation="6" floodColor="#000000" floodOpacity="0.3" />
          </filter>
        </defs>

        {/* Existing Elements */}
        {elements.map((el) => {
          const isSelected = selectedElementId === el.id;
          return (
            <g
              key={el.id}
              className="pointer-events-auto"
              onMouseDown={(e) => handleElementMouseDown(e, el)}
              onDoubleClick={(e) => handleElementDoubleClick(e, el)}
            >
              {renderShape(el, isSelected)}

              {/* Selection Box & Resize Handles */}
              {isSelected && (
                <rect
                  x={el.x - 4}
                  y={el.y - 4}
                  width={el.width + 8}
                  height={el.height + 8}
                  fill="none"
                  stroke="#6366f1"
                  strokeWidth={1.5}
                  strokeDasharray="4,4"
                  rx={4}
                  className="pointer-events-none animate-pulse"
                />
              )}
            </g>
          );
        })}

        {/* Active Drawing Preview */}
        {currentDrawingElement && (
          <g className="pointer-events-none opacity-90">
            {renderShape(currentDrawingElement, false)}
          </g>
        )}

        {/* Real-time Live Collaborator Cursors */}
        {collaborators.map((c) => (
          <g
            key={c.id}
            className="pointer-events-none transition-transform duration-75"
            transform={`translate(${c.cursor.x}, ${c.cursor.y})`}
          >
            {/* Mouse Pointer Arrow */}
            <path
              d="M0 0 L5 16 L8 11 L14 11 Z"
              fill={c.color}
              stroke="#0f172a"
              strokeWidth={1.5}
            />
            {/* User Nametag Pill */}
            <g transform="translate(12, 14)">
              <rect
                x={0}
                y={0}
                width={c.name.length * 7 + 16}
                height={18}
                rx={9}
                fill={c.color}
              />
              <text
                x={8}
                y={12}
                fill="#ffffff"
                fontSize={9}
                fontWeight="bold"
                className="font-sans"
              >
                {c.name.split(' ')[0]} ({c.activeTool})
              </text>
            </g>
          </g>
        ))}
      </svg>

      {/* Inline Text Editor Overlay (on double click) */}
      {editingTextElementId && (
        <div
          className="absolute z-30 p-2 rounded-xl bg-slate-900 border border-indigo-500 shadow-2xl animate-in zoom-in-95 duration-100"
          style={{
            left: `${elements.find(el => el.id === editingTextElementId)!.x * zoom + panOffset.x}px`,
            top: `${elements.find(el => el.id === editingTextElementId)!.y * zoom + panOffset.y}px`,
          }}
        >
          <textarea
            value={inlineTextValue}
            onChange={(e) => setInlineTextValue(e.target.value)}
            autoFocus
            rows={3}
            className="w-56 p-2 rounded-lg text-xs font-sans font-semibold bg-slate-950 text-white border border-slate-700 focus:outline-none focus:border-indigo-500"
            placeholder="Enter diagram label or notes..."
          />
          <div className="flex items-center justify-end gap-1 mt-1">
            <button
              onClick={() => setEditingTextElementId(null)}
              className="px-2 py-1 rounded text-[10px] text-slate-400 hover:text-white"
            >
              Cancel
            </button>
            <button
              onClick={handleSaveInlineText}
              className="px-2.5 py-1 rounded bg-indigo-600 hover:bg-indigo-700 text-white text-[10px] font-bold"
            >
              Save (Enter)
            </button>
          </div>
        </div>
      )}

      {/* Canvas Bottom Left Legend & Hotkey Helper */}
      <div className="absolute bottom-4 left-4 z-10 flex items-center gap-3 px-3 py-1.5 rounded-xl bg-slate-900/80 backdrop-blur-md border border-slate-800 text-[11px] text-slate-400 select-none hidden sm:flex">
        <span>💡 <strong>Double-click</strong> element to edit text</span>
        <span className="w-1 h-1 rounded-full bg-slate-700" />
        <span><strong>Space + Drag</strong> to pan canvas</span>
        <span className="w-1 h-1 rounded-full bg-slate-700" />
        <span><strong>Ctrl + Z</strong> to undo</span>
      </div>

    </div>
  );
};
