import React from "react";

const colors: Record<string, string> = {
  string: "text-fg-table-pink", // Strings
  number: "text-fg-table-orange", // Numbers
  boolean: "text-fg-table-green", // Booleans
  null: "text-fg-table-navy", // Null
  key: "text-fg-white", // Keys
};

function SyntaxHighlight({ value }: { value: any }) {
  if (typeof value === "string") {
    return <span className={colors.string}>"{value}"</span>;
  }
  if (typeof value === "number") {
    return <span className={colors.number}>{value}</span>;
  }
  if (typeof value === "boolean") {
    return <span className={colors.boolean}>{String(value)}</span>;
  }
  if (value === null) {
    return <span className={colors.null}>null</span>;
  }
  if (Array.isArray(value)) {
    return (
      <span>
        [
        {value.map((v, i) => (
          <span key={i}>
            <SyntaxHighlight value={v} />
            {i < value.length - 1 ? ", " : ""}
          </span>
        ))}
        ]
      </span>
    );
  }
  if (typeof value === "object") {
    const entries = Object.entries(value);
    return (
      <>
        {"{"}
        {entries.map(([k, v], i) => (
          <div key={k} className="pl-4">
            <span className={colors.key}>"{k}"</span>:{" "}
            <SyntaxHighlight value={v} />
            {i < entries.length - 1 ? "," : ""}
            <span>{"  "}</span>
          </div>
        ))}
        {"}"}
      </>
    );
  }
  return <span>{String(value)}</span>;
}

export default function PrettyJSON({ data }: { data: any }) {
  return (
    <pre className="small-horizontal-scroll-bar mb-4 w-full max-w-full cursor-text overflow-x-auto rounded-xl bg-fg-tone-black-7 p-4 font-B612Mono text-base text-fg-white">
      <SyntaxHighlight value={data} />
    </pre>
  );
}
