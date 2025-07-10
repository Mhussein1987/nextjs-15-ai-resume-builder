'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { printResumeToPdf } from '@/lib/printToPdfService';
import { ResumeData } from '@/lib/types';
import { ensureResumeContent } from '@/lib/utils';
import { ResumeValues } from '@/lib/validation';
import { Loader2, Download } from 'lucide-react';

export default function DebugPDFPage() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

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
    colorHex: '#166534',
    sidebarColorHex: '#3b4d3b', // Test sidebar color
    workExperienceHeaderColorHex: '#1d4ed8',
    sectionLabelColorHex: '#1f2937',
    borderStyle: 'squircle',
    templatePreference: 'default',
    templateCode: 'EN3', // Template3En
    language: 'en',
    workExperiences: [
      {
        position: 'Software Engineer',
        company: 'Tech Corp',
        startDate: '2022-01-01',
        endDate: '2023-12-31',
        description: 'Developed web applications using React and Node.js.\n' +
          'Collaborated with team members to meet tight deadlines.\n' +
          'Maintained code quality and implemented best practices.'
      }
    ],
    educations: [
      {
        degree: 'Bachelor of Computer Science',
        institution: 'University of Technology',
        startDate: '2018-09-01',
        endDate: '2022-05-31'
      }
    ],
    skills: ['JavaScript', 'TypeScript', 'React', 'Next.js'],
    userLanguages: ['English (Native)', 'Arabic (Advanced)'],
    summary: 'Experienced software developer with expertise in modern web technologies and a passion for creating efficient, scalable solutions.'
  };

  const testResumeValues: ResumeValues = {
    id: 'test-2',
    title: 'Test Resume Values',
    description: 'A test resume using ResumeValues format',
    firstName: 'John',
    lastName: 'Doe',
    jobTitle: 'Software Developer',
    city: 'New York',
    country: 'United States',
    phone: '+1 (555) 123-4567',
    email: 'john.doe@example.com',
    colorHex: '#3b82f6',
    sidebarColorHex: '#0E7490',
    borderStyle: 'squircle',
    templateCode: 'EN1',
    language: 'en',
    workExperiences: [
      {
        position: 'Software Developer',
        company: 'Tech Corp',
        startDate: '2022-01-01',
        endDate: '2023-12-31',
        description: 'Developed web applications using React and Node.js'
      }
    ],
    educations: [
      {
        degree: 'Bachelor of Computer Science',
        school: 'University of Technology',
        startDate: '2018-09-01',
        endDate: '2022-05-31'
      }
    ],
    skills: ['React', 'Node.js', 'TypeScript', 'Python'],
    userLanguages: ['English (Native)', 'Arabic (Advanced)'],
    summary: 'Experienced software developer with expertise in modern web technologies.'
  };

  const handleGeneratePDF = async () => {
    setIsGenerating(true);
    setError(null);
    
    try {
      console.log('Starting PDF generation with react-to-print...');
      console.log('Resume data:', testResumeData);
      
      await printResumeToPdf(testResumeData);
      
      console.log('PDF generation completed successfully!');
    } catch (error) {
      console.error('PDF generation error:', error);
      setError(error instanceof Error ? error.message : 'Unknown error occurred');
    } finally {
      setIsGenerating(false);
    }
  };

  const handlePrintTest = () => {
    try {
      console.log('Testing print functionality...');
      console.log('Resume values:', testResumeValues);
      
      const enrichedData = ensureResumeContent(testResumeValues);
      console.log('Enriched resume data:', enrichedData);
      
      // Trigger print
      window.print();
      
      console.log('Print test completed!');
    } catch (error) {
      console.error('Print test error:', error);
      setError(error instanceof Error ? error.message : 'Unknown error occurred');
    }
  };

  const handleEmptyPrintTest = () => {
    try {
      console.log('Testing print with empty resume data...');
      
      const emptyResume: ResumeValues = {
        id: 'empty-test',
        templateCode: 'EN1',
        language: 'en'
      };
      
      const enrichedData = ensureResumeContent(emptyResume);
      console.log('Enriched empty resume data:', enrichedData);
      
      // Trigger print
      window.print();
      
      console.log('Empty print test completed!');
    } catch (error) {
      console.error('Empty print test error:', error);
      setError(error instanceof Error ? error.message : 'Unknown error occurred');
    }
  };

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-3xl font-bold mb-8">PDF Debug Test</h1>
      
      <div className="space-y-4">
        <Button 
          onClick={handleGeneratePDF} 
          disabled={isGenerating}
          className="w-full bg-blue-600 hover:bg-blue-700"
        >
          {isGenerating ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Generating PDF...
            </>
          ) : (
            <>
              <Download className="mr-2 h-4 w-4" />
              Generate PDF (React-to-Print)
            </>
          )}
        </Button>





        <Button 
          onClick={() => {
            console.log('Testing sidebar color:', testResumeData.sidebarColorHex);
            // Set CSS custom property for testing
            document.documentElement.style.setProperty('--sidebar-color', testResumeData.sidebarColorHex || '#3b4d3b');
            window.print();
          }}
          className="w-full bg-green-600 hover:bg-green-700"
        >
          Test Print with Sidebar Color
        </Button>

        <Button 
          onClick={() => {
            console.log('Testing white text in sidebar');
            // Force white text on all sidebar elements
            const sidebarElements = document.querySelectorAll('.sidebar, .sidebar *');
            console.log('Sidebar elements found:', sidebarElements.length);
            
            sidebarElements.forEach((element) => {
              if (element instanceof HTMLElement) {
                element.style.color = 'white';
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                (element.style as any).webkitPrintColorAdjust = 'exact';
                element.style.printColorAdjust = 'exact';
              }
            });
            
            // Set CSS custom property
            document.documentElement.style.setProperty('--sidebar-color', testResumeData.sidebarColorHex || '#3b4d3b');
            
            setTimeout(() => {
              window.print();
            }, 100);
          }}
          className="w-full bg-blue-600 hover:bg-blue-700"
        >
          Test Print with White Text
        </Button>

        <Button 
          onClick={() => {
            console.log('Testing white text in header');
            // Force white text on all header elements
            const headerElements = document.querySelectorAll('.w-full.py-8, .w-full.py-8 *');
            console.log('Header elements found:', headerElements.length);
            
            headerElements.forEach((element) => {
              if (element instanceof HTMLElement) {
                element.style.color = 'white';
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                (element.style as any).webkitPrintColorAdjust = 'exact';
                element.style.printColorAdjust = 'exact';
              }
            });
            
            // Set CSS custom property
            document.documentElement.style.setProperty('--sidebar-color', testResumeData.sidebarColorHex || '#3b4d3b');
            
            setTimeout(() => {
              window.print();
            }, 100);
          }}
          className="w-full bg-purple-600 hover:bg-purple-700"
        >
          Test Print with White Header Text
        </Button>

          <Button 
          onClick={handlePrintTest}
            disabled={isGenerating}
          className="bg-purple-600 hover:bg-purple-700"
          >
          Test Print Functionality
          </Button>

          <Button 
          onClick={handleEmptyPrintTest}
            disabled={isGenerating}
          className="bg-orange-600 hover:bg-orange-700"
        >
          Test Empty Print
        </Button>

        <Button 
          onClick={() => {
            console.log('Testing Template4En print with equal padding...');
            
            // Create a test resume with Template4En for print testing
            const template4PrintTestResume: ResumeValues = {
              ...testResumeValues,
              templateCode: 'EN4',
              firstName: 'Template4',
              lastName: 'PrintTest',
              jobTitle: 'Template4 Print Equal Padding Test',
              workExperiences: [
                {
                  position: 'Left Side Print Test',
                  company: 'Left Company',
                  description: 'This should have equal 16px padding on all sides when printed.'
                },
                {
                  position: 'Right Side Print Test',
                  company: 'Right Company',
                  description: 'This should also have equal 16px padding on all sides when printed.'
                }
              ]
            };
            
            const enrichedData = ensureResumeContent(template4PrintTestResume);
            console.log('Template4En print test resume data:', enrichedData);
            
            // Trigger print
            window.print();
          }}
          className="w-full bg-cyan-600 hover:bg-cyan-700"
        >
          Test Template4En Print Equal Padding
        </Button>








        </div>

        {error && (
          <div className="p-4 bg-red-100 border border-red-300 rounded-lg">
            <h3 className="font-semibold text-red-800">Error:</h3>
            <p className="text-red-700">{error}</p>
          </div>
        )}

      <div className="mt-8 p-4 bg-yellow-100 border border-yellow-300 rounded-lg">
        <h3 className="font-semibold text-yellow-800">Instructions:</h3>
        <ul className="mt-2 text-yellow-700 text-sm space-y-1">
          <li>• Click any button to test PDF generation or printing</li>
            <li>• Check the browser console for detailed logs</li>
          <li>• The &quot;Test Print Functionality&quot; button tests the browser print dialog</li>
          <li>• The &quot;Test Empty Print&quot; button tests with minimal resume data</li>
          <li>• Make sure to select &quot;Save as PDF&quot; in the print dialog</li>
          </ul>
        </div>

      <div className="mt-8 p-4 bg-blue-100 border border-blue-300 rounded-lg">
        <h3 className="font-semibold text-blue-800">Debug Information:</h3>
        <div className="mt-2 text-blue-700 text-sm space-y-2">
          <div>
            <strong>Test Resume Data:</strong>
            <pre className="mt-1 bg-white p-2 rounded text-xs overflow-auto">
            {JSON.stringify(testResumeData, null, 2)}
          </pre>
          </div>
          <div>
            <strong>Test Resume Values:</strong>
            <pre className="mt-1 bg-white p-2 rounded text-xs overflow-auto">
              {JSON.stringify(testResumeValues, null, 2)}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
} 