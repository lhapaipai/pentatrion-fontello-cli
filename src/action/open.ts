import { createReadStream, writeFileSync } from "node:fs";
import open from "open";

import FormData from "form-data";
import axios from "axios";
import { fontelloHost } from "~/constants";
import { dirname, resolve } from "node:path";

export async function openBrowser(configFile: string) {
  const fontelloDir = dirname(configFile);
  const idFile = resolve(fontelloDir, ".fontello");

  const payload = new FormData();
  payload.append("config", createReadStream(configFile));

  const res = await axios({
    method: "POST",
    url: fontelloHost,
    data: payload,
    headers: payload.getHeaders(),
  });
  const id = res.data;

  writeFileSync(idFile, id, { encoding: "utf-8" });

  const url = `${fontelloHost}/${id}`;

  open(url);
  console.log(
    `Your browser should open itself, otherwise you can open the following URL manually: ${url}`
  );
}
