"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase/client";
import { X, Upload, Link as LinkIcon, FileText } from "lucide-react";

interface ManualImportProps {
  onClose: () => void;
  onSuccess: () => void;
  libraryType: "leisure" | "research";
}

export default function ManualImport({ onClose, onSuccess, libraryType }: ManualImportProps) {
  const [importType, setImportType] = useState<"url" | "file">("url");
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [url, setUrl] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      const fileType = selectedFile.name.toLowerCase();
      if (fileType.endsWith(".pdf") || fileType.endsWith(".epub")) {
        setFile(selectedFile);
        setError(null);
        // Auto-fill title from filename if empty
        if (!title) {
          const nameWithoutExt = selectedFile.name.replace(/\.(pdf|epub)$/i, "");
          setTitle(nameWithoutExt);
        }
      } else {
        setError("Please select a PDF or EPUB file");
        setFile(null);
      }
    }
  };

  const handleSubmit = async () => {
    if (!title.trim()) {
      setError("Title is required");
      return;
    }

    if (importType === "url" && !url.trim()) {
      setError("URL is required");
      return;
    }

    if (importType === "file" && !file) {
      setError("Please select a file to upload");
      return;
    }

    setUploading(true);
    setError(null);

    try {
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) {
        setError("You must be logged in");
        return;
      }
      const userId = userData.user.id;

      let pdfUrl = url;
      let fileType = "url";

      // If uploading a file, upload to Supabase Storage
      if (importType === "file" && file) {
        const fileExt = file.name.split(".").pop();
        const fileName = `${userId}/${Date.now()}.${fileExt}`;
        
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from("user-books")
          .upload(fileName, file);

        if (uploadError) {
          setError("Failed to upload file: " + uploadError.message);
          setUploading(false);
          return;
        }

        // Get public URL
        const { data: { publicUrl } } = supabase.storage
          .from("user-books")
          .getPublicUrl(fileName);

        pdfUrl = publicUrl;
        fileType = fileExt || "pdf";
      }

      // Create book entry
      const { data: bookData, error: bookError } = await supabase
        .from("books")
        .insert({
          id: `manual-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          title: title.trim(),
          author: author.trim() || null,
          source: "manual",
          pdf_url: pdfUrl,
          formats: importType === "file" ? { [fileType]: pdfUrl } : { url: pdfUrl },
        })
        .select()
        .single();

      if (bookError) {
        setError("Failed to create book: " + bookError.message);
        setUploading(false);
        return;
      }

      // Add to user library
      const { error: libraryError } = await supabase
        .from("user_library")
        .insert({
          user_id: userId,
          book_id: bookData.id,
          library_type: libraryType,
        });

      if (libraryError) {
        setError("Failed to add to library: " + libraryError.message);
        setUploading(false);
        return;
      }

      // Success!
      onSuccess();
      onClose();
    } catch (err) {
      console.error("Import error:", err);
      setError("An unexpected error occurred");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md">
        {/* Header */}
        <div className="bg-orange-500 text-white px-6 py-4 rounded-t-xl flex items-center justify-between">
          <h2 className="text-xl font-bold">Import Book Manually</h2>
          <button
            onClick={onClose}
            className="hover:bg-orange-600 rounded-full p-1 transition"
          >
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          {/* Import Type Selector */}
          <div className="flex gap-2">
            <button
              onClick={() => setImportType("url")}
              className={`flex-1 px-4 py-2 rounded-lg font-medium transition flex items-center justify-center gap-2 ${
                importType === "url"
                  ? "bg-orange-500 text-white"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
            >
              <LinkIcon size={18} />
              URL
            </button>
            <button
              onClick={() => setImportType("file")}
              className={`flex-1 px-4 py-2 rounded-lg font-medium transition flex items-center justify-center gap-2 ${
                importType === "file"
                  ? "bg-orange-500 text-white"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
            >
              <Upload size={18} />
              Upload File
            </button>
          </div>

          {/* Title Input */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter book title"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>

          {/* Author Input */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Author (Optional)
            </label>
            <input
              type="text"
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
              placeholder="Enter author name"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>

          {/* URL or File Input */}
          {importType === "url" ? (
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Book URL <span className="text-red-500">*</span>
              </label>
              <input
                type="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://example.com/book.pdf"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
              <p className="text-xs text-gray-500 mt-1">
                Enter a direct link to a PDF or EPUB file
              </p>
            </div>
          ) : (
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Upload File <span className="text-red-500">*</span>
              </label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-orange-500 transition">
                <input
                  type="file"
                  accept=".pdf,.epub"
                  onChange={handleFileChange}
                  className="hidden"
                  id="file-upload"
                />
                <label
                  htmlFor="file-upload"
                  className="cursor-pointer flex flex-col items-center gap-2"
                >
                  {file ? (
                    <>
                      <FileText size={32} className="text-orange-500" />
                      <p className="text-sm font-medium text-gray-700">
                        {file.name}
                      </p>
                      <p className="text-xs text-gray-500">
                        Click to change file
                      </p>
                    </>
                  ) : (
                    <>
                      <Upload size={32} className="text-gray-400" />
                      <p className="text-sm font-medium text-gray-700">
                        Click to upload
                      </p>
                      <p className="text-xs text-gray-500">
                        PDF or EPUB only
                      </p>
                    </>
                  )}
                </label>
              </div>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-3 pt-2">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition font-medium"
              disabled={uploading}
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={uploading}
              className="flex-1 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {uploading ? "Importing..." : "Import Book"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}