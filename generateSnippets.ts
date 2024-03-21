import jsonfile from "jsonfile";
import { Align, getMarkdownTable } from "markdown-table-ts";
type Node = {
  name: string;
  symbol: string;
  start?: string;
  type: "Node" | "SelfClosing";
  startNumber?: number;
  desc?: string;
};
type Attribute = {
  name: string;
  type: "Attribute";
  values: [string, string][] | [string, string, string][];
};

type na = Node | Attribute;
//todo: import all
const button: Node = {
  name: "Button",
  symbol: "b",
  type: "Node",
};
const stack: Node = {
  name: "Stack",
  symbol: "s",
  type: "Node",
};
const group: Node = {
  name: "Group",
  symbol: "g",
  type: "Node",
};
const text: Node = {
  name: "Text",
  symbol: "t",
  type: "Node",
};
const title: Node = {
  name: "Title",
  symbol: "title",
  type: "Node",
};
const titleHeading: Attribute = {
  name: "order",
  type: "Attribute",
  values: [
    ["one", "{1}"],
    ["two", "{2}"],
    ["three", "{3}"],
    ["four", "{4}"],
    ["five", "{5}"],
    ["six", "{6}"],
  ],
};
const tAlign: Attribute = {
  name: "ta",
  type: "Attribute",
  values: [
    ["c", "center"],
    ["l", "left"],
    ["r", "right"],
  ],
};
const simpleGrid: Node = {
  name: "SimpleGrid",
  symbol: "sg",
  type: "Node",
};
const cols: Attribute = {
  name: "cols",
  type: "Attribute",
  values: [
    ["two", "{2}", "2 col"],
    ["three", "{3}", "3 col"],
    ["four", "{4}", "4 col"],
  ],
};
const variants: Attribute = {
  name: "variant",
  type: "Attribute",
  values: [
    ["d", "default"],
    ["f", "filled"],
    ["t", "transparent"],
    ["l", "light"]
  ],
};


const size: Attribute = {
  name: "size",
  type: "Attribute",
  values: [
    ["xsmall", "xs"],
    ["small", "sm"],
    ["medium", "md"],
    ["large", "lg"],
    ["xlarge", "xl"],
  ],
};
const card: Node = {
  type: "Node",
  name: "Card",
  start: `<Card withBorder `,
  symbol: "c",
};
const center: Node = {
  type: "Node",
  name: "Center",
  start: "<Center h=$1 ",
  startNumber : 2,
  symbol: "ce",
};
const tooltip: Node = {
  type: "Node",
  name: "Tooltip",
  start: '<Tooltip label="$1" ',
  startNumber: 2,
  symbol: "tt",
};
const divider: Node = {
  type: "SelfClosing",
  name: "Divider",
  symbol: "d",
};
const dividerLabel: Node = {
  type: "SelfClosing",
  name: "Divider",
  start: `<Divider label="$1" `,
  startNumber: 2,
  symbol: "dl",
  desc: "divider label",
};
const textInput: Node = {
  type: "SelfClosing",
  name: "TextInput",
  start: `<TextInput label="$1" `,
  startNumber: 2,
  symbol: "ti",
};
const numberInput: Node = {
  type: "SelfClosing",
  name: "NumberInput",
  start: `<NumberInput label="$1" `,
  startNumber: 2,
  symbol: "ni",
};
const textArea: Node = {
  type: "SelfClosing",
  name: "Textarea",
  start: `<Textarea label="$1" minRows="{$2}" maxRows="{$3}" `,
  startNumber: 4,
  symbol: "ta",
};
const passwordInput: Node = {
  type: "SelfClosing",
  name: "PasswordInput",
  start: '<PasswordInput label="${1:Password}"',
  startNumber: 2,
  symbol: "pi",
};
const checkbox: Node = {
  type: "SelfClosing",
  name: "Checkbox",
  start: `<Checkbox label="$1" `,
  startNumber: 2,
  symbol: "cb",
};
const switchNode: Node = {
  type: "SelfClosing",
  name: "Switch",
  start: `<Switch onLabel="$1" offLabel="$2"   `,
  startNumber: 3,
  symbol: "sw",
};
const combine = (arr: [Node, ...Attribute[]]) => {
  const [ele, ...att] = arr;
  const s = ele.start || `<${ele.name} `;
  const placeholderNumber = ele.startNumber || 1;
  // let l = [[ele.symbol, s, ele.desc]];
  let arrAll = [[ele.symbol, s, ele.desc || ele.name]];
  att.forEach((att) => {
    const arr: [string, string, string][] = [];
    att.values.forEach((av) => {
      arrAll.forEach((a) => {
        arr.push([
          a[0] + av[0],
          a[1] + `${att.name}=${av[1].startsWith("{") ? av[1] : `"${av[1]}"`} `,
          a[2] + ` ${av[2] || av[1]}`,
        ]);
      });
    });
    arrAll = arr;
  });
  const e =
    ele.type === "Node"
      ? `>$${placeholderNumber}</${ele.name}>`
      : `/>\n$${placeholderNumber}`;

  arrAll.forEach((ele) => {
    ele[1] += e;
  });
  return arrAll;
};
const buttonCombinations = [
  [button],
  [button, variants],
  [button, size],
  [button, variants, size],
];
const textCombinatons = [
  [text],
  [text, tAlign],
  [text, tAlign, size],
  [text, size],
];
const titleCombinations = [
  [title],
  [title, tAlign],
  [title, titleHeading],
  [title, tAlign, titleHeading],
];
const all = [
  ...buttonCombinations,
  ...textCombinatons,
  ...titleCombinations,
  [textInput],
  [textArea],
  [passwordInput],
  [checkbox],
  [numberInput],
  [stack],
  [simpleGrid, cols],
  [group],
  [card],
  [center],
  [divider],
  [dividerLabel],
  [tooltip],
  [switchNode],
  [switchNode, size]
];
const final = [
  ["sb", '<Group justify="space-between">$1</Group>', "space between"],
  ["gr", '<Group justify="flex-end">$1</Group>', "group right"],
  ["gc", '<Group justify="center">$1</Group>', "group center"],
  ["sc", "<$1 />", "self closing"],
  ["frag", "<>$1</>", "fragment"],
  ["oc", "onChange={()=> $1}", "onChange"],
  ["ki", "key={index}", "keyindex"],
  [
    "gradient",
    'variant="gradient" gradient={{ from: "$1", to: "$2", deg: $3 }}', "gradient"
  ],
  [
    "ia",
    "import {Anchor,Button,Card,Center,Checkbox,Container,Divider,Group,Image,PasswordInput,Select,SimpleGrid,Stack,Switch,Text,TextInput,Title,  } from '@mantine/core'", "import all"
  ],
  ['cbg', ' <Checkbox.Group label="$1">$2</Checkbox.Group>$3', "Checkbox Group"],
  ['r', '<Radio label="$1" />$2', "radio"],
  ['rg', '<Radio.Group label="$1">$2</Radio.Group> ', "Radio Group"],
  ['select', '<Select label="$1" placeholder="$2" data={[$3]}/>$4', "select"],
  ['cs', ' <Card.Section>$1</Card.Section>', "card section"],
  ['i', '<Image  src="$1"/>', "image"],
  ['ls', 'leftSection={$1}', "left section"],
  ['rs', 'rightSection={$1}', "right section"],
  ['copy', '<CopyButton value={$1}>{({ copied, copy }) => (<Button color={copied ? "teal" : "blue"} onClick={copy}>      {copied ? "Copied url" : "Copy url"} </Button>  )}</CopyButton>', "copy"]
]

const mt: any[] = []
all.forEach((ele) => { final.push(...combine(ele)); });
const snippets = {};
final.forEach((item,index) => {
  mt.push([(index+1).toString(),item[0], item[2], `\`${item[1]}\``.replace("\n", "")])
  snippets[item[2]] = {
    "scope": "javascriptreact,typescriptreact", prefix: item[0], body: [item[1]],
  };
});

// console.log(snippets);
// console.log({ "total genenrated": final.length });
let markdownText = `# Mantine Snippets Pro
- [Mantine](https://mantine.dev) is a popular react component library.
- This extension adds 120+ snippets to make building ui with Mantine superfast.

## Snippets

`
markdownText += getMarkdownTable({
  table: {
    head: ['Number','Prefix', 'Description','Code'],
    body: mt,
  },
  alignment: [Align.Left, Align.Left,Align.Left],
})
console.log(markdownText)
jsonfile.writeFile("snippets/global.code-snippets", snippets);
