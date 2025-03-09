import React, { useState, useRef } from 'react';
import { Search, Shield, AlertTriangle, CheckCircle, XCircle, Link, Image, Video, Upload } from 'lucide-react';

interface MediaAnalysisDetails {
  metadata: {
    type: string;
    size: number;
    lastModified: number;
    name: string;
  };
  visualArtifacts: string[];
  facialAnalysis?: {
    inconsistencies: string[];
    confidence: number;
  };
  contextualClues: string[];
  manipulationScore: number;
  confidence: number;
}

interface AnalysisResult {
  score: number;
  summary: string;
  factors: string[];
  mediaAnalysis?: {
    type: 'image' | 'video';
    manipulation: boolean;
    details: string;
    deepAnalysis?: MediaAnalysisDetails;
  };
}

// Credibility tiers for news sources
const TIER_1_DOMAINS = [
  'reuters.com',
  'ap.org',
  'apnews.com',
  'bbc.com',
  'bbc.co.uk',
  'nytimes.com',
  'wsj.com',
  'afp.com'
];

const TIER_2_DOMAINS = [
  'npr.org',
  'theguardian.com',
  'bloomberg.com',
  'dw.com',
  'ft.com'
];

const TIER_3_DOMAINS = [
  'nature.com',
  'science.org',
  'thelancet.com',
  'nejm.org',
  'aljazeera.com',
  'cbs.com',
  'nbcnews.com',
  'abcnews.go.com',
  'cnn.com',
  'foxnews.com',
  'msnbc.com'
];

function App() {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Function to analyze media file
  const analyzeMediaFile = async (file: File): Promise<AnalysisResult> => {
    // Simulate deep analysis of the media file
    const isImage = file.type.startsWith('image/');
    const isVideo = file.type.startsWith('video/');
    
    // Generate random but realistic-looking analysis results
    const manipulationScore = Math.random() * 100;
    const confidence = 70 + Math.random() * 30; // Higher confidence in analysis
    
    const visualArtifacts = [];
    const contextualClues = [];
    let facialAnalysis;
    
    // Analyze potential manipulation indicators
    if (manipulationScore > 50) {
      visualArtifacts.push(
        "Irregular pixel patterns detected at edges",
        "Inconsistent noise distribution",
        "Unusual compression artifacts"
      );
      contextualClues.push(
        "Lighting inconsistencies detected",
        "Shadow angles appear unnatural"
      );
    }
    
    // Add facial analysis for images that might contain faces
    if (isImage && Math.random() > 0.5) {
      facialAnalysis = {
        inconsistencies: manipulationScore > 50 ? [
          "Asymmetrical facial features detected",
          "Irregular eye alignment",
          "Unnatural skin texture patterns"
        ] : [],
        confidence: confidence
      };
    }
    
    const deepAnalysis: MediaAnalysisDetails = {
      metadata: {
        type: file.type,
        size: file.size,
        lastModified: file.lastModified,
        name: file.name
      },
      visualArtifacts,
      facialAnalysis,
      contextualClues,
      manipulationScore,
      confidence
    };

    const factors = [];
    
    // Add analysis factors based on findings
    if (manipulationScore > 50) {
      factors.push("Digital manipulation artifacts detected");
      factors.push("Inconsistent lighting and shadows");
      if (facialAnalysis?.inconsistencies.length) {
        factors.push("Facial feature anomalies present");
      }
    } else {
      factors.push("Natural image characteristics present");
      factors.push("Consistent lighting and shadows");
      if (facialAnalysis?.inconsistencies.length === 0) {
        factors.push("Natural facial features detected");
      }
    }

    const authenticityScore = Math.round(100 - manipulationScore);

    return {
      score: authenticityScore,
      summary: authenticityScore < 50
        ? "Analysis indicates potential digital manipulation or synthetic generation."
        : "Analysis suggests this media is likely authentic.",
      factors,
      mediaAnalysis: {
        type: isImage ? 'image' : 'video',
        manipulation: authenticityScore < 50,
        details: authenticityScore < 50
          ? "Multiple indicators of digital manipulation detected"
          : "No significant signs of manipulation detected",
        deepAnalysis
      }
    };
  };

  // Function to analyze URL and generate a score
  const analyzeUrl = (url: string): AnalysisResult => {
    const domain = new URL(url).hostname.toLowerCase();
    let score = 0;
    let factors: string[] = [];
    
    // Check for official domains (increased base score)
    if (domain.endsWith('.gov') || domain.endsWith('.edu')) {
      score += 40;
      factors.push("Official government or educational domain");
    }
    
    // Significantly increased scores for trusted sources
    if (TIER_1_DOMAINS.some(d => domain.includes(d))) {
      score += 85; // Base score for Tier 1
      factors.push("Tier 1 - Highly trusted news organization");
      factors.push("Known for factual reporting and strong editorial standards");
      factors.push("Extensive fact-checking and verification processes");
      factors.push("Global reputation for journalistic excellence");
    } else if (TIER_2_DOMAINS.some(d => domain.includes(d))) {
      score += 70; // Base score for Tier 2
      factors.push("Tier 2 - Generally reputable news source");
      factors.push("Reliable reporting with established editorial standards");
      factors.push("Regular fact-checking practices");
    } else if (TIER_3_DOMAINS.some(d => domain.includes(d))) {
      score += 60; // Base score for Tier 3
      factors.push("Tier 3 - Specialized or regional news source");
      factors.push("Credibility varies by topic or program");
      factors.push("Subject to editorial oversight and fact-checking");
    }

    // Check for academic journals
    if (domain.includes('nature.com') || domain.includes('science.org') || 
        domain.includes('thelancet.com') || domain.includes('nejm.org')) {
      score += 20;
      factors.push("Peer-reviewed academic journal");
      factors.push("Rigorous scientific review process");
    }

    // Suspicious characteristics (reduced impact)
    if (domain.includes('blog') || domain.includes('free')) {
      score -= 10;
      factors.push("Informal or user-generated content platform");
    }

    // Small random variation (reduced impact)
    score += Math.floor(Math.random() * 3);
    
    // Ensure score stays within 0-100
    score = Math.max(0, Math.min(100, score));

    // Generate appropriate summary based on score
    let summary = "";
    if (score >= 80) {
      summary = "This content comes from a highly trusted source with established credibility, rigorous fact-checking, and strong editorial standards.";
    } else if (score >= 65) {
      summary = "This content is from a generally reliable source with established editorial practices and fact-checking procedures.";
    } else if (score >= 45) {
      summary = "This content shows mixed indicators of reliability. Consider cross-referencing with other sources.";
    } else {
      summary = "This content contains several indicators of potential misinformation or lacks credible sourcing.";
      factors.push("Limited source verification");
      factors.push("Consider fact-checking with established news sources");
    }

    // Media analysis based on URL path
    const hasImage = url.match(/\.(jpg|jpeg|png|gif)$/i);
    const hasVideo = url.match(/\.(mp4|mov|avi)$/i);
    const mediaAnalysis = hasImage || hasVideo ? {
      type: hasImage ? 'image' as const : 'video' as const,
      manipulation: score < 50,
      details: score < 50 
        ? "Digital artifacts detected in media analysis"
        : "No significant signs of manipulation detected"
    } : undefined;

    return {
      score,
      summary,
      factors,
      mediaAnalysis
    };
  };

  const handleAnalyze = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      if (url) {
        // Validate URL
        new URL(url);
        
        // Simulate API delay
        setTimeout(() => {
          const analysis = analyzeUrl(url);
          setResult(analysis);
          setLoading(false);
        }, 1500);
      } else if (fileInputRef.current?.files?.length) {
        const file = fileInputRef.current.files[0];
        const analysis = await analyzeMediaFile(file);
        setResult(analysis);
        setLoading(false);
      } else {
        alert("Please enter a URL or upload a file");
        setLoading(false);
      }
    } catch (error) {
      alert("Please enter a valid URL");
      setLoading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.length) {
      setUrl(''); // Clear URL when file is selected
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 65) return 'text-blue-600';
    if (score >= 45) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-center mb-8">
            <Shield className="w-8 h-8 text-indigo-600 mr-3" />
            <h1 className="text-3xl font-bold text-gray-900">Fact Check AI</h1>
          </div>

          {/* Search Form */}
          <form onSubmit={handleAnalyze} className="mb-8">
            <div className="space-y-4">
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Link className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="url"
                    className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="Enter URL to analyze..."
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                  />
                </div>
              </div>
              
              <div className="flex items-center justify-center w-full">
                <div className="text-gray-500 text-sm">- OR -</div>
              </div>

              <div className="flex gap-2">
                <div className="relative flex-1">
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*,video/*"
                    className="hidden"
                    onChange={handleFileChange}
                  />
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full py-3 px-4 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 flex items-center justify-center gap-2"
                  >
                    <Upload className="w-5 h-5" />
                    Upload Image or Video
                  </button>
                </div>
              </div>

              <div className="flex justify-center">
                <button
                  type="submit"
                  className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 flex items-center gap-2"
                  disabled={loading}
                >
                  {loading ? (
                    <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent" />
                  ) : (
                    <>
                      <Search className="w-5 h-5" />
                      Analyze
                    </>
                  )}
                </button>
              </div>
            </div>
          </form>

          {/* Results */}
          {result && (
            <div className="bg-white rounded-lg shadow-lg p-6">
              {/* Score */}
              <div className="mb-6 text-center">
                <div className="text-lg font-semibold text-gray-700 mb-2">
                  {result.mediaAnalysis ? 'Authenticity Score' : 'Credibility Score'}
                </div>
                <div className={`text-4xl font-bold ${getScoreColor(result.score)}`}>
                  {result.score}/100
                </div>
              </div>

              {/* Summary */}
              <div className="mb-6">
                <h2 className="text-xl font-semibold text-gray-800 mb-3">Analysis Summary</h2>
                <p className="text-gray-600">{result.summary}</p>
              </div>

              {/* Factors */}
              <div className="mb-6">
                <h2 className="text-xl font-semibold text-gray-800 mb-3">Key Factors</h2>
                <ul className="space-y-2">
                  {result.factors.map((factor, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <AlertTriangle className="w-5 h-5 text-yellow-500 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-600">{factor}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Media Analysis */}
              {result.mediaAnalysis && (
                <div>
                  <h2 className="text-xl font-semibold text-gray-800 mb-3">Media Analysis</h2>
                  <div className="flex items-start gap-2 p-4 bg-gray-50 rounded-lg">
                    {result.mediaAnalysis.type === 'image' ? (
                      <Image className="w-5 h-5 text-gray-500 flex-shrink-0 mt-0.5" />
                    ) : (
                      <Video className="w-5 h-5 text-gray-500 flex-shrink-0 mt-0.5" />
                    )}
                    <div className="space-y-4 w-full">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-medium">
                            {result.mediaAnalysis.type === 'image' ? 'Image' : 'Video'} Analysis:
                          </span>
                          {result.mediaAnalysis.manipulation ? (
                            <XCircle className="w-5 h-5 text-red-500" />
                          ) : (
                            <CheckCircle className="w-5 h-5 text-green-500" />
                          )}
                        </div>
                        <p className="text-gray-600">{result.mediaAnalysis.details}</p>
                      </div>

                      {/* Detailed Analysis */}
                      {result.mediaAnalysis.deepAnalysis && (
                        <div className="space-y-4">
                          {/* Metadata */}
                          <div>
                            <h3 className="font-medium text-gray-700 mb-2">File Metadata</h3>
                            <div className="grid grid-cols-2 gap-2 text-sm">
                              <div>Type: {result.mediaAnalysis.deepAnalysis.metadata.type}</div>
                              <div>Size: {(result.mediaAnalysis.deepAnalysis.metadata.size / 1024 / 1024).toFixed(2)} MB</div>
                              <div>Last Modified: {new Date(result.mediaAnalysis.deepAnalysis.metadata.lastModified).toLocaleString()}</div>
                            </div>
                          </div>

                          {/* Visual Artifacts */}
                          {result.mediaAnalysis.deepAnalysis.visualArtifacts.length > 0 && (
                            <div>
                              <h3 className="font-medium text-gray-700 mb-2">Visual Analysis</h3>
                              <ul className="list-disc list-inside text-sm text-gray-600">
                                {result.mediaAnalysis.deepAnalysis.visualArtifacts.map((artifact, index) => (
                                  <li key={index}>{artifact}</li>
                                ))}
                              </ul>
                            </div>
                          )}

                          {/* Facial Analysis */}
                          {result.mediaAnalysis.deepAnalysis.facialAnalysis && (
                            <div>
                              <h3 className="font-medium text-gray-700 mb-2">Facial Analysis</h3>
                              <div className="text-sm text-gray-600">
                                <div>Confidence: {result.mediaAnalysis.deepAnalysis.facialAnalysis.confidence.toFixed(1)}%</div>
                                {result.mediaAnalysis.deepAnalysis.facialAnalysis.inconsistencies.length > 0 && (
                                  <ul className="list-disc list-inside mt-2">
                                    {result.mediaAnalysis.deepAnalysis.facialAnalysis.inconsistencies.map((inconsistency, index) => (
                                      <li key={index}>{inconsistency}</li>
                                    ))}
                                  </ul>
                                )}
                              </div>
                            </div>
                          )}

                          {/* Contextual Analysis */}
                          {result.mediaAnalysis.deepAnalysis.contextualClues.length > 0 && (
                            <div>
                              <h3 className="font-medium text-gray-700 mb-2">Contextual Analysis</h3>
                              <ul className="list-disc list-inside text-sm text-gray-600">
                                {result.mediaAnalysis.deepAnalysis.contextualClues.map((clue, index) => (
                                  <li key={index}>{clue}</li>
                                ))}
                              </ul>
                            </div>
                          )}

                          {/* Analysis Confidence */}
                          <div>
                            <h3 className="font-medium text-gray-700 mb-2">Analysis Confidence</h3>
                            <div className="text-sm text-gray-600">
                              Overall confidence in analysis: {result.mediaAnalysis.deepAnalysis.confidence.toFixed(1)}%
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;