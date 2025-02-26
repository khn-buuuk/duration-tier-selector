
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { toast } from "sonner";
import { DurationType, validateNextTier, getAvailableUnits } from "@/utils/duration";
import { PlusCircle, Trash2 } from "lucide-react";

const TierSchema = z.object({
  tiers: z.array(z.object({
    duration: z.number().min(1, "Duration must be greater than 0"),
    unit: z.enum(["days", "months", "years"]),
    cost: z.number().min(0, "Cost must be non-negative"),
  }))
}).superRefine((data, ctx) => {
  for (let i = 0; i < data.tiers.length - 1; i++) {
    const current = data.tiers[i];
    const next = data.tiers[i + 1];
    if (!validateNextTier(current.duration, current.unit, next.duration, next.unit)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Each tier must have a longer duration than the previous tier",
        path: [`tiers.${i + 1}`]
      });
    }
  }
});

const DurationTierForm = () => {
  const form = useForm<z.infer<typeof TierSchema>>({
    resolver: zodResolver(TierSchema),
    defaultValues: {
      tiers: [{ duration: 7, unit: "days" as DurationType, cost: 20 }],
    },
    mode: "onChange"
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "tiers",
  });

  const onSubmit = (data: z.infer<typeof TierSchema>) => {
    if (form.formState.errors.tiers) {
      toast.error("Please fix the validation errors before saving");
      return;
    }
    console.log(data);
    toast.success("Tiers saved successfully!");
  };

  const onError = (errors: any) => {
    console.log('Form errors:', errors);
    toast.error("Please check the form for errors");
  };

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-8">
      <div className="space-y-2">
        <h2 className="text-2xl font-semibold tracking-tight">Duration Tiers</h2>
        <p className="text-muted-foreground">Configure duration tiers and their costs.</p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit, onError)} className="space-y-6">
          <div className="space-y-4">
            {fields.map((field, index) => {
              const prevUnit = index > 0 ? form.getValues(`tiers.${index - 1}.unit`) : undefined;
              const availableUnits = getAvailableUnits(prevUnit as DurationType);

              return (
                <div key={field.id} className="flex flex-col gap-4 p-4 rounded-lg border bg-card">
                  <div className="flex items-end gap-4">
                    <FormField
                      control={form.control}
                      name={`tiers.${index}.duration`}
                      render={({ field }) => (
                        <FormItem className="flex-1">
                          <FormLabel>Duration</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              {...field}
                              onChange={(e) => field.onChange(Number(e.target.value))}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name={`tiers.${index}.unit`}
                      render={({ field }) => (
                        <FormItem className="flex-1">
                          <FormLabel>Unit</FormLabel>
                          <Select onValueChange={field.onChange} value={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select unit" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {availableUnits.map((unit) => (
                                <SelectItem key={unit} value={unit}>
                                  {unit.charAt(0).toUpperCase() + unit.slice(1)}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name={`tiers.${index}.cost`}
                      render={({ field }) => (
                        <FormItem className="flex-1">
                          <FormLabel>Cost ($)</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              {...field}
                              onChange={(e) => field.onChange(Number(e.target.value))}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {index > 0 && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => remove(index)}
                        className="self-end"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                  {form.formState.errors.tiers?.[index] && (
                    <p className="text-sm font-medium text-destructive">
                      {form.formState.errors.tiers[index]?.message}
                    </p>
                  )}
                </div>
              );
            })}
          </div>

          <div className="flex justify-between">
            <Button
              type="button"
              variant="outline"
              onClick={() => append({ duration: 1, unit: "days", cost: 0 })}
              className="w-full sm:w-auto"
            >
              <PlusCircle className="mr-2 h-4 w-4" />
              Add Tier
            </Button>

            <Button type="submit" className="w-full sm:w-auto">
              Save Tiers
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default DurationTierForm;
