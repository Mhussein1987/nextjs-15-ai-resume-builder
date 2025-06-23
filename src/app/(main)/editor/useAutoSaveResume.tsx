"use client";

import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import useDebounce from "@/hooks/useDebounce";
import { fileReplacer } from "@/lib/utils";
import { ResumeValues } from "@/lib/validation";
import { useSearchParams } from "next/navigation";
import { useEffect, useState, useTransition } from "react";
import { saveResume } from "./actions";

export default function useAutoSaveResume(resumeData: ResumeValues) {
  const searchParams = useSearchParams();
  const { toast } = useToast();
  const debouncedResumeData = useDebounce(resumeData, 1500);
  const [resumeId, setResumeId] = useState(resumeData.id);
  const [lastSavedData, setLastSavedData] = useState(structuredClone(resumeData));
  const [isSaving, setIsSaving] = useState(false);
  const [isError, setIsError] = useState(false);
  const [saveAttempts, setSaveAttempts] = useState(0);
  const [, startTransition] = useTransition();

  useEffect(() => {
    if (resumeData.id && resumeData.id !== resumeId) {
      setResumeId(resumeData.id);
    }
  }, [resumeData.id, resumeId]);

  useEffect(() => {
    setIsError(false);
    setSaveAttempts(0);
  }, [debouncedResumeData]);

  useEffect(() => {
    async function save() {
      if (saveAttempts >= 3) {
        console.log('Too many save attempts, stopping autosave');
        return;
      }

      try {
        setIsSaving(true);
        setIsError(false);
        setSaveAttempts(prev => prev + 1);
        const newData = structuredClone(debouncedResumeData);
        
        startTransition(async () => {
          try {
            const updatedResume = await saveResume({
              ...newData,
              ...(JSON.stringify(lastSavedData.photo, fileReplacer) === JSON.stringify(newData.photo, fileReplacer) && { photo: undefined }),
              id: resumeId,
            });
            
            if (!updatedResume || !updatedResume.id) {
              throw new Error('Failed to save resume: Invalid response from server');
            }
            
            setResumeId(updatedResume.id);
            setLastSavedData(structuredClone(newData));
            setSaveAttempts(0);
            
            if (searchParams.get("resumeId") !== updatedResume.id) {
              const newSearchParams = new URLSearchParams(searchParams);
              newSearchParams.set("resumeId", updatedResume.id);
              window.history.replaceState(null, "", `?${newSearchParams.toString()}`);
            }
            
            setIsSaving(false);
            console.log('Autosave successful:', updatedResume.id);
          } catch (error) {
            handleSaveError(error);
          }
        });
      } catch (error) {
        handleSaveError(error);
      }
    }

    function handleSaveError(error: Error | unknown) {
      setIsError(true);
      setIsSaving(false);
      console.error("Autosave error:", error);
      
      if (saveAttempts < 2) {
        const { dismiss } = toast({
          variant: "destructive",
          description: (
            <div className="space-y-3">
              <p>Could not save changes.</p>
              <Button variant="secondary" onClick={() => { dismiss(); setSaveAttempts(0); save(); }}>Retry</Button>
            </div>
          ),
        });
      }
    }
    
    // Simplified and more permissive auto-save conditions
    const hasUnsavedChanges = JSON.stringify(debouncedResumeData, fileReplacer) !== JSON.stringify(lastSavedData, fileReplacer);
    
    // Check if we have any meaningful data to save
    const hasAnyData = debouncedResumeData && (
      debouncedResumeData.title || 
      debouncedResumeData.firstName || 
      debouncedResumeData.lastName || 
      debouncedResumeData.email || 
      debouncedResumeData.phone || 
      debouncedResumeData.jobTitle || 
      debouncedResumeData.summary || 
      debouncedResumeData.language ||
      debouncedResumeData.city ||
      debouncedResumeData.country ||
      debouncedResumeData.colorHex ||
      debouncedResumeData.sidebarColorHex ||
      debouncedResumeData.borderStyle ||
      debouncedResumeData.templatePreference ||
      (debouncedResumeData.workExperiences && debouncedResumeData.workExperiences.length > 0) || 
      (debouncedResumeData.educations && debouncedResumeData.educations.length > 0) || 
      (debouncedResumeData.skills && debouncedResumeData.skills.length > 0) || 
      (debouncedResumeData.userLanguages && debouncedResumeData.userLanguages.length > 0) ||
      debouncedResumeData.photo
    );

    if (hasUnsavedChanges && hasAnyData && !isSaving && !isError) {
      save();
    }
  }, [debouncedResumeData, lastSavedData, resumeId, saveAttempts, isSaving, isError, toast, searchParams]);

  return {
    isSaving,
    isError,
    hasUnsavedChanges: JSON.stringify(debouncedResumeData, fileReplacer) !== JSON.stringify(lastSavedData, fileReplacer),
    save: async () => {
      setSaveAttempts(0);
      setIsError(false);
      const newData = structuredClone(debouncedResumeData);
      try {
        setIsSaving(true);
        const updatedResume = await saveResume({
          ...newData,
          id: resumeId,
        });
        setResumeId(updatedResume.id);
        setLastSavedData(newData);
        setIsSaving(false);
        return updatedResume;
      } catch (error) {
        setIsError(true);
        setIsSaving(false);
        throw error;
      }
    },
  };
}