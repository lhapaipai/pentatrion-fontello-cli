import { createWriteStream, readFileSync } from "node:fs";
import axios from "axios";
import { fileTypeFromBuffer } from "file-type";

export function downloadFile(url: string, dstFile: string) {
  return new Promise((resolve, reject) => {
    axios({
      method: "GET",
      url,
      responseType: "stream",
    })
      .then((res) => {
        if (res.status !== 200) {
          // TODO reject trow error ?
          reject(new Error(`error get: ${url}: ${res.status}`));
        }

        const stream = createWriteStream(dstFile);
        stream.on("close", () => {
          resolve(true);
        });
        res.data.pipe(stream);
        res.data.on("end", () => {
          stream.close();
        });
      })
      .catch((err) => {
        reject(err);
      });
  });
}

export async function getInlineContent(path: string) {
  const buf = await readFileSync(path);
  const result = await fileTypeFromBuffer(buf);
  if (!result) {
    throw new Error(`unable to find Mime Type from ${path}`);
  }
  return `data:${result.mime};charset=utf-8;base64,${buf.toString("base64")}`;
}
