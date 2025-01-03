import React, { useState } from "react";
import axios from "axios";

function ScreenshotCapture() {
  const [url, setUrl] = useState("");
  const [screenshots, setScreenshots] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setScreenshots([]);

    try {
      const response = await axios.post("http://localhost:5000/screenshot", {
        url: url.trim(),
      });
      setScreenshots(response.data.screenshots);
    } catch (error) {
      setError(error.response?.data?.error || "Failed to capture screenshots");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Website Screenshot Tool</h1>

      <form onSubmit={handleSubmit} className="mb-6">
        <div className="flex gap-2">
          <input
            type="url"
            required
            placeholder="Enter website URL"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            className="flex-1 p-2 border rounded"
          />
          <button
            type="submit"
            disabled={loading}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-gray-400"
          >
            {loading ? "Capturing..." : "Capture Screenshots"}
          </button>
        </div>
      </form>

      {error && <div className="text-red-500 mb-4">{error}</div>}

      {screenshots.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">
            Screenshots ({screenshots.length})
          </h2>
          {screenshots.map((screenshot, index) => (
            <div key={index} className="border rounded p-4">
              <h3 className="mb-2">Page {index + 1}</h3>
              <img
                src={`http://localhost:5000/screenshots/${screenshot}`}
                alt={`Page ${index + 1}`}
                className="w-full border"
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default ScreenshotCapture;
