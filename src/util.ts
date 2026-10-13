import axios from "axios";
import { fileTypeFromBuffer } from "file-type";

export async function downloadBuffer(url: string) {
  // with the Node http adapter, "arraybuffer" gives a Buffer
  const { data } = await axios.get<Buffer>(url, {
    responseType: "arraybuffer",
  });
  return data;
}

export async function getInlineContent(buf: Buffer) {
  const result = await fileTypeFromBuffer(buf);
  if (!result) {
    throw new Error("unable to find Mime Type of the font");
  }
  return `data:${result.mime};charset=utf-8;base64,${buf.toString("base64")}`;
}
