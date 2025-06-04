import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { EditorFormProps } from "@/lib/types";
import { cn } from "@/lib/utils";
import { workExperienceSchema, WorkExperienceValues } from "@/lib/validation";
import {
  closestCenter,
  DndContext,
  DragEndEvent,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { restrictToVerticalAxis } from "@dnd-kit/modifiers";
import {
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { zodResolver } from "@hookform/resolvers/zod";
import { GripHorizontal } from "lucide-react";
import { useEffect, useRef } from "react";
import { useFieldArray, useForm, UseFormReturn, useWatch } from "react-hook-form"; // Import useWatch
import GenerateWorkExperienceButton from "./GenerateWorkExperienceButton";

export default function WorkExperienceForm({
  resumeData,
  setResumeData,
}: EditorFormProps) {
  const form = useForm<WorkExperienceValues>({
    resolver: zodResolver(workExperienceSchema),
    defaultValues: {
      workExperiences: resumeData.workExperiences || [],
    },
    // Crucial: This ensures validation runs automatically on every change,
    // so you don't need to call form.trigger() manually inside the watch.
    mode: "onChange",
  });

  // 1. Use `useWatch` to subscribe to changes in the 'workExperiences' array.
  // This is highly optimized for performance with useFieldArray.
  const watchedWorkExperiences = useWatch({
    control: form.control,
    name: "workExperiences", // Specify the field array name
  });

  // 2. Get the current validity status of the form.
  const { isValid } = form.formState;

  // Use a ref to store the previous resume data to avoid infinite loops
  const prevResumeDataRef = useRef(resumeData.workExperiences);

  // 3. Effect to sync form array values to the parent's `resumeData`.
  // This effect will run whenever `watchedWorkExperiences` or `isValid` changes.
  useEffect(() => {
    // Only proceed if the form is currently valid and `watchedWorkExperiences` exist.
    if (isValid && watchedWorkExperiences) {
      // Filter out any undefined elements, which might occur during some operations,
      // though react-hook-form typically manages this well.
      const filteredWorkExperiences = watchedWorkExperiences.filter(
        (exp) => exp !== undefined && exp !== null // Ensure nulls are also filtered if they can occur
      );

      // Perform a deep comparison to avoid unnecessary state updates.
      // For arrays of objects, a simple `!==` check on the array itself won't tell you if contents changed.
      // `JSON.stringify` is a quick and dirty deep comparison for plain objects/arrays.
      // For more complex objects or better performance, consider a dedicated deep comparison utility.
      if (
        JSON.stringify(filteredWorkExperiences) !==
        JSON.stringify(prevResumeDataRef.current)
      ) {
        setResumeData((prevResumeData) => ({
          ...prevResumeData,
          workExperiences: filteredWorkExperiences, // Update with the new, valid array
        }));
        // Update the ref to the new value
        prevResumeDataRef.current = filteredWorkExperiences;
      }
    }
  }, [watchedWorkExperiences, isValid, setResumeData]);

  // 4. Effect to reset form default values if the parent's `resumeData` prop changes.
  // This is essential if `resumeData` can be updated from outside this component.
  useEffect(() => {
    // Compare current form values with the incoming `resumeData.workExperiences` to decide if a reset is needed.
    // This is more complex for arrays. We'll compare the stringified version for simplicity.
    const currentFormExperiences = form.getValues("workExperiences");
    if (
      JSON.stringify(currentFormExperiences) !==
      JSON.stringify(resumeData.workExperiences)
    ) {
      form.reset({
        workExperiences: resumeData.workExperiences || [],
      });
      // Update the ref when external data changes
      prevResumeDataRef.current = resumeData.workExperiences || [];
    }
  }, [resumeData.workExperiences, form]); // Depend on the specific array prop and form instance

  const { fields, append, remove, move } = useFieldArray({
    control: form.control,
    name: "workExperiences",
  });

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = fields.findIndex((field) => field.id === active.id);
      const newIndex = fields.findIndex((field) => field.id === over.id);
      // Directly call move from useFieldArray.
      // arrayMove(fields, oldIndex, newIndex) returns a new array,
      // but useFieldArray's `move` method handles the internal state update.
      move(oldIndex, newIndex);
    }
  }

  return (
    <div className="mx-auto max-w-xl space-y-6" dir="rtl">
      <div className="space-y-1.5 text-center">
        <h2 className="text-2xl font-semibold">الخبرات السابقة</h2>
        <p className="text-sm text-muted-foreground">
          قم باظافة كل الوظائف الي عملت بها في السابق
        </p>
      </div>
      <Form {...form}>
        <form className="space-y-3" dir="rtl">
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
            modifiers={[restrictToVerticalAxis]}
          >
            <SortableContext
              items={fields}
              strategy={verticalListSortingStrategy}
            >
              {fields.map((field, index) => (
                <WorkExperienceItem
                  id={field.id}
                  key={field.id}
                  index={index}
                  form={form}
                  remove={remove}
                />
              ))}
            </SortableContext>
          </DndContext>
          <div className="flex justify-center">
            <Button
              type="button"
              onClick={() =>
                append({
                  position: "",
                  company: "",
                  startDate: "",
                  endDate: "",
                  description: "",
                })
              }
            >
               وظيفة اخرى
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}

interface WorkExperienceItemProps {
  id: string;
  form: UseFormReturn<WorkExperienceValues>;
  index: number;
  remove: (index: number) => void;
}

function WorkExperienceItem({
  id,
  form,
  index,
  remove,
}: WorkExperienceItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  return (
    <div
      className={cn(
        "space-y-3 rounded-md border bg-background p-3",
        isDragging && "relative z-50 cursor-grab shadow-xl",
      )}
      ref={setNodeRef}
      style={{
        transform: CSS.Transform.toString(transform),
        transition,
      }}
    >
      <div className="flex justify-between gap-2">
        <span className="font-semibold">اخر وظيفة عملت بها</span>
        <GripHorizontal
          className="size-5 cursor-grab text-muted-foreground focus:outline-none"
          {...attributes}
          {...listeners}
        />
      </div>
      <div className="flex justify-center">
        <GenerateWorkExperienceButton
          onWorkExperienceGenerated={(exp) =>
            form.setValue(`workExperiences.${index}`, exp)
          }
        />
      </div>
      <FormField
        control={form.control}
        name={`workExperiences.${index}.position`}
        render={({ field }) => (
          <FormItem>
            <FormLabel>العنوان الوظيفي</FormLabel>
            <FormControl>
              <Input {...field} autoFocus />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name={`workExperiences.${index}.company`}
        render={({ field }) => (
          <FormItem>
            <FormLabel>اسم الشركة</FormLabel>
            <FormControl>
              <Input {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <div className="grid grid-cols-2 gap-3">
        <FormField
          control={form.control}
          name={`workExperiences.${index}.startDate`}
          render={({ field }) => (
            <FormItem>
              <FormLabel>من تأريخ</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  type="date"
                  value={field.value?.slice(0, 10)}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name={`workExperiences.${index}.endDate`}
          render={({ field }) => (
            <FormItem>
              <FormLabel>الى تأريخ</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  type="date"
                  value={field.value?.slice(0, 10)}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
      <FormDescription>
        قم بترك <span className="font-semibold">الى تأريخ</span> فارغ اذا مازلت تعمل هناك
      </FormDescription>
      <FormField
        control={form.control}
        name={`workExperiences.${index}.description`}
        render={({ field }) => (
          <FormItem>
            <FormLabel>اذكر المهام التي قمت بها</FormLabel>
            <FormControl>
              <Textarea {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <Button variant="destructive" type="button" onClick={() => remove(index)}>
        حذف
      </Button>
    </div>
  );
}