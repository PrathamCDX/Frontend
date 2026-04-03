import z from "zod";

export const CreateCompanySchema = z.object({
  name: z.string().min(1, "Please Provide a valid company name"),
  logoImage: z
    .instanceof(File, { error: "Logo is required" })
    .refine(
      (file) => ["image/png", "image/jpeg", "image/jpg"].includes(file.type),
      { error: "Logo must be a PNG, JPG or JPEG image" },
    ),
  description: z.string().min(2, "Please provide a valid description"),
  website: z.url({
    error: "Website must be a valid URL of type: https://www.example.com",
  }),
  company_size_id: z.number("Please select a company size"),
  industry_id: z.number("Please select an industry"),
});

export type CreateCompanyFormData = z.infer<typeof CreateCompanySchema>;
