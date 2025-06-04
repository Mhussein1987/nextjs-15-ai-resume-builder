import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { EditorFormProps } from "@/lib/types";
import { cn } from "@/lib/utils";
import { educationSchema, EducationValues } from "@/lib/validation";
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
import { useEffect } from "react";
import { useFieldArray, useForm, UseFormReturn, useWatch } from "react-hook-form"; // Import useWatch

export default function EducationForm({
  resumeData,
  setResumeData,
}: EditorFormProps) {
  const form = useForm<EducationValues>({
    resolver: zodResolver(educationSchema),
    defaultValues: {
      educations: resumeData.educations || [],
    },
    // Crucial: This ensures validation runs automatically on every change,
    // so you don't need to call form.trigger() manually inside the watch.
    mode: "onChange",
  });

  // 1. Use `useWatch` to subscribe to changes in the 'educations' array.
  // This is highly optimized for performance with useFieldArray.
  const watchedEducations = useWatch({
    control: form.control,
    name: "educations", // Specify the field array name
  });

  // 2. Get the current validity status of the form.
  const { isValid } = form.formState;

  // 3. Effect to sync form array values to the parent's `resumeData`.
  // This effect will run whenever `watchedEducations` or `isValid` changes.
  useEffect(() => {
    // Only proceed if the form is currently valid and `watchedEducations` exist.
    if (isValid && watchedEducations) {
      // Filter out any undefined or null elements that might occur.
      const filteredEducations = watchedEducations.filter(
        (edu) => edu !== undefined && edu !== null
      );

      // Perform a deep comparison to avoid unnecessary state updates.
      // `JSON.stringify` is a simple way to compare arrays of objects.
      if (
        JSON.stringify(filteredEducations) !==
        JSON.stringify(resumeData.educations)
      ) {
        setResumeData((prevResumeData) => ({
          ...prevResumeData,
          educations: filteredEducations, // Update with the new, valid array
        }));
      }
    }
  }, [watchedEducations, isValid, setResumeData, resumeData.educations]); // Dependencies: watched array, validity, state setter, and current resumeData.educations for comparison.

  // 4. Effect to reset form default values if the parent's `resumeData` prop changes externally.
  // This is essential if `resumeData` can be updated from a source outside this component.
  useEffect(() => {
    // Compare current form values with the incoming `resumeData.educations` to decide if a reset is needed.
    const currentFormEducations = form.getValues("educations");
    if (
      JSON.stringify(currentFormEducations) !==
      JSON.stringify(resumeData.educations)
    ) {
      form.reset({
        educations: resumeData.educations || [],
      });
    }
  }, [resumeData.educations, form]); // Depend on the specific array prop and form instance

  const { fields, append, remove, move } = useFieldArray({
    control: form.control,
    name: "educations",
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
      // `arrayMove` returns a new array, but `useFieldArray`'s `move` method handles the internal state update.
      move(oldIndex, newIndex);
    }
  }

  return (
    <div className="mx-auto max-w-xl space-y-6" dir="rtl">
      <div className="space-y-1.5 text-center">
        <h2 className="text-2xl font-semibold">التحصيل الدراسي والشهادات الجامعية</h2>
        <p className="text-sm text-muted-foreground">
          قم بأظافة جميع الشهادات الجامعية
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
                <EducationItem
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
                  degree: "",
                  school: "",
                  startDate: "",
                  endDate: "",
                })
              }
            >
              قم بأظافة شهادة
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}

interface EducationItemProps {
  id: string;
  form: UseFormReturn<EducationValues>;
  index: number;
  remove: (index: number) => void;
}

function EducationItem({ id, form, index, remove }: EducationItemProps) {
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
      dir="rtl"
    >
      <div className="flex justify-between gap-2">
        <span className="font-semibold">الشهادة {String(index + 1).replace(/\d/g, d => "٠١٢٣٤٥٦٧٨٩"[Number(d)])}</span>
        <GripHorizontal
          className="size-5 cursor-grab text-muted-foreground focus:outline-none"
          {...attributes}
          {...listeners}
        />
      </div>
      <FormField
        control={form.control}
        name={`educations.${index}.degree`}
        render={({ field }) => (
          <FormItem>
            <FormLabel>التحصيل الدراسي</FormLabel>
            <FormControl>
              <Input {...field} autoFocus />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name={`educations.${index}.school`}
        render={({ field }) => (
          <FormItem>
            <FormLabel>اسم الجامعة او المدرسة ( يمكنك تركه فارغا)</FormLabel>
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
          name={`educations.${index}.startDate`}
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
          name={`educations.${index}.endDate`}
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
      <Button variant="destructive" type="button" onClick={() => remove(index)}>
        حذف
      </Button>
    </div>
  );
}