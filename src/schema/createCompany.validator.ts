import z from "zod";

export const CreateCompanySchema= z.object({
    name: z.string().min(1, "Please Provide a valid company name"),
    logoImage: z.file().refine((file) => file instanceof File, {
        message: "Logo is required and must be a file",
    }),
    // logo: z.string().min(1, "Logo is required"),
//     description: z.union([
//     z.literal(""),
//     z.string().min(2, "Please provide a valid description"),
//   ]),
    description: z.string().min(2, "Please provide a valid description") || "",
    website: z
        .union([
            z.string().url({ message: 'Website must be a valid URL of type: https://www.example.com' }),
        ]),
    company_size_id: z.number("Please select a company size"),
    industry_id: z.number("Please select an industry"),
})