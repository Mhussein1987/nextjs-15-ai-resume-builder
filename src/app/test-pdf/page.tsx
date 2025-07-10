'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { printResumeToPdf } from '@/lib/printToPdfService';
import { ResumeData } from '@/lib/types';

export default function TestPDFPage() {
  const [isGenerating, setIsGenerating] = useState(false);

  const testResumeData: ResumeData = {
    id: 'test-1',
    title: 'Test Resume',
    description: 'A test resume for PDF generation',
    firstName: 'Mustafa',
    lastName: 'Hussein',
    jobTitle: 'Software Engineer',
    city: 'Leander',
    country: 'United States',
    phone: '6822274550',
    email: 'mustafa.hussein87@gmail.com',
    colorHex: '#1d4ed8',
    sidebarColorHex: '#3f51b5',
    borderStyle: 'squircle',
    templatePreference: 'default',
    templateCode: 'EN1',
    language: 'en',
    workExperiences: [
      {
        position: 'Automotive Mechanic',
        company: 'Auto Repair Shop',
        description: 'Repaired diverse vehicle issues efficiently, ensuring optimal performance and client satisfaction. Diagnosed complex car problems accurately, utilizing advanced troubleshooting skills to provide effective solutions.',
      },
      {
        position: 'Software Developer',
        company: 'Tech Company',
        description: 'Developed web applications using modern technologies. Collaborated with team members to deliver high-quality software solutions.',
      }
    ],
    educations: [
      {
        degree: 'Bachelor of Science',
        institution: 'University of Technology',
        endDate: '2020-05-31',
      }
    ],
    skills: ['JavaScript', 'React', 'Node.js', 'TypeScript', 'Python'],
    userLanguages: [
      'English (Native)',
      'Arabic (Fluent)',
    ],
  };

  const testArabicResumeData: ResumeData = {
    ...testResumeData,
    language: 'ar',
    templateCode: 'AR1',
    firstName: 'مصطفى',
    lastName: 'حسين',
    jobTitle: 'مهندس برمجيات',
    city: 'لياندر',
    country: 'الولايات المتحدة',
  };

  const handleDownloadEnglish = async () => {
    setIsGenerating(true);
    try {
      await printResumeToPdf(testResumeData);
    } catch (error) {
      console.error('Error:', error);
      alert('Error generating PDF');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDownloadArabic = async () => {
    setIsGenerating(true);
    try {
      await printResumeToPdf(testArabicResumeData);
    } catch (error) {
      console.error('Error:', error);
      alert('Error generating PDF');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDownloadTemplate2 = async () => {
    setIsGenerating(true);
    try {
      const template2Data = {
        ...testResumeData,
        templateCode: 'EN2',
      };
      await printResumeToPdf(template2Data);
    } catch (error) {
      console.error('Error:', error);
      alert('Error generating PDF');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-3xl font-bold mb-8">PDF Generation Test</h1>
      
      <div className="space-y-4">
        <div className="p-4 border rounded-lg">
          <h2 className="text-xl font-semibold mb-2">Test Resume Data</h2>
          <pre className="text-sm bg-gray-100 p-4 rounded overflow-auto">
            {JSON.stringify(testResumeData, null, 2)}
          </pre>
        </div>

        <div className="flex gap-4">
          <Button 
            onClick={handleDownloadEnglish}
            disabled={isGenerating}
            className="bg-blue-600 hover:bg-blue-700"
          >
            {isGenerating ? 'Generating...' : 'Download English PDF (Template 1)'}
          </Button>

          <Button 
            onClick={handleDownloadArabic}
            disabled={isGenerating}
            className="bg-green-600 hover:bg-green-700"
          >
            {isGenerating ? 'Generating...' : 'Download Arabic PDF (Template 1)'}
          </Button>

          <Button 
            onClick={handleDownloadTemplate2}
            disabled={isGenerating}
            className="bg-purple-600 hover:bg-purple-700"
          >
            {isGenerating ? 'Generating...' : 'Download Template 2 PDF'}
          </Button>
        </div>

        <div className="mt-8 p-4 bg-yellow-100 border border-yellow-300 rounded-lg">
          <h3 className="font-semibold text-yellow-800">Instructions:</h3>
          <ul className="mt-2 text-yellow-700 text-sm space-y-1">
            <li>• Click any button to test PDF generation</li>
            <li>• The PDF will be downloaded automatically</li>
            <li>• Check the browser console for any errors</li>
            <li>• Arabic text should display correctly with proper RTL support</li>
            <li>• Template 2 has a sidebar layout</li>
          </ul>
        </div>
      </div>
    </div>
  );
} 