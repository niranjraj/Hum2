import { saveAs } from "file-saver";
import { ActiveOrder, Item } from "../types/order";
import {
  Document,
  Packer,
  Paragraph,
  Table,
  TableCell,
  TableRow,
  TextDirection,
  TextRun,
  VerticalAlign,
  WidthType,
} from "docx";
import moment from "moment";

const orderItem = (item: Item) => {
  return new TableRow({
    children: [
      new TableCell({
        children: [new Paragraph({ text: item.name })],
        width: {
          size: 1000,
          type: WidthType.DXA,
        },
      }),
      new TableCell({
        children: [new Paragraph({ text: `${item.quantity}` })],
        width: {
          size: 800,
          type: WidthType.DXA,
        },
      }),
      new TableCell({
        children: [new Paragraph({ text: item.unit })],
        width: {
          size: 800,
          type: WidthType.DXA,
        },
      }),
    ],
  });
};
const table = (item: ActiveOrder) => {
  return new TableRow({
    children: [
      new TableCell({
        children: [new Paragraph({ text: item.id.slice(-5) })],
        width: {
          size: 1000,
          type: WidthType.DXA,
        },
      }),
      new TableCell({
        children: [new Paragraph({ text: item.name })],
        width: {
          size: 3000,
          type: WidthType.DXA,
        },
      }),
      new TableCell({
        children: [new Paragraph({ text: item.store })],
        width: {
          size: 3000,
          type: WidthType.DXA,
        },
      }),
      new TableCell({
        children: [
          new Paragraph({
            text: moment(item.createdAt.split("T")[0], "YYYY-MM-DD").format(
              "DD MMM YYYY"
            ),
          }),
        ],
        width: {
          size: 3000,
          type: WidthType.DXA,
        },
      }),
      new TableCell({
        children: [
          new Table({
            columnWidths: [1505, 2005],
            rows: [
              new TableRow({
                children: [
                  new TableCell({
                    children: [new Paragraph({ text: "ItemName" })],
                    width: {
                      size: 1400,
                      type: WidthType.DXA,
                    },
                  }),
                  new TableCell({
                    children: [new Paragraph({ text: "Quantity" })],
                    width: {
                      size: 800,
                      type: WidthType.DXA,
                    },
                  }),
                  new TableCell({
                    children: [new Paragraph({ text: "Unit" })],
                    width: {
                      size: 1000,
                      type: WidthType.DXA,
                    },
                  }),
                ],
              }),
              ...item.orderItem.map((prod) => orderItem(prod)),
            ],
          }),
        ],
      }),
    ],
  });
};
export const createDoc = async (response: ActiveOrder[]) => {
  console.log(response);
  const doc = new Document({
    sections: [
      {
        properties: {},
        children: [
          new Paragraph({ text: "Hum", spacing: { after: 300, line: 276 } }),
          new Paragraph({
            text: `Date: ${moment(
              response[0].createdAt.split("T")[0],
              "YYYY-MM-DD"
            ).format("DD MMM YYYY")}`,
            spacing: { after: 300, line: 276 },
          }),
          new Table({
            columnWidths: [3505, 5505],
            rows: [
              new TableRow({
                children: [
                  new TableCell({
                    children: [new Paragraph({ text: "ID" })],
                    width: {
                      size: 3505,
                      type: WidthType.DXA,
                    },
                  }),
                  new TableCell({
                    children: [new Paragraph({ text: "Name" })],
                    width: {
                      size: 3505,
                      type: WidthType.DXA,
                    },
                  }),
                  new TableCell({
                    children: [new Paragraph({ text: "Store" })],
                    width: {
                      size: 700,
                      type: WidthType.DXA,
                    },
                  }),
                  new TableCell({
                    children: [
                      new Paragraph({ text: "Date" }),
                      new Paragraph({}),
                    ],
                    width: {
                      size: 700,
                      type: WidthType.DXA,
                    },
                  }),
                ],
              }),
              ...response.map((item) => table(item)),
            ],
          }),
        ],
      },
    ],
  });
  console.log("here");
  const mimeType =
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document";
  Packer.toBlob(doc).then((blob) => {
    const docblob = blob.slice(0, blob.size, mimeType);
    saveAs(docblob, "test.docx");
  });
};
