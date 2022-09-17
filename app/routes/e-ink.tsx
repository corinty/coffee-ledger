
import styled from "@emotion/styled"
import { useLoaderData } from "@remix-run/react";
import { json } from "@remix-run/server-runtime";
import { format } from "date-fns"
import { getActiveBatch } from "~/models/batch.server";
const Container = styled("div")`
border: 1px solid black;
height: 122px;
width: 250px;
font-size: 25px;
padding: 10px;
font-weight: bold;
display: flex;
flex-direction: column;
justify-content: space-between;
`



type LoaderData = {
  activeBatch: Awaited<ReturnType<typeof getActiveBatch>>;
};

export const loader = async () => {
  const activeBatch = await getActiveBatch();


  return json<LoaderData>({ activeBatch });
};

export default function Eink() {
  const data = useLoaderData<LoaderData>()
  const { roast: { name }, roastDate } = data.activeBatch!
  return (
    <Container id="container">
      <div>EL SALVADOR HONEY PROCESS</div>
      <div
        style={{ fontSize: 15, fontWeight: "normal" }}>{format(new Date(roastDate!), "MM/dd/yy")}</div>
    </Container>
  )
}
