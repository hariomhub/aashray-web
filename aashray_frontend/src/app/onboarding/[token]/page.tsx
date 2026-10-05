"use client";

import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import { Shield, CheckCircle, Upload, ArrowRight, Loader2 } from 'lucide-react';

interface OnboardingData {
  companyName: string;
  onboardingStatus: string;
  agreementAccepted: boolean;
  agreementVersion: string | null;
  agreementUrl: string | null;
  documents: {
    GST_CERTIFICATE: string;
    PAN_CARD: string;
    REGISTRATION_CERTIFICATE: string;
  };
}

export default function OnboardingPage({ params }: { params: Promise<{ token: string }> }) {
  // Unwrap params using React.use() since Next 15+ makes params a Promise
  const resolvedParams = use(params);
  const token = resolvedParams.token;
  
  const router = useRouter();
  
  const [data, setData] = useState<OnboardingData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Accept agreement state
  const [accepting, setAccepting] = useState(false);
  
  // Upload docs state
  const [uploading, setUploading] = useState(false);
  const [files, setFiles] = useState<Record<string, File>>({});
  
  // Complete state
  const [completing, setCompleting] = useState(false);

  useEffect(() => {
    fetchOnboardingData();
  }, [token]);

  const fetchOnboardingData = async () => {
    try {
      const res = await fetch(`/api/onboarding/${token}`);
      if (!res.ok) {
        throw new Error('Invalid or expired onboarding link');
      }
      const jsonData = await res.json();
      setData(jsonData);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleAcceptAgreement = async () => {
    setAccepting(true);
    try {
      const res = await fetch(`/api/onboarding/${token}/accept-agreement`, {
        method: 'POST'
      });
      if (!res.ok) throw new Error('Failed to accept agreement');
      await fetchOnboardingData();
    } catch (err: any) {
      alert(err.message);
    } finally {
      setAccepting(false);
    }
  };

  const handleFileChange = (type: string, file: File | null) => {
    if (file) {
      setFiles(prev => ({ ...prev, [type]: file }));
    } else {
      const newFiles = { ...files };
      delete newFiles[type];
      setFiles(newFiles);
    }
  };

  const handleUploadDocuments = async () => {
    if (Object.keys(files).length === 0) return;
    setUploading(true);
    
    const formData = new FormData();
    Object.entries(files).forEach(([type, file]) => {
      formData.append(type, file);
    });

    try {
      const res = await fetch(`/api/onboarding/${token}/documents`, {
        method: 'POST',
        body: formData,
      });
      if (!res.ok) throw new Error('Failed to upload documents');
      setFiles({});
      await fetchOnboardingData();
    } catch (err: any) {
      alert(err.message);
    } finally {
      setUploading(false);
    }
  };

  const handleComplete = async () => {
    setCompleting(true);
    try {
      const res = await fetch(`/api/onboarding/${token}/complete`, {
        method: 'POST'
      });
      if (!res.ok) throw new Error('Failed to complete onboarding');
      await fetchOnboardingData();
    } catch (err: any) {
      alert(err.message);
    } finally {
      setCompleting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
        <Shield className="w-16 h-16 text-red-500 mb-4" />
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h1>
        <p className="text-gray-600">{error || 'Something went wrong.'}</p>
      </div>
    );
  }

  // Calculate missing docs
  const missingDocs = Object.entries(data.documents).filter(([_, status]) => status === 'NOT_SUBMITTED');

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
          <div className="bg-primary px-8 py-10 text-white">
            <h1 className="text-3xl font-bold mb-2">Partner Onboarding</h1>
            <p className="text-primary-foreground/80">Welcome, {data.companyName}!</p>
          </div>
          
          <div className="p-8">
            {data.onboardingStatus === 'DOCUMENT_VERIFICATION' || data.onboardingStatus === 'COMPLETED' ? (
              <div className="text-center py-12">
                <CheckCircle className="w-20 h-20 text-green-500 mx-auto mb-6" />
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Onboarding Complete</h2>
                <p className="text-gray-600 max-w-md mx-auto">
                  Your documents are currently under verification. We will contact you once your partner account is fully activated.
                </p>
              </div>
            ) : (
              <div className="space-y-10">
                {/* Step 1: Agreement */}
                <div className={`relative ${data.agreementAccepted ? 'opacity-50 pointer-events-none' : ''}`}>
                  <div className="flex items-center mb-4">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm mr-3 ${data.agreementAccepted ? 'bg-green-100 text-green-700' : 'bg-primary text-white'}`}>
                      {data.agreementAccepted ? <CheckCircle className="w-5 h-5" /> : '1'}
                    </div>
                    <h2 className="text-xl font-semibold text-gray-900">Partner Agreement</h2>
                  </div>
                  
                  <div className="ml-11 bg-gray-50 p-6 rounded-xl border border-gray-100">
                    <p className="text-gray-600 mb-6">
                      Please review and accept the NiyamSaathi Partner Agreement (v{data.agreementVersion || '1.0'}).
                    </p>
                    <div className="flex items-center gap-4">
                      {data.agreementUrl && (
                        <a href={data.agreementUrl} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline font-medium">
                          View Agreement PDF
                        </a>
                      )}
                      {!data.agreementAccepted && (
                        <button 
                          onClick={handleAcceptAgreement}
                          disabled={accepting}
                          className="bg-primary text-white px-6 py-2.5 rounded-lg font-medium hover:bg-primary/90 flex items-center transition-colors disabled:opacity-70"
                        >
                          {accepting ? <Loader2 className="w-5 h-5 animate-spin mr-2" /> : <CheckCircle className="w-5 h-5 mr-2" />}
                          I Accept the Agreement
                        </button>
                      )}
                    </div>
                  </div>
                </div>

                {/* Step 2: Documents */}
                <div className={`relative ${!data.agreementAccepted ? 'opacity-50 pointer-events-none' : ''}`}>
                   <div className="flex items-center mb-4">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm mr-3 ${!data.agreementAccepted ? 'bg-gray-200 text-gray-500' : 'bg-primary text-white'}`}>
                      2
                    </div>
                    <h2 className="text-xl font-semibold text-gray-900">Required Documents</h2>
                  </div>
                  
                  <div className="ml-11">
                    {missingDocs.length > 0 ? (
                       <div className="bg-white border border-gray-200 rounded-xl p-6">
                         <p className="text-gray-600 mb-6">Please upload the remaining documents required to activate your account.</p>
                         <div className="space-y-4 mb-6">
                           {missingDocs.map(([type]) => (
                             <div key={type} className="border border-dashed border-gray-300 rounded-lg p-4 flex items-center justify-between">
                               <div>
                                 <p className="font-medium text-gray-900">{type.replace(/_/g, ' ')}</p>
                                 <p className="text-sm text-gray-500">PDF, JPG, or PNG (Max 5MB)</p>
                               </div>
                               <div>
                                 <label className="cursor-pointer bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-50 inline-block">
                                    {files[type] ? files[type].name : 'Choose File'}
                                    <input 
                                      type="file" 
                                      className="hidden" 
                                      accept=".pdf,.jpg,.jpeg,.png"
                                      onChange={(e) => handleFileChange(type, e.target.files?.[0] || null)}
                                    />
                                 </label>
                               </div>
                             </div>
                           ))}
                         </div>
                         <button
                           onClick={handleUploadDocuments}
                           disabled={uploading || Object.keys(files).length === 0}
                           className="w-full bg-primary text-white px-4 py-3 rounded-lg font-medium hover:bg-primary/90 flex items-center justify-center disabled:opacity-50 transition-colors"
                         >
                           {uploading ? <Loader2 className="w-5 h-5 animate-spin mr-2" /> : <Upload className="w-5 h-5 mr-2" />}
                           Upload {Object.keys(files).length} Document{Object.keys(files).length !== 1 ? 's' : ''}
                         </button>
                       </div>
                    ) : (
                      <div className="bg-green-50 border border-green-100 rounded-xl p-6 flex items-center">
                        <CheckCircle className="w-6 h-6 text-green-500 mr-3" />
                        <p className="text-green-700 font-medium">All required documents have been submitted.</p>
                      </div>
                    )}
                  </div>
                </div>
                
                {/* Complete Button */}
                <div className="ml-11 pt-6 border-t border-gray-100">
                  <button
                     onClick={handleComplete}
                     disabled={!data.agreementAccepted || missingDocs.length > 0 || completing}
                     className="w-full bg-gray-900 text-white px-4 py-4 rounded-xl font-bold text-lg hover:bg-gray-800 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                   >
                     {completing ? <Loader2 className="w-6 h-6 animate-spin mr-2" /> : null}
                     Complete Onboarding
                     {!completing && <ArrowRight className="w-5 h-5 ml-2" />}
                   </button>
                </div>

              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
