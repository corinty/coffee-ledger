import type { ZodSchema } from "zod";

export const extractFormData = async (
  request: Request,
  validator?: ZodSchema
) => {
  const data = formObject(await request.formData());
  return data;
};

export async function validateFormData<T>(
  request: Request,
  validator: ZodSchema<T>
): Promise<T> {
  const data = await extractFormData(request);
  return validator.parse(data);
}

const formObject = (formData: FormData) =>
  Object.fromEntries(formData.entries());
