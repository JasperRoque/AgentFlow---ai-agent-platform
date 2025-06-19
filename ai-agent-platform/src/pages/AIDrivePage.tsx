import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { useAppStore } from '../stores/useAppStore';
import { generateFileId, formatFileSize } from '../utils/taskSimulation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Input } from '../components/ui/input';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '../components/ui/dialog';
import { toast } from 'sonner';
import {
  Upload,
  Search,
  Filter,
  File,
  FileText,
  Image,
  Video,
  Archive,
  Download,
  Trash2,
  Eye,
  FolderOpen,
  Cloud,
  HardDrive,
  Plus,
  Calendar,
  Tag
} from 'lucide-react';
import { FileItem } from '../types';

export function AIDrivePage() {
  const { files, addFile, deleteFile, user } = useAppStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTag, setSelectedTag] = useState('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const allTags = Array.from(new Set(files.flatMap(file => file.tags)));

  const filteredFiles = files.filter(file => {
    const matchesSearch = file.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         file.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesTag = selectedTag === 'all' || file.tags.includes(selectedTag);
    return matchesSearch && matchesTag;
  });

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (!user) return;

    acceptedFiles.forEach(file => {
      const newFile: FileItem = {
        id: generateFileId(),
        userId: user.id,
        name: file.name,
        type: file.type,
        size: file.size,
        url: URL.createObjectURL(file),
        createdAt: new Date().toISOString(),
        tags: getFileTypeTags(file.type)
      };

      addFile(newFile);
      toast.success(`${file.name} uploaded successfully!`);
    });
  }, [addFile, user]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg', '.gif', '.webp'],
      'text/*': ['.txt', '.md', '.csv'],
      'application/pdf': ['.pdf'],
      'application/msword': ['.doc'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
      'application/vnd.ms-excel': ['.xls'],
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
      'video/*': ['.mp4', '.avi', '.mov'],
      'audio/*': ['.mp3', '.wav'],
      'application/zip': ['.zip'],
      'application/x-rar-compressed': ['.rar']
    }
  });

  const getFileIcon = (type: string) => {
    if (type.startsWith('image/')) return <Image className="h-8 w-8 text-blue-500" />;
    if (type.startsWith('video/')) return <Video className="h-8 w-8 text-purple-500" />;
    if (type.includes('pdf')) return <FileText className="h-8 w-8 text-red-500" />;
    if (type.includes('zip') || type.includes('rar')) return <Archive className="h-8 w-8 text-yellow-500" />;
    return <File className="h-8 w-8 text-gray-500" />;
  };

  const getFileTypeTags = (type: string): string[] => {
    const tags = [];
    if (type.startsWith('image/')) tags.push('image');
    if (type.startsWith('video/')) tags.push('video');
    if (type.startsWith('audio/')) tags.push('audio');
    if (type.includes('pdf')) tags.push('document');
    if (type.includes('word') || type.includes('doc')) tags.push('document');
    if (type.includes('excel') || type.includes('sheet')) tags.push('spreadsheet');
    if (type.includes('zip') || type.includes('rar')) tags.push('archive');
    return tags;
  };

  const totalSize = files.reduce((acc, file) => acc + file.size, 0);
  const storageUsed = formatFileSize(totalSize);
  const storageLimit = '1 GB'; // Mock storage limit

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">AI Drive</h1>
          <p className="text-gray-600">Manage your files and AI-generated content</p>
        </div>
        
        <div className="flex items-center space-x-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search files..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 w-64"
            />
          </div>
          
          <select
            value={selectedTag}
            onChange={(e) => setSelectedTag(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md text-sm"
          >
            <option value="all">All Files</option>
            {allTags.map(tag => (
              <option key={tag} value={tag}>
                {tag.charAt(0).toUpperCase() + tag.slice(1)}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Storage Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <Cloud className="h-5 w-5 text-blue-500" />
              <div>
                <p className="text-2xl font-bold">{files.length}</p>
                <p className="text-sm text-gray-600">Total Files</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <HardDrive className="h-5 w-5 text-green-500" />
              <div>
                <p className="text-2xl font-bold">{storageUsed}</p>
                <p className="text-sm text-gray-600">Storage Used</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <FolderOpen className="h-5 w-5 text-purple-500" />
              <div>
                <p className="text-2xl font-bold">{allTags.length}</p>
                <p className="text-sm text-gray-600">Categories</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <Upload className="h-5 w-5 text-orange-500" />
              <div>
                <p className="text-2xl font-bold">{storageLimit}</p>
                <p className="text-sm text-gray-600">Storage Limit</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Upload Area */}
      <Card>
        <CardContent className="p-6">
          <div
            {...getRootProps()}
            className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
              isDragActive
                ? 'border-blue-400 bg-blue-50'
                : 'border-gray-300 hover:border-gray-400'
            }`}
          >
            <input {...getInputProps()} />
            <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            {isDragActive ? (
              <p className="text-blue-600 font-medium">Drop the files here...</p>
            ) : (
              <div className="space-y-2">
                <p className="text-gray-600 font-medium">
                  Drag & drop files here, or click to select
                </p>
                <p className="text-sm text-gray-500">
                  Supports images, documents, videos, and archives up to 50MB each
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Files Grid/List */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Your Files</CardTitle>
            <CardDescription>
              {filteredFiles.length} of {files.length} files
            </CardDescription>
          </div>
          
          <div className="flex items-center space-x-2">
            <Button
              variant={viewMode === 'grid' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewMode('grid')}
            >
              Grid
            </Button>
            <Button
              variant={viewMode === 'list' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewMode('list')}
            >
              List
            </Button>
          </div>
        </CardHeader>
        
        <CardContent>
          {filteredFiles.length > 0 ? (
            viewMode === 'grid' ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {filteredFiles.map(file => (
                  <FileCard key={file.id} file={file} onDelete={() => deleteFile(file.id)} />
                ))}
              </div>
            ) : (
              <div className="space-y-2">
                {filteredFiles.map(file => (
                  <FileListItem key={file.id} file={file} onDelete={() => deleteFile(file.id)} />
                ))}
              </div>
            )
          ) : (
            <div className="text-center py-12">
              <FolderOpen className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">
                {searchQuery || selectedTag !== 'all' 
                  ? 'No files found matching your criteria'
                  : 'No files uploaded yet'
                }
              </p>
              {!searchQuery && selectedTag === 'all' && (
                <p className="text-sm text-gray-400 mt-2">
                  Upload your first file or let AI agents generate content for you
                </p>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function FileCard({ file, onDelete }: { file: FileItem; onDelete: () => void }) {
  return (
    <Card className="group hover:shadow-md transition-all duration-200">
      <CardContent className="p-4">
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            {getFileIcon(file.type)}
            <Button
              variant="ghost"
              size="sm"
              onClick={onDelete}
              className="opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <Trash2 className="h-4 w-4 text-red-500" />
            </Button>
          </div>
          
          <div>
            <h3 className="font-medium text-sm truncate" title={file.name}>
              {file.name}
            </h3>
            <p className="text-xs text-gray-500">{formatFileSize(file.size)}</p>
          </div>
          
          <div className="flex flex-wrap gap-1">
            {file.tags.slice(0, 2).map(tag => (
              <Badge key={tag} variant="outline" className="text-xs">
                {tag}
              </Badge>
            ))}
            {file.tags.length > 2 && (
              <Badge variant="outline" className="text-xs">
                +{file.tags.length - 2}
              </Badge>
            )}
          </div>
          
          <div className="flex items-center justify-between pt-2">
            <span className="text-xs text-gray-500">
              {new Date(file.createdAt).toLocaleDateString()}
            </span>
            <div className="flex space-x-1">
              <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                <Eye className="h-3 w-3" />
              </Button>
              <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                <Download className="h-3 w-3" />
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function FileListItem({ file, onDelete }: { file: FileItem; onDelete: () => void }) {
  return (
    <div className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 transition-colors">
      <div className="flex items-center space-x-3">
        {getFileIcon(file.type)}
        <div>
          <p className="font-medium text-sm">{file.name}</p>
          <div className="flex items-center space-x-4 text-xs text-gray-500">
            <span>{formatFileSize(file.size)}</span>
            <span>{new Date(file.createdAt).toLocaleDateString()}</span>
            <div className="flex space-x-1">
              {file.tags.map(tag => (
                <Badge key={tag} variant="outline" className="text-xs">
                  {tag}
                </Badge>
              ))}
            </div>
          </div>
        </div>
      </div>
      
      <div className="flex items-center space-x-2">
        <Button variant="ghost" size="sm">
          <Eye className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="sm">
          <Download className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="sm" onClick={onDelete}>
          <Trash2 className="h-4 w-4 text-red-500" />
        </Button>
      </div>
    </div>
  );
}

function getFileIcon(type: string) {
  if (type.startsWith('image/')) return <Image className="h-6 w-6 text-blue-500" />;
  if (type.startsWith('video/')) return <Video className="h-6 w-6 text-purple-500" />;
  if (type.includes('pdf')) return <FileText className="h-6 w-6 text-red-500" />;
  if (type.includes('zip') || type.includes('rar')) return <Archive className="h-6 w-6 text-yellow-500" />;
  return <File className="h-6 w-6 text-gray-500" />;
}
