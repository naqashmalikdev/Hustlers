import { z } from "zod";

export const contactSchema = z.object({
  name: z
    .string()
    .min(2, { message: "Name must be at least 2 characters." }),
  email: z
    .string()
    .email({ message: "Please enter a valid email address." }),
  phone: z
    .string()
    .optional()
    .refine(
      (val) => !val || /^(\+92|0)3[0-9]{9}$/.test(val.replace(/\s/g, "")),
      { message: "Please enter a valid Pakistani phone number." }
    ),
  branch: z
    .string()
    .min(1, { message: "Please select a branch." }),
  message: z
    .string()
    .min(10, { message: "Message must be at least 10 characters." })
    .max(500, { message: "Message must be at most 500 characters." }),
});

export type ContactFormValues = z.infer<typeof contactSchema>;
