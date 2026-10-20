'use client';

import React, { useState } from 'react';
import { useOfficeOS } from '@/context/OfficeOSContext';
import { 
  MOCK_STORAGE_FOLDERS, 
  MOCK_DRIVE_FILES, 
  DriveFileItem, 
  StorageFolderItem,
  FileExtensionType 
} from '@/lib/files-data';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { 
  HardDrive, 
  Folder, 
  FileText, 
  FileCode, 
  FileArchive, 
  Image, 
  Video, 
  Plus, 
  Search, 
  Download, 
  Share2, 
  Star, 
  Trash2, 
  Upload, 
  FolderPlus, 
  LayoutGrid, 
  Table as TableIcon, 
  Clock, 
  ShieldCheck, 
  Sparkles,
  ChevronRight
} from 'lucide-react';

export const FilesDriveView: React.FC = () => {
  const { addToast } = useOfficeOS();
  const [folders, setFolders] = useState<StorageFolderItem[]>(MOCK_STORAGE_FOLDERS);
  const [files, setFiles] = useState<DriveFileItem[]>(MOCK_DRIVE_FILES);
  const [selectedFolderId, setSelectedFolderId] = useState<string>('ALL');
  const [selectedExtension, setSelectedExtension] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');
  const [showUploadModal, setShowUploadModal] = useState(false);

  // New File Form State
  const [newFileName, setNewFileName] = useState('');
  const [newFolderId, setNewFolderId] = useState(MOCK_STORAGE_FOLDERS[0].id);
  const [newExtension, setNewExtension] = useState<FileExtensionType>('pdf');
  const [newVersion, setNewVersion] = useState('v1.0');

  const filteredFiles = files.filter(f => {
    const matchesFolder = selectedFolderId === 'ALL' || f.folderId === selectedFolderId;
    const matchesExt = selectedExtension === 'ALL' || f.extension === selectedExtension;
    const matchesQuery = f.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         (f.projectName && f.projectName.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesFolder && matchesExt && matchesQuery;
  });

  const getFileIcon = (ext: FileExtensionType) => {
    switch (ext) {
      case 'pdf': return <FileText className="w-5 h-5 text-rose-500" />;
      case 'figma': return <Image className="w-5 h-5 text-purple-500" />;
      case 'code': return <FileCode className="w-5 h-5 text-blue-500" />;
      case 'archive': return <FileArchive className="w-5 h-5 text-amber-500" />;
      case 'video': return <Video className="w-5 h-5 text-emerald-500" />;
      default: return <FileText className="w-5 h-5 text-slate-400" />;
    }
  };

  const handleToggleStar = (fileId: string) => {
    setFiles(prev => prev.map(f => f.id === fileId ? { ...f, isStarred: !f.isStarred } : f));
  };

  const handleUploadFile = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFileName.trim()) return;

    const newF: DriveFileItem = {
      id: `file-${Date.now()}`,
      folderId: newFolderId,
      name: newFileName.endsWith(`.${newExtension}`) ? newFileName : `${newFileName}.${newExtension}`,
      extension: newExtension,
      sizeBytes: 8388608,
      sizeFormatted: '8.0 MB',
      updatedAt: new Date().toISOString().split('T')[0],
      version: newVersion,
      projectName: 'NovaPay Neobank',
      uploadedBy: {
        name: 'Arjun Nambiar',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
        role: 'Lead Full-Stack Engineer',
      },
      isStarred: false,
      accessLevel: 'CONFIDENTIAL',
    };

    setFiles(prev => [newF, ...prev]);
    setShowUploadModal(false);
    setNewFileName('');
    addToast({
      title: 'File Uploaded',
      description: `${newF.name} encrypted and synced to cloud storage.`,
      type: 'success'
    });
  };

  return (
    <div className="space-y-6">
      {/* Storage Quota Header */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        <Card className="p-4 lg:col-span-2 bg-gradient-to-br from-indigo-50/50 to-white dark:from-indigo-950/20 dark:to-slate-900 border-indigo-100 dark:border-indigo-900/40 flex flex-col justify-between space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-indigo-600/10 text-indigo-600 dark:text-indigo-400">
                <HardDrive className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-bold text-xs text-slate-900 dark:text-white">Encrypted Enterprise Cloud Storage</h3>
                <p className="text-[11px] text-slate-500">AES-256 encrypted multi-region bucket</p>
              </div>
            </div>
            <span className="font-mono text-xs font-bold text-indigo-600 dark:text-indigo-400">
              135.4 GB / 5.0 TB (2.7%)
            </span>
          </div>

          <div className="w-full h-2.5 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden">
            <div className="h-full bg-gradient-to-r from-indigo-500 via-indigo-600 to-purple-600 rounded-full w-[14%]" />
          </div>

          <div className="flex items-center justify-between text-[11px] text-slate-400">
            <span>{files.length} total managed assets</span>
            <span>Automated Daily Snapshot Backups: Active ✓</span>
          </div>
        </Card>

        <Card className="p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex flex-col justify-between">
          <span className="text-xs font-semibold text-slate-500">Total Root Folders</span>
          <div className="text-2xl font-bold font-mono text-slate-900 dark:text-white mt-1">
            {folders.length} Directories
          </div>
          <div className="text-xs text-emerald-600 font-medium mt-1">
            Role-Based Access (RBAC) Enforced
          </div>
        </Card>

        <Card className="p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex flex-col justify-between">
          <span className="text-xs font-semibold text-slate-500">Starred Assets</span>
          <div className="text-2xl font-bold font-mono text-amber-600 dark:text-amber-400 mt-1">
            {files.filter(f => f.isStarred).length} Pinned
          </div>
          <div className="text-xs text-slate-400 mt-1">
            Quick access for active sprints
          </div>
        </Card>
      </div>

      {/* Folders Row */}
      <div className="space-y-2.5">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
            Project Directories
          </h3>
          {selectedFolderId !== 'ALL' && (
            <button
              onClick={() => setSelectedFolderId('ALL')}
              className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline"
            >
              View All Folders
            </button>
          )}
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          {folders.map((folder) => {
            const isSelected = selectedFolderId === folder.id;

            return (
              <Card
                key={folder.id}
                hoverable
                onClick={() => setSelectedFolderId(isSelected ? 'ALL' : folder.id)}
                className={`p-4 space-y-2 cursor-pointer transition-all border ${
                  isSelected
                    ? 'border-indigo-600 ring-2 ring-indigo-500/20 bg-indigo-50/20 dark:bg-indigo-950/30'
                    : 'border-slate-200 dark:border-slate-800'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="p-2 rounded-xl" style={{ backgroundColor: `${folder.color}20`, color: folder.color }}>
                    <Folder className="w-5 h-5 fill-current" />
                  </div>
                  <span className="text-[10px] font-mono text-slate-400 font-semibold">{folder.totalSize}</span>
                </div>

                <div className="font-bold text-xs text-slate-900 dark:text-white truncate">
                  {folder.name}
                </div>

                <div className="text-[10px] text-slate-400">
                  {folder.fileCount} files • {folder.lastUpdated}
                </div>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Control Bar: Search, Filters & Actions */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white dark:bg-slate-900 p-3.5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="flex items-center gap-2">
          <div className="relative flex-1 sm:w-64">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search assets, specs, schemas..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
            />
          </div>

          <select
            value={selectedExtension}
            onChange={(e) => setSelectedExtension(e.target.value)}
            className="px-3 py-1.5 rounded-xl text-xs border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-medium text-slate-700 dark:text-slate-300 focus:outline-none"
          >
            <option value="ALL">All File Types</option>
            <option value="pdf">PDF Documents</option>
            <option value="figma">Figma Assets</option>
            <option value="code">Code & Schemas</option>
            <option value="archive">ZIP Archives</option>
          </select>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded-lg ${viewMode === 'grid' ? 'bg-white dark:bg-slate-900 text-indigo-600 shadow-sm' : 'text-slate-400'}`}
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={`p-1.5 rounded-lg ${viewMode === 'table' ? 'bg-white dark:bg-slate-900 text-indigo-600 shadow-sm' : 'text-slate-400'}`}
            >
              <TableIcon className="w-4 h-4" />
            </button>
          </div>

          <Button
            variant="primary"
            size="sm"
            onClick={() => setShowUploadModal(true)}
            leftIcon={<Upload className="w-4 h-4" />}
          >
            Upload File
          </Button>
        </div>
      </div>

      {/* Files Grid Mode */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredFiles.map((file) => (
            <Card
              key={file.id}
              hoverable
              className="p-4 space-y-3 border border-slate-200 dark:border-slate-800 flex flex-col justify-between"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800">
                    {getFileIcon(file.extension)}
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                      {file.version}
                    </span>
                    <button
                      onClick={() => handleToggleStar(file.id)}
                      className={`p-1 rounded hover:bg-slate-100 dark:hover:bg-slate-800 ${file.isStarred ? 'text-amber-500' : 'text-slate-300'}`}
                    >
                      <Star className="w-3.5 h-3.5 fill-current" />
                    </button>
                  </div>
                </div>

                <div className="font-bold text-xs text-slate-900 dark:text-white line-clamp-2 leading-snug">
                  {file.name}
                </div>

                {file.projectName && (
                  <div className="text-[11px] text-indigo-600 dark:text-indigo-400 font-medium truncate">
                    {file.projectName}
                  </div>
                )}
              </div>

              <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-400">
                <span className="font-mono text-[11px]">{file.sizeFormatted}</span>
                <div className="flex items-center gap-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => addToast({ title: 'Download Triggered', description: `Downloading ${file.name}`, type: 'info' })}
                  >
                    <Download className="w-3.5 h-3.5" />
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        /* Table Mode */
        <Card className="overflow-hidden border border-slate-200 dark:border-slate-800">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 text-slate-400 uppercase font-semibold">
                <tr>
                  <th className="p-3.5">Name</th>
                  <th className="p-3.5">Project Tag</th>
                  <th className="p-3.5 font-mono">Version</th>
                  <th className="p-3.5 font-mono">Size</th>
                  <th className="p-3.5">Updated</th>
                  <th className="p-3.5">Owner</th>
                  <th className="p-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {filteredFiles.map((file) => (
                  <tr key={file.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40 transition">
                    <td className="p-3.5">
                      <div className="flex items-center gap-2.5">
                        {getFileIcon(file.extension)}
                        <span className="font-bold text-slate-900 dark:text-white">{file.name}</span>
                      </div>
                    </td>
                    <td className="p-3.5 text-indigo-600 dark:text-indigo-400 font-medium">{file.projectName || '—'}</td>
                    <td className="p-3.5 font-mono text-slate-500">{file.version}</td>
                    <td className="p-3.5 font-mono text-slate-500">{file.sizeFormatted}</td>
                    <td className="p-3.5 font-mono text-slate-500">{file.updatedAt}</td>
                    <td className="p-3.5 text-slate-700 dark:text-slate-300">{file.uploadedBy.name}</td>
                    <td className="p-3.5 text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => addToast({ title: 'Download Triggered', description: `Downloading ${file.name}`, type: 'info' })}
                      >
                        <Download className="w-3.5 h-3.5" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {/* Upload File Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-indigo-600 text-white">
                  <Upload className="w-4 h-4" />
                </div>
                <h3 className="font-bold text-sm text-slate-900 dark:text-white">Upload Digital Asset</h3>
              </div>
              <button
                onClick={() => setShowUploadModal(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-white font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleUploadFile} className="space-y-3.5 text-xs">
              <div className="space-y-1">
                <label className="font-bold text-slate-700 dark:text-slate-300">File Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. NovaPay_API_Gateway_Specification_v2.pdf"
                  value={newFileName}
                  onChange={(e) => setNewFileName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-slate-700 dark:text-slate-300">Target Folder</label>
                  <select
                    value={newFolderId}
                    onChange={(e) => setNewFolderId(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  >
                    {folders.map(f => (
                      <option key={f.id} value={f.id}>{f.name}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-700 dark:text-slate-300">Asset Type</label>
                  <select
                    value={newExtension}
                    onChange={(e) => setNewExtension(e.target.value as FileExtensionType)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  >
                    <option value="pdf">PDF Document</option>
                    <option value="figma">Figma Design</option>
                    <option value="code">JSON / Code Schema</option>
                    <option value="archive">ZIP Archive</option>
                  </select>
                </div>
              </div>

              <div className="p-4 border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-xl text-center space-y-1 text-slate-400">
                <Upload className="w-5 h-5 mx-auto text-indigo-500" />
                <div className="text-[11px] font-medium text-slate-600 dark:text-slate-300">Drag & drop files here, or browse</div>
                <div className="text-[10px]">Supports PDF, FIG, ZIP, MP4, JSON up to 500 MB</div>
              </div>

              <div className="pt-3 flex items-center justify-end gap-2 border-t border-slate-100 dark:border-slate-800">
                <Button variant="ghost" size="sm" type="button" onClick={() => setShowUploadModal(false)}>
                  Cancel
                </Button>
                <Button variant="primary" size="sm" type="submit">
                  Upload & Encrypt
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
