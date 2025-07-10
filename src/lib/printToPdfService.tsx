/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useRef } from 'react';
import { useReactToPrint } from 'react-to-print';
import { ResumeData } from './types';
import { ResumeValues } from '@/lib/validation';

// Convert ResumeData to ResumeValues format for templates
const convertToResumeValues = (resumeData: ResumeData) => {
  return {
    id: resumeData.id || 'temp-id',
    title: resumeData.title || '',
    description: resumeData.description || '',
    firstName: resumeData.firstName || '',
    lastName: resumeData.lastName || '',
    jobTitle: resumeData.jobTitle || '',
    city: resumeData.city || '',
    country: resumeData.country || '',
    phone: resumeData.phone || '',
    email: resumeData.email || '',
    colorHex: resumeData.colorHex || '#000000',
    sidebarColorHex: resumeData.sidebarColorHex || '#0E7490',
    workExperienceHeaderColorHex: resumeData.workExperienceHeaderColorHex,
    sectionLabelColorHex: resumeData.sectionLabelColorHex,
    borderStyle: resumeData.borderStyle || 'squircle',
    templatePreference: resumeData.templatePreference || 'default',
    templateCode: resumeData.templateCode || 'EN1',
    language: resumeData.language || 'en',
    workExperiences: resumeData.workExperiences?.map(exp => ({
      position: exp.position || '',
      company: exp.company || '',
      startDate: exp.startDate,
      endDate: exp.endDate,
      description: exp.description || ''
    })) || [],
    educations: resumeData.educations?.map(edu => ({
      degree: edu.degree || '',
      school: edu.institution || '',
      startDate: edu.startDate,
      endDate: edu.endDate
    })) || [],
    skills: resumeData.skills || [],
    userLanguages: resumeData.userLanguages || [],
    summary: resumeData.summary,
    photo: resumeData.photo
  };
};

// Resume component for printing
const PrintableResume = ({ data }: { data: ResumeData }) => {
  const resumeValues = convertToResumeValues(data);
  const [TemplateComponent, setTemplateComponent] = React.useState<React.ComponentType<{ resumeData: ResumeValues }> | null>(null);

  React.useEffect(() => {
    const loadTemplate = async () => {
      try {
        let component;
        switch (data.templateCode) {
          case 'EN1':
            component = (await import('@/components/ResumeTemplate1En')).default;
            break;
          case 'EN2':
            component = (await import('@/components/ResumeTemplate2En')).default;
            break;
          case 'EN3':
            component = (await import('@/components/ResumeTemplate3En')).default;
            break;
          case 'EN4':
            component = (await import('@/components/ResumeTemplate4En')).default;
            break;
          case 'AR1':
            component = (await import('@/components/ResumeTemplate1Ar')).default;
            break;
          case 'AR2':
            component = (await import('@/components/ResumeTemplate2Ar')).default;
            break;
          case 'AR3':
            component = (await import('@/components/ResumeTemplate3Ar')).default;
            break;
          case 'AR4':
            component = (await import('@/components/ResumeTemplate4Ar')).default;
            break;
          default:
            component = (await import('@/components/ResumeTemplate1En')).default;
        }
        setTemplateComponent(() => component);
      } catch (error) {
        console.error('Error loading template:', error);
        // Fallback to EN1
        const fallback = (await import('@/components/ResumeTemplate1En')).default;
        setTemplateComponent(() => fallback);
      }
    };

    loadTemplate();
  }, [data.templateCode]);

  if (!TemplateComponent) {
    return <div>Loading template...</div>;
  }

  return (
    <div className="print-container">
      <TemplateComponent resumeData={resumeValues} />
    </div>
  );
};

// Hook to use react-to-print
export const usePrintToPdf = (resumeData: ResumeData) => {
  const componentRef = useRef<HTMLDivElement>(null);
  
  const handlePrint = useReactToPrint({
      // @ts-expect-error: type definition is out of sync with actual API
      content: () => componentRef.current,
      documentTitle: `${resumeData.firstName}_${resumeData.lastName}_Resume`,
      onBeforeGetContent: () => {
        console.log('Preparing to print resume:', {
          resumeData,
        });
      },
      onAfterPrint: () => {
        console.log('Print completed!');
      },
      removeAfterPrint: true,
    });

  return {
    componentRef,
    handlePrint,
    PrintableResume: () => <PrintableResume data={resumeData} />
  };
};

// Direct print function
export const printResumeToPdf = async (resumeData: ResumeData): Promise<void> => {
  return new Promise(async (resolve, reject) => {
    try {
      // Create a temporary div to render the resume
      const tempDiv = document.createElement('div');
      tempDiv.style.position = 'absolute';
      tempDiv.style.left = '-9999px';
      tempDiv.style.top = '-9999px';
      document.body.appendChild(tempDiv);

      // Render the resume component
      const resumeValues = convertToResumeValues(resumeData);
      
      // Dynamically load the template component
      let TemplateComponent;
      try {
        switch (resumeData.templateCode) {
          case 'EN1':
            TemplateComponent = (await import('@/components/ResumeTemplate1En')).default;
            break;
          case 'EN2':
            TemplateComponent = (await import('@/components/ResumeTemplate2En')).default;
            break;
          case 'EN3':
            TemplateComponent = (await import('@/components/ResumeTemplate3En')).default;
            break;
          case 'EN4':
            TemplateComponent = (await import('@/components/ResumeTemplate4En')).default;
            break;
          case 'AR1':
            TemplateComponent = (await import('@/components/ResumeTemplate1Ar')).default;
            break;
          case 'AR2':
            TemplateComponent = (await import('@/components/ResumeTemplate2Ar')).default;
            break;
          case 'AR3':
            TemplateComponent = (await import('@/components/ResumeTemplate3Ar')).default;
            break;
          case 'AR4':
            TemplateComponent = (await import('@/components/ResumeTemplate4Ar')).default;
            break;
          default:
            TemplateComponent = (await import('@/components/ResumeTemplate1En')).default;
        }
      } catch (error) {
        console.error('Error loading template:', error);
        TemplateComponent = (await import('@/components/ResumeTemplate1En')).default;
      }

      const templateComponent = <TemplateComponent resumeData={resumeValues} />;

      // Use ReactDOM to render the component (React 18+ compatible)
      const ReactDOM = await import('react-dom/client');
      const root = ReactDOM.createRoot(tempDiv);
      root.render(templateComponent);

      // Wait for the component to render
      setTimeout(() => {
        try {
          // Trigger print
          window.print();
          
          // Clean up
          setTimeout(() => {
            root.unmount();
            document.body.removeChild(tempDiv);
            resolve();
          }, 1000);
        } catch (error) {
          root.unmount();
          document.body.removeChild(tempDiv);
          reject(error);
        }
      }, 100);
    } catch (error) {
      reject(error);
    }
  });
};