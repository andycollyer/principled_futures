"use client";
import React from "react";

/**
 * Table — corporate data table. Pass columns + rows, or compose manually.
 */
export function Table({ columns = [], rows = [], dense = false, style = {}, renderCell, ...props }) {
  const pad = dense ? "8px 14px" : "12px 16px";
  return (
    <div style={{ overflowX: "auto", border: "1px solid var(--border-subtle)", borderRadius: "var(--radius-xl)", background: "var(--surface-card)", ...style }} {...props}>
      <table style={{ width: "100%", borderCollapse: "collapse", fontFamily: "var(--font-sans)" }}>
        <thead>
          <tr>
            {columns.map((col) => (
              <th
                key={col.key}
                style={{
                  textAlign: col.align || "left",
                  padding: pad,
                  fontSize: "var(--text-xs)",
                  fontWeight: "var(--weight-semibold)",
                  textTransform: "uppercase",
                  letterSpacing: "0.04em",
                  color: "var(--text-tertiary)",
                  background: "var(--surface-canvas)",
                  borderBottom: "1px solid var(--border-subtle)",
                  whiteSpace: "nowrap",
                  width: col.width,
                }}
              >
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, ri) => (
            <tr key={ri} style={{ borderBottom: ri < rows.length - 1 ? "1px solid var(--border-subtle)" : "none" }}>
              {columns.map((col) => (
                <td
                  key={col.key}
                  style={{
                    textAlign: col.align || "left",
                    padding: pad,
                    fontSize: "var(--text-base)",
                    color: "var(--text-primary)",
                    verticalAlign: "middle",
                  }}
                >
                  {renderCell ? renderCell(row, col) : row[col.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

