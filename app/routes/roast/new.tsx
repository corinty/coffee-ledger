import { json } from "@remix-run/server-runtime";
import { createRoast } from "~/models/roast.server";

export async function action({ request }: { request: Request }) {
  console.log("We hit the action ");
  try {
    const formData = await request.formData();

    const coffeeName = formData.get("coffeeName") as string;
    const roasterName = formData.get("roasterName") as string;

    if (!coffeeName) throw "Coffee Name Required";
    if (!roasterName) throw "Roaster Name Required";

    const roast = await createRoast({
      coffeeName,
      roasterName,
    });

    return json({ ok: true, roast });
  } catch (error: any) {
    return json({ error: error.message });
  }
}
